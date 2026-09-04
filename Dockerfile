FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY src/AMR.Forms.Fabrica.Domain/AMR.Forms.Fabrica.Domain.csproj src/AMR.Forms.Fabrica.Domain/
COPY src/AMR.Forms.Fabrica.Application/AMR.Forms.Fabrica.Application.csproj src/AMR.Forms.Fabrica.Application/
COPY src/AMR.Forms.Fabrica.Infrastructure/AMR.Forms.Fabrica.Infrastructure.csproj src/AMR.Forms.Fabrica.Infrastructure/
COPY src/AMR.Forms.Fabrica.API/AMR.Forms.Fabrica.API.csproj src/AMR.Forms.Fabrica.API/

RUN dotnet restore src/AMR.Forms.Fabrica.API/AMR.Forms.Fabrica.API.csproj

COPY src/ src/
RUN dotnet publish src/AMR.Forms.Fabrica.API/AMR.Forms.Fabrica.API.csproj \
    -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# A imagem nao carrega mais banco nenhum. Antes ela copiava um rds_fabrica.db
# versionado e rodava seed.sql por cima, assando veiculos, produtos, fichas e
# notas fiscais ficticios dentro da imagem de producao (SEED-01). O arquivo
# tambem deixou de existir no repositorio, o que quebrava este build.
#
# O banco agora nasce vazio no volume e a propria API aplica as migrations no
# boot. seed.sql continua no repositorio como conveniencia de desenvolvimento,
# para ser aplicado a mao quando se quiser uma base povoada.
RUN mkdir -p /app/data

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "AMR.Forms.Fabrica.API.dll"]
