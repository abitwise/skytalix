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
