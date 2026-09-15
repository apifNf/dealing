const OPS_NOTIFY_WEBHOOK_URL = process.env.N8N_OPS_NOTIFY_WEBHOOK_URL;

/**
 * Generic relay to the ops team's Telegram (same bot/chat as the seller
 * listing alert and the Gatekeeper match notification — see the n8n
 * workflow "Ops Notification", which just forwards `message` verbatim).
 * Used for events that need a human to read and act on them: a new
 * membership application, or an admin sharing a listing to the membership
 * group. We don't message members/buyers/applicants directly for the same
 * reason as Gatekeeper: Telegram's Bot API can't send to an arbitrary
 * contact a user typed into a form, and there's no email infra here.
 */
export async function postOpsNotification(message: string, label: string): Promise<void> {
  if (!OPS_NOTIFY_WEBHOOK_URL) {
    console.log(`[ops] ${label} webhook not configured, message:\n${message}`);
    return;
  }

  console.log(`[ops] POSTing ${label} to ${OPS_NOTIFY_WEBHOOK_URL}:\n${message}`);

  const res = await fetch(OPS_NOTIFY_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error(`${label} ops webhook responded with ${res.status}`);
  }

  console.log(`[ops] ${label} webhook responded with ${res.status}`);
}
