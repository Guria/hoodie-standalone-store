var EventEmitter = require('events').EventEmitter
var path = require('path')

var browserify = require('browserify')([], {
  standalone: 'Store'
})
browserify.require(path.resolve(__dirname, '../../client'))

var bundleEE = new EventEmitter()
var STOREJS = null

bundleEE.on('done', function (error, buffer) {
  if (error) throw error
  STOREJS = buffer
})
browserify.bundle(bundleEE.emit.bind(bundleEE, 'done'))

module.exports = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/store.js',
    handler: function (request, reply) {
      if (!STOREJS) {
        return bundleEE.once('done', function (error, buffer) {
          if (!error) reply(buffer).type('application/javascript')
        })
      }
      reply(STOREJS).type('application/javascript')
    }
  })
  next()
}

module.exports.attributes = {
  name: 'couchdb-store-client'
}
