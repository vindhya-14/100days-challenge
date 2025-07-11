// const Task = require("../model/TaskModel");

// const getAllTasks = async () => {
//   return await Task.find();
// };

// const getTaskById = async (id) => {
//   return await Task.findById(id);
// };

// const createtask = async (data) => {
//   const task = new Task(data);
//   return task.save();
// };

// const updateTask = async (id, data) => {
//   return await Task.findByIdAndUpdate(id, data, { new: true });
// };

// const deleteTask = async (id) => {
//   return await Task.findByIdAndDelete(id);
// };

// module.exports = {
//   getAllTasks,
//   getTaskById,
//   createtask,
//   updateTask,
//   deleteTask,
// };

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/tasks.json');

function readTasks() {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

function writeTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

const getAllTasks = () => {
  return readTasks();
};

const getTaskById = (id) => {
  const tasks = readTasks();
  return tasks.find(task => task.id === id);
};

const createtask = (data) => {
  const tasks = readTasks();
  const newTask = {
    ...data,
    id: Date.now().toString(), // unique id
    status: data.status || "Pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  writeTasks(tasks);
  return newTask;
};

const updateTask = (id, data) => {
  const tasks = readTasks();
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) return null;
  tasks[index] = {
    ...tasks[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  writeTasks(tasks);
  return tasks[index];
};

const deleteTask = (id) => {
  const tasks = readTasks();
  const updatedTasks = tasks.filter(task => task.id !== id);
  if (tasks.length === updatedTasks.length) return false;
  writeTasks(updatedTasks);
  return true;
};

module.exports = {
  getAllTasks,
  getTaskById,
  createtask,
  updateTask,
  deleteTask,
};

