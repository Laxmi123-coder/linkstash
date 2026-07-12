import { useState } from "react";

function AddLinkForm({ onAdd }) {
  const [url, setUrl] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) return;

    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      await onAdd(url.trim(), tags);
      setUrl("");
      setTagInput("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="add-link-form" onSubmit={handleSubmit}>
      <input
        type="url"
        placeholder="Paste a link here"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
      />
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Link"}
      </button>
    </form>
  );
}

export default AddLinkForm;