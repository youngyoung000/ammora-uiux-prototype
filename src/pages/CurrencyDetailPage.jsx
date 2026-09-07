import React, { useState } from 'react'
import { ArrowLeft, Copy, ExternalLink, ShieldCheck } from 'lucide-react'
import { Badge, Button, Metric, PageTabs, Panel, TokenIcon, WorkspaceHeader } from '../design-system/index.jsx'
import { currencies } from '../data.js'

export default function CurrencyDetailPage({ symbol, navigate }) {
  const token = currencies.find((item) => item.symbol.toLowerCase() === symbol.toLowerCase()) || currencies[0]
  const [tab, setTab] = useState('Overview')
  return <>
    <button className="back-link" onClick={() => navigate('currencies')}><ArrowLeft size={17} />Back to token directory</button>
    <WorkspaceHeader title={`${token.name} (${token.symbol})`} meta={<Badge tone="success"><ShieldCheck size={14} />Reviewed metadata</Badge>} actions={<Button onClick={() => navigate('swap')}>Trade {token.symbol}</Button>} />
    <div className="metrics-grid four"><Metric label="Price" value={token.price} note={token.change} tone="positive" /><Metric label="24H volume" value={token.volume} /><Metric label="Market cap" value={token.cap} /><Metric label="Liquidity" value={token.liquidity} /></div>
    <PageTabs items={['Overview', 'Deployments', 'Markets']} value={tab} onChange={setTab} label="Token details" />
    <Panel className="currency-detail-panel">
      {tab === 'Overview' && <div className="currency-overview"><TokenIcon symbol={token.symbol} color={token.color} /><div><h2>{token.name}</h2><p>A reviewed catalog entry. Trading support still depends on the selected chain, deployment, and token safety policy.</p></div><dl><div><dt>Symbol</dt><dd>{token.symbol}</dd></div><div><dt>Category</dt><dd>{['USDT','USDC','DAI','GBPM','COPM','JPYS'].includes(token.symbol) ? 'Stablecoin' : 'Asset'}</dd></div><div><dt>Holders</dt><dd>{token.holders}</dd></div></dl></div>}
      {tab === 'Deployments' && <div className="deployment-list"><article><div><strong>{token.chain}</strong><small>Primary reviewed deployment</small></div><button>0x4200…0006 <Copy size={15} /></button><Badge tone="success">Verified</Badge><a href="https://sepolia-explorer.giwa.io">Explorer <ExternalLink size={15} /></a></article></div>}
      {tab === 'Markets' && <div className="context-actions"><article><div><strong>{token.symbol} / USDC</strong><span>Dynamic liquidity · 0.30%</span></div><Button variant="secondary" onClick={() => navigate(`pool/${token.symbol.toLowerCase()}-usdc`)}>View pool</Button></article></div>}
    </Panel>
  </>
}
