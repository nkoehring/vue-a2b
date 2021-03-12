// greatest common denominator
function gcd (a, b) {
  return b ? gcd(b, a % b) : a
}

// gcd for n elements
function gcdOfList (ary) {
  return ary.reduce((acc, v) => gcd(acc, v))
}

// create a list with test candidate that respects the selection chances
export function getCandidates (variations) {
  let names = []
  let chances = []

  if (typeof variations === 'undefined' || typeof variations === 'string') {
    console.error('VueAB: variations must be Array || Object')
  }
  else if (Array.isArray(variations)) { // assume list of VNodes
    variations.forEach(v => {
      if (v.data && v.data.slot) {
        const chanceAttr = v.data.attrs ? v.data.attrs.chance : NaN
        const chance = parseInt(chanceAttr) || 1
        names.push(v.data.slot)
        chances.push(chance)
      }
    })
  }
  else if (variations !== null && typeof variations === 'object') {
    // assume name:chance object
    Object.keys(variations).forEach(k => {
      names.push(k)
      chances.push(parseInt(variations[k]) || 1)
    })
  }

  const divisor = chances.length ? gcdOfList(chances) : 1

  return names.reduce((result, name, i) => {
    const n = Math.round(chances[i] / divisor)
    for (let i = 0; i < n; i++) result.push(name)
    return result
  }, [])
}

// return random element of array
export function pickRandomlyFrom (array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

// pick a random candidate respecting the selection chances
export function randomCandidate (variations) {
  const candidates = getCandidates(variations)
  return pickRandomlyFrom(candidates)
}

function daysToMilliseconds (days) {
  return days * 24 * 3600 * 1000
}

export function getCookie (name) {
  const entries = document.cookie.split(';')
  const len = name.length

  for (const i in entries) {
    const entry = entries[i].trim()

    if (entry.substr(0, len) === name) {
      const value = decodeURIComponent( entry.slice(len + 1) )
      return JSON.parse(value)
    }
  }
}

export function writeCookie (name, data, expiry) {
  const d = new Date()
  d.setTime(d.getTime() + daysToMilliseconds(expiry))

  const options = `expires=${d.toUTCString()};path=/`
  data = encodeURIComponent(JSON.stringify(data))
  document.cookie = `${name}=${data};${options}`
}

export function getLocalStorage (name) {
  const entry = JSON.parse(localStorage.getItem(name))
  return entry && entry.expires > Date.now() ? entry : null
}

export function writeLocalStorage (name, value, expiry) {
  value.expires = Date.now() + daysToMilliseconds(expiry)
  localStorage.setItem(name, JSON.stringify(value))
}
