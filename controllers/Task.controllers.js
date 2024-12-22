import Task from "../model/Task.model.js";

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render('tasks', { tasks });
  } catch (error) {
    console.log(error);
    res.status(500).send('Failed to fetch tasks');
  }
};

export const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.render('task', { task });
  } catch (error) {
    res.status(500).send('Failed to fetch task');
  }
};

export const createTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTask = new Task({ title, description });
    await newTask.save();
    console.log("Saved");
    res.redirect('/tasks');
  } catch (error) {
    res.status(500).send('Failed to create task');
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, { title, description });
    if (!updatedTask) {
      return res.status(404).send('Task not found');
    }
    res.redirect('/tasks');
  } catch (error) {
    res.status(500).send('Failed to update task');
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).send('Task not found');
    }
    res.redirect('/tasks');
  } catch (error) {
    res.status(500).send('Failed to delete task');
  }
};

