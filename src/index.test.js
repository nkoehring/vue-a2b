import { createLocalVue, mount } from '@vue/test-utils'
import * as persistence from './persistence'
import * as toolbox from './toolbox'
import VueAB from '.'

// jest.mock('./persistence')
const storageGetEntry = jest.spyOn(persistence.storage, 'entry', 'get').mockReturnValue('A')
const storageSetEntry = jest.spyOn(persistence.storage, 'entry', 'set')

jest.mock('./toolbox')

// always return candidate "A"
toolbox.randomCandidate.mockReturnValue('A')

let localVue

beforeEach(() => {
  localVue = createLocalVue()
})

test('that the component is defined', () => {
  localVue.use(VueAB)
  const installedComponents = Object.keys(localVue.sealedOptions.components)
  expect(installedComponents).toContain('split-test')
})

test('that the component can be renamed', () => {
  localVue.use(VueAB, { component: 'new-name' })
  const installedComponents = Object.keys(localVue.sealedOptions.components)
  expect(installedComponents).not.toContain('split-test')
  expect(installedComponents).toContain('new-name')
})

test('that storage options are not cleared', () => {
  localVue.use(VueAB, { storage: {} })
  expect(persistence.storage.name).toEqual('split-test')
  expect(persistence.storage.method).toEqual('cookie')
  expect(persistence.storage.expiry).toEqual(30)
})

test('that storage options are respected', () => {
  localVue.use(VueAB, { storage: { name: 'test-name', method: 'localStorage', expiry: 42 } })
  expect(persistence.storage.name).toEqual('test-name')
  expect(persistence.storage.method).toEqual('localStorage')
  expect(persistence.storage.expiry).toEqual(42)
})

describe('component functionality', () => {
  let ComponentAB
  let ComponentAlwaysB
  let ComponentName
  let ComponentNoName

  beforeEach(() => {
    toolbox.randomCandidate.mockClear()
    localVue.use(VueAB)
    ComponentAB = {
      template: '<split-test name="ab"><p slot="A">TEST A<p><p slot="B">TEST B</p></split-test>'
    }
    ComponentAlwaysB = {
      template: '<split-test name="alwaysB" always="B"><p slot="A">TEST A<p><p slot="B">TEST B</p></split-test>'
    }
    ComponentName = {
      name: 'component-name',
      template: '<split-test><p slot="A">TEST A<p><p slot="B">TEST B</p></split-test>'
    }
    ComponentNoName = {
      template: '<split-test><p slot="A">TEST A<p><p slot="B">TEST B</p></split-test>'
    }
  })

  test('renders an option', () => {
    const wrapper = mount(ComponentAB, { localVue })
    expect(wrapper.text()).toBe('TEST A')
  })

  test('renders always a specific option if wanted', () => {
    const wrapper = mount(ComponentAlwaysB, { localVue })
    expect(wrapper.text()).toBe('TEST B')
    expect(toolbox.randomCandidate.mock.calls.length).toBe(0)
  })

  test('uses component name', () => {
    const wrapper = mount(ComponentName, { localVue })
    expect(storageSetEntry).toHaveBeenCalledWith({ name: 'component-name', winner: 'A' })
  })

  /// this doesn't work and I don't know how to test it
  // test('throws without name', () => {
  //   expect(mount(ComponentNoName, { localVue })).toThrow()
  // })
})
