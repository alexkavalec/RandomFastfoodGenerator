import { useState } from 'react'
import { useApp } from '../context/AppContext'
import './CustomizePage.css'

export default function CustomizePage() {
  const { restaurants, addRestaurant, removeRestaurant } = useApp()
  const [newName, setNewName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    addRestaurant(newName)
    setNewName('')
  }

  return (
    <div className="customize-page">
      <div className="customize-card">
        <h2>Add a Restaurant</h2>
        <form onSubmit={handleSubmit} className="add-form">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter restaurant name..."
            maxLength={50}
          />
          <button type="submit" disabled={!newName.trim()}>Add</button>
        </form>

        <h2>Restaurants on the Wheel</h2>
        <p className="hint">Click to remove • Changes appear on the spin page</p>
        <ul className="restaurant-list">
          {restaurants.map((name) => (
            <li key={name} className="restaurant-item">
              <span>{name}</span>
              <button
                type="button"
                onClick={() => removeRestaurant(name)}
                className="remove-btn"
                aria-label={`Remove ${name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        {restaurants.length === 0 && (
          <p className="empty-msg">No restaurants yet. Add some above!</p>
        )}
      </div>
    </div>
  )
}
