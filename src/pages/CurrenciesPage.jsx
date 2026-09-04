import React, { useState } from 'react'
import { ArrowUpRight, Info } from 'lucide-react'
import { Badge, Panel, SearchField, SegmentedControl, TokenIcon, WorkspaceHeader } from '../design-system/index.jsx'
import { currencies } from '../data.js'

export default function CurrenciesPage() {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('All currencies')
  const stablecoins = ['USDT', 'USDC', 'DAI']
  const visible = currencies.filter((item) => {
    const matchesQuery = item.symbol.toLowerCase().includes(query.toLowerCase()) || item.name.toLowerCase().includes(query.toLowerCase())
    const matchesGroup = group === 'All currencies' || (group === 'Stablecoins' ? stablecoins.includes(item.symbol) : !stablecoins.includes(item.symbol))
    return matchesQuery && matchesGroup
  })
  return <>
    <WorkspaceHeader title="Token directory" description="Search reviewed assets and chain addresses." meta={<Badge tone="neutral" className="info-badge"><Info size={16} />Information only</Badge>} />
    <Panel className="currency-panel" id="currency-results"><div className="currency-toolbar"><SearchField value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search assets or addresses" /><SegmentedControl items={['All currencies', 'Stablecoins', 'Major assets']} value={group} onChange={setGroup} label="Currency group" /><span><i />Global prices, volume and supply · USD</span></div><div className="currency-table"><div className="currency-row currency-head"><span>Token</span><span>Chain</span><span>Price</span><span>24h</span><span>24h volume</span><span>Market cap</span><span>Liquidity</span><span>Holders</span><span /></div>{visible.map((item) => <div className="currency-row" key={item.symbol}><div className="currency-name"><TokenIcon symbol={item.symbol} color={item.color} /><div><strong>{item.symbol}</strong><small>{item.name}</small></div></div><span>{item.chain}</span><strong>{item.price}</strong><span className={item.change.startsWith('-') ? 'negative-value' : 'positive-value'}>{item.change}</span><span>{item.volume}</span><span>{item.cap}</span><span>{item.liquidity}</span><span>{item.holders}</span><button><ArrowUpRight size={18} /></button></div>)}</div><div className="table-footer"><span>{visible.length} verified assets</span><span>Market data shown for interface preview</span></div></Panel>
  </>
}
