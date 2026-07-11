import axios from "axios";
import * as cheerio from "cheerio";

export async function fetchLinkPreview(url) {
  try {
    const { data: html } = await axios.get(url, {
      timeout: 8000,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LinkStashBot/1.0)" },
    });

    const $ = cheerio.load(html);

    const getMeta = (name) =>
      $(`meta[property="${name}"]`).attr("content") ||
      $(`meta[name="${name}"]`).attr("content") ||
      null;

    const title = getMeta("og:title") || $("title").first().text() || url;
    const description = getMeta("og:description") || "";
    const image = getMeta("og:image") || null;

    return { title: title.trim(), description: description.trim(), image };
  } catch (err) {
    console.error("Preview fetch failed for", url, err.message);
    return { title: url, description: "", image: null };
  }
}