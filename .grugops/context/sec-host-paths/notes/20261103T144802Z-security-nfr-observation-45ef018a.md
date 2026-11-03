---
id: 20261103T144802Z-security-nfr-observation-45ef018a
kind: observation
by: security-nfr
at: 2026-11-03T14:48:02Z
verified_by: 
confidence: high on counts and source reading (git grep at 878217bd and local origin/main 31f185b8, gz decompressed; rating.ts read, not run); severities are Security/NFR's judgement
refs:
  - sec-host-paths
  - QE-273-b
  - SEC-HP-1
  - SEC-HP-2
  - SEC-HP-3
  - SEC-PUB-1
  - SEC-PUB-2
  - SEC-PUB-3
  - SEC-177-1
  - ADR-0049
  - ASVS-V16.2.5
  - ASVS-V14.1.1
  - tools/rating/rating.ts
  - tools/rating/pair.ts
  - se-ABC-262
  - 14912a02
  - 3ad6bc10
  - qe-ABC-269
  - qe-ABC-273/20261103T135141Z-qe-e2e-observation-334a1bf6
  - orch-2026-10-30a/c2752305
  - security-nfr-public-repo-redacted/20261024T110648Z-security-nfr-observation-fa83895b
supersedes: 
seal: sha256:91744cd92e817ce7cf6501527418a0ff89073374c1a69af70644ce0b5a94d8b8
---

# Host paths in committed records: SEC-HP-1 LOW (the home path in one of three forms in 816 tip files, 812 already public; it breaches ADR-0049 D4's "no personal path"), SEC-HP-2 LOW (one foreign private-project capture, public), SEC-HP-3 INFO (hostname label, owner-ruled)

**Why.** This is QE-273-b (`qe-ABC-273` `…334a1bf6`), routed to Security/NFR. The repo is public. Everything below is by class and
count only (ADR-0049 D4). No path, account name, project name or hostname is written here.

**How it was read.** I used `git grep` on `HEAD` (`main` `878217bd`) and on the local `origin/main` (`31f185b8`, last fetch;
the remote's current state is `UNKNOWN - verify`). Gzipped blobs were decompressed and counted separately, because
`git grep` skips them as binary. I read `tools/rating/rating.ts` and `tools/rating/pair.ts` and ran neither.

## SEC-HP-1: the owner's home path in committed records. LOW. Risk owner: Olger Oeselg

**Counts at the tip** (16,508 tracked files):

| form | files | of which |
|---|---|---|
| literal `<home>` path, text files | **109** (205 occurrences) | 106 under `.grugops/context`, 101 of those in `raw/` dirs; 2 queue briefs; 1 `.grugops/install.json` |
| literal `<home>` path inside `.gz` files (vitest `last-run.json`) | **15** (945 occurrences) | all in `raw/` dirs of 4 tasks; **invisible to `git grep`**, so QE's 106 undercounts |
| the home path in slug form (`-home-<user>-…`, the tool session directory name) | **322** | — |
| the session scratch path (`/tmp/claude-<uid>/…`) | **739** | 142 queue briefs (the host-lock path) and 597 context files |
| **union of the three text forms** | **816** | `origin/main` (last fetch) already has **812** such files |

**What it reveals:**
- the Linux account name, which is already public as part of the commit author name (SEC-PUB-2);
- the numeric uid;
- the layout under home: the repo checkout and its worktree directory, the kit install path, the node-version-manager path and
  its Node version, the checkout of 1 other public project (the kit's own source), and 1 third-party tool build directory;
- **12 distinct tool session ids** inside scratch paths. Each is a local session identifier, not a credential, and it grants
  nothing remotely.

**What it does not reveal:** a credential, a token, an email or another person's data (see this task's scan note).

**Where it comes from** (the 101 `raw/` files by name, plus the rest):
1. **`rating.ts` `r` and `d`: 4 files** (`cmd.txt` and `machine.txt`, 2 runs of `qe-ABC-269`). Confirmed by reading the source:
   - `main()` writes `machine.txt` raw: the node path, the harness checkout path and the openings path.
   - It also writes `cmd.txt` raw: the tool paths, the clone paths and the out path.
   - It writes the other records (`*.out` and the PGN) without the record-redaction loop that `rpair` runs, and computes
     `SHA256SUMS` over the raw files.
   - `rpair` redacts every record before its `SHA256SUMS`. The `r`/`d` dry run redacts too, through `argvText`.
2. **Hand-written agent scripts with literal absolute paths: most of the rest.** By name: `gates.sh` ×5, `plants.sh` ×5,
   `window.sh` ×4, `deep.sh`, `run.sh`, `verify.*`, `survey.ts`.
3. **Captured tool output:** `npm-test.txt`, `test*.txt`, analysis `*.jsonl`, and the 15 gzipped vitest `last-run.json`.
4. **Queue briefs** carry the concrete host-lock path.
5. **`.grugops/install.json`** (the installer's record) holds 3 absolute paths.

**The macOS-era home paths (SEC-PUB-3) are unchanged.** 422 tip files carry them, and **0 of those were added or modified since
`2e67a4b5`**. The forward fix held for that path. Then the host changed, and the new home path came in.

**Severity: LOW.** ASVS V16.2.5 and V14.1.1 are L2, outside the active `security.asvs_level` L1 set. No L1 requirement fails, and
the L2 default would be MEDIUM. **I set LOW, with this reason:** the data is the owner's own already-public name plus directory
layout, there is no secret, and it is the same class SEC-PUB-3 rated LOW on 2026-10-24. The override is mine (Security/NFR).
The risk owner is Olger Oeselg, because ADR-0049 D4 keeps SEC-PUB-2..4 his.

**Process breach, stated plainly:** ADR-0049 D4, ACCEPTED 2026-10-24, says *"from acceptance on, a record names infrastructure by
class and count only … and no personal path"*. Every one of these home-path files postdates that acceptance: the first literal occurrence in history is `3ad6bc10`, 2026-10-29. Two things are
missing:
- a check: no tool, lint or gate catches it;
- a written placeholder convention for scripts and briefs.
QE redacted its own `qe-ABC-273` copies by hand. That is also why that run's `SHA256SUMS` lists unredacted originals, which QE
kept as a separate file.

## SEC-HP-2: one foreign private-project process capture is public. LOW. Owner: Software Engineer (the source); risk owner Olger Oeselg

**What:**
- One line of `.grugops/context/se-ABC-262/raw/gates/summary.txt` (committed in `14912a02`, in `origin/main`) records the full
  argv of 2 foreign vitest processes.
- `raw/gates.sh` ran `pgrep -af "[/]vitest"` and wrote whatever matched.
- By class, the line reveals:
  - 1 other **private** project's folder path: an organisation folder and 1 sub-repository name;
  - its package-manager store path, with toolchain and package versions;
  - its test command and test-project names;
  - the Node binary path.
- No host, address, service, secret name or credential appears.

**Why it matters:**
- This is SEC-PUB-1's class (captures of another private project), at a much smaller scale.
- The standing practice since `SEC-177-1` (QE redact, owner option 2) is that a foreign process is logged as a count and a class,
  never as its argv.
- `rating.ts` `hostLine` already does that (it records only a count).
- **8 committed scripts use `pgrep -a`/`-af`.** Only this run caught a foreign argv.
- The file sits under no `SHA256SUMS` and no seal. Only `gates.sh` names it.

**Severity: LOW.** Its default is ASVS V16.2.5, L2 → MEDIUM. **I set LOW, with this reason:** no infrastructure detail, only a
folder name that carries the owner's own name and 1 repository name.

## SEC-HP-3: the machine hostname as the reference-machine label. INFO. Owner: Olger Oeselg, ruled

- The hostname appears in 61 tip files: 5 ADRs, `plans/board.md`, `plans/nfr-catalog.md`, `plans/traceability.md` and context
  notes.
- It is the reference machine's name **on the owner's word** (`orch-2026-10-30a` `…c2752305`, recorded by `arch-hostname-adrs`).
- Read literally, ADR-0049 D4's "no hostname" is in tension with that ruling.
- **No action from Security/NFR.** If wanted, Architect/Design can add one dated line to ADR-0049 D4 that names this exception, so
  a future check does not flag it.
