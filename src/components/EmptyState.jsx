import "./EmptyState.css";

export default function EmptyState({ title, body, action }) {
  return (
    <div className="gt-empty">
      <p className="h-display h3">{title}</p>
      {body && <p className="body-text gt-empty__body">{body}</p>}
      {action}
    </div>
  );
}
