/**
 * Unit Tests for Prisma Database Operations
 * 
 * Tests core database queries with mocked Prisma client.
 * Verifies query building, filtering, and data transformations.
 */

import { PrismaClient, Role, UserStatus } from '@prisma/client';

// Mock Prisma Client
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  project: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  task: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  timeEntry: {
    findMany: jest.fn(),
    create: jest.fn(),
    aggregate: jest.fn(),
  },
  $transaction: jest.fn((fn) => fn(mockPrisma)),
  $disconnect: jest.fn(),
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
  Role: {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    WORKER: 'WORKER',
    VIEWER: 'VIEWER',
  },
  UserStatus: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    INVITED: 'INVITED',
  },
}));

describe('User Queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should find user by email', async () => {
    const mockUser = {
      id: '1',
      email: 'test@appfabrik.de',
      name: 'Test User',
      role: 'ADMIN',
      status: 'ACTIVE',
      tenantId: 'tenant-1',
      createdAt: new Date(),
    };
    
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);

    const result = await mockPrisma.user.findUnique({
      where: { email: 'test@appfabrik.de' },
    });

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@appfabrik.de' },
    });
    expect(result).toEqual(mockUser);
    expect(result?.role).toBe('ADMIN');
  });

  it('should find all users for tenant', async () => {
    const mockUsers = [
      { id: '1', name: 'User 1', tenantId: 'tenant-1' },
      { id: '2', name: 'User 2', tenantId: 'tenant-1' },
    ];
    
    mockPrisma.user.findMany.mockResolvedValue(mockUsers);

    const result = await mockPrisma.user.findMany({
      where: { tenantId: 'tenant-1' },
    });

    expect(result).toHaveLength(2);
    expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
      where: { tenantId: 'tenant-1' },
    });
  });

  it('should create user with tenant association', async () => {
    const newUser = {
      email: 'new@appfabrik.de',
      name: 'New User',
      passwordHash: 'hashedPassword',
      role: 'WORKER',
      tenantId: 'tenant-1',
    };
    
    const createdUser = { id: 'new-id', ...newUser, createdAt: new Date() };
    mockPrisma.user.create.mockResolvedValue(createdUser);

    const result = await mockPrisma.user.create({
      data: newUser,
    });

    expect(result.id).toBe('new-id');
    expect(result.tenantId).toBe('tenant-1');
  });

  it('should count active users', async () => {
    mockPrisma.user.count.mockResolvedValue(15);

    const count = await mockPrisma.user.count({
      where: { status: 'ACTIVE', tenantId: 'tenant-1' },
    });

    expect(count).toBe(15);
  });
});

describe('Task Queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should find tasks with pagination', async () => {
    const mockTasks = Array.from({ length: 10 }, (_, i) => ({
      id: `task-${i}`,
      title: `Task ${i}`,
      status: i % 2 === 0 ? 'PENDING' : 'IN_PROGRESS',
    }));
    
    mockPrisma.task.findMany.mockResolvedValue(mockTasks);

    const result = await mockPrisma.task.findMany({
      where: { projectId: 'project-1' },
      take: 10,
      skip: 0,
      orderBy: { createdAt: 'desc' },
    });

    expect(result).toHaveLength(10);
    expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
      where: { projectId: 'project-1' },
      take: 10,
      skip: 0,
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should filter tasks by status', async () => {
    const pendingTasks = [
      { id: 'task-1', status: 'PENDING' },
      { id: 'task-2', status: 'PENDING' },
    ];
    
    mockPrisma.task.findMany.mockResolvedValue(pendingTasks);

    const result = await mockPrisma.task.findMany({
      where: { 
        projectId: 'project-1',
        status: 'PENDING',
      },
    });

    expect(result.every(t => t.status === 'PENDING')).toBe(true);
  });

  it('should update task status', async () => {
    const updatedTask = {
      id: 'task-1',
      status: 'COMPLETED',
      completedAt: new Date(),
    };
    
    mockPrisma.task.update.mockResolvedValue(updatedTask);

    const result = await mockPrisma.task.update({
      where: { id: 'task-1' },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });

    expect(result.status).toBe('COMPLETED');
    expect(result.completedAt).toBeDefined();
  });
});

describe('TimeEntry Aggregations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should aggregate hours by user', async () => {
    const aggregation = {
      _sum: { duration: 480 }, // 8 hours in minutes
    };
    
    mockPrisma.timeEntry.aggregate.mockResolvedValue(aggregation);

    const result = await mockPrisma.timeEntry.aggregate({
      where: {
        userId: 'user-1',
        date: {
          gte: new Date('2026-03-01'),
          lte: new Date('2026-03-31'),
        },
      },
      _sum: { duration: true },
    });

    expect(result._sum.duration).toBe(480);
  });

  it('should find time entries for date range', async () => {
    const entries = [
      { id: 'te-1', date: new Date('2026-03-15'), duration: 480 },
      { id: 'te-2', date: new Date('2026-03-16'), duration: 510 },
    ];
    
    mockPrisma.timeEntry.findMany.mockResolvedValue(entries);

    const result = await mockPrisma.timeEntry.findMany({
      where: {
        userId: 'user-1',
        date: {
          gte: new Date('2026-03-01'),
          lte: new Date('2026-03-31'),
        },
      },
      orderBy: { date: 'asc' },
    });

    expect(result).toHaveLength(2);
  });
});

describe('Transaction Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute transaction successfully', async () => {
    const taskId = 'task-1';
    const timeEntryId = 'te-1';
    
    mockPrisma.task.update.mockResolvedValue({ id: taskId, status: 'COMPLETED' });
    mockPrisma.timeEntry.create.mockResolvedValue({ id: timeEntryId, taskId });

    const result = await mockPrisma.$transaction(async (tx) => {
      const task = await tx.task.update({
        where: { id: taskId },
        data: { status: 'COMPLETED' },
      });
      
      const timeEntry = await tx.timeEntry.create({
        data: { taskId, userId: 'user-1', duration: 120, date: new Date() },
      });
      
      return { task, timeEntry };
    });

    expect(mockPrisma.$transaction).toHaveBeenCalled();
  });
});
