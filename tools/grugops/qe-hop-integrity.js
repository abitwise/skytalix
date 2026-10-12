// qe-hop-integrity.js — the QE-hop completeness check on the record (ABC-105).
//
// WHAT IT CHECKS. A ticket T is COVERED when some note under .grugops/context/*/notes/*.md meets
// all four conditions:
//   1. its front matter says `by: qe-e2e` (or `by: security-nfr`, reported separately as the
//      owner's substitute for docs-only tickets, ABC-105 A9);
//   2. its front matter says `kind: decision` (a verdict, not an observation);
//   3. some element of its `refs:` list names T (a bare id, a ticket path or a note id);
//   4. the task folder it sits in names T, and that folder is not T's own `ticket-to-pr-*`.
// "Names T" is one token rule used for both 3 and 4: `abc`, an optional hyphen, digits, not
// preceded by a letter or digit and not followed by a digit, compared by number (abc031 is
// ABC-031; abc0066 is not ABC-006). The note's front matter is the source of truth; the filename
// is not read.
//
// WHAT IT DOES NOT PROVE. The presence of a note is NOT proof that a QE hop ran. `by: qe-e2e` is
// self-declared metadata in a hand-authored file, and this tool has no signal from outside the
// record it checks. It is a completeness check on the record, not evidence of the work: it
// catches a silently omitted QE verdict (the ABC-061/062/063/064/068 failure) and it does not
// catch a forged one. It also cannot tell a pre-build QE note from a post-build verdict: QE's
// pre-build re-check in `qe-recheck-ABC-105` already satisfies all four conditions for ABC-105
// itself. Every covering note's path is printed so the human at the `Done` exit can see which
// note it was.
//
// SCOPE. Forward-only from the owner's 2026-08-17 directive. The ids of the `## Done` rows of
// `git show 9998a544:plans/board.md` are committed once in .grugops/qe-cutover-2026-08-17.txt and
// are reported `out-of-scope (pre-cutover)`, never as findings. This tool has no mode that writes
// that file and no flag that overrides it.
//
// USAGE (hand-run; node: builtins only; reads, never writes, never executes what it reads):
//   node tools/grugops/qe-hop-integrity.js --ticket ABC-xxx [--json]   blocking, at the Done exit
//   node tools/grugops/qe-hop-integrity.js --sweep [--json]            reporting, all Done rows
//     exit 0 -> no in-scope finding
//     exit 1 -> at least one finding (a ticket with no QE verdict note, or a note whose front
//               matter is malformed, reported as UNKNOWN - verify)
//     exit 2 -> could not run (bad arguments, a missing board or snapshot, an unreadable note,
//               a symbolic link under .grugops/context)
// Findings stand permanently: nothing here clears one. A reader of --sweep reads the list, not
// only the exit code.
import { lstatSync, readdirSync, readFileSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_ROOT = fileURLToPath(new URL("../../", import.meta.url));
const BOARD = "plans/board.md";
const CONTEXT = ".grugops/context";
const SNAPSHOT = ".grugops/qe-cutover-2026-08-17.txt";

const QE = "covered (qe-e2e)";
const SUBSTITUTE = "covered (security-nfr substitute — docs-only rule)";
const PRE_CUTOVER = "out-of-scope (pre-cutover)";
const FINDING = "finding";

const ID_TOKEN = /(?<![a-z0-9])abc-?(\d+)(?!\d)/gi;
const KEY_LINE = /^([A-Za-z_][A-Za-z0-9_-]*):(?:[ \t](.*))?$/;
const ITEM_LINE = /^[ \t]+-(?:[ \t](.*))?$/;

/** @param {string} id */
function idNumber(id) {
  return Number(/^ABC-(\d+)$/.exec(id)?.[1]);
}

/** True when `text` names ticket number `n` under the token rule (ABC-105 A5). */
function names(/** @type {string} */ text, /** @type {number} */ n) {
  for (const m of text.matchAll(ID_TOKEN)) if (Number(m[1]) === n) return true;
  return false;
}

/**
 * The ids of the line-leading `- [ABC-xxx]` rows between `## Done` and the next `## ` heading,
 * in board order; null when the board has no `## Done` heading.
 * @param {string} boardText
 * @returns {string[] | null}
 */
export function parseDone(boardText) {
  const lines = boardText.split("\n");
  const start = lines.findIndex((l) => /^## Done\b/.test(l));
  if (start === -1) return null;
  const ids = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith("## ")) break;
    const m = /^- \[(ABC-\d+)\]/.exec(line);
    if (m?.[1]) ids.push(m[1]);
  }
  return ids;
}

/**
 * Parse one note's front matter with String.split. Returns the three fields the rule reads, or
 * the reason the block is malformed (ABC-105 A6).
 * @param {string} text
 */
function parseFrontMatter(text) {
  const lines = text.split("\n");
  if (lines[0] !== "---") return { malformed: "the first line is not ---" };
  const end = lines.indexOf("---", 1);
  if (end === -1) return { malformed: "no closing --- line" };
  /** @type {Record<string, string>} */
  const values = {};
  /** @type {Record<string, string[]>} */
  const items = {};
  let lastKey = "";
  for (let i = 1; i < end; i++) {
    const line = lines[i] ?? "";
    if (line.trim() === "") continue;
    const key = KEY_LINE.exec(line);
    if (key?.[1]) {
      lastKey = key[1];
      values[lastKey] = (key[2] ?? "").trim();
      items[lastKey] = [];
      continue;
    }
    const item = ITEM_LINE.exec(line);
    if (item && lastKey !== "") {
      items[lastKey]?.push((item[1] ?? "").trim());
      continue;
    }
    return { malformed: `line ${i + 1} is neither "key: value" nor an indented "- item"` };
  }
  const refs = [...(items.refs ?? [])];
  if (values.refs) refs.unshift(values.refs); // an inline `refs: [a, b]` is one element, as written
  return { kind: values.kind ?? "", by: values.by ?? "", refs };
}

/**
 * @typedef {{ path: string, folder: string, kind: string, by: string, refs: string[],
 *   malformed: string | null }} Note
 */

/**
 * Read every `<contextDir>/<folder>/notes/*.md`. Throws (the caller exits 2) on an unreadable
 * note or any symbolic link, so no link is ever followed out of the context tree. With a
 * `folderFilter`, only folders it accepts are opened.
 * @param {string} contextDir
 * @param {(folder: string) => boolean} [folderFilter]
 * @returns {Note[]}
 */
export function readNotes(contextDir, folderFilter) {
  /** @type {Note[]} */
  const notes = [];
  const refuseLink = (/** @type {string} */ p) => {
    throw new Error(`refusing to follow the symbolic link ${p}`);
  };
  for (const folder of readdirSync(contextDir, { withFileTypes: true })) {
    if (folder.isSymbolicLink()) refuseLink(join(CONTEXT, folder.name));
    if (!folder.isDirectory() || (folderFilter && !folderFilter(folder.name))) continue;
    const notesDir = join(contextDir, folder.name, "notes");
    let stat;
    try {
      stat = lstatSync(notesDir);
    } catch {
      continue; // a task folder with no notes/ directory holds no notes
    }
    if (stat.isSymbolicLink()) refuseLink(join(CONTEXT, folder.name, "notes"));
    if (!stat.isDirectory()) continue;
    for (const entry of readdirSync(notesDir, { withFileTypes: true })) {
      if (!entry.name.endsWith(".md")) continue;
      const path = join(CONTEXT, folder.name, "notes", entry.name);
      if (entry.isSymbolicLink()) refuseLink(path);
      let text;
      try {
        text = readFileSync(join(notesDir, entry.name), "utf8");
      } catch {
        throw new Error(`cannot read the note ${path}`);
      }
      const fm = parseFrontMatter(text);
      notes.push({
        path,
        folder: folder.name,
        kind: fm.kind ?? "",
        by: fm.by ?? "",
        refs: fm.refs ?? [],
        malformed: fm.malformed ?? null,
      });
    }
  }
  return notes.sort((a, b) => (a.path < b.path ? -1 : 1));
}

/**
 * Decide one ticket under the four conditions.
 * @param {string} id  a ticket id in ABC-xxx form
 * @param {Note[]} notes
 * @param {Iterable<string>} snapshotIds  the pre-cutover ids
 * @returns {{ id: string, status: string, notes: string[] }}
 */
export function coverage(id, notes, snapshotIds) {
  const n = idNumber(id);
  for (const s of snapshotIds) if (idNumber(s) === n) return { id, status: PRE_CUTOVER, notes: [] };
  const qe = [];
  const substitute = [];
  for (const note of notes) {
    if (note.malformed || note.kind !== "decision") continue;
    if (!names(note.folder, n)) continue;
    if (note.folder.toLowerCase().startsWith("ticket-to-pr-")) continue; // T's own t2p folder
    if (!note.refs.some((r) => names(r, n))) continue;
    if (note.by === "qe-e2e") qe.push(note.path);
    else if (note.by === "security-nfr") substitute.push(note.path);
  }
  if (qe.length > 0) return { id, status: QE, notes: qe };
  if (substitute.length > 0) return { id, status: SUBSTITUTE, notes: substitute };
  return { id, status: FINDING, notes: [] };
}

/** @param {string} text */
function readSnapshot(text) {
  const ids = [];
  for (const [i, line] of text.split("\n").entries()) {
    if (line === "" || line.startsWith("#")) continue;
    if (!/^ABC-\d+$/.test(line)) throw new Error(`${SNAPSHOT} line ${i + 1} is not an ABC-xxx id`);
    ids.push(line);
  }
  return ids;
}

const USAGE =
  "Usage: node tools/grugops/qe-hop-integrity.js (--ticket ABC-xxx | --sweep) [--json]";
const CEILING =
  "This is a completeness check on the record: a note's presence is not proof that a QE hop ran.";

/**
 * @param {string[]} argv
 * @param {{ snapshotIds?: string[], root?: string, notes?: Note[] }} [options]  in-memory test seam only; the
 *   command line can supply neither
 * @returns {0 | 1 | 2}
 */
export function main(argv, options = {}) {
  /** @type {(msg: string) => 2} */
  const fail = (msg) => {
    process.stderr.write(`Error: ${msg}\n${USAGE}\n`);
    return 2;
  };
  let ticket = "";
  let sweep = false;
  let json = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i] ?? "";
    if (a === "--sweep") sweep = true;
    else if (a === "--json") json = true;
    else if (a === "--ticket") ticket = argv[++i] ?? "";
    else if (a.startsWith("--ticket=")) ticket = a.slice("--ticket=".length);
    else return fail(`unrecognised argument "${a}".`);
  }
  if (sweep === (ticket !== "")) return fail("give exactly one of --ticket ABC-xxx or --sweep.");
  if (ticket !== "" && !/^ABC-\d{3,}$/.test(ticket)) {
    return fail(`"${ticket}" is not a ticket id of the form ABC-xxx.`);
  }

  const root = options.root ?? DEFAULT_ROOT;
  let doneIds;
  let snapshotIds;
  let notes;
  try {
    let board;
    try {
      board = readFileSync(join(root, BOARD), "utf8");
    } catch {
      throw new Error(`cannot read the board file ${BOARD}.`);
    }
    doneIds = parseDone(board);
    if (doneIds === null) throw new Error(`${BOARD} has no "## Done" section.`);
    let snapshot;
    try {
      snapshot = readFileSync(join(root, SNAPSHOT), "utf8");
    } catch {
      throw new Error(`cannot read the cutover snapshot ${SNAPSHOT}.`);
    }
    snapshotIds = options.snapshotIds ?? readSnapshot(snapshot);
    const n = idNumber(ticket);
    notes = options.notes ?? readNotes(join(root, CONTEXT), sweep ? undefined : (f) => names(f, n));
  } catch (e) {
    return fail(e instanceof Error ? e.message : String(e));
  }

  const malformed = notes.filter((note) => note.malformed);
  const out = (/** @type {string} */ line) => process.stdout.write(`${line}\n`);

  if (!sweep) {
    const result = coverage(ticket, notes, snapshotIds);
    const failed = result.status === FINDING || malformed.length > 0;
    if (json) {
      out(
        JSON.stringify({
          ok: !failed,
          mode: "ticket",
          ...result,
          doneRow: doneIds.includes(ticket),
          malformed: malformed.map((m) => ({ path: m.path, reason: m.malformed })),
        }),
      );
      return failed ? 1 : 0;
    }
    if (result.status === PRE_CUTOVER) {
      out(`${ticket}: ${PRE_CUTOVER}. It is listed in ${SNAPSHOT}; it is not checked.`);
    } else if (result.status === FINDING) {
      out(
        `${ticket}: finding. No QE verdict note was found: no "kind: decision" note authored ` +
          `"by: qe-e2e" (or "by: security-nfr") names ${ticket} in "refs:" from a context ` +
          `folder that names ${ticket} and is not its own ticket-to-pr-* folder.`,
      );
    } else {
      out(`${ticket}: ${result.status}.`);
      for (const p of result.notes) out(`  Covering note: ${p}`);
      out(CEILING);
    }
    for (const m of malformed) {
      out(`UNKNOWN - verify: the front matter of ${m.path} is malformed (${m.malformed}).`);
    }
    out(`${ticket} is ${doneIds.includes(ticket) ? "" : "not "}a row in "## Done" of ${BOARD}.`);
    return failed ? 1 : 0;
  }

  const results = doneIds.map((id) => coverage(id, notes, snapshotIds));
  /** @param {string} status */
  const of = (status) =>
    results.filter((r) => r.status === status).sort((a, b) => (a.id < b.id ? -1 : 1));
  const findings = of(FINDING);
  const failed = findings.length > 0 || malformed.length > 0;
  if (json) {
    out(
      JSON.stringify({
        ok: !failed,
        mode: "sweep",
        counts: {
          done: doneIds.length,
          preCutover: of(PRE_CUTOVER).length,
          coveredQe: of(QE).length,
          coveredSubstitute: of(SUBSTITUTE).length,
          findings: findings.length,
          malformed: malformed.length,
        },
        results,
        malformed: malformed.map((m) => ({ path: m.path, reason: m.malformed })),
      }),
    );
    return failed ? 1 : 0;
  }
  out(`QE-hop integrity sweep of the "## Done" rows in ${BOARD}.`);
  out(`Done rows: ${doneIds.length}`);
  out(`Pre-cutover (out of scope; ${SNAPSHOT}): ${of(PRE_CUTOVER).length}`);
  out(`Covered (qe-e2e): ${of(QE).length}`);
  out(`  ${of(QE).map((r) => r.id).join(" ")}`);
  out(`Covered (security-nfr substitute — docs-only rule): ${of(SUBSTITUTE).length}`);
  for (const r of of(SUBSTITUTE)) out(`  ${r.id}: ${r.notes.join(", ")}`);
  out(`In-scope findings: ${findings.length}`);
  for (const r of findings) out(`  ${r.id}: no QE verdict note was found.`);
  out(`Malformed front matter (UNKNOWN - verify): ${malformed.length}`);
  for (const m of malformed) out(`  ${m.path}: ${m.malformed}`);
  out(CEILING);
  return failed ? 1 : 0;
}

const argv1 = process.argv[1];
if (argv1 && realpathSync(argv1) === fileURLToPath(import.meta.url)) process.exitCode = main(process.argv.slice(2));
