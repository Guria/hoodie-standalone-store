/* global location */

var Store = require('hoodie-client-store')
var humbleLocalStorage = require('humble-localstorage')
var randomString = require('random-string')

var storeId = humbleLocalStorage.getItem('_storeId')
if (!storeId) {
  storeId = 'store-' + randomString({length: 7}).toLowerCase()
  humbleLocalStorage.setItem('_storeId', storeId)
}

var CustomStore = Store.defaults({
  remoteBaseUrl: location.origin + '/api'
})
global.store = new CustomStore(storeId)

module.exports = CustomStore
