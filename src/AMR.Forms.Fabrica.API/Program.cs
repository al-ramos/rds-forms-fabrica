using AMR.Forms.Fabrica.API.Middleware;
using AMR.Forms.Fabrica.API.Services;
using AMR.Forms.Fabrica.Domain.Entities;
using AMR.Forms.Fabrica.Domain.Interfaces;
using AMR.Forms.Fabrica.Infrastructure.ExternalServices;
using AMR.Forms.Fabrica.Application;
using AMR.Forms.Fabrica.Infrastructure;
using AMR.Forms.Fabrica.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// ── Serilog como provider de log ──────────────────────────────────────────────
builder.Host.UseSerilog((ctx, cfg) => cfg
    .ReadFrom.Configuration(ctx.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "AMR.Forms.Fabrica.API")
    .WriteTo.Console(
        outputTemplate: ctx.HostingEnvironment.IsProduction()
            ? "[{Timestamp:o} {Level:u3}] {SourceContext}: {Message:lj} {Properties:j}{NewLine}{Exception}"
            : "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext}: {Message:lj}{NewLine}{Exception}"));

// ── Rate Limiting — 100 req/min por IP ────────────────────────────────────────
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.GlobalLimiter = System.Threading.RateLimiting.PartitionedRateLimiter.Create<HttpContext, string>(ctx =>
        System.Threading.RateLimiting.RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new System.Threading.RateLimiting.FixedWindowRateLimiterOptions
            {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = System.Threading.RateLimiting.QueueProcessingOrder.OldestFirst,
                QueueLimit = 0,
            }));
    options.OnRejected = async (ctx, ct) =>
    {
        ctx.HttpContext.Response.Headers.RetryAfter = "60";
        await ctx.HttpContext.Response.WriteAsync("Too many requests. Retry after 60 seconds.", ct);
    };
});

// ── Serviços ──────────────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "AMR Forms Fábrica API", Version = "v1" });
});

// Clean Architecture layers
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// ── CORS ──────────────────────────────────────────────────────────────────────
// As origens vem de Cors:AllowedOrigins, aceito como string unica ou array.
// Nenhuma origem fica fixada no codigo: em producao a origem e injetada por
// variavel de ambiente (Cors__AllowedOrigins). Sem origem configurada a
// politica nao libera nenhuma — o fallback antigo WithOrigins("*") era tratado
// pelo ASP.NET Core como a origem literal "*" e nunca liberou nada de fato.
var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? (builder.Configuration["Cors:AllowedOrigins"] is { Length: > 0 } origemUnica
        ? new[] { origemUnica }
        : Array.Empty<string>());

builder.Services.AddCors(opts =>
    opts.AddPolicy("AllowReact", policy =>
    {
        if (corsOrigins.Length > 0)
            policy.WithOrigins(corsOrigins).AllowAnyMethod().AllowAnyHeader();
    }));

builder.Services.AddHttpClient<IErpHttpClient, ErpHttpClient>(client =>
{
    client.BaseAddress = UrlDoServico(builder.Configuration, builder.Environment, "ErpCore:BaseUrl", "http://localhost:5000");
    client.Timeout = TimeSpan.FromSeconds(30);
});

builder.Services.AddHttpClient<IFinanceiroHttpClient, FinanceiroHttpClient>(client =>
{
    client.BaseAddress = UrlDoServico(builder.Configuration, builder.Environment, "Financeiro:BaseUrl", "http://localhost:5015");
    client.Timeout = TimeSpan.FromSeconds(15);
});

builder.Services.AddHostedService<SincronizacaoPedidosService>();

var app = builder.Build();

// ── Auto Migration + Seed (SQLite) ───────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<RdsDbContext>();
    db.Database.Migrate();

    // Seed de filiais padrão se a tabela estiver vazia
    if (!db.Filiais.Any())
    {
        db.Filiais.AddRange(
            new Filial(1, "Filial 01 — Matriz",    null, null),
            new Filial(2, "Filial 02 — Fábrica",   null, null),
            new Filial(3, "Filial 03 — Depósito",  null, null)
        );
        db.SaveChanges();
        app.Logger.LogInformation("Seed: 3 filiais padrão criadas.");
    }
}

// ── Pipeline ──────────────────────────────────────────────────────────────────
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Redirect raiz para Swagger em dev (facilita preview e testes locais)
if (app.Environment.IsDevelopment())
    app.MapGet("/", () => Results.Redirect("/swagger/index.html")).ExcludeFromDescription();

// ── Serilog request logging ───────────────────────────────────────────────────
app.UseSerilogRequestLogging(opts =>
{
    opts.MessageTemplate = "HTTP {RequestMethod} {RequestPath} → {StatusCode} ({Elapsed:0.000}ms)";
});

// ── Security Headers (OWASP) ──────────────────────────────────────────────────
app.Use(async (ctx, next) =>
{
    ctx.Response.Headers["X-Content-Type-Options"]  = "nosniff";
    ctx.Response.Headers["X-Frame-Options"]         = "DENY";
    ctx.Response.Headers["X-XSS-Protection"]        = "1; mode=block";
    ctx.Response.Headers["Referrer-Policy"]         = "strict-origin-when-cross-origin";
    ctx.Response.Headers["Permissions-Policy"]      = "geolocation=(), microphone=(), camera=()";
    if (!ctx.Request.IsHttps && app.Environment.IsProduction())
        ctx.Response.Headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
    await next();
});

app.UseCors("AllowReact");
app.UseRateLimiter();
app.UseAuthorization();
// Health checks — o target group do ALB precisa de um caminho que responda sem
// depender de nada. /health e liveness pura (o processo subiu); /health/ready
// verifica o banco, que e a unica dependencia externa da API hoje.
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }))
   .ExcludeFromDescription();

app.MapGet("/health/ready", async (IServiceProvider sp, CancellationToken ct) =>
{
    try
    {
        using var scope = sp.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<RdsDbContext>();
        await db.Database.CanConnectAsync(ct);
        return Results.Ok(new { status = "ready" });
    }
    catch (Exception ex)
    {
        return Results.Json(new { status = "degraded", detail = ex.Message }, statusCode: 503);
    }
}).ExcludeFromDescription();

app.MapControllers();

app.Run();

// Resolve a URL de um servico integrado. Fora de Development a URL tem de vir da
// configuracao: um default de localhost em container significa integracao que
// falha silenciosamente em runtime, e nao no boot, onde da para ver.
static Uri UrlDoServico(IConfiguration cfg, IHostEnvironment env, string chave, string urlDeDesenvolvimento)
{
    var valor = cfg[chave];
    if (!string.IsNullOrWhiteSpace(valor))
        return new Uri(valor);

    if (env.IsDevelopment())
        return new Uri(urlDeDesenvolvimento);

    throw new InvalidOperationException(
        $"Configuracao obrigatoria ausente: '{chave}'. " +
        $"Defina a variavel de ambiente '{chave.Replace(":", "__")}' com a URL do servico.");
}
