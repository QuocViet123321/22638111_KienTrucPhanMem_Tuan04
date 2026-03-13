import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import "./App.css";

type ContentItem = {
  id: string;
  name: string;
  language: string;
  bio: string;
  version: number;
};

type ContentForm = {
  name: string;
  language: string;
  bio: string;
  version: string;
};

const API_BASE = "http://localhost:3000/api/content";

function App() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ContentForm>({
    name: "",
    language: "",
    bio: "",
    version: "1.0",
  });

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items],
  );

  async function fetchItems() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error("Không thể tải dữ liệu từ máy chủ");
      const data = (await response.json()) as ContentItem[];
      setItems(data);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : "Lỗi không xác định",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm({ name: "", language: "", bio: "", version: "1.0" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const payload = {
      name: form.name,
      language: form.language,
      bio: form.bio,
      version: Number(form.version),
    };
    try {
      const isUpdate = Boolean(editingId);
      const response = await fetch(
        isUpdate ? `${API_BASE}/${editingId}` : API_BASE,
        {
          method: isUpdate ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        throw new Error(data.message || "Không thể lưu nội dung");
      }
      await fetchItems();
      resetForm();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Lưu dữ liệu thất bại",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(item: ContentItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      language: item.language,
      bio: item.bio,
      version: String(item.version),
    });
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Bạn chắc chắn muốn xoá nội dung này?")) return;
    setError("");
    try {
      const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Không thể xoá nội dung");
      await fetchItems();
      if (editingId === id) resetForm();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Xoá thất bại",
      );
    }
  }

  return (
    <main className="cms-shell">
      {/* ── Topbar ── */}
      <header className="hero-panel">
        <div className="hero-brand">
          <div className="hero-logo">CMS</div>
          <div className="hero-titles">
            <h1>Quản lý nội dung</h1>
            <p className="eyebrow">Microkernel · Layered Architecture</p>
          </div>
        </div>
        <div className="hero-divider" />
        <p className="lead">Thêm · Sửa · Xoá dữ liệu trong data.json</p>
      </header>

      {/* ── Main ── */}
      <section className="grid-layout">
        {/* Left: form */}
        <article className="panel">
          <h2>{editingId ? "Cập nhật nội dung" : "Thêm nội dung mới"}</h2>
          <form className="content-form" onSubmit={handleSubmit}>
            <label>
              Tên
              <input
                placeholder="Nhập tên..."
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Ngôn ngữ
              <input
                placeholder="VD: Tiếng Việt"
                value={form.language}
                onChange={(e) =>
                  setForm((p) => ({ ...p, language: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Phiên bản
              <input
                type="number"
                step="0.01"
                placeholder="1.0"
                value={form.version}
                onChange={(e) =>
                  setForm((p) => ({ ...p, version: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Tiểu sử
              <textarea
                rows={4}
                placeholder="Nhập tiểu sử..."
                value={form.bio}
                onChange={(e) =>
                  setForm((p) => ({ ...p, bio: e.target.value }))
                }
                required
              />
            </label>
            <div className="form-actions">
              <button type="submit" disabled={submitting}>
                {submitting
                  ? "Đang lưu..."
                  : editingId
                    ? "Lưu thay đổi"
                    : "Thêm mới"}
              </button>
              {editingId && (
                <button type="button" className="ghost" onClick={resetForm}>
                  Huỷ
                </button>
              )}
            </div>
          </form>
        </article>

        {/* Right: list */}
        <article className="panel list-panel">
          <div className="list-header">
            <h2>
              Danh sách
              {!loading && (
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "0.68rem",
                    color: "var(--dim)",
                    fontWeight: 400,
                    letterSpacing: 0,
                    textTransform: "none",
                    marginLeft: 4,
                  }}
                >
                  ({sortedItems.length} mục)
                </span>
              )}
            </h2>
            <button className="ghost" onClick={fetchItems}>
              Tải lại
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          {loading ? (
            <p className="loading-text">Đang tải dữ liệu...</p>
          ) : (
            <ul className="content-list">
              {sortedItems.map((item) => (
                <li key={item.id}>
                  <header>
                    <h3>{item.name}</h3>
                    <span>v{item.version}</span>
                  </header>
                  <p className="meta">{item.language}</p>
                  <p>{item.bio}</p>
                  <div className="item-actions">
                    <button className="ghost" onClick={() => startEdit(item)}>
                      Sửa
                    </button>
                    <button
                      className="danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Xoá
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </main>
  );
}

export default App;
