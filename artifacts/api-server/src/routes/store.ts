import { Router, type IRouter } from "express";
import { db, storeSettingsTable, giftcardsTable } from "@workspace/db";
import {
  GetStoreInfoResponse,
  CheckGiftcardBody,
  CheckGiftcardResponse,
} from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/store/info", async (req, res): Promise<void> => {
  const [settings] = await db.select().from(storeSettingsTable).limit(1);
  if (!settings) {
    res.json(
      GetStoreInfoResponse.parse({
        storeName: "NyrethaStore",
        description: "Welcome to the official NyrethaSMP store. Browse our packages and support the server!",
        serverIp: "play.nyrethasmp.xyz",
        discordUrl: "https://discord.gg/nyrethasmp",
        currency: "USD",
        logoUrl: null,
      }),
    );
    return;
  }
  res.json(GetStoreInfoResponse.parse(settings));
});

router.post("/giftcard/check", async (req, res): Promise<void> => {
  const parsed = CheckGiftcardBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [card] = await db
    .select()
    .from(giftcardsTable)
    .where(eq(giftcardsTable.code, parsed.data.code));

  if (!card) {
    res.status(404).json({ error: "Gift card not found" });
    return;
  }

  res.json(
    CheckGiftcardResponse.parse({
      code: card.code,
      balance: parseFloat(card.balance),
      currency: card.currency,
      valid: card.valid,
    }),
  );
});

export default router;
