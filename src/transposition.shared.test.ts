/**
 * ABC-265 (TH-1) acceptance — the shared table layout, criteria `A1` and `A2` (`ADR-0025` Decision 2
 * and Decision 4's last bullet as amended 2026-11-02; `ADR-0057` D2.3).
 *
 * `A1` reads the layout: one `Uint32Array` over one 4 MiB `SharedArrayBuffer`, no 64-bit table
 * column, no `Atomics`, the store order 2, 3, 0, 1, and the `bigint` signatures. `A2` reads the XOR
 * check and the verified copy (falsifier `T10`). Every row writes and reads the buffer through the
 * handle `tableBuffer()`; none needs a second thread (the multi-writer race is `ABC-267`'s).
 *
 * No search runs here, so every row is in the default lane (`N8-LANE`). `A3` (identity) is a
 * cross-build reading run out of tree; `ABC-081`'s, `ABC-122`'s and `ABC-208`'s rows run unedited
 * in their own files.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Move } from "./moves.ts";
import {
  BOUND_EXACT,
  BOUND_LOWER,
  clearTable,
  entryMove,
  probeTable,
  storeEntry,
  TABLE_ENTRIES,
  tableBuffer,
  tableByteLength,
  tableCutoff,
} from "./transposition.ts";

const SOURCE = readFileSync(new URL("./transposition.ts", import.meta.url), "utf8");
/** The source with its comments removed, so a word in prose cannot satisfy or fail a source row. */
const CODE = SOURCE.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

/** A synthetic move: only `from`, `to` and `promotion` are packed. */
const mv = (from: number, to: number, promotion = 0): Move => ({
  from,
  to,
  piece: 0,
  captured: 0,
  flags: 0,
  promotion,
});
const MOVE_A = mv(0x14, 0x34);
const MOVE_B = mv(0x06, 0x25);
const MOVES = [MOVE_A, MOVE_B];

/** A 64-bit key from its halves. */
const key = (hi: number, lo: number): bigint => (BigInt(hi >>> 0) << 32n) | BigInt(lo >>> 0);
const MASK = TABLE_ENTRIES - 1;

/** The four words of `slot`, read through the handle. */
function wordsOf(slot: number): number[] {
  const view = new Uint32Array(tableBuffer() as SharedArrayBuffer);
  return [0, 1, 2, 3].map((w) => view[slot * 4 + w] as number);
}

/** Write four words into `slot` through the handle, in the store's own order 2, 3, 0, 1. */
function writeWords(slot: number, words: readonly number[]): void {
  const view = new Uint32Array(tableBuffer() as SharedArrayBuffer);
  for (const w of [2, 3, 0, 1]) view[slot * 4 + w] = words[w] as number;
}

describe("ABC-265 A1 — the layout: four Uint32 words a slot over one SharedArrayBuffer", () => {
  it("the storage is one SharedArrayBuffer of 4 194 304 bytes (2^18 x 16), viewed as Uint32", () => {
    clearTable();
    const buffer = tableBuffer();
    expect(buffer).toBeInstanceOf(SharedArrayBuffer);
    expect((buffer as SharedArrayBuffer).byteLength).toBe(4_194_304);
    expect(TABLE_ENTRIES * 16).toBe(4_194_304);
    expect(tableByteLength()).toBe(4_194_304);
    // Allocated once: a second clear keeps the same buffer.
    clearTable();
    expect(tableBuffer()).toBe(buffer);
  });

  it("holds no 64-bit table column and calls no Atomics method (a source row)", () => {
    expect(CODE).not.toMatch(/BigUint64Array|BigInt64Array/);
    expect(CODE).not.toMatch(/\bAtomics\b/);
    expect(CODE).toMatch(/new SharedArrayBuffer\(/);
    expect(CODE).toMatch(/new Uint32Array\(buffer\)/);
  });

  it("storeEntry writes word 2, then 3, then 0, then 1 (a source row)", () => {
    const start = CODE.indexOf("export function storeEntry(");
    const end = CODE.indexOf("\n}\n", start);
    const body = CODE.slice(start, end);
    const order = [...body.matchAll(/table\[base(?: \+ (\d))?\] =/g)].map((m) => Number(m[1] ?? 0));
    expect(order).toEqual([2, 3, 0, 1]);
  });

  it("probeTable and storeEntry keep their bigint signatures (a source row; the typecheck is A6's)", () => {
    expect(CODE).toMatch(/export function probeTable\(key: bigint\): number/);
    expect(CODE).toMatch(/export function storeEntry\(\s*key: bigint,/);
  });

  it("the store's words are keyLo ^ data, keyHi ^ score, data, score; a clear zeroes them", () => {
    clearTable();
    const k = key(0x1234_5678, 0x9abc_def0);
    storeEntry(k, 5, BOUND_EXACT, -321, 0, MOVE_A);
    const slot = 0x9abc_def0 & MASK;
    const [w0, w1, w2, w3] = wordsOf(slot) as [number, number, number, number];
    expect(w3 | 0).toBe(-321);
    expect((w0 ^ w2) >>> 0).toBe(0x9abc_def0);
    expect((w1 ^ w3) >>> 0).toBe(0x1234_5678);
    expect(w2 >>> 19).toBe(5);
    expect((w2 >>> 17) & 3).toBe(BOUND_EXACT);
    clearTable();
    expect(wordsOf(slot)).toEqual([0, 0, 0, 0]);
    expect(probeTable(k)).toBe(-1);
  });
});

describe("ABC-265 A2 — the XOR check", () => {
  const K = key(0x0bad_cafe, 0x0003_1234);
  const slotOf = (k: bigint) => Number(k & BigInt(MASK));

  it("an entry stored for K hits for K, returning its move, bound, depth and score", () => {
    clearTable();
    storeEntry(K, 4, BOUND_LOWER, 77, 0, MOVE_B);
    const slot = probeTable(K);
    expect(slot).toBe(slotOf(K));
    expect(entryMove(slot, MOVES)).toBe(MOVE_B);
    // Depth: settles only at 4. Bound: a lower bound settles at or above beta only. Score: 77.
    expect(tableCutoff(slot, 4, 0, 77, 0)).toBe(77);
    expect(tableCutoff(probeTable(K), 4, 0, 78, 0)).toBeNull();
    expect(tableCutoff(probeTable(K), 3, 0, 77, 0)).toBeNull();
    expect(tableCutoff(probeTable(K), 5, 0, 77, 0)).toBeNull();
  });

  it("misses for K' in the same slot with a different keyHi, and for K'' whose keyLo differs above the mask", () => {
    clearTable();
    storeEntry(K, 2, BOUND_EXACT, 10, 0, MOVE_A);
    const kPrime = key(0x0bad_caff, 0x0003_1234);
    const kDouble = key(0x0bad_cafe, 0x0003_1234 + (1 << 18));
    expect(slotOf(kPrime)).toBe(slotOf(K));
    expect(slotOf(kDouble)).toBe(slotOf(K));
    expect(probeTable(kPrime)).toBe(-1);
    expect(probeTable(kDouble)).toBe(-1);
    expect(probeTable(K)).toBe(slotOf(K));
  });

  it("a torn slot (words 0 and 1 from entry A, words 2 and 3 from entry B) misses for A and for B", () => {
    const A = key(0x1111_1111, 0x2220_0042);
    const B = key(0x3333_3333, 0x4440_0042);
    expect(slotOf(A)).toBe(slotOf(B));
    const slot = slotOf(A);
    clearTable();
    storeEntry(A, 3, BOUND_EXACT, 55, 0, MOVE_A);
    const a = wordsOf(slot);
    storeEntry(B, 6, BOUND_EXACT, -900, 0, MOVE_B);
    const b = wordsOf(slot);
    writeWords(slot, [a[0], a[1], b[2], b[3]] as number[]);
    expect(probeTable(A)).toBe(-1);
    expect(probeTable(B)).toBe(-1);
    // The other mix: words 0 and 1 from B, 2 and 3 from A.
    writeWords(slot, [b[0], b[1], a[2], a[3]] as number[]);
    expect(probeTable(A)).toBe(-1);
    expect(probeTable(B)).toBe(-1);
    // Restored whole, each hits again: the misses were the tear, not the keys.
    writeWords(slot, a);
    expect(probeTable(A)).toBe(slot);
    writeWords(slot, b);
    expect(probeTable(B)).toBe(slot);
  });

  it("a key whose keyLo and keyHi each have bit 31 set hits (catches a signed compare)", () => {
    const high = key(0x8000_0001, 0x8000_0abc);
    clearTable();
    storeEntry(high, 7, BOUND_EXACT, -12_345, 0, MOVE_A);
    const slot = probeTable(high);
    expect(slot).toBe(0x0abc);
    expect(tableCutoff(slot, 7, -Infinity, Infinity, 0)).toBe(-12_345);
  });

  it("a cleared slot never hits, even for key 0n whose XOR equations it satisfies (a zero data word is empty)", () => {
    clearTable();
    expect(wordsOf(0)).toEqual([0, 0, 0, 0]);
    expect(probeTable(0n)).toBe(-1);
  });

  describe("T10 — the verified copy: a store into the slot between probeTable and tableCutoff", () => {
    const d = 5;
    const sK = 123;
    const other = key(0x5555_5555, 0x0003_1234); // K', same slot as K
    /** K' 's four words as storeEntry would write them, captured from a real store. */
    function wordsForOther(depth: number, score: number): number[] {
      storeEntry(other, depth, BOUND_EXACT, score, 0, MOVE_B);
      const words = wordsOf(slotOf(other));
      clearTable();
      return words;
    }

    it("K' exact at depth d with another score: the cutoff returns s_K, not s_K' (a live score read fails)", () => {
      clearTable();
      const kPrimeWords = wordsForOther(d, -456);
      storeEntry(K, d, BOUND_EXACT, sK, 0, MOVE_A);
      const slot = probeTable(K);
      expect(slot).toBe(slotOf(K));
      writeWords(slot, kPrimeWords);
      // The slot now holds K' whole (read through the handle, not a probe, which would reset the copy).
      const [w0, w1, w2, w3] = wordsOf(slot) as [number, number, number, number];
      expect([(w0 ^ w2) >>> 0, (w1 ^ w3) >>> 0, w3 | 0]).toEqual([0x0003_1234, 0x5555_5555, -456]);
      expect(tableCutoff(slot, d, -Infinity, Infinity, 0)).toBe(sK);
    });

    it("K' at depth d + 1: the cutoff still returns s_K (a live depth read returns null)", () => {
      clearTable();
      const kPrimeWords = wordsForOther(d + 1, sK);
      storeEntry(K, d, BOUND_EXACT, sK, 0, MOVE_A);
      const slot = probeTable(K);
      expect(slot).toBe(slotOf(K));
      writeWords(slot, kPrimeWords);
      expect((wordsOf(slot)[2] as number) >>> 19).toBe(d + 1);
      expect(tableCutoff(slot, d, -Infinity, Infinity, 0)).toBe(sK);
    });
  });
});
