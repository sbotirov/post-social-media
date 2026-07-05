'use server'

import fs from 'fs'
import path from 'path'
import bcryptjs from 'bcryptjs'

export async function updatePassword(currentPass: string, newPass: string) {
  const currentHash = process.env.ADMIN_PASSWORD_HASH
  
  if (!currentHash) {
    if (currentPass !== 'admin') throw new Error('Invalid current password')
  } else {
    const isValid = await bcryptjs.compare(currentPass, currentHash)
    if (!isValid) throw new Error('Invalid current password')
  }

  if (newPass.length < 5) throw new Error('Password must be at least 5 characters')

  const salt = await bcryptjs.genSalt(10)
  const newHash = await bcryptjs.hash(newPass, salt)
  
  const envPath = path.join(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8')
    if (envContent.includes('ADMIN_PASSWORD_HASH=')) {
      envContent = envContent.replace(/ADMIN_PASSWORD_HASH=.*/, `ADMIN_PASSWORD_HASH="${newHash}"`)
    } else {
      envContent += `\nADMIN_PASSWORD_HASH="${newHash}"\n`
    }
    fs.writeFileSync(envPath, envContent)
  }
  
  process.env.ADMIN_PASSWORD_HASH = newHash;

  return { success: true }
}
