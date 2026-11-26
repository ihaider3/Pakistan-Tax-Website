"use client";

import React from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { salaryRates2026_27 } from "@/lib/rates/salary-2026-27";
import { propertyRates2026_27 } from "@/lib/rates/property-2026-27";
import { gstRates } from "@/lib/rates/gst";
import { zakatRates } from "@/lib/rates/zakat";
import { fitranaRates2026 } from "@/lib/rates/fitrana-2026";
import { useExplanationLang } from "@/components/LanguageContext";
import ExplanationLangToggle from "@/components/ExplanationLangToggle";
import { AdsterraNativeBanner } from "@/components/AdsterraSlot";

export default function MethodologyClient() {
  const { lang } = useExplanationLang();
  const isRoman = lang === "roman";

  return (
    <div className="max-w-[850px] mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      <Breadcrumb items={[{ label: "Methodology", href: "/methodology" }]} />
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent-soft px-2.5 py-1 rounded-full border border-accent/20">
            Statutory Verification
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mt-2">
            Methodology &amp; Statutory Sources
          </h1>
          <p className="text-base text-appText-muted mt-2 leading-relaxed">
            Learn how salary tax is calculated in Pakistan alongside statutory FBR references for Pakistan tax slabs 2026-27, Zakat Nisab, property laws (236C/236K), GST 18%, Fitrana, and agricultural Ushr.
          </p>
          <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-200 mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Figures last verified: 17 November 2026
          </p>
        </div>
        <div className="shrink-0 pt-1">
          <ExplanationLangToggle />
        </div>
      </div>

      <div className="space-y-8 text-sm sm:text-base text-appText leading-relaxed">
        {/* Salary Tax */}
        <div className="bg-white p-6 rounded-xl border border-appBorder shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-appBorder pb-2">
            <h2 className="text-lg font-bold text-primary">1. Salary Tax Calculator (Section 149)</h2>
            <span className="text-xs font-semibold text-accent">{salaryRates2026_27.taxYearCode}</span>
          </div>
          <p>
            <strong>{isRoman ? "Statutory Hawala:" : "Statutory Reference:"}</strong> {salaryRates2026_27.metadata.sourceDocument}. {isRoman ? "Verified tareekh:" : "Figures last verified:"} 17 November 2026.
          </p>
          <div className="space-y-2 text-sm text-appText-muted">
            {isRoman ? (
              <>
                <p>
                  <strong>Calculation Mechanics:</strong> Tax 8 qanooni slabs ke tehat progressive tariqe se calculate hota hai. Har slab ka tax rate sirf usi slab ki aamdani par lagta hai. Mahana tax annual tax ko 12 par divide karke banta hai. Mahana take-home gross salary mein se mahana tax nikalne ke baad bachti hai.
                </p>
                <p>
                  <strong>What is Included:</strong> 0% (Rs 600,000 tak) se 35% (Rs 7,000,000 se upar) tak ke progressive rates. Salaried surcharge Tax Year 2027 ke liye khatam ho chuka hai.
                </p>
                <p>
                  <strong>What is Excluded:</strong> Non-salaried aamdani, commercial munafa, Section 154A ke tehat freelance contract receipts, Section 15 ke tehat rental aamdani, aur capital gains.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Calculation Mechanics:</strong> Tax is computed progressively across 8 statutory slabs. Each tax rate applies strictly to the slice of income within that respective slab bracket. Monthly tax deduction is calculated as annual tax divided by 12. Monthly take-home is gross salary minus monthly tax.
                </p>
                <p>
                  <strong>What is Included:</strong> Progressive rates from 0% (up to Rs 600,000) to 35% (above Rs 7,000,000). Salaried surcharge is confirmed abolished for Tax Year 2027.
                </p>
                <p>
                  <strong>What is Excluded:</strong> Non-salaried income, commercial profits, freelance contract receipts under Section 154A, rental income under Section 15, and capital gains.
                </p>
              </>
            )}
          </div>
          <Link href="/salary-tax-calculator" className="text-xs font-bold text-accent hover:underline block pt-1">
            Open Salary Tax Calculator &rarr;
          </Link>
        </div>

        {/* Zakat Calculator */}
        <div className="bg-white p-6 rounded-xl border border-appBorder shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-appBorder pb-2">
            <h2 className="text-lg font-bold text-primary">2. Complete Zakat Calculator</h2>
            <span className="text-xs font-semibold text-accent">Hanafi Standard</span>
          </div>
          <p>
            <strong>{isRoman ? "Statutory & Religious Hawala:" : "Statutory & Religious Reference:"}</strong> {zakatRates.metadata.sourceDocument}. {isRoman ? "Verified tareekh:" : "Figures last verified:"} 17 November 2026.
          </p>
          <div className="space-y-2 text-sm text-appText-muted">
            {isRoman ? (
              <>
                <p>
                  <strong>Nisab Rule:</strong> Sone ka nisab 87.48 gram (7.5 tola) hai. Chandi ka nisab 612.36 gram (52.5 tola) hai. Pakistan mein raaij Hanafi fiqh ke mutabiq, agar maal mukhtalif aqsam (cash + sona + sarmayakari) par mushtamil ho, to ghareebon ke faiday ki khatir ehtiyatan Chandi ka nisab laagu hota hai.
                </p>
                <p>
                  <strong>Market Rates:</strong> Sone aur chandi ke rates har dafa Zakat page kholne par live update hote hain — hamesha taaza market rates.
                </p>
                <p>
                  <strong>Bank Deduction Distinction:</strong> Hakumat ki taraf se notify shuda had Rs 503,529 (SBP Circular 03/2026) sirf 1 Ramadan ko savings accounts se automatic bank deduction ke liye hai, ye zaati Shariah Nisab nahi hai.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Nisab Rule:</strong> Gold Nisab is 87.48 grams (7.5 tola). Silver Nisab is 612.36 grams (52.5 tola). In accordance with the prevalent Hanafi school in Pakistan, if wealth is mixed (cash + gold + investments), the Silver Nisab threshold is applied as a precaution to benefit the poor.
                </p>
                <p>
                  <strong>Market Rates:</strong> Gold and silver rates update live every time you open the Zakat page — always the latest market rates.
                </p>
                <p>
                  <strong>Bank Deduction Distinction:</strong> The government notified threshold of Rs 503,529 (SBP Circular 03/2026) is strictly for automatic bank deductions from savings accounts on 1 Ramadan, NOT personal Shariah Nisab.
                </p>
              </>
            )}
            <p>
              <strong>What is Excluded:</strong> Agricultural Ushr (5%–10% — {isRoman ? "alag se Section 6 mein diya gaya hai" : "covered separately in Section 6 below"}), livestock (An&apos;am), and complex business partnerships which require direct consultation with a qualified Mufti.
            </p>
          </div>
          <Link href="/zakat-calculator" className="text-xs font-bold text-accent hover:underline block pt-1">
            Open Zakat Calculator &rarr;
          </Link>
        </div>

        {/* Property Advance Tax */}
        <div className="bg-white p-6 rounded-xl border border-appBorder shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-appBorder pb-2">
            <h2 className="text-lg font-bold text-primary">3. Property Advance Tax (236C &amp; 236K)</h2>
            <span className="text-xs font-semibold text-accent">{propertyRates2026_27.taxYearCode}</span>
          </div>
          <p>
            <strong>{isRoman ? "Statutory Hawala:" : "Statutory Reference:"}</strong> {propertyRates2026_27.metadata.sourceDocument}. {isRoman ? "Verified tareekh:" : "Figures last verified:"} 17 November 2026.
          </p>
          <div className="space-y-2 text-sm text-appText-muted">
            {isRoman ? (
              <>
                <p>
                  <strong>Buyer Advance Tax (Section 236K):</strong> Active Filer (ATL) rate flat 1.25% hai. Non-filer rate darja-ba-darja hai: 10.5% (Rs 50M tak), 14.5% (Rs 50M se 100M tak), aur 18.5% (Rs 100M se upar).
                </p>
                <p>
                  <strong>Seller Advance Tax (Section 236C):</strong> Active Filer rate flat 2.75% hai. Non-filer rate flat 11.5% hai.
                </p>
                <p>
                  <strong>Late-Filer Note:</strong> Finance Act 2026 mein late-filer category khatam kar di gayi hai; taxpayers sirf Filer ya Non-Filer shumar hote hain.
                </p>
                <p>
                  <strong>What is Excluded:</strong> Subai stamp duty, Capital Value Tax (CVT), local registration charges, aur Section 37 ke tehat Capital Gains Tax (CGT).
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Buyer Advance Tax (Section 236K):</strong> Active Filer (ATL) rate is 1.25% flat. Non-filer rate is tiered: 10.5% (up to Rs 50M), 14.5% (Rs 50M to 100M), and 18.5% (above Rs 100M).
                </p>
                <p>
                  <strong>Seller Advance Tax (Section 236C):</strong> Active Filer rate is 2.75% flat. Non-filer rate is 11.5% flat.
                </p>
                <p>
                  <strong>Late-Filer Note:</strong> The late-filer rate was abolished in Finance Act 2026; taxpayers are categorized strictly as Filer or Non-Filer.
                </p>
                <p>
                  <strong>What is Excluded:</strong> Provincial stamp duties, Capital Value Tax (CVT), local registration charges, and Capital Gains Tax (CGT) under Section 37.
                </p>
              </>
            )}
          </div>
          <Link href="/property-tax-calculator" className="text-xs font-bold text-accent hover:underline block pt-1">
            Open Property Tax Calculator &rarr;
          </Link>
        </div>

        {/* GST */}
        <div className="bg-white p-6 rounded-xl border border-appBorder shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-appBorder pb-2">
            <h2 className="text-lg font-bold text-primary">4. General Sales Tax (GST)</h2>
            <span className="text-xs font-semibold text-accent">Federal 18%</span>
          </div>
          <p>
            <strong>{isRoman ? "Statutory Hawala:" : "Statutory Reference:"}</strong> {gstRates.metadata.sourceDocument}. {isRoman ? "Verified tareekh:" : "Figures last verified:"} 17 November 2026.
          </p>
          <div className="space-y-2 text-sm text-appText-muted">
            {isRoman ? (
              <>
                <p>
                  <strong>Calculation Formulas:</strong> Add GST tax ko Base &times; (Rate / 100) ke zariye calculate karta hai. Remove GST total mein se base aisi nikalta hai: Total / (1 + Rate / 100). Rupaye ki tamam calculations integer paisa mein round hoti hain taake decimal ghalti na aaye.
                </p>
                <p>
                  <strong>Services Discrepancy:</strong> Ashya (goods) par federal GST 18% muqarrar hai. Khidmaat (services) ke taxes subai authorities (SRB, PRA, KPRA, BRA) ke tehat 13%–16% mukhtalif hain. Is liye subai sharah ke liye Custom Rate ka option diya gaya hai.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Calculation Formulas:</strong> Add GST computes tax as Base &times; (Rate / 100). Remove GST extracts base as Total / (1 + Rate / 100). All rupee calculations are rounded in integer paisa to eliminate floating point distortion.
                </p>
                <p>
                  <strong>Services Discrepancy:</strong> Federal GST on goods is fixed at 18%. Services taxes are governed provincially (Sindh Revenue Board, Punjab Revenue Authority, KPRA, BRA) with varying rates (13%–16%). Therefore, provincial rates are supported via the Custom Rate input rather than hardcoded presets.
                </p>
              </>
            )}
          </div>
          <Link href="/gst-calculator" className="text-xs font-bold text-accent hover:underline block pt-1">
            Open GST Calculator &rarr;
          </Link>
        </div>

        {/* Fitrana */}
        <div className="bg-white p-6 rounded-xl border border-appBorder shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-appBorder pb-2">
            <h2 className="text-lg font-bold text-primary">5. Fitrana (Sadqat-ul-Fitr)</h2>
            <span className="text-xs font-semibold text-accent">Ramadan 2026</span>
          </div>
          <p>
            <strong>{isRoman ? "Scholarly Hawala:" : "Scholarly Sources:"}</strong> {fitranaRates2026.metadata.sourceDocument}. {isRoman ? "Verified tareekh:" : "Figures last verified:"} 17 November 2026.
          </p>
          <div className="space-y-2 text-sm text-appText-muted">
            {isRoman ? (
              <>
                <p>
                  <strong>Consensus vs Conflicting Rates:</strong> Mufti Muneeb-ur-Rehman aur Council of Islamic Ideology (CII) dono ka <strong>Rs 300 fi fard</strong> (2 kg Gandum) par mukammal ittefaq hai. Jau (Rs 1,160 ba-muqabla Rs 1,100), Khajoor (Rs 2,800 ba-muqabla Rs 1,600), aur Kishmish (Rs 7,200 ba-muqabla Rs 3,800) par market samples ke mutabiq farq hai. Hamara calculator dono tables sath sath shafafiyat ke sath dikhata hai.
                </p>
                <p>
                  <strong>What is Excluded:</strong> Daaimi mareezon ke rozon ka Fidya aur toote huye rozon/qasmon ka Kaffara.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Consensus vs Conflicting Rates:</strong> Both Mufti Muneeb-ur-Rehman and the Council of Islamic Ideology (CII) unanimously agree on <strong>Rs 300 per person</strong> for 2 kg Wheat (Gandum). For Barley (Rs 1,160 vs Rs 1,100), Dates (Rs 2,800 vs Rs 1,600), and Raisins (Rs 7,200 vs Rs 3,800), rates diverge based on retail market samples. Our calculator displays both tables side-by-side with full transparency.
                </p>
                <p>
                  <strong>What is Excluded:</strong> Fidya for missed fasts due to chronic illness and Kaffara for broken fasts/oaths.
                </p>
              </>
            )}
          </div>
          <Link href="/fitrana-calculator" className="text-xs font-bold text-accent hover:underline block pt-1">
            Open Fitrana Calculator &rarr;
          </Link>
        </div>

        {/* 6. Ushr Calculator */}
        <div className="bg-white p-6 rounded-xl border border-appBorder shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-appBorder pb-2">
            <h2 className="text-lg font-bold text-primary">6. Ushr Calculator</h2>
            <span className="text-xs font-semibold text-accent">Hanafi Standard</span>
          </div>
          <div className="space-y-3 text-sm text-appText-muted">
            {isRoman ? (
              <>
                <p>
                  Ushr faslon par wajib sadqa hai, jo fasal katne ke waqt dena hota hai. Calculator Hanafi mauqaf ko default ke tor par follow karta hai: Ushr har fasal par hai, koi nisab nahi.
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    Baarish, darya ya chashme ka paani (qudrati aabpashi): fasal ka <strong>10%</strong>
                  </li>
                  <li>
                    Tube-well ya khincha hua paani (masnooi aabpashi): fasal ka <strong>5%</strong>
                  </li>
                  <li>
                    Mili-juli aabpashi: dono barabar hon to <strong>7.5%</strong>; warna jis zariye ka paani zyada ho, us ki sharah lagegi
                  </li>
                  <li>
                    Fasal katne par wajib — Hawl (aik saal guzarna) ki shart nahi
                  </li>
                  <li>
                    Kasht ke kharch ki koi katauti nahi
                  </li>
                  <li>
                    1 maund = 40 kg
                  </li>
                  <li>
                    Note: aksariyat ke nazdeek zakheera karne wali buniyadi faslon par 5 wasq (taqreeban 653 kg, taqreeban 16.3 maund) ka nisab hai. Ye calculator Hanafi default (koi nisab nahi) use karta hai.
                  </li>
                  <li>
                    Hawale: Quran 6:141; Sahih al-Bukhari 1483
                  </li>
                </ul>
              </>
            ) : (
              <>
                <p>
                  Ushr is the obligatory charity on agricultural produce, due at the time of harvest. The calculator follows the Hanafi position as its default: Ushr applies to all crops, with no minimum threshold (nisab).
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    Rain, river or spring water (natural irrigation): <strong>10%</strong> of the produce
                  </li>
                  <li>
                    Tube-well or drawn water (artificial irrigation): <strong>5%</strong> of the produce
                  </li>
                  <li>
                    Mixed irrigation: <strong>7.5%</strong> if both sources are used equally; otherwise the rate of the dominant source applies
                  </li>
                  <li>
                    Due at harvest — no Hawl (one lunar year) is required
                  </li>
                  <li>
                    No deduction for cultivation costs
                  </li>
                  <li>
                    1 maund = 40 kg
                  </li>
                  <li>
                    Note: the majority view applies a nisab of 5 wasq (about 653 kg, about 16.3 maund) to storable staple crops only. This calculator uses the Hanafi default (no nisab).
                  </li>
                  <li>
                    Sources: Quran 6:141; Sahih al-Bukhari 1483
                  </li>
                </ul>
              </>
            )}
          </div>
          <Link
            href="/ushr-calculator"
            className="text-xs font-bold text-accent hover:underline block pt-1"
          >
            Try it: Ushr Calculator &rarr;
          </Link>
        </div>
      </div>

      <AdsterraNativeBanner className="px-0 mt-8" />
    </div>
  );
}
