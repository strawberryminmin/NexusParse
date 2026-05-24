import { exec } from 'child_process'
import os from 'os'

const url = 'http://localhost:3000'
const platform = os.platform()

console.log(`[Launcher] Launching default browser to ${url}...`)

if (platform === 'win32') {
  // Use cmd to execute start directly to ensure it works across all shells (CMD, PowerShell, Git Bash)
  exec(`cmd.exe /c start ${url}`)
} else if (platform === 'darwin') {
  exec(`open ${url}`)
} else {
  exec(`xdg-open ${url}`)
}
