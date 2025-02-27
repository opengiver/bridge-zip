# Bridge-Zip

![npm](https://img.shields.io/npm/v/bridge-zip)
![npm](https://img.shields.io/npm/dt/bridge-zip)
![npm bundle size](https://img.shields.io/bundlephobia/min/bridge-zip)
![license](https://img.shields.io/npm/l/bridge-zip)

`Bridge-Zip` is a command-line utility designed to solve compatibility issues between ZIP files created on Windows and macOS systems. It provides seamless conversion of folder names and structures to ensure proper functionality across both operating systems.

<br>

<img src="https://github.com/user-attachments/assets/fc8e4be6-420c-4139-84ed-914d6dd30c8e" width="640">

<br>

## The Problem

When creating ZIP archives on different operating systems, folder structures and encoding issues can arise:

- ZIP files created on Windows may have folder names encoded in a way that's unreadable on macOS
- ZIP files created on macOS might have folder names that appear incorrectly on Windows
- Extracting cross-platform ZIP files often results in garbled or unreadable folder names

Bridge-Zip solves these issues by providing an easy way to check and convert folder names within ZIP archives.

## Installation

```bash
# Install globally
npm install -g bridge-zip

# Or use with npx
npx bridge-zip <command>
```

## Usage

Bridge-Zip offers two main commands:

### Check ZIP Contents

Examine the folder names inside a ZIP file:

```bash
bridge-zip check example.zip
```

This will display all folder and file names contained within the archive.

### Convert ZIP File

Extract a ZIP file, rename its main folder, and recompress it:

```bash
bridge-zip convert example.zip newFolderName
```

This command:

1. Extracts the ZIP file
2. Renames the main folder to the specified name
3. Recompresses the folder into a new ZIP file

## Examples

**Checking a Windows-created ZIP file on macOS:**

```bash
bridge-zip check windows_archive.zip
# Output: Folder names inside the zip: ["Project_Files/", "Project_Files/document.docx", ...]

```

**Converting a ZIP file for cross-platform compatibility:**

```bash
bridge-zip convert macos_archive.zip ProjectFiles
# Output: Conversion complete: /path/to/macos_archive.zip
```

## Technical Details

Bridge-Zip uses:

- `Node.js` for cross-platform compatibility
- `adm-zip` for ZIP file manipulation
- `Commander.js` for the command-line interface

## License

MIT

## Author

Byungsker
