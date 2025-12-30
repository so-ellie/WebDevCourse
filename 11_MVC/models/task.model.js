class Task {
  constructor(title) {
    this.id = Date.now();
    this.title = title;
    this.completed = false;
  }

  complete() {
    this.completed = true;
  }
}

module.exports = Task; // Export the Task class for use in other modules
