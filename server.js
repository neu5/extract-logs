import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// ES module-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'dist' directory (where Vite builds to)
app.use(express.static(path.join(__dirname, "dist")));

// Serve static files from the 'public' directory
app.use("/logData", express.static(path.join(__dirname, "public/logData")));

// Fallback to index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
