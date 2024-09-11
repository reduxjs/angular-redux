import {
  dasherize,
  decamelize,
  camelize,
  classify,
  underscore,
  group,
  capitalize,
  featurePath,
  pluralize,
} from './utility/strings';

export {
  findNodes,
  getSourceNodes,
  getDecoratorMetadata,
  getContentOfKeyLiteral,
  insertAfterLastOccurrence,
  insertImport,
  addBootstrapToModule,
  addDeclarationToModule,
  addExportToModule,
  addImportToModule,
  addProviderToComponent,
  addProviderToModule,
  replaceImport,
  containsProperty,
} from './utility/ast-utils';

export {
  NoopChange,
  InsertChange,
  RemoveChange,
  ReplaceChange,
  createReplaceChange,
  createChangeRecorder,
  commitChanges
} from './utility/change';
export type {
    Host,
    Change
} from './utility/change';

export {getWorkspace, getWorkspacePath} from './utility/config';
export type { AppConfig } from './utility/config';

export { findComponentFromOptions } from './utility/find-component';

export {
  findModule,
  findModuleFromOptions,
  buildRelativePath
} from './utility/find-module';
export type { ModuleOptions } from './utility/find-module';

export { findPropertyInAstObject } from './utility/json-utilts';

export { getProjectPath, getProject, isLib } from './utility/project';

export const stringUtils = {
  dasherize,
  decamelize,
  camelize,
  classify,
  underscore,
  group,
  capitalize,
  featurePath,
  pluralize,
};

export { parseName } from './utility/parse-name';

export { addPackageToPackageJson } from './utility/package';

export {
  visitTSSourceFiles,
  visitNgModuleImports,
  visitNgModuleExports,
  visitComponents,
  visitDecorator,
  visitNgModules,
  visitTemplates,
} from './utility/visitors';
