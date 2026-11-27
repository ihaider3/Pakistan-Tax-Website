export interface FaqItem {
  question: string;
  answer: string;
}

export interface CalculatorPageContent {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  keywords: string[];
  intro: string;
  romanUrduIntro: string;
  englishIntro: string;
  howToUseSteps: string[];
  formulaTitle: string;
  formulaDescription: string;
  workedExample: {
    title: string;
    description: string;
    bulletPoints: string[];
  };
  faqs: FaqItem[];
  source: string;
  sourceDocument: string;
  lastVerified: string;
  disclaimer: string;
}
