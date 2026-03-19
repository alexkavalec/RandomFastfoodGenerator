import { useState, useRef, useMemo } from 'react'
import './SpinningWheel.css'

const BRAND_COLORS = {
  "McDonald's":     '#FFC72C',
  "Chick-fil-A":    '#E51636',
  "Taco Bell":      '#702082',
  "Wendy's":        '#E2203A',
  "Subway":         '#008C15',
  "Burger King":    '#FF8732',
  "Chipotle":       '#441500',
  "Raising Cane's": '#ED1C24',
  "Panda Express":  '#D62300',
  "Pizza Hut":      '#EE3A23',
  "Domino's":       '#006491',
  "KFC":            '#F40027',
  "Popeyes":        '#F58220',
  "Five Guys":      '#ED1C24',
  "In-N-Out":       '#FFED00',
  "Whataburger":    '#FF6600',
  "Sonic":          '#003478',
  "Arby's":         '#D2172A',
  "Dunkin'":        '#FF671F',
  "Starbucks":      '#006241',
}

const FALLBACK_COLORS = [
  '#FF6B35', '#4ECDC4', '#667eea', '#F38181',
  '#AA96DA', '#43e97b', '#f5576c', '#30cfd0'
]

export default function SpinningWheel({ restaurants, onSpinComplete }) {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const wheelRef = useRef(null)

  const segmentAngle = 360 / Math.max(restaurants.length, 1)

  const conicGradient = useMemo(() => {
    if (restaurants.length === 0) return 'conic-gradient(#999 0deg 360deg)'
    const stops = restaurants
      .map((name, i) => {
        const start = (i * segmentAngle)
        const end = ((i + 1) * segmentAngle)
        const color = BRAND_COLORS[name] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]
        return `${color} ${start}deg ${end}deg`
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
