import { useState } from "react";
import { useNavigate } from "react-router";
import { createIssue } from "../api.js";

/*
  Client checks first (same rules as Module 3). Then POST /api/issues.
  Express validates again and MongoDB stores the document.
*/
export default function Report() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    const next = [];
    if (title.trim().length < 5) next.push("title must be at least 5 characters");
    if (!["waste", "water", "energy", "safety"].includes(category)) {
      next.push("category must be waste, water, energy, or safety");
    }
    if (location.trim().length < 2) next.push("location is required");
    if (next.length) {
      setErrors(next);
      return;
    }

    setBusy(true);
    setErrors([]);
    try {
      const created = await createIssue({
        title: title.trim(),
        category,
        location: location.trim(),
      });
      // After a successful POST, show the list (the new card should be there).
      navigate("/issues", { state: { createdId: created.id } });
    } catch (err) {
      setErrors([err.message]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h2>Report an issue</h2>
      <p>POST /api/issues. A refresh on Issues should still show the new card.</p>
      <form onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label htmlFor="category">Category</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Choose…</option>
          <option value="waste">waste</option>
          <option value="water">water</option>
          <option value="energy">energy</option>
          <option value="safety">safety</option>
        </select>

        <label htmlFor="location">Location</label>
        <input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />

        <p>
          <button type="submit" disabled={busy}>
            {busy ? "Sending…" : "Submit to API"}
          </button>
        </p>
      </form>
      {errors.length ? (
        <ul className="errors">
          {errors.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
