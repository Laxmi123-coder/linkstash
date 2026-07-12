import { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import AddLinkForm from "./components/AddLinkForm";
import LinkCard from "./components/LinkCard";
import { loginUser,registerUser, getLinks, addLink, deleteLink } from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
const [activeTag, setActiveTag] = useState(null);

  async function handleLogin(email, password) {
    setError("");
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    }
  }


  async function handleRegister(email, password) {
  setError("");
  try {
    const data = await registerUser(email, password);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  } catch (err) {
    setError(err.message);
  }
}

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    setLinks([]);
  }

  async function loadLinks() {
  setLoading(true);
  try {
    const params = {};
    if (search) params.search = search;
    if (activeTag) params.tag = activeTag;
    const data = await getLinks(params);
    setLinks(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
  async function handleAdd(url, tags) {
    const newLink = await addLink(url, tags);
    setLinks((prev) => [newLink, ...prev]);
  }

  async function handleDelete(id) {
    await deleteLink(id);
    setLinks((prev) => prev.filter((link) => link.id !== id));
  }

  // Load links as soon as the user logs in
  useEffect(() => {
  if (user) {
    loadLinks();
  }
}, [user, search, activeTag]);
 if (!user) {
  return (
    <div>
      <AuthForm onLogin={handleLogin} />
      {error && <p className="error-text" style={{ textAlign: "center" }}>{error}</p>}
    </div>
  );
}
 
 return (
  <div className="app-shell">
    <div className="top-bar">
      <h1>LinkStash</h1>
      <button onClick={handleLogout}>Log Out</button>
    </div>

    <AddLinkForm onAdd={handleAdd} />

    <input
      type="text"
      className="search-input"
      placeholder="Search your links..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <div className="tag-row">
      <button
        className={!activeTag ? "active" : ""}
        onClick={() => setActiveTag(null)}
      >
        All
      </button>
      {[...new Set(links.flatMap((l) => l.tags || []))].map((tag) => (
        <button
          key={tag}
          className={activeTag === tag ? "active" : ""}
          onClick={() => setActiveTag(tag)}
        >
          {tag}
        </button>
      ))}
    </div>

    {error && <p className="error-text">{error}</p>}
    {loading && <p>Loading...</p>}

    {links.map((link) => (
      <LinkCard key={link.id} link={link} onDelete={handleDelete} />
    ))}
  </div>
);
}

export default App;