import sys
G = "    expect(runtimeImporters).toEqual(production.filter((file) => LICENSED_DRIVERS.includes(file)));"
forms = {
 "scan-framed": "\n    const production = productionModulesIn(directory);\n    const runtimeImporters = production.filter((file) =>\n",
 "importer-stmt": '\n    const runtimeImporters = production.filter((file) =>\n      /^(?:import|export)\\s+(?!type\\b)(?:[^;]*from\\s+)?"\\.\\/history\\.ts";/m.test(\n        readFileSync(`${directory}${file}`, "utf8"),\n      ),\n    );\n',
 "toEqual-framed": "\n" + G + "\n",
 "anchor:QSCAN": "    const production = productionModulesIn(directory);\n    const runtimeImporters",
 "anchor:LHS_END": '        readFileSync(`${directory}${file}`, "utf8"),\n      ),\n    );\n',
 "anchor:HP": '    expect(readFileSync(`${directory}history-pane.ts`, "utf8")).toContain(\n      \'import type { GameHistory } from "./history.ts";\',\n    );\n',
 "biome-ignore lines": "biome-ignore",
}
for f in sys.argv[1:]:
    s = open(f).read()
    print(f.split("/")[-1], " ".join(f"{k}={s.count(v)}" for k, v in forms.items()))
