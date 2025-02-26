/**
 * Utility functions for ZIP file operations
 *
 * @module utils
 */
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";

/**
 * Checks the contents of a ZIP file
 *
 * @param {string} zipFile - Path to the ZIP file
 * @returns {string[]} Array of entry names in the ZIP file
 */
export const checkZipContents = (zipFile: string): string[] => {
  const zip = new AdmZip(zipFile);
  return zip.getEntries().map((entry) => entry.entryName);
};

/**
 * Extracts a ZIP file to a temporary directory
 * Handles macOS specific files and detects single-folder archives
 *
 * @param {string} zipFile - Path to the ZIP file
 * @returns {string} Path to the extracted content
 */
export const unzipFile = (zipFile: string): string => {
  const zip = new AdmZip(zipFile);
  const zipDir = path.dirname(zipFile);
  const extractPath = path.join(zipDir, `temp_${Date.now()}`);

  zip.extractAllTo(extractPath, true);

  // Remove macOS specific directory if exists
  const macosxPath = path.join(extractPath, "__MACOSX");
  if (fs.existsSync(macosxPath)) {
    fs.rmSync(macosxPath, { recursive: true, force: true });
  }

  // Return path to single folder if archive contains only one directory
  const extractedItems = fs.readdirSync(extractPath);
  let extractedPath = extractPath;

  if (extractedItems.length === 1) {
    const singleFolder = path.join(extractPath, extractedItems[0]);
    if (fs.statSync(singleFolder).isDirectory()) {
      extractedPath = singleFolder;
    }
  }

  return extractedPath;
};

/**
 * Renames a folder to a new name
 *
 * @param {string} oldPath - Current path of the folder
 * @param {string} newName - New name for the folder
 * @returns {string} Path to the renamed folder
 */
export const renameFolder = (oldPath: string, newName: string): string => {
  const parentDir = path.dirname(oldPath);
  const newPath = path.join(parentDir, newName);

  fs.renameSync(oldPath, newPath);
  console.log(`Folder renamed: ${oldPath} → ${newPath}`);
  return newPath;
};

/**
 * Compresses a folder into a ZIP file
 * Adds files directly to the root of the ZIP (without parent folder)
 * Cleans up temporary folders after compression
 *
 * @param {string} folderPath - Path to the folder to compress
 * @param {string} originalZipPath - Path to the original ZIP file
 * @returns {string} Path to the newly created ZIP file
 */
export const zipFolder = (folderPath: string, originalZipPath: string): string => {
  const zip = new AdmZip();
  const parentTempFolder = path.dirname(folderPath);

  // Add internal files only (without parent folder)
  fs.readdirSync(folderPath).forEach((file) => {
    const filePath = path.join(folderPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      zip.addLocalFolder(filePath, file);
    } else {
      zip.addLocalFile(filePath);
    }
  });

  const zipDir = path.dirname(originalZipPath);
  const outputZip = path.join(zipDir, `${path.basename(folderPath)}.zip`);

  zip.writeZip(outputZip);

  // Clean up - remove the renamed folder
  fs.rmSync(folderPath, { recursive: true, force: true });

  // Clean up - remove the temporary parent folder if it exists
  if (parentTempFolder.includes("temp_")) {
    fs.rmSync(parentTempFolder, { recursive: true, force: true });
  }

  return outputZip;
};
