import * as toolbox from './toolbox'

describe('getCandidates', () => {
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

  const { getCandidates } = toolbox

  test('that it returns a list with the right chances from an object', () => {
    const actualResult = getCandidates(variationsObj)
    const expectedResult = ['A', 'B', 'B', 'C', 'C', 'C']

    expect(actualResult).toEqual(expectedResult)
  })

  test('that it returns a list with the right chances from a list of v-nodes', () => {
    const actualResult = getCandidates(variationsArr)
    const expectedResult = ['A', 'B', 'B', 'C', 'C', 'C']

    expect(actualResult).toEqual(expectedResult)
  })

  test('that it logs error and returns empty array when necessary', () => {
    // check on console.error and mute it for one call
    const consoleSpy = jest.spyOn(console, 'error').mockImplementationOnce(() => {})
    const actualResult = getCandidates()
    const expectedResult = []

    expect(actualResult).toEqual(expectedResult)
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
