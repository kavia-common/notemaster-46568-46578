import React, { useEffect, useState } from "react";
import "../App.css";

/**
 * NoteEditor provides form inputs for title and content and exposes save/cancel events.
 */

// PUBLIC_INTERFACE
export default function NoteEditor({ initialValue, onSave, onCancel, saving }) {
  /** Props:
   * - initialValue: { title, content }
   * - onSave({title, content})
   * - onCancel()
   * - saving: boolean to disable UI during save
   */
  const [title, setTitle] = useState(initialValue?.title || "");
  const [content, setContent] = useState(initialValue?.content || "");

  useEffect(() => {
    setTitle(initialValue?.title || "");
    setContent(initialValue?.content || "");
  }, [initialValue?.title, initialValue?.content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave && onSave({ title: title.trim(), content: content.trim() });
  };

  return (
    <form className="nm-editor" onSubmit={handleSubmit}>
      <input
        className="nm-input"
        type="text"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={saving}
        aria-label="Note title"
      />
      <textarea
        className="nm-textarea"
        placeholder="Write your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        disabled={saving}
        aria-label="Note content"
      />
      <div className="nm-editor-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => onCancel && onCancel()}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
