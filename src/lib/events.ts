import { EventEmitter } from "node:events";

const bus = new EventEmitter();
bus.setMaxListeners(0);

export type ChatEvent = { threadKey: string; messageId: number };

export function publishChatMessage(evt: ChatEvent): void {
  bus.emit(`chat:${evt.threadKey}`, evt);
}

export function subscribeChat(threadKey: string, handler: (evt: ChatEvent) => void): () => void {
  const channel = `chat:${threadKey}`;
  bus.on(channel, handler);
  return () => bus.off(channel, handler);
}
