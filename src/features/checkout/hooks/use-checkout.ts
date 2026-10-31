import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useSession } from '@/features/authentication'
import type { Cart } from '@/features/cart'
import { useCart } from '@/features/cart'
import {
  useCreateOrder,
  usePendingOrder,
} from '@/features/orders/hooks/use-orders'
import { clearAttempt, keyFor } from '@/features/orders/idempotency'
import type { CreateOrderBody } from '@/features/orders/services/orders.types'
import { useProfile } from '@/features/profile/hooks/use-profile'
import { announce } from '@/features/realtime'
import {
  useWalletConnection,
  useWallets,
} from '@/features/wallets/hooks/use-wallets'
import { useForm } from '@/hooks/use-form'
import {
  email,
  optionalWalletAddress,
  required,
  validate,
  walletAddress,
} from '@/lib/validators'
import { type ApiError, toApiError } from '@/services/api-error'
import { privateKeys } from '@/services/query-keys'

const MAX_ATTEMPTS = 3
const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

const initialForm = {
  displayName: '',
  username: '',
  profileName: '',
  email: '',
  referralCode: '',
  ensName: '',
  ensSuffix: '.eth',
  network: '',
  walletType: '',
  address: '',
  secondaryAddress: '',
  note: '',
}

export type Connection =
  | { status: 'idle' }
  | { status: 'connecting' }
  | { status: 'connected'; sessionId: string }
  | { status: 'rejected'; message: string }

export function useCheckout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useSession()
  const cartQuery = useCart()
  const profile = useProfile()
  const wallets = useWallets()
  const pending = usePendingOrder()
  const createOrder = useCreateOrder()
  const walletConnection = useWalletConnection()
  const form = useForm(initialForm)
  const [connection, setConnection] = useState<Connection>({ status: 'idle' })
  const [ackToken, setAckToken] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [retrying, setRetrying] = useState(false)
  const submitting = useRef(false)

  const cart = cartQuery.data
  const quoteToken = cart?.quote.token ?? null

  const prefilled = useRef(false)
  useEffect(() => {
    if (prefilled.current || !profile.data || !wallets.data) return
    prefilled.current = true
    const primary = wallets.data.primary
    const suggested = {
      displayName: profile.data.displayName,
      username: profile.data.username,
      email: profile.data.email,
      ensName: profile.data.ensName,
      ensSuffix: profile.data.ensSuffix || '.eth',
      profileName: primary?.profileName ?? profile.data.username,
      referralCode: primary?.referralCode ?? '',
      network: primary?.network ?? '',
      walletType: primary?.walletType ?? '',
      address: primary?.address ?? '',
      secondaryAddress: wallets.data.secondary?.address ?? '',
    }
    form.setValues((current) => {
      const next = { ...current }
      for (const key of Object.keys(suggested) as (keyof typeof suggested)[]) {
        if (!current[key] || (key === 'ensSuffix' && current[key] === '.eth')) {
          next[key] = suggested[key]
        }
      }
      return next
    })
  }, [profile.data, wallets.data, form.setValues])

  useEffect(() => {
    if (quoteToken && ackToken === null) setAckToken(quoteToken)
  }, [quoteToken, ackToken])
  const needsReview = Boolean(quoteToken && ackToken && quoteToken !== ackToken)

  useEffect(() => {
    if (pending.data)
      router.navigate({
        to: '/orders/$orderId',
        params: { orderId: pending.data.id },
      })
  }, [pending.data, router])

  const { network, walletType } = form.values
  // biome-ignore lint/correctness/useExhaustiveDependencies: reinicia a conexão ao mudar carteira/rede
  useEffect(() => {
    setConnection((current) =>
      current.status === 'idle' ? current : { status: 'idle' },
    )
  }, [network, walletType])

  async function connect() {
    if (!walletType || !network) {
      setConnection({
        status: 'rejected',
        message: 'Selecione a carteira e a rede.',
      })
      return
    }
    setConnection({ status: 'connecting' })
    try {
      const result = await walletConnection.connect.mutateAsync({
        walletType,
        network,
      })
      setConnection({ status: 'connected', sessionId: result.sessionId })
      announce(`${walletType} conectada.`, 'success')
    } catch (error) {
      setConnection({ status: 'rejected', message: toApiError(error).message })
    }
  }

  async function disconnect() {
    if (connection.status !== 'connected') return
    const { sessionId } = connection
    setConnection({ status: 'idle' })
    try {
      await walletConnection.disconnect.mutateAsync(sessionId)
      announce('Carteira desconectada.')
    } catch {}
  }

  function applyCart(next: Cart | undefined) {
    if (next) queryClient.setQueryData(privateKeys.cart(user?.id), next)
  }

  async function submit(event?: React.FormEvent) {
    event?.preventDefault()

    if (submitting.current || !cart || needsReview) return

    const errors = validate(form.values, {
      displayName: [required],
      username: [required],
      profileName: [required],
      email: [required, email],
      referralCode: [required],
      ensName: [required],
      network: [required],
      walletType: [required],
      address: [required, walletAddress],
      secondaryAddress: [optionalWalletAddress],
    })
    form.setErrors(errors)
    form.setFormError(null)
    setNotice(null)
    if (Object.keys(errors).length > 0) {
      announce('Revise os campos destacados.', 'error')
      return
    }
    if (connection.status !== 'connected') {
      setConnection({
        status: 'rejected',
        message: 'Conecte a carteira antes de confirmar.',
      })
      return
    }

    const values = form.values
    const body: CreateOrderBody = {
      quoteToken: cart.quote.token,
      couponCode: cart.coupon?.code ?? null,
      walletSessionId: connection.sessionId,
      buyer: {
        displayName: values.displayName,
        username: values.username,
        profileName: values.profileName,
        email: values.email,
        referralCode: values.referralCode,
        ensName: values.ensName,
        ensSuffix: values.ensSuffix,
        note: values.note || undefined,
      },
      payment: {
        network: values.network,
        walletType: values.walletType,
        address: values.address,
        secondaryAddress: values.secondaryAddress || undefined,
      },
    }
    const key = keyFor(JSON.stringify(body))

    submitting.current = true
    try {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        try {
          const order = await createOrder.mutateAsync({ body, key })
          setRetrying(false)
          await router.navigate({
            to: '/orders/$orderId',
            params: { orderId: order.id },
          })
          return
        } catch (error) {
          const apiError = toApiError(error)

          if (apiError.code === 'transient' && attempt < MAX_ATTEMPTS) {
            setRetrying(true)
            announce(
              'Conexão instável. Tentando novamente sem duplicar a compra…',
            )
            await wait(400 * attempt)
            continue
          }
          setRetrying(false)
          handleFailure(apiError)
          return
        }
      }
    } finally {
      submitting.current = false
    }
  }

  function handleFailure(error: ApiError) {
    clearAttemptIfFinal(error)
    if (error.code === 'quote_changed' || error.code === 'unavailable') {
      const details = error.body.details as { cart?: Cart } | undefined
      applyCart(details?.cart)
      setNotice(error.message)
      announce(error.message, 'error')
      return
    }
    if (error.code === 'validation') {
      form.setErrors(error.fields as never)
      form.setFormError(Object.keys(error.fields).length ? null : error.message)
      announce('Revise os campos destacados.', 'error')
      return
    }
    if (error.code === 'wallet_rejected') {
      setConnection({ status: 'rejected', message: error.message })
      return
    }
    form.setFormError(error.message)
    announce(error.message, 'error')
  }

  function clearAttemptIfFinal(error: ApiError) {
    if (error.code !== 'transient') clearAttempt()
  }

  return {
    form,
    cart,
    isCartLoading: cartQuery.isPending,
    isCartError: cartQuery.isError,
    refetchCart: cartQuery.refetch,
    profile,
    wallets: wallets.data,
    connection,
    connect,
    disconnect,
    needsReview,
    acceptNewQuote: () => setAckToken(quoteToken),
    notice,
    submit,
    isSubmitting: createOrder.isPending || retrying,
    isRetrying: retrying,

    isPreparing: profile.isPending || wallets.isPending,
    canSubmit: Boolean(
      cart &&
        cart.items.length > 0 &&
        !needsReview &&
        !profile.isPending &&
        !wallets.isPending,
    ),
  }
}
