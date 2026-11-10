/**
 * `ABC-315` `A4` — `--version` on both entry points. The version line is read from `package.json`
 * by `src/version-file.ts`; the rows below prove it in process, then through each DELIVERED entry
 * point in a child, because an entry point exports nothing (`ADR-0011` clause 4).
 *
 * THREE CHILDREN, in the default lane, each one `node <entry> --version` that writes one line and
 * exits: no search, no book, no stdin. The `src/uci.real-engine.test.ts` form: `spawnSync`
 * (`ABC-173` `C2`), the argument-array form, no shell, `process.execPath`, a fixed argv, a `timeout`,
 * a loud throw on `child.error`, an EMPTY child environment, and the worker's heap token in argv.
 * The resolver's `--version` rows, at zero spawn cost, are in `src/cli.test.ts`.
 */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { readVersionLine } from "./version-file.ts";

const REPOSITORY = new URL("..", import.meta.url).pathname;
const CLI = new URL("cli.ts", import.meta.url).pathname;
const UCI = new URL("uci.ts", import.meta.url).pathname;
const HANG_GUARD_MS = 20_000;

/** `ABC-173`: the last `--max-old-space-size=<digits>` in this worker's `NODE_OPTIONS`, or a throw. */
const heapToken = (): string => {
  const tokens = (process.env.NODE_OPTIONS ?? "").match(
    /(?:^|\s)(--max-old-space-size=\d+)(?=\s|$)/g,
  );
  const last = tokens?.at(-1)?.trim();
  if (last === undefined)
    throw new Error("no --max-old-space-size=<digits> in NODE_OPTIONS: run this file via npm test");
  return last;
};

/** This file's one spawn site. */
const run = (entry: string, ...args: readonly string[]) => {
  const argv = [heapToken(), entry, ...args];
  const child = spawnSync(process.execPath, argv, {
    cwd: REPOSITORY,
    encoding: "utf8",
    env: {},
    stdio: ["ignore", "pipe", "pipe"],
    timeout: HANG_GUARD_MS,
  });
  if (child.error !== undefined)
    throw new Error(`child ${process.execPath} ${argv.join(" ")} failed: ${child.error}`);
  return child;
};

describe("ABC-315 — the version line comes from package.json", () => {
  it("is the package's name and version, and the version is MAJOR.MINOR.PATCH", () => {
    const packaged = JSON.parse(readFileSync(`${REPOSITORY}package.json`, "utf8")) as {
      readonly name: string;
      readonly version: string;
    };
    expect(packaged.name).toBe("skytalix");
    expect(packaged.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(readVersionLine()).toBe(`skytalix ${packaged.version}`);
  });
});

describe("ABC-315 A4 — `--version` through each delivered entry point", () => {
  it("`node src/cli.ts --version` prints the version line, exit 0, nothing on stderr", () => {
    const child = run(CLI, "--version");
    expect(child.stdout).toBe(`${readVersionLine()}\n`);
    expect(child.stderr).toBe("");
    expect(child.signal).toBeNull();
    expect(child.status).toBe(0);
  });

  it("`node src/uci.ts --version` prints the version line, exit 0, nothing on stderr", () => {
    const child = run(UCI, "--version");
    expect(child.stdout).toBe(`${readVersionLine()}\n`);
    expect(child.stderr).toBe("");
    expect(child.signal).toBeNull();
    expect(child.status).toBe(0);
  });

  it("`node src/uci.ts --version <more>` is still the usage error: exit 1, nothing on stdout", () => {
    const child = run(UCI, "--version", "--version");
    expect(child.stdout).toBe("");
    expect(child.stderr).toBe(
      "usage: skytalix (it takes no arguments; it speaks UCI on stdin and stdout)\n",
    );
    expect(child.signal).toBeNull();
    expect(child.status).toBe(1);
  });
});

/**
 * `ABC-315` `G2` — the `EPIPE` arm on `src/uci.ts`'s `--version` path, read as text (no child). Without
 * the arm, `--version | true` exits non-zero; no spawn row here can close the reader reliably, so the
 * shape is pinned: the arm is registered before the one write, re-throws any other code, and the
 * block writes once (inside `R1`'s `try`).
 */
describe("ABC-315 G2 — uci `--version` installs its EPIPE arm before its one write", () => {
  it('the versionOnly block: `sink.on("error"` before the write, a re-throw, exactly one write', () => {
    const source = readFileSync(UCI, "utf8");
    const start = source.indexOf("if (versionOnly) {");
    expect(start).toBeGreaterThanOrEqual(0);
    const end = source.indexOf("\n  }\n", start);
    expect(end).toBeGreaterThan(start);
    const block = source.slice(start, end);
    const arm = block.indexOf('sink.on("error"');
    // biome-ignore lint/suspicious/noTemplateCurlyInString: this string IS source, and `${` is its subject
    const write = block.indexOf("sink.write(`${readVersionLine()}\\n`)");
    expect(arm).toBeGreaterThanOrEqual(0);
    expect(write).toBeGreaterThan(arm);
    expect(block.slice(arm, write)).toMatch(
      /if \(\(error as NodeJS\.ErrnoException\)\.code !== "EPIPE"\) throw error;/,
    );
    expect(block.split("sink.write(").length - 1).toBe(1);
  });
});
