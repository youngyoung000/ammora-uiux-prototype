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

const validRoutes = ['explore', 'swap', 'portfolio', 'create', 'launch', 'currencies', 'fees']
const getRoute = () => {
  const hashParts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const hashRoute = hashParts[0]
  const pathRoute = window.location.pathname.split('/').filter(Boolean).at(-1)
  if (hashRoute === 'launch' && hashParts[1] === 'create') return 'launch'
  if (hashRoute === 'launch' && hashParts[1]) return 'launch-detail'
  if (hashRoute === 'pool' && hashParts[1]) return 'pool-detail'
  return validRoutes.includes(hashRoute) ? hashRoute : validRoutes.includes(pathRoute) ? pathRoute : 'swap'
}

const getLaunchToken = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)[1]?.toUpperCase() || 'ETH'
const getPoolId = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)[1] || 'eth-usdc'

export default function App() {
  const [route, setRoute] = useState(getRoute)
  const [launchToken, setLaunchToken] = useState(getLaunchToken)
  const [poolId, setPoolId] = useState(getPoolId)
  const [connected, setConnected] = useState(false)
  const [theme, setTheme] = useState(() => window.localStorage.getItem('ammora-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))

  useEffect(() => {
    const syncRoute = () => { setRoute(getRoute()); setLaunchToken(getLaunchToken()); setPoolId(getPoolId()) }
    window.addEventListener('hashchange', syncRoute)
    window.addEventListener('popstate', syncRoute)
    return () => { window.removeEventListener('hashchange', syncRoute); window.removeEventListener('popstate', syncRoute) }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('ammora-theme', theme)
  }, [theme])

  const navigate = (nextRoute) => {
    window.location.hash = `/${nextRoute}`
    setRoute(nextRoute.startsWith('launch/') ? 'launch-detail' : nextRoute.startsWith('pool/') ? 'pool-detail' : nextRoute)
    if (nextRoute.startsWith('launch/')) setLaunchToken(nextRoute.split('/')[1].toUpperCase())
    if (nextRoute.startsWith('pool/')) setPoolId(nextRoute.split('/')[1])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pages = {
    explore: <ExplorePage navigate={navigate} />,
    swap: <SwapPage connected={connected} setConnected={setConnected} />,
    portfolio: <PortfolioPage connected={connected} setConnected={setConnected} navigate={navigate} />,
    create: <CreatePage navigate={navigate} />,
    launch: <LaunchPage navigate={navigate} />,
    'launch-detail': <LaunchDetailPage symbol={launchToken} navigate={navigate} connected={connected} setConnected={setConnected} />,
    'pool-detail': <PoolDetailPage poolId={poolId} navigate={navigate} connected={connected} setConnected={setConnected} />,
    currencies: <CurrenciesPage />,
    fees: <FeesPage connected={connected} setConnected={setConnected} navigate={navigate} />,
  }

  return <Shell route={route} navigate={navigate} connected={connected} setConnected={setConnected} theme={theme} setTheme={setTheme}>{pages[route]}</Shell>
}
