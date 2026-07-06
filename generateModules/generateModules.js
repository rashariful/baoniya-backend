import fs from "fs";
import path from "path";
import controllerTemplate from "./controllerTemplate.js";
import serviceTemplate from "./serviceTemplate.js";
import routesTemplate from "./routesTemplate.js";
import modelTemplate from "./modelTemplate.js";

if (process.argv.length < 3) {
  console.error("Usage: node generateFiles.js <lowercaseFileName>");
  process.exit(1);
}

// Get file name from command-line argument
const lowercaseFileName = process.argv[2];

// Convert the lowercase file name to uppercase folder name
const uppercaseFileName = lowercaseFileName.charAt(0).toUpperCase() + lowercaseFileName.slice(1);

// Define the target directory
const moduleDirectory = path.join(process.cwd(), "src", "app", "modules", lowercaseFileName);

// Create the target directory
fs.mkdirSync(moduleDirectory, { recursive: true });

// Function to replace placeholders in the template
const replacePlaceholders = (template) => {
  return template
    .replace(/{{lowercaseFileName}}/g, lowercaseFileName)
    .replace(/{{uppercaseFileName}}/g, uppercaseFileName);
};
// Write the processed templates to files
fs.writeFileSync(
  path.join(moduleDirectory, `${lowercaseFileName}.controller.js`),
  replacePlaceholders(controllerTemplate)
);
fs.writeFileSync(path.join(moduleDirectory, `${lowercaseFileName}.service.js`), replacePlaceholders(serviceTemplate));
fs.writeFileSync(path.join(moduleDirectory, `${lowercaseFileName}.routes.js`), replacePlaceholders(routesTemplate));
fs.writeFileSync(path.join(moduleDirectory, `${lowercaseFileName}.model.js`), replacePlaceholders(modelTemplate));

// console.log(
//   `Module ${uppercaseFileName} with files ${lowercaseFileName}.controller.js, ${lowercaseFileName}.service.js, ${lowercaseFileName}.routes.js, and ${lowercaseFileName}.model.js has been created.`
// );
