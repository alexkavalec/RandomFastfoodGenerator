import { useApp } from '../context/AppContext'
import './HistoryPage.css'

function formatDate(isoString) {
  const d = new Date(isoString)
  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hr ago`
  if (diffDays < 7) return `${diffDays} days ago`
  return d.toLocaleDateString()
}

export default function HistoryPage() {
  const { spinHistory, clearHistory } = useApp()

  return (
    <div className="history-page">
      <div className="history-card">
        <div className="history-header">
          <h2>Spin History</h2>
          {spinHistory.length > 0 && (
            <button onClick={clearHistory} className="clear-btn">
              Clear History
            </button>
          )}
        </div>
        {spinHistory.length === 0 ? (
          <p className="empty-msg">No spins yet. Go spin the wheel!</p>
        ) : (
          <ul className="history-list">
            {spinHistory.map((entry, i) => (
              <li key={entry.timestamp + i} className="history-item">
                <span className="history-restaurant">{entry.restaurant}</span>
                <span className="history-time">{formatDate(entry.timestamp)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
