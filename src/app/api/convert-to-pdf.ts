import formidable from 'formidable'
import mammoth from 'mammoth'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PDFDocument, rgb } from 'pdf-lib'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const form = new formidable.IncomingForm()
  form.parse(req, async (err, _fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form data' })
    }

    const file = files.file && !Array.isArray(files.file) ? files.file : files.file?.[0]
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    try {
      const result = await mammoth.extractRawText({ path: file.filepath })
      const text = result.value

      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage()
      const { height } = page.getSize()
      page.drawText(text, {
        x: 50,
        y: height - 50,
        size: 12,
        color: rgb(0, 0, 0),
      })

      const pdfBytes = await pdfDoc.save()

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf')
      res.send(Buffer.from(pdfBytes))
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error converting file' })
    }
  })
}