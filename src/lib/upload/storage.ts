import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function getUploadDir(subdir: string = ''): string {
  const base = path.join(process.cwd(), 'public', 'uploads')
  const dir = subdir ? path.join(base, subdir) : base
  ensureDir(dir)
  return dir
}

export async function saveUploadedFile(
  file: File,
  subdir: string = 'media'
): Promise<{ filePath: string; fileName: string; fileSize: number; mimeType: string }> {
  const dir = getUploadDir(subdir)

  const ext = path.extname(file.name) || ''
  const uniqueName = `${crypto.randomUUID()}${ext}`
  const absolutePath = path.join(dir, uniqueName)

  const buffer = Buffer.from(await file.arrayBuffer())
  fs.writeFileSync(absolutePath, buffer)

  return {
    filePath: `/uploads/${subdir}/${uniqueName}`,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  const absolutePath = path.join(process.cwd(), 'public', filePath)
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath)
  }
}
