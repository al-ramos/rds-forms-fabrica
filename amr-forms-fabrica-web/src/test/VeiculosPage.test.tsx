import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import VeiculosPage from '../pages/VeiculosPage'

const veiculosMock = [
  { placa: 'ABC-1234', codigoFilial: 1, ufVeiculo: 'SP', codigoRntc: 'RNT001' },
  { placa: 'DEF-5678', codigoFilial: 2, ufVeiculo: 'RJ', codigoRntc: null },
  { placa: 'GHI-9012', codigoFilial: 1, ufVeiculo: null, codigoRntc: null },
]

const filiaisMock = [
  { codigo: 1, nome: 'Filial São Paulo' },
  { codigo: 2, nome: 'Filial Campinas' },
]

function mockFetchSuccess(veiculos = veiculosMock, filiais = filiaisMock) {
  vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
    if (String(url).includes('/api/Veiculo')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(veiculos) })
    }
    if (String(url).includes('/api/Filial')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(filiais) })
    }
    return Promise.reject(new Error(`URL não mapeada: ${url}`))
  }))
}

function mockFetchError() {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
}

describe('VeiculosPage', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('exibe spinner enquanto os dados estão carregando', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))
    render(<VeiculosPage />)
    expect(screen.getByText(/carregando veículos/i)).toBeInTheDocument()
  })

  it('renderiza a lista de veículos após carregamento bem-sucedido', async () => {
    mockFetchSuccess()
    render(<VeiculosPage />)
    await waitFor(() => expect(screen.getByText('ABC-1234')).toBeInTheDocument())
    expect(screen.getByText('DEF-5678')).toBeInTheDocument()
    expect(screen.getByText('GHI-9012')).toBeInTheDocument()
  })

  it('exibe a contagem correta de veículos cadastrados', async () => {
    mockFetchSuccess()
    render(<VeiculosPage />)
    await waitFor(() =>
      expect(screen.getByText('3 veículos cadastrados')).toBeInTheDocument()
    )
  })

  it('filtra veículos por busca de placa', async () => {
    mockFetchSuccess()
    render(<VeiculosPage />)
    await waitFor(() => screen.getByText('ABC-1234'))

    fireEvent.change(
      screen.getByPlaceholderText(/buscar por placa/i),
      { target: { value: 'ABC' } }
    )

    expect(screen.getByText('ABC-1234')).toBeInTheDocument()
    expect(screen.queryByText('DEF-5678')).not.toBeInTheDocument()
  })

  it('abre o modal de cadastro ao clicar em "+ Novo Veículo"', async () => {
    mockFetchSuccess()
    render(<VeiculosPage />)
    await waitFor(() => screen.getByText('ABC-1234'))
    fireEvent.click(screen.getByText('+ Novo Veículo'))
    expect(screen.getByText('Cadastrar Veículo')).toBeInTheDocument()
  })

  it('exibe erro quando a API retorna falha', async () => {
    mockFetchError()
    render(<VeiculosPage />)
    await waitFor(() =>
      expect(screen.getByText(/erro ao carregar dados/i)).toBeInTheDocument()
    )
  })
})
