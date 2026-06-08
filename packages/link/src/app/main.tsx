import { createAppBridge } from './appBridge'
import { applyTheme } from './shell'
import { mountHello } from './flows/hello'
import { exchangeToken } from './linkClient'
import { handleInit } from './init'

const root = document.getElementById('hedge-root') as HTMLElement

const bridge = createAppBridge({
  onInit: (init) => {
    applyTheme((init as any).theme)
    handleInit(root, init, bridge, { exchange: exchangeToken, mount: mountHello })
  },
})
bridge.start()
