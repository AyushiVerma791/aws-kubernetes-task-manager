import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/tasks')
      const result = await response.json()
      setTasks(result.data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: '' })
      })
      setTitle('')
      fetchTasks()
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const toggleTask = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    try {
      await fetch(`/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = async (id) => {
    try {
      await fetch(`/tasks/${id}`, {
        method: 'DELETE'
      })
      fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  return (
    <div className="container">
      <h1>CloudScale Tasks (React) 🚀</h1>
      
      <div className="card">
        <form onSubmit={addTask}>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need to do?" 
            required
          />
          <button type="submit">Add Task</button>
        </form>
      </div>

      <ul className="task-list">
        {tasks.map(task => {
          const isCompleted = task.status === 'completed';
          return (
            <li key={task.id} className="task-item">
              <div className="task-content">
                <p 
                  className="task-title" 
                  style={{ textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? '#9ca3af' : 'inherit' }}
                >
                  {task.title}
                </p>
                <span className={`task-status ${isCompleted ? 'completed' : ''}`}>
                  {task.status}
                </span>
              </div>
              <div className="actions">
                <button 
                  className="btn-toggle" 
                  onClick={() => toggleTask(task.id, task.status)}
                >
                  {isCompleted ? 'Undo' : 'Complete'}
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default App
