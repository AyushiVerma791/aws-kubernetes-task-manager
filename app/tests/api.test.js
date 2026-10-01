const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/database/db');

// Mock Prisma
jest.mock('../src/database/db', () => ({
  task: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

describe('Tasks API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /tasks', () => {
    it('should return paginated tasks', async () => {
      const mockTasks = [{ id: 1, title: 'Test Task' }];
      prisma.task.findMany.mockResolvedValue(mockTasks);
      prisma.task.count.mockResolvedValue(1);

      const res = await request(app).get('/tasks');
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual(mockTasks);
      expect(res.body.meta.total).toBe(1);
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const newTask = { id: 1, title: 'New', description: 'Desc' };
      prisma.task.create.mockResolvedValue(newTask);

      const res = await request(app).post('/tasks').send({ title: 'New', description: 'Desc' });
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(newTask);
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app).post('/tasks').send({ description: 'Desc' });
      expect(res.statusCode).toBe(400);
    });
  });
});
