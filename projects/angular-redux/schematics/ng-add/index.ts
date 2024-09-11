import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import * as ts from 'typescript';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
  applyTemplates,
  branchAndMerge,
  chain,
  mergeWith,
  url,
  noop,
  move,
  filter,
} from '@angular-devkit/schematics';
import {
  NodePackageInstallTask,
  RunSchematicTask,
} from '@angular-devkit/schematics/tasks';
import {
  InsertChange,
  addImportToModule,
  buildRelativePath,
  findModuleFromOptions,
  getProjectPath,
  insertImport,
  stringUtils,
  addPackageToPackageJson,
  parseName,
} from '../../schematics-core';
import { Schema as AngularReduxOptions } from './schema';
import { getProjectMainFile } from '../../schematics-core/utility/project';
import {
  addFunctionalProvidersToStandaloneBootstrap,
  callsProvidersFunction,
} from '../../schematics-core/utility/standalone';
import { isStandaloneApp } from '@schematics/angular/utility/ng-ast-utils';

function addImportToNgModule(options: AngularReduxOptions): Rule {
  return (host: Tree) => {
    const modulePath = options.module;

    if (!modulePath) {
      return host;
    }

    if (!host.exists(modulePath)) {
      throw new Error('Specified module does not exist');
    }

    const text = host.read(modulePath);
    if (text === null) {
      throw new SchematicsException(`File ${modulePath} does not exist.`);
    }
    const sourceText = text.toString('utf-8');

    const source = ts.createSourceFile(
      modulePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true
    );

    const storeModuleSetup = `provideRedux({store: store})`;

    const statePath = `/${options.path}/${options.storePath}`;
    const relativePath = buildRelativePath(modulePath, statePath);
    const [storeNgModuleImport] = addImportToModule(
      source,
      modulePath,
      storeModuleSetup,
      relativePath
    );

    let changes = [
      insertImport(source, modulePath, 'provideRedux', '@reduxjs/angular-redux'),
      insertImport(source, modulePath, 'store', relativePath),
      storeNgModuleImport,
    ];

    const recorder = host.beginUpdate(modulePath);

    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(recorder);

    return host;
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const angularReduxPackageMeta = fs.readFile(path.resolve(__dirname, '../../package.json')) as {
  version: string;
  peerDependencies: {
    [key: string]: string;
  }
};

function addReduxDepsToPackageJson() {
  return (host: Tree, context: SchematicContext) => {
    addPackageToPackageJson(
      host,
      'dependencies',
      '@reduxjs/toolkit',
      angularReduxPackageMeta.peerDependencies['@reduxjs/toolkit']
    );
    addPackageToPackageJson(
      host,
      'dependencies',
      'redux',
      angularReduxPackageMeta.peerDependencies['redux']
    );
    addPackageToPackageJson(
      host,
      'dependencies',
      '@reduxjs/angular-redux',
      angularReduxPackageMeta.version
    );
    context.addTask(new NodePackageInstallTask());
    return host;
  };
}

function addStandaloneConfig(options: AngularReduxOptions): Rule {
  return (host: Tree) => {
    const mainFile = getProjectMainFile(host, options);

    if (host.exists(mainFile)) {
      const storeProviderFn = 'provideRedux';

      if (callsProvidersFunction(host, mainFile, storeProviderFn)) {
        // exit because the store config is already provided
        return host;
      }
      const storeProviderOptions =  [
        ts.factory.createIdentifier('{ store }'),
      ];
      const patchedConfigFile = addFunctionalProvidersToStandaloneBootstrap(
        host,
        mainFile,
        storeProviderFn,
        '@reduxjs/angular-redux',
        storeProviderOptions
      );

      // insert reducers import into the patched file
      const configFileContent = host.read(patchedConfigFile);
      const source = ts.createSourceFile(
        patchedConfigFile,
        configFileContent?.toString('utf-8') || '',
        ts.ScriptTarget.Latest,
        true
      );
      const statePath = `/${options.path}/${options.storePath}`;
      const relativePath = buildRelativePath(
        `/${patchedConfigFile}`,
        statePath
      );

      const recorder = host.beginUpdate(patchedConfigFile);

      const change = insertImport(
        source,
        patchedConfigFile,
        'store',
        relativePath
      );

      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }

      host.commitUpdate(recorder);

      return host;
    }
    throw new SchematicsException(
      `Main file not found for a project ${options.project}`
    );
  };
}

export default function (options: AngularReduxOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    const mainFile = getProjectMainFile(host, options);
    const isStandalone = isStandaloneApp(host, mainFile);

    options.path = getProjectPath(host, options);

    const parsedPath = parseName(options.path, '');
    options.path = parsedPath.path;

    if (options.module && !isStandalone) {
      options.module = findModuleFromOptions(host, {
        name: '',
        module: options.module,
        path: options.path,
      });
    }

    const templateSource = apply(url('./files'), [
      applyTemplates({
        ...stringUtils,
        ...options,
      }),
      move(parsedPath.path),
    ]);

    const configOrModuleUpdate = isStandalone
      ? addStandaloneConfig(options)
      : addImportToNgModule(options);

    return chain([
      branchAndMerge(chain([configOrModuleUpdate, mergeWith(templateSource)])),
      options && options.skipPackageJson ? noop() : addReduxDepsToPackageJson(),
    ])(host, context);
  };
}
