// Add this to your Express server to ensure proper CORS headers
const express = require("express")
const fs = require("fs").promises
const path = require("path")
const cors = require("cors")

const app = express()
const port = 3001

// Enhanced CORS configuration
app.use(
  cors({
    origin: "*", // In production, specify your frontend domain
    methods: ["GET", "HEAD"],
    allowedHeaders: ["Content-Type", "Range"],
    exposedHeaders: ["Content-Length", "Content-Range", "Accept-Ranges"],
    credentials: true,
  }),
)

// Add proper headers for PDF streaming
app.get("/pdfs/:folder/:file", async (req, res) => {
  try {
    const folderPath = path.join(__dirname, req.params.folder)
    const filePath = path.join(folderPath, req.params.file)

    // Check if file exists
    const stat = await fs.stat(filePath)

    // Set headers for PDF
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Length", stat.size)
    res.setHeader("Accept-Ranges", "bytes")

    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(filePath)
    fileStream.pipe(res)
  } catch (error) {
    console.error(`Error serving PDF: ${error.message}`)
    res.status(404).send("PDF not found")
  }
})

// Keep the rest of your server code as is...

