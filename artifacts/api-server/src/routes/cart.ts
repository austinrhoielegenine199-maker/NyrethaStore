import { Router, type IRouter } from "express";
import { db, cartItemsTable, packagesTable } from "@workspace/db";
import {
  AddToCartBody,
  GetCartResponse,
  AddToCartResponse,
  ClearCartResponse,
  RemoveFromCartParams,
  RemoveFromCartResponse,
} from "@workspace/api-zod";
import { eq, and } from "drizzle-orm";

const SESSION_ID = "default-session"; // Single-session cart for demo

async function buildCart(sessionId: string) {
  const items = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.sessionId, sessionId));

  const mapped = items.map((i) => ({
    packageId: i.packageId,
    packageName: i.packageName,
    price: parseFloat(i.price),
    currency: i.currency,
    quantity: i.quantity,
    imageUrl: i.imageUrl ?? null,
  }));

  const total = mapped.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = mapped.reduce((sum, i) => sum + i.quantity, 0);
  const currency = mapped[0]?.currency ?? "USD";

  return { items: mapped, total, currency, itemCount };
}

const router: IRouter = Router();

router.get("/cart", async (req, res): Promise<void> => {
  const cart = await buildCart(SESSION_ID);
  res.json(GetCartResponse.parse(cart));
});

router.post("/cart", async (req, res): Promise<void> => {
  const parsed = AddToCartBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [pkg] = await db
    .select()
    .from(packagesTable)
    .where(eq(packagesTable.id, parsed.data.packageId));

  if (!pkg) {
    res.status(404).json({ error: "Package not found" });
    return;
  }

  // Check if already in cart
  const [existing] = await db
    .select()
    .from(cartItemsTable)
    .where(
      and(
        eq(cartItemsTable.sessionId, SESSION_ID),
        eq(cartItemsTable.packageId, parsed.data.packageId),
      ),
    );

  if (existing) {
    await db
      .update(cartItemsTable)
      .set({ quantity: existing.quantity + parsed.data.quantity })
      .where(eq(cartItemsTable.id, existing.id));
  } else {
    await db.insert(cartItemsTable).values({
      sessionId: SESSION_ID,
      packageId: pkg.id,
      packageName: pkg.name,
      price: pkg.price,
      currency: pkg.currency,
      quantity: parsed.data.quantity,
      imageUrl: pkg.imageUrl ?? null,
    });
  }

  const cart = await buildCart(SESSION_ID);
  res.json(AddToCartResponse.parse(cart));
});

router.delete("/cart", async (req, res): Promise<void> => {
  await db
    .delete(cartItemsTable)
    .where(eq(cartItemsTable.sessionId, SESSION_ID));

  const cart = await buildCart(SESSION_ID);
  res.json(ClearCartResponse.parse(cart));
});

router.delete("/cart/:packageId", async (req, res): Promise<void> => {
  const params = RemoveFromCartParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db
    .delete(cartItemsTable)
    .where(
      and(
        eq(cartItemsTable.sessionId, SESSION_ID),
        eq(cartItemsTable.packageId, params.data.packageId),
      ),
    );

  const cart = await buildCart(SESSION_ID);
  res.json(RemoveFromCartResponse.parse(cart));
});

export default router;
