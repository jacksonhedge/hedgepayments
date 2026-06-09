import { createAppBridge } from './appBridge'
import { applyTheme } from './shell'
import { mountHello } from './flows/hello'
import { mountChance } from './flows/chance'
import { exchangeToken, consumeSession } from './linkClient'
import { handleInit } from './init'

const root = document.getElementById('hedge-root') as HTMLElement

const bridge = createAppBridge({
  onInit: (init) => {
    applyTheme((init as any).theme)
    handleInit(root, init, bridge, {
      exchange:  exchangeToken,
      consumeFn: consumeSession,
      mount: (r, ctx) => {
        if (ctx.product === 'chance') mountChance(r, ctx)
        else mountHello(r, ctx)
      },
    })
  },
})
bridge.start()
