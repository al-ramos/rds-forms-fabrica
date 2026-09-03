import { useState, useEffect, useCallback } from "react";
import { API } from "../types";
import { mensagemDeErro } from "../erros";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface VeiculoAPI {
  placa: string;
  codigoFilial: number;
  ufVeiculo: string | null;
  codigoRntc: string | null;
}

interface Filial {
  codigo: number;
  nome: string | null;
}

// ─── Estilos compartilhados ───────────────────────────────────────────────────
const tdStyle: React.CSSProperties = {
  padding: "12px 16px", fontSize: 13, color: "#D1D5DB", whiteSpace: "nowrap",
};
const thStyle: React.CSSProperties = {
  padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#6B7280",
  textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "left",
  borderBottom: "1px solid #1F2937", background: "#0D1117",
};
const inputStyle: React.CSSProperties = {
  width: "100%", background: "#0D1117", border: "1px solid #374151",
  borderRadius: 6, color: "#F9FAFB", fontSize: 13, padding: "10px 14px",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: "#6B7280",
  textTransform: "uppercase", letterSpacing: "0.08em",
  marginBottom: 6, display: "block",
};

// ─── Modal Novo Veículo ───────────────────────────────────────────────────────
function ModalNovoVeiculo({ filiais, onSalvo, onFechar }: {
  filiais: Filial[];
  onSalvo: (v: VeiculoAPI) => void;
  onFechar: () => void;
}) {
  const [placa, setPlaca] = useState("");
  const [codigoFilial, setCodigoFilial] = useState(
    filiais.length > 0 ? String(filiais[0].codigo) : ""
  );
  const [uf, setUf] = useState("");
  const [rntc, setRntc] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSalvar = async () => {
    const placaFmt = placa.toUpperCase().trim();
    if (!placaFmt) { setErro("Placa é obrigatória."); return; }
    if (!codigoFilial) { setErro("Selecione uma filial."); return; }
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch(`${API}/api/Veiculo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placa: placaFmt,
          codigoFilial: Number(codigoFilial),
          ufVeiculo: uf.trim() || null,
          codigoRntc: rntc.trim() || null,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onSalvo({
        placa: placaFmt,
        codigoFilial: Number(codigoFilial),
        ufVeiculo: uf.trim() || null,
        codigoRntc: rntc.trim() || null,
      });
    } catch (e) {
      setErro(mensagemDeErro(e, "Erro ao cadastrar veículo"));
    } finally {
      setLoading(false);
    }
  };

  const canSave = placa.trim().length > 0 && codigoFilial !== "" && !loading;

  return (
    <>
      <div onClick={onFechar} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000,
      }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#111827", border: "1px solid #374151",
        borderRadius: 10, padding: 28, width: 420,
        zIndex: 1001, boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      }}>
        <div style={{
          height: 3,
          background: "linear-gradient(90deg, #E85D04, #9A3412, transparent)",
          margin: "-28px -28px 24px",
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB" }}>Cadastrar Veículo</div>
          <button onClick={onFechar} style={{
            background: "none", border: "none", color: "#6B7280",
            cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 4,
          }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Placa *</label>
            <input
              value={placa}
              onChange={e => setPlaca(e.target.value.toUpperCase())}
              placeholder="ABC-1234"
              maxLength={8}
              autoFocus
              style={{ ...inputStyle, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}
            />
          </div>

          <div>
            <label style={labelStyle}>Filial *</label>
            {filiais.length === 0
              ? <div style={{
                  fontSize: 12, color: "#EF4444", padding: "10px 14px",
                  background: "#1F2937", borderRadius: 6, border: "1px solid #374151",
                }}>
                  ⚠️ Nenhuma filial cadastrada. Reinicie a API para aplicar o seed.
                </div>
              : <select
                  value={codigoFilial}
                  onChange={e => setCodigoFilial(e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  {filiais.map(f => (
                    <option key={f.codigo} value={String(f.codigo)}>
                      {f.nome ?? `Filial ${f.codigo}`}
                    </option>
                  ))}
                </select>
            }
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>UF</label>
              <input value={uf} onChange={e => setUf(e.target.value.toUpperCase())}
                placeholder="SP" maxLength={2} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>RNTC</label>
              <input value={rntc} onChange={e => setRntc(e.target.value)}
                placeholder="Código RNTC" style={inputStyle} />
            </div>
          </div>
        </div>

        {erro && <div style={{ marginTop: 12, fontSize: 12, color: "#EF4444" }}>⚠️ {erro}</div>}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
          <button onClick={onFechar} style={{
            background: "transparent", border: "1px solid #374151",
            borderRadius: 6, color: "#9CA3AF", fontSize: 12, fontWeight: 600,
            padding: "8px 16px", cursor: "pointer",
          }}>Cancelar</button>
          <button onClick={handleSalvar} disabled={!canSave} style={{
            background: canSave ? "linear-gradient(135deg, #E85D04, #9A3412)" : "#374151",
            border: "none", borderRadius: 6, color: "white",
            fontSize: 12, fontWeight: 700, padding: "8px 18px",
            cursor: canSave ? "pointer" : "not-allowed",
          }}>
            {loading ? "Salvando..." : "✓ Salvar"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState<VeiculoAPI[]>([]);
  const [filiais, setFiliais]   = useState<Filial[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [search, setSearch]     = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resV, resF] = await Promise.all([
        fetch(`${API}/api/Veiculo`),
        fetch(`${API}/api/Filial`),
      ]);
      if (!resV.ok) throw new Error(`Veículos: HTTP ${resV.status}`);
      if (!resF.ok) throw new Error(`Filiais: HTTP ${resF.status}`);
      setVeiculos(await resV.json());
      setFiliais(await resF.json());
    } catch (e) {
      setError(mensagemDeErro(e, "Erro ao carregar dados"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const filtered = veiculos.filter(v =>
    v.placa.toLowerCase().includes(search.toLowerCase()) ||
    String(v.codigoFilial).includes(search) ||
    (v.ufVeiculo ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (v.codigoRntc ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSalvo = (novo: VeiculoAPI) => {
    setVeiculos(v => [...v, novo]);
    setModalAberto(false);
  };

  const nomeFilial = (codigo: number) =>
    filiais.find(f => f.codigo === codigo)?.nome ?? `Filial ${codigo}`;

  const comUf   = veiculos.filter(v => v.ufVeiculo).length;
  const comRntc = veiculos.filter(v => v.codigoRntc).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#F9FAFB", margin: 0, letterSpacing: "-0.03em" }}>
            Veículos
          </h1>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>
            {loading ? "Carregando..." : `${veiculos.length} veículos cadastrados`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={carregar} style={{
            background: "#111827", border: "1px solid #1F2937", borderRadius: 6,
            color: "#9CA3AF", fontWeight: 600, fontSize: 13, padding: "9px 16px",
            cursor: "pointer",
          }}>↻ Atualizar</button>
          <button onClick={() => setModalAberto(true)} style={{
            background: "linear-gradient(135deg, #E85D04, #9A3412)",
            border: "none", borderRadius: 6, color: "white",
            fontWeight: 700, fontSize: 13, padding: "9px 18px", cursor: "pointer",
          }}>+ Novo Veículo</button>
        </div>
      </div>

      {/* KPIs */}
      {!loading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total",    value: veiculos.length, color: "#E85D04" },
            { label: "Com UF",   value: comUf,           color: "#10B981" },
            { label: "Com RNTC", value: comRntc,         color: "#3B82F6" },
          ].map(k => (
            <div key={k.label} style={{
              background: "#111827", border: "1px solid #1F2937",
              borderRadius: 8, padding: "20px 24px", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, ${k.color}, transparent)` }} />
              <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280",
                textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#F9FAFB",
                fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{k.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Busca */}
      {!loading && !error && (
        <div style={{ marginBottom: 16, maxWidth: 320 }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por placa, filial ou UF..."
            style={{ width: "100%", background: "#111827", border: "1px solid #374151",
              borderRadius: 6, color: "#D1D5DB", fontSize: 13,
              padding: "9px 14px", outline: "none", boxSizing: "border-box" }} />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ background: "#111827", border: "1px solid #1F2937",
          borderRadius: 8, padding: 60, textAlign: "center", color: "#6B7280", fontSize: 13 }}>
          Carregando veículos...
        </div>
      )}

      {/* Erro */}
      {error && (
        <div style={{ background: "#111827", border: "1px solid #1F2937",
          borderRadius: 8, padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#EF4444", marginBottom: 8 }}>Erro ao carregar dados</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>{error}</div>
          <button onClick={carregar} style={{ background: "#1F2937", border: "1px solid #374151",
            borderRadius: 6, color: "#D1D5DB", fontWeight: 600, fontSize: 13,
            padding: "9px 18px", cursor: "pointer" }}>↻ Tentar novamente</button>
        </div>
      )}

      {/* Tabela */}
      {!loading && !error && (
        <div style={{ background: "#111827", border: "1px solid #1F2937", borderRadius: 8, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Placa", "Filial", "UF", "RNTC"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.placa}
                  style={{ borderBottom: "1px solid #1F2937" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={tdStyle}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13,
                      color: "#E85D04", fontWeight: 700 }}>{v.placa}</span>
                  </td>
                  <td style={tdStyle}>{nomeFilial(v.codigoFilial)}</td>
                  <td style={tdStyle}>
                    {v.ufVeiculo
                      ? <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px",
                          borderRadius: 4, color: "#10B981", background: "rgba(16,185,129,0.12)",
                          border: "1px solid rgba(16,185,129,0.3)" }}>{v.ufVeiculo}</span>
                      : <span style={{ color: "#4B5563", fontSize: 12 }}>—</span>}
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#9CA3AF" }}>
                      {v.codigoRntc ?? "—"}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#6B7280", fontSize: 13 }}>
                  Nenhum veículo encontrado.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalAberto && (
        <ModalNovoVeiculo
          filiais={filiais}
          onSalvo={handleSalvo}
          onFechar={() => setModalAberto(false)}
        />
      )}
    </div>
  );
}
