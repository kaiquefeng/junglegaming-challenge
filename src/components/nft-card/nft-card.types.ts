export type NftCardProps = {
  id: string
  name: string

  price: string
  previousPrice?: string
  currency: string
  image: string
  imageAlt: string
  soldOut?: boolean
  favorite?: {
    active: boolean
    onToggle: () => void
  }
  className?: string
}
