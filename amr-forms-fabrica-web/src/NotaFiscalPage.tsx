import { useState, useEffect, useMemo } from "react";
import { API, icons, type NotaFiscalAPI, type ItemNotaFiscalAPI } from "./types";
import { Icon, Spinner, ErrorBox } from "./ui";
import { mensagemDeErro } from "./erros";

const thStyle: React.CSSProperties = {
    padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#6B7280",
    textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "left",
    borderBottom: "1px solid #1F2937", background: "#0D1117",
};
const tdStyle: React.CSSProperties = {
    padding: "12px 16px", fontSize: 13, color: "#D1D5DB", whiteSpace: "nowrap",
};

function StatusNF({ cancelado }: { cancelado: number | null }) {
    const cancelada = cancelado === 1;
    return (
        <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 12,
            background: cancelada ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)",
            color: cancelada ? "#EF4444" : "#10B981",
        }}>
            {cancelada ? "CANCELADA" : "ATIVA"}
        </span>
    );
}

function AmbienteBadge({ ambiente }: { ambiente: string | null }) {
    if (!ambiente) return <span style={{ color: "#4B5563", fontSize: 12 }}>—</span>;
    const prod = ambiente === "1";
    return (
        <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 12,
            background: prod ? "rgba(59,130,246,0.12)" : "rgba(245,158,11,0.12)",
            color: prod ? "#3B82F6" : "#F59E0B",
        }}>
            {prod ? "PRODUÇÃO" : "HOMOLOG"}
        </span>
    );
}

function DetalheNF({ nf, onClose }: { nf: NotaFiscalAPI; onClose: () => void }) {
    const [itens, setItens] = useState<ItemNotaFiscalAPI[]>([]);
    const [loadingItens, setLoadingItens] = useState(true);

    useEffect(() => {
        setLoadingItens(true);
        fetch(`${API}/api/NotaFiscal/${nf.numero}/${nf.serieNotaFiscal}/itens`)
            .then(r => r.json())
            .then(setItens)
            .catch(() => setItens([]))
            .finally(() => setLoadingItens(false));
    }, [nf.numero, nf.serieNotaFiscal]);

    return (
        <div style={{
            marginTop: 20, background: "#111827",
            border: "1px solid #3B82F640", borderRadius: 8, padding: 24,
        }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#F9FAFB" }}>
                    NF <span style={{ color: "#3B82F6", fontFamily: "'DM Mono', monospace" }}>
                        {nf.numero} / {nf.serieNotaFiscal}
                    </span>
                </div>
                <button onClick={onClose} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>

            {/* Dados da NF */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
                {([
                    ["Filial", nf.nomeFilial ?? `Filial ${nf.codigoFilial}`],
                    ["Cliente", nf.nomeCliente ?? "—"],
                    ["CNPJ", nf.cnpjCliente ?? "—"],
                    ["Data Emissão", nf.dataEmissao ? new Date(nf.dataEmissao).toLocaleDateString("pt-BR") : "—"],
                    ["Ficha Vinculada", nf.codigoFicha ? `#${String(nf.codigoFicha).padStart(4, "0")}` : "—"],
                    ["Valor Total", nf.valorTransmissao != null ? `R$ ${nf.valorTransmissao.toFixed(2)}` : "—"],
                ] as [string, string][]).map(([k, v]) => (
                    <div key={k}>
                        <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{k}</div>
                        <div style={{ fontSize: 13, color: "#D1D5DB", fontWeight: 500 }}>{v}</div>
                    </div>
                ))}
            </div>

            {/* Chave e Protocolo */}
            {nf.chaveNfe && (
                <div style={{ background: "#0D1117", borderRadius: 6, padding: "10px 14px", border: "1px solid #1F2937", marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Chave NF-e</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#3B82F6", wordBreak: "break-all" }}>{nf.chaveNfe}</div>
                </div>
            )}
            {nf.protocolo && (
                <div style={{ background: "#0D1117", borderRadius: 6, padding: "10px 14px", border: "1px solid #1F2937", marginBottom: 20 }}>
                    <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Protocolo</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#D1D5DB" }}>{nf.protocolo}</div>
                </div>
            )}

            {/* Itens da NF */}
            <div>
                <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                    Itens da Nota Fiscal
                </div>

                {loadingItens ? (
                    <div style={{ color: "#6B7280", fontSize: 13, padding: "12px 0" }}>Carregando itens...</div>
                ) : itens.length === 0 ? (
                    <div style={{ background: "#0D1117", borderRadius: 6, padding: "16px", border: "1px solid #1F2937", color: "#4B5563", fontSize: 13, textAlign: "center" }}>
                        Nenhum item cadastrado para esta nota fiscal.
                    </div>
                ) : (
                    <div style={{ background: "#0D1117", borderRadius: 6, border: "1px solid #1F2937", overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    {["Produto", "Descrição", "Qtd", "Un.", "Preço Unit.", "Total", "IPI", "ICMS CST"].map(h => (
                                        <th key={h} style={{
                                            padding: "8px 12px", fontSize: 10, fontWeight: 700,
                                            color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em",
                                            textAlign: "left", borderBottom: "1px solid #1F2937", background: "#060B10",
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {itens.map((item, i) => (
                                    <tr key={i} style={{ borderBottom: "1px solid #1F2937" }}>
                                        <td style={{ padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#E85D04" }}>
                                            {item.codigoProduto ?? "—"}
                                        </td>
                                        <td style={{ padding: "10px 12px", fontSize: 12, color: "#D1D5DB" }}>
                                            {item.codigoEan ?? "—"}
                                        </td>
                                        <td style={{ padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#D1D5DB" }}>
                                            {item.quantidade != null ? Number(item.quantidade).toFixed(3) : "—"}
                                        </td>
                                        <td style={{ padding: "10px 12px", fontSize: 12, color: "#9CA3AF" }}>
                                            {item.unidadeMedidaComercial ?? item.unidadeMedida ?? "—"}
                                        </td>
                                        <td style={{ padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#10B981" }}>
                                            {item.precoUnitario != null ? `R$ ${Number(item.precoUnitario).toFixed(2)}` : "—"}
                                        </td>
                                        <td style={{ padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#10B981", fontWeight: 700 }}>
                                            {item.valorTotal != null ? `R$ ${Number(item.valorTotal).toFixed(2)}` : "—"}
                                        </td>
                                        <td style={{ padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#9CA3AF" }}>
                                            {item.valorIpi != null ? `R$ ${Number(item.valorIpi).toFixed(2)}` : "—"}
                                        </td>
                                        <td style={{ padding: "10px 12px", fontSize: 12, color: "#9CA3AF" }}>
                                            {item.codigoCfo ?? "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            {/* Totalizador */}
                            <tfoot>
                                <tr style={{ borderTop: "2px solid #374151" }}>
                                    <td colSpan={5} style={{ padding: "10px 12px", fontSize: 12, color: "#6B7280", fontWeight: 700 }}>
                                        TOTAL ({itens.length} {itens.length === 1 ? "item" : "itens"})
                                    </td>
                                    <td style={{ padding: "10px 12px", fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#10B981", fontWeight: 800 }}>
                                        R$ {itens.reduce((acc, i) => acc + Number(i.valorTotal ?? 0), 0).toFixed(2)}
                                    </td>
                                    <td colSpan={2} />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
export default function NotaFiscalPage() {
    const [nfs, setNfs] = useState<NotaFiscalAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<NotaFiscalAPI | null>(null);
    const [filtroStatus, setFiltroStatus] = useState<"todos" | "ativa" | "cancelada">("todos");

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API}/api/NotaFiscal`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setNfs(await res.json());
        } catch (e) {
            setError(mensagemDeErro(e, "Erro ao carregar notas fiscais"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const filtradas = useMemo(() => nfs.filter(n => {
        const matchSearch =
            String(n.numero).includes(search) ||
            (n.nomeCliente ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (n.nomeFilial ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (n.chaveNfe ?? "").includes(search);

        const matchStatus =
            filtroStatus === "todos" ? true :
                filtroStatus === "cancelada" ? n.cancelado === 1 :
                    n.cancelado !== 1;

        return matchSearch && matchStatus;
    }), [nfs, search, filtroStatus]);

    const totais = useMemo(() => ({
        total: nfs.length,
        ativas: nfs.filter(n => n.cancelado !== 1).length,
        canceladas: nfs.filter(n => n.cancelado === 1).length,
    }), [nfs]);

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "#F9FAFB", margin: 0, letterSpacing: "-0.03em" }}>
                        Notas Fiscais
                    </h1>
                    <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>
                        {loading ? "Carregando..." : `${totais.total} notas no período`}
                    </p>
                </div>
                <button onClick={load} style={{
                    background: "#1F2937", border: "1px solid #374151", borderRadius: 6,
                    color: "#9CA3AF", fontSize: 12, padding: "9px 14px",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                }}>
                    <Icon d={icons.refresh} size={13} /> Atualizar
                </button>
            </div>

            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
                {[
                    { label: "Total de NFs", valor: totais.total, cor: "#3B82F6" },
                    { label: "Ativas", valor: totais.ativas, cor: "#10B981" },
                    { label: "Canceladas", valor: totais.canceladas, cor: "#EF4444" },
                ].map(k => (
                    <div key={k.label} style={{
                        background: "#111827", borderRadius: 8, padding: "16px 20px",
                        borderLeft: `4px solid ${k.cor}`, border: `1px solid #1F2937`,
                        borderLeftWidth: 4, borderLeftColor: k.cor,
                    }}>
                        <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{k.label}</div>
                        <div style={{ fontSize: 32, fontWeight: 800, color: k.cor }}>{k.valor}</div>
                    </div>
                ))}
            </div>

            {/* Filtros */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar por NF, cliente, filial ou chave..."
                    style={{
                        flex: 1, maxWidth: 400, background: "#111827", border: "1px solid #374151",
                        borderRadius: 6, color: "#D1D5DB", fontSize: 13, padding: "9px 14px", outline: "none",
                    }}
                />
                {(["todos", "ativa", "cancelada"] as const).map(f => (
                    <button key={f} onClick={() => setFiltroStatus(f)} style={{
                        background: filtroStatus === f ? "#1F2937" : "transparent",
                        border: `1px solid ${filtroStatus === f ? "#374151" : "#1F2937"}`,
                        borderRadius: 6, color: filtroStatus === f ? "#F9FAFB" : "#6B7280",
                        fontSize: 12, fontWeight: 600, padding: "8px 14px", cursor: "pointer",
                        textTransform: "capitalize",
                    }}>
                        {f === "todos" ? "Todos" : f === "ativa" ? "Ativas" : "Canceladas"}
                    </button>
                ))}
            </div>

            {/* Tabela */}
            {loading ? <Spinner /> : error ? <ErrorBox message={error} onRetry={load} /> : (
                <>
                    <div style={{ background: "#111827", border: "1px solid #1F2937", borderRadius: 8, overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    {["NF / Série", "Filial", "Cliente", "Emissão", "Ficha", "Valor", "Ambiente", "Status"].map(h => (
                                        <th key={h} style={thStyle}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtradas.map(n => (
                                    <tr key={`${n.numero}-${n.serieNotaFiscal}`}
                                        onClick={() => setSelected(s => s?.numero === n.numero ? null : n)}
                                        style={{
                                            cursor: "pointer",
                                            background: selected?.numero === n.numero ? "rgba(59,130,246,0.08)" : "transparent",
                                            borderBottom: "1px solid #1F2937", transition: "background 0.15s",
                                        }}
                                        onMouseEnter={e => { if (selected?.numero !== n.numero) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                                        onMouseLeave={e => { if (selected?.numero !== n.numero) e.currentTarget.style.background = "transparent"; }}
                                    >
                                        <td style={tdStyle}>
                                            <span style={{ fontFamily: "'DM Mono', monospace", color: "#3B82F6", fontWeight: 700 }}>
                                                {n.numero}
                                            </span>
                                            <span style={{ color: "#4B5563", fontSize: 11, marginLeft: 4 }}>/ {n.serieNotaFiscal}</span>
                                        </td>
                                        <td style={tdStyle}>{n.nomeFilial ?? `Filial ${n.codigoFilial}`}</td>
                                        <td style={tdStyle}>{n.nomeCliente ?? "—"}</td>
                                        <td style={tdStyle}>
                                            {n.dataEmissao ? new Date(n.dataEmissao).toLocaleDateString("pt-BR") : "—"}
                                        </td>
                                        <td style={tdStyle}>
                                            {n.codigoFicha
                                                ? <span style={{ fontFamily: "'DM Mono', monospace", color: "#E85D04", fontWeight: 700 }}>#{String(n.codigoFicha).padStart(4, "0")}</span>
                                                : <span style={{ color: "#4B5563" }}>—</span>
                                            }
                                        </td>
                                        <td style={tdStyle}>
                                            {n.valorTransmissao != null
                                                ? <span style={{ fontFamily: "'DM Mono', monospace", color: "#10B981" }}>R$ {n.valorTransmissao.toFixed(2)}</span>
                                                : <span style={{ color: "#4B5563" }}>—</span>
                                            }
                                        </td>
                                        <td style={tdStyle}><AmbienteBadge ambiente={n.ambiente ?? null} /></td>
                                        <td style={tdStyle}><StatusNF cancelado={n.cancelado ?? null} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtradas.length === 0 && (
                            <div style={{ padding: 40, textAlign: "center", color: "#6B7280", fontSize: 13 }}>
                                Nenhuma nota fiscal encontrada.
                            </div>
                        )}
                    </div>
                    {selected && <DetalheNF nf={selected} onClose={() => setSelected(null)} />}

                </>

            )}

        </div>
    );
}