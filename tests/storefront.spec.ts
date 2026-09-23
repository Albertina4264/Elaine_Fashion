import { expect, test } from "@playwright/test";

test("accueil présente la boutique et la navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Chaque détail compte." })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Principal" })).toContainText("Shop");
  await page.getByRole("link", { name: "voir plus" }).first().click();
  await expect(page).toHaveURL(/shop/);
  await expect(page.getByRole("heading", { name: "Shop" })).toBeVisible();
});

test("fiche produit et cesta", async ({ page }) => {
  await page.goto("/produit/chemisier-plisse");
  await expect(page.getByRole("heading", { name: "Chemisier plissé" })).toBeVisible();
  await expect(page.getByText("CFA 9")).toBeVisible();
  await page.getByRole("button", { name: "Ajouter", exact: true }).click();
  await expect(page.getByTestId("cart-drawer")).toBeVisible();
  await page.getByRole("link", { name: "Voir le panier" }).click();
  await expect(page).toHaveURL(/cesta/);
  await expect(page.getByText("Chemisier plissé")).toBeVisible();
});
