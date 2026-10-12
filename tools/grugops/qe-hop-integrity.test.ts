/**
 * ABC-105 — `tools/grugops/qe-hop-integrity.js`, the QE-hop completeness check on the record.
 *
 * Imported in-process through the § Scope 5 seam (`parseDone`, `coverage`, `main`): 0 spawns.
 * `A1`, `A2`, `A3` and `A9` run against the REAL board and notes on disk (Test note 1); every
 * criterion that asserts exit 1 is shown going 0 -> 1 on one controlled change (Test note 2).
 * `A5`'s negative case and `A6` need synthetic trees, built in a temp directory.
 */
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { coverage, main, parseDone, readNotes } from "./qe-hop-integrity.js";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const SNAPSHOT_FILE = join(ROOT, ".grugops/qe-cutover-2026-08-17.txt");
const snapshotIds = readFileSync(SNAPSHOT_FILE, "utf8")
  .split("\n")
  .filter((l) => /^ABC-\d+$/.test(l));
const minus = (id: string) => snapshotIds.filter((s) => s !== id);

/** Run `main` with stdout and stderr captured; returns the exit code and the text. */
function run(argv: string[], options?: Parameters<typeof main>[1]) {
  let stdout = "";
  let stderr = "";
  const o = vi.spyOn(process.stdout, "write").mockImplementation((s) => {
    stdout += String(s);
    return true;
  });
  const e = vi.spyOn(process.stderr, "write").mockImplementation((s) => {
    stderr += String(s);
    return true;
  });
  try {
    return { code: main(argv, options), stdout, stderr };
  } finally {
    o.mockRestore();
    e.mockRestore();
  }
}

describe("ABC-105 Test note 5 — the committed cutover snapshot is pinned", () => {
  it("holds the 38 ids, including ABC-061 and ABC-062, excluding ABC-031 and ABC-076", () => {
    expect(snapshotIds).toHaveLength(38);
    expect(snapshotIds).toEqual(expect.arrayContaining(["ABC-061", "ABC-062"]));
    expect(snapshotIds).not.toContain("ABC-031");
    expect(snapshotIds).not.toContain("ABC-076");
  });
});

describe("ABC-105 A1 — it catches the measured failure (real notes)", () => {
  it("ABC-061 exits 0 out of scope on the committed snapshot, and 1 with it removed", () => {
    const committed = run(["--ticket", "ABC-061"]);
    expect(committed.code).toBe(0);
    expect(committed.stdout).toContain("ABC-061: out-of-scope (pre-cutover)");

    const removed = run(["--ticket", "ABC-061"], { snapshotIds: minus("ABC-061") });
    expect(removed.code).toBe(1);
    expect(removed.stdout).toContain("ABC-061: finding. No QE verdict note was found");
  });
});

describe("ABC-105 A2 — it passes a real QE hop (real notes)", () => {
  it.each([
    ["ABC-031", "quality-gate-ABC-031-qe-2026-08-17/notes/"],
    ["ABC-076", "quality-gate-ABC-076-qe-2026-08-17/notes/"],
  ])("%s exits 0 and names its covering note under %s", (id, folder) => {
    const r = run(["--ticket", id]);
    expect(r.code).toBe(0);
    expect(r.stdout).toContain(`${id}: covered (qe-e2e).`);
    expect(r.stdout).toContain(`Covering note: .grugops/context/${folder}`);
    expect(r.stdout).not.toMatch(/Covering note: \S*ticket-to-pr-/);
  });

  it("ABC-076's covering notes cite it only as a path, so an exact-element reading would fail", () => {
    const notes = readNotes(join(ROOT, ".grugops/context"), (f) => /abc-?0*76(?!\d)/i.test(f));
    const covering = coverage("ABC-076", notes, snapshotIds).notes;
    expect(covering.length).toBeGreaterThan(0);
    for (const path of covering) {
      const note = notes.find((n) => n.path === path);
      expect(note?.refs).not.toContain("ABC-076");
      expect(note?.refs.some((r) => /plans\/tickets\/ABC-076-/.test(r))).toBe(true);
    }
  });
});

describe("ABC-105 A3 — the refs-only false pass is closed (real notes)", () => {
  it("a qe-e2e decision under quality-gate-ABC-066-qe cites ABC-062 in refs (the trap exists)", () => {
    const notes = readNotes(join(ROOT, ".grugops/context"), (f) => f === "quality-gate-ABC-066-qe");
    const citing = notes.filter(
      (n) => n.by === "qe-e2e" && n.kind === "decision" && n.refs.includes("ABC-062"),
    );
    expect(citing.length).toBeGreaterThan(0);
  });

  it("ABC-062 exits 0 on the committed snapshot, and 1 with it removed: the folder does not name it", () => {
    expect(run(["--ticket", "ABC-062"]).code).toBe(0);
    const removed = run(["--ticket", "ABC-062"], { snapshotIds: minus("ABC-062") });
    expect(removed.code).toBe(1);
    expect(removed.stdout).toContain("ABC-062: finding. No QE verdict note was found");
    expect(removed.stdout).not.toContain("quality-gate-ABC-066-qe");
  });
});

describe("ABC-105 A9 — the security-nfr substitute is visible, not silent (real notes)", () => {
  it("ABC-072 exits 0 with the substitute label and its secnfr-ABC-072 note", () => {
    const r = run(["--ticket", "ABC-072"]);
    expect(r.code).toBe(0);
    expect(r.stdout).toContain(
      "ABC-072: covered (security-nfr substitute — docs-only rule).\n" +
        "  Covering note: .grugops/context/secnfr-ABC-072/notes/",
    );
  });

  it("ABC-073 exits 1 (its verdict sits in a folder naming ABC-072), and 0 only if grandfathered", () => {
    const r = run(["--ticket", "ABC-073"]);
    expect(r.code).toBe(1);
    expect(r.stdout).toContain("ABC-073: finding.");
    expect(run(["--ticket", "ABC-073"], { snapshotIds: [...snapshotIds, "ABC-073"] }).code).toBe(0);
  });
});

describe("ABC-105 A4 — the sweep's counts partition the Done rows (real board)", () => {
  it("prints each count line and every finding by id, exits 1; 0 when every row is grandfathered", () => {
    const r = run(["--sweep", "--json"]);
    expect(r.code).toBe(1);
    const report = JSON.parse(r.stdout);
    const { done, preCutover, coveredQe, coveredSubstitute, findings } = report.counts;
    expect(preCutover).toBe(38);
    expect(preCutover + coveredQe + coveredSubstitute + findings).toBe(done);
    expect(findings).toBeGreaterThan(0);

    const text = run(["--sweep"]);
    expect(text.code).toBe(1);
    for (const label of [
      `Done rows: ${done}`,
      `Pre-cutover (out of scope; .grugops/qe-cutover-2026-08-17.txt): ${preCutover}`,
      `Covered (qe-e2e): ${coveredQe}`,
      `Covered (security-nfr substitute — docs-only rule): ${coveredSubstitute}`,
      `In-scope findings: ${findings}`,
    ]) {
      expect(text.stdout).toContain(`${label}\n`);
    }
    for (const f of report.results.filter((x: { status: string }) => x.status === "finding")) {
      expect(text.stdout).toContain(`  ${f.id}: no QE verdict note was found.`);
    }

    const board = readFileSync(join(ROOT, "plans/board.md"), "utf8");
    expect(run(["--sweep"], { snapshotIds: parseDone(board) ?? [] }).code).toBe(0);
  });

  it("parses only the line-leading `- [ABC-xxx]` rows of `## Done`", () => {
    const board = [
      "## In Review",
      "- [ABC-900] not done",
      "## Done (WIP unlimited)",
      "- [ABC-901] done, mentions ABC-902 and ABC-903",
      "  - [ABC-904] indented, not a row",
      "- [EPIC-001] not a ticket",
      "- [ABC-905] done",
      "## Blocked",
      "- [ABC-906] not done",
    ].join("\n");
    expect(parseDone(board)).toEqual(["ABC-901", "ABC-905"]);
    expect(parseDone("## Backlog\n- [ABC-001] x\n")).toBeNull();
  });
});

describe("ABC-105 A5 — id normalisation decides both the folder and the refs condition", () => {
  const note = (folder: string, refs: string[], by = "qe-e2e") => ({
    path: `.grugops/context/${folder}/notes/x.md`,
    folder,
    kind: "decision",
    by,
    refs,
    malformed: null,
  });

  it("matches abc031-… to ABC-031, case-insensitive, optional hyphen, zero-padded", () => {
    expect(coverage("ABC-031", [note("abc031-review", ["ABC-031"])], []).status).toBe(
      "covered (qe-e2e)",
    );
    expect(coverage("ABC-031", [note("qe-ABC-31", ["abc031"])], []).status).toBe(
      "covered (qe-e2e)",
    );
  });

  it("does not match ABC-006 to …abc0066… in the folder or in refs", () => {
    expect(coverage("ABC-006", [note("qe-abc0066-x", ["ABC-006"])], []).status).toBe("finding");
    expect(coverage("ABC-006", [note("qe-ABC-006", ["abc0066"])], []).status).toBe("finding");
    expect(coverage("ABC-006", [note("qe-ABC-006", ["ABC-006"])], []).status).toBe(
      "covered (qe-e2e)",
    );
  });

  it("rejects T's own ticket-to-pr-* folder and a non-decision kind", () => {
    expect(coverage("ABC-044", [note("ticket-to-pr-ABC-044-x", ["ABC-044"])], []).status).toBe(
      "finding",
    );
    const observation = { ...note("qe-ABC-070", ["ABC-070"]), kind: "observation" };
    expect(coverage("ABC-070", [observation], []).status).toBe("finding");
  });
});

describe("ABC-105 A6 and Test note 3 — fail-closed on synthetic trees; no override flag", () => {
  let root = "";
  const good = "---\nkind: decision\nby: qe-e2e\nrefs:\n  - ABC-200\n---\n# ok\n";
  function tree(notes: Record<string, string>) {
    root = mkdtempSync(join(tmpdir(), "qe-hop-"));
    mkdirSync(join(root, "plans"));
    writeFileSync(join(root, "plans/board.md"), "## Done\n- [ABC-200] x\n- [ABC-001] y\n");
    mkdirSync(join(root, ".grugops/context"), { recursive: true });
    writeFileSync(join(root, ".grugops/qe-cutover-2026-08-17.txt"), "# header\nABC-001\n");
    for (const [rel, text] of Object.entries(notes)) {
      const dir = join(root, ".grugops/context", rel, "..");
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(root, ".grugops/context", rel), text);
    }
    return root;
  }
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
    root = "";
  });

  it("a well-formed tree exits 0", () => {
    const r = run(["--sweep"], { root: tree({ "qe-ABC-200/notes/a.md": good }) });
    expect(r.code).toBe(0);
    expect(r.stdout).toContain("In-scope findings: 0\n");
  });

  it.each([
    ["the first line is not ---", "kind: decision\n---\n"],
    ["no closing --- line", "---\nkind: decision\nby: qe-e2e\n"],
    ['line 3 is neither "key: value"', "---\nkind: decision\nnot a key line\n---\n"],
  ])("malformed front matter (%s) is an UNKNOWN - verify finding with its path", (reason, text) => {
    const r = run(["--sweep"], {
      root: tree({ "qe-ABC-200/notes/a.md": good, "other-folder/notes/bad.md": text }),
    });
    expect(r.code).toBe(1);
    expect(r.stdout).toContain("Malformed front matter (UNKNOWN - verify): 1\n");
    expect(r.stdout).toContain(`.grugops/context/other-folder/notes/bad.md: ${reason}`);
  });

  it("under --ticket only malformed notes in a folder naming T are reported", () => {
    const bad = "---\nkind: decision\n";
    const elsewhere = { "qe-ABC-200/notes/a.md": good, "other-folder/notes/bad.md": bad };
    expect(run(["--ticket", "ABC-200"], { root: tree(elsewhere) }).code).toBe(0);
    rmSync(root, { recursive: true, force: true });
    const inFolder = { "qe-ABC-200/notes/a.md": good, "qe-ABC-200/notes/bad.md": bad };
    const r = run(["--ticket", "ABC-200"], { root: tree(inFolder) });
    expect(r.code).toBe(1);
    expect(r.stdout).toContain("UNKNOWN - verify: the front matter of .grugops/context/qe-ABC-200");
  });

  it("missing board, missing snapshot and an unreadable note each exit 2 with a stderr message", () => {
    const notes = { "qe-ABC-200/notes/a.md": good };
    rmSync(join(tree(notes), "plans/board.md"));
    let r = run(["--sweep"], { root });
    expect([r.code, r.stdout]).toEqual([2, ""]);
    expect(r.stderr).toContain("cannot read the board file plans/board.md");
    rmSync(root, { recursive: true, force: true });

    rmSync(join(tree(notes), ".grugops/qe-cutover-2026-08-17.txt"));
    r = run(["--ticket", "ABC-200"], { root, snapshotIds: [] });
    expect([r.code, r.stdout]).toEqual([2, ""]);
    expect(r.stderr).toContain("cannot read the cutover snapshot");
    rmSync(root, { recursive: true, force: true });

    chmodSync(join(tree(notes), ".grugops/context/qe-ABC-200/notes/a.md"), 0o000);
    r = run(["--sweep"], { root });
    expect([r.code, r.stdout]).toEqual([2, ""]);
    expect(r.stderr).toContain("cannot read the note .grugops/context/qe-ABC-200/notes/a.md");
  });

  it("refuses a symbolic link under .grugops/context with exit 2 and does not follow it", () => {
    const outside = mkdtempSync(join(tmpdir(), "qe-hop-outside-"));
    try {
      mkdirSync(join(outside, "notes"));
      writeFileSync(join(outside, "notes/a.md"), good);
      symlinkSync(outside, join(tree({}), ".grugops/context/qe-ABC-200"));
      const r = run(["--sweep"], { root });
      expect([r.code, r.stdout]).toEqual([2, ""]);
      expect(r.stderr).toContain(
        "refusing to follow the symbolic link .grugops/context/qe-ABC-200",
      );
    } finally {
      rmSync(outside, { recursive: true, force: true });
    }
  });

  it.each([
    [["--sweep", "--force"]],
    [["--ticket", "ABC-061", "--skip"]],
    [["--sweep", "--allow", "ABC-061"]],
    [["--sweep", "--snapshot", "x.txt"]],
    [[]],
    [["--sweep", "--ticket", "ABC-061"]],
    [["--ticket", "61"]],
  ])("refuses %j with exit 2", (argv) => {
    const r = run(argv);
    expect(r.code).toBe(2);
    expect(r.stderr).toContain("Usage:");
  });
});
