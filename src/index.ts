#!/usr/bin/env node

/**
 * Bridge Zip - Windows/macOS ZIP compatibility tool
 * Command-line interface for managing ZIP files across platforms
 *
 * @module index
 */
import { Command } from "commander";
import { checkZipContents, unzipFile, renameFolder, zipFolder } from "./utils";
import packageJson from "../package.json";

const program = new Command();

program
  .name("bridge-zip")
  .description("Bridge Zip - Windows/macOS ZIP compatibility tool")
  .version(packageJson.version, "-v, --version");

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

/**
 * Command to check the version of the tool
 */
program
  .command("version")
  .alias("v")
  .description("Display the current version of the tool")
  .action(() => {
    console.log("Current version:", program.version());
  });

program.parse(process.argv);

if (process.argv.includes("-v") || process.argv.includes("--version")) {
  console.log("Current version:", program.version());
  process.exit(0);
}
