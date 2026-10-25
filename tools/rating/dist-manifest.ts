/**
 * `ABC-204` QE-204-b — the record of one built engine in `artifacts.txt`. `dist/uci.js` alone does
 * not identify a build (it imports the other `dist/` files), so this hashes every file under
 * `dist/`. The manifest lines are `<sha256>  ./<path>`, sorted by path, and the tree hash is the
 * sha256 of those lines. The same figure comes from the shell:
 *
 *   cd dist && find . -type f | LC_ALL=C sort | xargs shasum -a 256 | shasum -a 256
 */
import { createHash } from "node:crypto";
import { lstatSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const sha256 = (data: Buffer | string): string => createHash("sha256").update(data).digest("hex");

/** Every regular file under `dir` as `./a/b.js`, sorted; anything else (a symlink) is a stop. */
function files(dir: string, prefix = "."): string[] {
  const found: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const rel = `${prefix}/${name}`;
    const stat = lstatSync(path);
    if (stat.isDirectory()) found.push(...files(path, rel));
    else if (stat.isFile()) found.push(rel);
    else throw new Error(`${path}: not a regular file or directory`);
  }
  return found;
}

export interface DistManifest {
  readonly lines: string[];
  readonly tree: string;
}

/** The sorted per-file manifest of `dist` and the one hash over it. */
export function distManifest(dist: string): DistManifest {
  const rels = files(dist).sort((a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b)));
  const lines = rels.map((rel) => `${sha256(readFileSync(join(dist, rel)))}  ${rel}`);
  return { lines, tree: sha256(lines.map((line) => `${line}\n`).join("")) };
}

/** The `artifacts.txt` block for one side: the tree hash line, then the manifest, indented. */
export function artifactRecord(name: string, sha: string, dist: string): string {
  const { lines, tree } = distManifest(dist);
  return `${name} ${sha} dist/ (${lines.length} files) tree sha256 ${tree}\n${lines.map((l) => `  ${l}\n`).join("")}`;
}
