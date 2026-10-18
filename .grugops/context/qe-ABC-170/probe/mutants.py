# QE ABC-170 mutants over src/engine.ts at 64b07741. Each: (id, description, [(old, new)]).
HDR_OLD = """    now() < budget.deadline &&
    iteration <= (options.maxDepth ?? Number.POSITIVE_INFINITY) &&
    budget.nodes < budget.maxNodes;
"""
CN_OLD = "    if (budget.now() >= budget.deadline || budget.nodes >= budget.maxNodes) throw ABORTED;\n"
INIT_OLD = "    maxNodes: options.maxNodes ?? Number.POSITIVE_INFINITY,\n"
CATCH_OLD = "      if (error === ABORTED) break;\n"
BODY_OLD = "    let deeper: Iteration;\n"
NEXT_OLD = "    nextCheck: Number.POSITIVE_INFINITY,\n"
MUTANTS = [
 ("M01", "countNode: drop the maxNodes term", [(CN_OLD, "    if (budget.now() >= budget.deadline) throw ABORTED;\n")]),
 ("M02", "header: drop the maxNodes term", [(HDR_OLD, "    now() < budget.deadline &&\n    iteration <= (options.maxDepth ?? Number.POSITIVE_INFINITY);\n")]),
 ("M03", "header: drop the maxDepth term", [(HDR_OLD, "    now() < budget.deadline &&\n    budget.nodes < budget.maxNodes;\n")]),
 ("M04", "countNode: maxNodes BEFORE the clock", [(CN_OLD, "    if (budget.nodes >= budget.maxNodes || budget.now() >= budget.deadline) throw ABORTED;\n")]),
 ("M05", "header: clock LAST", [(HDR_OLD, "    iteration <= (options.maxDepth ?? Number.POSITIVE_INFINITY) &&\n    budget.nodes < budget.maxNodes &&\n    now() < budget.deadline;\n")]),
 ("M06", "header: iteration < maxDepth (off by one)", [(HDR_OLD, HDR_OLD.replace("iteration <= (", "iteration < ("))]),
 ("M07", "catch: report the aborted depth (no discard of depth)", [(CATCH_OLD, "      if (error === ABORTED) { reached = iteration; break; }\n")]),
 ("M08", "maxNodes default constant 10_000_000", [(INIT_OLD, "    maxNodes: options.maxNodes ?? 10_000_000,\n")]),
 ("M09", "maxDepth default constant 64 in header", [(HDR_OLD, HDR_OLD.replace("?? Number.POSITIVE_INFINITY)", "?? 64)"))]),
 ("M10", "body depth cap: if (iteration > 64) break", [(BODY_OLD, "    if (iteration > 64) break;\n" + BODY_OLD)]),
 ("M11", "body depth cap: if (iteration > 9) break", [(BODY_OLD, "    if (iteration > 9) break;\n" + BODY_OLD)]),
 ("M12", "maxNodes checked at every node after depth 1 (precise abort)", [(CN_OLD, CN_OLD + "  }\n  if (budget.nextCheck !== Number.POSITIVE_INFINITY && budget.nodes >= budget.maxNodes) {\n    throw ABORTED;\n")]),
 ("M13", "first iteration abortable by maxNodes", [(NEXT_OLD, "    nextCheck: options.maxNodes ?? Number.POSITIVE_INFINITY,\n")]),
 ("M14", "countNode: nodes > maxNodes (>= to >)", [(CN_OLD, CN_OLD.replace("budget.nodes >= budget.maxNodes", "budget.nodes > budget.maxNodes"))]),
 ("M15", "extra clock read ONLY when maxNodes absent", [(INIT_OLD, "    maxNodes: options.maxNodes ?? now() * 0 + Number.POSITIVE_INFINITY,\n")]),
 ("M16", "extra clock read on BOTH paths (absent and present)", [(INIT_OLD, "    maxNodes: (now(), options.maxNodes ?? Number.POSITIVE_INFINITY),\n")]),
 ("M17", "maxDepth ?? -> || (0 means unlimited)", [(HDR_OLD, HDR_OLD.replace("(options.maxDepth ?? Number.POSITIVE_INFINITY)", "(options.maxDepth || Number.POSITIVE_INFINITY)"))]),
 ("M18", "extra clock read per iteration on BOTH paths, in the body", [(BODY_OLD, "    now();\n" + BODY_OLD)]),
]
PART_OLD = """      );
    } finally {
      unmakeMove(position, move, undo);
    }
    index++;
"""
PART_NEW = """      );
    } catch (error) {
      if (error !== ABORTED || best === Number.NEGATIVE_INFINITY || budget.nodes < budget.maxNodes) throw error;
      partial = true;
      score = Number.NEGATIVE_INFINITY;
    } finally {
      unmakeMove(position, move, undo);
    }
    if (partial) return { move: bestMove, score: best };
    index++;
"""
PART_DECL_OLD = "  let bestMove = rootMoves[0] as Move;\n"
MUTANTS += [
 ("M19", "node-limit abort returns the aborted iteration's partial best as completed", [(PART_OLD, PART_NEW), (PART_DECL_OLD, PART_DECL_OLD + "  let partial = false;\n")]),
 ("M08b", "maxNodes default constant 200_000", [(INIT_OLD, "    maxNodes: options.maxNodes ?? 200_000,\n")]),
 ("M08c", "maxNodes default constant 60_000", [(INIT_OLD, "    maxNodes: options.maxNodes ?? 60_000,\n")]),
 ("M10b", "body depth cap: if (iteration > 200) break", [(BODY_OLD, "    if (iteration > 200) break;\n" + BODY_OLD)]),
 ("M10c", "body depth cap: if (iteration >= 130) break", [(BODY_OLD, "    if (iteration >= 130) break;\n" + BODY_OLD)]),
]
