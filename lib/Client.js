const modes = require('./mode')
const axios = require('axios')
const { EventEmitter } = require('events')

module.exports = class Client extends EventEmitter {
  constructor(url, config = {}) {
    super()
    this.data = []
    this.sseUrl = ''
    if (typeof window === 'undefined') return
    let {
      maxLength = 10,
      init = async (that) => {
        let res = await axios.get(url)
        const { data, sse } = res.data
        that.data = data
        that.sseUrl = url.includes('?') ? url.replace('?', `${sse}?`) : url + sse
        that.emit('load', data)
        that.emit('change', data)
      }
    } = config
      ;
    (async () => {
      await init(this)
      this.sse = new EventSource(this.sseUrl)
      this.sse.addEventListener(modes.AppendNewRecord, ({ data }) => {
        let row = JSON.parse(data)
        this.data.length === maxLength && this.data.shift()
        this.data.push(row)
        this.data = [...this.data]
        console.log(this.data, row, { data })
        this.emit('append', row)
        this.emit('change', this.data)
      })
      this.sse.addEventListener(modes.ReloadAll, ({ data }) => {
        this.data = JSON.parse(data)
        this.emit('reload', this.data)
        this.emit('change', this.data)
      })
    })()
  }

  getData() {
    return this.data
  }


}

