import { execSync } from 'child_process'

function createWorkspace() {
  return execSync('npm init nx-workspace --preset @zupit-it/workspace', {
    stdio: 'inherit'
  })
}

export { createWorkspace }
