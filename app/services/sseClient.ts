type EventCallback = (data: any) => void;

const baseUrl = process.env.NEXT_PUBLIC_LUMA_API;

class SseClient {
  private static instance: SseClient;
  private eventSource: EventSource | null = null;
  private listeners: Map<string, EventCallback[]> = new Map();

  private constructor() {}

  static getInstance() {
    if (!SseClient.instance) {
      SseClient.instance = new SseClient();
    }
    return SseClient.instance;
  }

  connect() {
    if (this.eventSource) return;
  
    this.eventSource = new EventSource(`${baseUrl}/v1/articles/sse`);
    console.log("SSE connected");
  
    this.eventSource.addEventListener(
      "article-stock-updated",
      (event: MessageEvent) => {
        console.log("RAW EVENT:", event.data);
  
        const [articleCode, quantity] = event.data.split("-");
        this.dispatch("article-stock-updated", {
          articleCode,
          quantity: Number(quantity),
        });
      }
    );
  
    this.eventSource.onerror = () => {
      console.error("SSE disconnected");
      this.eventSource?.close();
      this.eventSource = null;
    };
  }

  on(eventName: string, callback: EventCallback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)!.push(callback);
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
  

  private dispatch(eventName: string, data: any) {
    const callbacks = this.listeners.get(eventName);
    callbacks?.forEach((cb) => cb(data));
  }
}

export const sseClient = SseClient.getInstance();
