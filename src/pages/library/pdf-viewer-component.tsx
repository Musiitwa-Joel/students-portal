"use client"

import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button, Spin, Typography } from "antd"
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons"

// Set the worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const { Text } = Typography

interface PDFViewerProps {
  pdfUrl: string
  title?: string
  isFullScreen: boolean
  onToggleFullScreen: () => void
}

const PDFViewer = ({ pdfUrl, title, isFullScreen, onToggleFullScreen }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [pdfScale, setPdfScale] = useState(1.0)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
  }

  const handleZoomIn = () => {
    setPdfScale((prevScale) => Math.min(prevScale + 0.1, 2.0))
  }

  const handleZoomOut = () => {
    setPdfScale((prevScale) => Math.max(prevScale - 0.1, 0.5))
  }

  return (
    <div className="preview-container">
      <div className="preview-toolbar">
        <Button onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))} disabled={pageNumber <= 1}>
          Previous
        </Button>
        <Text>
          Page {pageNumber} of {numPages || "?"}
        </Text>
        <Button
          onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages || prev))}
          disabled={numPages === null || pageNumber >= numPages}
        >
          Next
        </Button>
        <Button onClick={handleZoomOut}>Zoom Out</Button>
        <Button onClick={handleZoomIn}>Zoom In</Button>
        <Button onClick={onToggleFullScreen}>
          {isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </Button>
      </div>

      <div className="pdf-document-container">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => {
            console.error("Error loading PDF:", error)
            setLoading(false)
          }}
          loading={
            <div className="preview-loading">
              <Spin size="large" />
              <Text>Loading PDF...</Text>
            </div>
          }
          error={
            <div className="preview-error">
              <Text type="danger">Failed to load PDF. Please check if the file exists and the server is running.</Text>
            </div>
          }
        >
          {loading ? null : (
            <Page pageNumber={pageNumber} scale={pdfScale} renderTextLayer={false} renderAnnotationLayer={false} />
          )}
        </Document>
      </div>
    </div>
  )
}

export default PDFViewer

