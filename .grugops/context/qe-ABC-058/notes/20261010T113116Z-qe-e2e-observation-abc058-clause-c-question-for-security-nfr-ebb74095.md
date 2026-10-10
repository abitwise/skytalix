---
id: 20261010T113116Z-qe-e2e-observation-abc058-clause-c-question-for-security-nfr-ebb74095
kind: observation
by: qe-e2e
at: 2026-10-10T11:31:16Z
verified_by:
confidence: high
refs:
  - ABC-058
  - ABC-041
  - ABC-042
  - V1.3.3
  - N8-SPAWN
  - src/cli.test.ts
  - .grugops/context/qe-ABC-058/probe/raw-bytes.sh
  - .grugops/context/qe-ABC-058/probe/raw-bytes.out.txt
supersedes:
---

# For Security/NFR: does `ABC-041` clause (c) "a **new** spawn" fire when the bytes handed to an EXISTING child change inside an EXISTING literal? Facts measured; QE does not rule

Hand-authored, unsealed. The page itself (§ Security / NFR triggers) says that (c) is arguable and
should be had at the gate. These are the facts for that argument. **The ruling is Security/NFR's.**

**What changed.**
- One string literal in one existing call changed: `escape: run("--colour", …)`.
- `"\u001b[2Jpurple"` became `"\u0007\u001b[2Jpurple\u007f"`, which adds BEL (`0x07`) and DEL
  (`0x7f`).
- There is no concatenation and no interpolation, and no NUL (an argv cannot carry one).

**What did not change (measured at `fb914ded`):**
- The child's command: `process.execPath <ENTRY_POINT> --colour <token>`.
- Its options: the `childOf` defaults.
- The count: `N8_SPAWN` = 27 = `CHILDREN` keys = `spawned`.
- The single `spawnSync(` call site, on both the raw and the stripped view.
- The `it` blocks: 0 added.
- Production modules: 35, blob-identical.

**Where the bytes go.**
- `spawnSync` captures the child's stdout and stderr through pipes, not through a TTY.
- On a correct build the echoed token is stripped (control GREEN).
- **On a RED** (`raw-bytes.sh`; `M3h`, `Q1`, `Q2` at head and `Q2` at base), the run's own output
  carries:
  - 0 BEL, 0 DEL, 0 `ESC[2J`, and 0 occurrences of `purple`;
  - 12 ESC bytes, every one of them a reporter colour code (`ESC[31m` ×4, `ESC[32m` ×2, `ESC[39m` ×6).
    The count is the same at base.
- The failure names the offending code point as an integer, for example
  `AssertionError: expected [ 7 ] to deeply equal []`, and `[ 127 ]` for `M3h`.
- **So the new bytes do not reach the developer's terminal, even when the bar fails.** This was
  measured with the output captured to a file. A TTY run is `UNKNOWN - verify`.

**The question, stated both ways.**
- **(c) does not fire.** "New spawn" reads on child identity and count. Both are unchanged and are
  pinned by `A7`, and the literal is the existing one.
- **(c) fires.** The bytes handed to a child are the child's input. Changing them changes what the
  spawned process does, so the change is reviewed like a spawn.
- QE's facts fit the first reading. They also show that, under the second, the input change is
  bounded to a captured pipe.
