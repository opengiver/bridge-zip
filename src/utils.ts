import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";

export const checkZipContents = (zipFile: string): string[] => {
  const zip = new AdmZip(zipFile);
  return zip.getEntries().map((entry) => entry.entryName);
};

export const unzipFile = (zipFile: string): string => {
  const zip = new AdmZip(zipFile);
  const extractPath = path.join(process.cwd(), path.basename(zipFile, ".zip"));
  zip.extractAllTo(extractPath, true);
  return extractPath;
};

export const renameFolder = (oldPath: string, newName: string): string => {
  const newPath = path.join(path.dirname(oldPath), newName);
  fs.renameSync(oldPath, newPath);
  return newPath;
};

export const zipFolder = (folderPath: string, outputZip: string): string => {
  const zip = new AdmZip();
  zip.addLocalFolder(folderPath);
  const newZipPath = path.join(process.cwd(), outputZip);
  zip.writeZip(newZipPath);
  return newZipPath;
};
