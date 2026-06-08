import { createAppBridge } from './appBridge'
import { applyTheme } from './shell'
import { mountHello } from './flows/hello'

const root = document.getElementById('hedge-root') as HTMLElement

const bridge = createAppBridge({
  onInit: (init) => {
    applyTheme((init as any).theme)
    bridge.emit('OPEN')
    mountHello(root, {
      token: init.token,
      config: {},
      emit: (n, x) => bridge.emit(n, x),
      success: (r) => bridge.success(r),
      exit: (e) => bridge.exit(e),
    })
  },
})
bridge.start()
