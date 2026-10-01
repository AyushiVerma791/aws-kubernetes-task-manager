const prisma = require('../database/db');

// Helper to safely parse IDs
const parseId = (idStr) => {
  const id = parseInt(idStr, 10);
  if (isNaN(id)) {
    const err = new Error('Invalid task ID format');
    err.statusCode = 400;
    throw err;
  }
  return id;
};

// GET /tasks
const getTasks = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;
    let limit = parseInt(req.query.limit) || 10;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100;
    
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
    const id = parseId(req.params.id);
    const task = await prisma.task.findUnique({
      where: { id }
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
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
      const err = new Error('Title is required and cannot be empty');
      err.statusCode = 400;
      throw err;
    }

    const task = await prisma.task.create({
      data: { title: title.trim(), description }
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// PATCH /tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const { title, description, status } = req.body;

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      const err = new Error('Title cannot be empty');
      err.statusCode = 400;
      throw err;
    }

    // Validate status if provided
    if (status && !['pending', 'in_progress', 'completed'].includes(status)) {
      const err = new Error('Invalid status value');
      err.statusCode = 400;
      throw err;
    }

    const task = await prisma.task.update({
      where: { id },
      data: { 
        ...(title && { title: title.trim() }), 
        description, 
        status 
      }
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
    const id = parseId(req.params.id);

    await prisma.task.delete({
      where: { id }
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
