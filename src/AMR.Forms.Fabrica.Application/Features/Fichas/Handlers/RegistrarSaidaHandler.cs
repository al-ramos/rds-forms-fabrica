using MediatR;
using AMR.Forms.Fabrica.Application.Features.Fichas.Commands;
using AMR.Forms.Fabrica.Domain.Entities;
using AMR.Forms.Fabrica.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace AMR.Forms.Fabrica.Application.Features.Fichas.Handlers;

public class RegistrarSaidaHandler(
    IFichaRepository repo,
    IUnitOfWork uow,
    ILogger<RegistrarSaidaHandler> logger)
    : IRequestHandler<RegistrarSaidaCommand>
{
    public async Task Handle(RegistrarSaidaCommand request, CancellationToken ct)
    {
        var ficha = await repo.ObterPorIdAsync(request.FichaId)
            ?? throw new KeyNotFoundException($"Ficha {request.FichaId} não encontrada.");

        ficha.Finalizar();
        await repo.AtualizarAsync(ficha);
        await uow.SaveChangesAsync(ct);

        logger.LogWarning(
            "Ficha {Codigo}: criação automática de ContaPagar bloqueada. " +
            "O fluxo não possui tarifa/preço nem condição de pagamento e não pode converter peso em valor financeiro.",
            ficha.Codigo);
    }
}
