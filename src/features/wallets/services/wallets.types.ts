export type WalletKind = 'primary' | 'secondary'

export type WalletInput = {
  displayName: string
  alias: string
  network: string
  profileName: string
  address: string
  secondaryAddress?: string
  walletType: string
  referralCode: string
  email: string
  ensName: string
  ensSuffix: string
}

export type Wallet = WalletInput & { id: string; kind: WalletKind }

export type WalletsResponse = {
  primary: Wallet | null
  secondary: Wallet | null
}

export type WalletConnection = { sessionId: string; walletType: string }
