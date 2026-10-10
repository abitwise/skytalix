# Usage: python3 -I composer-plant.py <tree> <build>
# S-REEXPORT : cli-options.ts re-exports assembleFrame; glyph-mode.ts binds it from cli-options.ts
# S-DYNAMIC  : cli-options.ts binds assembleFrame by a dynamic import of ./frame.ts
# S-REEXPORT-RS / S-DYNAMIC-RS : the same two, hosted in result-screen.ts (no host-specific text guard)
# S-WRAP-CLI : the licensed entry point wraps the seam with a per-frame gameStatusOf derive
import sys, pathlib
tree, build = sys.argv[1], sys.argv[2]
src = pathlib.Path(tree, "src")
def edit(name, old, new, count=1):
    p = src / name; s = p.read_text()
    if s.count(old) != count: raise SystemExit(f"{name}: anchor count {s.count(old)} != {count}")
    p.write_text(s.replace(old, new))
def append(name, text):
    p = src / name; p.write_text(p.read_text() + text)
if build == "S-REEXPORT":
    append("cli-options.ts", '\nexport { assembleFrame } from "./frame.ts";\n')
    append("glyph-mode.ts", '\nimport { assembleFrame } from "./cli-options.ts";\n\nexport const composeAgain = assembleFrame;\n')
elif build == "S-DYNAMIC":
    append("cli-options.ts", '\nexport const composeLater = async () => (await import("./frame.ts")).assembleFrame;\n')
elif build == "S-WRAP-CLI":
    edit("cli.ts", 'import { newGame } from "./history.ts";', 'import { gameStatusOf, newGame } from "./history.ts";')
    edit("cli.ts", "      render: makeRenderSeam(mode, orientation),",
         "      render: ((seam) => (h, s, t, m) => {\n        gameStatusOf(h);\n        return seam(h, s, t, m);\n      })(makeRenderSeam(mode, orientation)),")
elif build == "S-REEXPORT-RS":
    append("result-screen.ts", '\nexport { assembleFrame } from "./frame.ts";\n')
    append("glyph-mode.ts", '\nimport { assembleFrame } from "./result-screen.ts";\n\nexport const composeAgain = assembleFrame;\n')
elif build == "S-DYNAMIC-RS":
    append("result-screen.ts", '\nexport const composeLater = async () => (await import("./frame.ts")).assembleFrame;\n')
else:
    raise SystemExit("unknown build")
print("planted", build)
