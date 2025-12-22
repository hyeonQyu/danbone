const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const RESULT_FILE_NAME = 'index.ts';
const PUBLIC_DIR_NAME = 'public';

const publicDir = path.join(__dirname, '..', PUBLIC_DIR_NAME);
const outputFile = path.join(publicDir, RESULT_FILE_NAME);

const toCamelCase = (str) => {
  const nameWithoutExtension = str.replace(/\.[^/.]+$/, '');
  const words = nameWithoutExtension.split(/[-_\s.]+/);

  const formatWord = (word, index) => {
    if (index === 0) {
      return word.toLowerCase();
    }
    return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;
  };

  return words.map(formatWord).join('');
};

const buildResourceTree = (dir, basePath = '') => {
  const items = fs.readdirSync(dir);

  const result = items.reduce((acc, item) => {
    if (item === RESULT_FILE_NAME) {
      return acc;
    }

    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    const camelCaseName = toCamelCase(item);

    if (stat.isDirectory()) {
      const subTree = buildResourceTree(fullPath, path.join(basePath, item));
      if (Object.keys(subTree).length > 0) {
        acc[camelCaseName] = subTree;
      }
    } else {
      const relativePath = path.join(basePath, item).replace(/\\/g, '/');
      acc[camelCaseName] = `/${relativePath}`;
    }

    return acc;
  }, {});

  return result;
};

const formatContent = async (content) => {
  const prettierConfig = await prettier.resolveConfig(outputFile);

  return prettier.format(content, {
    ...prettierConfig,
    parser: 'typescript',
  });
};

const generateResources = async () => {
  console.log('📁 Public 폴더 읽는 중...');
  console.log(`경로: ${publicDir}\n`);

  const resources = buildResourceTree(publicDir);
  const rawContent = `export const RESOURCES = ${JSON.stringify(resources, null, 2)} as const;`;
  const fileContent = await formatContent(rawContent);

  fs.writeFileSync(outputFile, fileContent, 'utf-8');

  console.log('✅ RESOURCES 객체 생성 완료!');
  console.log(`📝 파일: ${outputFile}\n`);
};

(async () => {
  try {
    await generateResources();
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
})();
