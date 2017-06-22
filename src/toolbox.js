// greatest common denominator
function gcd (a, b) {
  return b ? gcd(b, a % b) : a
}

// gcd for n elements
function gcdOfList (ary) {
  return ary.reduce((acc, v) => gcd(acc, v))
}

// create a list with test candidate that respects the selection chances
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

// return random element of array
export function pickRandomlyFrom (array) {
  const index = Math.round(Math.random() * array.length)
  return array[index]
}

// pick a random candidate respecting the selection chances
export function randomCandidate (variations) {
  const candidates = getCandidates(variations)
  return pickRandomlyFrom(candidates)
}

function daysToMicroSeconds (days) {
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
  d.setTime(d.getTime() + daysToMicroSeconds(expiry))

  const options = `expires=${d.toUTCString()};path=/`
  data = encodeURIComponent(JSON.stringify(data))
  document.cookie = `${name}=${data};${options}`
}

export function getLocalStorage (name, expiry) {
  const d = new Date()
  d.setTime(d.getTime() + daysToMicroSeconds(expiry))
  const entry = JSON.parse(localStorage.getItem(name))

  return entry && entry.expires > d.getTime() ? entry : null
}

export function writeLocalStorage (name, value, expiry) {
  value.expiry = new Date().getTime() + daysToMicroSeconds(expiry)
  localStorage.setItem(name, JSON.stringify(value))
}
