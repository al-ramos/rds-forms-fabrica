// Extrai mensagem de um valor capturado em catch. O tipo de `catch` e `unknown`
// por definicao — o `catch (e: any)` que existia em seis arquivos desligava a
// verificacao e permitia `e.message` em valores que podem nao ser Error.
export function mensagemDeErro(e: unknown, padrao: string): string {
    if (e instanceof Error && e.message) return e.message;
    if (typeof e === "string" && e) return e;
    return padrao;
}
