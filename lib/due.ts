// Shared "how urgent is this?" helper, used by both Home and The List.
// Given an item's due date and the user's reminder_lead_days window,
// it says whether something is overdue, due today, due soon, or still later.

export type DueStatus = "overdue" | "today" | "soon" | "later" | "none";

export type DueInfo = {
  status: DueStatus;
  days: number | null; // whole days until due: negative = overdue, 0 = today
};

// Compare dates at midnight so partial days don't confuse "today".
export function dueInfo(
  dueDate: string | null,
  leadDays: number
): DueInfo {
  if (!dueDate) return { status: "none", days: null };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate + "T00:00:00");
  const days = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  if (days < 0) return { status: "overdue", days };
  if (days === 0) return { status: "today", days };
  if (days <= leadDays) return { status: "soon", days };
  return { status: "later", days };
}

// Turn that into a short, friendly badge label — or null when nothing's urgent.
export function dueLabel(info: DueInfo): string | null {
  switch (info.status) {
    case "overdue": {
      const n = Math.abs(info.days ?? 0);
      return n === 1 ? "⚠️ 1 day overdue" : `⚠️ ${n} days overdue`;
    }
    case "today":
      return "⏰ due today";
    case "soon":
      return `⏰ in ${info.days} ${info.days === 1 ? "day" : "days"}`;
    default:
      return null; // "later" and "none" get no badge
  }
}