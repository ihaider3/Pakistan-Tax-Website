import { describe, it, expect } from "vitest";
import { calculateSalaryTax } from "./salary";
import { calculateZakat } from "./zakat";
import { calculatePropertyTax } from "./property";
import { calculateGst } from "./gst";
import { calculateFitrana } from "./fitrana";
import { formatRupees } from "./money";
import { calculatorPages } from "../../content/pages";

describe("Language Toggle & 21 Regression Numbers Audit", () => {
  it("Salary Tax regression: 150,000/mo -> 6,000 tax, 144,000 take-home", () => {
    const res = calculateSalaryTax(150000, "monthly", "2026-27");
    expect(res.monthlyTax).toBe(6000);
    expect(res.annualTax).toBe(72000);
    expect(res.monthlyTakeHome).toBe(144000);

    // Verify explanation templates
    const roman = `Aap ne mahana tankhwah Rs ${formatRupees(res.monthlySalary, { prefix: false })} likhi. Is se salana tankhwah Rs ${formatRupees(res.annualSalary, { prefix: false })} banti hai. Tax Year 2026–27 ke slab ${res.appliedSlabIndex} ke mutabiq: ${res.appliedSlabDescription}. Kul salana tax Rs ${formatRupees(res.annualTax, { prefix: false })} banta hai, jo mahana Rs ${formatRupees(res.monthlyTax, { prefix: false })} hota hai. Is tarah aapki take-home tankhwah Rs ${formatRupees(res.monthlyTakeHome, { prefix: false })} mahana banti hai.`;
    const english = `You entered a monthly salary of Rs ${formatRupees(res.monthlySalary, { prefix: false })}. That makes an annual salary of Rs ${formatRupees(res.annualSalary, { prefix: false })}. Under Tax Year 2026–27 slab ${res.appliedSlabIndex}: ${res.appliedSlabDescription}. Total annual tax is Rs ${formatRupees(res.annualTax, { prefix: false })}, which is Rs ${formatRupees(res.monthlyTax, { prefix: false })} per month. Your take-home salary is therefore Rs ${formatRupees(res.monthlyTakeHome, { prefix: false })} per month.`;

    expect(roman).toContain("Rs 150,000");
    expect(roman).toContain("Rs 1,800,000");
    expect(roman).toContain("Rs 72,000");
    expect(roman).toContain("Rs 6,000");
    expect(roman).toContain("Rs 144,000");

    expect(english).toContain("Rs 150,000");
    expect(english).toContain("Rs 1,800,000");
    expect(english).toContain("Rs 72,000");
    expect(english).toContain("Rs 6,000");
    expect(english).toContain("Rs 144,000");
  });

  it("Zakat regression: standard test inputs -> 30,000 zakat", () => {
    const res = calculateZakat({
      cashInHand: 500000,
      bankSavings: 0,
      goldQuantity: 2,
      goldUnit: "tola",
      goldRatePerTola: 400000,
      silverQuantity: 0,
      silverUnit: "tola",
      silverRatePerTola: 5500,
      businessStock: 0,
      financialInvestments: 0,
      debtsToDeduct: 100000,
      alreadyPaid: 0,
    });

    expect(res.totalGrossWealth).toBe(1300000);
    expect(res.totalDebts).toBe(100000);
    expect(res.netZakatableWealth).toBe(1200000);
    expect(res.nisabThreshold).toBe(288750);
    expect(res.zakatDue).toBe(30000);
    expect(res.remainingDue).toBe(30000);

    // Verify explanation templates
    const isAbove = res.nisabThreshold > 0 && res.netZakatableWealth >= res.nisabThreshold;
    const roman = `Aapke kul zakatable assets Rs ${formatRupees(res.totalGrossWealth, { prefix: false })} hain. Aapki eligible deductions (qarz) Rs ${formatRupees(res.totalDebts, { prefix: false })} hain. Is tarah aapki net zakatable wealth Rs ${formatRupees(res.netZakatableWealth, { prefix: false })} banti hai. Nisab (chandi, 52.5 tola) aaj ke rate par Rs ${formatRupees(res.nisabThreshold, { prefix: false })} hai. ${isAbove ? "Aapki wealth nisab se zyada hai, is liye Zakat farz hai." : "Aapki wealth nisab se kam hai, is liye is waqt Zakat farz nahi hai."} 2.5% ke hisab se aapki Zakat Rs ${formatRupees(res.zakatDue, { prefix: false })} banti hai.`;
    const english = `Your total zakatable assets are Rs ${formatRupees(res.totalGrossWealth, { prefix: false })}. Your eligible deductions (debts) are Rs ${formatRupees(res.totalDebts, { prefix: false })}, giving net zakatable wealth of Rs ${formatRupees(res.netZakatableWealth, { prefix: false })}. The nisab (silver, 52.5 tola) at today's rate is Rs ${formatRupees(res.nisabThreshold, { prefix: false })}. ${isAbove ? "Your wealth is above the nisab, so Zakat is due." : "Your wealth is below the nisab, so no Zakat is due right now."} At 2.5%, your Zakat due is Rs ${formatRupees(res.zakatDue, { prefix: false })}.`;

    expect(roman).toContain("Rs 1,300,000");
    expect(roman).toContain("Rs 100,000");
    expect(roman).toContain("Rs 1,200,000");
    expect(roman).toContain("Rs 288,750");
    expect(roman).toContain("Rs 30,000");
    expect(roman).toContain("Aapki wealth nisab se zyada hai, is liye Zakat farz hai.");

    expect(english).toContain("Rs 1,300,000");
    expect(english).toContain("Rs 100,000");
    expect(english).toContain("Rs 1,200,000");
    expect(english).toContain("Rs 288,750");
    expect(english).toContain("Rs 30,000");
    expect(english).toContain("Your wealth is above the nisab, so Zakat is due.");
  });

  it("Property Tax regression: 10,000,000 buy filer 125,000 / sell filer 275,000", () => {
    const buyRes = calculatePropertyTax(10000000, "buy", "filer");
    expect(buyRes.taxAmount).toBe(125000);
    expect(buyRes.oppositeFilerTax).toBe(1050000);
    expect(buyRes.savingsVsNonFiler).toBe(925000);

    const sellRes = calculatePropertyTax(10000000, "sell", "filer");
    expect(sellRes.taxAmount).toBe(275000);
    expect(sellRes.oppositeFilerTax).toBe(1150000);
    expect(sellRes.savingsVsNonFiler).toBe(875000);
  });

  it("GST regression: 100,000 @ 18% -> 18,000, and 99,999.99 @ 18% -> 117,999.99 total", () => {
    const res1 = calculateGst(100000, "add", 18);
    expect(res1.gstAmount).toBe(18000);
    expect(res1.totalAmount).toBe(118000);

    const res2 = calculateGst(99999.99, "add", 18);
    expect(formatRupees(res2.totalAmount, { showPaisaIfDecimal: true })).toBe("Rs 117,999.99");
  });

  it("Fitrana regression: 5 persons wheat -> 1,500; 1 person singular check", () => {
    const res5 = calculateFitrana(5, "wheat", "muneeb");
    expect(res5.totalFitrana).toBe(1500);

    const res1 = calculateFitrana(1, "wheat", "muneeb");
    expect(res1.totalFitrana).toBe(300);

    const personWord1En = res1.familyMembers === 1 ? "person" : "persons";
    const personWord1Roman = res1.familyMembers === 1 ? "shakhs" : "afraad";
    expect(personWord1En).toBe("person");
    expect(personWord1Roman).toBe("shakhs");

    const personWord5En = res5.familyMembers === 1 ? "person" : "persons";
    const personWord5Roman = res5.familyMembers === 1 ? "shakhs" : "afraad";
    expect(personWord5En).toBe("persons");
    expect(personWord5Roman).toBe("afraad");
  });

  it("Intro box exact word-for-word check across all 5 calculators", () => {
    const p = calculatorPages;
    expect(p.salary.romanUrduIntro).toBe(
      "Ye calculator aapki mahana tankhwah par FBR ke Tax Year 2026–27 ke slabs ke mutabiq tax nikalta hai. Agar aapki salana tankhwah Rs 600,000 se kam hai, to koi tax nahi lagta. Tax slab ke hisab se lagta hai aur aapki take-home tankhwah foran samne aa jati hai."
    );
    expect(p.salary.englishIntro).toBe(
      "This calculator works out the tax on your monthly salary using FBR's Tax Year 2026–27 slabs. If your annual salary is below Rs 600,000, no tax applies. Tax is charged slab by slab, and your take-home salary appears instantly."
    );

    expect(p.zakat.romanUrduIntro).toBe(
      "Ye Zakat calculator aapke cash, bank balance, sone, chandi aur karobar ke maal par 2.5% Zakat nikalta hai. Hanafi fiqh ke mutabiq, agar aapka maal nisab (chandi ka nisab 52.5 tola) tak pohanch jaye to Zakat farz ho jati hai. Zakat sirf us waqt farz hoti hai jab maal par poora ek saal (hawl) guzar chuka ho."
    );
    expect(p.zakat.englishIntro).toBe(
      "This Zakat calculator works out 2.5% Zakat on your cash, bank balance, gold, silver and business stock. Under Hanafi jurisprudence, Zakat becomes obligatory once your wealth reaches the nisab (the silver nisab of 52.5 tola). It is only due once a full lunar year (hawl) has passed over the wealth."
    );

    expect(p.property.romanUrduIntro).toBe(
      "Ye tool FBR ke Section 236K (kharidar) aur Section 236C (farokht kaninda) ke advance income tax ka hisab karta hai. Tax Year 2026–27 ke mutabiq, filer kharidar 1.25% aur filer farokht kaninda 2.75% tax deta hai. Filer aur non-filer ke darmiyan farq bhi yahan saaf nazar aa jata hai."
    );
    expect(p.property.englishIntro).toBe(
      "This tool calculates FBR advance income tax under Section 236K (buyer) and Section 236C (seller). For Tax Year 2026–27, a filer buyer pays 1.25% and a filer seller pays 2.75%. The difference between filer and non-filer rates is shown clearly side by side."
    );

    expect(p.gst.romanUrduIntro).toBe(
      "Is tool se aap kisi bhi raqam par 18% General Sales Tax (GST) shamil ya nikaal sakte hain. Agar aapko invoice ki kul raqam maloom hai, to 'Remove GST' select kar ke asal qeemat aur tax alag alag dekh sakte hain."
    );
    expect(p.gst.englishIntro).toBe(
      "With this tool you can add or remove 18% General Sales Tax (GST) from any amount. If you know the total invoice amount, choose 'Remove GST' to see the base price and the tax separately."
    );

    expect(p.fitrana.romanUrduIntro).toBe(
      "Ye calculator Sadqa-e-Fitr (Fitrana) ka hisab karta hai. Gandum ke hisab se kam se kam Rs 300 per shakhs banta hai. Ye raqam Mufti Muneeb-ur-Rehman aur Council of Islamic Ideology (CII) ke elan ke mutabiq hai. Jo log sahab-e-istetaat hain, wo zyada raqam se bhi ada kar sakte hain."
    );
    expect(p.fitrana.englishIntro).toBe(
      "This calculator works out Sadqa-e-Fitr (Fitrana) for your household. The minimum is Rs 300 per person, based on wheat. This rate follows the announcements of Mufti Muneeb-ur-Rehman and the Council of Islamic Ideology (CII). Those who can afford more may pay a higher amount."
    );
  });
});

