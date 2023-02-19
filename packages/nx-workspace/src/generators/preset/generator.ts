import { formatFiles, Tree } from '@nrwl/devkit'
import { semanticCommit } from '@zupit-it/nx-conventional'

export default async function (tree: Tree) {
  await semanticCommit(tree)
  await formatFiles(tree)
}
