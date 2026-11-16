export interface StoredFeedbackItem {
  id: string;
  created_at: string;
  category: string;
  calculator: string;
  name: string | null;
  email: string | null;
  message: string;
  rating: number | null;
  screenshot_url: string | null;
  status: string;
  user_agent: string | null;
}

const inMemorySubmissions: StoredFeedbackItem[] = [];

export function getInMemorySubmissions(): StoredFeedbackItem[] {
  return inMemorySubmissions;
}

export function addInMemorySubmission(item: StoredFeedbackItem): void {
  inMemorySubmissions.unshift(item);
}
