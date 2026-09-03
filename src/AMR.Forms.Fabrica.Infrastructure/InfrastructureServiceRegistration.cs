using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AMR.Forms.Fabrica.Domain.Interfaces;
using AMR.Forms.Fabrica.Infrastructure.Data;
using AMR.Forms.Fabrica.Infrastructure.Repositories;

namespace AMR.Forms.Fabrica.Infrastructure;

public static class InfrastructureServiceRegistration
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<RdsDbContext>(options =>
            options.UseSqlite(
                configuration.GetConnectionString("AmrFormasFabrica") ?? "Data Source=amr_fabrica.db"
            )
        );

        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<RdsDbContext>());
        services.AddScoped<IFichaRepository, FichaRepository>();
        services.AddScoped<IFilialRepository, FilialRepository>();
        services.AddScoped<ITipoOperacaoRepository, TipoOperacaoRepository>();
        services.AddScoped<IProdutoRepository, ProdutoRepository>();
        services.AddScoped<IPedidoRepository, PedidoRepository>();
        services.AddScoped<INotaFiscalRepository, NotaFiscalRepository>();
        services.AddScoped<IVeiculoRepository, VeiculoRepository>();
        services.AddScoped<IFichaBalancaRepository, FichaBalancaRepository>();
        services.AddScoped<IFichaLoadDetalheRepository, FichaLoadDetalheRepository>();
        services.AddScoped<ILogSistemaRepository, LogSistemaRepository>();
        services.AddScoped<IDepartamentoRepository, DepartamentoRepository>();
        services.AddScoped<IBusinessUnitRepository, BusinessUnitRepository>();
        services.AddScoped<INotaFiscalDetalheRepository, NotaFiscalDetalheRepository>();
        services.AddScoped<IBomRepository, BomRepository>();
        services.AddScoped<IProdutoBomRepository, ProdutoBomRepository>();
        services.AddScoped<IOrdemProducaoRepository, OrdemProducaoRepository>();
        services.AddScoped<IRastreabilidadeRepository, RastreabilidadeRepository>();
        services.AddScoped<IEquipamentoRepository, EquipamentoRepository>();
        services.AddScoped<IRegistroOeeRepository, RegistroOeeRepository>();
        services.AddScoped<IPlanoManutencaoRepository, PlanoManutencaoRepository>();
        services.AddScoped<IOrdemManutencaoRepository, OrdemManutencaoRepository>();

        return services;
    }
}
