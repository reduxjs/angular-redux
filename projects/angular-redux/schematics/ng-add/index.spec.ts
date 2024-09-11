import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as AngularReduxOptions } from './schema';
import {
  getTestProjectPath,
  createWorkspace,
} from '@reduxjs/angular-redux/schematics-core/testing';

describe('Store ng-add Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@reduxjs/angular-redux',
    path.join(__dirname, '../collection.json')
  );
  const defaultOptions: AngularReduxOptions = {
    skipPackageJson: false,
    project: 'bar',
    module: 'app'
  };

  const projectPath = getTestProjectPath();
  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should update package.json', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematic('ng-add', options, appTree);

    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@reduxjs/angular-redux']).toBeDefined();
    expect(packageJson.dependencies['redux']).toBeDefined();
    expect(packageJson.dependencies['@reduxjs/toolkit']).toBeDefined();
  });

  it('should skip package.json update', async () => {
    const options = { ...defaultOptions, skipPackageJson: true };

    const tree = await schematicRunner.runSchematic('ng-add', options, appTree);
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@reduxjs/angular-redux']).toBeUndefined();
    expect(packageJson.dependencies['redux']).toBeUndefined();
    expect(packageJson.dependencies['@reduxjs/toolkit']).toBeUndefined();
  });

  it('should create the initial store setup', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematic('ng-add', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/store/index.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should import into a specified module', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      /import { store } from '\.\/store';/
    );
  });

  it('should fail if specified module does not exist', async () => {
    const options = { ...defaultOptions, module: '/src/app/app.moduleXXX.ts' };
    let thrownError: Error | null = null;
    try {
      await schematicRunner.runSchematic('ng-add', options, appTree);
    } catch (err: any) {
      thrownError = err;
    }
    expect(thrownError).toBeDefined();
  });

  describe('Store ng-add Schematic for standalone application', () => {
    const projectPath = getTestProjectPath(undefined, {
      name: 'bar-standalone',
    });
    const standaloneDefaultOptions = {
      ...defaultOptions,
      project: 'bar-standalone',
    };

    it('provides minimal store setup', async () => {
      const options = { ...standaloneDefaultOptions, minimal: true };
      const tree = await schematicRunner.runSchematic(
        'ng-add',
        options,
        appTree
      );

      const content = tree.readContent(`${projectPath}/src/app/app.config.ts`);
      const files = tree.files;

      expect(content).toMatch(/provideStore\(\)/);
      expect(content).not.toMatch(
        /import { store } from '\.\/store';/
      );
      expect(files.indexOf(`${projectPath}/src/app/store/index.ts`)).toBe(
        -1
      );
    });
  });
});
