import { Router } from "express";
import { fetchAvailableActions } from "../controller/action.controller";

const router = Router();

router.get("/available", fetchAvailableActions);

export const actionRouter = router;