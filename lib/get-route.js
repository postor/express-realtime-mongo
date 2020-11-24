const { Router } = require("express")
const SSE = require('express-sse')
const Watcher = require('mongodb-change-watcher').default
const modes = require('./mode')

module.exports = function (collection, asyncGetData, options = {}) {
  const {
    getKey = req => '',
    method = 'get',
    restPath = '/',
    getSSEPath = key => `/_sse_${key}`,
    onError = (e, res) => res.json({ error: e.toString() || 'error happen!' }),
    needUpdate = (change, key) => true,
    onSseError = (e, sse) => { throw e },
    mode = modes.AppendNewRecord
  } = options
  let router = Router()
    , sseDic = new Map()
    , watcher = new Watcher(collection)
    , queue = [], looping = false

  watcher.onChange(change => {
    for (let [key, sse] of sseDic.entries()) {
      queue.push({ key, sse, change })
    }
    if (!looping) loop()
  })

  router.use('/sse/:key', (req, res, next) => {
    let { key } = req.params
    if (!sseDic.has(key)) {
      let sse = new SSE([])
      sseDic.set(key, sse)
    }
    return sseDic.get(key).init(req, res, next)
  })
  router[method](restPath, (req, res) => {
    let key = getKey(req)
    if (!sseDic.has(key)) {
      let sse = new SSE([])
      sseDic.set(key, sse)
    }
    ;
    (async () => {
      try {
        res.json({
          data: await asyncGetData(key),
          sse: `/sse/${key}`,
        })
      } catch (e) {
        onError(e)
      }
    })()
  })

  let stop = () => { }
  watcher.onChange(change => {
    stop()
    stop = loop(change)
  })
  return router

  async function loop() {
    looping = true
    while (queue.length) {
      let { key, sse, change } = queue.shift()
      if (!needUpdate(change, key)) continue
      if (mode === modes.AppendNewRecord) {
        if (change.operationType !== 'insert') continue
        sse.send(change.fullDocument, modes.AppendNewRecord)
        continue
      }
      let result = await asyncGetData(key)
      sse.send(result, modes.ReloadAll)
    }
    looping = false
  }
}

