import React, { useState } from 'react'
import { ArrowLeft, CalendarClock, Check, ChevronDown, Gauge, ShieldCheck, Waves } from 'lucide-react'
import { AssetMark, Badge, Button, DropdownSelect, PageTabs, Panel, QuickSelect, SectionHeading, SegmentedControl, WorkspaceHeader } from '../design-system/index.jsx'
import ActionDialog from '../components/ActionDialog.jsx'

const tokenOptions = ['ETH', 'USDC', 'GIWA', 'WBTC', 'USDT']
const spacingOptions = [
  { value: '10 bps', label: 'Tight', note: '0.10%' },
  { value: '25 bps', label: 'Balanced', note: '0.25%', recommended: true },
  { value: '50 bps', label: 'Wide', note: '0.50%' },
  { value: '100 bps', label: 'Very wide', note: '1.00%' },
]

export default function CreatePage({ navigate }) {
  const [builder, setBuilder] = useState('Quick setup')
  return <>
    <button className="back-link create-back-link" onClick={() => navigate('explore')}><ArrowLeft size={17} />Back to liquidity</button>
    <WorkspaceHeader title="Create pool" />
    <PageTabs items={['Quick setup', 'Advanced']} value={builder} onChange={setBuilder} label="Pool setup" />
    {builder === 'Quick setup' ? <QuickPoolFlow /> : <AdvancedPoolFlow />}
  </>
}

function QuickPoolFlow() {
  const [preset, setPreset] = useState('stable')
  const [firstToken, setFirstToken] = useState('ETH')
  const [secondToken, setSecondToken] = useState('USDC')
  const [openingPrice, setOpeningPrice] = useState('4,284.22')
  const [reviewOpen, setReviewOpen] = useState(false)
  const mode = preset === 'volatile' ? 'ARL' : 'ALMM'
  const start = preset === 'scheduled' ? 'Schedule' : 'Start now'
  return <div className="create-flow" data-flow="quick">
    <QuickSelect id="create-quick" title="Select pool type" value={preset} onSelect={setPreset} options={[
      { id: 'stable', label: 'Stable pair', description: 'Reviewed defaults for closely priced assets.', meta: 'Low volatility', recommended: true, icon: <ShieldCheck size={20} /> },
      { id: 'volatile', label: 'Volatile pair', description: 'A wider range for assets that move independently.', meta: 'Focused range', icon: <Waves size={20} /> },
      { id: 'scheduled', label: 'Scheduled pool', description: 'Fund now and open trading at a chosen time.', meta: 'Timed opening', icon: <CalendarClock size={20} /> },
    ]} />
    <Panel className="config-preview quick-config-preview">
      <div>
        <SectionHeading title="Select assets" />
        <AssetPairSelector first={firstToken} second={secondToken} onFirst={setFirstToken} onSecond={setSecondToken} />
        <div className="pool-config-fields">
          <Field label="Opening price"><div className="builder-input-suffix"><input value={openingPrice} onChange={(event) => setOpeningPrice(event.target.value)} /><strong>{secondToken}</strong></div></Field>
          <Field label={mode === 'ALMM' ? 'Price spacing' : 'Price range'}><DropdownSelect label="Select guided configuration" value={mode === 'ALMM' ? 'Balanced · 0.25%' : 'Wide · ±50%'} onChange={() => {}} options={mode === 'ALMM' ? ['Balanced · 0.25%'] : ['Wide · ±50%']} /></Field>
          {start === 'Schedule' && <Field label="Trading opens"><input type="datetime-local" defaultValue="2026-09-12T10:00" /></Field>}
        </div>
      </div>
      <ReviewAside title="Quick setup" rows={[["Pair", `${firstToken} / ${secondToken}`], ["Strategy", mode === 'ALMM' ? 'Dynamic liquidity' : 'Range liquidity'], ["Opening", start], ["Configuration", 'Reviewed defaults']]} onReview={() => setReviewOpen(true)} />
    </Panel>
    <p className="quick-flow-note"><Check size={16} />Quick setup uses reviewed defaults. Open Advanced to control price spacing, funding, fees, and activation independently.</p>
    {reviewOpen && <ActionDialog title="Review quick pool setup" description="The recommended configuration is expanded before your wallet opens." rows={[["Pair", `${firstToken} / ${secondToken}`], ["Strategy", mode], ["Opening price", `${openingPrice} ${secondToken}`], ["Opening", start]]} action="Prepare pool" onClose={() => setReviewOpen(false)} />}
  </div>
}

function AdvancedPoolFlow() {
  const [mode, setMode] = useState('ALMM')
  return <div className="create-flow create-flow--advanced" data-flow="advanced">
    <section className="page-section compact-section" id="create-models">
      <SectionHeading title="Select Strategy" />
      <div className="model-grid">
        <StrategyCard mode="ALMM" selected={mode === 'ALMM'} onSelect={setMode} image={`${import.meta.env.BASE_URL}strategy-almm-optimized.webp`} title="Dynamic liquidity" description="Distribute capital across discrete price bins with adaptive fees." features={['Price spacing', 'Distribution presets', 'Two-stage creation']} />
        <StrategyCard mode="ARL" selected={mode === 'ARL'} onSelect={setMode} image={`${import.meta.env.BASE_URL}strategy-arl-optimized.webp`} title="Range liquidity" description="Concentrate liquidity inside an exact minimum and maximum price." features={['Dual or single-sided', 'Fee schedule', 'Opening position']} />
      </div>
    </section>
    {mode === 'ALMM' ? <AdvancedALMMFlow /> : <AdvancedARLFlow />}
  </div>
}

function StrategyCard({ mode, selected, onSelect, image, title, description, features }) {
  return <Panel className={selected ? 'model-card selected' : 'model-card'} role="button" tabIndex="0" aria-pressed={selected} onClick={() => onSelect(mode)} onKeyDown={(event) => event.key === 'Enter' && onSelect(mode)}>
    <div className={`model-visual strategy-image strategy-image--${mode.toLowerCase()}`}><img src={image} alt={`${title} distribution`} /></div>
    <div className="model-card__heading"><h3>{title}</h3><Badge>Powered by {mode}</Badge></div><p>{description}</p><ul>{features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
  </Panel>
}

function AdvancedALMMFlow() {
  const [firstToken, setFirstToken] = useState('ETH')
  const [secondToken, setSecondToken] = useState('USDC')
  const [openingPrice, setOpeningPrice] = useState('4,284.22')
  const [spacing, setSpacing] = useState('25 bps')
  const [activation, setActivation] = useState('Start now')
  const [reviewOpen, setReviewOpen] = useState(false)
  const spacingLabel = spacingOptions.find((option) => option.value === spacing)?.label || 'Balanced'
  return <Panel className="advanced-creation-workspace" id="advanced-almm-flow">
    <div className="creation-form">
      <CreationSection step="01" title="Token pair"><AssetPairSelector first={firstToken} second={secondToken} onFirst={setFirstToken} onSecond={setSecondToken} /></CreationSection>
      <CreationSection step="02" title="Opening price"><Field label="Initial price"><div className="builder-input-suffix"><input value={openingPrice} onChange={(event) => setOpeningPrice(event.target.value)} /><strong>{secondToken} per {firstToken}</strong></div></Field></CreationSection>
      <CreationSection step="03" title="Price spacing"><ChoiceGrid className="spacing-grid" options={spacingOptions} value={spacing} onChange={setSpacing} /></CreationSection>
      <CreationSection step="04" title="Pool activation"><SegmentedControl items={['Start now', 'Schedule']} value={activation} onChange={setActivation} label="Pool activation" />{activation === 'Schedule' && <Field label="Trading opens"><input type="datetime-local" defaultValue="2026-09-12T10:00" /></Field>}</CreationSection>
      <details className="advanced-disclosure embedded-advanced"><summary><span>Fee and preset details</span><ChevronDown size={17} /></summary><div className="advanced-content"><dl><div><dt>Reviewed preset</dt><dd>Balanced bins</dd></div><div><dt>Base fee</dt><dd>0.05%</dd></div><div><dt>Dynamic fee</dt><dd>Enabled</dd></div><div><dt>Composition fee</dt><dd>Applied when required</dd></div></dl></div></details>
    </div>
    <CreationPreview mode="ALMM" pair={`${firstToken} / ${secondToken}`} openingPrice={openingPrice} detail={`${spacingLabel} · ${spacing}`} activation={activation} variant={spacing} onReview={() => setReviewOpen(true)} />
    {reviewOpen && <ActionDialog title="Review ALMM creation" description="ALMM creation has two explicit stages: deploy the pool, then fund the opening position." rows={[["Pair", `${firstToken} / ${secondToken}`], ["Opening price", openingPrice], ["Price spacing", spacing], ["Transactions", "Pool deployment + opening liquidity"]]} action="Prepare transactions" onClose={() => setReviewOpen(false)} />}
  </Panel>
}

function AdvancedARLFlow() {
  const [firstToken, setFirstToken] = useState('ETH')
  const [secondToken, setSecondToken] = useState('USDC')
  const [funding, setFunding] = useState('Dual-sided')
  const [feeSchedule, setFeeSchedule] = useState('Static')
  const [feeCollection, setFeeCollection] = useState('Base + Quote')
  const [activation, setActivation] = useState('Start now')
  const [openingPrice, setOpeningPrice] = useState('4,284.22')
  const [minPrice, setMinPrice] = useState('3,420')
  const [maxPrice, setMaxPrice] = useState('5,140')
  const [reviewOpen, setReviewOpen] = useState(false)
  return <Panel className="advanced-creation-workspace" id="advanced-arl-flow">
    <div className="creation-form">
      <CreationSection step="01" title="Funding model"><ChoiceGrid className="funding-grid" options={[{ value: 'Dual-sided', label: 'Dual-sided', note: 'Deposit both tokens', recommended: true }, { value: 'Single-sided', label: 'Single-sided', note: `Deposit ${firstToken} only` }]} value={funding} onChange={setFunding} /></CreationSection>
      <CreationSection step="02" title="Token pair and opening position"><AssetPairSelector first={firstToken} second={secondToken} onFirst={setFirstToken} onSecond={setSecondToken} /><div className="form-grid two"><Field label="Initial price"><div className="builder-input-suffix"><input value={openingPrice} onChange={(event) => setOpeningPrice(event.target.value)} /><strong>{secondToken}</strong></div></Field><Field label={`Maximum ${firstToken}`}><input defaultValue="1" /></Field>{funding === 'Dual-sided' && <Field label={`Maximum ${secondToken}`}><input defaultValue="4,284.22" /></Field>}<Field label="Min price"><input value={minPrice} onChange={(event) => setMinPrice(event.target.value)} /></Field><Field label="Max price"><input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} /></Field></div></CreationSection>
      <CreationSection step="03" title="Trading fee"><div className="section-control-row"><Field label="Base fee (bps)"><input defaultValue="30" /></Field><SegmentedControl items={['Static', 'Scheduled', 'Dynamic']} value={feeSchedule} onChange={setFeeSchedule} label="Fee schedule" /></div>{feeSchedule === 'Scheduled' && <div className="form-grid three"><Field label="Initial fee"><input defaultValue="100" /></Field><Field label="Final fee"><input defaultValue="30" /></Field><Field label="Reduction duration"><input defaultValue="24 hours" /></Field></div>}{feeSchedule === 'Dynamic' && <div className="form-grid three"><Field label="Maximum fee"><input defaultValue="300" /></Field><Field label="Filter period"><input defaultValue="30 sec" /></Field><Field label="Decay period"><input defaultValue="10 min" /></Field></div>}</CreationSection>
      <CreationSection step="04" title="Fee collection and activation"><div className="section-control-row"><SegmentedControl items={['Base + Quote', 'Quote only']} value={feeCollection} onChange={setFeeCollection} label="Fee collection" /><SegmentedControl items={['Start now', 'Schedule']} value={activation} onChange={setActivation} label="Pool activation" /></div>{activation === 'Schedule' && <Field label="Trading opens"><input type="datetime-local" defaultValue="2026-09-12T10:00" /></Field>}</CreationSection>
      <details className="advanced-disclosure embedded-advanced"><summary><span>Factory, manager, and position details</span><ChevronDown size={17} /></summary><div className="advanced-content"><dl><div><dt>Creation model</dt><dd>Pool + opening position</dd></div><div><dt>Position type</dt><dd>Concentrated NFT</dd></div><div><dt>Fee collection</dt><dd>{feeCollection}</dd></div><div><dt>Address derivation</dt><dd>Deterministic</dd></div></dl></div></details>
    </div>
    <CreationPreview mode="ARL" pair={`${firstToken} / ${secondToken}`} openingPrice={openingPrice} detail={`${funding} · ${feeSchedule} fee`} activation={activation} variant={funding} range={`${minPrice}–${maxPrice}`} onReview={() => setReviewOpen(true)} />
    {reviewOpen && <ActionDialog title="Review ARL creation" description="The pool and opening position are prepared as one verified creation plan." rows={[["Pair", `${firstToken} / ${secondToken}`], ["Funding", funding], ["Fee schedule", feeSchedule], ["Fee collection", feeCollection], ["Transaction", "Pool + opening position"]]} action="Prepare transaction" onClose={() => setReviewOpen(false)} />}
  </Panel>
}

function AssetPairSelector({ first, second, onFirst, onSecond }) {
  const optionsFor = (excluded) => tokenOptions.filter((token) => token !== excluded).map((token) => ({ value: token, label: token, assetSymbol: token }))
  return <div className="pair-inputs asset-pair-inputs"><div className="pair-select"><DropdownSelect label="Select base token" value={first} onChange={onFirst} options={optionsFor(second)} /></div><span className="pair-divider">+</span><div className="pair-select"><DropdownSelect label="Select quote token" value={second} onChange={onSecond} options={optionsFor(first)} /></div></div>
}

function CreationSection({ step, title, children }) { return <section className="creation-section"><header><span>{step}</span><h2>{title}</h2></header>{children}</section> }
function Field({ label, children }) { return <label className="builder-field"><span>{label}</span>{children}</label> }
function ChoiceGrid({ options, value, onChange, className = '' }) { return <div className={`choice-grid ${className}`}>{options.map((option) => <button key={option.value} className={value === option.value ? 'selected' : ''} onClick={() => onChange(option.value)}><span className="choice-card-title"><span>{option.label}</span>{option.recommended && <Badge size="sm">Recommended</Badge>}</span><small>{option.note}</small></button>)}</div> }

function ReviewAside({ title, rows, onReview }) { return <aside><Gauge size={25} /><h3>{title}</h3><dl>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><Button className="full-button" onClick={onReview}>Review setup</Button></aside> }

function CreationPreview({ mode, pair, openingPrice, detail, activation, variant, range, onReview }) {
  const almmBars = {
    '10 bps': [12,18,25,34,45,58,72,86,100,86,72,58,45,34,25,18,12],
    '25 bps': [22,35,49,65,82,100,82,65,49,35,22],
    '50 bps': [34,46,62,82,100,82,62,46,34],
    '100 bps': [56,66,82,100,82,66,56],
  }
  const arlBars = variant === 'Single-sided'
    ? [18,24,32,42,54,66,100,92,82,70,58,46]
    : [72,72,72,72,72,72,72,72,72,72,72,72]
  const bars = mode === 'ALMM' ? (almmBars[variant] || almmBars['25 bps']) : arlBars
  const spacingPercent = mode === 'ALMM' ? Number(variant?.split(' ')[0] || 25) / 100 : 0
  const axisLabels = mode === 'ALMM' ? bars.map((_, index) => {
    const offset = (index - (bars.length - 1) / 2) * spacingPercent
    if (Math.abs(offset) < .001) return 'OPEN'
    return `${offset > 0 ? '+' : '-'}${Math.abs(offset).toFixed(spacingPercent === .25 ? 2 : 1)}%`
  }) : []
  return <aside className="creation-preview"><div className="preview-heading"><div><span>Pool preview</span><strong>{mode === 'ALMM' ? 'Dynamic liquidity distribution' : 'Concentrated price range'}</strong></div></div><div className="preview-pair"><span className="preview-token-stack"><AssetMark symbol={pair.split(' / ')[0]} /><AssetMark symbol={pair.split(' / ')[1]} /></span><div><strong>{pair}</strong><small>{mode === 'ALMM' ? 'Discrete price bins' : 'Opening range position'}</small></div></div><div className={`creation-chart creation-chart--${mode.toLowerCase()}`} data-preview-variant={variant}><div className="creation-chart-bars" style={{ '--chart-columns': bars.length }}>{bars.map((height, index) => <i key={index} className={mode === 'ARL' ? (variant === 'Single-sided' && index < bars.length / 2 ? 'is-muted' : index < bars.length / 2 ? 'is-quote' : 'is-base') : ''} style={{ height: `${height}%` }} />)}</div>{axisLabels.length > 0 ? <div className="creation-chart-axis" style={{ '--chart-columns': bars.length }}>{axisLabels.map((label, index) => <span key={`${label}-${index}`} className={label === 'OPEN' ? 'is-open' : ''}>{label}</span>)}</div> : <b>OPEN</b>}</div><dl><div><dt>Opening price</dt><dd>{openingPrice}</dd></div><div><dt>{mode === 'ALMM' ? 'Price spacing' : 'Funding and fee'}</dt><dd>{detail}</dd></div>{range && <div><dt>Active range</dt><dd>{range}</dd></div>}<div><dt>Trading starts</dt><dd>{activation === 'Start now' ? 'After creation' : 'Scheduled'}</dd></div></dl><Button className="full-button creation-review-button" onClick={onReview}>Review creation</Button></aside>
}
