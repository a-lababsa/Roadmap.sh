import * as fs from 'fs/promises'
import { TaskRepository } from '../src/TaskRepository'
import { Task } from '../src/Task'
import { Stats } from 'node:fs'

jest.mock('fs/promises')

const mockReadFile = fs.readFile as jest.MockedFunction<typeof fs.readFile>
const mockWriteFile = fs.writeFile as jest.MockedFunction<typeof fs.writeFile>
const mockStat = fs.stat as jest.MockedFunction<typeof fs.stat>

describe('TaskRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should create a task', async () => {
    const mockStats: Stats = {} as Stats
    mockStat.mockImplementationOnce(() => Promise.resolve(mockStats))
    mockReadFile.mockImplementationOnce(() =>
      Promise.resolve(JSON.stringify({ tasks: [] }))
    )
    mockWriteFile.mockImplementationOnce(() => Promise.resolve())

    const taskId = await TaskRepository.create('New Task')
    
    expect(taskId).toBe(1)
    expect(mockWriteFile).toHaveBeenCalledWith('tasks.json', expect.any(String))
  })

  test('should update a task', async () => {
    const mockStats: Stats = {} as Stats
    const existingTask = new Task(1, 'Existing Task')
    existingTask.setDescription('Updated Task Description')
    
    mockStat.mockImplementationOnce(() => Promise.resolve(mockStats))
    mockReadFile.mockImplementationOnce(() =>
      Promise.resolve(JSON.stringify({ tasks: [existingTask] }))
    )
    mockWriteFile.mockImplementationOnce(() => Promise.resolve())

    await TaskRepository.update(1, 'Updated Task Description')
    
    expect(mockWriteFile).toHaveBeenCalledWith('tasks.json', expect.any(String))
  })

  test('should delete a task', async () => {
    const mockStats: Stats = {} as Stats
    const existingTask = new Task(1, 'Task to delete')
    
    mockStat.mockImplementationOnce(() => Promise.resolve(mockStats))
    mockReadFile.mockImplementationOnce(() =>
      Promise.resolve(JSON.stringify({ tasks: [existingTask] }))
    )
    mockWriteFile.mockImplementationOnce(() => Promise.resolve())

    await TaskRepository.delete(1)
    
    expect(mockWriteFile).toHaveBeenCalledWith('tasks.json', JSON.stringify({ tasks: [] }, null, 2))
  })

  test('should list tasks by status', async () => {
    const mockStats: Stats = {} as Stats
    const task1 = new Task(1, 'Task 1')
    task1.status = 'todo'
    const task2 = new Task(2, 'Task 2')
    task2.status = 'done'
    
    mockStat.mockImplementationOnce(() => Promise.resolve(mockStats))
    mockReadFile.mockImplementationOnce(() =>
      Promise.resolve(JSON.stringify({ tasks: [task1, task2] }))
    )
    
    const tasks = await TaskRepository.list('todo')
    
    expect(tasks).toHaveLength(1)
    expect(tasks[0].description).toBe('Task 1')
  })
})
