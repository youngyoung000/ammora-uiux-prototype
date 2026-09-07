import React, { useState } from 'react'
import { Check, ChevronRight, X } from 'lucide-react'
import { Button } from '../design-system/index.jsx'

export default function ActionDialog({ title, description, rows = [], action = 'Confirm', onClose }) {
  const [confirmed, setConfirmed] = useState(false)
  return <div className="action-dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="action-dialog" role="dialog" aria-modal="true" aria-label={title}>
      <header><div><h2>{confirmed ? 'Transaction prepared' : title}</h2>{description && !confirmed && <p>{description}</p>}</div><button onClick={onClose} aria-label="Close"><X size={21} /></button></header>
      {confirmed ? <div className="action-success"><span><Check size={28} /></span><strong>Ready for wallet review</strong><p>The exact target, token amount, and protection limits will be shown before signing.</p><Button onClick={onClose}>Done</Button></div> : <><div className="action-review-rows">{rows.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><details className="action-technical"><summary>Transaction details <ChevronRight size={16} /></summary><div><span>Network</span><strong>GIWA Testnet · 91342</strong><span>Simulation</span><strong>Required before signing</strong><span>Token policy</span><strong>Reviewed</strong></div></details><footer><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={() => setConfirmed(true)}>{action}</Button></footer></>}
    </section>
  </div>
}
