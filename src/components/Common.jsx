import React from 'react'
import { ArrowRight, Bookmark } from 'lucide-react'

export function TokenPair({ first, second }) {
  return <span className="token-pair" aria-hidden="true"><i style={{ '--token-color': first[1] }}>{first[0]}</i><i style={{ '--token-color': second[1] }}>{second[0]}</i></span>
}

export function MiniTrend({ values }) {
  const points = values.map((value, index) => `${index * (90 / (values.length - 1))},${38 - value * .52}`).join(' ')
  return <svg className="mini-trend" viewBox="0 0 90 40"><polyline points={points} /></svg>
}

export function TableActions({ saved, onSave }) {
  return <div className="table-actions"><button className={saved ? 'saved' : ''} onClick={onSave} aria-label="Save"><Bookmark size={18} fill={saved ? 'currentColor' : 'none'} /></button><button aria-label="Open"><ArrowRight size={18} /></button></div>
}

export function FlowSteps({ items }) {
  return <div className="flow-steps">{items.map((item, index) => <article key={item.title}><span>{index + 1}</span><strong>{item.title}</strong><p>{item.copy}</p></article>)}</div>
}
