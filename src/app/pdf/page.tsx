"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function FileConverter() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [wordFile, setWordFile] = useState<File | null>(null)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleConversion = async (file: File | null, convertTo: 'word' | 'pdf') => {
    if (!file) {
      setMessage(`Por favor, selecciona un archivo ${convertTo === 'word' ? 'PDF' : 'Word'} primero.`)
      return
    }

    setIsLoading(true)
    setMessage(`Convirtiendo ${file.name} a ${convertTo === 'word' ? 'Word' : 'PDF'}...`)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`/api/convert-to-${convertTo}`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Error en la conversión')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `converted-file.${convertTo === 'word' ? 'docx' : 'pdf'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      setMessage(`${file.name} ha sido convertido a ${convertTo === 'word' ? 'Word' : 'PDF'}.`)
    } catch (error) {
      setMessage(`Error al convertir el archivo: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Conversor de PDF a Word</CardTitle>
          <CardDescription>Selecciona un archivo PDF para convertirlo a Word.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="pdf-file">Archivo PDF</Label>
            <Input
              id="pdf-file"
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleConversion(pdfFile, 'word')} disabled={isLoading}>
            Convertir a Word
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversor de Word a PDF</CardTitle>
          <CardDescription>Selecciona un archivo Word para convertirlo a PDF.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="word-file">Archivo Word</Label>
            <Input
              id="word-file"
              type="file"
              accept=".doc,.docx"
              onChange={(e) => setWordFile(e.target.files?.[0] || null)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleConversion(wordFile, 'pdf')} disabled={isLoading}>
            Convertir a PDF
          </Button>
        </CardFooter>
      </Card>

      {message && (
        <Card>
          <CardContent className="pt-6">
            <p>{message}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}