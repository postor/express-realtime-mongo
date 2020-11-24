const express = require('express')
const next = require('next')
const { init } = require('./mongo')
const chat = require('./chat')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
  .then(() => init())
  .then(() => {
    const server = express()
    server.use('/chat', chat())
    server.all('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })