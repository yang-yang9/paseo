import type { DaemonClient } from "@getpaseo/client/internal/daemon-client";

/**
 * Handles notification action responses from actionable push notifications.
 * When the user taps Approve or Deny on a notification (iPhone or Apple Watch),
 * this sends the permission response back to the daemon.
 */
export interface NotificationActionContext {
  /** The daemon client for the host that owns the agent */
  client: DaemonClient;
  /** The agent ID from the notification data */
  agentId: string;
  /** The permission request ID from the notification data */
  permissionRequestId: string;
}

export type NotificationAction = "approve" | "deny";

/**
 * Process a notification action (Approve/Deny) and send the response
 * back to the daemon via WebSocket.
 */
export async function handleNotificationAction(
  action: NotificationAction,
  context: NotificationActionContext,
): Promise<void> {
  const decision = action === "approve" ? "allow" : "deny";

  await context.client.respondToPermission(context.agentId, context.permissionRequestId, {
    decision,
    reason: `Notification action: ${action}`,
  });
}

/**
 * Extract notification action context from the push notification data payload.
 * Returns null if the data doesn't contain the required fields.
 */
export function extractNotificationActionContext(
  data: Record<string, unknown> | undefined,
): { agentId: string; permissionRequestId: string } | null {
  if (!data) return null;

  const agentId = typeof data.agentId === "string" ? data.agentId : null;
  const permissionRequestId =
    typeof data.permissionRequestId === "string" ? data.permissionRequestId : null;

  if (!agentId || !permissionRequestId) return null;

  return { agentId, permissionRequestId };
}