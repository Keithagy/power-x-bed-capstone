class List {
    constructor({ id, creator, accessibleTo, title, todos }) {
      this.id = id
      this.creator = creator
      this.accessibleTo = accessibleTo
      this.title = title
      this.todos = todos
    }
  }
  
  module.exports = List
  
  