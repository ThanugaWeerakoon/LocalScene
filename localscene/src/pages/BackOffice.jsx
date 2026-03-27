import { useState, useEffect, useRef } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  writeBatch,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// ─── PASTE YOUR FIREBASE CONFIG HERE ───────────────────────────────────────
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
// ───────────────────────────────────────────────────────────────────────────

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const COLLECTION = "carousel";

const EMPTY_FORM = { title: "", description: "", image: "", order: 0 };

// ─── Drag ghost state (module-level, not reactive) ─────────────────────────
let dragIndex = null;

export default function CarouselBackOffice() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragOver, setDragOver] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileRef = useRef();

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchItems = async () => {
    setLoading(true);
    const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
    const snap = await getDocs(q);
    setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ── Toast helper ─────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Upload image ─────────────────────────────────────────────────────────
  const handleFileChange = (file) => {
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    const storageRef = ref(storage, `carousel/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snap) =>
        setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => {
        showToast("Upload failed: " + err.message, "error");
        setUploadProgress(null);
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        setForm((f) => ({ ...f, image: url }));
        setUploadProgress(null);
        showToast("Image uploaded");
      }
    );
  };

  // ── Save (create or update) ───────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim()) return showToast("Title is required", "error");
    if (!form.image) return showToast("Please upload an image", "error");
    setSaving(true);
    try {
      if (editId) {
        await updateDoc(doc(db, COLLECTION, editId), form);
        showToast("Card updated");
      } else {
        const newOrder = items.length > 0 ? Math.max(...items.map((i) => i.order)) + 1 : 0;
        await addDoc(collection(db, COLLECTION), { ...form, order: newOrder });
        showToast("Card added");
      }
      await fetchItems();
      closeForm();
    } catch (e) {
      showToast("Save failed: " + e.message, "error");
    }
    setSaving(false);
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (item) => {
    try {
      await deleteDoc(doc(db, COLLECTION, item.id));
      if (item.image) {
        try {
          await deleteObject(ref(storage, item.image));
        } catch (_) {}
      }
      showToast("Card deleted");
      await fetchItems();
    } catch (e) {
      showToast("Delete failed: " + e.message, "error");
    }
    setDeleteConfirm(null);
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const openEdit = (item) => {
    setForm({ title: item.title, description: item.description, image: item.image, order: item.order });
    setPreviewUrl(item.image);
    setEditId(item.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setForm(EMPTY_FORM);
    setPreviewUrl("");
    setEditId(null);
    setShowForm(false);
    setUploadProgress(null);
  };

  // ── Drag-to-reorder ───────────────────────────────────────────────────────
  const handleDragEnd = async (overIndex) => {
    if (dragIndex === null || dragIndex === overIndex) return;
    const reordered = [...items];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(overIndex, 0, moved);
    const updated = reordered.map((item, i) => ({ ...item, order: i }));
    setItems(updated);
    setDragOver(null);
    dragIndex = null;

    const batch = writeBatch(db);
    updated.forEach((item) => batch.update(doc(db, COLLECTION, item.id), { order: item.order }));
    try {
      await batch.commit();
      showToast("Order saved");
    } catch (e) {
      showToast("Reorder failed", "error");
      fetchItems();
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Carousel</h1>
          <p style={styles.subtitle}>{items.length} card{items.length !== 1 ? "s" : ""} · drag to reorder</p>
        </div>
        <button style={styles.primaryBtn} onClick={() => setShowForm(true)}>
          + Add card
        </button>
      </div>

      {/* Card grid */}
      {loading ? (
        <div style={styles.empty}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={styles.empty}>No cards yet — add your first one.</div>
      ) : (
        <div style={styles.grid}>
          {items.map((item, i) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => (dragIndex = i)}
              onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => handleDragEnd(i)}
              style={{
                ...styles.card,
                ...(dragOver === i ? styles.cardDragOver : {}),
              }}
            >
              {/* Drag handle */}
              <div style={styles.dragHandle}>⠿</div>

              {/* Image */}
              <div style={styles.imgWrap}>
                <img src={item.image} alt={item.title} style={styles.img} />
                <div style={styles.orderBadge}>{i + 1}</div>
              </div>

              {/* Info */}
              <div style={styles.cardBody}>
                <p style={styles.cardTitle}>{item.title}</p>
                <p style={styles.cardDesc}>{item.description || <em style={{ opacity: 0.4 }}>No description</em>}</p>
              </div>

              {/* Actions */}
              <div style={styles.cardActions}>
                <button style={styles.ghostBtn} onClick={() => openEdit(item)}>Edit</button>
                <button style={styles.dangerBtn} onClick={() => setDeleteConfirm(item)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit modal ─────────────────────────────────────────────── */}
      {showForm && (
        <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && closeForm()}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>{editId ? "Edit card" : "Add card"}</h2>

            {/* Image upload */}
            <div
              style={{ ...styles.dropZone, ...(previewUrl ? styles.dropZoneHasImage : {}) }}
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFileChange(e.dataTransfer.files[0]); }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="preview" style={styles.dropPreview} />
              ) : (
                <div style={styles.dropPlaceholder}>
                  <span style={{ fontSize: 28 }}>↑</span>
                  <p style={{ margin: "6px 0 0", fontSize: 13 }}>Click or drag to upload</p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
            </div>

            {uploadProgress !== null && (
              <div style={styles.progressWrap}>
                <div style={{ ...styles.progressBar, width: `${uploadProgress}%` }} />
                <span style={styles.progressLabel}>{uploadProgress}%</span>
              </div>
            )}

            {/* Fields */}
            <label style={styles.label}>Title *</label>
            <input
              style={styles.input}
              placeholder="e.g. Swiss Alps"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />

            <label style={styles.label}>Description</label>
            <textarea
              style={{ ...styles.input, height: 72, resize: "vertical" }}
              placeholder="Short description shown on the card…"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />

            <div style={styles.modalActions}>
              <button style={styles.ghostBtn} onClick={closeForm}>Cancel</button>
              <button
                style={{ ...styles.primaryBtn, opacity: saving || uploadProgress !== null ? 0.6 : 1 }}
                disabled={saving || uploadProgress !== null}
                onClick={handleSave}
              >
                {saving ? "Saving…" : editId ? "Update" : "Add card"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm modal ─────────────────────────────────────────── */}
      {deleteConfirm && (
        <div style={styles.overlay}>
          <div style={{ ...styles.modal, maxWidth: 380 }}>
            <h2 style={styles.modalTitle}>Delete card?</h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 14, margin: "0 0 24px" }}>
              "<strong>{deleteConfirm.title}</strong>" will be permanently removed along with its image.
            </p>
            <div style={styles.modalActions}>
              <button style={styles.ghostBtn} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button style={styles.dangerBtn} onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      {toast && (
        <div style={{ ...styles.toast, background: toast.type === "error" ? "var(--color-background-danger)" : "var(--color-background-success)" }}>
          <span style={{ color: toast.type === "error" ? "var(--color-text-danger)" : "var(--color-text-success)", fontSize: 13, fontWeight: 500 }}>
            {toast.msg}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = {
  root: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "2rem 1.5rem",
    fontFamily: "var(--font-sans)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2rem",
  },
  h1: {
    fontSize: 22,
    fontWeight: 500,
    margin: 0,
    color: "var(--color-text-primary)",
  },
  subtitle: {
    fontSize: 13,
    color: "var(--color-text-secondary)",
    margin: "4px 0 0",
  },
  primaryBtn: {
    background: "var(--color-text-primary)",
    color: "var(--color-background-primary)",
    border: "none",
    borderRadius: "var(--border-radius-md)",
    padding: "8px 18px",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },
  ghostBtn: {
    background: "transparent",
    color: "var(--color-text-primary)",
    border: "0.5px solid var(--color-border-secondary)",
    borderRadius: "var(--border-radius-md)",
    padding: "7px 16px",
    fontSize: 13,
    cursor: "pointer",
  },
  dangerBtn: {
    background: "transparent",
    color: "var(--color-text-danger)",
    border: "0.5px solid var(--color-border-danger)",
    borderRadius: "var(--border-radius-md)",
    padding: "7px 16px",
    fontSize: 13,
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    padding: "4rem 0",
    color: "var(--color-text-secondary)",
    fontSize: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 16,
  },
  card: {
    background: "var(--color-background-primary)",
    border: "0.5px solid var(--color-border-tertiary)",
    borderRadius: "var(--border-radius-lg)",
    overflow: "hidden",
    cursor: "grab",
    transition: "border-color 0.15s",
    position: "relative",
  },
  cardDragOver: {
    border: "1.5px solid var(--color-border-info)",
  },
  dragHandle: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 1,
    zIndex: 2,
    userSelect: "none",
  },
  imgWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: "4/3",
    background: "var(--color-background-secondary)",
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  orderBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    background: "rgba(0,0,0,0.55)",
    color: "#fff",
    fontSize: 11,
    fontWeight: 500,
    padding: "2px 7px",
    borderRadius: 99,
  },
  cardBody: {
    padding: "12px 14px 6px",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 500,
    margin: "0 0 4px",
    color: "var(--color-text-primary)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardDesc: {
    fontSize: 12,
    color: "var(--color-text-secondary)",
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  cardActions: {
    display: "flex",
    gap: 8,
    padding: "10px 14px 14px",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: "1rem",
  },
  modal: {
    background: "var(--color-background-primary)",
    borderRadius: "var(--border-radius-lg)",
    border: "0.5px solid var(--color-border-tertiary)",
    padding: "1.75rem",
    width: "100%",
    maxWidth: 480,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 500,
    margin: "0 0 1.25rem",
    color: "var(--color-text-primary)",
  },
  dropZone: {
    border: "0.5px dashed var(--color-border-secondary)",
    borderRadius: "var(--border-radius-md)",
    height: 160,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginBottom: "1rem",
    overflow: "hidden",
    background: "var(--color-background-secondary)",
  },
  dropZoneHasImage: {
    border: "0.5px solid var(--color-border-tertiary)",
    background: "transparent",
  },
  dropPreview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  dropPlaceholder: {
    textAlign: "center",
    color: "var(--color-text-secondary)",
    fontSize: 13,
  },
  progressWrap: {
    position: "relative",
    height: 4,
    background: "var(--color-background-secondary)",
    borderRadius: 99,
    marginBottom: "0.75rem",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    background: "var(--color-text-primary)",
    borderRadius: 99,
    transition: "width 0.2s",
  },
  progressLabel: {
    position: "absolute",
    right: 0,
    top: 6,
    fontSize: 11,
    color: "var(--color-text-secondary)",
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 500,
    color: "var(--color-text-secondary)",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    fontSize: 14,
    padding: "8px 10px",
    borderRadius: "var(--border-radius-md)",
    border: "0.5px solid var(--color-border-secondary)",
    background: "var(--color-background-primary)",
    color: "var(--color-text-primary)",
    marginBottom: "1rem",
    fontFamily: "var(--font-sans)",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  toast: {
    position: "fixed",
    bottom: 24,
    left: "50%",
    transform: "translateX(-50%)",
    padding: "10px 20px",
    borderRadius: "var(--border-radius-md)",
    border: "0.5px solid var(--color-border-tertiary)",
    zIndex: 200,
  },
};