import { useState, useEffect, useCallback } from "react";
import { API, type Ficha, type FichaAPI } from "./types";
import { mensagemDeErro } from "./erros";

function mapFicha(f: FichaAPI): Ficha {
    const noTipoOp =
        { 1: "Carga", 2: "Descarga", 3: "Transferência" }[f.codigoTipoOperacao as 1 | 2 | 3]
        ?? `Op. ${f.codigoTipoOperacao}`;

    const noPasso =
        { 1: "Entrada", 2: "Pesagem", 3: "Carregamento", 4: "Saída" }[f.codigoPassoAtual as 1 | 2 | 3 | 4]
        ?? `Passo ${f.codigoPassoAtual}`;

    const status: Ficha["status"] =
        f.estaFinalizada ? "concluida"
            : f.codigoPassoAtual === 0 ? "aguardando"
                : "em_andamento";

    return {
        cdFicha: f.codigo,
        noFilial: f.noFilial ?? `Filial ${f.codigoFilial}`,
        dtFicha: f.dataFicha ?? "",
        noTipoOp,
        noPasso,
        placa: f.placaVeiculo ?? "—",
        status,
    };
}

export function useFichas() {
    const [fichas, setFichas] = useState<Ficha[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API}/api/Ficha`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: FichaAPI[] = await res.json();
            const seen = new Set<number>();
            setFichas(
                data
                    .filter(f => { if (seen.has(f.codigo)) return false; seen.add(f.codigo); return true; })
                    .map(mapFicha)
            );
        } catch (e) {
            setError(mensagemDeErro(e, "Erro ao carregar fichas"));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    return { fichas, loading, error, reload: load };
}