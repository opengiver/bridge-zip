import { Command } from "commander";
import { checkZipContents, unzipFile, renameFolder, zipFolder } from "./utils";

const program = new Command();

program
  .name("bridge-zip")
  .description("Bridge Zip (브릿집) - Windows/macOS ZIP 호환 도구")
  .version("1.0.0");

program
  .command("check <zipFile>")
  .description("압축 파일 내부의 폴더명을 확인")
  .action(async (zipFile) => {
    const contents = await checkZipContents(zipFile);
    console.log("압축 내부 폴더명:", contents);
  });

program
  .command("convert <zipFile> <newFolderName>")
  .description("ZIP 파일을 풀고 내부 폴더명을 변경 후 다시 압축")
  .action(async (zipFile, newFolderName) => {
    const extractedPath = await unzipFile(zipFile);
    const renamedPath = await renameFolder(extractedPath, newFolderName);
    const newZipFile = await zipFolder(renamedPath, zipFile);
    console.log("변환 완료:", newZipFile);
  });

program.parse(process.argv);
