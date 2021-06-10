import { Router } from "express";

import * as taskController from "../controllers/tasks.controller";

const router = Router();

router.post("/", taskController.create);

router.get("/", taskController.findAll);

router.get("/done", taskController.findAllDone);

router.get("/:id", taskController.findById);

router.put("/:id", taskController.update);

router.delete("/:id", taskController.remove);

export default router;
