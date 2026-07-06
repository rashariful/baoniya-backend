import removeFromTempFolder from "../../utils/removeFromTempFolder.js";
import XLSX from "xlsx";

const xlToJson = async (file) => {
  const workbook = XLSX.readFile(file.path);

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("No sheets found in the Excel file");
  }

  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    defval: "",
    range: 1,
  });

  // Save JSON data to the database
  // const savedData = await XlToJsonData.insertMany(jsonData);

  // Remove the file from the temp folder
  removeFromTempFolder(file.filename);

  return savedData;
};

export const XlToJsonService = {
  xlToJson,
};
