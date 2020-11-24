const { MongoClient } = require('mongodb')

const url = 'mongodb://192.168.5.43:27011,192.168.5.43:27012,192.168.5.43:27013/example?replicaSet=rs0'

let client, db, collection

module.exports.init = async () => {
  client = await MongoClient.connect(url, { useUnifiedTopology: true })
  db = client.db('testdb')
  collection = db.collection('chats')
}

module.exports.getCollection = () => collection