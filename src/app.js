const express = require('express')

module.exports = (router) => {
    const app = express()
    app.use(express.json())
    app.use(router)
    return app
  }