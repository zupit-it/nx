import { execSync } from 'child_process'

const PRESET = '@zupit-it/workspace'

function createWorkspace() {
  return execSync(`npx create-nx-workspace@latest --preset ${PRESET}`, {
    stdio: 'inherit'
  })
}

export { createWorkspace }
