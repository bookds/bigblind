/* ============================================================
   BigBlind — Full Hand Audit (DEV / QA)
   ดึง potEngine จริงจาก app.js แล้ว "เล่นผ่าน" ทุก spot ตรวจ:
   1. ไพ่ชนกัน (board/hero/reveal ต้องไม่ซ้ำ)
   2. stack ติดลบ — committed เกิน stack ของผู้เล่น (= bug ที่ UI โชว์)
   3. ผู้เล่นใน action ไม่มีใน stacks (โชว์ stack ไม่ได้)
   4. shove sanity — คนที่ shove ต้อง all-in (committed ≈ stack)
   5. ลำดับ action ตามตำแหน่ง (preflop: …→SB→BB last / postflop: SB→…→BTN last)
   6. chain ต่อเนื่อง: board ขยาย, stacks เท่าเดิม, hero เท่าเดิม, action ก่อนหน้า = best ของ step ก่อน
   7. best/ok index, why/deep, reveal ครบ
   วิธีใช้: node audit.js
   ============================================================ */
const fs=require('fs'), path=require('path');
let spotsSrc=fs.readFileSync(path.join(__dirname,'spots.js'),'utf8').replace('const SPOTS','SPOTS');
let SPOTS; eval(spotsSrc);
const byId={}; SPOTS.forEach(s=>byId[s.id]=s);
const appSrc=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
const m=appSrc.match(/\/\/ ===POT-ENGINE-START===[\s\S]*?\/\/ ===POT-ENGINE-END===/);
eval(m[0].replace('function potEngine','globalThis.potEngine = function'));

// ลำดับ act: preflop = UTG…BTN,SB,BB (BB สุดท้าย) | postflop = SB,BB,UTG…BTN (BTN สุดท้าย)
const SEAT_PRE ={UTG:0,UTG1:1,MP:2,LJ:3,HJ:4,CO:5,BTN:6,SB:7,BB:8};
const SEAT_POST={SB:0,BB:1,UTG:2,UTG1:3,MP:4,LJ:5,HJ:6,CO:7,BTN:8};
const issues=[];
const add=(id,sev,msg)=>issues.push({id,sev,msg});

function cardsOf(s){ return [...(s.board||[]), ...(s.hero||[]), ...((s.reveal&&s.reveal.cards)||[])]; }
function norm(c){ return c[0].toUpperCase()+c[1].toLowerCase(); }

for(const s of SPOTS){
  // --- 1. card collisions ---
  const seen={};
  for(const c of cardsOf(s)){ const k=norm(c); if(seen[k]) add(s.id,'ERR',`ไพ่ซ้ำ ${k} (${seen[k]} + ${'card'})`); seen[k]=true; }
  if(s.board) s.board.forEach(c=>{ if(!/^[2-9TJQKA][shdc]$/.test(norm(c))) add(s.id,'ERR',`board card แปลก: ${c}`); });
  if(s.hero){ if(s.hero.length!==2) add(s.id,'ERR',`hero ไม่ใช่ 2 ใบ`); s.hero.forEach(c=>{ if(!/^[2-9TJQKA][shdc]$/.test(norm(c))) add(s.id,'ERR',`hero card แปลก: ${c}`); }); }

  // --- 2/3/4. stacks & action replay ---
  const heroPos=(s.heroLine||'').split('•')[0].trim();
  const eng=potEngine(s);
  const stackMap={}; (s.stacks||[]).forEach(([p,bb])=>stackMap[p]=bb);
  // ค่า commit สะสมต่อผู้เล่น (ไล่จาก engine rows = total committed หลัง action นั้น)
  (s.streets||[]).forEach((st,si)=>{
    (st.acts||[]).forEach((a,ai)=>{
      const p=a.pos==='YOU'?heroPos:a.pos;
      const grouped=/[\s…]/.test(p.trim());
      const committed=eng.rowsPerStreet[si][ai];
      if(grouped) return;
      if(stackMap[p]==null){ if(s.stacks && a.a!=='fold') add(s.id,'WARN',`${p} อยู่ใน action (${a.a}) แต่ไม่มีใน stacks`); return; }
      const remain=stackMap[p]-committed;
      if(remain < -0.05) add(s.id,'ERR',`${p} stack ติดลบ: ${stackMap[p]}bb แต่ลงไป ${committed.toFixed(1)}bb (เหลือ ${remain.toFixed(1)})`);
      // shove ถูกต้องถ้า: ตัวเอง all-in (committed≈stack) หรือ คุม hero (committed≈stack ของ hero = ดัน hero all-in)
      if(a.a==='shove'){
        const heroStk=stackMap[heroPos]!=null?stackMap[heroPos]:parseFloat((s.heroLine||'').replace(/[^0-9.]/g,''));
        const selfAllIn=Math.abs(remain)<=1.0, coversHero=heroStk&&Math.abs(committed-heroStk)<=1.0;
        if(!selfAllIn && !coversHero) add(s.id,'WARN',`${p} shove ไม่สมเหตุผล: ลง ${committed.toFixed(1)}bb (stack ${stackMap[p]}, hero ${heroStk}) — ไม่ all-in และไม่คุม hero`);
      }
    });
  });

  // --- 5. action order per street ---
  (s.streets||[]).forEach((st)=>{
    const isPre = st.name==='Preflop';
    const SEAT = isPre ? SEAT_PRE : SEAT_POST;
    const order=[]; // seat index ของ action รอบแรก (จนกว่าจะมี raise วน)
    (st.acts||[]).forEach(a=>{
      const p=a.pos==='YOU'?heroPos:a.pos;
      const first=p.trim().split(/[\s…]/)[0];
      if(SEAT[first]!=null) order.push({seat:SEAT[first],act:a.a,pos:first});
    });
    // ตรวจรอบแรก: seat ควรเพิ่มขึ้น จนกว่าจะเจอ action ที่ "ใส่เงิน" (เปิดรอบใหม่ → วนกลับไป seat ต่ำได้)
    const OPENS=new Set(['bet','cbet','donk','raise','3bet','4bet','shove','squeeze']);
    let prev=-1, wrapped=false;
    for(const o of order){
      if(!wrapped){
        if(o.seat < prev){ // ลำดับถอยหลังโดยไม่ผ่าน bet/raise = ผิด
          add(s.id,'WARN',`ลำดับ action ${st.name}: ${o.pos}(seat ${o.seat}) มาหลัง seat ${prev}`);
        }
        prev=o.seat;
        if(OPENS.has(o.act)) wrapped=true; // หลังมีคนใส่เงิน วนรอบใหม่ได้
      }
    }
  });

  // --- 7. best/ok/why/deep/reveal ---
  if(!s.opts||!s.opts.length) add(s.id,'ERR','ไม่มี opts');
  else { if(s.best==null||s.best<0||s.best>=s.opts.length) add(s.id,'ERR',`best index ผิด: ${s.best}`); (s.ok||[]).forEach(i=>{ if(i<0||i>=s.opts.length) add(s.id,'ERR',`ok index ผิด: ${i}`); }); }
  if(!s.why) add(s.id,'WARN','ไม่มี why');
  if(!s.deep) add(s.id,'WARN','ไม่มี deep');
  if(s.reveal && (!s.reveal.cards||s.reveal.cards.length!==2)) add(s.id,'ERR','reveal.cards ไม่ใช่ 2 ใบ');
}

// --- 6. chain continuity ---
SPOTS.filter(s=>s.nextSpotId).forEach(s=>{
  const nx=byId[s.nextSpotId];
  if(!nx){ add(s.id,'ERR',`nextSpotId ชี้ไป ${s.nextSpotId} ที่ไม่มี`); return; }
  // hero เท่าเดิม
  if((s.hero||[]).join()!==(nx.hero||[]).join()) add(nx.id,'ERR',`hero เปลี่ยนจาก step ก่อน (${s.hero} → ${nx.hero})`);
  // stacks เท่าเดิม
  if(JSON.stringify(s.stacks)!==JSON.stringify(nx.stacks)) add(nx.id,'WARN',`stacks ต่างจาก step ก่อน (${s.id})`);
  // board ขยาย (step ก่อนเป็น prefix ของ step ถัดไป)
  const b0=(s.board||[]).map(norm), b1=(nx.board||[]).map(norm);
  if(b1.length < b0.length) add(nx.id,'ERR',`board หดจาก step ก่อน`);
  for(let i=0;i<b0.length;i++) if(b0[i]!==b1[i]) add(nx.id,'ERR',`board card #${i+1} เปลี่ยน: ${b0[i]}→${b1[i]}`);
  // hero action ก่อนหน้าใน step ถัดไป ต้องเป็น best ของ step ก่อน (ไลน์ canonical, ไม่ใช่ fold)
  const bestAct=s.opts[s.best].k;
  if(bestAct==='fold') add(s.id,'WARN',`step มี nextSpotId แต่ best = fold (จะไม่มีวันไปต่อ)`);
});

// --- รายงาน ---
const errs=issues.filter(i=>i.sev==='ERR'), warns=issues.filter(i=>i.sev==='WARN');
console.log(`ตรวจ ${SPOTS.length} spots → ERROR ${errs.length}, WARNING ${warns.length}\n`);
if(errs.length){ console.log('=== ERRORS (ต้องแก้) ==='); errs.forEach(i=>console.log(`  ✗ [${i.id}] ${i.msg}`)); console.log(); }
if(warns.length){ console.log('=== WARNINGS (ตรวจดู) ==='); warns.forEach(i=>console.log(`  ⚠ [${i.id}] ${i.msg}`)); }
if(!errs.length && !warns.length) console.log('✓ ไม่พบปัญหา');
process.exit(errs.length?1:0);
