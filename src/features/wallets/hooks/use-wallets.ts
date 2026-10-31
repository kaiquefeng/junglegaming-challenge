import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userKey, useSession } from '@/features/authentication'
import { announce } from '@/features/realtime'
import {
  connectWallet,
  disconnectWallet,
  getWallets,
  saveWallet,
} from '../services/wallets.service'
import type { WalletInput, WalletKind } from '../services/wallets.types'

export function useWallets() {
  const { user } = useSession()
  return useQuery({
    queryKey: userKey(user?.id, 'wallets'),
    queryFn: ({ signal }) => getWallets(signal),
    enabled: Boolean(user),
  })
}

export function useSaveWallet(kind: WalletKind) {
  const queryClient = useQueryClient()
  const { user } = useSession()
  return useMutation({
    mutationFn: (body: WalletInput) => saveWallet(kind, body),
    onSuccess: (data) => {
      queryClient.setQueryData(userKey(user?.id, 'wallets'), data)
      announce(
        kind === 'primary'
          ? 'Carteira principal salva.'
          : 'Carteira secundária salva.',
        'success',
      )
    },
  })
}

export function useWalletConnection() {
  return {
    connect: useMutation({ mutationFn: connectWallet }),
    disconnect: useMutation({ mutationFn: disconnectWallet }),
  }
}
