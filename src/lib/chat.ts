import { appendMessage } from "./queries";
import { publishChatMessage } from "./events";

export async function publishChatMessageSafe(threadKey: string, userId: number, role: "client" | "admin", body: string, attachments: number[] = []) {
  const msg = await appendMessage(threadKey, userId, role, body, attachments);
  publishChatMessage({ threadKey, messageId: msg.id });
  return msg;
}

export { appendMessage };
