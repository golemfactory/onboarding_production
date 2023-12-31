export * from './mumbai'
export * from './polygon'

import { Network } from 'types/ethereum'
import { MUMBAI } from './mumbai'
import { POLYGON } from './polygon'
import { MAINNET } from './mainnet'

const allNetworks = {
  [Network.MUMBAI]: MUMBAI,
  [Network.POLYGON]: POLYGON,
  [Network.MAINNET]: MAINNET,
}

const productionNetworks = {
  [Network.POLYGON]: POLYGON,
  [Network.MAINNET]: MAINNET,
}

const networks =
  import.meta.env.MODE === 'production' ? productionNetworks : allNetworks

export { networks, MUMBAI, POLYGON }
