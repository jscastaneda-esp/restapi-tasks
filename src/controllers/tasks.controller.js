import Task from "../models/Task";
import { getPagination } from "../libs/get-pagination";

export const create = async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({
      message: "Content cannot be empty",
    });
  }

  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Error creating a task",
    });
  }
};

export const findAll = async (req, res) => {
  const { size, page, title } = req.query;

  try {
    const condition = title
      ? {
          title: { $regex: new RegExp(title), $options: "i" },
        }
      : {};

    const { limit, offset } = getPagination(page, size);
    const paginate = await Task.paginate(condition, { limit, offset });
    res.json({
      totalItems: paginate.totalDocs,
      totalPages: paginate.totalPages,
      page: paginate.page - 1,
      tasks: paginate.docs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Error the tasks",
    });
  }
};

export const findById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        message: `ID ${id} does not exists`,
      });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || `Error retrieving the task with id: ${id}`,
    });
  }
};

export const findAllDone = async (req, res) => {
  const { size, page } = req.query;

  try {
    const { limit, offset } = getPagination(page, size);
    const paginate = await Task.paginate({ done: true }, { limit, offset });
    res.json({
      totalItems: paginate.totalDocs,
      totalPages: paginate.totalPages,
      page: paginate.page - 1,
      tasks: paginate.docs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Error retrieving the done tasks",
    });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndUpdate(id, req.body);
    if (!task) {
      return res.status(404).json({
        message: `ID ${id} does not exists`,
      });
    }

    res.json({
      message: `Task was updated successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || `Error updating the task with id: ${id}`,
    });
  }
};

export const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndRemove(id);
    if (!task) {
      return res.status(404).json({
        message: `ID ${id} does not exists`,
      });
    }

    res.json({
      message: `Task were deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || `Error deleting the task with id: ${id}`,
    });
  }
};
