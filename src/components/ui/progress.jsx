import React from 'react'
export function Progress({ value = 0, className = '' }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={className}>
      <div style={{ background: '#e6e6e6', height: 10, borderRadius: 6 }}>
        <div style={{ width: `${pct}%`, background: '#34d399', height: 10, borderRadius: 6 }} />
      </div>
    </div>
  )
}
