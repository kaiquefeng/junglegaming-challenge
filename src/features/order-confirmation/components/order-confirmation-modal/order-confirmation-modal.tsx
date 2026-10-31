import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/button'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalTitle,
} from '@/components/modal'
import { Separator } from '@/components/separator'

const meta = [
  { label: 'ID da transação', value: '0xA91F…E82C', bold: true },
  { label: 'Data', value: '29 Jul, 2026' },
  { label: 'Total', value: '26.846 ETH' },
  { label: 'Carteira', value: 'MetaMask', bold: true },
]

const items = [
  {
    name: 'Emerald Ape #042',
    tokenId: '#0042',
    quantity: 2,
    total: '2.38',
    image: 'emerald-ape',
  },
  {
    name: 'Violet Nomad #314',
    tokenId: '#0314',
    quantity: 6,
    total: '8.34',
    image: 'sage-nomad',
  },
  {
    name: 'Ivory Baron #088',
    tokenId: '#0088',
    quantity: 9,
    total: '16.11',
    image: 'neon-vessel',
  },
]

export function OrderConfirmationModal() {
  const navigate = useNavigate()

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) navigate({ to: '/checkout' })
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
        <dl className="grid grid-cols-2 gap-y-3 px-9 py-3 text-muted-foreground sm:flex sm:h-[65px] sm:items-center sm:justify-between sm:py-1">
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
              <dd className="text-[15px]">{item.value}</dd>
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
            {items.map((item) => (
              <li
                key={item.name}
                className="flex h-[70px] items-center justify-between bg-card"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`/images/nfts/${item.image}.webp`}
                    alt=""
                    className="size-[66px] shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex flex-col gap-1.5 leading-4">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-[#b39463]">
                      ID do token: {item.tokenId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-12 text-right">
                  <span className="text-sm text-muted-foreground">
                    (x {item.quantity})
                  </span>
                  <span className="w-24 text-lg font-bold text-highlight">
                    {item.total} ETH
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <dl className="ml-auto flex w-[321px] max-w-full flex-col gap-3">
            <div className="flex justify-between">
              <dt className="text-[15px]">Taxa de rede</dt>
              <dd className="text-lg">0.016 ETH</dd>
            </div>
            <div className="flex justify-between font-bold">
              <dt>Total</dt>
              <dd className="text-lg text-highlight">26.846 ETH</dd>
            </div>
          </dl>
          <Separator />
          <ModalDescription className="text-center text-sm leading-[22px] text-muted-foreground">
            Transação confirmada na Ethereum. A propriedade foi transferida para
            sua carteira conectada e registrada na rede.
          </ModalDescription>
          <Button className="mx-auto mt-4 h-auto rounded-[5px] p-4 text-base font-bold">
            Ver no Etherscan
          </Button>
        </div>
        <div className="h-2.5 bg-primary" />
      </ModalContent>
    </Modal>
  )
}
