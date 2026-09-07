import React, { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, ChevronDown, Search, Settings2, X } from 'lucide-react'
import { Button, Panel, SegmentedControl } from '../design-system/index.jsx'

const tokenCatalog = [
  { symbol: 'ETH', name: 'Ether', address: '0x0000...0000', balance: '6.842', type: 'eth' },
  { symbol: 'WETH', name: 'Wrapped Ether', address: '0x4200...0006', balance: '4.120', type: 'eth' },
  { symbol: 'GIWA', name: 'GIWA', address: '0x9134...2042', balance: '28,420', type: 'giwa' },
  { symbol: 'USDC', name: 'USD Coin', address: '0x8335...2913', balance: '18,420', type: 'usdc' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x1f6e...0a7e', balance: '0.428', type: 'btc' },
  { symbol: 'USDT', name: 'Tether USD', address: '0xfde4...a7c0', balance: '8,214', type: 'usdt' },
]

const tokenMap = Object.fromEntries(tokenCatalog.map((token) => [token.symbol, token]))

export default function SwapPage({ connected, setConnected }) {
  const [payToken, setPayToken] = useState('ETH')
  const [receiveToken, setReceiveToken] = useState('USDC')
  const [amount, setAmount] = useState('1')
  const [routeMode, setRouteMode] = useState('Best price')
  const [tokenModal, setTokenModal] = useState(null)
  const [slippage, setSlippage] = useState('0.5%')
  const [deadline, setDeadline] = useState('20')
  const rates = { 'ETH-USDC': 4284.22, 'USDC-GIWA': 1.2842, 'USDT-USDC': 1.0003, 'GIWA-USDC': .7787 }
  const rate = rates[`${payToken}-${receiveToken}`] || 1.2842
  const received = amount ? (Number(amount) * rate).toLocaleString(undefined, { maximumFractionDigits: 4 }) : ''
  const minimum = amount ? (Number(received.replaceAll(',', '')) * .995).toLocaleString(undefined, { maximumFractionDigits: 4 }) : '—'
  const payBalance = `${tokenMap[payToken]?.balance || '—'} ${payToken}`
  const receiveBalance = `${tokenMap[receiveToken]?.balance || '—'} ${receiveToken}`
  const chooseToken = (symbol) => {
    if (tokenModal === 'pay') setPayToken(symbol)
    if (tokenModal === 'receive') setReceiveToken(symbol)
    setTokenModal(null)
  }

  return <>
    <Panel className="swap-panel swap-focus-card" id="swap-workspace">
      <div className="swap-card-title">
        <div><h2>Swap</h2></div>
        <div className="swap-title-actions"><button aria-label="Swap settings" onClick={() => document.getElementById('swap-settings')?.setAttribute('open', '')}><Settings2 size={18} /></button><span className="giwa-network-mark"><img src="/giwa-black.svg" alt="GIWA" /></span></div>
      </div>
      <div className="swap-desktop-grid">
        <div className="swap-assets">
          <SwapField label="You pay" value={amount} onChange={setAmount} token={payToken} balance={payBalance} onOpenToken={() => setTokenModal('pay')} />
          <button className="switch-tokens" onClick={() => { setPayToken(receiveToken); setReceiveToken(payToken) }} aria-label="Switch tokens"><ArrowRight size={19} /></button>
          <SwapField label="You receive" value={received} token={receiveToken} balance={receiveBalance} onOpenToken={() => setTokenModal('receive')} readOnly />
        </div>
        <div className="swap-review-pane">
          <div className="swap-review-title"><span>Quote</span><strong>Best available route</strong></div>
          {amount && <div className="quote-summary"><div><span>Rate</span><strong>1 {payToken} = {rate.toLocaleString()} {receiveToken}</strong></div><div><span>Minimum received</span><strong>{minimum} {receiveToken}</strong></div><div><span>Price impact</span><strong className="positive-value">&lt; 0.01%</strong></div></div>}
          <details className="advanced-disclosure" id="swap-settings">
            <summary><span><Settings2 size={17} />Route & transaction details</span><ChevronDown size={17} /></summary>
            <div className="advanced-content"><SegmentedControl items={['Best price', 'Direct pool']} value={routeMode} onChange={setRouteMode} label="Swap route" /><div className="swap-setting-row"><span>Slippage</span><SegmentedControl items={['0.1%', '0.5%', '1%', 'Custom']} value={slippage} onChange={setSlippage} label="Slippage" /></div><label className="inline-setting"><span>Deadline</span><input value={deadline} onChange={(event) => setDeadline(event.target.value.replace(/\D/g, ''))} /><strong>minutes</strong></label><dl><div><dt>Route</dt><dd>{routeMode === 'Best price' ? '3 reviewed routes' : '1 verified pool'}</dd></div><div><dt>Routing fee</dt><dd>0.05%</dd></div><div><dt>Approval</dt><dd>Prepared separately</dd></div></dl></div>
          </details>
          <Button className="full-button" onClick={() => setConnected(true)}>{connected ? 'Review swap' : 'Connect wallet'}</Button>
          <p className="action-assurance"><Check size={15} />Minimum received and route are checked again before signing.</p>
        </div>
      </div>
    </Panel>
    <details className="advanced-disclosure recent-swap-disclosure"><summary><span>Recent swaps</span><ChevronDown size={17} /></summary><div className="advanced-content timeline-list"><article><Check size={17} /><div><strong>0.5 ETH → 2,142.11 USDC</strong><span>Best route · Confirmed</span></div><time>This session</time></article></div></details>
    {tokenModal && <TokenSelectorModal side={tokenModal} selected={tokenModal === 'pay' ? payToken : receiveToken} onSelect={chooseToken} onClose={() => setTokenModal(null)} />}
  </>
}

function SwapField({ label, value, onChange, token, balance, onOpenToken, readOnly }) {
  return <label className="swap-field">
    <span>{label}<small>Balance {balance}</small></span>
    <div>
      <input value={value} onChange={(event) => onChange?.(event.target.value.replace(/[^0-9.]/g, ''))} readOnly={readOnly} placeholder="0" inputMode="decimal" />
      <button type="button" className="token-select-button" onClick={onOpenToken} aria-label={`Select ${label.toLowerCase()} token`}>
        <TokenLogo token={tokenMap[token]} /><strong>{token}</strong><ChevronDown size={17} />
      </button>
    </div>
  </label>
}

function TokenSelectorModal({ side, selected, onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => tokenCatalog.filter((token) => `${token.symbol} ${token.name} ${token.address}`.toLowerCase().includes(query.trim().toLowerCase())), [query])
  useEffect(() => {
    const onKeyDown = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])
  return <div className="token-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="token-modal" role="dialog" aria-modal="true" aria-labelledby="token-modal-title">
      <header><h2 id="token-modal-title">Select a token to {side === 'pay' ? 'sell' : 'buy'}</h2><button type="button" onClick={onClose} aria-label="Close token selector"><X size={25} /></button></header>
      <label className="token-modal-search"><Search size={21} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search token or address" /></label>
      {!query && <div className="token-shortcuts" aria-label="Popular tokens">{tokenCatalog.slice(0, 5).map((token) => <button type="button" key={token.symbol} className={selected === token.symbol ? 'selected' : ''} onClick={() => onSelect(token.symbol)}><TokenLogo token={token} /><span>{token.symbol}</span></button>)}</div>}
      <div className="token-list-label">Tokens</div>
      <div className="token-modal-list">{filtered.map((token) => <button type="button" key={token.symbol} className={selected === token.symbol ? 'selected' : ''} onClick={() => onSelect(token.symbol)}>
        <TokenLogo token={token} />
        <span><strong>{token.name}</strong><small>{token.symbol}</small></span>
        <span className="token-list-meta"><strong>{token.balance}</strong><small>{token.address}</small></span>
      </button>)}{filtered.length === 0 && <div className="token-empty"><strong>No tokens found</strong><span>Check the name, symbol, or contract address.</span></div>}</div>
    </section>
  </div>
}

function TokenLogo({ token }) {
  if (!token) return null
  if (token.type === 'eth') return <span className="token-logo token-logo--eth" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M16 3 8.5 16 16 20.3 23.5 16 16 3Z" fill="currentColor" opacity=".92"/><path d="M8.5 17.5 16 29l7.5-11.5L16 22Z" fill="currentColor" opacity=".68"/><path d="M16 3v17.3L8.5 16 16 3Z" fill="#fff" opacity=".72"/></svg></span>
  if (token.type === 'btc') return <span className="token-logo token-logo--btc" aria-hidden="true">₿</span>
  if (token.type === 'usdc') return <span className="token-logo token-logo--usdc" aria-hidden="true">$</span>
  if (token.type === 'usdt') return <span className="token-logo token-logo--usdt" aria-hidden="true">₮</span>
  return <span className="token-logo token-logo--giwa" aria-hidden="true">G</span>
}
