/* ============================================================
   BigBlind — Showdown Verifier (DEV / QA TOOL, not loaded by the app)
   ------------------------------------------------------------
   ทำไมต้องมี: เฉลย showdown ใน spots.js เคยผิดซ้ำเพราะ "นึกเอา"
   เครื่องมือนี้ brute-force ทุกมือ villain ที่เป็นไปได้จากไพ่ที่เหลือ
   แล้วบอกตรงๆ ว่ามือไหน "ชนะ / เสมอ / แพ้" hero — ไม่ต้องคิดในหัว

   วิธีใช้:
     node showdown_check.js            # ตรวจทุก river spot (board 5 ใบ) ใน spots.js
     node showdown_check.js 6s6d Kc Kh 2s / Ac Kd   # ตรวจมือเดี่ยว (board / hero)
   ============================================================ */

const RANKS = {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'T':10,'J':11,'Q':12,'K':13,'A':14};
const RNAME = {2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',10:'T',11:'J',12:'Q',13:'K',14:'A'};
const SUITS = ['s','h','d','c'];
const CATS = ['High card','One pair','Two pair','Trips','Straight','Flush','Full house','Quads','Straight flush'];

function parse(c){ return {r: RANKS[c[0].toUpperCase()], s: c[1].toLowerCase(), str:c[0].toUpperCase()+c[1].toLowerCase()}; }

// score a 5-card hand → comparable array [category, ...tiebreakers]
function scoreFive(cs){
  const rs = cs.map(c=>c.r).sort((a,b)=>b-a);
  const flush = cs.every(c=>c.s===cs[0].s);
  const uniq = [...new Set(rs)].sort((a,b)=>b-a);
  // straight (incl. wheel A-2-3-4-5)
  let straightHigh = 0;
  if(uniq.length>=5){
    for(let i=0;i+4<uniq.length;i++){ if(uniq[i]-uniq[i+4]===4){ straightHigh=uniq[i]; break; } }
    if(!straightHigh && uniq.includes(14) && uniq.includes(5) && uniq.includes(4) && uniq.includes(3) && uniq.includes(2)) straightHigh=5;
  }
  // rank counts
  const cnt={}; rs.forEach(r=>cnt[r]=(cnt[r]||0)+1);
  const groups = Object.entries(cnt).map(([r,n])=>[+r,n])
    .sort((a,b)=> b[1]-a[1] || b[0]-a[0]); // by count desc, then rank desc
  const counts = groups.map(g=>g[1]);
  const byCount = groups.map(g=>g[0]);

  if(flush && straightHigh) return [8, straightHigh];
  if(counts[0]===4) return [7, byCount[0], byCount[1]];
  if(counts[0]===3 && counts[1]===2) return [6, byCount[0], byCount[1]];
  if(flush) return [5, ...rs];
  if(straightHigh) return [4, straightHigh];
  if(counts[0]===3) return [3, byCount[0], byCount[1], byCount[2]];
  if(counts[0]===2 && counts[1]===2) return [2, byCount[0], byCount[1], byCount[2]];
  if(counts[0]===2) return [1, byCount[0], byCount[1], byCount[2], byCount[3]];
  return [0, ...rs];
}

function cmp(a,b){ for(let i=0;i<Math.max(a.length,b.length);i++){ const d=(a[i]||0)-(b[i]||0); if(d) return d; } return 0; }

// best 5 of 7
function best7(cards){
  let best=null;
  const n=cards.length;
  for(let a=0;a<n;a++)for(let b=a+1;b<n;b++)for(let c=b+1;c<n;c++)for(let d=c+1;d<n;d++)for(let e=d+1;e<n;e++){
    const sc=scoreFive([cards[a],cards[b],cards[c],cards[d],cards[e]]);
    if(!best || cmp(sc,best)>0) best=sc;
  }
  return best;
}

function fullDeck(){ const d=[]; for(const s of SUITS) for(const r of Object.keys(RANKS)) d.push(parse(r+s)); return d; }

function describe(score){
  const cat=CATS[score[0]];
  if(score[0]===7) return `${cat} (${RNAME[score[1]]}s)`;
  if(score[0]===6) return `${cat} (${RNAME[score[1]]}s full of ${RNAME[score[2]]}s)`;
  if(score[0]===3) return `${cat} (${RNAME[score[1]]}s)`;
  if(score[0]===2) return `${cat} (${RNAME[score[1]]}s & ${RNAME[score[2]]}s)`;
  if(score[0]===1) return `${cat} (${RNAME[score[1]]}s)`;
  if(score[0]===8||score[0]===4) return `${cat} (${RNAME[score[1]]}-high)`;
  return cat;
}

function analyze(boardStr, heroStr){
  const board = boardStr.map(parse);
  const hero  = heroStr.map(parse);
  const used = new Set([...board,...hero].map(c=>c.str));
  const remaining = fullDeck().filter(c=>!used.has(c.str));
  const heroScore = best7([...board,...hero]);

  let beat=[], tie=[], lose=0;
  for(let i=0;i<remaining.length;i++)for(let j=i+1;j<remaining.length;j++){
    const v=[remaining[i],remaining[j]];
    const vScore=best7([...board,...v]);
    const d=cmp(vScore,heroScore);
    if(d>0) beat.push({hand:v.map(c=>c.str).join(''), desc:describe(vScore)});
    else if(d===0) tie.push({hand:v.map(c=>c.str).join(''), desc:describe(vScore)});
    else lose++;
  }
  return {heroScore, beat, tie, lose, total: beat.length+tie.length+lose};
}

function groupBy(arr){ const m={}; arr.forEach(x=>{ (m[x.desc]=m[x.desc]||[]).push(x.hand); }); return m; }

function report(boardStr, heroStr, label){
  const a = analyze(boardStr, heroStr);
  console.log(`\n=== ${label||''}  board ${boardStr.join(' ')} | hero ${heroStr.join(' ')} ===`);
  console.log(`hero มี: ${describe(a.heroScore)}`);
  console.log(`รวม villain combos: ${a.total}  →  แพ้เรา ${a.lose} | เสมอ ${a.tie.length} | ชนะเรา ${a.beat.length}`);
  if(a.beat.length){
    console.log(`  ⚠ มือที่ "ชนะเรา":`);
    const g=groupBy(a.beat);
    for(const [d,hands] of Object.entries(g)) console.log(`     - ${d} × ${hands.length}  [${hands.slice(0,6).join(', ')}${hands.length>6?' …':''}]`);
  } else console.log(`  ✓ ไม่มีมือไหนชนะเราได้ (effective nuts)`);
  if(a.tie.length){
    const g=groupBy(a.tie);
    console.log(`  = มือที่ "เสมอ (chop)": ` + Object.entries(g).map(([d,h])=>`${d}×${h.length}`).join(', '));
  }
  return a;
}

// ---- CLI ----
const args = process.argv.slice(2);
if(args.includes('/')){
  const i=args.indexOf('/');
  report(args.slice(0,i), args.slice(i+1));
} else {
  // ตรวจทุก river spot ใน spots.js
  const fs=require('fs');
  let src=fs.readFileSync(require('path').join(__dirname,'spots.js'),'utf8').replace('const SPOTS','SPOTS');
  let SPOTS; eval(src);
  const rivers = SPOTS.filter(s=>s.board && s.board.length===5);
  console.log(`ตรวจ ${rivers.length} river spots (board ครบ 5 ใบ):`);
  rivers.forEach(s=> report(s.board, s.hero, s.id));
}

module.exports = { analyze, report };
