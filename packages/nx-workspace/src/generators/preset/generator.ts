import { formatFiles, Tree } from '@nrwl/devkit'
import { semanticCommit } from '@zupit-it/nx-conventional'

import { PresetGeneratorSchema } from './schema'

export default async function (tree: Tree, options: PresetGeneratorSchema) {
  await semanticCommit(tree, options)
  await formatFiles(tree)
}
