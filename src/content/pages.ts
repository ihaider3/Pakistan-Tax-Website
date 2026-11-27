import { siteConfig } from "@/config/site";
import type { CalculatorPageContent, FaqItem } from "./calcTypes";
import { salaryPageContent } from "./calc/salary";
import { zakatPageContent } from "./calc/zakat";
import { propertyPageContent } from "./calc/property";
import { gstPageContent } from "./calc/gst";
import { fitranaPageContent } from "./calc/fitrana";
import { ushrPageContent } from "./calc/ushr";

export type { CalculatorPageContent, FaqItem };
export { siteConfig };

export const calculatorPages: Record<string, CalculatorPageContent> = {
  salary: salaryPageContent,
  zakat: zakatPageContent,
  property: propertyPageContent,
  gst: gstPageContent,
  fitrana: fitranaPageContent,
  ushr: ushrPageContent,
};
