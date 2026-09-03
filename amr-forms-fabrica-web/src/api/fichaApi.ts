import api from './api'

export interface Ficha {
  cdFicha: number
  cdFilial: number
  dtFicha: string
  cdTipoOperacao: number
  cdPassoAtual: number | null
  cdPlacaVeiculo: string | null
  cdFilialNavigation?: { noFilial: string }
  cdTipoOperacaoNavigation?: { noTipoOperacao: string }
  cdPassoAtualNavigation?: { noPasso: string }
}

export const fichaApi = {
  getAll:         () => api.get<Ficha[]>('/api/Ficha'),
  getById:        (id: number) => api.get<Ficha>(`/api/Ficha/${id}`),
  getByFilial:    (cdFilial: number) => api.get<Ficha[]>(`/api/Ficha/filial/${cdFilial}`),
  avancarPasso:   (id: number) => api.patch(`/api/Ficha/${id}/passo`),
  registrarSaida: (id: number) => api.patch(`/api/Ficha/${id}/saida`),
}
