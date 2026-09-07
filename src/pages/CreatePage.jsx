import React, { useState } from 'react'
import { ArrowLeft, CalendarClock, ChevronDown, Coins, Gauge, ShieldCheck, Waves } from 'lucide-react'
import { Badge, Button, PageTabs, Panel, QuickSelect, SectionHeading, SegmentedControl, WorkspaceHeader } from '../design-system/index.jsx'
import { FlowSteps } from '../components/Common.jsx'

export default function CreatePage({ navigate }) {
  const [mode, setMode] = useState('ALMM')
  const [start, setStart] = useState('Start now')
  const [preset, setPreset] = useState('stable')
  const [builder, setBuilder] = useState('Quick setup')
  const [firstToken, setFirstToken] = useState('ETH')
  const [secondToken, setSecondToken] = useState('USDC')
  const [binStep, setBinStep] = useState('25 bps')
  const [range, setRange] = useState('±20%')
  const selectPreset = (nextPreset) => {
    setPreset(nextPreset)
    if (nextPreset === 'stable') { setMode('ALMM'); setStart('Start now') }
    if (nextPreset === 'volatile') { setMode('ARL'); setStart('Start now') }
    if (nextPreset === 'scheduled') { setMode('ALMM'); setStart('Schedule') }
    document.getElementById('create-models')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const selectBuilder = (nextBuilder) => {
    setBuilder(nextBuilder)
    document.getElementById(nextBuilder === 'Quick setup' ? 'create-quick' : 'create-models')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return <>
    <button className="back-link create-back-link" onClick={() => navigate('explore')}><ArrowLeft size={17} />Back to liquidity</button>
    <WorkspaceHeader title="Create pool" />
    <PageTabs items={['Quick setup', 'Advanced']} value={builder} onChange={selectBuilder} label="Pool setup" />
    {builder === 'Quick setup' && <QuickSelect id="create-quick" title="Select pool type" value={preset} onSelect={selectPreset} options={[
      { id: 'stable', label: 'Stable pair', description: 'Stay close to the current price.', meta: 'Low volatility', recommended: true, icon: <ShieldCheck size={20} /> },
      { id: 'volatile', label: 'Volatile pair', description: 'Cover a wider custom price range.', meta: 'Focused range', icon: <Waves size={20} /> },
      { id: 'scheduled', label: 'Scheduled pool', description: 'Fund now and open trading later.', meta: 'Timed opening', icon: <CalendarClock size={20} /> },
    ]} />}
    {builder === 'Advanced' && <section className="page-section compact-section" id="create-models">
      <SectionHeading title="Select Strategy" />
      <div className="model-grid">
        <Panel className={mode === 'ALMM' ? 'model-card selected' : 'model-card'} role="button" tabIndex="0" aria-pressed={mode === 'ALMM'} onClick={() => setMode('ALMM')} onKeyDown={(event) => event.key === 'Enter' && setMode('ALMM')}><div className="model-visual strategy-image strategy-image--almm"><img src="/strategy-almm-optimized.webp" alt="Dynamic liquidity distribution" /></div><Badge>Powered by ALMM</Badge><h3>Dynamic liquidity</h3><p>Keep liquidity close to active prices with a distribution that can follow the market.</p><ul><li>Best for active markets</li><li>Dynamic fees</li><li>Guided presets</li></ul></Panel>
        <Panel className={mode === 'ARL' ? 'model-card selected' : 'model-card'} role="button" tabIndex="0" aria-pressed={mode === 'ARL'} onClick={() => setMode('ARL')} onKeyDown={(event) => event.key === 'Enter' && setMode('ARL')}><div className="model-visual strategy-image strategy-image--arl"><img src="/strategy-arl-optimized.webp" alt="Range liquidity distribution" /></div><Badge>Powered by ARL</Badge><h3>Range liquidity</h3><p>Choose the exact price range where your capital should earn trading fees.</p><ul><li>Custom price range</li><li>Single or dual-sided</li><li>Position NFT</li></ul></Panel>
      </div>
    </section>}
    <Panel className="config-preview"><div><SectionHeading title="Select assets" /><div className="pair-inputs"><label><Coins size={20} /><select value={firstToken} onChange={(event) => setFirstToken(event.target.value)}><option>ETH</option><option>GIWA</option><option>WBTC</option></select></label><span className="pair-divider">+</span><label><Coins size={20} /><select value={secondToken} onChange={(event) => setSecondToken(event.target.value)}><option>USDC</option><option>GIWA</option><option>ETH</option></select></label></div><SegmentedControl items={['Start now', 'Schedule']} value={start} onChange={setStart} label="Opening time" /><div className="pool-config-fields"><label className="builder-field"><span>Opening price</span><div className="builder-input-suffix"><input defaultValue="4,284.22" /><strong>{secondToken}</strong></div></label>{mode === 'ALMM' ? <label className="builder-field"><span>Price step</span><select value={binStep} onChange={(event) => setBinStep(event.target.value)}><option>10 bps</option><option>25 bps</option><option>50 bps</option><option>100 bps</option></select></label> : <label className="builder-field"><span>Price range</span><select value={range} onChange={(event) => setRange(event.target.value)}><option>±20%</option><option>±50%</option><option>±80%</option><option>Custom</option></select></label>}{start === 'Schedule' && <label className="builder-field"><span>Trading opens</span><input type="datetime-local" defaultValue="2026-09-12T10:00" /></label>}</div></div><aside><Gauge size={25} /><h3>Review setup</h3><dl><div><dt>Pair</dt><dd>{firstToken} / {secondToken}</dd></div><div><dt>Strategy</dt><dd>{mode === 'ALMM' ? 'Dynamic' : 'Range'}</dd></div><div><dt>{mode === 'ALMM' ? 'Price step' : 'Price range'}</dt><dd>{mode === 'ALMM' ? binStep : range}</dd></div><div><dt>Opening</dt><dd>{start}</dd></div></dl><Button className="full-button">Review transactions</Button></aside></Panel>
    <details className="advanced-disclosure create-disclosure"><summary><span><ShieldCheck size={17} />Advanced checks and protocol details</span><ChevronDown size={17} /></summary><div className="advanced-content"><FlowSteps items={[{ title: 'Pair', copy: 'Token order and safety policy are checked.' }, { title: 'Strategy', copy: `Powered by ${mode}. Range and fee rules are verified.` }, { title: 'Funding', copy: 'Amounts, approvals, and minimum shares are reviewed.' }, { title: 'Create', copy: 'Exact transactions are shown before signing.' }]} /></div></details>
  </>
}
