const prisma = require('../database/db');

// GET /tasks
const getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.task.count()
    ]);

    res.json({
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) }
    });

    if (!task) {
      const err = new Error('Task not found');
      err.statusCode = 404;
      throw err;
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// POST /tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      const err = new Error('Title is required');
      err.statusCode = 400;
      throw err;
    }

    const task = await prisma.task.create({
      data: { title, description }
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// PATCH /tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    // Validate status if provided
    if (status && !['pending', 'in_progress', 'completed'].includes(status)) {
      const err = new Error('Invalid status value');
      err.statusCode = 400;
      throw err;
    }

    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { title, description, status }
    });

    res.json(task);
  } catch (error) {
    if (error.code === 'P2025') {
      const err = new Error('Task not found');
      err.statusCode = 404;
      return next(err);
    }
    next(error);
  }
};

// DELETE /tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      const err = new Error('Task not found');
      err.statusCode = 404;
      return next(err);
    }
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
