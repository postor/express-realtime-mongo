const { getCollection } = require('./mongo')
const getRouter = require('../lib/get-route')
const { json } = require('body-parser')
// const modes = require('../lib/mode')


module.exports = function () {
  let col = getCollection()
  let router = getRouter(col, async channel => {
    let rtn = await col
      .find({ channel })
      .sort({ created: -1 })
      .limit(10)
      .toArray()
    return rtn.reverse()
  }, {
    getKey: req => req.query.channel,
    needUpdate: ({ fullDocument: { channel } }, key) => channel === key,
    // mode: modes.ReloadAll
  })

  router.use(json())
  router.post('/', async (req, res) => {
    try {
      res.json(await col.insertOne(Object.assign(req.body, { created: new Date() })))
    } catch (e) {
      res.json({ error: e.toString() || 'error happen!' })
    }
  })
  return router
}