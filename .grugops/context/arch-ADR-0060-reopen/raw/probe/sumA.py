import json,sys,os
d=sys.argv[1]
for id in "R0 C1 C2 C3 C4 C5 C6 C7 C8".split():
    rows=[json.loads(l) for l in open(f"{d}/{id}-nodes.out") if l.startswith("{")]
    g={(r["name"],r["label"]):r for r in rows}
    rat=[]
    for rec in ("search","choose"):
        for p in ("kiwipete","position-6"):
            rat.append(g[(p,"head")][rec]["nodes"]/g[(p,"door")][rec]["nodes"])
    ds=json.loads(open(f"{d}/{id}-drift-RECsearch.out").read())
    dc=json.loads(open(f"{d}/{id}-drift-RECchoose.out").read())
    a4=all(x<=0.85 for x in rat)
    a3=all(x["withinPct"]>=95 and x["max"]<=27 and x["signFlip"]==0 for x in (ds,dc))
    a3x=all(x["withinPct"]>=95 and x["signFlip"]==0 for x in (ds,dc))
    print(id, " ".join(f"{x:.4f}" for x in rat), "| s",ds["withinPct"],ds["max"],ds["maxName"],ds["signFlip"],ds["mateFlip"],"| c",dc["withinPct"],dc["max"],dc["maxName"],dc["signFlip"],dc["mateFlip"],"| A4a",a4,"A3",a3,"A3-but-cap",a3x)
