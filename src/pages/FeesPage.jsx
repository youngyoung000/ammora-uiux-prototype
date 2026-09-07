import React, { useState } from 'react'
import { ArrowLeft, ArrowUpRight, Check, Plus, Trash2, Vault } from 'lucide-react'
import { Badge, Button, DropdownSelect, Metric, PageTabs, Panel, SegmentedControl, WorkspaceHeader } from '../design-system/index.jsx'
import ActionDialog from '../components/ActionDialog.jsx'

const claims = [
  { source: 'ETH / USDC', role: 'Liquidity provider', amount: '$128.40', token: 'USDC', status: 'Claimable' },
  { source: 'GIWA / USDC', role: 'Referral partner', amount: '$74.80', token: 'USDC', status: 'Claimable' },
  { source: 'NOVA launch', role: 'Creator revenue', amount: '$41.20', token: 'GIWA', status: 'Claimable' },
]

export default function FeesPage({ connected, setConnected, navigate }) {
  const [tab, setTab] = useState('Settlement')
  const [scope, setScope] = useState('All sources')
  const [recipients, setRecipients] = useState([{ address: '0x8F2…91A', share: 70 }, { address: '0x71A…90E', share: 30 }])
  const [dialog, setDialog] = useState(null)
  const [revenueToken, setRevenueToken] = useState('USDC')
  const [revenueSource, setRevenueSource] = useState('Direct funding')
  const visibleClaims = claims.filter((claim) => scope === 'All sources' || (scope === 'LP fees' && claim.role === 'Liquidity provider') || (scope === 'Launch revenue' && claim.role === 'Creator revenue'))
  return <>
    <button className="back-link" onClick={() => navigate('portfolio')}><ArrowLeft size={17} />Back to portfolio</button>
    <WorkspaceHeader title="Revenue sharing" actions={<><Button variant="secondary" onClick={() => setDialog('Fund fee vault')}>Fund vault</Button><Button onClick={() => connected ? setDialog('Claim all available revenue') : setConnected(true)}>{connected ? 'Claim available' : 'Connect wallet'}</Button></>} />
    <div className="metrics-grid four"><Metric label="Total earned" value="$284.40" note="Across 3 sources" /><Metric label="Claimable now" value="$244.40" note="Three available claims" tone="positive" /><Metric label="Active vaults" value="2" note="5 recipients" /><Metric label="Lifetime claimed" value="$1,842.60" note="12 transactions" /></div>
    <PageTabs items={['Settlement', 'Create vault', 'Funding history']} value={tab} onChange={setTab} label="Revenue sharing workspace" />
    <Panel className="claims-panel" id="claim-workspace">
      {tab === 'Settlement' ? <><div className="panel-title-row"><h2 className="type-h3">Available balances</h2><SegmentedControl items={['All sources', 'LP fees', 'Launch revenue']} value={scope} onChange={setScope} label="Fee source" /></div><div className="claims-list">{visibleClaims.map((claim) => <article key={claim.source}><div><strong>{claim.source}</strong><small>{claim.role}</small></div><div><span>Available amount</span><strong>{claim.amount} <small>{claim.token}</small></strong></div><Badge tone="success">{claim.status}</Badge><Button size="sm" variant="secondary" onClick={() => setDialog(`Claim from ${claim.source}`)} icon={<ArrowUpRight size={17} />}>Claim</Button></article>)}</div></> : tab === 'Create vault' ? <div className="vault-builder"><div className="vault-form"><h2>Create fee vault</h2><div className="launch-field-grid"><div className="builder-field"><span>Revenue token</span><DropdownSelect label="Select revenue token" value={revenueToken} onChange={setRevenueToken} options={['USDC', 'GIWA', 'ETH']} /></div><div className="builder-field"><span>Revenue source</span><DropdownSelect label="Select revenue source" value={revenueSource} onChange={setRevenueSource} options={[{ value: 'Direct funding', label: 'Direct funding', description: 'Deposit tokens from this wallet' }, { value: 'Pool fee', label: 'Pool fee', description: 'Fund from a verified pool source' }, { value: 'Position reward', label: 'Position reward', description: 'Fund from a position reward' }]} /></div></div><h3>Recipients</h3>{recipients.map((recipient, index) => <div className="recipient-row" key={index}><input value={recipient.address} readOnly /><label><input value={recipient.share} onChange={(event) => setRecipients(recipients.map((item, itemIndex) => itemIndex === index ? { ...item, share: event.target.value } : item))} />%</label><button aria-label="Remove recipient" onClick={() => recipients.length > 2 && setRecipients(recipients.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={17} /></button></div>)}<Button variant="secondary" size="sm" icon={<Plus size={16} />} onClick={() => recipients.length < 5 && setRecipients([...recipients, { address: '0x000…000', share: 0 }])}>Add recipient</Button></div><aside><Vault size={24} /><h2>Review vault</h2><dl><div><dt>Token</dt><dd>{revenueToken}</dd></div><div><dt>Source</dt><dd>{revenueSource}</dd></div><div><dt>Recipients</dt><dd>{recipients.length}</dd></div><div><dt>Total share</dt><dd>{recipients.reduce((sum, item) => sum + Number(item.share), 0)}%</dd></div><div><dt>Rules</dt><dd>Immutable</dd></div></dl><Button className="full-button" onClick={() => setDialog('Create fee vault')}>Review creation</Button></aside></div> : <div className="timeline-list"><article><Check size={18} /><div><strong>Vault funded</strong><span>284.20 USDC · Direct funding</span></div><time>Sep 6</time></article><article><Check size={18} /><div><strong>Recipient claimed</strong><span>128.40 USDC · 0x8F2…91A</span></div><time>Sep 3</time></article></div>}
      <div className="claim-note"><Check size={18} /><span>Vault recipients and shares cannot be changed after creation.</span></div>
    </Panel>
    {dialog && <ActionDialog title={dialog} rows={[["Token", "USDC"], ["Available", "$203.20"], ["Network", "GIWA Testnet"]]} action="Review transaction" onClose={() => setDialog(null)} />}
  </>
}
