import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree
} from '@nrwl/devkit'
import * as path from 'path'
import { SemanticReleaseGeneratorSchema } from './schema'

interface NormalizedSchema extends SemanticReleaseGeneratorSchema {
  projectName: string
  projectRoot: string
  projectDirectory: string
  parsedTags: string[]
}

function normalizeOptions(
  tree: Tree,
  options: SemanticReleaseGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName
  const projectDirectory =
    options.directory != null
      ? `${names(options.directory).fileName}/${name}`
      : name
  const projectName = projectDirectory.replace(/\//, '-')
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`
  const parsedTags =
    options.tags != null ? options.tags.split(',').map((s) => s.trim()) : []

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags
  }
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: ''
  }
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  )
}

export default async function (
  tree: Tree,
  options: SemanticReleaseGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options)
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'library',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@zupit-it/nx-conventional:build'
      }
    },
    tags: normalizedOptions.parsedTags
  })
  addFiles(tree, normalizedOptions)
  await formatFiles(tree)
}
