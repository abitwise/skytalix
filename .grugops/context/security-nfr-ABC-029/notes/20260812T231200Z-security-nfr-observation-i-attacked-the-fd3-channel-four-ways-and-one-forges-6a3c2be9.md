---
id: 20260812T231200Z-security-nfr-observation-i-attacked-the-fd3-channel-four-ways-and-one-forges-6a3c2be9
kind: observation
by: security-nfr
at: 2026-08-12T23:12:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - A2
  - ADR-0011
  - NFR-002
  - EPIC-006
  - src/history-pane.nfr.test.ts
supersedes:
---

# I attacked the fd-3 channel four ways. Three are contained. **ONE FORGES THE REPORT COMPLETELY — and it is still not a required fix, for a reason I will state rather than assume**

> **`kind: observation`, not `finding`** — no `§14-gate` verdict record under this task,
> `human_admission` **`off`**. **Every row below is a real vitest run of the REAL instrument against a
> mutated out-of-tree copy.** The unmutated control was run first and is green **11/11**; no verdict
> was taken without it.

The brief asked me to satisfy myself the channel cannot be **forged** or **injected into**. QE found
`WSTDOUT-JSON` — a mutant that could have forged the OLD channel rather than merely corrupting it.
**I took that as the standard and tried to do the same thing to the new one.** The mutation site is
`src/glyph-mode.ts`, a **declared frame producer**, therefore a probe **ROOT** — the strongest
position a production module can occupy against this probe.

## The four attacks

| # | build | line prepended to `glyph-mode.ts` | **result** |
|---|---|---|---|
| — | **CONTROL** | *(none)* | **green, 11/11** |
| 1 | **`WSTDOUT-JSON`** | `console.log('{"closure":["history-pane.ts","san.ts"],"armed":["history.ts"]}')` | **green, 11/11 — the forgery is INVISIBLE.** stdout is `ignore`d; the old channel's forgery route is gone, confirmed independently |
| 2 | **`WFD3-PREFIX`** | `writeSync(3, '<forged report>')` at module scope | **RED — `SyntaxError: Unexpected non-whitespace character after JSON at position 63`.** The forgery CONCATENATES with the probe's own write and `JSON.parse` refuses it. **Degrades to a loud red, never to a pass** |
| 3 | **`WFD3-CLOSE`** | `closeSync(3)` at module scope | **RED — `probe child failed (1): node:fs:922 …`**, the child's own stderr surfaced. The guard cannot pass by being unable to look |
| 4 | **`WFD3-EXIT`** | `writeSync(3, '<forged report>'); process.exit(0);` | **green, 11/11 — THE REPORT IS FORGED.** Both positive controls, the arming control and the measurement itself all pass **vacuously**. The probe's closure phase never runs |

**Attack 4 is real and nobody has recorded it.** QE's control E covered *"child exits 0 having written
NOTHING"* (red, `Unexpected end of JSON input`). **The gap between that and this is the child exiting
0 having written a WELL-FORMED FORGED report**, and that is exactly the shape `WSTDOUT-JSON` had.

## Why I am NOT requesting a fix — the reasoning, not the conclusion

**1. The attack requires a position from which the guard can simply be DELETED.** To reach fd 3 the
attacker must get an explicit `writeSync(3, …)` plus an early `process.exit(0)` **committed into a
production module that the probe roots or loads**. Anyone who can commit that can equally delete the
`it(` block, empty `FRAME_PRODUCERS`, or change the assertion. **A control that only fails against an
adversary who could remove the control is not buying anything.**

**2. There is no defence that works.** The measured code runs in the probe's own child with the
probe's full authority. A nonce passed in argv is readable by the forging module (`process.argv`); a
checksum is computable by it; a second channel is writable by it. **Any in-process defence is
defeated by code in that process.** `AGENTS.md` rule 8 and this role's own "do not gold-plate" both
point the same way: naming the bound honestly beats shipping a control that cannot hold.

**3. The ACCIDENTAL path — the one `A2` was written for — is fully closed, and that is measured.**
`A2`'s stated purpose is a production module that prints at import. Attack 1 shows stdout is now
inert even when what it prints is parseable JSON. **`A2` delivers exactly what it claims.**

**4. The constructs are absent today.** Swept across all 16 production modules: **zero `writeSync`,
zero `process.exit`, zero `node:fs` usage, zero `createWriteStream`.** The only module-scope side
effect in the whole tree is `perft-bench.ts`'s `main()` — and `perft-bench.ts` has **zero exports**,
so by `ADR-0011` clause 4 it can never be on the frame path and never a root. **The forgery is
LATENT, on the same test this project uses for `WLAUNDER`.**

**5. The dated trigger lands on the SAFE side, and I checked rather than hoped.** `EPIC-006`'s CLI
entry point is `A2`'s named trigger and the first module that will print at import. If it also
`process.exit()`s at module scope and were ever a root, fd 3 would be **empty**, not forged →
`Unexpected end of JSON input` → **loud red** (attack 3's class, and QE's control E). And as an entry
point it exports nothing, so clause 4 keeps it off the frame path anyway. **Two independent reasons
it cannot arrive as a silent pass.**

## The other half of the brief's question — INJECTION. Not possible from outside the repository

Read at source, not inferred:

- `spawnSync(process.execPath, [array], { … })` — **no `shell` option is set**, so there is no shell
  and no command-line interpolation. The probe script is a **literal in the test file**.
- The child's argv is **entirely repository-derived**: the roots are
  `new URL(file, directory).href` where `file` comes from `readdirSync` of the test file's own
  directory, and `directory` is `new URL(".", import.meta.url)`. The arming root is a `data:` URL
  built from that same internal URL, `JSON.stringify`'d and then `encodeURIComponent`'d — **two
  layers of correct context encoding**.
- **No environment variable, no network, no stdin (`stdio[0]` is `ignore`), no file outside `src/`,
  no argument from any caller.** fd 3 is **opened by the parent for the child** and exists only for
  the life of that child.

**`ABC-029`'s own firing threshold — *"any change that makes the probe's child accept input from
outside the repository, or that adds a dependency"* — is NOT crossed.** Measured, not waived:
`package.json` has **no `dependencies` key at all**, five devDependencies, and
`git diff main...HEAD -- package.json package-lock.json` is **empty**.

## ASVS L1 — the six requirements of the 70 that this change's surfaces actually touch

`security.asvs_level` is **`L1`** (70 requirements). The other 64 address HTTP responses, cookies,
CORS, sessions, tokens, OAuth, passwords, file upload and databases — **this project has no such
surface**, and saying so is more honest than ticking them.

| req | subject | verdict |
|---|---|---|
| **V1.2.5** | OS command injection; parameterized OS calls | **PASS** — array argv, no shell. The strongest control in the change |
| **V1.2.2** | dynamic URL building; encoding; safe protocols | **PASS on encoding** — `encodeURIComponent` + `JSON.stringify`, zero untrusted data. The `data:` URL is the deliberate mechanism that makes the arming control a distinct module instance; the clause's risk (rendering an untrusted URL) has no analogue here |
| **V1.2.3** | escaping when building JavaScript/JSON | **PASS** — `JSON.stringify` on both the interpolated specifier and the report |
| **V1.3.2** | avoid `eval()` / dynamic code execution | **PASS with the mechanism named.** The probe *does* execute dynamically (`node -e`, `await import(data:…)`) and there is **no alternative** — measuring module-body evaluation requires evaluating modules. The clause's condition (*"any user input being included must be sanitized"*) is satisfied vacuously: **no user input is included** |
| **V5.3.2** | file paths from internally generated or trusted data | **PASS** — `readdirSync` of the repo's own directory; no user-submitted filename |
| **V2.2.1** | input validated against an expected structure | **This is where attack 4 lands.** `JSON.parse(child.output[3])` is destructured behind a TypeScript cast with **no runtime validation** |

**On V2.2.1 I considered both readings and am recording both, because the severity turns on it.**
Read as an L1 **failure**, the role's default severity would be **high**, and `security.block_on` is
`high` — it would block. **I do not read it as a failure, and here is why rather than that I don't:**
ASVS validates input crossing a **trust boundary**. The boundary this project declares is the
**repository**, and the ticket's firing threshold says so in as many words. The fd-3 payload
originates inside that boundary, from code the repo already trusts to be correct — the same code the
guard is measuring. **Treating a module's own report as untrusted input would make every load probe
an L1 failure by construction, which is not what the requirement is for.**

**Severity recorded: LOW, by stated reason, not by default.** It is a **bound on what `A2` buys**,
not a missing control. Owner and trigger are in the verdict note.
