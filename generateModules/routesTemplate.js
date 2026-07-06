const routesTemplate = `
import express from "express";

import {
  {{uppercaseFileName}}Controllers,
} from "./{{lowercaseFileName}}.controller.js";

const router = express.Router();

router.post("/", 
{{uppercaseFileName}}Controllers.create{{uppercaseFileName}});
router.get("/", 
{{uppercaseFileName}}Controllers.getAll{{uppercaseFileName}});
router.get("/:id", 
{{uppercaseFileName}}Controllers.getSingle{{uppercaseFileName}});
router.patch("/:id", 
{{uppercaseFileName}}Controllers.update{{uppercaseFileName}});
router.delete("/:id", 
{{uppercaseFileName}}Controllers.delete{{uppercaseFileName}});

export const {{uppercaseFileName}}Routes = router;
`;

export default routesTemplate;
