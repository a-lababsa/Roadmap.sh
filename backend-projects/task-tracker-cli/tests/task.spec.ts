import { Task } from '../src/Task'

describe('Task class', () => {
  test('should create a task with the correct properties', () => {
    const task = new Task(1, 'Test Task')

    expect(task.id).toBe(1)
    expect(task.description).toBe('Test Task')
    expect(task.status).toBe('todo')
    expect(task.createdAt).toBeInstanceOf(Date)
    expect(task.updatedAt).toBeUndefined()
  })

  test('should update the description and set updatedAt when setDescription is called', () => {
    const task = new Task(1, 'Test Task')
    task.setDescription('Updated Task')

    expect(task.description).toBe('Updated Task')
    expect(task.updatedAt).toBeInstanceOf(Date)
  })

  test('should hydrate a task from partial data', () => {
    const data: object = {
      id: 1,
      description: 'Hydrated Task',
      status: 'todo',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    }

    const task = Task.hydrate(data)

    expect(task.id).toBe(1)
    expect(task.description).toBe('Hydrated Task')
    expect(task.status).toBe('todo')
    expect(task.createdAt).toEqual(new Date('2023-01-01T00:00:00.000Z'))
    expect(task.updatedAt).toEqual(new Date('2023-01-02T00:00:00.000Z'))
  })

  test('should handle missing updatedAt when hydrating', () => {
    const data: object = {
      id: 1,
      description: 'Hydrated Task',
      status: 'todo',
      createdAt: '2023-01-01T00:00:00.000Z',
    }

    const task = Task.hydrate(data)

    expect(task.id).toBe(1)
    expect(task.description).toBe('Hydrated Task')
    expect(task.status).toBe('todo')
    expect(task.createdAt).toEqual(new Date('2023-01-01T00:00:00.000Z'))
    expect(task.updatedAt).toBeUndefined()
  })
})
