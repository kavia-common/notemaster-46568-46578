import React, { useEffect, useMemo, useState } from "react";
import {
  listNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/notesService";
import "../App.css";

/**
 * NotesPage is the main page that lists notes and provides editor for create/update.
 * Includes loading and error states and optimistic UI updates where reasonable.
 */

// PUBLIC_INTERFACE
export default function NotesPage() {
  /** Renders the Notes management page. */
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState("list"); // 'list' | 'create' | 'edit'

  const selectedId = selected?.id ?? null;

  const sortedNotes = useMemo(() => {
    const copy = [...notes];
    copy.sort((a, b) => {
      const da = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const db = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return db - da;
    });
    return copy;
  }, [notes]);

  async function refresh() {
    setLoading(true);
    setErr("");
    try {
      const data = await listNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (payload) => {
    setSaving(true);
    setErr("");
    try {
      const created = await createNote(payload);
      setNotes((prev) => [created, ...prev]);
      setMode("list");
      setSelected(created);
    } catch (e) {
      setErr(e.message || "Failed to create note");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!selectedId) return;
    setSaving(true);
    setErr("");
    try {
      const updated = await updateNote(selectedId, payload);
      setNotes((prev) => prev.map((n) => (n.id === selectedId ? updated : n)));
      setSelected(updated);
      setMode("list");
    } catch (e) {
      setErr(e.message || "Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (note) => {
    if (!note?.id) return;
    const prev = notes;
    // Optimistic update
    setNotes((p) => p.filter((n) => n.id !== note.id));
    if (selectedId === note.id) {
      setSelected(null);
    }
    try {
      await deleteNote(note.id);
    } catch (e) {
      // rollback on error
      setNotes(prev);
      setErr(e.message || "Failed to delete note");
    }
  };

  const renderList = () => {
    return (
      <div className="nm-layout">
        <aside className="nm-sidebar">
          <div className="nm-sidebar-header">
            <h1 className="nm-title">Notes</h1>
            <button
              className="btn btn-primary"
              onClick={() => {
                setMode("create");
                setSelected(null);
              }}
            >
              + New Note
            </button>
          </div>
          <div className="nm-sidebar-body">
            {loading ? (
              <div className="nm-status">Loading notes...</div>
            ) : err ? (
              <div className="nm-error" role="alert">
                {err}
              </div>
            ) : (
              <ul className="nm-list" role="list">
                {sortedNotes.map((n) => (
                  <li
                    key={n.id}
                    className={`nm-item ${selectedId === n.id ? "active" : ""}`}
                    onClick={() => {
                      setSelected(n);
                      setMode("edit");
                    }}
                  >
                    <div className="nm-item-title">{n.title || "Untitled"}</div>
                    <div className="nm-item-meta">
                      {n.updated_at ? new Date(n.updated_at).toLocaleString() : ""}
                    </div>
                    <button
                      className="btn btn-danger nm-item-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(n);
                      }}
                      aria-label={`Delete note ${n.title || n.id}`}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
        <main className="nm-main">
          {mode === "create" ? (
            <div className="nm-panel">
              <div className="nm-panel-header">
                <h2>Create Note</h2>
              </div>
              <div className="nm-panel-body">
                <NoteEditor
                  initialValue={{ title: "", content: "" }}
                  saving={saving}
                  onSave={handleCreate}
                  onCancel={() => setMode("list")}
                />
              </div>
            </div>
          ) : mode === "edit" && selected ? (
            <div className="nm-panel">
              <div className="nm-panel-header">
                <h2>Edit Note</h2>
              </div>
              <div className="nm-panel-body">
                <NoteEditor
                  initialValue={{ title: selected.title || "", content: selected.content || "" }}
                  saving={saving}
                  onSave={handleUpdate}
                  onCancel={() => setMode("list")}
                />
              </div>
            </div>
          ) : (
            <div className="nm-empty-panel">
              <div className="nm-status">Select a note to edit or create a new one.</div>
            </div>
          )}
        </main>
      </div>
    );
  };

  return (
    <div className="nm-page">
      <header className="nm-header">
        <div className="nm-brand">NoteMaster</div>
      </header>
      {renderList()}
      <footer className="nm-footer">
        <span>Ocean Professional</span>
      </footer>
    </div>
  );
}

/**
 * Local NoteEditor import at bottom to avoid circular dependency in some tooling.
 */
function NoteEditor(props) {
  // lightweight inline import pattern
  // eslint-disable-next-line global-require
  const Comp = require("../components/NoteEditor.jsx").default;
  return <Comp {...props} />;
}
