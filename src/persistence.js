import {
  getCookie, writeCookie,
  getLocalStorage, writeLocalStorage,
  randomCandidate
} from './toolbox'

export const storage = {
  _store: null,
  name: 'split-test', // name of cookie or localStorage entry
  method: 'cookie',   // supported methods are 'cookie' and 'localStorage'
  expiry: 30,         // ignore entries that weren't touched this amount of days

  _load () {
    if (window.streamlabsOBS) 
      window.Streamlabs.userSettings.get(this.name).then(data => this._store = data || {});
    else if (this.method === 'cookie')
      this._store = getCookie(this.name) || {}
    else if (this.method === 'localStorage')
      this._store = getLocalStorage(this.name, this.expiry) || {}
    else {
      console.warn("VueA2B WARNING: No or invalid storage method. Data will not persist.")
      this._store = {}
    }
    return this._store
  },

  _save () {
    if (window.streamlabsOBS) 
      window.Streamlabs.userSettings.set(this.name, this._store);
    if (this.method === 'cookie')
      writeCookie(this.name, this._store, this.expiry)
    else if (this.method === 'localStorage')
      writeLocalStorage(this.name, this._store, this.expiry)
  },

  get entry () {
    return this._store || this._load()
  },

  set entry ({name, winner}) {
    // avoid writing to non-existing storage when using "always" parameter
    // see https://github.com/nkoehring/vue-a2b/pull/12
    if (this._store === null) this._load()
    this._store[name] = winner
    this._save()
  }
}

export const selectAB = (name, variants) => {
  const winner = storage.entry[name] || randomCandidate(variants)
  storage.entry = {name, winner}
  return winner
}

