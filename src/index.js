// greatest common denominator
function gcd (a,b) {
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
    for(let i = 0; i < n; i++) result.push(name)
    return result
  }, [])
}

function pickRandomlyFrom (array) {
  const index = Math.round(Math.random() * array.length)
  return array[index]
}

function getCookie (cookieName, testName) {
  console.log("getCookie", cookieName, testName)
  /* TODO */
}

function setCookie (cookieName, testName, winner) {
  console.log("setCookie", cookieName, testName, winner)
  /* TODO */
}

const VueSplitter = {
  install (Vue, options = {}) {
    const componentName = options.component || 'split-test'
    const cookieName = options.cookie || 'split-test'

    Vue.component(componentName, {
      functional: true,
      props: [ 'always', 'name' ],
      render (h, ctx) {
        const name = ctx.props.name || ctx.parent.$options.name
        if (!name) throw "Split Test Error: The test name is mandatory!"

        const variations = ctx.slots()
        const winner = getCookie(cookieName, name)
          || ctx.props.always
          || pickRandomlyFrom(getCandidates(ctx.children))

        setCookie(cookieName, name, winner)
        return variations[winner]
      }
    })
  }
}

export default VueSplitter
