const taskService = require("../services/task.service"); //taskService is an object created from TaskService class, no need to do new here

class TaskController {
  list(req, res) {
    const tasks = taskService.getAll();
    res.render("tasks", { tasks });
  }

  create(req, res) {
    taskService.add(req.body.title);
    res.redirect("/tasks");
  }
}

module.exports = new TaskController();
