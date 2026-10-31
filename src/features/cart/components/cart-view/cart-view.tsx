import { Link } from '@tanstack/react-router'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Separator } from '@/components/separator'
import type { CartItem } from './cart-view.types'

const initialItems: CartItem[] = [
  {
    id: 'emerald-ape',
    name: 'Emerald Ape #042',
    tokenId: '#0042',
    price: 1.19,
    quantity: 2,
    image: '/images/nfts/emerald-ape.webp',
  },
  {
    id: 'violet-nomad',
    name: 'Violet Nomad #314',
    tokenId: '#0009',
    price: 1.39,
    quantity: 6,
    image: '/images/nfts/sage-nomad.webp',
  },
  {
    id: 'ivory-baron',
    name: 'Ivory Baron #088',
    tokenId: '#0552',
    price: 1.79,
    quantity: 9,
    image: '/images/nfts/neon-vessel.webp',
  },
]

const NETWORK_FEE = 0.016

const eth = (value: number, digits = 2) => `${value.toFixed(digits)} ETH`

export function CartView() {
  const [items, setItems] = useState(initialItems)

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  function changeQuantity(id: string, delta: number) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    )
  }

  return (
    <section className="flex flex-col gap-3">
      <p className="text-[15px] font-bold">Início / Mercado / Carrinho</p>
      <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
        <div className="flex min-w-0 flex-col gap-3 lg:w-[782px]">
          <div className="hidden items-center pr-6 text-base sm:grid sm:grid-cols-[1fr_77px_75px_87px_24px] sm:gap-4">
            <span className="font-bold">NFTs</span>
            <span className="font-medium">Preço</span>
            <span className="font-bold">Edições</span>
            <span className="font-medium">Total</span>
            <span />
          </div>
          <Separator />
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="grid grid-cols-[1fr_auto] items-center gap-4 bg-card pr-6 sm:min-h-[70px] sm:grid-cols-[1fr_77px_75px_87px_24px]"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt=""
                    className="size-[70px] shrink-0 rounded-md object-cover"
                  />
                  <div className="flex flex-col gap-1.5 leading-4">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-[#b39463]">
                      ID do token: {item.tokenId}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-muted-foreground">
                  {eth(item.price)}
                </p>
                <div className="flex items-center justify-between">
                  <Button
                    size="icon"
                    className="h-[30px] w-5 rounded-full"
                    aria-label={`Diminuir quantidade de ${item.name}`}
                    onClick={() => changeQuantity(item.id, -1)}
                  >
                    <Minus aria-hidden="true" className="size-4" />
                  </Button>
                  <span className="text-[17px]">{item.quantity}</span>
                  <Button
                    size="icon"
                    className="h-[30px] w-5 rounded-full"
                    aria-label={`Aumentar quantidade de ${item.name}`}
                    onClick={() => changeQuantity(item.id, 1)}
                  >
                    <Plus aria-hidden="true" className="size-4" />
                  </Button>
                </div>
                <p className="font-bold text-highlight">
                  {eth(item.price * item.quantity)}
                </p>
                <button
                  type="button"
                  aria-label={`Remover ${item.name}`}
                  onClick={() =>
                    setItems((current) =>
                      current.filter((other) => other.id !== item.id),
                    )
                  }
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Trash2 aria-hidden="true" className="size-6" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <aside className="flex w-full flex-col gap-6 lg:w-[332px]">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold">Resumo da carteira</h2>
            <Separator />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="promo" className="text-sm font-bold">
              Código promocional
            </label>
            <div className="flex h-10 items-center rounded-[3px] border border-primary pl-2">
              <Input
                id="promo"
                placeholder="Digite o código promocional..."
                className="h-full flex-1 border-0 bg-transparent px-0 text-xs shadow-none focus-visible:ring-0"
              />
              <Button className="h-10 w-[102px] rounded-l-none rounded-r-[3px] font-bold">
                Aplicar
              </Button>
            </div>
          </div>
          <dl className="flex flex-col gap-3">
            <div className="flex justify-between text-[15px]">
              <dt>Subtotal</dt>
              <dd className="text-lg">{eth(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-[15px]">
              <dt>Desconto do lançamento</dt>
              <dd>(-) 00.00</dd>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex w-full justify-between text-[15px]">
                <dt>Taxa de rede</dt>
                <dd className="text-lg">{eth(NETWORK_FEE, 3)}</dd>
              </div>
              <p className="text-xs text-highlight">Taxa estimada</p>
            </div>
          </dl>
          <p className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-lg text-highlight">
              {eth(subtotal + NETWORK_FEE, 3)}
            </span>
          </p>
          <div className="flex flex-col items-center gap-3">
            <Button asChild className="h-10 w-full rounded-[3px] font-bold">
              <Link to="/checkout">Conectar e finalizar</Link>
            </Button>
            <Link to="/" className="text-[15px] text-highlight">
              Continuar explorando
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
