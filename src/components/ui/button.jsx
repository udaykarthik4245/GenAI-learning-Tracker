import React, { useState, useCallback } from 'react'

export function Button({ children, variant = 'default', className = '', onClick, active = false, ...props }) {
  // Short visual 'clicked' state so the button changes color briefly after click.
  const [clicked, setClicked] = useState(false)
  const base = 'button'
  const variantClass = variant === 'outline' ? 'button--outline' : variant === 'secondary' ? 'button--secondary' : 'button--default'
  const clickClass = clicked ? 'is-clicked' : ''
  const activeClass = active ? 'is-active' : ''
  const cls = [base, variantClass, clickClass, activeClass, className].filter(Boolean).join(' ')

  const handleClick = useCallback((e) => {
    // show clicked color briefly
    setClicked(true)
    window.setTimeout(() => setClicked(false), 350)
    if (onClick) onClick(e)
  }, [onClick])

  return (
    <button {...props} onClick={handleClick} className={cls}>
      {children}
    </button>
  )
}
