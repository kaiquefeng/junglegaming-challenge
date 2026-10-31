import { authHandlers } from './auth'
import { cartHandlers } from './cart'
import { catalogHandlers } from './catalog'
import { controlHandlers } from './control'
import { favoritesHandlers } from './favorites'
import { healthHandlers } from './health'
import { homeContentHandlers } from './home-content'
import { ordersHandlers } from './orders'
import { profileHandlers } from './profile'
import { walletsHandlers } from './wallets'

export const handlers = [
  ...controlHandlers,
  ...healthHandlers,
  ...authHandlers,
  ...catalogHandlers,
  ...favoritesHandlers,
  ...cartHandlers,
  ...ordersHandlers,
  ...profileHandlers,
  ...walletsHandlers,
  ...homeContentHandlers,
]
