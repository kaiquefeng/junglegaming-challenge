import { Button } from '@/components/button'
import { formatEth } from '@/lib/eth'
import type { Cart } from '../../services/cart.types'

type CartIssuesProps = {
  cart: Cart
  onAcceptPrices: () => void
  isAccepting: boolean
}

export function CartIssues({
  cart,
  onAcceptPrices,
  isAccepting,
}: CartIssuesProps) {
  if (cart.issues.length === 0) return null

  const nameOf = (nftId: string) =>
    cart.items.find((item) => item.nftId === nftId)?.name ?? 'NFT'
  const hasPrice = cart.issues.some((issue) => issue.type === 'price_changed')

  return (
    <div
      role="alert"
      className="flex flex-col gap-2 rounded border border-primary bg-card p-3 text-sm"
    >
      <p className="font-bold">Alguns itens mudaram</p>
      <ul className="list-disc pl-5">
        {cart.issues.map((issue) => (
          <li key={`${issue.type}-${issue.nftId}-${issue.edition}`}>
            {issue.type === 'price_changed'
              ? `${nameOf(issue.nftId)}: preço de ${formatEth(issue.from)} para ${formatEth(issue.to)} ETH.`
              : `${nameOf(issue.nftId)} (${issue.edition}): só ${issue.available} unidade(s) disponível(is). Ajuste a quantidade.`}
          </li>
        ))}
      </ul>
      {hasPrice && (
        <Button
          size="sm"
          className="self-start"
          onClick={onAcceptPrices}
          disabled={isAccepting}
        >
          Aceitar novos valores
        </Button>
      )}
    </div>
  )
}
