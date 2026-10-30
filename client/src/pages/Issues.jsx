import { useEffect, useState } from "react";
import { deleteIssue, listIssues, updateIssue } from "../api.js";
import { IssueCard } from "../components/IssueCard.jsx";

/*
  useEffect loads the list once when this page appears (GET /api/issues).
  drafts holds the location input for each card so typing does not hit the API
  until the student clicks Save location (PUT).
*/
export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [status, setStatus] = useState("Loading…");
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      const rows = await listIssues();
      setIssues(rows);
      const next = {};
      for (const row of rows) next[row.id] = row.location;
      setDrafts(next);
      setStatus(`${rows.length} issue(s) from MongoDB.`);
    } catch (err) {
      setStatus("");
      setError(`${err.message} Is the Express server running on port 3000?`);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveLocation(id) {
    setError("");
    try {
      await updateIssue(id, { location: drafts[id] });
      await load();
      setStatus(`Updated location for id ${id}.`);
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    setError("");
    try {
      await deleteIssue(id);
      await load();
      setStatus(`Deleted id ${id}.`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h2>Open issues</h2>
      <p>GET loads the list. Save location sends PUT. Delete sends DELETE. Then we GET again.</p>
      {status ? <p className="status">{status}</p> : null}
      {error ? <p className="errors">{error}</p> : null}
      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          locationDraft={drafts[issue.id] ?? ""}
          onLocationChange={(id, value) => setDrafts((prev) => ({ ...prev, [id]: value }))}
          onSave={saveLocation}
          onDelete={remove}
        />
      ))}
    </>
  );
}
