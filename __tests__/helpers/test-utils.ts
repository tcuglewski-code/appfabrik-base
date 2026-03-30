/**
 * Test Utilities for AppFabrik Base
 * 
 * Common helpers, fixtures, and mock factories for testing.
 */

import { Role, UserStatus } from '@prisma/client';

// ============================================================================
// Mock Factories
// ============================================================================

/**
 * Create a mock user object
 */
export function createMockUser(overrides: Partial<{
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  tenantId: string;
}> = {}) {
  return {
    id: 'user-' + Math.random().toString(36).substr(2, 9),
    email: `user-${Date.now()}@test.appfabrik.de`,
    name: 'Test User',
    role: 'WORKER' as const,
    status: 'ACTIVE' as const,
    tenantId: 'tenant-test',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Create a mock task object
 */
export function createMockTask(overrides: Partial<{
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId: string;
  assigneeId: string;
}> = {}) {
  return {
    id: 'task-' + Math.random().toString(36).substr(2, 9),
    title: 'Test Task',
    description: 'Test task description',
    status: 'PENDING' as const,
    priority: 'MEDIUM' as const,
    projectId: 'project-test',
    assigneeId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: null,
    completedAt: null,
    ...overrides,
  };
}

/**
 * Create a mock project object
 */
export function createMockProject(overrides: Partial<{
  id: string;
  name: string;
  description: string;
  status: string;
  tenantId: string;
}> = {}) {
  return {
    id: 'project-' + Math.random().toString(36).substr(2, 9),
    name: 'Test Project',
    description: 'Test project description',
    status: 'ACTIVE' as const,
    tenantId: 'tenant-test',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Create a mock time entry object
 */
export function createMockTimeEntry(overrides: Partial<{
  id: string;
  userId: string;
  taskId: string;
  date: Date;
  duration: number;
  notes: string;
}> = {}) {
  return {
    id: 'te-' + Math.random().toString(36).substr(2, 9),
    userId: 'user-test',
    taskId: null,
    date: new Date(),
    duration: 480, // 8 hours in minutes
    notes: '',
    createdAt: new Date(),
    ...overrides,
  };
}

/**
 * Create a mock session object
 */
export function createMockSession(overrides: Partial<{
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    tenantId: string;
  };
}> = {}) {
  return {
    user: {
      id: 'user-test',
      email: 'test@appfabrik.de',
      name: 'Test User',
      role: 'ADMIN',
      tenantId: 'tenant-test',
      ...overrides?.user,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

// ============================================================================
// Test Data Sets
// ============================================================================

export const TEST_USERS = {
  admin: createMockUser({ id: 'admin-1', role: 'ADMIN', email: 'admin@test.de' }),
  manager: createMockUser({ id: 'manager-1', role: 'MANAGER', email: 'manager@test.de' }),
  worker: createMockUser({ id: 'worker-1', role: 'WORKER', email: 'worker@test.de' }),
  viewer: createMockUser({ id: 'viewer-1', role: 'VIEWER', email: 'viewer@test.de' }),
};

export const TEST_TASKS = {
  pending: createMockTask({ id: 'task-pending', status: 'PENDING' }),
  inProgress: createMockTask({ id: 'task-progress', status: 'IN_PROGRESS' }),
  completed: createMockTask({ id: 'task-completed', status: 'COMPLETED' }),
};

// ============================================================================
// Assertion Helpers
// ============================================================================

/**
 * Check if a response is a valid API success response
 */
export function isValidSuccessResponse(response: unknown): response is { success: true; data: unknown } {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    (response as any).success === true &&
    'data' in response
  );
}

/**
 * Check if a response is a valid API error response
 */
export function isValidErrorResponse(response: unknown): response is { success: false; error: { code: string; message: string } } {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    (response as any).success === false &&
    'error' in response
  );
}

// ============================================================================
// Date Helpers
// ============================================================================

/**
 * Get start of current week (Monday)
 */
export function getStartOfWeek(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of current week (Sunday)
 */
export function getEndOfWeek(date = new Date()): Date {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

// ============================================================================
// Wait Helpers for Async Tests
// ============================================================================

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  options: { timeout?: number; interval?: number } = {}
): Promise<void> {
  const { timeout = 5000, interval = 100 } = options;
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    if (await condition()) return;
    await new Promise(r => setTimeout(r, interval));
  }
  
  throw new Error(`waitFor timed out after ${timeout}ms`);
}
