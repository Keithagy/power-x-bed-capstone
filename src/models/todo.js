class Todo {
    constructor({ id, parent, topic, body, completed }) {
      this.id = id
      this.parent = parent
      this.topic = topic
      this.body = body
      this.completed = completed
    }
  }
  
  module.exports = Todo
  