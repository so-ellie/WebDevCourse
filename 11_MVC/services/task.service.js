const fs = require("fs");
const Task = require("../models/task.model"); // Import the Task class

//doing the actual data handling
class TaskService {
  constructor() {
    this.file = "./data/tasks.json";
  }

  getAll() {
    return JSON.parse(fs.readFileSync(this.file)); //read tasks from file
  }

  add(title) {
    const tasks = this.getAll();
    const task = new Task(title);
    tasks.push(task);
    fs.writeFileSync(this.file, JSON.stringify(tasks, null, 2));
  }
}

module.exports = new TaskService(); //each time someone does reference to this class, we create a new instance
// Export an instance of TaskService for use in other modules
