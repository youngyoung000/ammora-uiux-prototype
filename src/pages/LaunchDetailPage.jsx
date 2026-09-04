import React, { useState } from 'react'
import { ArrowLeft, Check, ChevronDown, Copy, ExternalLink, Info, Share2, ShieldCheck, Star, Users } from 'lucide-react'
import { Badge, Button, Metric, PageTabs, Panel, SegmentedControl, WorkspaceHeader } from '../design-system/index.jsx'

const tokenProfiles = {
  ETH: { name: 'Ethereum', quote: 'GIWA', price: '3,842.16 GIWA', unitPrice: 3842.16, change: '+6.84%', cap: '1.94B GIWA', volume: '2.84M GIWA', holders: '8,420', progress: 68, color: '#627eea', created: '3h ago' },
  NOVA: { name: 'Nova Protocol', quote: 'USDC', price: '$0.1284', change: '+18.42%', cap: '$1.28M', volume: '$842.6K', holders: '1,284', progress: 74, color: '#7146ff', created: '2h ago' },
  'GIWA+': { name: 'GIWA Plus', quote: 'ETH', price: '$0.0428', change: '+8.16%', cap: '$842K', volume: '$384.2K', holders: '742', progress: 48, color: '#151823', created: '5h ago' },
  LUME: { name: 'Lume Network', quote: 'USDC', price: '$0.3124', change: '+42.06%', cap: '$3.12M', volume: '$1.42M', holders: '2,106', progress: 100, color: '#0a9f75', created: '1d ago' },
}

const trades = [
  { type: 'Buy', wallet: '0x71A…90E', amount: '1.284 ETH', value: '4,932.53 GIWA', time: '18s ago' },
  { type: 'Buy', wallet: '0x19F…42B', amount: '0.842 ETH', value: '3,235.90 GIWA', time: '42s ago' },
  { type: 'Sell', wallet: '0x8C2…E11', amount: '0.420 ETH', value: '1,613.71 GIWA', time: '1m ago' },
  { type: 'Buy', wallet: '0x56D…A28', amount: '2.106 ETH', value: '8,092.79 GIWA', time: '2m ago' },
]

export default function LaunchDetailPage({ symbol, navigate, connected, setConnected }) {
  const token = tokenProfiles[symbol] || tokenProfiles.ETH
  const displaySymbol = tokenProfiles[symbol] ? symbol : 'ETH'
  const [tradeMode, setTradeMode] = useState('Buy')
  const [amount, setAmount] = useState('5000')
  const [section, setSection] = useState('Transactions')
  const unitPrice = token.unitPrice || 0.1284
  const estimate = tradeMode === 'Buy' ? (Number(amount || 0) / unitPrice).toLocaleString(undefined, { maximumFractionDigits: 4 }) : (Number(amount || 0) * unitPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })
  const selectTradeMode = (mode) => {
    setTradeMode(mode)
    setAmount(mode === 'Buy' ? '5000' : '1')
  }

  return <>
    <button className="back-link" onClick={() => navigate('launch')}><ArrowLeft size={17} />Back to launches</button>
    <WorkspaceHeader title={`${displaySymbol} / ${token.quote}`} actions={<><Button variant="secondary" icon={<Star size={17} />}>Watch</Button><Button variant="secondary" icon={<Share2 size={17} />}>Share</Button></>} />

    <div className="detail-metrics metrics-grid four">
      <Metric label="Current price" value={token.price} note={token.change} tone="positive" />
      <Metric label="Market cap" value={token.cap} note="Fully diluted" />
      <Metric label="24H volume" value={token.volume} note="382 trades" />
      <Metric label="Holders" value={token.holders} note="Onchain addresses" />
    </div>

    <div className="market-detail-grid">
      <aside className="market-sidebar">
        <Panel className="token-summary-card">
          <div className="token-identity"><span style={{ '--launch-color': token.color }}>{displaySymbol.slice(0, 1)}</span><div><strong>{displaySymbol}</strong><small>{token.name}</small></div></div>
          <p>A community-launched market using segmented price discovery and a permanent-liquidity graduation path.</p>
          <button className="address-row"><span>0xe818…9F56</span><Copy size={15} /></button>
        </Panel>
        <Panel className="graduation-card">
          <div className="card-label-row"><span className="section-eyebrow">Market progress</span><Badge tone={token.progress === 100 ? 'success' : 'neutral'}>{token.progress === 100 ? 'Complete' : `${token.progress}% funded`}</Badge></div>
          <strong>{token.progress === 100 ? 'Permanent pool is live' : '128.4K GIWA until permanent liquidity'}</strong>
          <div className="graduation-track"><i style={{ width: `${token.progress}%` }} /></div>
          <div className="graduation-labels"><span>Price discovery</span><span>Permanent pool</span></div>
        </Panel>
        <details className="advanced-disclosure market-facts-card"><summary><span>Advanced market details</span><ChevronDown size={17} /></summary><div className="advanced-content"><dl><div><dt>Mechanism</dt><dd>Segmented curve</dd></div><div><dt>Protocol</dt><dd>ALC</dd></div><div><dt>Trading fee</dt><dd>0.30%</dd></div><div><dt>Quote asset</dt><dd>{token.quote}</dd></div><div><dt>Creator</dt><dd>0x4D2…881</dd></div><div><dt>Config</dt><dd className="verified-copy"><ShieldCheck size={15} />Verified</dd></div></dl><a href="https://sepolia-explorer.giwa.io" target="_blank" rel="noreferrer">View on explorer <ExternalLink size={15} /></a></div></details>
      </aside>

      <section className="market-detail-main">
        <Panel className="price-chart-panel">
          <div className="chart-heading"><div><span className="section-eyebrow">Price chart</span><h2>{token.price} <em>{token.change}</em></h2></div><SegmentedControl items={['1H', '24H', '7D', 'All']} value="24H" onChange={() => {}} label="Chart range" /></div>
          <div className="chart-meta"><span>Open 3,596.82</span><span>High 3,914.20</span><span>Low 3,542.48</span><span>Volume {token.volume}</span></div>
          <div className="market-chart" role="img" aria-label={`${displaySymbol} price chart over 24 hours`}>
            <svg viewBox="0 0 760 330" preserveAspectRatio="none">
              <defs>
                <linearGradient id="price-line-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--brand-violet)" />
                  <stop offset="52%" stopColor="var(--brand-blue)" />
                  <stop offset="100%" stopColor="var(--brand-mint)" />
                </linearGradient>
                <linearGradient id="price-area-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--brand-violet)" stopOpacity=".17" />
                  <stop offset="52%" stopColor="var(--brand-blue)" stopOpacity=".13" />
                  <stop offset="100%" stopColor="var(--brand-mint)" stopOpacity=".17" />
                </linearGradient>
              </defs>
              <g className="chart-grid"><line x1="0" y1="55" x2="760" y2="55" /><line x1="0" y1="135" x2="760" y2="135" /><line x1="0" y1="215" x2="760" y2="215" /><line x1="0" y1="295" x2="760" y2="295" /><line x1="150" y1="0" x2="150" y2="330" /><line x1="350" y1="0" x2="350" y2="330" /><line x1="550" y1="0" x2="550" y2="330" /></g>
              <path className="chart-area" d="M0 284 C45 274 78 279 112 250 S174 228 212 238 S286 180 326 195 S385 164 424 174 S488 108 526 124 S576 94 612 106 S678 44 760 58 L760 330 L0 330 Z" />
              <path className="chart-line" d="M0 284 C45 274 78 279 112 250 S174 228 212 238 S286 180 326 195 S385 164 424 174 S488 108 526 124 S576 94 612 106 S678 44 760 58" />
              <circle cx="612" cy="106" r="6" />
            </svg>
            <div className="chart-axis"><span>12:00</span><span>18:00</span><span>00:00</span><span>Now</span></div>
          </div>
        </Panel>

        <Panel className="market-activity-panel">
          <PageTabs items={['Transactions', 'Holders', 'Market info']} value={section} onChange={setSection} label="Token market details" />
          {section === 'Transactions' && <div className="trade-list"><div className="trade-row trade-head"><span>Type</span><span>Wallet</span><span>Amount</span><span>Value</span><span>Time</span></div>{trades.map((trade, index) => <div className="trade-row" key={`${trade.wallet}-${index}`}><strong className={trade.type === 'Buy' ? 'positive-value' : 'negative-value'}>{trade.type}</strong><span>{trade.wallet}</span><span>{trade.amount}</span><strong>{trade.value}</strong><span>{trade.time}</span></div>)}</div>}
          {section === 'Holders' && <div className="detail-empty"><Users size={25} /><strong>{token.holders} holder addresses</strong><p>Ownership concentration and reviewed wallet activity will appear here.</p></div>}
          {section === 'Market info' && <div className="detail-empty"><Info size={25} /><strong>Onchain market state</strong><p>ALC config, token policy, freshness, and graduation bindings are verified before actions.</p></div>}
        </Panel>
      </section>

      <aside className="trade-sidebar">
        <Panel className="token-trade-card">
          <div className="trade-card-header"><h2>Trade {displaySymbol}</h2><Badge tone="success">Live quote</Badge></div>
          <SegmentedControl items={['Buy', 'Sell']} value={tradeMode} onChange={selectTradeMode} label="Trade direction" />
          <label className="trade-amount-field"><span>{tradeMode === 'Buy' ? `Pay with ${token.quote}` : `Sell ${displaySymbol}`}</span><div><input value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^0-9.]/g, ''))} /><strong>{tradeMode === 'Buy' ? token.quote : displaySymbol}</strong></div><small>Balance: {tradeMode === 'Buy' ? '18,420.00 GIWA' : '6.8420 ETH'}</small></label>
          <div className="amount-presets">{(tradeMode === 'Buy' ? ['1,000', '5,000', '10,000', 'Max'] : ['0.1', '0.5', '1', 'Max']).map((item) => <button key={item} onClick={() => item !== 'Max' && setAmount(item.replace(',', ''))}>{item}</button>)}</div>
          <div className="trade-estimate"><span>You receive</span><strong>{estimate} {tradeMode === 'Buy' ? displaySymbol : token.quote}</strong></div>
          <dl className="trade-review"><div><dt>Price impact</dt><dd>0.18%</dd></div><div><dt>Minimum received</dt><dd>{(Number(estimate.replaceAll(',', '')) * .995).toLocaleString(undefined, { maximumFractionDigits: 2 })}</dd></div><div><dt>Trading fee</dt><dd>0.30%</dd></div></dl>
          <Button className="full-button" onClick={() => setConnected(true)}>{connected ? `Review ${tradeMode.toLowerCase()}` : 'Connect wallet'}</Button>
          <p className="trade-notice"><Check size={15} />Quote, minimum output, fee, and token policy are checked again before signing.</p>
        </Panel>
      </aside>
    </div>
  </>
}
