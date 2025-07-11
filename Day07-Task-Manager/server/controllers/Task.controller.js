// const taskService = require("../services/TaskService");

// const getTasks = async (req, res) => {
//   try {
//     const tasks = await taskService.getAllTasks();
//     res.json(tasks);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const getTask = async (req, res) => {
//   try {
//     const task = await taskService.getTaskById(req.params.id);
//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }
//     res.json(task);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// const addTask = async(req,res) => {
//     try{
//         const newTask = await taskService.createtask(req.body);
//         res.status(201).json(newTask);
//     }
//     catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// const editTask = async (req, res) => {
//   try {
//     const updatedTask = await taskService.updateTask(req.params.id, req.body);
//     res.json(updatedTask);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// const removeTask = async (req, res) => {
//   try {
//     await taskService.deleteTask(req.params.id);
//     res.json({ message: 'Task deleted successfully' });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };


// module.exports = {
//   getTasks,
//   getTask,
//   addTask,
//   editTask,
//   removeTask,
// };


const taskService = require("../services/TaskService");

const getTasks = (req, res) => {
  try {
    const tasks = taskService.getAllTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTask = (req, res) => {
  try {
    const task = taskService.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const addTask = (req, res) => {
  try {
    const newTask = taskService.createtask(req.body);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editTask = (req, res) => {
  try {
    const updatedTask = taskService.updateTask(req.params.id, req.body);
    if (!updatedTask) return res.status(404).json({ error: "Task not found" });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const removeTask = (req, res) => {
  try {
    const deleted = taskService.deleteTask(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Task not found" });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getTasks,
  getTask,
  addTask,
  editTask,
  removeTask,
};
