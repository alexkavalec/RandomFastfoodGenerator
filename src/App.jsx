import { Routes, Route, NavLink } from 'react-router-dom'
import SpinPage from './pages/SpinPage'
import CustomizePage from './pages/CustomizePage'
import HistoryPage from './pages/HistoryPage'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1 className="title">🍔 Fast Food Spinner</h1>
        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Spin
          </NavLink>
          <NavLink to="/customize" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Customize
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            History
          </NavLink>
        </nav>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<SpinPage />} />
          <Route path="/customize" element={<CustomizePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
