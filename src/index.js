import storage from './persistence'
import { randomCandidate } from './toolbox'

const VueSplitter = {
  install (Vue, options = {}) {

    if (options.storage) {
      const cfg = options.storage
      if (cfg.name) storage.name = cfg.name
      if (cfg.method) storage.method = cfg.method
    }

    Vue.component(options.component || 'split-test', {
      functional: true,
      props: [ 'always', 'name' ],
      beforeMount () {
        if (!ctx.props.name && !ctx.parent.$options.name) {
          throw "Split Test Error: The test name is mandatory!"
        }
      },
      render (h, ctx) {
        const name = ctx.props.name || ctx.parent.$options.name
        const variations = ctx.slots()
        const winner = storage.entry[name]
          || ctx.props.always
          || randomCandidate(ctx.children)

        storage.entry = {name, winner}
        return variations[winner]
      }
    })
  }
}

export default VueSplitter
