import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import FichasPage from './FichasPage';
import NovaFicha from './NovaFicha';
import NotaFiscalPage from './NotaFiscalPage';
import VeiculosPage from './pages/VeiculosPage';
import { useFichas } from './useFichas';

const NAV = [
  { section: 'Operacao', items: [
    { to: '/',        icon: 'bi-grid-1x2',       label: 'Dashboard'     },
    { to: '/fichas',  icon: 'bi-clipboard-check', label: 'Fichas'        },
    { to: '/nf',      icon: 'bi-file-earmark-text', label: 'Notas Fiscais' },
  ]},
  { section: 'Logistica', items: [
    { to: '/veiculos', icon: 'bi-truck',           label: 'Veiculos'      },
    { to: '/balanca',  icon: 'bi-speedometer2',    label: 'Balancas'      },
  ]},
  { section: 'Sistema', items: [
    { to: '/config',  icon: 'bi-gear',             label: 'Configuracoes' },
  ]},
];

const PAGE_LABELS: Record<string, { title: string; subtitle: string }> = {
  '/':         { title: 'Dashboard',      subtitle: 'Visao geral operacional' },
  '/fichas':   { title: 'Fichas',         subtitle: 'Controle de operacoes'   },
  '/nf':       { title: 'Notas Fiscais',  subtitle: 'Transmissao e consulta'  },
  '/veiculos': { title: 'Veiculos',       subtitle: 'Cadastro e controle'     },
  '/balanca':  { title: 'Balancas',       subtitle: 'Pesagens e registros'    },
  '/config':   { title: 'Configuracoes',  subtitle: 'Parametros do sistema'   },
};

function Sidebar() {
  return (
    <nav className="amr-sidebar">
      <a href="/" className="amr-sidebar-brand">
        AMR <span>Fabrica</span>
      </a>
      {NAV.map(group => (
        <div key={group.section}>
          <p className="amr-sidebar-section">{group.section}</p>
          {group.items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}
      <div style={{ marginTop: 'auto', padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'var(--amr-sidebar-active)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff',
          }}>A</div>
          <div>
            <div style={{ fontSize: 12, color: '#cfd8dc', fontWeight: 500 }}>AMR Sistema</div>
            <div style={{ fontSize: 10, color: '#546e7a' }}>Fabrica</div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Topbar() {
  const loc = useLocation();
  const key = Object.keys(PAGE_LABELS)
    .filter(k => k !== '/')
    .find(k => loc.pathname.startsWith(k)) ?? loc.pathname;
  const info = PAGE_LABELS[key] ?? PAGE_LABELS['/'];
  return (
    <header className="amr-topbar">
      <div style={{ flex: 1 }}>
        <p className="amr-topbar-title">{info.title}</p>
        {info.subtitle && <p className="amr-topbar-subtitle">{info.subtitle}</p>}
      </div>
      <span style={{ fontSize: 11, color: '#adb5bd' }}>
        <i className="bi bi-circle-fill" style={{ color: '#4caf50', fontSize: 8, marginRight: 4 }}></i>
        Online
      </span>
    </header>
  );
}

function PlaceholderPage({ label }: { label: string }) {
  return (
    <div className="amr-empty">
      <i className="bi bi-tools"></i>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#495057' }}>{label}</div>
      <div style={{ fontSize: 13, marginTop: 4 }}>Em desenvolvimento</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    em_andamento: { cls: 'badge-em-andamento', label: 'Em Andamento' },
    concluida:    { cls: 'badge-concluida',    label: 'Concluida'    },
    aguardando:   { cls: 'badge-aguardando',   label: 'Aguardando'   },
  };
  const s = map[status] ?? { cls: 'badge-aguardando', label: status };
  return (
    <span className={`badge rounded-pill fw-semibold ${s.cls}`} style={{ fontSize: 11, padding: '4px 10px' }}>
      {s.label}
    </span>
  );
}

function DashboardPage() {
  const { fichas, loading, error, reload } = useFichas();
  const hoje = new Date().toISOString().slice(0, 10);
  const fichasHoje     = fichas.filter(f => f.dtFicha?.slice(0, 10) === hoje);
  const emAndamento    = fichas.filter(f => f.status === 'em_andamento');
  const concluidas     = fichas.filter(f => f.status === 'concluida');

  if (loading) return (
    <div className="amr-empty">
      <div className="spinner-border spinner-border-sm text-primary mb-2" role="status"></div>
      <span style={{ fontSize: 13 }}>Carregando...</span>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
      <i className="bi bi-exclamation-triangle-fill"></i>{error}
      <button className="btn btn-sm btn-outline-danger ms-auto" onClick={reload}>Tentar novamente</button>
    </div>
  );

  return (
    <>
      <div className="row g-3 mb-4">
        {[
          { label: 'Total de Fichas', value: fichas.length,      color: '#212529' },
          { label: 'Fichas Hoje',     value: fichasHoje.length,  color: '#1565c0' },
          { label: 'Em Andamento',    value: emAndamento.length, color: '#f57f17' },
          { label: 'Concluidas',      value: concluidas.length,  color: '#2e7d32' },
        ].map(m => (
          <div key={m.label} className="col-md-3">
            <div className="amr-metric-card">
              <p className="amr-metric-label">{m.label}</p>
              <p className="amr-metric-value" style={{ color: m.color }}>{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="amr-table-card">
        <div className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom">
          <span style={{ fontSize: 13, fontWeight: 600, color: '#495057' }}>
            <i className="bi bi-clock-history me-2"></i>Ultimas fichas
          </span>
          <button className="btn btn-sm btn-outline-secondary" onClick={reload}>
            <i className="bi bi-arrow-clockwise me-1"></i>Atualizar
          </button>
        </div>
        {fichas.length === 0 ? (
          <div className="amr-empty">
            <i className="bi bi-inbox"></i>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Nenhuma ficha registrada</div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-sm mb-0" style={{ fontSize: 13 }}>
              <thead className="table-light">
                <tr>
                  <th>#</th><th>Tipo de Operacao</th><th>Filial</th><th>Placa</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fichas.slice(0, 8).map(f => (
                  <tr key={f.cdFicha}>
                    <td className="font-monospace text-muted" style={{ fontSize: 12 }}>
                      #{String(f.cdFicha).padStart(4, '0')}
                    </td>
                    <td>{f.noTipoOp}</td>
                    <td>{f.noFilial}</td>
                    <td className="font-monospace">{f.placa || '—'}</td>
                    <td><StatusBadge status={f.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function FichasRoute() {
  const { fichas, loading, error, reload } = useFichas();
  const [novaFichaAberta, setNovaFichaAberta] = useState(false);

  const handleSuccess = useCallback(() => {
    setNovaFichaAberta(false);
    reload();
  }, [reload]);

  if (novaFichaAberta) {
    return <NovaFicha onBack={() => setNovaFichaAberta(false)} onSuccess={handleSuccess} />;
  }

  return (
    <FichasPage
      fichas={fichas}
      loading={loading}
      error={error}
      reload={reload}
      onNova={() => setNovaFichaAberta(true)}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="amr-wrapper">
        <Sidebar />
        <div className="amr-content-wrapper">
          <Topbar />
          <main className="amr-content">
            <Routes>
              <Route path="/"         element={<DashboardPage />} />
              <Route path="/fichas"   element={<FichasRoute />} />
              <Route path="/nf"       element={<NotaFiscalPage />} />
              <Route path="/veiculos" element={<VeiculosPage />} />
              <Route path="/balanca"  element={<PlaceholderPage label="Balancas" />} />
              <Route path="/config"   element={<PlaceholderPage label="Configuracoes" />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}




