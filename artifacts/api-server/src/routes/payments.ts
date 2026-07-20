import { Router, type IRouter } from "express";
import { db, paymentsTable } from "@workspace/db";
import {
  GetRecentPaymentsQueryParams,
  GetRecentPaymentsResponse,
  GetTopDonatorResponse,
} from "@workspace/api-zod";
import { desc, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/payments/recent", async (req, res): Promise<void> => {
  const query = GetRecentPaymentsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const limit = query.data.limit ?? 10;

  const payments = await db
    .select()
    .from(paymentsTable)
    .orderBy(desc(paymentsTable.createdAt))
    .limit(limit);

  const parsed = payments.map((p) => ({
    ...p,
    amount: parseFloat(p.amount),
    avatarUrl: p.avatarUrl ?? null,
    createdAt: p.createdAt.toISOString(),
  }));

  res.json(GetRecentPaymentsResponse.parse(parsed));
});

router.get("/payments/top-donator", async (req, res): Promise<void> => {
  const [top] = await db
    .select({
      username: paymentsTable.username,
      totalAmount: sql<number>`sum(${paymentsTable.amount}::numeric)`,
      currency: paymentsTable.currency,
      avatarUrl: paymentsTable.avatarUrl,
    })
    .from(paymentsTable)
    .groupBy(paymentsTable.username, paymentsTable.currency, paymentsTable.avatarUrl)
    .orderBy(sql`sum(${paymentsTable.amount}::numeric) desc`)
    .limit(1);

  if (!top) {
    res.json(
      GetTopDonatorResponse.parse({
        username: "Your name here",
        totalAmount: 0,
        currency: "USD",
        avatarUrl: null,
      }),
    );
    return;
  }

  res.json(
    GetTopDonatorResponse.parse({
      username: top.username,
      totalAmount: Number(top.totalAmount),
      currency: top.currency,
      avatarUrl: top.avatarUrl ?? null,
    }),
  );
});

export default router;
