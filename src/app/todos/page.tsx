'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  LogOut, 
  CheckCircle2,
  Circle,
  ListTodo,
  Calendar
} from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Buy groceries', completed: false, createdAt: new Date() },
    { id: 2, text: 'Walk the dog', completed: true, createdAt: new Date() },
    { id: 3, text: 'Read a book', completed: false, createdAt: new Date() },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const router = useRouter();

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: newTodo, 
        completed: false,
        createdAt: new Date()
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText } : todo
      ));
      setEditingId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const logout = () => {
    router.push('/');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <ListTodo className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800" data-testid="todos-title">My Todos</h1>
              <p className="text-xs text-gray-500">Stay organized and productive</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
            data-testid="logout-button"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4" data-testid="todo-stats">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium uppercase">Total</p>
            <p className="text-2xl font-bold text-gray-800 mt-1" data-testid="total-count">{todos.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium uppercase">Active</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1" data-testid="active-count">{activeCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium uppercase">Completed</p>
            <p className="text-2xl font-bold text-green-600 mt-1" data-testid="completed-count">{completedCount}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-bold text-gray-800">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Add Todo Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <form onSubmit={addTodo} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                data-testid="new-todo-input"
              />
              <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              data-testid="add-todo-button"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </form>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 w-fit" data-testid="filter-buttons">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === f 
                  ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              data-testid={`filter-${f}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" data-testid="todo-list">
          {filteredTodos.length === 0 ? (
            <div className="p-12 text-center" data-testid="empty-message">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ListTodo className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No todos found</p>
              <p className="text-sm text-gray-400 mt-1">Add a new task to get started</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="group p-4 hover:bg-gray-50 transition-colors"
                  data-testid={`todo-item-${todo.id}`}
                >
                  {editingId === todo.id ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        data-testid={`edit-input-${todo.id}`}
                        autoFocus
                      />
                      <button
                        onClick={saveEdit}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        data-testid={`save-edit-${todo.id}`}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        data-testid={`cancel-edit-${todo.id}`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          todo.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300 hover:border-indigo-500'
                        }`}
                        data-testid={`todo-checkbox-${todo.id}`}
                      >
                        {todo.completed && <Check className="w-4 h-4 text-white" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <p 
                          className={`font-medium transition-all ${
                            todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                          }`}
                          data-testid={`todo-text-${todo.id}`}
                        >
                          {todo.text}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {todo.createdAt.toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(todo)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          data-testid={`edit-button-${todo.id}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          data-testid={`delete-button-${todo.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
