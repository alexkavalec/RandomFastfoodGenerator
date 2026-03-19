import { createContext, useContext, useState, useEffect } from 'react'

const DEFAULT_RESTAURANTS = [
  "McDonald's", "Chick-fil-A", "Taco Bell", "Wendy's", "Subway",
  "Burger King", "Chipotle", "Raising Cane's", "Panda Express", "Pizza Hut",
  "Domino's", "KFC", "Popeyes", "Five Guys", "In-N-Out",
  "Whataburger", "Sonic", "Arby's", "Dunkin'", "Starbucks"
]

const STORAGE_KEYS = {
  restaurants: 'fastfood-spinner-restaurants',
  history: 'fastfood-spinner-history'
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [restaurants, setRestaurants] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.restaurants)
      if (saved) {
        const parsed = JSON.parse(saved)
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_RESTAURANTS
      }
    } catch (e) {}
    return DEFAULT_RESTAURANTS
  })

  const [spinHistory, setSpinHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.history)
      if (saved) {
        const parsed = JSON.parse(saved)
        return Array.isArray(parsed) ? parsed : []
      }
    } catch (e) {}
    return []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.restaurants, JSON.stringify(restaurants))
  }, [restaurants])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(spinHistory))
  }, [spinHistory])

  const addRestaurant = (name) => {
    const trimmed = name.trim()
    if (trimmed && !restaurants.includes(trimmed)) {
      setRestaurants([...restaurants, trimmed])
    }
  }

  const removeRestaurant = (name) => {
    setRestaurants(restaurants.filter(r => r !== name))
  }

  const addSpinToHistory = (restaurant) => {
    setSpinHistory([{ restaurant, timestamp: new Date().toISOString() }, ...spinHistory])
  }

  const clearHistory = () => {
    setSpinHistory([])
  }

  return (
    <AppContext.Provider value={{
      restaurants,
      setRestaurants,
      addRestaurant,
      removeRestaurant,
      spinHistory,
      addSpinToHistory,
      clearHistory
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
