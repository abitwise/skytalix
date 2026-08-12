// Builds wrong panes out of tree. Each is the DELIVERED src/history-pane.ts text plus exactly one
// anchored edit; the anchor is asserted unique before substitution and the source md5 is checked
// first. Nothing under the worktree's src/ is ever written.
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SCRATCH = "/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/0d03b633-8518-42bd-a8f5-1d5a65199890/scratchpad";
const BASE = join(SCRATCH, "base");
const NODE_MODULES = "/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-abc028-qe/node_modules";
const DELIVERED_MD5 = "54fd4346dcc1a0060c4e66ae0149265d";

const source = readFileSync(join(BASE, "src/history-pane.ts"), "utf8");
const md5 = createHash("md5").update(source).digest("hex");
if (md5 !== DELIVERED_MD5) throw new Error(`source md5 ${md5} is not the delivered pane`);

// The two anchors, both asserted unique below.
const PROLOGUE_ANCHOR = "  const moves = history.moves;\n";
const EPILOGUE_ANCHOR = "  const rows = pairs.map(rowFor);\n";

const unique = (text, anchor) => text.split(anchor).length === 2;
if (!unique(source, PROLOGUE_ANCHOR)) throw new Error("prologue anchor is not unique");
if (!unique(source, EPILOGUE_ANCHOR)) throw new Error("epilogue anchor is not unique");

/**
 * Every mutant mutates the CALLER'S graph during the render and puts it back before returning, so
 * the rendered bytes are unchanged and the only thing that can report it is an instrument.
 */
const MUTANTS = {
  // --- controls: builds the ticket already names, re-run so my harness is calibrated ------------
  WPOSMID: {
    note: "ticket's build: position scalar mutated THROUGH the handed reference. Must DIE (write trap).",
    prologue: `  const __p = history.position as { fullmoveNumber: number };
  const __saved = __p.fullmoveNumber;
  __p.fullmoveNumber = 1234;
`,
    epilogue: `  __p.fullmoveNumber = __saved;
`,
  },
  WBOARDSET: {
    note: "ticket's build: board mutated by TypedArray method, NOT reverted before the next access. Must DIE (digest).",
    prologue: `  const __b = history.position.board;
  const __entry = Uint8Array.from(__b);
  __b.set(new Uint8Array(__b.length).fill(7));
`,
    epilogue: `  __b.set(__entry);
`,
  },
  WBOARDBLIND: {
    note: "ticket's KNOWN SURVIVOR (RISK-ABC028-01): buffer-level write reverted with no intervening access.",
    prologue: `  const __alias = new Uint8Array(history.position.board.buffer);
  const __was = __alias[0] as number;
  __alias[0] = __was ^ 0xff;
  __alias[0] = __was;
`,
    epilogue: "",
  },

  // --- new mechanisms: mine. Every one mutates the caller's graph and puts it back. -------------
  WPOSRAW: {
    note: "NEW. The DESCRIPTOR ESCAPE: getOwnPropertyDescriptor(view,'position').value is the RAW node, unwrapped. Write to a position scalar through it. Same badness as WPOSMID, different mechanism, NOT buffer-level.",
    prologue: `  const __d = Object.getOwnPropertyDescriptor(history, "position");
  const __raw = (__d as PropertyDescriptor).value as { fullmoveNumber: number };
  const __saved = __raw.fullmoveNumber;
  __raw.fullmoveNumber = 1234;
`,
    epilogue: `  __raw.fullmoveNumber = __saved;
`,
  },
  WMOVESRAW: {
    note: "NEW. The DESCRIPTOR ESCAPE on the moves ARRAY: reorder the caller's move list through the raw node. Same badness as WSPLICE (A4 arming slot 7), different mechanism. Restored in the same breath so output identity is BY CONSTRUCTION, not by luck.",
    prologue: `  const __d = Object.getOwnPropertyDescriptor(history, "moves");
  const __raw = (__d as PropertyDescriptor).value as Move[];
  if (__raw.length > 1) {
    __raw.unshift(...__raw.splice(0, 1));
    __raw.push(...__raw.splice(0, 0));
  }
`,
    epilogue: "",
  },
  WMOVEFIELDRAW: {
    note: "NEW. The DESCRIPTOR ESCAPE reaching a Move's OWN FIELD (A4 arming slot 8), mutated and restored in the same breath. A4 clause 1 claims every field of every Move is covered.",
    prologue: `  const __d = Object.getOwnPropertyDescriptor(history, "moves");
  const __raw = (__d as PropertyDescriptor).value as Move[];
  const __m0 = __raw[0] as { from: number } | undefined;
  if (__m0 !== undefined) {
    const __was = __m0.from;
    __m0.from = 99;
    __m0.from = __was;
  }
`,
    epilogue: "",
  },
  WBOARDSUB: {
    note: "NEW. subarray() returns a fresh view over the raw board that never passed a trap. Mutate + revert through it. NOT a .buffer access at any point.",
    prologue: `  const __sub = history.position.board.subarray(0, 8);
  const __was = __sub[0] as number;
  __sub[0] = __was ^ 0xff;
  __sub[0] = __was;
`,
    epilogue: "",
  },
  WBOARDCACHED: {
    note: "NEW. The instrument binds TypedArray methods to the RAW node by design (Test note 10). Cache one, then mutate and revert through it with no trap in between.",
    prologue: `  const __b = history.position.board;
  const __entry = Uint8Array.from(__b);
  const __set = __b.set.bind(__b);
  __set(new Uint8Array(__b.length).fill(7));
  __set(__entry);
`,
    epilogue: "",
  },
  WMOVERAWFIELD: {
    note: "NEW. Descriptor escape reaching a Move's own field, mutated and reverted. A4 clause 1 claims every Move field is covered.",
    prologue: `  const __d = Object.getOwnPropertyDescriptor(history, "moves");
  const __raw = (__d as PropertyDescriptor).value as Move[];
  const __m = __raw[0] as { to: number } | undefined;
  const __to = __m === undefined ? 0 : __m.to;
  if (__m !== undefined) __m.to = 77;
`,
    epilogue: `  if (__m !== undefined) __m.to = __to;
`,
  },
};

const targets = process.argv.slice(2);
const names = targets.length > 0 ? targets : Object.keys(MUTANTS);

for (const name of names) {
  const mutant = MUTANTS[name];
  if (mutant === undefined) throw new Error(`unknown mutant ${name}`);

  let text = source.replace(PROLOGUE_ANCHOR, PROLOGUE_ANCHOR + mutant.prologue);
  if (mutant.epilogue !== "") {
    text = text.replace(EPILOGUE_ANCHOR, mutant.epilogue + EPILOGUE_ANCHOR);
  }
  if (text === source) throw new Error(`${name}: substitution was a no-op`);

  const lane = join(SCRATCH, `lane-${name}`);
  rmSync(lane, { recursive: true, force: true });
  mkdirSync(lane, { recursive: true });
  cpSync(join(BASE, "src"), join(lane, "src"), { recursive: true });
  for (const file of ["package.json", "tsconfig.json", "biome.json"]) {
    cpSync(join(BASE, file), join(lane, file));
  }
  symlinkSync(NODE_MODULES, join(lane, "node_modules"));
  writeFileSync(join(lane, "src/history-pane.ts"), text);
  console.log(`built lane-${name}`);
}
