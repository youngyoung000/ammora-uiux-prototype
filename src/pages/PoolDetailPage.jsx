import React, { useRef, useState } from 'react'
import { ArrowLeft, Check, ChevronDown, Info, Settings2 } from 'lucide-react'
import { Badge, BrandSurface, Button, Metric, PageTabs, Panel, SegmentedControl, StatusDot, WorkspaceHeader } from '../design-system/index.jsx'

const distributions = {
  Spot: [18, 28, 44, 62, 86, 100, 86, 62, 44, 28, 18],
  Curve: [12, 18, 28, 42, 64, 92, 78, 58, 36, 22, 14],
  'Wide range': [42, 48, 55, 62, 68, 72, 68, 62, 55, 48, 42],
}

const RANGE_FLOOR = 3400
const RANGE_CEILING = 5200
const CURRENT_PRICE = 4284.22
const priceAt = (percent) => Math.round(percent <= 50
  ? RANGE_FLOOR + (CURRENT_PRICE - RANGE_FLOOR) * percent / 50
  : CURRENT_PRICE + (RANGE_CEILING - CURRENT_PRICE) * (percent - 50) / 50)
const percentAt = (price) => Math.max(0, Math.min(100, price <= CURRENT_PRICE
  ? (price - RANGE_FLOOR) / (CURRENT_PRICE - RANGE_FLOOR) * 50
  : 50 + (price - CURRENT_PRICE) / (RANGE_CEILING - CURRENT_PRICE) * 50))

export default function PoolDetailPage({ poolId, navigate, connected, setConnected }) {
  const pairParts = poolId.split('-').map((item) => item.toUpperCase())
  const pair = pairParts.join(' / ')
  const [tab, setTab] = useState('Liquidity')
  const [strategy, setStrategy] = useState('Spot')
  const [depositMode, setDepositMode] = useState('Both tokens')
  const [amount, setAmount] = useState('1')
  const [quoteAmount, setQuoteAmount] = useState('4284.22')
  const [minRange, setMinRange] = useState(percentAt(3840))
  const [maxRange, setMaxRange] = useState(percentAt(4760))
  const minPrice = priceAt(minRange)
  const maxPrice = priceAt(maxRange)

  return <>
    <button className="back-link" onClick={() => navigate('explore')}><ArrowLeft size={17} />Back to liquidity</button>
    <WorkspaceHeader title={pair} meta={<><StatusDot>Pool live</StatusDot><Badge tone="neutral">Dynamic liquidity · ALMM</Badge></>} actions={<Button variant="secondary" onClick={() => navigate('swap')}>Trade</Button>} />
    <div className="metrics-grid four pool-metrics"><Metric label="Total liquidity" value="$12.84M" note="Available to trade" /><Metric label="24H volume" value="$28.43M" note="1,284 swaps" /><Metric label="24H fees" value="$42.8K" note="Pool total" /><Metric label="Observed APR" value="18.42%" note="Pool-wide estimate" tone="positive" /></div>
    <PageTabs items={['Overview', 'Liquidity', 'Positions', 'Fee activity']} value={tab} onChange={setTab} label="Pool details" />
    {tab === 'Liquidity' && <div className="pool-detail-grid">
      <Panel className="liquidity-distribution-panel">
        <div className="panel-title-row pool-liquidity-title"><div><h2 className="type-h3">Set price range</h2><p>Choose a preset, then drag either handle to adjust the active range.</p></div><Badge tone="success">Current price $4,284</Badge></div>
        <div className="pool-strategy-tabs"><SegmentedControl items={['Spot', 'Curve', 'Wide range']} value={strategy} onChange={setStrategy} label="Liquidity distribution" /><span>{strategy === 'Spot' ? 'Balanced near current price' : strategy === 'Curve' ? 'Weighted toward active prices' : 'Lower maintenance across a wider range'}</span></div>
        <LiquidityRangeChart distribution={distributions[strategy]} minRange={minRange} maxRange={maxRange} setMinRange={setMinRange} setMaxRange={setMaxRange} />
        <div className="distribution-axis"><span className="axis-floor">${RANGE_FLOOR.toLocaleString()}</span><span className="axis-current">${CURRENT_PRICE.toLocaleString()}</span><span className="axis-ceiling">${RANGE_CEILING.toLocaleString()}</span></div>
        <div className="range-editor">
          <div><span>Min price</span><label><input value={minPrice.toLocaleString()} onChange={(event) => setMinRange(Math.min(maxRange - 8, percentAt(Number(event.target.value.replaceAll(',', '')) || RANGE_FLOOR)))} /><strong>USDC</strong></label></div>
          <div className="range-current"><span>Current</span><strong>$4,284.22</strong></div>
          <div><span>Max price</span><label><input value={maxPrice.toLocaleString()} onChange={(event) => setMaxRange(Math.max(minRange + 8, percentAt(Number(event.target.value.replaceAll(',', '')) || RANGE_CEILING)))} /><strong>USDC</strong></label></div>
        </div>
        <details className="advanced-disclosure pool-advanced"><summary><span><Settings2 size={17} />Advanced pool details</span><ChevronDown size={17} /></summary><div className="advanced-content"><dl><div><dt>Liquidity model</dt><dd>Dynamic liquidity</dd></div><div><dt>Protocol</dt><dd>ALMM</dd></div><div><dt>Fee</dt><dd>0.05% + dynamic fee</dd></div><div><dt>Current bin</dt><dd>8,420</dd></div><div><dt>Bin step</dt><dd>20 bps</dd></div></dl></div></details>
      </Panel>
      <Panel className="add-liquidity-card">
        <div className="trade-card-header"><h2>Add liquidity</h2></div>
        <SegmentedControl items={['Both tokens', 'Single token']} value={depositMode} onChange={setDepositMode} label="Deposit mode" />
        <LiquidityAmount label="ETH amount" token="ETH" value={amount} onChange={setAmount} balance="6.842 ETH" />
        {depositMode === 'Both tokens' && <LiquidityAmount label="USDC amount" token="USDC" value={quoteAmount} onChange={setQuoteAmount} balance="18,420 USDC" />}
        <div className="position-preview"><span>Estimated position</span><strong>${(Number(amount || 0) * 4284.22 + (depositMode === 'Both tokens' ? Number(quoteAmount.replaceAll(',', '') || 0) : 0)).toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong><small>{strategy} distribution · active around current price</small></div>
        <dl className="liquidity-review"><div><dt>Price coverage</dt><dd>{minPrice.toLocaleString()}–{maxPrice.toLocaleString()}</dd></div><div><dt>Pool fee</dt><dd>0.05% + dynamic</dd></div><div><dt>Position</dt><dd>NFT</dd></div></dl>
        <Button className="full-button" onClick={() => setConnected(true)}>{connected ? 'Review position' : 'Connect wallet'}</Button>
        <p className="action-assurance"><Check size={15} />Range, fees, and minimum shares are checked before signing.</p>
      </Panel>
    </div>}
    {tab === 'Overview' && <Panel className="pool-tab-panel"><h2>Pool overview</h2><div className="pool-fact-grid"><span><small>Pair</small><strong>{pair}</strong></span><span><small>Liquidity model</small><strong>Dynamic liquidity</strong></span><span><small>Opening</small><strong>Live</strong></span><span><small>Pool fee</small><strong>0.05% + dynamic</strong></span></div><p><Info size={17} />This market keeps capital near active price bins. Open Liquidity to review the distribution before adding a position.</p></Panel>}
    {tab === 'Positions' && <Panel className="pool-tab-panel pool-empty-state"><strong>{connected ? 'No positions in this pool' : 'Connect to view your positions'}</strong><p>{connected ? 'Add liquidity to open your first position.' : 'Your positions and claimable fees will appear here.'}</p><Button variant="secondary" onClick={() => connected ? setTab('Liquidity') : setConnected(true)}>{connected ? 'Add liquidity' : 'Connect wallet'}</Button></Panel>}
    {tab === 'Fee activity' && <Panel className="pool-tab-panel"><h2>Fee activity</h2><div className="fee-activity-list"><span><strong>24H LP fees</strong><b>$34.2K</b></span><span><strong>Protocol share</strong><b>$8.6K</b></span><span><strong>Last swap fee</strong><b>0.07%</b></span></div><p><Info size={17} />Fees vary with pool activity. Position earnings depend on which price bins are active.</p></Panel>}
  </>
}

function LiquidityRangeChart({ distribution, minRange, maxRange, setMinRange, setMaxRange }) {
  const chartRef = useRef(null)
  const currentRange = 50
  const moveHandle = (handle, clientX) => {
    const bounds = chartRef.current?.getBoundingClientRect()
    if (!bounds) return
    const next = Math.max(0, Math.min(100, (clientX - bounds.left) / bounds.width * 100))
    if (handle === 'min') setMinRange(Math.min(maxRange - 8, next))
    else setMaxRange(Math.max(minRange + 8, next))
  }
  const keyHandle = (handle, event) => {
    const delta = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0
    if (!delta) return
    event.preventDefault()
    if (handle === 'min') setMinRange(Math.max(0, Math.min(maxRange - 8, minRange + delta)))
    else setMaxRange(Math.min(100, Math.max(minRange + 8, maxRange + delta)))
  }
  const minDelta = ((priceAt(minRange) / CURRENT_PRICE - 1) * 100).toFixed(1)
  const maxDelta = ((priceAt(maxRange) / CURRENT_PRICE - 1) * 100).toFixed(1)
  const minDeltaLabel = Number(minDelta) > 0 ? `+${minDelta}%` : `${minDelta}%`
  const maxDeltaLabel = Number(maxDelta) > 0 ? `+${maxDelta}%` : `${maxDelta}%`
  return <div className="distribution-chart range-chart">
    <div className="range-plot" ref={chartRef} style={{ '--range-min': `${minRange}%`, '--range-max': `${maxRange}%`, '--current-range': `${currentRange}%` }}>
      <div className="range-selection" />
      <div className="range-bars" aria-hidden="true">{distribution.map((height, index) => {
        const position = index / (distribution.length - 1) * 100
        return <i key={index} style={{ height: `${height}%` }} className={position >= minRange && position <= maxRange ? 'in-range' : ''} />
      })}</div>
      <div className="current-range-marker"><BrandSurface>Current price</BrandSurface></div>
      <button type="button" role="slider" className="range-handle range-handle--min" aria-label="Minimum price range" aria-valuemin={RANGE_FLOOR} aria-valuemax={priceAt(maxRange - 8)} aria-valuenow={priceAt(minRange)} onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)} onPointerMove={(event) => event.currentTarget.hasPointerCapture(event.pointerId) && moveHandle('min', event.clientX)} onKeyDown={(event) => keyHandle('min', event)}><span>{minDeltaLabel}</span></button>
      <button type="button" role="slider" className="range-handle range-handle--max" aria-label="Maximum price range" aria-valuemin={priceAt(minRange + 8)} aria-valuemax={RANGE_CEILING} aria-valuenow={priceAt(maxRange)} onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)} onPointerMove={(event) => event.currentTarget.hasPointerCapture(event.pointerId) && moveHandle('max', event.clientX)} onKeyDown={(event) => keyHandle('max', event)}><span>{maxDeltaLabel}</span></button>
    </div>
  </div>
}

function LiquidityAmount({ label, token, value, onChange, balance }) {
  return <label className="liquidity-amount"><span>{label}<small>Balance {balance}</small></span><div><input value={value} onChange={(event) => onChange(event.target.value.replace(/[^0-9.,]/g, ''))} inputMode="decimal" /><strong>{token}</strong></div></label>
}
