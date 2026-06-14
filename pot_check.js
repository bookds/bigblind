/* ============================================================
   BigBlind — Pot Consistency Checker (DEV / QA TOOL)
   ------------------------------------------------------------
   ดึง potEngine จริงจาก app.js (ระหว่าง marker POT-ENGINE-START/END)
   แล้วไล่ตรวจทุก spot: pot ที่คำนวณจาก action ตรงกับ field `pot` ไหม
   - spot ที่ตรง (ok)   → แอปจะโชว์ pot ต่อ street ใน hand history
   - spot ที่ไม่ตรง      → แอปซ่อน street pot (กันโชว์เลขขัดกัน)
   วิธีใช้:  node pot_check.js        (สรุป + รายชื่อ spot ที่ไม่ตรง)
   ============================================================ */
const fs = require('fs');
const path = require('path');

let spotsSrc = fs.readFileSync(path.join(__dirname,'spots.js'),'utf8').replace('const SPOTS','SPOTS');
let SPOTS; eval(spotsSrc);

const appSrc = fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
const m = appSrc.match(/\/\/ ===POT-ENGINE-START===[\s\S]*?\/\/ ===POT-ENGINE-END===/);
if(!m){ console.error('ไม่พบ POT-ENGINE markers ใน app.js'); process.exit(1); }
eval(m[0].replace('function potEngine','globalThis.potEngine = function'));

let okCount = 0; const bad = [], badCall = [];
SPOTS.forEach(s => {
  const r = potEngine(s);
  if(r.ok) okCount++;
  else bad.push(`${s.id}: pot field ${s.pot} ≠ คำนวณ ${r.finalPot}`);
  // toCall ต้องตรงกับที่ hero ค้างจ่ายจริง (เช็คเฉพาะ spot ที่ pot ตรง — เชื่อ action data ได้)
  // ยกเว้น open spot: toCall:0 = "ไม่มีเบทให้เรียก" โดยเจตนา (engine จะเห็นแค่ blind 0.5-1)
  const openSpot = (s.toCall||0)===0 && r.heroToCall<=1;
  if(r.ok && !openSpot && Math.abs((s.toCall||0) - r.heroToCall) > 0.3)
    badCall.push(`${s.id}: toCall field ${s.toCall} ≠ คำนวณ ${r.heroToCall}`);
});
console.log(`ตรวจ ${SPOTS.length} spots → street-pot แสดงได้ ${okCount}, ซ่อน ${bad.length}`);
if(bad.length){ console.log('\nspot ที่ pot ไม่ตรง action (street pot ถูกซ่อน):'); bad.forEach(b=>console.log('  - '+b)); }
if(badCall.length){ console.log('\n⚠ spot ที่ toCall ผิด (ต้องแก้):'); badCall.forEach(b=>console.log('  ✗ '+b)); }

// มือ chain (h*) ต้องตรงทุกตัว — ถ้าไม่ตรงคือ data ผิด ให้แก้
const badChain = bad.filter(b=>/^h\d/.test(b));
if(badChain.length){ console.error('\n⚠ CHAIN HANDS ไม่ผ่าน (ต้องแก้ data):'); badChain.forEach(b=>console.error('  ✗ '+b)); process.exit(2); }
console.log('✓ chain hands (h1-h30) ผ่านทั้งหมด');
