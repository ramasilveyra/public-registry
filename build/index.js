'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compile = compile;
exports.compileFile = compileFile;
exports.compileDir = compileDir;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _resolveFrom = require('resolve-from');

var _resolveFrom2 = _interopRequireDefault(_resolveFrom);

var _makeDir = require('make-dir');

var _makeDir2 = _interopRequireDefault(_makeDir);

var _globby = require('globby');

var _globby2 = _interopRequireDefault(_globby);

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _transformation = require('./transformation');

var _transformation2 = _interopRequireDefault(_transformation);

var _depsGraph = require('./deps-graph');

var _depsGraph2 = _interopRequireDefault(_depsGraph);

var _codeGeneratorEjs = require('./code-generator-ejs');

var _codeGeneratorEjs2 = _interopRequireDefault(_codeGeneratorEjs);

var _codeGeneratorPug = require('./code-generator-pug');

var _codeGeneratorPug2 = _interopRequireDefault(_codeGeneratorPug);

var _optimize = require('./optimize');

var _optimize2 = _interopRequireDefault(_optimize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readFileAsync = _util2.default.promisify(_fs2.default.readFile);
const writeFileAsync = _util2.default.promisify(_fs2.default.writeFile);

async function compile(inputCode, { inputFile, templateEngine = 'pug', beginning = '', ending = '', initialIndentLevel = 0 } = {}) {
  const { ast, table } = parseTransformOptimize(inputCode, inputFile, { templateEngine });
  const codeGenerator = templateEngine === 'ejs' ? _codeGeneratorEjs2.default : _codeGeneratorPug2.default;
  if (inputFile) {
    const { bundleAST, bundleTable } = await resolveDependencies(inputFile, ast, table);
    const optimizedAST = (0, _optimize2.default)(bundleAST, bundleTable);
    const code = generateOutputCode(codeGenerator(optimizedAST, { initialIndentLevel }), beginning, ending);
    return code;
  }
  const code = generateOutputCode(codeGenerator(ast, { initialIndentLevel }), beginning, ending);
  return code;
}

function parseTransformOptimize(inputCode, inputFile) {
  const oldAst = (0, _parser2.default)(inputCode);
  const { ast, table } = (0, _transformation2.default)(oldAst, inputFile);
  const optimizedAST = (0, _optimize2.default)(ast, table);
  return { ast: optimizedAST, table };
}

async function resolveDependencies(moduleFile, moduleAST, moduleTable) {
  const depGraph = new _depsGraph2.default();
  depGraph.addModule(moduleFile, moduleAST, moduleTable);
  await parseModule(moduleFile, moduleTable, depGraph);
  const preBundleTable = depGraph.modules.map(dep => dep.table);
  const bundleTable = preBundleTable.reduce((acc, item) => ({
    components: Object.assign({}, acc.components, item.components),
    dependencies: Object.assign({}, acc.dependencies, item.dependencies)
  }), {});
  return { bundleAST: moduleAST, bundleTable };
}

async function parseModule(moduleFile, moduleTable, depGraph) {
  await Promise.all(Object.values(moduleTable.dependencies).map(async dep => {
    if (dep.isUsedAsRC) {
      const depFilePath = await resolveFromFile(moduleFile, dep.source);
      dep.path = depFilePath; // eslint-disable-line no-param-reassign
      const depCode = await readFileAsync(depFilePath, { encoding: 'utf8' });
      const { ast: depAST, table: depTable } = parseTransformOptimize(depCode, depFilePath);
      depGraph.addModule(depFilePath, depAST, depTable);
      depGraph.addDependency(moduleFile, depFilePath);
      await parseModule(depFilePath, depTable, depGraph);
    }
  }));
}

async function resolveFromFile(filePath, moduleId) {
  const depDirPath = _path2.default.dirname(filePath);
  const depFilePath = await (0, _resolveFrom2.default)(depDirPath, moduleId);
  return depFilePath;
}

function generateOutputCode(code, beginning, ending) {
  const outputCode = `${beginning}${beginning ? '\n' : ''}${code}${ending}${ending ? '\n' : ''}`;
  return outputCode;
}

async function compileFile(inputFile, outputFile, {
  templateEngine = 'pug',
  beginning = '',
  ending = '',
  initialIndentLevel,
  progress = () => {}
} = {}) {
  const inputFilePath = _path2.default.resolve(process.cwd(), inputFile);
  const outputFilePath = _path2.default.resolve(process.cwd(), outputFile);
  const inputCode = await readFileAsync(inputFilePath, { encoding: 'utf8' });
  const code = await compile(inputCode, {
    inputFile: inputFilePath,
    templateEngine,
    beginning,
    ending,
    initialIndentLevel
  });
  const outputFilePathDir = _path2.default.dirname(outputFilePath);
  await (0, _makeDir2.default)(outputFilePathDir);
  await writeFileAsync(outputFilePath, code);
  const relativePath = _path2.default.join(process.cwd(), '/');
  progress(`${inputFile.replace(relativePath, '')} -> ${outputFile.replace(relativePath, '')}`);
}

async function compileDir(inputDir, outputDir, {
  templateEngine = 'pug',
  beginning = '',
  ending = '',
  initialIndentLevel,
  progress = () => {}
} = {}) {
  const inputDirPath = _path2.default.resolve(process.cwd(), inputDir);
  const outputDirPath = _path2.default.resolve(process.cwd(), outputDir);
  const globInputDirPath = _path2.default.join(inputDirPath, '/**/*.{js,jsx,mjs}');
  const filePaths = await (0, _globby2.default)(globInputDirPath);
  const extension = templateEngine === 'ejs' ? '.ejs' : '.pug';
  await Promise.all(filePaths.map(filePath => {
    const oldExtension = _path2.default.extname(filePath);
    const outputFile = filePath.replace(inputDirPath, outputDirPath).replace(oldExtension, extension);
    return compileFile(filePath, outputFile, {
      templateEngine,
      beginning,
      ending,
      initialIndentLevel,
      progress
    });
  }));
}
//# sourceMappingURL=index.js.map