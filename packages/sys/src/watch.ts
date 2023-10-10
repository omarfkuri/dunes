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
  #working = false
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
      (e, f) => !this.#working && this.#trigger(e, f))

  }

  #trigger(event: WatchEventType, filename: string | null) {
    this.#events.set(filename, event);
  }

  async start() {
    while(this.#watching) {

      if (this.#events.size) {
        this.#working = true;
        for (const [filename, event] of this.#events) {
          await this.#listener(event, filename);
        }
        this.#working = false;
        this.#events.clear();
      }

      await new Promise<void>(res => setTimeout(res, this.#delay));
    }
    console.log("ClosedWatcher")
  }

  async stop() {
    this.#watcher.close();
    this.#watching = false;
  }
}