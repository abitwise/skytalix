---
subtask: arch-ABC-163-adr-text2
role: architect-design
ticket: ABC-163
ref: .grugops/context/security-nfr-ABC-163/
branch: grugops/arch-ABC-163-adr-text @ 3b30196e. Commit on top of it, in worktree ../wt-arch-163.
width: 1
---

# Architect: align the ADR-0036 § S1 text with Security/NFR's ruling (before ABC-163 merges)

Security/NFR (`…3e4b4a08`) ruled against the `…a7d9c818` text, not your revision `e7385671`. Your revision already handles their (b), since AR-095-CWD is closed. Two fixes are still owed:

- **(a)** The "When the case becomes live" bullet and the line "Security/NFR rules the risk." should name **`AR-163-DELONLY`** (LOW, latent, owner Orchestrator, fix by Architect/Design) with its full trigger. The trigger is: a limb-1 holder gains a guard (parameterless or not), a parameter or caller-supplied value reaches the read, a read spans more than one line, or a second limb-1 holder appears.
  - **Owed before that ticket merges:** Ruling 2 widens to any changed line, and the instrument drops the `!lines.size` skip. Until then the Orchestrator runs the by-hand `--name-only` check.
  - **G-2** becomes **`AR-163-UNCOMMENT`** (LOW, owner Architect/Design). Its trigger is a production block comment holding limb code that would compile without its delimiters.
- **(c)** The bold line "The by-hand Ruling 2 check is no longer needed once this commit is on `main`" should add: "until `AR-163-DELONLY`'s trigger fires without its fix."

Keep it short. Change no other text.

## Fences
- Edit ADR-0036 only, plus notes inside the worktree.
- Never push or merge.

## Publish
- Seal notes with the plugin writer (task `arch-ABC-163-adr-text2`).
- Write `.grugops/queue/done/arch-ABC-163-adr-text2.md` (brief + `## Result`: branch tip, the diff, trace row) and `.claim.md`, uncommitted on main.

## Result (architect-design, 2026-10-21 09:39Z): **ADR-0036 § S1 aligned with Security/NFR's ruling at `569a384c`. (a) and (c) are applied; (b) was already met at `e7385671`**

**Branch tip: `grugops/arch-ABC-163-adr-text` @ `27ec318b`** (worktree `../wt-arch-163`, on top of `3b30196e`). Two
commits: `569a384c` (the ADR) and `27ec318b` (the note). Not pushed, not merged.

**The diff (`569a384c`, `ADR-0036` only, +13/−7).** Under `#### Ruling 2 folded — 2026-10-21 (ABC-163)`:
```diff
-- **When the case becomes live:** at the first limb-1 holder with a guard, or with a read whose path is built over
-  more than one line, and at § S1's re-armed § Decision 3 trigger.
-- **Pre-existing, not from this fold** (`G-2`). Deleting the comment delimiters around an import makes a new holder
-  with no `+` line. Nothing fires on it, before or after this commit. The same blind spot holds on every limb.
-- Security/NFR rules the risk.
-
-**The by-hand Ruling 2 check is no longer needed once this commit is on `main`.** QE read `A1`–`A3` MET with its own
+- **When the case becomes live** (`AR-163-DELONLY`'s trigger): a limb-1 holder gains a guard, with or without a
+  parameter; a parameter or caller-supplied value reaches the read; a read spans more than one line; or a second
+  limb-1 holder appears. Owed before that ticket merges: Ruling 2 widens to any changed line, `+` or `−`, and the
+  instrument drops its `!lines.size` skip. Until then the Orchestrator runs the by-hand `--name-only` check.
+- **Pre-existing, not from this fold** (`AR-163-UNCOMMENT`, LOW, owner Architect/Design; QE's `G-2`). Deleting the
+  comment delimiters around an import makes a new holder with no `+` line. Nothing fires on it, before or after this
+  commit. The same blind spot holds on every limb. It becomes live when a production block comment holds limb code
+  that would compile without its delimiters.
+- Security/NFR accepted the risk as `AR-163-DELONLY`: LOW, latent; owner the Orchestrator, fix by Architect/Design
+  (`security-nfr-ABC-163`).
+
+**The by-hand Ruling 2 check is no longer needed once this commit is on `main`, until `AR-163-DELONLY`'s trigger
+fires without its fix.** QE read `A1`–`A3` MET with its own
```
- **One judgment call:** "QE's `G-2`" stays in the parenthesis beside `AR-163-UNCOMMENT`, so the id still traces to
  QE's gap. Drop it if "G-2 becomes" should be read literally.
- **No other text changed.** Untouched: `clause-b.mjs`, `src/`, `AGENTS.md` and `plans/`.
- **No board move. NFR impact:** none.

**Note** (`.grugops/context/arch-ABC-163-adr-text2/notes/`, in the worktree). It was sealed by `context-io.js`
`admitAndAppend` (grugops 2.1.0 plugin cache), task `arch-ABC-163-adr-text2`. `validate` returns `[]`, the seal is ok,
and it reads back through `readContext`.
- `20261021T093843Z-architect-design-decision-b4c6e51b`: the change against `…3e4b4a08` § 5 (a)–(c).

**Queue.** The brief moved pending → claimed → done by rename. The empty `claimed/arch-ABC-163-adr-text2/` is left for
the Orchestrator's close.

### Trace row (for the Orchestrator to append; this hop did not edit `plans/traceability.md`)
`| ABC-163 (Architect ADR text 2) | ADR-0036 § S1 Ruling 2 fold; Security/NFR …3e4b4a08 § 5 (a), (c) | grugops/arch-ABC-163-adr-text @ 27ec318b (ADR 569a384c, on 3b30196e) | — (docs only) | ADR text diffed against …3e4b4a08 § 2 (AR-163-DELONLY trigger i–iv, owed fix), § 3 (AR-163-UNCOMMENT trigger); (b) already met at e7385671 | deletion-only case names AR-163-DELONLY (LOW, latent; owner Orchestrator, fix Architect/Design) with full trigger, owed widening and !lines.size drop, by-hand --name-only until then; G-2 → AR-163-UNCOMMENT (LOW, Architect/Design) with trigger; retirement "until AR-163-DELONLY's trigger fires without its fix" (+13/−7) | note …b4c6e51b |`
