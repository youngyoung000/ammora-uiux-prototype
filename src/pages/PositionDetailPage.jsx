import React, { useState } from 'react'
import { ArrowLeft, Combine, HandCoins, Lock, Minus, Plus, ShieldCheck, UserRoundCog, Zap } from 'lucide-react'
import { Badge, Button, Metric, PageTabs, Panel, WorkspaceHeader } from '../design-system/index.jsx'
import ActionDialog from '../components/ActionDialog.jsx'

const actions = [
  ['Add liquidity', Plus, 'Increase this position without creating a new NFT.'],
  ['Remove liquidity', Minus, 'Withdraw part or all of the active liquidity.'],
  ['Claim fees', HandCoins, 'Send accrued LP fees to your wallet.'],
  ['Merge positions', Combine, 'Combine compatible positions in this pool.'],
  ['Lock position', Lock, 'Set a release time or permanent lock.'],
  ['Delegate manager', UserRoundCog, 'Allow a reviewed address to manage this position.'],
  ['Zap out', Zap, 'Exit to one selected token with slippage protection.'],
]

export default function PositionDetailPage({ navigate, connected, setConnected }) {
  const [tab, setTab] = useState('Manage')
  const [dialog, setDialog] = useState(null)
  return <>
    <button className="back-link" onClick={() => navigate('portfolio')}><ArrowLeft size={17} />Back to portfolio</button>
    <WorkspaceHeader title="ETH / USDC position #8420" meta={<Badge tone="success">In range</Badge>} actions={<Button variant="secondary" onClick={() => navigate('pool/eth-usdc')}>View pool</Button>} />
    <div className="metrics-grid four"><Metric label="Position value" value="$8,420.36" note="+$186.40 unrealized" tone="positive" /><Metric label="Claimable fees" value="$182.40" /><Metric label="Active time" value="91.8%" /><Metric label="Impermanent loss" value="−$42.18" /></div>
    <PageTabs items={['Manage', 'Performance', 'Cash flow']} value={tab} onChange={setTab} label="Position details" />
    <Panel className="position-detail-panel">
      {tab === 'Manage' && <div className="manage-action-grid">{actions.map(([label, Icon, copy]) => <button key={label} onClick={() => connected ? setDialog(label) : setConnected(true)}><Icon size={21} /><span><strong>{label}</strong><small>{copy}</small></span></button>)}</div>}
      {tab === 'Performance' && <div className="performance-grid"><article><span>Realized PnL</span><strong className="positive-value">+$284.20</strong></article><article><span>Unrealized PnL</span><strong className="positive-value">+$186.40</strong></article><article><span>Deposited principal</span><strong>$8,050.00</strong></article><article><span>Withdrawn principal</span><strong>$100.00</strong></article><article><span>Gas costs</span><strong>−$8.36</strong></article><article><span>Versus holding</span><strong className="positive-value">+$140.02</strong></article></div>}
      {tab === 'Cash flow' && <div className="timeline-list"><article><ShieldCheck size={18} /><div><strong>Fees accrued</strong><span>+$42.80 USDC</span></div><time>Sep 7</time></article><article><Plus size={18} /><div><strong>Liquidity added</strong><span>1 ETH + 4,284.22 USDC</span></div><time>Sep 2</time></article></div>}
    </Panel>
    {dialog && <ActionDialog title={dialog} description="Review the position change before opening your wallet." rows={[["Position", "#8420"], ["Pool", "ETH / USDC"], ["Owner", "0x8F2…91A"]]} action={`Review ${dialog.toLowerCase()}`} onClose={() => setDialog(null)} />}
  </>
}
