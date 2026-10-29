// ABC-227: copy the run outputs into raw/profiles/, host paths removed (ADR-0049 d4), profiles gzipped.
// Usage: node redact.mts <workDir>
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir, userInfo } from "node:os";

const work = process.argv[2];
if (!work) throw new Error("usage: redact.mts <workDir>");
const out = join(dirname(fileURLToPath(import.meta.url)), "profiles");
mkdirSync(out, { recursive: true });

function redact(text: string): string {
  return (
    text
      // file:///<anything>/src/x.ts -> file:///<repo>/src/x.ts (same for the raw/ scripts)
      .replace(/file:\/\/\/[^"]*?\/(src|\.grugops)\//g, "file:///<repo>/$1/")
      // any other absolute home or temp path
      .replace(/\/(home|Users|tmp)\/[^"\s]*/g, "<redacted-path>")
  );
}

let n = 0;
for (const name of readdirSync(work).sort()) {
  let raw = readFileSync(join(work, name), "utf8");
  if (name.endsWith(".heapprofile")) {
    // The per-sample list (one entry per 8 KiB sampled; ~400 k) is dropped to keep the commit small;
    // the call tree's selfSize, which every reading here uses, is its exact aggregate.
    const profile = JSON.parse(raw);
    profile.samplesDropped = profile.samples.length;
    delete profile.samples;
    raw = JSON.stringify(profile);
  }
  const text = redact(raw);
  if (text.includes(userInfo().username) || text.includes(homedir()) || /\/home\/|\/tmp\//.test(text)) throw new Error(`host path survived redaction in ${name}`);
  if (name.endsWith(".json")) writeFileSync(join(out, name), text);
  else writeFileSync(join(out, `${name}.gz`), gzipSync(text, { level: 9 }));
  n++;
}
console.log(`${n} files redacted into profiles/`);
