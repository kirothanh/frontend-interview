export function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const items = [...iterable];
    if (items.length === 0) return resolve([]);
    const results = new Array(items.length);
    let remaining = items.length;
    items.forEach((item, i) => {
      Promise.resolve(item).then((v) => {
        results[i] = v;
        if (--remaining === 0) resolve(results);
      }, reject);
    });
  });
}
