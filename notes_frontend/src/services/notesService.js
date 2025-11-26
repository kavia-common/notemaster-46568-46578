import api from "../api/client";

/**
 * Notes service provides CRUD operations for notes.
 * Backend routes are under /api; the axios client already prefixes /api in baseURL.
 * Effective endpoints:
 * - GET  /notes
 * - POST /notes
 * - GET  /notes/{id}
 * - PUT  /notes/{id}
 * - DEL  /notes/{id}
 */

// PUBLIC_INTERFACE
export async function listNotes() {
  /** Fetch all notes from backend. Returns an array of notes. */
  const res = await api.get("/notes");
  return res.data;
}

// PUBLIC_INTERFACE
export async function createNote(payload) {
  /** Create a new note. Payload: { title, content }. Returns created note. */
  const res = await api.post("/notes", payload);
  return res.data;
}

// PUBLIC_INTERFACE
export async function updateNote(id, payload) {
  /** Update an existing note. Payload: { title, content }. Returns updated note. */
  const res = await api.put(`/notes/${id}`, payload);
  return res.data;
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. Returns { success: true } or deleted resource. */
  const res = await api.delete(`/notes/${id}`);
  return res.data;
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Retrieve a note by id. Returns note object. */
  const res = await api.get(`/notes/${id}`);
  return res.data;
}
