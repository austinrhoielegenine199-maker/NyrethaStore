import { Router, type IRouter } from "express";
import { GetServerStatusResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/server/status", async (req, res): Promise<void> => {
  // Returns a static status; can be wired to a real Minecraft API later
  res.json(
    GetServerStatusResponse.parse({
      online: true,
      playerCount: 0,
      maxPlayers: 100,
      version: "1.21",
    }),
  );
});

export default router;
