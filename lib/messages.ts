export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
};

const KEY = "elaine-fashion-contact-messages";

export function saveContactMessage(data: Omit<ContactMessage, "id" | "createdAt">) {
  const entry: ContactMessage = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const list = getContactMessages();
  list.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(list));
  return entry;
}

export function getContactMessages(): ContactMessage[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as ContactMessage[];
  } catch {
    return [];
  }
}
