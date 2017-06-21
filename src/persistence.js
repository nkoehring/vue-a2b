import {
  getCookie, writeCookie,
  getLocalStorage, writeLocalStorage
} from './toolbox'

export default {
  _store: null,
  name: 'split-test',
  method: 'cookie',
  expiry: 30,

  _load () {
    if (this.method === 'cookie')
      this._store = getCookie(this.name) || {}
    else if (this.method === 'localStorage')
      this._store = getLocalStorage(this.name, this.expiry) || {}
    else {
      console.warn("SPLIT TEST WARNING: No or invalid storage method. Data will not persist.")
      this._store = {}
    }
    return this._store
  },

  _save () {
    if (this.method === 'cookie')
      writeCookie(this.name, this._store, this.expiry)
    else if (this.method === 'localStorage')
      writeLocalStorage(this.name, this._store, this.expiry)
  },

  get entry () {
    return this._store || this._load()
  },

  set entry ({name, winner}) {
    this._store[name] = winner
    this._save()
  }
}
