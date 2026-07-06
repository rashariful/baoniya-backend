import fs from "fs";
import path from "path";

const removeFromTempFolder = (fileName) => {
  const filePath = path.join(process.cwd(), "tmp", fileName);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("File is deleted.");
    }
  });
};

export default removeFromTempFolder;
