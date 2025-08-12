import fs from 'fs';
import path from 'path';

const folderPath = './public';
const relativeFolderPath = path.relative(process.cwd(), folderPath);

export function useAssets() {
  const files = fs
    .readdirSync(folderPath)
    //.filter((file) => file.match(/.*\.(jpg|png?)/gi));

  const filesPaths = files.map(
    (fileName) => `/_nuxt/${relativeFolderPath}/${fileName}`
  );

  return useState("test-files", ()=>filesPaths);
}