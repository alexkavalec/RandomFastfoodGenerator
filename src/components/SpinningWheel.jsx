import { useState, useRef, useMemo } from 'react'
import './SpinningWheel.css'

const COLORS = [
  '#FF6B35', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181',
  '#AA96DA', '#FCBAD3', '#A8D8EA', '#FF9A8B', '#FAD0C4',
  '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe',
  '#43e97b', '#fa709a', '#fee140', '#30cfd0', '#E84A5F'
]

export default function SpinningWheel({ restaurants, onSpinComplete }) {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const wheelRef = useRef(null)

  const segmentAngle = 360 / Math.max(restaurants.length, 1)

  const conicGradient = useMemo(() => {
    if (restaurants.length === 0) return 'conic-gradient(#999 0deg 360deg)'
    const stops = restaurants
      .map((_, i) => {
        const start = (i * segmentAngle)
        const end = ((i + 1) * segmentAngle)
        return `${COLORS[i % COLORS.length]} ${start}deg ${end}deg`
      })
      .join(', ')
    return `conic-gradient(${stops})`
  }, [restaurants, segmentAngle])

  const handleSpin = () => {
    if (isSpinning || restaurants.length === 0) return

    setIsSpinning(true)
    const randomIndex = Math.floor(Math.random() * restaurants.length)
    const targetAngle = 360 - (randomIndex * segmentAngle + segmentAngle / 2)
    const fullSpins = 5 + Math.random() * 3
    const totalRotation = rotation + 360 * fullSpins + targetAngle

    setRotation(totalRotation)

    const duration = 4000
    if (wheelRef.current) {
      wheelRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`
    }

    setTimeout(() => {
      setIsSpinning(false)
      onSpinComplete?.(restaurants[randomIndex])
    }, duration)
  }

  return (
    <div className="wheel-container">
      <div className="wheel-pointer">▼</div>
      <div
        ref={wheelRef}
        className="wheel"
        style={{
          transform: `rotate(${rotation}deg)`,
          background: conicGradient
        }}
      >
        <div className="wheel-labels">
          {restaurants.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="wheel-label"
              style={{
                '--segment-angle': `${segmentAngle}deg`,
                '--segment-index': i
              }}
            >
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
      <button
        className="spin-button"
        onClick={handleSpin}
        disabled={isSpinning || restaurants.length === 0}
      >
        {isSpinning ? 'SPINNING...' : 'SPIN'}
      </button>
    </div>
  )
}
