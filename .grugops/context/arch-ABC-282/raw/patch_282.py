# arch-ABC-282 P3: scratch prototype of the W1 rule on a `git archive` copy of main 5853d17f (PREREG …5dbc040d).
# Usage: python3 patch_282.py <scratch-copy-root>. Never applied to the repository's src/.
import sys, pathlib
p = pathlib.Path(sys.argv[1]) / "src" / "engine.ts"
s = p.read_text()
def rep(old, new):
    global s
    assert s.count(old) == 1, old[:60]
    s = s.replace(old, new)
rep("  readonly priorKeys?: readonly bigint[];\n}\n",
    "  readonly priorKeys?: readonly bigint[];\n  /** PROTOTYPE W1: no iteration starts at or after start + softMs; an aborted iteration's root move may be kept. */\n  readonly softMs?: number;\n}\n")
rep("  readonly elapsedMs: number;\n}\n",
    "  readonly elapsedMs: number;\n  /** PROTOTYPE diagnostics. */\n  readonly nodesAtComplete?: number;\n  readonly partial?: boolean;\n  readonly firstNotIncumbent?: number;\n  readonly aborted?: boolean;\n}\n\n/** PROTOTYPE: the partial register, written only from completed root-move returns. */\ninterface Register { first: Move | null; firstScore: number; move: Move | null; score: number; completed: number; }\n")
rep("  budget: Budget,\n  rootPhase: number,\n): Iteration {",
    "  budget: Budget,\n  rootPhase: number,\n  register?: Register,\n): Iteration {")
rep("""    index++;

    if (score > best) {
      best = score;
      bestMove = move;
    }
    if (best > alpha) alpha = best;
  }

  storeEntry(rootKey""",
"""    index++;

    if (score > best) {
      best = score;
      bestMove = move;
    }
    if (best > alpha) alpha = best;
    if (register !== undefined) {
      if (index === 1) {
        register.first = move;
        register.firstScore = score;
      }
      register.move = bestMove;
      register.score = best;
      register.completed = index;
    }
  }

  storeEntry(rootKey""")
rep("""  let reached = 1;
  budget.nextCheck = budget.nodes + NODES_PER_CLOCK_CHECK;
""",
"""  let reached = 1;
  budget.nextCheck = budget.nodes + NODES_PER_CLOCK_CHECK;
  // PROTOTYPE W1: one clock read per boundary, compared with the earlier of the two limits.
  const iterationDeadline =
    options.softMs === undefined ? budget.deadline : Math.min(budget.deadline, start + options.softMs);
  let nodesAtComplete = budget.nodes;
  let partial = false;
  let aborted = false;
  let firstNotIncumbent = 0;
""")
rep("    now() < budget.deadline &&\n", "    now() < iterationDeadline &&\n")
rep("""    let deeper: Iteration;
    try {
      deeper = runIteration(position, rootMoves, iteration, budget, rootPhase);
    } catch (error) {
      // The register is written only here, from a value a COMPLETED iteration returned. An
      // aborted iteration leaves `best` and `reached` untouched, which is `A3`.
      if (error === ABORTED) break;
      throw error;
    }
    best = deeper;
    reached = iteration;
  }
""",
"""    let deeper: Iteration;
    const register: Register = { first: null, firstScore: 0, move: null, score: 0, completed: 0 };
    try {
      deeper = runIteration(position, rootMoves, iteration, budget, rootPhase, register);
    } catch (error) {
      if (error === ABORTED) {
        aborted = true;
        if (register.first !== null && register.first !== best.move) firstNotIncumbent++;
        if (
          options.softMs !== undefined &&
          register.completed >= 2 &&
          register.first === best.move &&
          register.move !== null &&
          register.move !== best.move &&
          register.score > register.firstScore
        ) {
          best = { move: register.move, score: register.score };
          partial = true;
        }
        break;
      }
      throw error;
    }
    if (register.first !== best.move) firstNotIncumbent++;
    best = deeper;
    reached = iteration;
    nodesAtComplete = budget.nodes;
  }
""")
rep("""    elapsedMs: now() - start,
  };
}
""", """    elapsedMs: now() - start,
    nodesAtComplete,
    partial,
    firstNotIncumbent,
    aborted,
  };
}
""")
p.write_text(s)
print("patched", p)
