import React from "react";
import "../App.css";

/**
 * NoteItem displays a read-only view of a single note.
 */

// PUBLIC_INTERFACE
export default function NoteItem({ note }) {
  /** Props:
   * - note: { id, title, content }
   */
  if (!note) return null;
  return (
    <article className="nm-note">
      <h2 className="nm-note-title">{note.title || "Untitled"}</h2>
      <div className="nm-note-content">{note.content || ""}</div>
    </article>
  );
}
