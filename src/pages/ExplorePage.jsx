import React, { useMemo, useState } from 'react'
import { Info, Plus, Star } from 'lucide-react'
import { Button, DropdownSelect, Metric, PageTabs, Panel, SearchField, SegmentedControl } from '../design-system/index.jsx'
import { MiniTrend, TableActions, TokenPair } from '../components/Common.jsx'
import { pools } from '../data.js'

export default function ExplorePage({ navigate }) {
  const [query, setQuery] = useState('')
  const [model, setModel] = useState('All strategies')
  const [sort, setSort] = useState('TVL')
  const [saved, setSaved] = useState([])
  const [view, setView] = useState('Pools')
  const [window, setWindow] = useState('24H')

  const numberValue = (value) => Number(value.replace(/[$,%]/g, '').replace('M', '000000').replace('K', '000'))
  const visible = useMemo(() => pools
    .filter((pool) => (model === 'All strategies' || (model === 'Dynamic liquidity' ? pool.type === 'ALMM' : pool.type === 'ARL')) && pool.pair.toLowerCase().includes(query.toLowerCase()) && (view !== 'Saved' || saved.includes(pool.pair)))
    .sort((a, b) => sort === 'New' ? pools.indexOf(b) - pools.indexOf(a) : numberValue(b[sort.toLowerCase()]) - numberValue(a[sort.toLowerCase()])), [model, query, saved, sort, view])
  const toggleSaved = (pair) => setSaved((items) => items.includes(pair) ? items.filter((item) => item !== pair) : [...items, pair])
  const selectView = (nextView) => {
    setView(nextView)
    if (nextView === 'Pools' || nextView === 'Saved') setSort('TVL')
    if (nextView === 'Top yield') setSort('APR')
  }

  return <>
    <Panel className="liquidity-overview">
      <div className="liquidity-overview__metrics"><Metric label="Total value locked" value="At least $0.38" /><Metric label="24H swap volume" value="At least $0.00" /><Metric label="24H fees generated" value="At least $0.00" /></div>
      <div className="liquidity-overview__note"><Info size={16} /><span>16 pools · 24 of 70 pools have USD prices · totals are lower bounds</span></div>
      <Button size="sm" onClick={() => navigate('create')} icon={<Plus size={17} />}>Create pool</Button>
    </Panel>
    <PageTabs items={['Pools', 'Saved', 'Top yield']} value={view} onChange={selectView} label="Liquidity views" />
    <Panel className="market-panel" id="market-results">
      <div className="market-toolbar"><div className="market-toolbar__left"><SearchField value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search token or pool" /><SegmentedControl items={['All strategies', 'Dynamic liquidity', 'Range liquidity']} value={model} onChange={setModel} label="Liquidity strategy" /><button className="saved-filter" onClick={() => setView('Saved')}><Star size={17} />Saved {saved.length > 0 && <em>{saved.length}</em>}</button></div><div className="market-toolbar__right"><SegmentedControl items={['TVL', 'Volume', 'Fees', 'APR', 'New']} value={sort} onChange={setSort} label="Sort pools" /><div className="window-select"><span>Window</span><DropdownSelect label="Select data window" value={window} onChange={setWindow} options={['1H', '2H', '24H', '7D']} /></div></div></div>
      <div className="data-table pool-table" role="table">
        <div className="data-row data-head"><span>Pool</span><span>Strategy</span><span>TVL</span><span>24h volume</span><span>24h fees</span><span>APR</span><span>Trend</span><span /></div>
        {visible.map((pool) => <div className="data-row" key={pool.pair} onClick={() => navigate(`pool/${pool.pair.toLowerCase().replaceAll(' ', '').replace('/', '-')}`)}><div className="pool-name"><TokenPair first={pool.first} second={pool.second} /><div><strong>{pool.pair}</strong><small>GIWA · {pool.fee} fee</small></div></div><div className="strategy-cell"><strong>{pool.type === 'ALMM' ? 'Dynamic' : 'Range'}</strong><small>Powered by {pool.type}</small></div><strong>{pool.tvl}</strong><span>{pool.volume}</span><span>{pool.fees}</span><span className="positive-value">{pool.apr}</span><MiniTrend values={pool.trend} /><TableActions saved={saved.includes(pool.pair)} onSave={(event) => { event?.stopPropagation(); toggleSaved(pool.pair) }} /></div>)}
        {visible.length === 0 && <div className="empty-table"><strong>{view === 'Saved' ? 'No saved pools yet' : 'No pools found'}</strong><p>{view === 'Saved' ? 'Save a pool to find it here later.' : 'Try another token or strategy.'}</p><Button variant="secondary" onClick={() => { setQuery(''); setModel('All strategies'); setView('Pools') }}>{view === 'Saved' ? 'Explore pools' : 'Clear filters'}</Button></div>}
      </div>
      <div className="table-footer"><span>Showing {visible.length} of {pools.length} pools</span></div>
    </Panel>
  </>
}
