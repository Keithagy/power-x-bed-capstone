require('dotenv').config()
const amqplib = require('amqplib')

const URL = 'amqp://localhost:5672'
const QUEUE = 'NewAccess'

module.exports = () => {
  const service = {}

  service.publishNewAccess = async (listId, newAccessEmail) => {
    const client = await amqplib.connect(URL)
    const channel = await client.createChannel()
    await channel.assertQueue(QUEUE)
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify({listId, newAccessEmail})), {
      contentType: 'application/json',
    })
    await channel.close()
    await client.close()
  }
  
  return service
}