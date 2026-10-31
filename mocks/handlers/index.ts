import { catalogHandlers } from './catalog'
import { healthHandlers } from './health'
import { homeContentHandlers } from './home-content'

export const handlers = [
  ...healthHandlers,
  ...catalogHandlers,
  ...homeContentHandlers,
]
