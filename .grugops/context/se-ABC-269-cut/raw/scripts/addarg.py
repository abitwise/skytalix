import re,sys
# usage: addarg.py file fname
p,fname=sys.argv[1],sys.argv[2]
s=open(p).read()
out=[];i=0;n=0
pat=re.compile(r'(?<![\w.])'+fname+r'\(')
while True:
    m=pat.search(s,i)
    if not m: out.append(s[i:]);break
    # skip definitions / imports
    pre=s[max(0,m.start()-9):m.start()]
    if pre.endswith('function '):
        out.append(s[i:m.end()]);i=m.end();continue
    j=m.end();depth=1;args=[];start=j
    while depth:
        c=s[j]
        if c in '([{':depth+=1
        elif c in ')]}':
            depth-=1
        elif c==',' and depth==1:
            args.append(s[start:j]);start=j+1
        j+=1
    last=s[start:j-1]
    if last.strip(): args.append(last)
    first=args[0].strip()
    close=j-1
    body=s[m.end():close]
    stripped=body.rstrip()
    trail=body[len(stripped):]
    if stripped.endswith(','):
        ins=stripped+trail.replace('\n','\n',1)
        # multi-line: add new line with same indentation as first arg
        ind=re.match(r'\n(\s*)',body).group(1)
        newbody=stripped+'\n'+ind+'phaseOf('+first+'),'+trail
    else:
        newbody=stripped+', phaseOf('+first+')'+trail
    out.append(s[i:m.end()]+newbody+')')
    i=close+1;n+=1
open(p,'w').write(''.join(out))
print(p,fname,n)
