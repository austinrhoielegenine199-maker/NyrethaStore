import { Router, type IRouter } from "express";
import { db, packagesTable, categoriesTable } from "@workspace/db";
import {
  ListPackagesQueryParams,
  ListPackagesResponse,
  GetPackageParams,
  GetPackageResponse,
  ListCategoriesResponse,
} from "@workspace/api-zod";
import { eq, sql, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/packages", async (req, res): Promise<void> => {
  const query = ListPackagesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let rows;
  if (query.data.category) {
    rows = await db
      .select()
      .from(packagesTable)
      .where(eq(packagesTable.categorySlug, query.data.category))
      .orderBy(packagesTable.featured, packagesTable.id);
  } else {
    rows = await db
      .select()
      .from(packagesTable)
      .orderBy(packagesTable.featured, packagesTable.id);
  }

  const parsed = rows.map((r) => ({
    ...r,
    price: parseFloat(r.price),
    salePricePercent: r.salePricePercent ?? null,
  }));

  res.json(ListPackagesResponse.parse(parsed));
});

router.get("/packages/:id", async (req, res): Promise<void> => {
  const params = GetPackageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [pkg] = await db
    .select()
    .from(packagesTable)
    .where(eq(packagesTable.id, params.data.id));

  if (!pkg) {
    res.status(404).json({ error: "Package not found" });
    return;
  }

  res.json(
    GetPackageResponse.parse({
      ...pkg,
      price: parseFloat(pkg.price),
      salePricePercent: pkg.salePricePercent ?? null,
    }),
  );
});

router.get("/categories", async (req, res): Promise<void> => {
  const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.id);

  const withCounts = await Promise.all(
    categories.map(async (cat) => {
      const [result] = await db
        .select({ cnt: count() })
        .from(packagesTable)
        .where(eq(packagesTable.categorySlug, cat.slug));
      return {
        ...cat,
        description: cat.description ?? null,
        packageCount: result?.cnt ?? 0,
      };
    }),
  );

  res.json(ListCategoriesResponse.parse(withCounts));
});

export default router;
