import * as toolbox from './toolbox'

const variationsObj = {
  A: 1,
  B: 2,
  C: 3
}

// emulating v-nodes like <component slot="A" change="1" />
const variationsArr = [
  { data: { slot: 'A', attrs: { chance: 1 } } },
  { data: { slot: 'B', attrs: { chance: 2 } } },
  { data: { slot: 'C', attrs: { chance: 3 } } }
]

describe('getCandidates', () => {
  const { getCandidates } = toolbox

  test('returns a list with the right chances from an object', () => {
    const actualResult = getCandidates(variationsObj)
    const expectedResult = ['A', 'B', 'B', 'C', 'C', 'C']

    expect(actualResult).toEqual(expectedResult)
  })

  test('returns a list with the right chances from a list of v-nodes', () => {
    const actualResult = getCandidates(variationsArr)
    const expectedResult = ['A', 'B', 'B', 'C', 'C', 'C']

    expect(actualResult).toEqual(expectedResult)
  })

  test('logs error and returns empty array when necessary', () => {
    // check on console.error and mute it for one call
    const consoleSpy = jest.spyOn(console, 'error').mockImplementationOnce(() => {})
    const actualResult = getCandidates()
    const expectedResult = []

    expect(actualResult).toEqual(expectedResult)
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})

describe('getCookie', () => {
  const { getCookie } = toolbox
  const cookieString = 'test=foobar; encoded=foo%20bar; json={"foo": "bar"}'
  const cookieSpy = jest.spyOn(document, 'cookie', 'get').mockReturnValue(cookieString)

  test('returns a cookie value', () => {
    const actualResult = getCookie('test')
    const expectedResult = 'foobar'

    expect(actualResult).toEqual(expectedResult)
  })

  test('decodes the cookie value', () => {
    const actualResult = getCookie('encoded')
    const expectedResult = 'foo bar'

    expect(actualResult).toEqual(expectedResult)
  })

  test('decodes JSON', () => {
    const actualResult = getCookie('json')
    const expectedResult = { foo: 'bar' }

    expect(actualResult).toEqual(expectedResult)
  })
})

describe('writeCookie', () => {
  const { writeCookie } = toolbox
  const cookieName = 'test'
  const cookieData = 'test-data'
  // TODO: assumes a lot of implementation details
  const cookieArgument = `${cookieName}=${encodeURIComponent(JSON.stringify(cookieData))}`
  const cookieSpy = jest.spyOn(document, 'cookie', 'set')

  beforeEach(() => {
    cookieSpy.mockClear()
  })

  test('sets a cookie value', () => {
    writeCookie(cookieName, cookieData)
    const actualResult = cookieSpy.mock.calls[0][0].slice(0, cookieArgument.length)
    const expectedResult = cookieArgument

    expect(actualResult).toEqual(expectedResult)
  })

  test('sets default expiration time', () => {
    writeCookie(cookieName, cookieData)
    const defaultExpiry = 30
    const resultSet = cookieSpy.mock.calls[0][0]
    const expiryDate = new Date(Date.now() + defaultExpiry * 24 * 3600 * 1000)
    const expectedResult = `expires=${expiryDate.toUTCString()}`

    expect(resultSet).toContain(expectedResult)
  })

  test('sets configured expiration time', () => {
    const daysTillExpiry = 42
    writeCookie(cookieName, cookieData, daysTillExpiry)
    const resultSet = cookieSpy.mock.calls[0][0]
    const expiryDate = new Date(Date.now() + daysTillExpiry * 24 * 3600 * 1000)
    const expectedResult = `expires=${expiryDate.toUTCString()}`

    expect(resultSet).toContain(expectedResult)
  })
})

describe('getLocalStorage', () => {
  const { getLocalStorage } = toolbox

  const itemName = 'test'
  const itemData = JSON.stringify({ is: 'future', expires: Date.now() + 10000 })
  const expiredItemData = JSON.stringify({ is: 'past', expires: Date.now() - 10000 })

  global.Storage.prototype.getItem = jest.fn()
    .mockReturnValueOnce(itemData)
    .mockReturnValue(expiredItemData)

  test('gets the item', () => {
    const actualResult = getLocalStorage(itemName)
    const expectedResult = JSON.parse(itemData)

    expect(actualResult).toEqual(expectedResult)
  })

  test('ignores expired items', () => {
    const actualResult = getLocalStorage(itemName)
    const expectedResult = null

    expect(actualResult).toEqual(expectedResult)
  })
})

describe('writeLocalStorage', () => {
  const { writeLocalStorage } = toolbox

  const itemName = 'test'
  const itemData = { test: 'item' }

  global.Storage.prototype.setItem = jest.fn()

  beforeEach(() => {
    global.Storage.prototype.setItem.mockClear()
  })

  test('writes data with default expiration time', () => {
    writeLocalStorage(itemName, itemData)

    const defaultExpiry = Date.now() + 30 * 24 * 3600 * 1000
    const actualCall = global.Storage.prototype.setItem.mock.calls[0]
    const expectedResult = { ...itemData, expires: defaultExpiry }

    expect(actualCall[0]).toEqual(itemName)
    expect(actualCall[1]).toEqual(JSON.stringify(expectedResult))
  })

  test('writes data with configured expiration time', () => {
    const daysTillExpiry = 42
    writeLocalStorage(itemName, itemData, daysTillExpiry)

    const expirationTime = Date.now() + daysTillExpiry * 24 * 3600 * 1000
    const actualCall = global.Storage.prototype.setItem.mock.calls[0]
    const expectedResult = { ...itemData, expires: expirationTime }

    expect(actualCall[0]).toEqual(itemName)
    expect(actualCall[1]).toEqual(JSON.stringify(expectedResult))
  })
})
