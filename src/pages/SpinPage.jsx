import { useState } from 'react'
import SpinningWheel from '../components/SpinningWheel'
import { useApp } from '../context/AppContext'
import './SpinPage.css'

const FUN_MESSAGES = [
  "You're eating at {name} tonight!",
  "{name} it is! Enjoy your meal! 🍔",
  "Looks like {name} wins! Yum!",
  "Tonight's dinner: {name}!",
  "The wheel has spoken: {name}!",
  "Get ready for {name}!",
  "{name} — your taste buds will thank you!",
  "Winner winner! {name} for dinner!"
]

export default function SpinPage() {
  const { restaurants, addSpinToHistory } = useApp()
  const [result, setResult] = useState(null)

  const handleSpinComplete = (restaurant) => {
    setResult(restaurant)
    addSpinToHistory(restaurant)
  }

  const message = result
    ? FUN_MESSAGES[Math.floor(Math.random() * FUN_MESSAGES.length)].replace('{name}', result)
    : null

  return (
    <div className="spin-page">
      <div className="spin-card">
        <SpinningWheel
          restaurants={restaurants}
          onSpinComplete={handleSpinComplete}
        />
        {result && (
          <div className="result-box">
            <p className="result-name">{result}</p>
            <p className="result-message">{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
