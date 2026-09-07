import React, { useEffect, useState } from 'react'
import { Shell } from './components/Shell.jsx'
import ExplorePage from './pages/ExplorePage.jsx'
import SwapPage from './pages/SwapPage.jsx'
import PortfolioPage from './pages/PortfolioPage.jsx'
import CreatePage from './pages/CreatePage.jsx'
import LaunchPage from './pages/LaunchPage.jsx'
import CurrenciesPage from './pages/CurrenciesPage.jsx'
import FeesPage from './pages/FeesPage.jsx'
import LaunchDetailPage from './pages/LaunchDetailPage.jsx'
import PoolDetailPage from './pages/PoolDetailPage.jsx'
import CurrencyDetailPage from './pages/CurrencyDetailPage.jsx'
import PositionDetailPage from './pages/PositionDetailPage.jsx'

const validRoutes = ['explore', 'swap', 'portfolio', 'create', 'launch', 'currencies', 'fees']
const getRoute = () => {
  const hashParts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const hashRoute = hashParts[0]
  const pathRoute = window.location.pathname.split('/').filter(Boolean).at(-1)
  if (hashRoute === 'launch' && (hashParts[1] === 'create' || hashParts[1] === 'watching')) return 'launch'
  if (hashRoute === 'launch' && hashParts[1]) return 'launch-detail'
  if (hashRoute === 'pool' && hashParts[1]) return 'pool-detail'
  if (hashRoute === 'currency' && hashParts[1]) return 'currency-detail'
  if (hashRoute === 'position' && hashParts[1]) return 'position-detail'
  return validRoutes.includes(hashRoute) ? hashRoute : validRoutes.includes(pathRoute) ? pathRoute : 'swap'
}

const getLaunchToken = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)[1]?.toUpperCase() || 'ETH'
const getPoolId = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)[1] || 'eth-usdc'
const getEntityId = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)[1] || 'eth-usdc'
const getInitialTheme = () => {
  try {
    const savedTheme = window.localStorage.getItem('ammora-theme')
    if (savedTheme) return savedTheme
  } catch {
    // Sandboxed previews can block storage access. Theme persistence is optional.
  }
  return 'light'
}
const getInitialWatchedLaunches = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem('ammora-watched-launches') || '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export default function App() {
  const [route, setRoute] = useState(getRoute)
  const [launchToken, setLaunchToken] = useState(getLaunchToken)
  const [poolId, setPoolId] = useState(getPoolId)
  const [entityId, setEntityId] = useState(getEntityId)
  const [connected, setConnected] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const [watchedLaunches, setWatchedLaunches] = useState(getInitialWatchedLaunches)

  useEffect(() => {
    const syncRoute = () => { setRoute(getRoute()); setLaunchToken(getLaunchToken()); setPoolId(getPoolId()); setEntityId(getEntityId()) }
    window.addEventListener('hashchange', syncRoute)
    window.addEventListener('popstate', syncRoute)
    return () => { window.removeEventListener('hashchange', syncRoute); window.removeEventListener('popstate', syncRoute) }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem('ammora-theme', theme)
    } catch {
      // Keep theme switching functional when persistence is unavailable.
    }
  }, [theme])

  useEffect(() => {
    try {
      window.localStorage.setItem('ammora-watched-launches', JSON.stringify(watchedLaunches))
    } catch {
      // Watching remains available for the current session when storage is blocked.
    }
  }, [watchedLaunches])

  const toggleWatchedLaunch = (symbol) => setWatchedLaunches((items) => items.includes(symbol) ? items.filter((item) => item !== symbol) : [...items, symbol])

  const navigate = (nextRoute) => {
    window.location.hash = `/${nextRoute}`
    setRoute(nextRoute.startsWith('launch/') && nextRoute !== 'launch/create' ? 'launch-detail' : nextRoute.startsWith('pool/') ? 'pool-detail' : nextRoute.startsWith('currency/') ? 'currency-detail' : nextRoute.startsWith('position/') ? 'position-detail' : nextRoute === 'launch/create' ? 'launch' : nextRoute)
    if (nextRoute.startsWith('launch/')) setLaunchToken(nextRoute.split('/')[1].toUpperCase())
    if (nextRoute.startsWith('pool/')) setPoolId(nextRoute.split('/')[1])
    if (nextRoute.startsWith('currency/') || nextRoute.startsWith('position/')) setEntityId(nextRoute.split('/')[1])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pages = {
    explore: <ExplorePage navigate={navigate} />,
    swap: <SwapPage connected={connected} setConnected={setConnected} />,
    portfolio: <PortfolioPage connected={connected} setConnected={setConnected} navigate={navigate} />,
    create: <CreatePage navigate={navigate} />,
    launch: <LaunchPage navigate={navigate} watchedLaunches={watchedLaunches} toggleWatchedLaunch={toggleWatchedLaunch} />,
    'launch-detail': <LaunchDetailPage symbol={launchToken} navigate={navigate} connected={connected} setConnected={setConnected} watchedLaunches={watchedLaunches} toggleWatchedLaunch={toggleWatchedLaunch} />,
    'pool-detail': <PoolDetailPage poolId={poolId} navigate={navigate} connected={connected} setConnected={setConnected} />,
    currencies: <CurrenciesPage navigate={navigate} />,
    fees: <FeesPage connected={connected} setConnected={setConnected} navigate={navigate} />,
    'currency-detail': <CurrencyDetailPage symbol={entityId} navigate={navigate} />,
    'position-detail': <PositionDetailPage positionId={entityId} navigate={navigate} connected={connected} setConnected={setConnected} />,
  }

  return <Shell route={route} navigate={navigate} connected={connected} setConnected={setConnected} theme={theme} setTheme={setTheme}>{pages[route]}</Shell>
}
