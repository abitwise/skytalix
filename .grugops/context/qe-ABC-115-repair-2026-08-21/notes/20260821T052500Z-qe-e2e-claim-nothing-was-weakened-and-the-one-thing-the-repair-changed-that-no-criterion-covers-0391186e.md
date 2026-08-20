---
id: 20260821T052500Z-qe-e2e-claim-nothing-was-weakened-and-the-one-thing-the-repair-changed-that-no-criterion-covers-0391186e
kind: claim
by: qe-e2e
at: 2026-08-21T05:25:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-115
  - ABC-066
  - G-QE115-5
  - A10
  - src/cli.test.ts
supersedes:
---

# `src/cli.test.ts` MOVED 128/34 AND NOT ONE ASSERTION WAS WEAKENED — BUT ADDING A CHILD CHANGED A DERIVED GUARD ELSEWHERE, AND THAT IS `G-QE115-5`

`confidence: UNKNOWN - verify` — no `finding` is admissible on this install
(`context.human_admission` is `off`). The commands below are reproducible; nothing here is stamped.
**Nothing was fixed.** Reported only.

## The executable diff, isolated from the prose

`git diff 92ccec5 HEAD -- src/cli.test.ts` is 219 lines. Stripping comment and blank lines leaves
**exactly this**:

```
+const unwritableStdout = (): Child =>
+  childOf("/bin/sh", ["-c", `${PRODUCT} --ascii 1</dev/null; echo "NODE_EXIT=$?"`]);
+  unwritableStdout: unwritableStdout(),
-  it("N8-LANE — this file spawns TWENTY-THREE children and no more", () => {
+  it("N8-LANE — this file spawns TWENTY-FOUR children and no more", () => {
-    const N8_SPAWN = 17 + 6;
+    const N8_SPAWN = 17 + 7;
+  it("A10 — a REAL write failure is not absorbed: …", () => {
+    const child = CHILDREN.unwritableStdout;
+    const status = productStatusOf(child);
+    expect(status, "the product ran and reported a status").toBeTypeOf("number");
+    expect(status, `a failed write was absorbed: …`).not.toBe(0);
+    expect(child.stderr, "a failed write was absorbed silently").not.toBe("");
+  });
```

**Zero assertions removed. Zero assertions loosened. Zero `expect` weakened from an equality to a
containment, from a value to a type, or from a set to a length.** The only two changed executable
lines are a test title and the pin, both of which the residual ruling raised on the page. I looked
for a weakened assertion and there is not one. `expect(spawned)`, `expect(Object.keys(CHILDREN))`,
the import census and the single-call-site count are all untouched and all green.

The new child's shell script is composed the way the file's own security clause requires: every word
comes from `process.execPath`, `ENTRY_POINT` or this file's literals, both paths through
`shellWord`, and it goes through the existing `childOf` — **zero new `spawnSync` call sites**, so
the one-call-site pin stays armed. Verified from source.

## `G-QE115-5` — `ABC-066`'s REFUSAL GUARD IS BLIND TO THE CHILD THIS REPAIR ADDED, AND I MEASURED IT

`ABC-066`'s `A1/A2/A3` row derives its subject rather than listing it, deliberately, so it cannot go
stale (`src/cli.test.ts:1771`):

```ts
const refused = Object.values(CHILDREN).filter(
  (child) => child.status !== 0 && !/internal error/i.test(child.union),
);
expect(refused, "the captured refusal children").toHaveLength(6);
```

`child.status` is the **wrapper's** status. `A10`'s child is `/bin/sh -c '<product> …; echo
NODE_EXIT=$?'`, so its wrapper exits **0** while the product inside it exits **1** —
`USAGE_EXIT_CODE`, with a raw stack on stderr and **no usage line at all**. The guard therefore does
not see it, and `toHaveLength(6)` still holds.

**Measured, not reasoned.** I made the derivation wrapper-transparent in the out-of-repo copy —
`child.status !== 0 || /^NODE_EXIT=[1-9]/m.test(child.stdout)` — and ran it:

```
× ABC-066 … A1/A2/A3 — every refusal advertises the separator …
  → the captured refusal children: expected [ …(7) ] to have a length of 6 but got 7
 Tests  1 failed | 60 passed (61)
```

**Seven, and the seventh is `A10`'s.** The blindness is what keeps that row green. The tree was
restored and `cmp`-verified afterwards.

## What this is, and — carefully — what it is not

**It is NOT a new defect in the product.** The behaviour is exactly the residual BA/PM accepted by
name on 2026-08-21: *on a genuine failed stdout write that is not `EPIPE`, this product prints a
stack that discloses its checkout path and returns `1`, which a shell cannot tell from a refused
command line.* I am not re-opening that and I do not propose a wider arm.

**It is NOT the residual's cut trigger firing, and I checked before saying so.** The pre-registered
trigger is *a real non-`EPIPE` stdout failure observed outside a probe, **or** any hop, gate or
script measured taking a **wrong routing decision** off this path's `1`.* `ABC-066`'s row takes no
routing decision off the `1` — it never sees the `1`. **The trigger does not fire.** A reader who
wants it to fire is reading it wrong, and I decline to stretch it.

**What it IS:** the file now contains a product invocation that exits with the refusal code and does
not advertise a usage line, inside a guard written to catch exactly that, which cannot reach it.
The mechanism predates this ticket — every `/bin/sh` wrapper child is invisible to that derivation —
but `A10` is the **first wrapped child whose product exits non-zero**, so this is the first hop at
which the blindness has a subject. That is worth handing forward with a name rather than leaving for
someone to rediscover.

**Disposition: recorded, non-blocking, owner is whoever next opens `ABC-066`'s guard.** Making the
derivation wrapper-transparent is a one-line change with a consequence — the row would go red on the
accepted residual — so it is a question for BA/PM, not a bench fix, and not mine.
