import { guardUser } from "@/lib/api";
import { canAccessThread } from "@/lib/queries";
import { subscribeChat } from "@/lib/events";

export async function GET(request: Request, { params }: { params: Promise<{ thread: string }> }) {
  const { user, error } = await guardUser();
  if (error) return error;

  const { thread } = await params;
  const threadKey = decodeURIComponent(thread);
  if (!(await canAccessThread(threadKey, user.id, user.role))) {
    return new Response("Forbidden", { status: 403 });
  }

  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | undefined;
  let heartbeat: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode("event: hello\ndata: {}\n\n"));
      unsubscribe = subscribeChat(threadKey, (evt) => {
        try {
          controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify(evt)}\n\n`));
        } catch {
          /* client disconnected */
        }
      });
      heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          /* ignore */
        }
      }, 25000);

      request.signal.addEventListener("abort", () => {
        unsubscribe?.();
        clearInterval(heartbeat);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      });
    },
    cancel() {
      unsubscribe?.();
      clearInterval(heartbeat);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
