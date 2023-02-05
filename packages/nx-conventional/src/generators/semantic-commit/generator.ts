import {
  formatFiles,
  installPackagesTask,
  Tree,
  updateJson
} from '@nrwl/devkit'
import { constants } from 'fs'
import { PackageJson } from 'nx/src/utils/package-json'

export default async function (tree: Tree) {
  updateJson(tree, 'package.json', (json: PackageJson) => {
    json.devDependencies = json.devDependencies ?? {}
    json.devDependencies['@commitlint/cli'] = '^17.4.2'
    json.devDependencies['@commitlint/config-conventional'] = '^17.4.2'
    json.devDependencies['@commitlint/cz-commitlint'] = '^17.4.2'
    json.devDependencies.husky = '^8.0.0'

    json.scripts = json.scripts ?? {}
    json.scripts.prepare = 'husky install'
    return json
  })

  tree.write(
    '.commitlintrc.json',
    JSON.stringify({
      extends: ['@commitlint/config-conventional']
    })
  )

  const commitMsg = `#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\nnpx --no -- commitlint --edit ${1}n`
  tree.write('.husky/commit-msg', commitMsg, {
    /* File mode indicating readable, writable, and executable by owner. */
    mode: constants.S_IRWXU
  })

  const prepareCommitMsg = `#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\nif [ -z "\${2-}" ]; then\n  exec < /dev/tty && npx cz --hook || true\nfi\n`
  tree.write('.husky/prepare-commit-msg', prepareCommitMsg, {
    /* File mode indicating readable, writable, and executable by owner. */
    mode: constants.S_IRWXU
  })

  await formatFiles(tree)

  return () => {
    installPackagesTask(tree)
  }
}
