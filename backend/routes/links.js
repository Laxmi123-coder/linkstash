import express from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { fetchLinkPreview } from "../utils/scrape.js";

const router = express.Router();

// Every route below this line requires a valid login token
router.use(requireAuth);

// GET /api/links  → list all of the logged-in user's saved links
router.get("/", async (req, res) => {
  const userId = req.user.userId;
  const { search, tag } = req.query;

  try {
    let query = `
      SELECT l.id, l.url, l.title, l.description, l.image_url, l.created_at,
             COALESCE(json_agg(t.name) FILTER (WHERE t.name IS NOT NULL), '[]') AS tags
      FROM links l
      LEFT JOIN link_tags lt ON lt.link_id = l.id
      LEFT JOIN tags t ON t.id = lt.tag_id
      WHERE l.user_id = $1
    `;
    const params = [userId];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (l.title ILIKE $${params.length} OR l.description ILIKE $${params.length})`;
    }

    query += " GROUP BY l.id ORDER BY l.created_at DESC";

    const result = await pool.query(query, params);

    let links = result.rows;
    if (tag) {
      links = links.filter((l) => l.tags.includes(tag));
    }

    res.json(links);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch your links" });
  }
});
// POST /api/links  → save a new link (with auto-fetched preview + tags)
router.post("/", async (req, res) => {
  const { url, tags = [] } = req.body;
  const userId = req.user.userId;

  if (!url) {
    return res.status(400).json({ error: "A URL is required" });
  }

  const client = await pool.connect();

  try {
    const preview = await fetchLinkPreview(url);

    await client.query("BEGIN");

    const linkResult = await client.query(
      `INSERT INTO links (user_id, url, title, description, image_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, url, preview.title, preview.description, preview.image]
    );
    const link = linkResult.rows[0];

    for (const rawName of tags) {
      const name = rawName.trim().toLowerCase();
      if (!name) continue;

      const tagResult = await client.query(
        `INSERT INTO tags (name) VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [name]
      );
      const tagId = tagResult.rows[0].id;

      await client.query(
        `INSERT INTO link_tags (link_id, tag_id) VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [link.id, tagId]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ ...link, tags });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Could not save this link" });
  } finally {
    client.release();
  }
});

// DELETE /api/links/:id → delete one of the user's links
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "DELETE FROM links WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete this link" });
  }
});

export default router;