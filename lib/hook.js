const { useState, useEffect } = require('react')
const Client = require('./Client')
let cache = new Map()

function useRealtimeMongo(url) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!cache.has(url)) cache.set(url, new Client(url))
    let client = cache.get(url)
    setData(client.getData())
    let onChange = data => {
      console.log('onChange', data)
      setData(data)
    }
    client.on('change', onChange)
    return () => client.removeListener('change', onChange)
  }, [url])

  return data;
}

module.exports = useRealtimeMongo