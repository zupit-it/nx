import { execSync } from 'child_process'

function createWorkspace() {
  return execSync(
    `npx create-nx-workspace@latest --preset @zupit-it/nx-workspace`,
    {
      stdio: 'inherit'
    }
  )
}

export { createWorkspace }
