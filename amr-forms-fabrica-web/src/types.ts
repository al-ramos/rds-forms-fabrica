import type { CSSProperties } from "react";

export const API = import.meta.env.VITE_API_URL || "";
export const PASSO_FINAL = 4;
export const passos = ["Entrada", "Pesagem", "Carregamento", "Saída"] as const;

export interface FichaAPI {
    codigo: number;
    codigoFilial: number;
    dataFicha?: string | null;
    placaVeiculo?: string | null;
    codigoTipoOperacao?: number | null;
    codigoPassoAtual?: number | null;
    nomeMotorista?: string | null;
    noFilial?: string | null;
    estaFinalizada?: boolean | null;
}

export interface ItemNotaFiscalAPI {
    codigoProduto?: string | null;
    codigoEan?: string | null;
    quantidade?: number | null;
    unidadeMedidaComercial?: string | null;
    unidadeMedida?: string | null;
    precoUnitario?: number | null;
    valorTotal?: number | null;
    valorIpi?: number | null;
    codigoCfo?: string | null;
}

export interface Ficha {
    cdFicha: number;
    noFilial: string;
    dtFicha: string;
    noTipoOp: string;
    noPasso: string;
    placa: string;
    status: "em_andamento" | "concluida" | "aguardando";
}

export const statusMap = {
    em_andamento: { label: "Em Andamento", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
    concluida:    { label: "Concluída",    color: "#10B981", bg: "rgba(16,185,129,0.12)"  },
    aguardando:   { label: "Aguardando",   color: "#6B7280", bg: "rgba(107,114,128,0.12)" },
} as const;

export const icons: Record<string, string> = {
    ficha:   "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    nf:      "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
    pedido:  "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
    veiculo: "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
    balanca: "M12 2v20M2 7h20M5 12l7-5 7 5",
    config:  "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
    bell:    "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
    user:    "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8",
    dash:    "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
    chevron: "M9 18l6-6-6-6",
    logout:  "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
    refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
};

export const navItems = [
    { key: "dashboard", label: "Dashboard",     icon: "dash"    },
    { key: "fichas",    label: "Fichas",        icon: "ficha"   },
    { key: "nf",        label: "Notas Fiscais", icon: "nf"      },
    { key: "pedidos",   label: "Pedidos",       icon: "pedido"  },
    { key: "veiculos",  label: "Veículos",      icon: "veiculo" },
    { key: "balanca",   label: "Balanças",      icon: "balanca" },
    { key: "config",    label: "Configurações", icon: "config"  },
];

export const tdStyle: CSSProperties = {
    padding: "12px 16px", fontSize: 13, color: "#D1D5DB", whiteSpace: "nowrap",
};

export const thStyle: CSSProperties = {
    padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#6B7280",
    textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "left",
    borderBottom: "1px solid #1F2937", background: "#0D1117",
};
export interface NotaFiscalAPI {
    numero: number
    serieNotaFiscal: string
    codigoFilial: number
    codigoFicha: number | null
    nomeFilial: string | null
    nomeCliente: string | null
    cnpjCliente: string | null
    dataEmissao: string | null
    cancelado: number | null
    impressoes: number | null
    valorTransmissao: number | null
    ambiente: string | null
    modeloNf: string | null
    chaveNfe: string | null
    protocolo: string | null
}