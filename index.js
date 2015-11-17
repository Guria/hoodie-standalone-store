module.exports = hapiCouchDbStore
hapiCouchDbStore.attributes = {
  name: 'couchdb-standalone-store'
}

var spawnPouchdbServer = require('spawn-pouchdb-server')
var storePlugin = require('hoodie-server-store')

function registerPlugins (server, options, next) {
  server.register({
    register: storePlugin,
    options: options
  }, {
    routes: {
      prefix: '/api'
    }
  }, function (error) {
    if (error) {
      throw error
    }
  })
  server.register({
    register: require('./lib/routes/client'),
    options: options
  }, function (error) {
    if (error) {
      throw error
    }
  })
  next()
}

function hapiCouchDbStore (server, options, next) {
  if (typeof options.couch === 'string') {
    server.log(['couchdb-store'], 'Proxying requests to ' + options.couch)
    return registerPlugins(server, {
      couchdb: options.couch
    }, next)
  }

  server.log(['couchdb-store'], 'Starting PouchDB Server...')
  spawnPouchdbServer(options.couch, function (error, pouch) {
    if (error) return next(error)

    var couchdb = 'http://localhost:' + pouch.config.httpd.port
    server.log(['couchdb-store'], 'PouchDB Server ready at ' + couchdb + '/_utils')
    registerPlugins(server, {
      couchdb: couchdb
    }, next)
  })
}
