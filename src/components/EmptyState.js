export default function EmptyState({ title, text, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        ⌕
      </div>

      {title && <h2>{title}</h2>}
      {text && <p>{text}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
