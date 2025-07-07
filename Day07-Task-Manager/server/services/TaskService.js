const Task = require("../model/TaskModel");

const getAllTasks = async () => {
  return await Task.find();
};

const getTaskById = async (id) => {
  return await Task.findById(id);
};

const createtask = async (data) => {
  const task = new Task(data);
  return task.save();
};

const updateTask = async (id, data) => {
  return await Task.findByIdAndUpdate(id, data, { new: true });
};

const deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};

module.exports = {
  getAllTasks,
  getTaskById,
  createtask,
  updateTask,
  deleteTask,
};
