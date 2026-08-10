using AMR.Forms.Fabrica.Application.Features.Fichas.Commands;
using AMR.Forms.Fabrica.Application.Features.Fichas.Handlers;
using AMR.Forms.Fabrica.Domain.Entities;
using AMR.Forms.Fabrica.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using Moq;

namespace AMR.Forms.Fabrica.Tests.Features.Fichas;

public class RegistrarSaidaHandlerTests
{
    [Fact]
    public async Task Handle_FinalizaFichaEPersisteSemDependenciaFinanceira()
    {
        var ficha = new Ficha(
            codigo: 1,
            codigoFilial: 1,
            placaVeiculo: "ABC-1234",
            codigoBusinessUnit: null,
            codigoTipoOperacao: null,
            nomeMotorista: null,
            dataFicha: DateOnly.FromDateTime(DateTime.Today));

        var repo = new Mock<IFichaRepository>();
        repo.Setup(r => r.ObterPorIdAsync(1)).ReturnsAsync(ficha);

        var uow = new Mock<IUnitOfWork>();
        var logger = new Mock<ILogger<RegistrarSaidaHandler>>();
        var handler = new RegistrarSaidaHandler(repo.Object, uow.Object, logger.Object);

        await handler.Handle(new RegistrarSaidaCommand(1), CancellationToken.None);

        Assert.True(ficha.EstaFinalizada);
        repo.Verify(r => r.AtualizarAsync(ficha), Times.Once);
        uow.Verify(u => u.SaveChangesAsync(CancellationToken.None), Times.Once);
    }
}
