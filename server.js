
import express from "express";
import { tiktok } from "@coflyn/scrapr";

const app = express();
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.send("SannSV Backend aktif!");
});

app.post("/api/download", async (req, res) => {
  const url = req.body?.url;

  try {
    if (typeof url !== "string") {
      return res.status(400).json({ error: "Link TikTok wajib diisi." });
    }

    const parsed = new URL(url);

    if (
      !["tiktok.com", "www.tiktok.com", "m.tiktok.com",
      "vm.tiktok.com", "vt.tiktok.com"].includes(parsed.hostname)
    ) {
      return res.status(400).json({ error: "Link TikTok tidak valid." });
    }

    for (const scraper of [tiktok.snaptik, tiktok.ssstik]) {
      try {
        const result = await scraper(url);

        if (result?.status && result.result?.downloads?.length) {
          return res.json({
            success: true,
            title: result.result.title,
            thumbnail: result.result.thumbnail,
            downloads: result.result.downloads
          });
        }
      } catch {}
    }

    return res.status(502).json({
      error: "Video gagal diproses. Coba lagi nanti."
    });
  } catch {
    return res.status(400).json({ error: "Link tidak valid." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`SannSV berjalan di port ${PORT}`);
});
