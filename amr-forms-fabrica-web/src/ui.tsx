import { memo } from "react";
import { statusMap, icons, navItems, passos } from './types';
import type { Ficha } from './types';


// ── Icon ──────────────────────────────────────────────────────────────────────
export const Icon = memo(({ d, size = 20 }: { d: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
));

// ── StatusBadge — memo evita re-render quando pai atualiza outra coisa ────────
export const StatusBadge = memo(({ status }: { status: Ficha["status"] }) => {
    const s = statusMap[status];
    return (
        <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase", padding: "3px 10px", borderRadius: 4,
            color: s.color, background: s.bg, border: `1px solid ${s.color}40`,
        }}>{s.label}</span>
    );
});

// ── PassoTimeline — memo: só re-renderiza se passoAtual mudar ─────────────────
export const PassoTimeline = memo(({ passoAtual }: { passoAtual: string }) => {
    const idx = passos.indexOf(passoAtual as typeof passos[number]);
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            {passos.map((p, i) => (
                <div key={p} style={{ display: "flex", alignItems: "center" }}>
                    <div style={{
                        width: 10, height: 10, borderRadius: "50%",
                        background: i <= idx ? "#E85D04" : "#374151",
                        border: i === idx ? "2px solid #F97316" : "2px solid #374151",
                        boxShadow: i === idx ? "0 0 6px #E85D0480" : "none",
                    }} />
                    {i < passos.length - 1 && (
                        <div style={{ width: 18, height: 2, background: i < idx ? "#E85D04" : "#1F2937" }} />
                    )}
                </div>
            ))}
        </div>
    );
});

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner() {
    return (
        <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: 200, gap: 12, flexDirection: "column"
        }}>
            <div style={{
                width: 32, height: 32, borderRadius: "50%",
                border: "3px solid #1F2937", borderTopColor: "#E85D04",
                animation: "spin 0.8s linear infinite"
            }} />
            <span style={{ fontSize: 13, color: "#6B7280" }}>Carregando dados...</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

// ── ErrorBox ──────────────────────────────────────────────────────────────────
export function ErrorBox({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: 200, gap: 12
        }}>
            <div style={{ fontSize: 32 }}>⚠️</div>
            <div style={{ fontSize: 14, color: "#EF4444", fontWeight: 600 }}>Erro ao carregar dados</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>{message}</div>
            <button onClick={onRetry} style={{
                marginTop: 8, background: "#1F2937",
                border: "1px solid #374151", borderRadius: 6, color: "#D1D5DB", fontSize: 12,
                padding: "7px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6
            }}>
                <Icon d={icons.refresh} size={14} /> Tentar novamente
            </button>
        </div>
    );
}

// ── KPICard ───────────────────────────────────────────────────────────────────
export const KPICard = memo(({ label, value, color = "#10B981" }: {
    label: string; value: string | number; color?: string;
}) => (
    <div style={{
        background: "#111827", border: "1px solid #1F2937", borderRadius: 8,
        padding: "20px 24px", display: "flex", flexDirection: "column", gap: 8,
        position: "relative", overflow: "hidden"
    }}>
        <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            // A prop color era aceita e ignorada — a barra ficava sempre laranja.
            background: `linear-gradient(90deg, ${color}, transparent)`
        }} />
        <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "#6B7280"
        }}>{label}</span>
        <span style={{
            fontSize: 36, fontWeight: 800, color: "#F9FAFB",
            fontFamily: "'DM Mono', monospace", lineHeight: 1
        }}>{value}</span>
    </div>
));

// ── PlaceholderPage ───────────────────────────────────────────────────────────
export function PlaceholderPage({ label }: { label: string }) {
    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: 300, gap: 12
        }}>
            <div style={{ fontSize: 40 }}>🚧</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#6B7280" }}>{label}</div>
            <div style={{ fontSize: 13, color: "#374151" }}>Em desenvolvimento</div>
        </div>
    );
}

// ── Sidebar — memo: só re-renderiza se active/collapsed mudar ─────────────────
export const Sidebar = memo(({ active, setActive, collapsed, setCollapsed }: {
    active: string; setActive: (k: string) => void;
    collapsed: boolean; setCollapsed: (v: boolean) => void;
}) => (
    <aside style={{
        width: collapsed ? 64 : 220, minHeight: "100vh", background: "#0D1117",
        borderRight: "1px solid #1F2937", display: "flex", flexDirection: "column",
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)", flexShrink: 0,
        position: "relative", zIndex: 10
    }}>
        <div style={{
            padding: collapsed ? "20px 0" : "20px 20px", display: "flex",
            alignItems: "center", gap: 10, borderBottom: "1px solid #1F2937",
            justifyContent: collapsed ? "center" : "flex-start"
        }}>
            <div style={{
                width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                background: "linear-gradient(135deg, #E85D04, #9A3412)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: 14, color: "white", letterSpacing: "-1px"
            }}>RF</div>
            {!collapsed && (
                <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#F9FAFB", letterSpacing: "-0.02em" }}>RDS Forms</div>
                    <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>Fábrica</div>
                </div>
            )}
        </div>
        <nav style={{ flex: 1, padding: "12px 0" }}>
            {navItems.map(item => {
                const isActive = active === item.key;
                return (
                    <button key={item.key} onClick={() => setActive(item.key)}
                        title={collapsed ? item.label : undefined}
                        style={{
                            display: "flex", alignItems: "center", gap: collapsed ? 0 : 10,
                            justifyContent: collapsed ? "center" : "flex-start",
                            width: "100%", padding: collapsed ? "11px 0" : "11px 16px", border: "none",
                            background: isActive ? "linear-gradient(90deg, rgba(232,93,4,0.15), transparent)" : "transparent",
                            color: isActive ? "#F97316" : "#6B7280", cursor: "pointer",
                            borderLeft: isActive ? "2px solid #E85D04" : "2px solid transparent",
                            transition: "all 0.15s", textAlign: "left"
                        }}
                        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = "#D1D5DB"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; } }}
                        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "#6B7280"; e.currentTarget.style.background = "transparent"; } }}>
                        <Icon d={icons[item.icon]} size={18} />
                        {!collapsed && <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500 }}>{item.label}</span>}
                    </button>
                );
            })}
        </nav>
        <div style={{
            borderTop: "1px solid #1F2937", padding: collapsed ? "12px 0" : "12px 16px",
            display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start"
        }}>
            <div style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: "#1F2937",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF"
            }}>
                <Icon d={icons.user} size={15} />
            </div>
            {!collapsed && (
                <>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#D1D5DB", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Operador</div>
                        <div style={{ fontSize: 10, color: "#6B7280" }}>São Paulo</div>
                    </div>
                    <button style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", padding: 4, display: "flex" }}>
                        <Icon d={icons.logout} size={15} />
                    </button>
                </>
            )}
        </div>
        <button onClick={() => setCollapsed(!collapsed)} style={{
            position: "absolute", top: 22, right: -12,
            width: 24, height: 24, borderRadius: "50%", background: "#1F2937", border: "1px solid #374151",
            color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.25s", zIndex: 20
        }}>
            <Icon d={icons.chevron} size={12} />
        </button>
    </aside>
));

// ── Header — memo: só re-renderiza se active mudar ────────────────────────────
export const Header = memo(({ active }: { active: string }) => {
    const page = navItems.find(n => n.key === active);
    return (
        <header style={{
            height: 56, background: "#0D1117", borderBottom: "1px solid #1F2937",
            display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em" }}>Fábrica</span>
                <Icon d={icons.chevron} size={12} />
                <span style={{ fontSize: 13, color: "#F9FAFB", fontWeight: 700 }}>{page?.label ?? "Dashboard"}</span>
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Mono', monospace" }}>
                {new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
            </div>
            <button style={{
                background: "none", border: "none", color: "#6B7280", cursor: "pointer",
                padding: 6, display: "flex", alignItems: "center", position: "relative"
            }}>
                <Icon d={icons.bell} size={18} />
                <span style={{
                    position: "absolute", top: 4, right: 4, width: 7, height: 7,
                    borderRadius: "50%", background: "#E85D04", border: "1px solid #0D1117"
                }} />
            </button>
        </header>
    );
});
