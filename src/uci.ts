#!/usr/bin/env node
/**
 * `ABC-168` (`ADR-0044` D2, D8, D10) — `skytalix`, the UCI entry point: the program a GUI, a tester
 * or a web backend launches. Lines in on stdin, lines out on stdout.
 *
 * IT EXPORTS NOTHING (`ADR-0011` clause 4). It is composition only, the `cli.ts` / `cli-options.ts`
 * split again: everything that can be unit-tested lives in `src/uci-session.ts`, which holds no
 * capability. This module binds the real ones, once each:
 *   - `process.stdin`, read line by line with `node:readline`, each line handed to the session;
 *   - `process.stdout`, acquired once into `sink`, its `EPIPE` arm installed before anything is
 *     written (`ADR-0016` clauses 3-4);
 *   - `Date.now` as the `Clock` and `Math.random` as the randomness;
 *   - ONE `createBookProbe`, its `read` the capability holder `readBookFile` (`ADR-0036` limb 1), its
 *     one warning written to the GUI as `info string <message>` (D10). Stdout, not stderr: a GUI
 *     shows `info string`, and the warning text is fixed and carries no byte of the file.
 *
 * EXIT CODES, the `cli.ts` shape (`ADR-0016` clause 2: still exactly three). `0` on `quit`, on end of
 * input, and when the reader of stdout goes away. `1` if any command-line argument is given: it
 * takes none, and nothing reaches stdout. `ABC-315`: the one exception is `--version` as the only
 * argument, which writes the version line to stdout and exits `0` without starting a session.
 * `70` (`sysexits.h` `EX_SOFTWARE`) when an exception escapes the session. Nothing here calls
 * `process.exit`: on macOS a pipe is asynchronous, and exiting on the spot truncates what was just
 * written. The process ends when its input is closed and its output has drained.
 */

import { createInterface } from "node:readline";
import { createBookProbe } from "./book.ts";
import { readBookFile } from "./book-file.ts";
import { createUciSession } from "./uci-session.ts";
import { readVersionLine } from "./version-file.ts";

const USAGE = "usage: skytalix (it takes no arguments; it speaks UCI on stdin and stdout)";
const USAGE_EXIT_CODE = 1;
/** `ABC-315` — the one argument accepted, and only on its own. */
const VERSION_ARGUMENT = "--version";
/** The thrown value is not echoed: the same trade `src/cli.ts`'s `INTERNAL_ERROR` records. */
const INTERNAL_ERROR = "internal error: a bug ended this session";
const INTERNAL_ERROR_EXIT_CODE = 70;

function main(): void {
  const versionOnly = process.argv.length === 3 && process.argv[2] === VERSION_ARGUMENT;
  if (process.argv.length > 2 && !versionOnly) {
    process.stderr.write(`${USAGE}\n`);
    process.exitCode = USAGE_EXIT_CODE;
    return;
  }

  const sink = process.stdout;

  // `ABC-315` — `--version` alone: one line, exit 0, no session. Its own `EPIPE` arm, installed
  // before the write (`ADR-0016` clause 4): the session's arm below ends a reader this path never
  // opens. A reader that went away is not a failure here either; any other code is re-thrown.
  if (versionOnly) {
    sink.on("error", (error) => {
      if ((error as NodeJS.ErrnoException).code !== "EPIPE") throw error;
    });
    // `R1`: a `package.json` that cannot be read ends like any internal failure: one fixed line,
    // exit 70, no stack and no path.
    try {
      sink.write(`${readVersionLine()}\n`);
    } catch {
      process.stderr.write(`${INTERNAL_ERROR}\n`);
      process.exitCode = INTERNAL_ERROR_EXIT_CODE;
    }
    return;
  }

  const source = process.stdin;
  const lines = createInterface({ input: source, crlfDelay: Number.POSITIVE_INFINITY });

  /**
   * Ends the session: no further line reaches the session. `close` alone does not stop `line`
   * events for input already buffered, so the flag is what guarantees it; destroying stdin lets
   * the process end while a GUI still holds the pipe open.
   */
  let ended = false;
  const end = (): void => {
    if (ended) return;
    ended = true;
    lines.close();
    source.destroy();
  };

  // `ADR-0016` clause 4: one listener, at the acquisition site, before the first write. `EPIPE`
  // means the reader went away, which is not this product's failure: the session ENDS, silently, at
  // exit 0 (a bare swallow would keep searching into a dead pipe). Any other code is re-thrown.
  sink.on("error", (error) => {
    if ((error as NodeJS.ErrnoException).code !== "EPIPE") throw error;
    end();
  });

  const write = (line: string): void => {
    sink.write(`${line}\n`);
  };
  const book = createBookProbe({
    read: readBookFile,
    warn: (message) => write(`info string ${message}`),
    random: Math.random,
  });
  const session = createUciSession({ write, now: Date.now, random: Math.random, book });

  lines.on("line", (line) => {
    if (ended) return;
    try {
      if (session.handleLine(line) === "quit") end();
    } catch {
      process.stderr.write(`${INTERNAL_ERROR}\n`);
      process.exitCode = INTERNAL_ERROR_EXIT_CODE;
      end();
    }
  });
}

main();
