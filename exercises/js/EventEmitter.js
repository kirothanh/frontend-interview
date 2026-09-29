// Implement EventEmitter: on(event, fn) -> returns an unsubscribe function,
// off(event, fn), once(event, fn), emit(event, ...args).
// Edge case: a handler that unsubscribes itself during emit must not make
// the next handler get skipped. Also: off(event, fn) must work for once() handlers.
export class EventEmitter {}
