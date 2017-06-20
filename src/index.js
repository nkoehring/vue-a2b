// greatest common denominator
function gcd (a, b) {
  return b ? gcd(b, a % b) : a
}

function gcdOfList (ary) {
  return ary.reduce((acc, v) => gcd(acc, v))
}

function getCandidates (variations) {
  const equalChance = Math.round(100.0 / variations.length)
  let names = []
  let chances = []

  variations.forEach(v => {
    if (v.data && v.data.slot) {
      const chance = parseInt(v.data.attrs.chance) || equalChance
      names.push(v.data.slot)
      chances.push(chance)
    }
  })

  const divisor = gcdOfList(chances)

  return names.reduce((result, name, i) => {
    const n = Math.round(chances[i] / divisor)
    for (let i = 0; i < n; i++) result.push(name)
    return result
  }, [])
}

function pickRandomlyFrom (array) {
  const index = Math.round(Math.random() * array.length)
  return array[index]
}

const VueSplitter = {
  install (Vue) {
    // Vue.directive('some-directive', (el, binding, vnode) => {})
    Vue.component('split-test', {
      functional: true,
      props: [ 'winner' ],
      render (h, ctx) {
        const variations = ctx.slots()

        const winner = ctx.props.winner
          ? ctx.props.winner
          : pickRandomlyFrom(getCandidates(ctx.children))

        const variation = variations[winner]

        // DEBUG
        console.log('SPLIT', winner)
        // END DEBUG

        return variation
      }
    })
  }
}

export default VueSplitter
