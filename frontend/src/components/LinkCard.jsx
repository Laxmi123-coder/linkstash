function LinkCard({ link, onDelete }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "12px" }}>
      {link.image_url && (
        <img
          src={link.image_url}
          alt=""
          style={{ width: "100%", maxHeight: "150px", objectFit: "cover" }}
        />
      )}

      <h3>
        <a href={link.url} target="_blank" rel="noopener noreferrer">
          {link.title || link.url}
        </a>
      </h3>

      {link.description && <p>{link.description}</p>}

      {link.tags?.length > 0 && (
        <div>
          {link.tags.map((tag) => (
            <span key={tag} style={{ marginRight: "8px", fontSize: "12px", color: "#666" }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      <button onClick={() => onDelete(link.id)}>Delete</button>
    </div>
  );
}

export default LinkCard;
