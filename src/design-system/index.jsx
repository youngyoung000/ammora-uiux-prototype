import React from 'react'
import { ArrowRight, Search } from 'lucide-react'

export function Button({ children, variant = 'primary', size = 'md', icon, className = '', ...props }) {
  return <button className={`ds-button ds-button--${variant} ds-button--${size} ${className}`} {...props}>{children}{icon || (variant === 'primary' ? <ArrowRight size={17} /> : null)}</button>
}

export function Badge({ children, tone = 'brand', dot = false, className = '' }) {
  return <span className={`ds-badge ds-badge--${tone} ${className}`}>{dot && <i />}{children}</span>
}

export function Panel({ children, className = '', as: Tag = 'section', ...props }) {
  return <Tag className={`ds-panel ${className}`} {...props}>{children}</Tag>
}

export function PageIntro({ eyebrow, title, accent, description, actions, aside, compact = false }) {
  return (
    <Panel className={`page-intro ${compact ? 'page-intro--compact' : ''}`}>
      <div className="page-intro__copy">
        {eyebrow && <Badge dot>{eyebrow}</Badge>}
        <h1 className="type-h1">{title} {accent && <span className="gradient-text">{accent}</span>}</h1>
        {description && <p>{description}</p>}
        {actions && <div className="page-intro__actions">{actions}</div>}
      </div>
      {aside && <div className="page-intro__aside">{aside}</div>}
    </Panel>
  )
}

export function WorkspaceHeader({ title, description, actions, meta }) {
  return <header className="workspace-header">
    <div className="workspace-header__copy">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
    <div className="workspace-header__side">
      {meta && <div className="workspace-header__meta">{meta}</div>}
      {actions && <div className="workspace-header__actions">{actions}</div>}
    </div>
  </header>
}

export function PageTabs({ items, value, onChange, label }) {
  return <nav className="page-tabs" aria-label={label}>
    {items.map((item) => <button key={item} className={value === item ? 'active' : ''} onClick={() => onChange(item)}>{item}</button>)}
  </nav>
}

export function SectionHeading({ eyebrow, title, description, action }) {
  return <div className="section-heading"><div>{eyebrow && <span className="section-eyebrow">{eyebrow}</span>}<h2 className="type-h2">{title}</h2>{description && <p>{description}</p>}</div>{action && <div>{action}</div>}</div>
}

export function Metric({ label, value, note, tone }) {
  return <article className="ds-metric"><span>{label}</span><strong>{value}</strong>{note && <small className={tone ? `is-${tone}` : ''}>{note}</small>}</article>
}

export function SearchField({ value, onChange, placeholder = 'Search', className = '' }) {
  return <label className={`ds-field ds-search ${className}`}><Search size={18} /><input value={value} onChange={onChange} placeholder={placeholder} /></label>
}

export function SegmentedControl({ items, value, onChange, label }) {
  return <div className="ds-segmented" role="group" aria-label={label}>{items.map((item) => <button key={item} className={value === item ? 'active' : ''} onClick={() => onChange(item)}>{item}</button>)}</div>
}

export function TokenIcon({ symbol, color = '#5d8dff' }) {
  return <span className="token-icon" style={{ '--token-color': color }}>{symbol.slice(0, 1)}</span>
}

export function StatusDot({ children, tone = 'positive' }) {
  return <span className={`status-label status-label--${tone}`}><i />{children}</span>
}

export function QuickSelect({ title = 'Choose a quick route', description, options, value, onSelect, id }) {
  return <section className="quick-select" id={id}>
    <div className="quick-select__intro">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
    <div className="quick-select__options">
      {options.map((option) => <button
        key={option.id}
        className={value === option.id ? 'selected' : ''}
        aria-pressed={value === option.id}
        onClick={() => onSelect(option.id)}
      >
        <span className="quick-select__icon">{option.icon}</span>
        <span className="quick-select__copy">
          <span>{option.recommended && <em>Recommended</em>}{option.meta}</span>
          <strong>{option.label}</strong>
          <small>{option.description}</small>
        </span>
      </button>)}
    </div>
  </section>
}
