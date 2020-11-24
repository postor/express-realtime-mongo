# express-realtime-mongo

## usage

get router

```
const getRouter = require('express-realtime-mongo/lib/get-route')
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
```

use router in express

```
const server = express()
server.use('/realtimedb', router)
```

use in browser

```
const Client = require('express-realtime-mongo/lib/Client')
let client = new Client('/realtimedb')

client.on('change',data=>console.log(data))
```