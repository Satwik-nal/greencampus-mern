/*
  Presentational card — same idea as Module 3 IssueCard.
  Extra actions (save location, delete) stay in the parent so this file only draws UI.
*/
export function IssueCard({ issue, locationDraft, onLocationChange, onSave, onDelete }) {
  return (
    <article className="card">
      <p className="badge">{issue.category}</p>
      <h2>{issue.title}</h2>
      <p>id {issue.id}</p>
      <label htmlFor={`loc-${issue.id}`}>Location</label>
      <input
        id={`loc-${issue.id}`}
        value={locationDraft}
        onChange={(event) => onLocationChange(issue.id, event.target.value)}
      />
      <div className="card-actions">
        <button type="button" className="secondary" onClick={() => onSave(issue.id)}>
          Save location
        </button>
        <button type="button" className="danger" onClick={() => onDelete(issue.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
