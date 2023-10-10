import { FSWatcher, WatchEventType, WatchOptions } from "fs"
import { watch } from "fs"


interface WatchOpts extends WatchOptions {
  delay: number
}

type WatchListener = {
  (change: WatchEventType, filename: string | null): Prom<unknown>
}

export class WatchDir {

  #watching = true
  #events: Map<string | null, WatchEventType>
  #watcher: FSWatcher
  #delay: number
  #listener: WatchListener

  constructor(
    src: string, 
    {delay, ...options}: WatchOpts, 
    listener: WatchListener
  ) {
    this.#delay = delay;
    this.#listener = listener;

    this.#events = new Map

    this.#watcher = watch(src, options, 
      (e, f) => this.#trigger(e, f))

  }

  #trigger(event: WatchEventType, filename: string | null) {
    this.#events.set(filename, event);
  }

  async start() {
    while(this.#watching) {

      for (const [filename, event] of this.#events) {
        await this.#listener(event, filename);
      }
      this.#events.clear();

      await new Promise<void>(res => setTimeout(res, this.#delay));
    }
    console.log("ClosedWatcher")
  }

  async stop() {
    this.#watcher.close();
    this.#watching = false;
  }
}