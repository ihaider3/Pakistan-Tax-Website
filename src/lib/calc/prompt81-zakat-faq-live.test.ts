import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { calculatorPages } from "@/content/pages";

const rootDir = path.resolve(__dirname, "../../..");

describe("Zakat FAQs never hardcode gold or silver rupee rates", () => {
  const zakatPageSrc = fs.readFileSync(
    path.join(rootDir, "src/app/zakat-calculator/page.tsx"),
    "utf8"
  );
  const pagesSrc = fs.readFileSync(
    path.join(rootDir, "src/content/pages.ts"),
    "utf8"
  );

  it("contains zero hardcoded gold/silver rupee prices in Zakat page or pages.ts", () => {
    const staleRateLiterals = [
      "363,177",
      "363177",
      "366,778",
      "366,958",
      "369,",
      "4,091",
      "214,812",
      "379,907",
      "391,500",
    ];
    for (const lit of staleRateLiterals) {
      expect(zakatPageSrc, `zakat/page.tsx must not hardcode ${lit}`).not.toContain(lit);
      expect(pagesSrc, `pages.ts must not hardcode ${lit}`).not.toContain(lit);
    }
    expect(calculatorPages.zakat.faqs.every((f) => !/363|366|369|379|391|4,091|214,812/.test(f.answer))).toBe(true);
  });

  it("wires all dynamic gold/silver FAQs from rates.goldPerTolaPKR and silverRateNum", () => {
    expect(zakatPageSrc).toContain("const liveGoldRate = rates.goldPerTolaPKR > 0 ? rates.goldPerTolaPKR : goldRateNum");
    expect(zakatPageSrc).toContain("What is the 24k gold rate in Pakistan today?");
    expect(zakatPageSrc).toContain("How much Zakat is due on 1 tola of gold in Pakistan?");
    expect(zakatPageSrc).toContain("How much Zakat on 10 tola gold is due in Pakistan?");
    expect(zakatPageSrc).toContain("How much Zakat is due on silver in Pakistan?");
  });

  it("surfaces offline/updating last-saved-rate status note when live rate is not yet loaded", () => {
    expect(zakatPageSrc).toContain("faqRateStatusNote");
    expect(zakatPageSrc).toContain("Showing last saved rate from");
    expect(zakatPageSrc).toContain("live rate is updating");
    expect(zakatPageSrc).toContain("taaza live rate update ho raha hai");
  });
});
