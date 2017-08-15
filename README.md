# vue-a2b

> split testing for Vuejs

## Usage

Add the package to your project:

``` bash
yarn add vue-a2b
# or
npm install vue-a2b
```

…and register it to Vue:

``` js
import VueAB from 'vue-a2b'
Vue.use(VueAB)
```

*vue-a2b* uses [named slots](https://vuejs.org/v2/guide/components.html#Named-Slots) for defining test variations.
Any amount of variations is supported (A/B/n). The the variation identifier should be used as slot name and can be any valid string.
Selection chances are given as ratio. In the first example, **test A** has twice the chance to be selected over **test B**:

    Note: Selection chances are parsed as whole numbers, so instead of 2.5 and 1 use 5 and 2.

### minimal example

``` html
<template>
  <split-test>
    <component slot="A" chance="2" />
    <component slot="B" chance="1" />
  </split-test>
</template>
```

### more examples

Chances are optional. If left out, every test gets the same chance to be picked.
The selection can also be forced with the *always* parameter, which is useful for testing:

``` html
<template>
  <split-test always="B"> <!-- will always choose B, no matter the chances -->
    <component slot="A" chance="2" />
    <component slot="B" chance="1" />
  </split-test>
</template>
```

If more than one element is part of the test, use template tags:

``` html
<template>
  <split-test>
    <template slot="A" chance="2">
      <button>hello</button>
      <button>World</button>
    </template>
    <template slot="B" chance="1">
      <button>hey ho</button>
      <button>lets go</button>
    </template>
  </split-test>
</template>
```

## functional usage

Since version `0.2` functional usage is supported. The component scope now has the `$abtest` method. It can be used to initialize an A/B test without the `<split-test>` component or to get the test value:

To initialize a new test, `created()` is a good spot:
``` js
export default {
  created () {
    // creates a test 'fancy-bubbles' with 75% chance for even more bubbles
    this.$abtest('fancy-bubbles', { bubbles: 25, lotsOfBubbles: 75 })
  }
}
```

To get a value, for example in data, just call `$abtest` again:
``` js
export default {
  data () {
    return {
      more_bubbles: this.$abtest('fancy-bubbles') === 'lotsOfBubbles'
    }
  }
}
```

The function is reachable for the template as well:

```html
<template>
  <div :class='$abtest("fancy-bubbles")'>bubbles!</div>
</template>

<style>
.lotsOfBubbles {
  font-size: var(--extra-big);
}
</style>
```

### outside of components

`vue-a2b` exports the abtest method among others, so it is possible to access it via:

```js
import { abtest } from 'vue-a2b'
```

Additionally `randomCandidate` is exported, which allows to get a randomly picked sample out of a list of VNodes or an object:

```
import { randomCandidate } from 'vue-a2b'

// pics a random candidate foo, bar, baz with 75%, 20%, 5% chance respectively
const candidate = randomCandidate({
  foo: 75,
  bar: 20,
  baz: 5
})

## Settings

### Test name

The test name needs to be set with the name attribute. If no name is given,
it might be deferred from the parent components name attribute.

``` html
<template>
  <split-test name="the-one-test">
    <component slot="A" chance="2" />
    <component slot="B" chance="1" />
  </split-test>
</template>
```

    Attention: Test name is mandatory!

### Storage options

You can set storage method, name and expiry on initialization. Supported methods are `cookie` (the default) and `localStorage`.

``` js
Vue.use(VueAB, {
  storage: {
    method: 'localStorage',
    name: 'project42'
  }
})
```

The stored value expires after 30 days by default. This can be changed:

``` js
Vue.use(VueAB, {
  storage: {
    method: 'cookie',
    expiry: 7 // one week until the cookie expires
  }
})
```

    Note: LocalStorage doesn't support expiration by default but the entries get
    a timestamp and old entries will be ignored to make expiration possible.

    Note: The expiry date is refreshed with every page visit. The entry only
    expires, if the user doesn't come back in the specified time.

### Component Name

By default `<split-test>` is the component that wraps a new test. This name can be overwritten on initialization:

``` js
Vue.use(VueAB, {component: 'a-b'})
```
``` html
<template>
  <a-b>
    <!-- variants -->
  </a-b>
</template>
```

## Build setup

We recommend to use [yarn](https://yarnpkg.com) but [npm](https://www.npmjs.com/) works too:

``` bash
# Install dependencies
yarn install
# or
npm install

# Build for production with minification
yarn build
# or
npm run build
```

## License

MIT © fromAtoB GmbH <norman.koehring@fromatob.com>
