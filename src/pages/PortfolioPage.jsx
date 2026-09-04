import React, { useState } from 'react'
import { ArrowUpRight, Clock, Layers3, Plus, WalletCards } from 'lucide-react'
import { Badge, Button, Metric, Panel, SegmentedControl, WorkspaceHeader } from '../design-system/index.jsx'

const positions = [
  { pair: 'ETH / USDC', model: 'Dynamic liquidity', protocol: 'ALMM', value: '$8,420.36', fees: '$182.40', range: 'Active range', status: 'In range' },
  { pair: 'GIWA / USDC', model: 'Range liquidity', protocol: 'ARL', value: '$4,420.16', fees: '$101.80', range: '$0.84 – $1.62', status: 'In range' },
]

export default function PortfolioPage({ connected, setConnected, navigate }) {
  const [tab, setTab] = useState('Positions')
  return <>
    <WorkspaceHeader title="Portfolio" description="Manage positions and claim available fees." actions={<><Button onClick={() => navigate('create')} icon={<Plus size={18} />}>Add liquidity</Button><Button variant="secondary" onClick={() => navigate('fees')}>Fees & claims</Button></>} meta={connected ? <Badge tone="success">Wallet connected</Badge> : null} />
    {connected && <div className="metrics-grid four"><Metric label="Portfolio value" value="$12,840.52" note="+2.28% this week" tone="positive" /><Metric label="Fees earned" value="$284.20" note="Available to claim" /><Metric label="Open positions" value="2" note="Both in range" tone="positive" /><Metric label="Average APR" value="21.7%" note="Based on 24H fees" /></div>}
    <Panel className="portfolio-panel" id="portfolio-workspace">
      <div className="panel-title-row"><div><span className="section-eyebrow">Liquidity workspace</span><h2 className="type-h3">Positions and activity</h2></div><SegmentedControl items={['Positions', 'Activity']} value={tab} onChange={setTab} label="Portfolio view" /></div>
      {tab === 'Positions' ? connected ? <div className="position-list">{positions.map((position) => <article key={position.pair}><div className="position-name"><span><Layers3 size={20} /></span><div><strong>{position.pair}</strong><small>{position.model} · Powered by {position.protocol}</small></div></div><div><span>Position value</span><strong>{position.value}</strong></div><div><span>Fees earned</span><strong className="positive-value">{position.fees}</strong></div><div><span>Range</span><strong>{position.range}</strong></div><Badge tone="success">{position.status}</Badge><button><ArrowUpRight size={19} /></button></article>)}</div> : <div className="empty-state portfolio-connect-state"><WalletCards size={28} /><strong>Connect wallet to view your positions</strong><p>Your positions and claimable fees will appear here.</p><Button onClick={() => setConnected(true)}>Connect wallet</Button></div> : <div className="empty-state"><Clock size={27} /><strong>No recent activity</strong><p>Your next confirmed action will appear here.</p><Button variant="secondary" onClick={() => navigate('explore')}>Explore pools</Button></div>}
    </Panel>
  </>
}
