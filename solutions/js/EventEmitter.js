export class EventEmitter {
  #handlers = new Map();
  on(event, fn) {
    if (!this.#handlers.has(event)) this.#handlers.set(event, []);
    this.#handlers.get(event).push(fn);
    return () => this.off(event, fn);
  }
  off(event, fn) {
    const list = this.#handlers.get(event);
    if (!list) return;
    this.#handlers.set(event, list.filter((h) => h !== fn && h.original !== fn));
  }
  once(event, fn) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      fn(...args);
    };
    wrapper.original = fn;
    return this.on(event, wrapper);
  }
  emit(event, ...args) {
    // copy so handlers that unsubscribe during emit don't skip siblings
    [...(this.#handlers.get(event) ?? [])].forEach((h) => h(...args));
  }
}
