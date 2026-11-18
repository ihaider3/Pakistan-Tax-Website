import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Prompt 34 — Methodology Page Ushr Section", () => {
  const methodologyClientPath = path.join(
    process.cwd(),
    "src/app/methodology/MethodologyClient.tsx"
  );
  const methodologyPagePath = path.join(
    process.cwd(),
    "src/app/methodology/page.tsx"
  );

  const clientContent = fs.readFileSync(methodologyClientPath, "utf-8");
  const pageContent = fs.readFileSync(methodologyPagePath, "utf-8");

  it("includes all 6 calculator sections in Methodology", () => {
    expect(clientContent).toContain("1. Salary Tax Calculator (Section 149)");
    expect(clientContent).toContain("2. Complete Zakat Calculator");
    expect(clientContent).toContain("3. Property Advance Tax (236C &amp; 236K)");
    expect(clientContent).toContain("4. General Sales Tax (GST)");
    expect(clientContent).toContain("5. Fitrana (Sadqat-ul-Fitr)");
    expect(clientContent).toContain("6. Ushr Calculator");
  });

  it("has Section 6 with exact required English texts and link", () => {
    expect(clientContent).toContain("Rain, river or spring water (natural irrigation): <strong>10%</strong> of the produce");
    expect(clientContent).toContain("Tube-well or drawn water (artificial irrigation): <strong>5%</strong> of the produce");
    expect(clientContent).toContain("Mixed irrigation: <strong>7.5%</strong> if both sources are used equally; otherwise the rate of the dominant source applies");
    expect(clientContent).toContain("Due at harvest — no Hawl (one lunar year) is required");
    expect(clientContent).toContain("No deduction for cultivation costs");
    expect(clientContent).toContain("1 maund = 40 kg");
    expect(clientContent).toContain("Note: the majority view applies a nisab of 5 wasq (about 653 kg, about 16.3 maund) to storable staple crops only. This calculator uses the Hanafi default (no nisab).");
    expect(clientContent).toContain("Sources: Quran 6:141; Sahih al-Bukhari 1483");
    expect(clientContent).toContain('href="/ushr-calculator"');
    expect(clientContent).toContain("Try it: Ushr Calculator &rarr;");
  });

  it("has Section 6 with exact required Roman Urdu texts", () => {
    expect(clientContent).toContain("Baarish, darya ya chashme ka paani (qudrati aabpashi): fasal ka <strong>10%</strong>");
    expect(clientContent).toContain("Tube-well ya khincha hua paani (masnooi aabpashi): fasal ka <strong>5%</strong>");
    expect(clientContent).toContain("Mili-juli aabpashi: dono barabar hon to <strong>7.5%</strong>; warna jis zariye ka paani zyada ho, us ki sharah lagegi");
    expect(clientContent).toContain("Fasal katne par wajib — Hawl (aik saal guzarna) ki shart nahi");
    expect(clientContent).toContain("Kasht ke kharch ki koi katauti nahi");
    expect(clientContent).toContain("Note: aksariyat ke nazdeek zakheera karne wali buniyadi faslon par 5 wasq (taqreeban 653 kg, taqreeban 16.3 maund) ka nisab hai. Ye calculator Hanafi default (koi nisab nahi) use karta hai.");
    expect(clientContent).toContain("Hawale: Quran 6:141; Sahih al-Bukhari 1483");
  });

  it("includes the Section 6 pointer in Section 2 Zakat excluded items", () => {
    expect(clientContent).toContain("Agricultural Ushr (5%–10% — {isRoman ? \"alag se Section 6 mein diya gaya hai\" : \"covered separately in Section 6 below\"})");
  });

  it("updates page metadata description to include Ushr", () => {
    expect(pageContent).toContain("agricultural Ushr");
  });
});

