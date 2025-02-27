/**
 * Utility functions for ZIP file operations
 *
 * @module utils
 */

import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import cliProgress from "cli-progress";

/**
 * Check the contents of a ZIP file.
 * @param zipFile - The path to the ZIP file.
 * @returns An array of entry names inside the ZIP file.
 */
export const checkZipContents = (zipFile: string): string[] => {
  const zip = new AdmZip(zipFile);
  return zip.getEntries().map((entry) => entry.entryName);
};

/**
 * Unzips a ZIP file and shows a loading bar.
 * @param zipFile - The path to the ZIP file.
 * @returns The path where the files were extracted.
 */
export const unzipFile = (zipFile: string): string => {
  const resolvedZipFile = path.resolve(zipFile);
  const zip = new AdmZip(resolvedZipFile);
  const zipDir = path.dirname(resolvedZipFile);
  const extractPath = path.join(zipDir, `temp_${Date.now()}`);

  const entries = zip
    .getEntries()
    .filter((entry) => !entry.entryName.startsWith("__MACOSX") && !entry.entryName.startsWith("._"));
  const totalFiles = entries.length;

  console.log(`Extracting ZIP file: ${resolvedZipFile}`);

  const progressBar = new cliProgress.SingleBar(
    {
      format: "Unzipping [{bar}] {percentage}% | {value}/{total} files",
      stopOnComplete: true,
    },
    cliProgress.Presets.shades_classic
  );

  progressBar.start(totalFiles, 0);

  let extractedCount = 0;
  for (const entry of entries) {
    const entryPath = path.join(extractPath, entry.entryName);

    if (entry.isDirectory) {
      fs.mkdirSync(entryPath, { recursive: true });
    } else {
      fs.mkdirSync(path.dirname(entryPath), { recursive: true });
      fs.writeFileSync(entryPath, entry.getData());
    }

    extractedCount++;
    progressBar.update(extractedCount);
  }

  progressBar.update(totalFiles);
  progressBar.stop();
  console.log("✅ Extraction complete!");

  return extractPath;
};

/**
 * Rename a folder.
 * @param oldPath - The current path of the folder.
 * @param newName - The new name for the folder.
 * @returns The new path of the renamed folder.
 */
export const renameFolder = (oldPath: string, newName: string): string => {
  const parentDir = path.dirname(oldPath);
  const newPath = path.join(parentDir, newName);

  fs.renameSync(oldPath, newPath);
  console.log(`Folder renamed: ${oldPath} → ${newPath}`);
  return newPath;
};

/**
 * Compress a folder into a ZIP file and show the compression progress.
 * @param folderPath - The path of the folder to compress.
 * @param originalZipPath - The original path where the ZIP file will be saved.
 * @returns The path of the resulting compressed ZIP file.
 */
export const zipFolder = async (folderPath: string, originalZipPath: string): Promise<string> => {
  const zip = new AdmZip();
  const parentTempFolder = path.dirname(folderPath);
  const files = fs.readdirSync(folderPath);
  const totalFiles = files.length;

  console.log(`Compressing folder: ${folderPath}`);

  const progressBar = new cliProgress.SingleBar(
    {
      format: "Zipping [{bar}] {percentage}% | {value}/{total} files",
      stopOnComplete: true,
    },
    cliProgress.Presets.shades_classic
  );

  progressBar.start(totalFiles, 0);

  let compressedCount = 0;
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      zip.addLocalFolder(filePath, path.basename(folderPath));
    } else {
      zip.addLocalFile(filePath);
    }
    compressedCount++;
    progressBar.update(compressedCount);
  }

  progressBar.update(totalFiles);
  progressBar.stop();
  console.log("✅ Compression complete!");

  const { default: cliSpinners } = await import("cli-spinners");
  const spinner = cliSpinners.dots;
  let frameIndex = 0;

  process.stdout.write("Finalizing... ");

  const spinnerInterval = setInterval(() => {
    process.stdout.write(`\rFinalizing... ${spinner.frames[frameIndex]}`);
    frameIndex = (frameIndex + 1) % spinner.frames.length;
  }, spinner.interval);

  const zipDir = path.dirname(originalZipPath);
  const outputZip = path.join(zipDir, `${path.basename(folderPath)}.zip`);

  await new Promise<void>((resolve) => {
    zip.writeZipPromise(outputZip).then(() => {
      clearInterval(spinnerInterval);
      process.stdout.write("\r✅ Finalization complete!\n");
      resolve();
    });
  });

  fs.rmSync(folderPath, { recursive: true, force: true });
  if (parentTempFolder.includes("temp_")) {
    fs.rmSync(parentTempFolder, { recursive: true, force: true });
  }

  return outputZip;
};
