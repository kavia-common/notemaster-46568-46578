import React from "react";
import "../App.css";

/**
 * NotesList displays a list of notes with selection and delete actions.
 */

// PUBLIC_INTERFACE
export default function NotesList({ notes = [], selectedId, onSelect, onDelete }) {
  /** Renders a list of notes. Props:
   * - notes: Array of { id, title, content, updated_at? }
   * - selectedId: currently selected note id
   * - onSelect(note): callback when a note is selected
   * - onDelete(note): callback when delete is requested
   */
  if (!notes || notes.length === 0) {
    return <div className="nm-empty">No notes yet. Create your first note!</div>;
  }

  return (
    <ul className="nm-list" role="list">
      {notes.map((n) => (
        <li
          key={n.id}
          className={`nm-item ${selectedId === n.id ? "active" : ""}`}
          onClick={() => onSelect && onSelect(n)}
        >
          <div className="nm-item-title">{n.title || "Untitled"}</div>
          <div className="nm-item-meta">
            {n.updated_at ? new Date(n.updated_at).toLocaleString() : ""}
          </div>
          <button
            className="btn btn-danger nm-item-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete(n);
            }}
            aria-label={`Delete note ${n.title || n.id}`}
            title="Delete"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
