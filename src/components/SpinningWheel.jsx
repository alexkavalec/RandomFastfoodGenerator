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

function getColor(name, i) {
  return BRAND_COLORS[name] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]
}

export default function SpinningWheel({ restaurants, onSpinComplete }) {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const wheelRef = useRef(null)

  const count = restaurants.length
  const segmentAngle = 360 / Math.max(count, 1)

  const conicGradient = useMemo(() => {
    if (count === 0) return 'conic-gradient(#999 0deg 360deg)'
    return `conic-gradient(${restaurants.map((name, i) => {
      const color = getColor(name, i)
      return `${color} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`
    }).join(', ')})`
  }, [restaurants, segmentAngle, count])

  const handleSpin = () => {
    if (isSpinning || count === 0) return

    setIsSpinning(true)
    const fullSpins = 5 + Math.floor(Math.random() * 3)
    const extraAngle = Math.random() * 360
    const totalRotation = rotation + 360 * fullSpins + extraAngle

    setRotation(totalRotation)

    const duration = 4000
    if (wheelRef.current) {
      wheelRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`
    }

    setTimeout(() => {
      setIsSpinning(false)
      const normalized = ((totalRotation % 360) + 360) % 360
      const pointerAngle = (360 - normalized) % 360
      const winnerIndex = Math.floor(pointerAngle / segmentAngle) % count
      onSpinComplete?.(restaurants[winnerIndex])
    }, duration)
  }

  const fontSize = count <= 6 ? 0.85 : count <= 10 ? 0.75 : count <= 15 ? 0.65 : 0.55

  return (
    <div className="wheel-container">
      <div className="wheel-wrapper">
        <svg className="wheel-pointer" viewBox="0 0 40 32" width="40" height="32">
          <defs>
            <filter id="pointer-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.35" />
            </filter>
          </defs>
          <polygon
            points="20,32 3,0 37,0"
            fill="#2C3E50"
            stroke="#FFE66D"
            strokeWidth="2.5"
            strokeLinejoin="round"
            filter="url(#pointer-shadow)"
          />
        </svg>

        <div
          ref={wheelRef}
          className="wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            background: conicGradient
          }}
        >
          {restaurants.map((_, i) => (
            <div
              key={`div-${i}`}
              className="wheel-divider"
              style={{ transform: `rotate(${i * segmentAngle - 90}deg)` }}
            />
          ))}

          {restaurants.map((name, i) => {
            const midAngle = i * segmentAngle + segmentAngle / 2 - 90
            return (
              <div
                key={`label-${name}-${i}`}
                className="wheel-label"
                style={{
                  transform: `rotate(${midAngle}deg)`,
                  fontSize: `${fontSize}rem`
                }}
              >
                <span>{name}</span>
              </div>
            )
          })}

          <div className="wheel-hub" />
        </div>
      </div>

      <button
        className="spin-button"
        onClick={handleSpin}
        disabled={isSpinning || count === 0}
      >
        {isSpinning ? 'SPINNING...' : 'SPIN'}
      </button>
    </div>
  )
}
