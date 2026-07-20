import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storeRouter from "./store";
import serverRouter from "./server";
import packagesRouter from "./packages";
import cartRouter from "./cart";
import paymentsRouter from "./payments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storeRouter);
router.use(serverRouter);
router.use(packagesRouter);
router.use(cartRouter);
router.use(paymentsRouter);

export default router;
