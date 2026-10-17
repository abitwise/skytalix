// secnfr-ABC-096: preloaded into a REAL `npm run chess` child via NODE_OPTIONS=--import=<this file>.
// It wraps the tree's `src/book.ts` `createBookProbe` IN MEMORY (a load hook; no file byte changes): the returned
// probe's FIRST method call, whichever method it is, is timed with the read and parse inside it, and one JSON line
// is appended to $SECNFR096_OUT:
//   { first: <method>, firstCallMs, readsInside, readMs, sinceOriginMs, named: <result is a string> }
// Every later call goes straight through. With SMOKE=1 the timing fields are omitted.
import { appendFileSync } from "node:fs";
import { registerHooks } from "node:module";

const OUT = process.env.SECNFR096_OUT;
const SMOKE = process.env.SMOKE === "1";
globalThis.__secnfr096 = (o) => {
  const { create, options } = o;
  let reads = 0;
  let readMs = 0;
  const probe = create({
    ...options,
    read: () => {
      reads++;
      const t = performance.now();
      try {
        return options.read();
      } finally {
        readMs += performance.now() - t;
      }
    },
  });
  let done = false;
  const wrapped = {};
  for (const name of Object.keys(probe)) {
    wrapped[name] = (...args) => {
      if (done) return probe[name](...args);
      done = true;
      const before = reads;
      const t = performance.now();
      const result = probe[name](...args);
      const ms = performance.now() - t;
      const line = { first: name, readsInside: reads - before, named: typeof result === "string" };
      if (!SMOKE) Object.assign(line, { firstCallMs: ms, readMs, sinceOriginMs: performance.now() });
      appendFileSync(OUT, `${JSON.stringify(line)}\n`);
      return result;
    };
  }
  return wrapped;
};

registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context);
    if (!url.endsWith("/src/book.ts")) return result;
    const source = String(result.source);
    const marker = "export function createBookProbe(";
    if (!source.includes(marker)) throw new Error("secnfr096 hook: createBookProbe not found");
    return {
      ...result,
      source:
        source.replace(marker, "function __secnfr096_create(") +
        "\nexport function createBookProbe(options) { return globalThis.__secnfr096({ create: __secnfr096_create, options }); }\n",
    };
  },
});
