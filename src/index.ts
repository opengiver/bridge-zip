/**
 * Bridge Zip - Windows/macOS ZIP compatibility tool
 * Command-line interface for managing ZIP files across platforms
 *
 * @module index
 */
import { Command } from "commander";
import { checkZipContents, unzipFile, renameFolder, zipFolder } from "./utils";

const program = new Command();

program.name("bridge-zip").description("Bridge Zip - Windows/macOS ZIP compatibility tool").version("1.0.0");

/**
 * Command to check the contents of a ZIP file
 */
program
  .command("check <zipFile>")
  .description("Check folder names inside the ZIP file")
  .action(async (zipFile) => {
    const contents = await checkZipContents(zipFile);
    console.log("Internal folder names:", contents);
  });

/**
 * Command to convert a ZIP file by extracting it,
 * renaming the internal folder, and compressing it again
 */
program
  .command("convert <zipFile> <newFolderName>")
  .description("Extract ZIP file, rename internal folder, and compress again")
  .action(async (zipFile, newFolderName) => {
    const extractedPath = await unzipFile(zipFile);
    const renamedPath = await renameFolder(extractedPath, newFolderName);
    const newZipFile = await zipFolder(renamedPath, zipFile);
    console.log("Conversion completed:", newZipFile);
  });

program.parse(process.argv);
