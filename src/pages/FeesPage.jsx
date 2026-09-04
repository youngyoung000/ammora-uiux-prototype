import React, { useState } from 'react'
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import { Badge, Button, Metric, Panel, SectionHeading, SegmentedControl, WorkspaceHeader } from '../design-system/index.jsx'

const claims = [
  { source: 'ETH / USDC', role: 'Liquidity provider', amount: '$128.40', token: 'USDC', status: 'Claimable' },
  { source: 'GIWA / USDC', role: 'Referral partner', amount: '$74.80', token: 'USDC', status: 'Claimable' },
  { source: 'NOVA launch', role: 'Creator revenue', amount: '$41.20', token: 'GIWA', status: 'Pending' },
]

export default function FeesPage({ connected, setConnected, navigate }) {
  const [tab, setTab] = useState('Claims')
  const [scope, setScope] = useState('All sources')
  const visibleClaims = claims.filter((claim) => scope === 'All sources' || (scope === 'LP fees' && claim.role === 'Liquidity provider') || (scope === 'Launch revenue' && claim.role === 'Creator revenue'))
  return <>
    <WorkspaceHeader title="Fees & claims" description="Review available balances, then claim them to your wallet." actions={<><Button variant="secondary" icon={<ArrowLeft size={17} />} onClick={() => navigate('portfolio')}>View positions</Button><Button onClick={() => setConnected(true)}>{connected ? 'Claim all' : 'Connect to claim'}</Button></>} meta={<Badge tone={connected ? 'success' : 'neutral'}>{connected ? 'Wallet connected' : 'Read-only preview'}</Badge>} />
    <div className="metrics-grid four"><Metric label="Total earned" value="$284.40" note="Across 3 sources" /><Metric label="Claimable now" value="$203.20" note="Two available claims" tone="positive" /><Metric label="Pending settlement" value="$41.20" note="Next epoch" /><Metric label="Lifetime claimed" value="$1,842.60" note="12 transactions" /></div>
    <Panel className="claims-panel" id="claim-workspace"><div className="panel-title-row"><SectionHeading eyebrow="Available balances" title="Claims" description="Choose a source and review the amount before signing." /><div className="claims-controls"><SegmentedControl items={['All sources', 'LP fees', 'Launch revenue']} value={scope} onChange={setScope} label="Fee source" /><SegmentedControl items={['Claims', 'History']} value={tab} onChange={setTab} label="Fee activity" /></div></div>{tab === 'Claims' ? <div className="claims-list">{visibleClaims.map((claim) => <article key={claim.source}><div><strong>{claim.source}</strong><small>{claim.role}</small></div><div><span>Available amount</span><strong>{claim.amount} <small>{claim.token}</small></strong></div><Badge tone={claim.status === 'Claimable' ? 'success' : 'neutral'}>{claim.status}</Badge><Button size="sm" variant={claim.status === 'Claimable' ? 'secondary' : 'ghost'} disabled={claim.status !== 'Claimable'} icon={<ArrowUpRight size={17} />}>Claim</Button></article>)}</div> : <div className="empty-state"><Check size={27} /><strong>No claim history yet</strong><p>Completed claims will appear here.</p><Button variant="secondary" onClick={() => navigate('portfolio')}>View positions</Button></div>}<div className="claim-note"><Check size={18} /><span>Exact token, recipient, and transaction are shown before signing.</span></div></Panel>
  </>
}
