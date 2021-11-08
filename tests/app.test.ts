import { test, expect } from "@playwright/test";

test("forward navigation", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.click("text=METRO Blue Line");
  await expect(page).toHaveURL("http://localhost:3000/901");

  await page.click("text=Northbound");
  await expect(page).toHaveURL("http://localhost:3000/901/0");

  await page.click("text=American Blvd Station");
  await expect(page).toHaveURL("http://localhost:3000/901/0/AM34");
});

test("back navigation", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.click("text=METRO Blue Line");
  await expect(page).toHaveURL("http://localhost:3000/901");

  await page.goBack();
  await expect(page).toHaveURL("http://localhost:3000/");
});

test("direct link should load stop info", async ({ page }) => {
  await page.goto("http://localhost:3000/901/0/AM34");

  const header = await page.textContent("h2");
  expect(header).toBe("American Blvd 34th Ave Station");
});
