import { it } from "vitest";
it("p", async () => {
  setTimeout(() => {
    throw new Error("PLANT-timer");
  }, 0);
  await new Promise((resolve) => setTimeout(resolve, 50));
});
