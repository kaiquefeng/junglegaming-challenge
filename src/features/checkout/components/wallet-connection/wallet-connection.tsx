import { Button } from '@/components/button'
import type { Connection } from '../../hooks/use-checkout'

type WalletConnectionProps = {
  walletType: string
  connection: Connection
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletConnection({
  walletType,
  connection,
  onConnect,
  onDisconnect,
}: WalletConnectionProps) {
  return (
    <div className="flex flex-col gap-2 rounded-[3px] border border-border p-3 text-sm">
      <p aria-live="polite">
        {connection.status === 'connected' && `${walletType} conectada.`}
        {connection.status === 'connecting' && 'Conectando…'}
        {connection.status === 'idle' && 'Nenhuma carteira conectada.'}
        {connection.status === 'rejected' && (
          <span role="alert" className="text-destructive">
            {connection.message}
          </span>
        )}
      </p>
      {connection.status === 'connected' ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDisconnect}
        >
          Desconectar carteira
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          onClick={onConnect}
          disabled={connection.status === 'connecting'}
        >
          Conectar carteira
        </Button>
      )}
    </div>
  )
}
