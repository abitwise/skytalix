---
id: 20260821T053000Z-qe-e2e-failed-attempt-the-pty-timing-trap-caught-me-a-second-time-in-a-third-shape-04a78b3d
kind: failed-attempt
by: qe-e2e
at: 2026-08-21T05:30:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A10
supersedes:
---

# ONE DEAD END OF MY OWN AT THIS HOP — AND IT IS THE PTY TRAP I MYSELF RECORDED, CATCHING ME A SECOND TIME IN A THIRD SHAPE

## The recorded dead ends were read and avoided, not re-run

On file across this ticket's seven context folders: timing the pipeline; an open stdin that supplies
nothing; no settle delay; the orphan holding the capture pipe; a copied tree missing `AGENTS.md`
that is red before any mutant; a `.js` probe under `"type": "module"`; a serial shell loop used to
price children; closing fd 1 (`1>&-`), which is a **no-op** and not a stdout failure; timing a
process that outlives the subject inside a pty; and a fresh `git worktree` whose missing
`node_modules` produces a startup error that resembles a red. **None was re-run.**

Two of them shaped this hop's method by construction rather than by trial: the copied tree carries
`AGENTS.md` and a symlinked `node_modules` and was **established green at 61/61 before a token was
changed**, and the `A10` probe used the read-only-fd shape rather than `1>&-`.

## The new one: I put the timer inside the pty and lost the exit code entirely

My first real-TTY run was

```
{ printf 'e4\n'; sleep 6; ... } | script -q /tmp/tty.log /usr/bin/time -p node src/cli.ts --ascii --colour white 2>/tmp/tty.time
```

`script` reported **exit 0** and `/tmp/tty.time` was **empty**. Both readings are worthless:
`script`'s status is `script`'s, not node's, and `/usr/bin/time`'s stderr went to the **pty**, not to
my redirection — it turned up as `real 8.01` inside the transcript, mixed into the game's own output.
**I could not read node's exit code from that shape at all**, and a hop that took `script`'s `0` for
the product's `0` would have recorded a pass it never measured.

**What works, and it is the shape this ticket's own children already use:** put the marker inside
the pty, not the timer outside it —

```
… | script -q /tmp/tty2.log /bin/sh -c 'node src/cli.ts --ascii --colour white; echo "NODE_EXIT=$?"'
```

— then `grep NODE_EXIT= ` the transcript. `NODE_EXIT=0`, 3/3.

## Why this is worth a note rather than a shrug

**This is the trap I recorded at my own previous hop, and it caught me again.** Last time it was a
timer reading my own writer's `sleep`; this time it was a status reading the wrapper and a timer
whose output the pty swallowed. The generalisation I wrote then — *the trap is about timing any
process that outlives the one you are asking about, and a pty puts a fresh candidate for that role
between your instrument and your subject* — was correct and I still walked into the descendant of it.

**The narrower rule that would have saved me, and it is the same rule `A10` is built on: never read
a status from the outermost process. Make the subject announce its own, inside whatever wrapper you
have put around it.** `A10`'s `NODE_EXIT=` marker is that rule made permanent, which is why I trust
that row more after having needed it myself.
