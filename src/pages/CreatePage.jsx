import React, { useState } from 'react'
import { ArrowLeft, CalendarClock, ChevronDown, Coins, Gauge, ShieldCheck, Waves } from 'lucide-react'
import { Badge, Button, DropdownSelect, PageTabs, Panel, QuickSelect, SectionHeading, SegmentedControl, WorkspaceHeader } from '../design-system/index.jsx'
import { FlowSteps } from '../components/Common.jsx'
import ActionDialog from '../components/ActionDialog.jsx'

export default function CreatePage({ navigate }) {
  const [mode, setMode] = useState('ALMM')
  const [start, setStart] = useState('Start now')
  const [preset, setPreset] = useState('stable')
  const [builder, setBuilder] = useState('Quick setup')
  const [firstToken, setFirstToken] = useState('ETH')
  const [secondToken, setSecondToken] = useState('USDC')
  const [binStep, setBinStep] = useState('25 bps')
  const [range, setRange] = useState('±20%')
  const [reviewOpen, setReviewOpen] = useState(false)
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
    <Panel className="config-preview">
      <div>
        <SectionHeading title="Select assets" />
        <div className="pair-inputs"><div className="pair-select"><Coins size={20} /><DropdownSelect label="Select first token" value={firstToken} onChange={setFirstToken} options={['ETH', 'GIWA', 'WBTC']} /></div><span className="pair-divider">+</span><div className="pair-select"><Coins size={20} /><DropdownSelect label="Select second token" value={secondToken} onChange={setSecondToken} options={['USDC', 'GIWA', 'ETH']} /></div></div>
        <SegmentedControl items={['Start now', 'Schedule']} value={start} onChange={setStart} label="Opening time" />
        <div className="pool-config-fields">
          <label className="builder-field"><span>Opening price</span><div className="builder-input-suffix"><input defaultValue="4,284.22" /><strong>{secondToken}</strong></div></label>
          {mode === 'ALMM' ? <div className="builder-field"><span>Price step</span><DropdownSelect label="Select price step" value={binStep} onChange={setBinStep} options={[{ value: '10 bps', label: '10 bps', description: 'Tighter price spacing' }, { value: '25 bps', label: '25 bps', description: 'Balanced default' }, { value: '50 bps', label: '50 bps', description: 'Wider active bins' }, { value: '100 bps', label: '100 bps', description: 'High volatility' }]} /></div> : <div className="builder-field"><span>Price range</span><DropdownSelect label="Select price range" value={range} onChange={setRange} options={['±20%', '±50%', '±80%', 'Custom']} /></div>}
          {start === 'Schedule' && <label className="builder-field"><span>Trading opens</span><input type="datetime-local" defaultValue="2026-09-12T10:00" /></label>}
        </div>
      </div>
      <aside><Gauge size={25} /><h3>Review setup</h3><dl><div><dt>Pair</dt><dd>{firstToken} / {secondToken}</dd></div><div><dt>Strategy</dt><dd>{mode === 'ALMM' ? 'Dynamic' : 'Range'}</dd></div><div><dt>{mode === 'ALMM' ? 'Price step' : 'Price range'}</dt><dd>{mode === 'ALMM' ? binStep : range}</dd></div><div><dt>Opening</dt><dd>{start}</dd></div></dl><Button className="full-button" onClick={() => setReviewOpen(true)}>Review transactions</Button></aside>
    </Panel>
    <details className="advanced-disclosure create-disclosure"><summary><span><ShieldCheck size={17} />Advanced checks and protocol details</span><ChevronDown size={17} /></summary><div className="advanced-content"><FlowSteps items={[{ title: 'Pair', copy: 'Token order and safety policy are checked.' }, { title: 'Strategy', copy: `Powered by ${mode}. Range and fee rules are verified.` }, { title: 'Funding', copy: 'Amounts, approvals, and minimum shares are reviewed.' }, { title: 'Create', copy: 'Exact transactions are shown before signing.' }]} /></div></details>
    {reviewOpen && <ActionDialog title="Review pool transactions" description={mode === 'ALMM' ? 'The pool is created first, then the opening position is funded.' : 'The pool and opening position are prepared as one verified plan.'} rows={[["Pair", `${firstToken} / ${secondToken}`], ["Strategy", `${mode === 'ALMM' ? 'Dynamic liquidity · ALMM' : 'Range liquidity · ARL'}`], ["Opening", start], ["Approval", "Prepared separately"]]} action="Prepare wallet transactions" onClose={() => setReviewOpen(false)} />}
  </>
}
