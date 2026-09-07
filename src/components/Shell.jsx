import React, { useState } from 'react'
import { ChevronDown, ExternalLink, FileText, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { Button, StatusDot } from '../design-system/index.jsx'

const primaryLinks = [
  ['swap', 'Trade'], ['explore', 'Liquidity'], ['launch', 'Launch'], ['portfolio', 'Portfolio'],
]

function Brand({ navigate }) {
  return <a className="brand" href="#/swap" onClick={(event) => { event.preventDefault(); navigate('swap') }}><img className="brand-original" src={`${import.meta.env.BASE_URL}ammora-logo-optimized.webp`} alt="Ammora" /><img className="brand-wordmark" src={`${import.meta.env.BASE_URL}ammora-logo-optimized.webp`} alt="" aria-hidden="true" /></a>
}

export function Shell({ route, navigate, connected, setConnected, theme, setTheme, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  const go = (event, nextRoute) => {
    event.preventDefault()
    setMobileOpen(false)
    navigate(nextRoute)
  }

  const isActive = (key) => {
    if (key === 'explore') return route === 'explore' || route === 'create' || route === 'pool-detail'
    if (key === 'portfolio') return route === 'portfolio' || route === 'fees' || route === 'position-detail'
    if (key === 'launch') return route === 'launch' || route === 'launch-detail'
    return route === key
  }

  return <div className="app-shell">
    <header className="app-header">
      <div className="header-main">
        <Brand navigate={navigate} />
        <nav className="product-nav" aria-label="Product navigation">
          {primaryLinks.map(([key, label]) => <a key={key} className={isActive(key) ? 'active' : ''} href={`#/${key}`} onClick={(event) => go(event, key)}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="header-search" onClick={() => navigate('explore')} aria-label="Search pools and tokens"><Search size={17} /><span>Search</span></button>
          <div className="more-dropdown"><button onClick={() => setMoreOpen(!moreOpen)} aria-expanded={moreOpen}>More <ChevronDown size={15} /></button>{moreOpen && <div><a href="#/currencies" onClick={(event) => go(event, 'currencies')}>Token directory</a><a href="#/fees" onClick={(event) => go(event, 'fees')}>Revenue sharing</a><a href="https://ammora-docs.vercel.app">Documentation</a></div>}</div>
          <div className="network-pill"><StatusDot>GIWA</StatusDot><small>Testnet · 91342</small></div>
          <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}</button>
          <Button size="sm" onClick={() => setConnected(!connected)}>{connected ? '0x8F2…91A' : 'Connect Wallet'}</Button>
          <button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={23} /></button>
        </div>
      </div>
    </header>

    {mobileOpen && <div className="mobile-menu"><div><Brand navigate={navigate} /><button onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={24} /></button></div><nav>{primaryLinks.map(([key, label]) => <a key={key} href={`#/${key}`} onClick={(event) => go(event, key)}>{label}</a>)}</nav><div className="mobile-secondary"><a href="#/currencies" onClick={(event) => go(event, 'currencies')}>Token directory</a><a href="https://ammora-docs.vercel.app">Documentation</a><button className="mobile-theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}><span>{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}Appearance</span><strong>{theme === 'light' ? 'Dark mode' : 'Light mode'}</strong></button></div></div>}

    <main className="service-main">{children}</main>
    <footer className="app-footer"><span>Ammora · GIWA Sepolia</span><div><a href="#/currencies" onClick={(event) => go(event, 'currencies')}>Token directory</a><a href="https://ammora-docs.vercel.app">Docs <FileText size={14} /></a><a href="https://sepolia-explorer.giwa.io">Explorer <ExternalLink size={14} /></a><button className="footer-theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>{theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}<span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span></button></div></footer>
  </div>
}
