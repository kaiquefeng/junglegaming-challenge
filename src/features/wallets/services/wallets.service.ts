import { api } from '@/services/api'
import type {
  WalletConnection,
  WalletInput,
  WalletKind,
  WalletsResponse,
} from './wallets.types'

export const getWallets = (signal?: AbortSignal) =>
  api.get<WalletsResponse>('/wallets', { signal }).then((r) => r.data)

export const saveWallet = (kind: WalletKind, body: WalletInput) =>
  api.put<WalletsResponse>(`/wallets/${kind}`, body).then((r) => r.data)

export const connectWallet = (body: { walletType: string; network: string }) =>
  api.post<WalletConnection>('/wallets/connect', body).then((r) => r.data)

export const disconnectWallet = (sessionId: string) =>
  api.delete(`/wallets/connect/${sessionId}`).then(() => undefined)
