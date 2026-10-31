import { Link } from '@tanstack/react-router'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { MobileScreenHeader } from '@/components/mobile-screen-header'

const initial = [
  {
    id: 'a',
    name: 'Emerald Ape #042',
    edition: '1/50',
    price: 1.19,
    quantity: 1,
    image: 'emerald-ape',
  },
  {
    id: 'b',
    name: 'Violet Nomad #314',
    edition: '1/1',
    price: 1.39,
    quantity: 1,
    image: 'sage-nomad',
  },
  {
    id: 'c',
    name: 'Ivory Baron #088',
    edition: '1/10',
    price: 1.79,
    quantity: 2,
    image: 'neon-vessel',
  },
  {
    id: 'd',
    name: 'Golden Beat #207',
    edition: '1/50',
    price: 0.99,
    quantity: 2,
    image: 'golden-beat',
  },
]

const FEE = 0.016

export function MobileCart() {
  const [items, setItems] = useState(initial)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const update = (id: string, delta: number) =>
    setItems((current) =>
      current.flatMap((item) => {
        if (item.id !== id) return [item]
        const quantity = item.quantity + delta
        return quantity < 1 ? [] : [{ ...item, quantity }]
      }),
    )

  return (
    <div className="flex min-h-[calc(100vh-84px)] flex-col gap-1 pt-8">
      <div className="flex flex-col gap-3 px-7">
        <MobileScreenHeader title="Carrinho de NFTs" centered />
        <ul className="flex flex-col gap-5">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex h-[100px] overflow-hidden rounded-[14px] bg-card shadow-[0_6px_20px_rgba(10,6,4,0.45)]"
            >
              <img
                src={`/images/nfts/${item.image}.webp`}
                alt=""
                className="size-[100px] shrink-0 object-cover"
              />
              <div className="relative flex flex-1 flex-col justify-between py-3 pr-3 pl-2.5">
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-[15px] font-bold">{item.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Edição: {item.edition}
                  </p>
                </div>
                <p className="text-lg font-bold text-highlight">
                  {(item.price * item.quantity).toFixed(2)} ETH
                </p>
                <div className="absolute right-3 bottom-4 flex items-center gap-2.5">
                  <button
                    type="button"
                    aria-label={
                      item.quantity === 1
                        ? `Remover ${item.name}`
                        : `Diminuir ${item.name}`
                    }
                    onClick={() => update(item.id, -1)}
                    className="flex size-6 items-center justify-center rounded-full border border-border bg-[#2f1d15] text-foreground"
                  >
                    {item.quantity === 1 ? (
                      <Trash2
                        aria-hidden="true"
                        className="size-3.5 text-highlight"
                      />
                    ) : (
                      <Minus aria-hidden="true" className="size-3.5" />
                    )}
                  </button>
                  <span className="w-3 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Aumentar ${item.name}`}
                    onClick={() => update(item.id, 1)}
                    className="flex size-6 items-center justify-center rounded-full border border-border bg-[#2f1d15] text-foreground"
                  >
                    <Plus aria-hidden="true" className="size-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex flex-col gap-6 rounded-t-[40px] bg-card px-6 pt-6 pb-9">
        <div className="flex flex-col gap-3">
          <div className="flex h-[50px] items-center rounded-[40px] border border-border pl-4 shadow-[0_6px_10px_rgba(10,6,4,0.45)]">
            <input
              aria-label="Código promocional"
              placeholder="Digite o código promocional..."
              className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#b39463]"
            />
            <button
              type="button"
              className="h-[50px] w-[97px] rounded-[40px] bg-[linear-gradient(96deg,rgba(210,138,76,0.54)_1%,#d28a4c_105%)] text-[15px] font-bold"
            >
              Aplicar
            </button>
          </div>
          <dl className="flex flex-col gap-3">
            <div className="flex justify-between text-[15px]">
              <dt>Subtotal</dt>
              <dd className="text-base">{subtotal.toFixed(2)} ETH</dd>
            </div>
            <div className="flex justify-between text-[15px]">
              <dt>Desconto do lançamento</dt>
              <dd>(-) 00.00</dd>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex w-full justify-between text-[15px]">
                <dt>Taxa de rede</dt>
                <dd className="text-base">{FEE.toFixed(3)} ETH</dd>
              </div>
              <p className="text-xs text-highlight">Taxa estimada</p>
            </div>
            <div className="flex justify-between font-bold">
              <dt>Total</dt>
              <dd className="text-lg text-highlight">
                {(subtotal + FEE).toFixed(3)} ETH
              </dd>
            </div>
          </dl>
        </div>
        <Link
          to="/checkout"
          className="flex h-[60px] items-center justify-center rounded-[40px] bg-[linear-gradient(109deg,#d28a4c_4%,rgba(210,138,76,0.8)_122%)] text-base font-bold text-primary-foreground"
        >
          Conectar e finalizar
        </Link>
      </div>
    </div>
  )
}
