import { useRouter } from '@tanstack/react-router'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalTitle,
} from '@/components/modal'
import { Separator } from '@/components/separator'
import { formatEth, formatEthWithSymbol } from '@/lib/eth'
import type { Order } from '../../services/orders.types'

const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function OrderReceiptModal({ order }: { order: Order }) {
  const router = useRouter()
  const meta = [
    { label: 'ID da transação', value: order.txHash ?? '—', bold: true },
    {
      label: 'Data',
      value: dateFormat.format(new Date(order.settledAt ?? order.createdAt)),
    },
    { label: 'Total', value: formatEthWithSymbol(order.total, 3) },
    { label: 'Carteira', value: order.payment.walletType, bold: true },
  ]

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) router.navigate({ to: '/' })
      }}
    >
      <ModalContent className="max-w-[578px] p-0">
        <div className="flex h-[156px] flex-col items-center justify-center gap-4">
          <img src="/images/icons/thank-you.svg" alt="" className="size-20" />
          <ModalTitle className="text-center text-base font-bold text-muted-foreground">
            Seus NFTs agora estão na sua carteira
          </ModalTitle>
        </div>
        <Separator className="bg-primary" />
        <dl className="grid grid-cols-2 gap-y-3 px-9 py-3 text-muted-foreground sm:flex sm:min-h-[65px] sm:items-center sm:justify-between sm:py-1">
          {meta.map((item, index) => (
            <div
              key={item.label}
              className={
                index > 0 ? 'sm:border-l sm:border-primary sm:pl-4' : ''
              }
            >
              <dt className={item.bold ? 'text-sm font-bold' : 'text-sm'}>
                {item.label}
              </dt>
              <dd className="text-[15px] break-all">{item.value}</dd>
            </div>
          ))}
        </dl>
        <Separator className="bg-primary" />
        <div className="flex flex-col gap-3 px-11 pt-5 pb-12">
          <h2 className="text-[15px] font-bold">Detalhes da transação</h2>
          <div className="flex justify-between text-base">
            <span className="font-bold">NFTs</span>
            <span className="flex gap-12">
              <span className="font-bold">Edições</span>
              <span className="font-medium">Subtotal</span>
            </span>
          </div>
          <Separator />
          <ul className="flex flex-col gap-3">
            {order.items.map((item) => (
              <li
                key={`${item.nftId}-${item.edition}`}
                className="flex min-h-[70px] items-center justify-between bg-card"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt=""
                    className="size-[66px] shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex flex-col gap-1.5 leading-4">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-[#b39463]">
                      ID do token: {item.tokenId} · {item.edition}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <span className="text-sm text-muted-foreground">
                    (x {item.quantity})
                  </span>
                  <span className="w-24 text-lg font-bold text-highlight">
                    {formatEth(item.lineTotal)} ETH
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <dl className="ml-auto flex w-[321px] max-w-full flex-col gap-3">
            {order.couponCode && (
              <div className="flex justify-between">
                <dt className="text-[15px]">Cupom {order.couponCode}</dt>
                <dd>(-) {formatEth(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-[15px]">Taxa de rede</dt>
              <dd className="text-lg">
                {formatEthWithSymbol(order.networkFee, 3)}
              </dd>
            </div>
            <div className="flex justify-between font-bold">
              <dt>Total</dt>
              <dd className="text-lg text-highlight">
                {formatEthWithSymbol(order.total, 3)}
              </dd>
            </div>
          </dl>
          <Separator />
          <ModalDescription className="text-center text-sm leading-[22px] text-muted-foreground">
            Transação confirmada na Ethereum. A propriedade foi transferida para
            sua carteira conectada e registrada na rede.
          </ModalDescription>
          <a
            href={`https://etherscan.io/tx/${order.txHash ?? ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto mt-4 rounded-[5px] bg-primary p-4 text-base font-bold text-primary-foreground"
          >
            Ver no Etherscan
            <span className="sr-only">
              {' '}
              (abre em nova aba; transação simulada)
            </span>
          </a>
        </div>
        <div className="h-2.5 bg-primary" />
      </ModalContent>
    </Modal>
  )
}
