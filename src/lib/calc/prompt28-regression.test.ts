import { describe, it, expect } from "vitest";
import { siteConfig } from "@/content/pages";
import { DEFAULT_SITE_CONTENT } from "@/lib/content/defaultContent";
import { calculateSalaryTax } from "@/lib/calc/salary";
import fs from "fs";
import path from "path";

describe("Prompt 28 — Copyright Notice Strengthen Regression Tests", () => {
  const EXPECTED_FOOTER_COPYRIGHT =
    "© 2026 CalculationHub. All rights reserved. Content, design and text on this website may not be copied, reproduced or republished without written permission.";

  it("Test 1: Footer copyright line has exact strengthened text", () => {
    const footerConfig = DEFAULT_SITE_CONTENT.find(
      (c) => c.key === "footer_copyright"
    );
    expect(footerConfig?.defaultValue).toBe(EXPECTED_FOOTER_COPYRIGHT);

    // Also check dynamic formulation with siteConfig
    const dynamicCopyright = `© ${siteConfig.copyrightYear} ${siteConfig.brandName}. All rights reserved. Content, design and text on this website may not be copied, reproduced or republished without written permission.`;
    expect(dynamicCopyright).toBe(EXPECTED_FOOTER_COPYRIGHT);
  });

  it("Test 2: All 6 calculators share Footer with the same copyright notice", () => {
    const footerFilePath = path.join(process.cwd(), "src/components/Footer.tsx");
    const footerContent = fs.readFileSync(footerFilePath, "utf-8");
    expect(footerContent).toContain("Content, design and text on this website may not be copied, reproduced or republished without written permission.");
  });

  it("Test 3: Disclaimer page contains exact English Copyright section", () => {
    const disclaimerPath = path.join(process.cwd(), "src/app/disclaimer/page.tsx");
    const disclaimerContent = fs.readFileSync(disclaimerPath, "utf-8");

    expect(disclaimerContent).toContain("4. Copyright");
    expect(disclaimerContent).toContain(
      "All content on this website — including text, explanations, design, layout, logo and code — is the property of CalculationHub and is protected by copyright law. It may not be copied, reproduced, republished or distributed, in whole or in part, without written permission from CalculationHub."
    );
    expect(disclaimerContent).toContain(
      "Public facts and formulas — such as government tax slabs, Zakat rates and Ushr rules — are public information and are not claimed as our property. Anyone may build their own calculator using the same public rules, but they may not copy our text, design or code."
    );
    expect(disclaimerContent).toContain(
      "If you find our content copied on another website, please report it to us at"
    );
    expect(disclaimerContent).toContain("mailto:contact@calculationhubs.com");
  });

  it("Test 4: Disclaimer page contains Roman Urdu translation", () => {
    const disclaimerPath = path.join(process.cwd(), "src/app/disclaimer/page.tsx");
    const disclaimerContent = fs.readFileSync(disclaimerPath, "utf-8");

    expect(disclaimerContent).toContain("Roman Urdu:");
    expect(disclaimerContent).toContain(
      "Is website ka tamam content — text, wazahat, design, layout, logo aur code — CalculationHub ki milkiyat hai aur copyright qanoon ke tehet mehfooz hai. Ise CalculationHub ki likhi hui ijazat ke baghair copy, dobara shaya ya taqseem nahi kiya ja sakta."
    );
    expect(disclaimerContent).toContain(
      "Sarkari tax slabs, Zakat aur Ushr ke usool aam maloomat hain — in par hamara daawa nahi hai; koi bhi inhi usool par apna calculator bana sakta hai, lekin hamara text, design ya code copy nahi kar sakta."
    );
    expect(disclaimerContent).toContain("par report karein.");
  });

  it("Test 5: Email is contact@calculationhubs.com and pakfinancecalc.org is absent across source", () => {
    const disclaimerPath = path.join(process.cwd(), "src/app/disclaimer/page.tsx");
    const disclaimerContent = fs.readFileSync(disclaimerPath, "utf-8");
    expect(disclaimerContent).toContain("contact@calculationhubs.com");
    expect(disclaimerContent).not.toContain("pakfinancecalc.org");

    const footerPath = path.join(process.cwd(), "src/components/Footer.tsx");
    const footerContent = fs.readFileSync(footerPath, "utf-8");
    expect(footerContent).toContain("contact@calculationhubs.com");
    expect(footerContent).not.toContain("pakfinancecalc.org");
  });

  it("Test 6: No right-click block or text-select prevention scripts exist", () => {
    const layoutPath = path.join(process.cwd(), "src/app/layout.tsx");
    const layoutContent = fs.readFileSync(layoutPath, "utf-8");
    expect(layoutContent).not.toContain("onContextMenu");
    expect(layoutContent).not.toContain("contextmenu");
    expect(layoutContent).not.toContain("selectstart");
    expect(layoutContent).not.toContain("user-select: none");
  });

  it("Test 7: Salary calculation unaltered (150,000 monthly -> tax Rs 6,000, take-home Rs 144,000)", () => {
    const result = calculateSalaryTax(150000, "monthly", "2026-27");
    expect(result.monthlyTax).toBe(6000);
    expect(result.monthlyTakeHome).toBe(144000);
    expect(result.annualTax).toBe(72000);
  });
});
