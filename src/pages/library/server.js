const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());

const FOLDERS = [
  "Papers",
  "Dissertations",
  "E-Books",
  "Journals",
  "Past Papers",
];

app.get("/api/resources", async (req, res) => {
  try {
    const allResources = [];
    for (const folder of FOLDERS) {
      const folderPath = path.join(__dirname, folder);
      console.log(`Checking folder: ${folderPath}`);
      try {
        const files = await fs.readdir(folderPath);
        console.log(`Files in ${folder}:`, files);
        const pdfFiles = files.filter((file) =>
          file.toLowerCase().endsWith(".pdf")
        );
        const folderResources = await Promise.all(
          pdfFiles.map(async (file) => {
            const filePath = path.join(folderPath, file);
            const stats = await fs.stat(filePath);
            return {
              id: path.join(folder, file),
              title: path.basename(file, ".pdf"),
              type: folder,
              path: `/pdfs/${folder}/${file}`,
              year: extractYearFromFileName(file),
              size: stats.size,
              lastModified: stats.mtime,
            };
          })
        );
        allResources.push(...folderResources);
      } catch (error) {
        console.error(`Error reading folder ${folder}:`, error);
      }
    }
    console.log("Total resources found:", allResources.length);
    res.json(allResources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use("/pdfs", express.static(path.join(__dirname)));

function extractYearFromFileName(fileName) {
  const yearMatch = fileName.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? Number.parseInt(yearMatch[0]) : null;
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Current directory: ${__dirname}`);
});
