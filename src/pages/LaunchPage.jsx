import React, { useState } from 'react'
import { ArrowUpRight, CalendarClock, Check, ChevronDown, Coins, Rocket, Sparkles } from 'lucide-react'
import { Badge, BrandSurface, Button, PageTabs, Panel, QuickSelect, SearchField, SegmentedControl, WorkspaceHeader } from '../design-system/index.jsx'
import { FlowSteps, MiniTrend } from '../components/Common.jsx'

const launches = [
  { token: 'ETH', name: 'Ethereum', quote: 'GIWA', progress: 68, raised: '271.6K GIWA', price: '3,842.16 GIWA', change: '+6.84%', volume: '2.84M GIWA', holders: '8,420', status: 'Active', age: '3h', description: 'ETH liquidity launching with GIWA-native price discovery.', color: '#627eea', trend: [18, 20, 19, 25, 29, 27, 34, 38, 36, 44] },
  { token: 'NOVA', name: 'Nova Protocol', quote: 'USDC', progress: 74, raised: '$184.2K', price: '$0.1284', change: '+18.42%', volume: '$842.6K', holders: '1,284', status: 'Active', age: '2h', description: 'Community-owned liquidity infrastructure.', color: '#7146ff', trend: [12, 15, 14, 23, 21, 32, 38, 45, 42, 55] },
  { token: 'GIWA+', name: 'GIWA Plus', quote: 'ETH', progress: 48, raised: '$92.8K', price: '$0.0428', change: '+8.16%', volume: '$384.2K', holders: '742', status: 'Active', age: '5h', description: 'Network-native rewards and governance.', color: '#151823', trend: [18, 17, 22, 20, 26, 31, 28, 35, 39, 42] },
  { token: 'LUME', name: 'Lume Network', quote: 'USDC', progress: 100, raised: '$312.4K', price: '$0.3124', change: '+42.06%', volume: '$1.42M', holders: '2,106', status: 'Graduated', age: '1d', description: 'A graduated market with permanent ARL liquidity.', color: '#0a9f75', trend: [10, 16, 14, 28, 36, 34, 49, 52, 61, 70] },
  { token: 'ORBIT', name: 'Orbit Labs', quote: 'USDC', progress: 100, raised: '$184.2K', price: '$0.0186', change: '+5.24%', volume: '$126.8K', holders: '318', status: 'Ready', age: '36m', description: 'Funding complete. Ready to continue into permanent liquidity.', color: '#42c9e8', trend: [20, 22, 19, 24, 23, 27, 31, 30, 35, 38] },
]

export default function LaunchPage({ navigate }) {
  const [filter, setFilter] = useState('All')
  const [quickRoute, setQuickRoute] = useState('standard')
  const [section, setSection] = useState(() => window.location.hash.includes('/launch/create') ? 'Create launch' : 'Markets')
  const [query, setQuery] = useState('')
  const [tokenName, setTokenName] = useState('Ammora Ether')
  const [tokenSymbol, setTokenSymbol] = useState('AETH')
  const [quoteAsset, setQuoteAsset] = useState('GIWA')
  const [fundingTarget, setFundingTarget] = useState('400000')
  const [firstBuy, setFirstBuy] = useState('1')
  const [activation, setActivation] = useState('2026-09-12T10:00')
  const selectQuickRoute = (route) => {
    setQuickRoute(route)
    document.getElementById('launch-lifecycle')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const selectSection = (nextSection) => {
    setSection(nextSection)
    window.history.replaceState(null, '', nextSection === 'Create launch' ? '#/launch/create' : '#/launch')
    document.querySelector('.page-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const visible = launches.filter((item) => (filter === 'All' || item.status === filter) && `${item.token} ${item.name}`.toLowerCase().includes(query.toLowerCase()))
  return <>
    <WorkspaceHeader title="Launch" description="Open a live market or create a new one." actions={<Button onClick={() => selectSection('Create launch')}>Create launch</Button>} />
    <PageTabs items={['Markets', 'Create launch']} value={section} onChange={selectSection} label="Launch workspace" />
    {section === 'Create launch' && <QuickSelect id="launch-quick" title="Choose a launch setup" description="These choices affect activation, first participation, and the path to permanent liquidity." value={quickRoute} onSelect={selectQuickRoute} options={[
      { id: 'standard', label: 'Standard launch', description: 'Token + ALC curve with reviewed defaults.', meta: 'Simple setup', recommended: true, icon: <Rocket size={20} /> },
      { id: 'first-buy', label: 'Launch with first buy', description: 'Prepare the initial purchase in one plan.', meta: 'Initial demand', icon: <Sparkles size={20} /> },
      { id: 'scheduled', label: 'Scheduled activation', description: 'Fund first and open trading later.', meta: 'Timed opening', icon: <CalendarClock size={20} /> },
    ]} />}
    {section === 'Create launch' && <Panel className="launch-create-builder">
      <div className="launch-create-form">
        <div className="launch-builder-heading"><span>1</span><div><h2>Token details</h2><p>Define the asset users will discover and trade.</p></div></div>
        <div className="launch-field-grid">
          <label className="builder-field"><span>Token name</span><input value={tokenName} onChange={(event) => setTokenName(event.target.value)} placeholder="Token name" /></label>
          <label className="builder-field"><span>Symbol</span><input value={tokenSymbol} onChange={(event) => setTokenSymbol(event.target.value.toUpperCase().slice(0, 8))} placeholder="TOKEN" /></label>
        </div>
        <label className="builder-field launch-upload"><span>Token image</span><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" /><small>PNG, JPEG, WebP, or GIF · up to 2 MB · cropped square</small></label>
        <div className="launch-builder-heading"><span>2</span><div><h2>Opening market</h2><p>Choose the quote asset and graduation target.</p></div></div>
        <div className="launch-field-grid">
          <label className="builder-field"><span>Paired with</span><select value={quoteAsset} onChange={(event) => setQuoteAsset(event.target.value)}><option>GIWA</option><option>USDC</option><option>ETH</option></select></label>
          <label className="builder-field"><span>Graduation target</span><div className="builder-input-suffix"><input value={fundingTarget} onChange={(event) => setFundingTarget(event.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" /><strong>{quoteAsset}</strong></div></label>
        </div>
        {quickRoute === 'first-buy' && <label className="builder-field launch-full-field"><span>First buy</span><div className="builder-input-suffix"><input value={firstBuy} onChange={(event) => setFirstBuy(event.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" /><strong>{quoteAsset}</strong></div><small>Included after the launch transaction is prepared.</small></label>}
        {quickRoute === 'scheduled' && <label className="builder-field launch-full-field"><span>Trading opens</span><input type="datetime-local" value={activation} onChange={(event) => setActivation(event.target.value)} /></label>}
        <details className="advanced-disclosure launch-advanced"><summary><span>Advanced launch settings</span><ChevronDown size={17} /></summary><div className="advanced-content"><label className="builder-field"><span>Reviewed preset</span><select><option>Balanced discovery · Compounding pool</option><option>Fast discovery · Concentrated pool</option></select></label><label className="builder-field"><span>Creator metadata URI</span><input placeholder="ipfs:// or https://" /></label><dl><div><dt>Supply</dt><dd>1B tokens</dd></div><div><dt>Segments</dt><dd>8</dd></div><div><dt>Start fee</dt><dd>1.00%</dd></div><div><dt>Dynamic fee</dt><dd>Enabled</dd></div><div><dt>Migration target</dt><dd>400K {quoteAsset}</dd></div><div><dt>Permanent liquidity</dt><dd>Compounding</dd></div></dl></div></details>
      </div>
      <aside className="launch-create-review">
        <Coins size={24} />
        <h2>Review launch</h2>
        <div className="launch-review-token"><BrandSurface>{tokenSymbol.slice(0, 1) || 'T'}</BrandSurface><div><strong>{tokenSymbol || 'TOKEN'} / {quoteAsset}</strong><small>{tokenName || 'Unnamed token'}</small></div></div>
        <dl><div><dt>Setup</dt><dd>{quickRoute === 'first-buy' ? 'First buy' : quickRoute === 'scheduled' ? 'Scheduled' : 'Standard'}</dd></div><div><dt>Target</dt><dd>{Number(fundingTarget || 0).toLocaleString()} {quoteAsset}</dd></div>{quickRoute === 'first-buy' && <div><dt>Initial buy</dt><dd>{firstBuy || '0'} {quoteAsset}</dd></div>}<div><dt>Next state</dt><dd>Trading</dd></div></dl>
        <div className="launch-path"><span className="active">Create</span><i /><span>Trade</span><i /><span>Pool</span></div>
        <Button className="full-button">Review transactions</Button>
        <p className="action-assurance"><Check size={15} />Addresses, fees, and migration rules are shown before signing.</p>
      </aside>
    </Panel>}
    {section === 'Create launch' && <details className="advanced-disclosure launch-lifecycle-disclosure" id="launch-lifecycle"><summary><span>How the launch progresses</span><ChevronDown size={17} /></summary><div className="advanced-content"><p className="disclosure-intro">Selected setup: {quickRoute === 'first-buy' ? 'Launch with first buy' : quickRoute === 'scheduled' ? 'Scheduled activation' : 'Standard launch'}.</p><FlowSteps items={[{ title: 'Create', copy: 'Set the token and opening market.' }, { title: 'Trade', copy: 'Buy and sell activity discovers a price.' }, { title: 'Ready', copy: 'The funding threshold is reached.' }, { title: 'Pool', copy: 'Liquidity continues in a permanent pool.' }]} /></div></details>}
    {section === 'Markets' && <>
      <Panel className="launch-discovery-panel" id="launch-list">
        <div className="launch-discovery-head"><div><span className="section-eyebrow">Live markets</span><h2>Choose a market</h2><p>Open a market to trade or continue to its liquidity pool.</p></div></div>
        <div className="launch-discovery-toolbar"><SearchField value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search token or creator" /><SegmentedControl items={['All', 'Active', 'Ready', 'Graduated']} value={filter} onChange={setFilter} label="Launch status" /></div>
        <div className="launch-market-grid">{visible.map((item) => <article className="launch-market-card" key={item.token} role="button" tabIndex="0" onClick={() => navigate(`launch/${item.token.toLowerCase()}`)} onKeyDown={(event) => event.key === 'Enter' && navigate(`launch/${item.token.toLowerCase()}`)}>
          <div className="launch-card-head"><div className="launch-token"><span style={{ '--launch-color': item.color }}>{item.token.slice(0, 1)}</span><div><strong>{item.token}</strong><small>{item.name} · {item.age}</small></div></div><Badge tone={item.status === 'Graduated' ? 'success' : 'neutral'}>{item.status}</Badge></div>
          <p>{item.description}</p>
          <div className="launch-price-row"><div><small>Price</small><strong>{item.price}</strong><span>{item.change}</span></div><MiniTrend values={item.trend} /></div>
          <div className="launch-card-stats"><span><small>24H volume</small><strong>{item.volume}</strong></span><span><small>Holders</small><strong>{item.holders}</strong></span><span><small>Raised</small><strong>{item.raised}</strong></span></div>
          <div className="launch-progress"><span><em>{item.status === 'Graduated' ? 'Permanent pool live' : item.status === 'Ready' ? 'Ready to graduate' : 'Graduation progress'}</em><strong>{item.progress}%</strong></span><i><b style={{ width: `${item.progress}%` }} /></i></div>
          <div className="launch-card-footer"><span>Paired with {item.quote}</span><strong>{item.status === 'Graduated' ? 'View pool' : item.status === 'Ready' ? 'Graduate' : 'Open market'} <ArrowUpRight size={16} /></strong></div>
        </article>)}</div>
        {visible.length === 0 && <div className="empty-state"><strong>No launch markets found</strong><p>Try another search or start a new market.</p><Button variant="secondary" onClick={() => selectSection('Create launch')}>Create launch</Button></div>}
      </Panel>
    </>}
  </>
}
