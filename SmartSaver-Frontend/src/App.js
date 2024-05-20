import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Login from './components/registeration/Login'
import Register from './components/registeration/Register'
import Expenses from './components/Expenses/Expenses'
import Category from './components/Categories/Category'
import NavBar from './components/NavBar'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Register />} />
          <Route path="/signin" element={<Login />} />
        </Routes>
        <NavBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/categories" element={<Category />} />
        </Routes>
      </BrowserRouter>

      {/* <Register /> */}
      {/* <Login /> */}
    </div>
  )
}

export default App
