import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export async function readFileAsText(file) {
  // TXT files — read normally
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  // PDF files — extract text properly page by page
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let fullText = ''

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()

        // Join items with smart spacing
        let lastY = null
        let pageText = ''
        for (const item of content.items) {
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
            pageText += '\n'
          }
          pageText += item.str + ' '
          lastY = item.transform[5]
        }

        fullText += pageText + '\n'
      }

      return fullText.trim()
    } catch (err) {
      throw new Error('Failed to read PDF. Please make sure it is not password protected.')
    }
  }

  throw new Error('Unsupported file type. Please upload a PDF or TXT file.')
}
