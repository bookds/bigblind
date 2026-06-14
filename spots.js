/* ============================================================
   BigBlind — Poker Tournament Spot Library
   ------------------------------------------------------------
   โครงสร้างของแต่ละ spot:
   {
     id, cat:'preflop'|'postflop',
     stage:'...'  (badge ฟ้า),  stack:'...' (badge ทอง),  icm:true? (badge แดง),
     pot, toCall,            // ตัวเลขเป็น bb สำหรับ potline
     board:['Qh','7c','2d'], // postflop เท่านั้น
     hero:['As','Kd'],
     heroLine:'BTN • 25bb',  // ตำแหน่ง + stack ของเรา
     stacks:[['UTG',40],['BTN',25],['BB',30]], // (ออปชั่น) stack ของผู้เล่นที่อยู่ในมือ เรียงตามที่นั่ง [ตำแหน่ง, bb] — ตำแหน่งที่ตรงกับเราจะไฮไลต์
     log:[ '...', '...' ],   // ลำดับ action ก่อนถึงเรา (แสดงเป็นบรรทัด)
     q:'คำถาม',
     opts:[ {k:'fold'|'call'|'raise'|'shove', label, sub} ],
     best:0,                 // index คำตอบที่ดีที่สุด
     ok:[1],                 // (ออปชั่น) index ที่ "พอรับได้" นับเป็นถูก
     why:'เฉลย HTML',        // คำอธิบายสั้น (โชว์ทันทีหลังตอบ)
     deep:'เจาะลึก HTML',    // กดปุ่ม "ทำไม?" เพื่อดู: สมมติฐาน range คู่ต่อสู้ / ทางเลือกอื่น / อะไรเปลี่ยนคำตอบ

     // ---- มือต่อเนื่อง (chain spots ผ่าน preflop → showdown หรือจนกว่าจะมีคน fold) ----
     step:'1/4',             // (ออปชั่น) ป้ายบอกขั้นใน hand: "1/4", "2/4", ...
     hidden:true,            // (ออปชั่น) middle/last step ของ hand — ห้ามโผล่เป็นจุดเริ่มสุ่ม (เข้าได้ผ่าน nextSpotId)
     nextSpotId:'h1b',       // (ออปชั่น) ขั้นถัดไปของ hand เดิม. ถ้าเลือก "ไม่ใช่ fold" → ไปต่อ link นี้; ถ้า fold → จบ hand
     reveal:{pos:'BTN', cards:['Ah','Qh'], note:'เปิด nut flush<br>— ...'}, // (ออปชั่น) เปิดไพ่คู่ต่อสู้ใน sheet เฉลย (showdown/fold-หงาย) — ไพ่ห้ามชนกับ board/hero
   }
   ============================================================ */

const SPOTS = [

/* ---------------------- PREFLOP ---------------------- */
{
  id:'pf1', cat:'preflop',
  stage:'Mid Stage', stack:'45bb',
  pot:1.5, toCall:0,
  hero:['Ah','Js'], heroLine:'UTG • 45bb (9-max)',
  streets:[{name:'Preflop', note:'ตาคุณเปิดเป็นคนแรก', acts:[]}],
  q:'AJo จาก UTG ในโต๊ะ 9 คน จะทำอย่างไร?',
  opts:[ {k:'fold',label:'Fold'}, {k:'raise',label:'Raise',sub:'2.2bb'} ],
  best:0,
  why:`<b>เฉลย: Fold</b> — AJo เป็นมือที่ "ดูดี" แต่จาก UTG ในโต๊ะเต็ม (9 คน) มันอยู่นอก opening range ที่ทำกำไร
  เพราะมีคนตามหลังเราอีก 8 คนที่อาจถือมือแข็งกว่า (AQ, AK, KK+) ทำให้เราโดน <span class="k">dominate</span> บ่อย
  <br><br>UTG range ที่เหมาะคือประมาณ top ~12-14% (77+, ATs+, AJs+, KQs, AQo+). AJo อยู่ขอบนอก
  ยิ่งโต๊ะลึก (45bb) ยิ่งเล่นยาก postflop. ถ้าเป็นโต๊ะ 6-max ค่อยเปิดได้`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> มี 8 คนตามหลัง — โอกาสเจอมือ premium (QQ+, AK) สูงพอควร และ AJo โดน AQ/AK/AJs/KQs dominate (เราเหลือ ~30% เมื่อเงินเข้ากอง)
  <br><b>• ทางเลือกอื่น:</b> raise ได้ก็ต่อเมื่อโต๊ะ passive มากๆ ที่ไม่มีใคร 3bet — นั่นคือ exploit ไม่ใช่ baseline
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> 6-max → raise ทันที. มี antes → opening range กว้างขึ้นเล็กน้อย. ถ้าเป็น AJs (suited) → เปิดได้แม้ 9-max เพราะ playability + flush ช่วยมาก`
},
{
  id:'pf2', cat:'preflop',
  stage:'Mid Stage', stack:'40bb',
  pot:1.5, toCall:0,
  hero:['7h','6h'], heroLine:'BTN • 40bb',
  streets:[{name:'Preflop', acts:[{pos:'UTG MP CO', a:'fold'}]}],
  q:'76s บนปุ่ม (BTN) ทุกคนพับมาถึงเรา?',
  opts:[ {k:'fold',label:'Fold'}, {k:'raise',label:'Raise',sub:'2.2bb'} ],
  best:1,
  why:`<b>เฉลย: Raise (steal)</b> — บน BTN เมื่อทุกคน fold มา เราเปิดได้กว้างมาก (~45-50% ของมือ)
  เพราะมีแค่ SB กับ BB เหลือ และเรามี <span class="k">position</span> ตลอดเกมหลังฟลอป
  <br><br>76s เป็นมือ steal ชั้นดี: มี playability สูง (ต่อ straight/flush ได้), blocker น้อย, และถ้าโดน call ก็เล่น postflop ในตำแหน่งได้สบาย
  การ fold มือนี้คือทิ้งกำไรฟรีจาก blinds`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> เหลือแค่ SB+BB. ถ้า BB defend กว้าง (40%+) เรายังได้เปรียบเพราะมี position และ 76s flop ได้ดีหลายทาง
  <br><b>• ทางเลือกอื่น:</b> ถ้า BB เป็นคน 3bet หนักมากๆ อาจลด steal range ลงบ้าง แต่ 76s ยัง call 3bet เล็กหรือ 4bet-bluff ได้ (มี blocker + equity)
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> blinds เป็นคน sticky/station มาก → ลด bluff-heavy hands ลงเล็กน้อย. stack สั้น (<15bb) → เปลี่ยนเป็น shove/fold, 76s borderline shove`
},
{
  id:'pf3', cat:'preflop',
  stage:'Mid Stage', stack:'30bb',
  pot:3.7, toCall:1.2,
  hero:['Kd','Qd'], heroLine:'BB • 30bb',
  stacks:[['BTN',38],['BB',30]],
  streets:[{name:'Preflop', acts:[{pos:'BTN', a:'raise', amt:'2.2'},{pos:'SB', a:'fold'}]}],
  q:'KQs ใน BB เจอ BTN เปิด 2.2bb จะทำอย่างไร?',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call',sub:'1.2bb'}, {k:'raise',label:'3-Bet',sub:'9bb'} ],
  best:2, ok:[1],
  why:`<b>เฉลย: 3-Bet (Call รับได้)</b> — KQs แข็งพอที่จะ 3bet เพื่อ value เจอ steal range กว้างของ BTN
  เรา dominate มืออย่าง KJ/KT/QJ และมี equity ดีแม้โดน 4bet
  <br><br>3bet ทำให้เราคุมขนาดพอตและกดดันได้ <span class="k">in position</span> แม้เราเสีย position แต่ initiative ช่วยชดเชย
  Call ก็ใช้ได้ในกลยุทธ์ที่อยาก keep range กว้างและเล่นพอตเล็ก แต่ KQs แข็งเกินกว่าจะแค่ flat ทุกครั้ง`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> BTN steal กว้าง (~45%) — KQs dominate Kx/Qx ส่วนใหญ่ และ flip vs pairs เล็ก. โดน 4bet จาก BTN range แคบ (QQ+, AK) เราก็มี ~30%+ และ fold เฉยๆ ได้
  <br><b>• ทางเลือกอื่น:</b> Call เพื่อ keep BTN's bluffs ใน range + เล่น flop หลายทาง (KQs flop ดีมาก). เหมาะถ้า BTN c-bet หนักจนเราโดน exploit เวลา 3bet/fold
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> stack ลึก (50bb+) → 3bet มีค่ามากขึ้น (gap leverage). vs BTN ที่ open tight → flat มากกว่า เพราะ 3bet จะ fold out มือที่เราชนะ`
},
{
  id:'pf4', cat:'preflop',
  stage:'Mid Stage', stack:'12bb',
  pot:1.5, toCall:0,
  hero:['Ad','9s'], heroLine:'CO • 12bb',
  streets:[{name:'Preflop', acts:[{pos:'UTG MP', a:'fold'}]}],
  q:'A9o ที่ CO ด้วย stack 12bb — push/fold zone',
  opts:[ {k:'fold',label:'Fold'}, {k:'shove',label:'All-in',sub:'12bb'} ],
  best:1,
  why:`<b>เฉลย: All-in (shove)</b> — ที่ stack ~12bb เราเข้าโซน <span class="k">push/fold</span> การเปิดแบบ raise เล็กแล้วต้องเจอ 3bet จะทำให้เราเล่นลำบาก
  <br><br>A9o จาก CO (เหลือ 3 คนตามหลัง) เป็น shove ที่ทำกำไรชัดเจนตามตาราง Nash:
  มี ace blocker ลด combo AK/AQ/AA ของคู่ต่อสู้ และมี fold equity สูง ถ้าโดน call ก็ยังมี ~30%+ บ่อยครั้ง
  ที่ 12bb การ fold A9o ที่นี่คือ too tight`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> เหลือ BTN/SB/BB 3 คน. call range ที่ทำให้เราเจ็บคือ Ax สูง/pairs — แต่ A blocker ของเราตัด AT/AJ/AQ/AA/AK ลงเยอะ ทำให้ shove +EV
  <br><b>• ทางเลือกอื่น:</b> min-raise/fold ใช้ได้ที่ 12-15bb บางสูตร แต่ open-jam ง่ายกว่าและตัดปัญหาโดน 3bet shove
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> stack 18-20bb+ → เปลี่ยนเป็น raise/fold แทน shove. มี ICM หนัก (bubble/FT) → shove range แคบลง, A9o borderline. โต๊ะมี short stack หลังเราที่ call ง่าย → ระวังขึ้น`
},
{
  id:'pf5', cat:'preflop',
  stage:'Final Table', stack:'22bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 5 คน · เงินรางวัลห่างกันมากทุกอันดับ · bust = เสีย pay jump',
  pot:3.7, toCall:5,
  hero:['Ac','Qh'], heroLine:'BB • 22bb',
  stacks:[['SB',18],['BB',22]],
  streets:[{name:'Preflop', acts:[{pos:'CO BTN', a:'fold'},{pos:'SB', a:'shove', amt:'18'}]}],
  q:'AQo ใน BB เจอ SB shove 18bb — Final Table, เหลือ 5 คน เงินรางวัลต่างกันมาก',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call all-in'} ],
  best:1, ok:[0],
  why:`<b>เฉลย: Call (เป็น close spot เพราะ ICM)</b> — แบบ chipEV ล้วน AQo call ชนะ SB shove range ง่ายๆ (SB shove กว้างมากจาก blinds vs blinds)
  <br><br>แต่ที่ <b>Final Table</b> ต้องคิด <span class="k">ICM</span>: การ bust ก่อนแลกชิปมีมูลค่า "แพง" กว่าปกติ ทำให้เกณฑ์ call เข้มขึ้น
  AQo ยังถือว่าแข็งพอจะ call vs SB ที่ shove กว้าง (มี Kx, Ax, pairs เล็ก, suited junk) — เราเป็นต่อหรือ flip เกือบตลอด
  ถ้า SB เป็นคน tight มากๆ การ fold ก็ defensible. นี่คือ spot ที่ต้องอ่าน range คู่ต่อสู้`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> SB shove 22bb vs BB กว้างได้มาก (Ax, Kx, pairs, suited connectors). vs range นั้น AQo เป็นต่อ/flip เกือบตลอด — chipEV call ชัด
  <br><b>• ICM:</b> เหลือ 5 คน เงินรางวัลต่างกันมาก → risk premium สูง, เกณฑ์ call ต้องการ equity มากกว่า chipEV. AQo อยู่ขอบที่ยัง call ได้แต่ไม่ใช่ snap
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> SB tight (shove แค่ value) → fold. ICM เบาลง (pay jumps เล็ก) หรือเราเป็น big stack → call สบาย. เหลือ short stack อื่นใกล้ bust → รอให้เขา bust ก่อน = fold tighter`
},
{
  id:'pf6', cat:'preflop',
  stage:'Bubble', stack:'28bb', icm:true,
  icmState:'🫧 <b>BUBBLE</b> · อีก 1 คน bust = เข้าเงิน · short stacks เล่นแน่นสุดๆ · big stacks กดดันได้',
  pot:6.2, toCall:7.5,
  hero:['As','Ks'], heroLine:'BTN • 28bb',
  stacks:[['UTG',42],['BTN',28]],
  streets:[{name:'Preflop', acts:[{pos:'UTG', a:'raise', amt:'2.2'},{pos:'MP CO', a:'fold'}]}],
  q:'AKs บน BTN เจอ UTG เปิด ช่วง Bubble (อีก 1 คน bust = เข้าเงิน)',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call',sub:'2.2bb'}, {k:'raise',label:'3-Bet',sub:'7.5bb'} ],
  best:2, ok:[1],
  why:`<b>เฉลย: 3-Bet</b> — AKs เป็นมือ premium ที่เล่น 3bet ได้ทุกสถานการณ์ แม้ช่วง bubble
  เราได้ทั้ง fold equity และ value เมื่อโดน call/4bet (เป็นต่อ AQ/AJ, flip vs pairs)
  <br><br>ช่วง <span class="k">bubble</span> คู่ต่อสู้กลัว bust จึง 4bet/jam แคบลง = fold equity ของเราสูงขึ้น ยิ่งทำให้ 3bet ทำกำไร
  เราคุมเกมจาก position ได้ดี Call ก็พอใช้ได้แต่ AKs แข็งเกินกว่าจะ flat เฉยๆ บน BTN — เสีย value และปล่อยให้ blinds เข้ามาถูกๆ`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> UTG open range แคบ (premium-heavy) แต่ AKs ยัง flip/นำ vs pairs และ dominate AQ/AJ. โดน 4bet เราก็ call/jam ได้สบาย (AKs ไม่เคย fold pre)
  <br><b>• ทางเลือกอื่น:</b> Call เพื่อให้ blinds เข้ามาแล้วเล่น multiway in-position ได้ — แต่ปล่อย equity ของ AKs (มือเรา flop ดีและอยากได้ initiative)
  <br><b>• Bubble/ICM:</b> เป็น big stack ช่วง bubble → 3bet ยิ่งดี (กดดัน short/medium stacks). ถ้าเราเองเป็น short stack ใกล้เงิน → ระวัง 3bet ที่ commit ตัวเอง อาจ flat ปลอดภัยกว่า`
},
{
  id:'pf7', cat:'preflop',
  stage:'Mid Stage', stack:'50bb',
  pot:8.5, toCall:1.5,
  hero:['9c','9d'], heroLine:'BB • 50bb',
  stacks:[['CO',55],['BTN',62],['SB',38],['BB',50]],
  streets:[{name:'Preflop', acts:[{pos:'CO', a:'raise', amt:'2.5'},{pos:'BTN', a:'call'},{pos:'SB', a:'call'}]}],
  q:'99 ใน BB เจอ CO เปิด + BTN call + SB call (multiway)',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call',sub:'1.5bb'}, {k:'raise',label:'Squeeze',sub:'14bb'} ],
  best:1, ok:[2],
  why:`<b>เฉลย: Call (set-mine + realize equity)</b> — พอตเป็น multiway (3 คนลงแล้ว) และเราได้ราคาดีมากใน BB
  99 เล่น call เพื่อเห็นฟลอปถูกๆ ถ้าเจอ set (~12%) ก็ stack ใครได้สบาย
  <br><br>Squeeze ก็เป็นออปชั่นเชิงรุกที่ดีถ้าคู่ต่อสู้ fold ง่าย แต่ multiway + deep stack ทำให้ squeeze เสี่ยงโดน call หลายทาง
  และ 99 ไม่ชอบเล่นพอตใหญ่ preflop เพราะมัก flip/เป็นรองเมื่อเงินเข้ากองเยอะ. การ fold คือ too tight — ราคาดีเกินไป`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> multiway (3 คนลงแล้ว) → มีโอกาสเจอ overpair/set ของคนอื่นสูง 99 จึงเป็น "set or give up" บ่อย — ราคา call ถูกทำให้คุ้ม (set-mining ต้องการ implied odds ~10-15:1, deep 50bb ได้)
  <br><b>• ทางเลือกอื่น:</b> Squeeze 14bb กดดันให้ทุกคน fold ได้ดีถ้าโต๊ะ tight — แต่ multiway + deep ทำให้โดน call หลายทาง และ 99 ไม่อยากเล่นพอตบวมแบบ flip
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> stack ตื้น (25bb) → squeeze/jam ดีขึ้น (set-mine ไม่คุ้ม). คนเปิด/คนตามเป็น fit-or-fold → squeeze ทำกำไรขึ้น`
},
{
  id:'pf8', cat:'preflop',
  stage:'Mid Stage', stack:'35bb',
  pot:5.2, toCall:7,
  hero:['Ah','Qc'], heroLine:'CO • 35bb',
  stacks:[['CO',35],['BTN',44]],
  streets:[{name:'Preflop', acts:[{pos:'YOU', a:'raise', amt:'2.2'},{pos:'BTN', a:'3bet', amt:'7'},{pos:'SB BB', a:'fold'}]}],
  q:'เราเปิด AQo ที่ CO แล้วโดน BTN 3-bet — ทำอย่างไร?',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call',sub:'+4.8bb'}, {k:'raise',label:'4-Bet',sub:'17bb'} ],
  best:1, ok:[0],
  why:`<b>เฉลย: Call (Fold พอรับได้ vs คน tight)</b> — AQo เจอ 3bet จาก BTN เป็น spot คลาสสิกที่ "ไม่ดีพอจะ 4bet for value, ไม่แย่พอจะ fold ทิ้ง"
  <br><br>ถ้า 4bet เราจะ fold ออก range ที่เราชนะ (KQ/AJ/bluffs) และโดน call/jam จากมือที่ <span class="k">dominate</span> เรา (AK/AA/KK) — กลายเป็น 4bet ที่ขาดทุน
  Call เพื่อเล่น postflop และ realize equity (AQ ยังตี top pair ได้) เป็นทางเลือกที่ดีที่สุดเมื่อ stack 35bb. ถ้าคู่ต่อสู้ 3bet แคบมาก (value เพียวๆ) การ fold ก็ถูกต้อง`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> BTN 3bet เรา (CO open) — ถ้า polarized (value + bluffs) AQo call ดีเพราะชนะ bluffs และ flop top pair ได้. ถ้า linear/value-heavy → fold ดีกว่า เพราะโดน AK/AQ/KK+ dominate
  <br><b>• ทำไมไม่ 4bet:</b> 4bet ทำให้ range เรากลายเป็น polar — AQo เป็น bluff ที่ "บล็อกน้อย" และโดน jam จาก range ที่บีตเรา = จุดอ่อน ดีกว่าเก็บ AK/AA/KK ไว้ 4bet
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> stack ตื้นลง (25bb) → 4bet-jam เริ่มมีค่า (fold equity + ลดการเล่น OOP ยากๆ). ถ้าเรา OOP (เช่นโดน 3bet จาก BB) → fold tighter`
},
{
  id:'pf9', cat:'preflop',
  stage:'Early', stack:'80bb',
  pot:1.5, toCall:0,
  hero:['Ts','Th'], heroLine:'MP • 80bb',
  streets:[{name:'Preflop', acts:[{pos:'UTG', a:'fold'}]}],
  q:'TT จาก MP, stack ลึก 80bb (early stage)',
  opts:[ {k:'fold',label:'Fold'}, {k:'raise',label:'Raise',sub:'2.5bb'} ],
  best:1,
  why:`<b>เฉลย: Raise</b> — TT เป็นมือแข็ง อยู่ใน opening range ของทุกตำแหน่งตั้งแต่ UTG
  เปิด raise เพื่อ value และ initiative — ง่ายๆ ตรงไปตรงมา
  <br><br>แม้ stack ลึก 80bb ก็ไม่ใช่เหตุผลให้เล่นแบบ slowplay/limp. การ limp TT จะทำให้พอตหลายทางและเสีย initiative
  เปิด 2.5bb เพื่อ thin the field และเริ่มสร้างพอตจากตำแหน่งที่ได้เปรียบ. (ระวัง: ถ้าโดน 3bet หนักจาก deep stack อาจต้องเล่นระวัง แต่ preflop เปิดคือถูกต้อง)`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> UTG พับแล้ว เหลือคนหลังเราที่อาจ 3bet — TT call 3bet ได้ที่ 80bb (set-mine + equity) หรือ 4bet-bluff/value mix ขึ้นกับคน
  <br><b>• ทำไมไม่ limp:</b> limp = เสีย initiative, เชิญ multiway, และทำให้ range เรา cap. raise สร้าง fold equity + สร้างพอตจาก position
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> โดน 3bet จาก nit → call/fold เล่นง่ายๆ (set-mine). vs aggro ที่ 3bet กว้าง → 4bet for value ได้. stack ตื้น → TT แข็งพอจะ stack off pre บ่อยขึ้น`
},
{
  id:'pf10', cat:'preflop',
  stage:'Final Table', stack:'15bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 6 คน · สแต็กเรากลางๆ · bust ตอนนี้แพงมาก · เล่นเน้น survival',
  pot:1.5, toCall:0,
  hero:['Kh','Js'], heroLine:'SB • 15bb',
  stacks:[['SB',15],['BB',20]],
  streets:[{name:'Preflop', note:'พับมาถึงคุณ (เหลือ BB 20bb)', acts:[]}],
  q:'KJo ใน SB, blinds vs blinds, 15bb — Final Table',
  opts:[ {k:'fold',label:'Fold'}, {k:'shove',label:'All-in',sub:'15bb'}, {k:'raise',label:'Raise',sub:'2bb'} ],
  best:2, ok:[1],
  why:`<b>เฉลย: Raise small (Shove ก็ได้)</b> — SB vs BB ที่ 15bb, KJo แข็งพอจะเล่น แต่การ shove 15bb เป็นการเสี่ยงเกินจำเป็นเมื่อ KJo dominated โดน call range ของ BB (AK/AQ/AJ/KQ)
  <br><br>Raise เล็ก (limp/raise strategy) ช่วยให้เรา keep ชิป และเล่น postflop ได้ — KJo ตี top pair ได้บ่อย. ที่ stack นี้ min-raise/fold หรือ raise-call เป็น mix ที่ดี
  Shove ใช้ได้ในเชิง simplicity (heads-up blinds, fold equity สูง) แต่ระวัง ICM — bust ที่ FT แพง. การ fold KJo ใน SB heads-up = too tight`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> BB (20bb) call/shove range vs SB action — KJo โดน AK/AQ/AJ/KQ dominate แต่ชนะ pairs เล็ก/Qx/Jx. SB vs BB เป็น spot ที่เราเปิดกว้างมากเพราะ heads-up
  <br><b>• ทำไม raise > shove:</b> ที่ 15bb shove เสี่ยงเกินจำเป็นเมื่อ KJo dominated; raise เล็กเก็บชิป + เล่น flop (top pair บ่อย) + fold ต่อ 3bet shove ได้
  <br><b>• ICM:</b> FT, bust แพง → เอนไป raise/fold มากกว่า shove ทั้งหมด. ถ้า BB เป็น station/wide caller → shove value ลดลง, raise-fold ดีกว่า. ถ้า BB nit → steal กว้างได้`
},

/* ---------------------- POSTFLOP ---------------------- */
{
  id:'po1', cat:'postflop',
  stage:'Mid Stage', stack:'40bb',
  pot:5.5, toCall:0,
  board:['Kc','7d','2s'], hero:['Ad','Kh'], heroLine:'BTN • PFR',
  stacks:[['BTN',40],['BB',44]],
  streets:[{name:'Preflop', acts:[{pos:'YOU', a:'raise'},{pos:'BB', a:'call'}]},{name:'Flop', acts:[{pos:'BB', a:'check'}]}],
  q:'เราเป็น PFR ถือ AK ตี top pair บนบอร์ดแห้ง K72r, BB เช็คมา',
  opts:[ {k:'call',label:'Check'}, {k:'raise',label:'Bet',sub:'1/3 pot'} ],
  best:1,
  why:`<b>เฉลย: Bet เล็ก (1/3 pot)</b> — บอร์ด K72 rainbow แห้งมาก เป็น board ที่ <span class="k">range ของเรา (PFR) ได้เปรียบ</span>
  เรามี Kx/overpair มากกว่า BB ที่แค่ call. AKs/AKo ต้องการ value จาก Kx ที่อ่อนกว่า, Qx/Jx ที่ float
  <br><br>เบทเล็กพอเพราะบอร์ดแห้ง ไม่มี draw ให้กลัว — ได้ทั้ง value และ deny equity ราคาถูก
  การ check จะเสีย value จากมือที่ยอมจ่าย และให้ฟรีการ์ดกับ overcard. เบท 1/3 เป็น GTO standard บน dry board`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> BB ที่ call pre แล้ว check flop = Kx อ่อน (KQ/KJ/KT), pairs (77-22 บางส่วน), Qx/Jx/draws gutshot. เราตี value จาก worse Kx และ deny equity จาก 6 overcards
  <br><b>• Sizing:</b> ใช้ 1/3 เพราะ board แห้ง — เราเบท range ทั้งหมดได้ (range bet) ราคาถูก ทำให้ BB ป้องกันยาก. board เปียกค่อยใช้ size ใหญ่ขึ้น
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> vs BB ที่ check-raise bluff หนัก → ยังเบทแต่พร้อม call down. ถ้าถือมือกลางๆ ที่ไม่อยากโดน raise (เช่น 88) → check บ้างเพื่อ protect checking range`
},
{
  id:'po2', cat:'postflop',
  stage:'Mid Stage', stack:'45bb',
  pot:6, toCall:4.5,
  board:['9h','8h','5c'], hero:['Ac','As'], heroLine:'CO • PFR',
  stacks:[['CO',45],['BTN',47]],
  streets:[{name:'Preflop', acts:[{pos:'YOU', a:'raise'},{pos:'BTN', a:'call'}]},{name:'Flop', acts:[{pos:'YOU', a:'cbet', amt:'½'},{pos:'BTN', a:'raise', amt:'4.5'}]}],
  q:'AA โดน raise บนบอร์ด 9♥8♥5♣ (wet) — ทำอย่างไร?',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call',sub:'4.5bb'}, {k:'raise',label:'3-Bet/Jam'} ],
  best:1, ok:[2],
  why:`<b>เฉลย: Call</b> — บอร์ด 9♥8♥5♣ เปียกมาก (straight draw + flush draw เพียบ) BTN raise range มีทั้ง value (sets, two pair, 76/JT straight) และ draws (flush/straight)
  <br><br>AA ยังเป็น overpair ที่นำ draw ส่วนใหญ่ แต่ <b>ไม่ใหญ่พอจะ stack off ทันที</b> บน board นี้ — ถ้า jam แล้วโดน call เรามักเจอ set/two pair หรือ flip vs combo draw
  Call เพื่อ control pot และดู turn: ถ้า turn เป็น brick (ไม่ใช่ ♥/straight card) AA แข็งขึ้นมาก, ถ้า turn อันตรายค่อยถอย. การ fold AA ที่นี่ over-fold เกินไป`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> BTN raise flop = sets (99/88/55), two pair (98), straights (76/JT), combo draws (flush+straight). AA นำ draws ทั้งหมดแต่แพ้ made hands — เป็น "ahead of draws, behind value"
  <br><b>• ทำไม Call > Jam:</b> jam แล้วโดน call = isolate ตัวเองเจอแต่มือที่บีตเรา/flip; fold ออก bluffs/draws ที่เราอยากให้อยู่. call เก็บ bluffs + เห็น turn ราคาถูก
  <br><b>• Turn plan:</b> brick (off-suit low) → AA แข็ง, call/raise ต่อได้. ♥ หรือ straight card → ระวัง, ยอมถอยถ้าโดน barrel หนัก
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> stack ตื้น (SPR ต่ำ) → jam ดีขึ้น (commit อยู่แล้ว). vs คน raise แต่ value → fold/call tighter`
},
{
  id:'po3', cat:'postflop',
  stage:'Mid Stage', stack:'38bb',
  pot:7, toCall:0,
  board:['Qs','Jd','4c','2h'], hero:['Ah','Th'], heroLine:'BTN • PFR',
  stacks:[['BTN',38],['BB',41]],
  streets:[{name:'Preflop', acts:[{pos:'YOU', a:'raise'},{pos:'BB', a:'call'}]},{name:'Flop', acts:[{pos:'BB', a:'check'},{pos:'YOU', a:'cbet', amt:'½'},{pos:'BB', a:'call'}]},{name:'Turn', acts:[{pos:'BB', a:'check'}]}],
  q:'Turn brick, เราถือ AThh (gutshot ขอ K + overcard A) บน QJ42',
  opts:[ {k:'call',label:'Check'}, {k:'raise',label:'Bet',sub:'2/3 pot'} ],
  best:1,
  why:`<b>เฉลย: Bet (double barrel bluff/semi-bluff)</b> — AT มี equity ดี: gutshot ขอ K มาเป็น nut straight + ace overcard ที่อาจดีที่สุดบางครั้ง
  เรายังเป็น PFR ที่ range นำบน QJx board
  <br><br>การ barrel turn กดดัน Qx ที่อ่อน (QT/Q9) และ Jx ให้ fold + สร้าง fold equity ตอนนี้ พร้อม backup ถ้าโดน call ก็ยังมี outs ชัดเจน (K = nuts)
  ถ้า check จะปล่อยให้คู่ต่อสู้ realize equity ฟรีและเราเสียโอกาส fold equity. นี่คือ <span class="k">semi-bluff</span> ที่ +EV`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> BB call flop แล้ว check turn = Qx (QT/Q9/KQ), Jx, pairs, draws. หลายมือพับต่อ barrel — fold equity ดี และเรามี backup (K = nut straight, บางที A สูงสุด)
  <br><b>• Equity:</b> gutshot 4 outs (K) ~8.5%/การ์ด + 3 aces (overcard) — รวม ~14-18% เมื่อรวม showdown บางส่วน. semi-bluff ทำงานเพราะ fold equity + backup outs
  <br><b>• Sizing:</b> 2/3 กดดัน Qx ให้ลำบาก + setup river jam. ถ้าโดน call แล้ว river brick → ตัดสินใจ give up หรือ triple barrel ตาม read
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> vs station ที่ไม่ fold Qx → ลด bluff, check-give-up. board ที่มี flush draw เพิ่ม → barrel หนักขึ้นได้`
},
{
  id:'po4', cat:'postflop',
  stage:'Mid Stage', stack:'30bb',
  pot:9, toCall:0,
  board:['Kd','8s','3h','5c','Qd'], hero:['Kh','Tc'], heroLine:'BB',
  stacks:[['BTN',34],['BB',30]],
  streets:[{name:'Preflop', acts:[{pos:'BTN', a:'raise'},{pos:'YOU', a:'call'}]},{name:'Flop', acts:[{pos:'YOU', a:'check'},{pos:'BTN', a:'check'}]},{name:'Turn', acts:[{pos:'YOU', a:'check'},{pos:'BTN', a:'check'}]},{name:'River', note:'ตาคุณตัดสินใจก่อน', acts:[]}],
  q:'River Q, เราถือ KT (top pair กลางๆ) เกมเช็คมาตลอด — ควรเบทขอ value ไหม?',
  opts:[ {k:'call',label:'Check'}, {k:'raise',label:'Bet',sub:'1/3 pot'} ],
  best:1, ok:[0],
  why:`<b>เฉลย: Bet thin value (1/3)</b> — เกม check มาตลอด แปลว่าคู่ต่อสู้น่าจะอ่อน (ไม่มี Kx/Qx แข็ง ไม่งั้นเขาเบทไปแล้ว)
  KT ยังเป็น top pair ที่ชนะ 8x, draws ที่ miss, mid pairs
  <br><br>เบทเล็กเพื่อ <span class="k">thin value</span> — ดึงเงินจากมือที่อ่อนกว่าที่ยอม call เล็กๆ (8x, 5x, Jx) แม้ Q river จะ scare card แต่เราถือ K ไม่ใช่ Q เลยไม่กลัว Qx มาก
  Check ก็โอเคถ้ากลัวโดน check-raise bluff แต่ generally เบทเล็กทำกำไรกว่า — ปล่อยฟรีคือเสีย value`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> check ทั้งสอง street = capped (ไม่มี Kx/Qx แข็ง ไม่งั้นเบทไปแล้ว). เหลือ 8x, mid pairs, busted draws, Jx — KT เราชนะส่วนใหญ่ของ range ที่จะ call เบทเล็ก
  <br><b>• ทำไม Q river ไม่กลัว:</b> เราถือ K (top pair) ไม่ใช่ Q — Q ที่มาช่วย Qx ของเขาซึ่งเขาคงเบท turn ไปแล้วถ้ามี. การที่เขา check บอกว่าไม่มี Qx แข็ง
  <br><b>• ทำไม 1/3:</b> thin value — ใหญ่ไปจะ fold out มือที่อ่อนกว่าที่เรา target; เล็กพอให้ 8x/Jx ยอม call
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> vs คนชอบ check-raise bluff river → check behind ปลอดภัยกว่า. vs station → เบทใหญ่ขึ้นได้`
},
{
  id:'po5', cat:'postflop',
  stage:'Mid Stage', stack:'42bb',
  pot:12, toCall:9,
  board:['Th','9h','4c','Jd','2s'], hero:['Ah','5h'], heroLine:'BB',
  stacks:[['CO',46],['BB',42]],
  streets:[{name:'Preflop', acts:[{pos:'CO', a:'raise'},{pos:'YOU', a:'call'}]},{name:'Flop', acts:[{pos:'YOU', a:'check'},{pos:'CO', a:'cbet', amt:'½'},{pos:'YOU', a:'call'}]},{name:'Turn', acts:[{pos:'YOU', a:'check'},{pos:'CO', a:'bet', amt:'⅔'},{pos:'YOU', a:'call'}]},{name:'River', acts:[{pos:'YOU', a:'check'},{pos:'CO', a:'bet', amt:'9'}]}],
  q:'River flush draw ไม่มา เหลือ ace-high, CO เบท 3/4 pot — ทำอย่างไร?',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call',sub:'9bb'}, {k:'raise',label:'Bluff Raise'} ],
  best:0, ok:[2],
  why:`<b>เฉลย: Fold</b> — draw พลาด เราเหลือแค่ ace-high ซึ่งแทบไม่ชนะ value range ของ CO ที่เบทใหญ่ที่ river (Jx, Tx, straights, sets)
  Ace-high ไม่ใช่ bluff catcher ที่ดีพอเพราะมันไม่ชนะมือที่ "bluff น้อยกว่า value"
  <br><br>เราไม่มี showdown value พอจะ call. ทางที่ดีกว่าถ้าจะสู้คือ <span class="k">turn busted draw เป็น bluff-raise</span> (เพราะ A♥ block nut flush และเรื่องราวเรา represent ได้) แต่นั่นต้องอ่านว่า CO fold ได้
  โดย default การ call คือ burning chips — fold แล้วรอ spot ที่ดีกว่า`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> CO triple barrel ขนาด 3/4 ที่ river = value หนัก (Jx, Tx, straights, sets) + bluffs เป็น busted draws บางส่วน. ace-high ของเราชนะแค่ bluffs ซึ่งน้อยกว่า value
  <br><b>• ทำไมไม่ call:</b> bluff catcher ที่ดีต้องชนะ bluffs ของเขา — แต่ ace-high แทบไม่บีตอะไรใน value range และไม่มี pair. MDF ไม่ช่วยเพราะมือเราอยู่ก้น range
  <br><b>• ทำไม bluff-raise เป็น option:</b> A♥ block nut flush, และ line ของเรา (call flop/turn) represent flush/straight ที่ hit river ได้ — แต่ต้องมั่นใจว่า CO fold value บางส่วน (อันตราย)
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> ถ้าถือ pair เล็ก (showdown value) → call ง่ายขึ้น. vs คนที่ over-bluff river → call. vs nit → fold snap`
},
{
  id:'po6', cat:'postflop',
  stage:'Final Table', stack:'25bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 5 คน · pay jump ก้อนใหญ่ · ระวัง spot ที่ทำให้ bust',
  pot:10, toCall:8,
  board:['8c','8d','3s','Kh','2c'], hero:['As','8h'], heroLine:'BTN',
  stacks:[['BTN',25],['BB',22]],
  streets:[{name:'Preflop', acts:[{pos:'YOU', a:'raise'},{pos:'BB', a:'call'}]},{name:'Flop', acts:[{pos:'BB', a:'check'},{pos:'YOU', a:'cbet', amt:'⅓'},{pos:'BB', a:'call'}]},{name:'Turn', acts:[{pos:'BB', a:'check'},{pos:'YOU', a:'bet', amt:'⅔'},{pos:'BB', a:'call'}]},{name:'River', acts:[{pos:'BB', a:'shove', amt:'8'}]}],
  q:'เราถือ trip 8s (A kicker) เจอ BB jam ที่ river บน 8832-K, Final Table',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call all-in'} ],
  best:1, ok:[0],
  why:`<b>เฉลย: Call</b> — เราถือ trips kicker เอซ (A8) ซึ่งแข็งมากบน board นี้ มือที่บีต เราคือ full house (88+pair, แต่เราถือ A8 = ตัด 8 ไป 1 ใบ ทำให้ full house ของเขายากขึ้น) และ K8/quads ที่ unlikely
  <br><br>BB jam range มี bluffs (busted draws, missed clubs) และ worse value (8x kicker ต่ำกว่า, Kx ที่คิดว่าดี) มากพอ — เราชนะส่วนใหญ่ของ range นั้น
  ICM ทำให้เกณฑ์เข้มขึ้น แต่ trips top kicker แข็งเกินกว่าจะ fold vs river jam ขนาดกลาง. ถ้า read ว่า BB nutted-only ค่อย fold`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> BB jam river บน 8832-K = full house (8x+pair, 33, KK), quads (88 — แต่เราถือ 8 ตัดทอน), worse 8x (kicker ต่ำ), busted draws/clubs. A8 ชนะ worse 8x + bluffs ทั้งหมด
  <br><b>• ทำไมมือเราแข็ง:</b> เราถือ A8 = blocker ตัด 8 ทำให้ trips/full house ของ BB combos น้อยลง; A kicker บีต 8x ที่เหลือ. ต้องชนะ ~33% ถึง call ได้คุ้ม — เรามีมากกว่านั้น
  <br><b>• ICM:</b> FT 25bb, bust แพง → เกณฑ์เข้มขึ้น แต่ยังไม่ถึงขั้น fold trips top kicker เว้นแต่ BB เป็น nit ที่ jam แต่ full house+
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> kicker เราต่ำ (เช่น 8x kicker ขยะ) → fold ง่ายขึ้น. BB เป็นคน passive/nit → fold. chipEV (ไม่มี ICM) → snap call`
},
{
  id:'po7', cat:'postflop',
  stage:'Mid Stage', stack:'50bb',
  pot:6.5, toCall:0,
  board:['Jc','Tc','9d'], hero:['8h','7h'], heroLine:'BB',
  stacks:[['BTN',54],['BB',50]],
  streets:[{name:'Preflop', acts:[{pos:'BTN', a:'raise'},{pos:'YOU', a:'call'}]},{name:'Flop', note:'ตาคุณเล่นก่อน', acts:[]}],
  q:'เราตี straight (87 บน JT9) บนบอร์ดเปียกสุดๆ มี flush draw — เล่นอย่างไร?',
  opts:[ {k:'call',label:'Check'}, {k:'raise',label:'Donk Bet',sub:'2/3 pot'} ],
  best:1, ok:[0],
  why:`<b>เฉลย: Donk Bet (lead ออก)</b> — ปกติเราไม่ donk แต่บอร์ด J♣T♣9♦ เป็น board ที่ <span class="k">ฝั่ง BB ได้เปรียบ</span> (เรามี straight combos มากกว่า BTN ที่ range เปิดกว้าง)
  เราตี nut straight แล้ว แต่บอร์ดเปียกโคตร — flush draw (♣), straight ที่สูงกว่า (KQ), board pair คือภัย
  <br><br>การ bet ปกป้อง equity และดึง value จาก two pair/sets/draws ทันที <b>ก่อนที่ turn จะทำลายมือเรา</b>
  ถ้า check แล้ว turn เป็น ♣ หรือ board pair เราจะเล่นยากและเสีย value. บน dynamic board เร่ง value + protect คือถูก. (check-raise ก็เป็นแผนได้ถ้ามั่นใจว่า BTN c-bet สูง)`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไม donk ได้ที่นี่:</b> J♣T♣9♦ เป็น board ที่ favor BB range — เรามี straight combos (87, KQ, Q8) มากกว่า BTN ที่ open กว้าง. เป็นหนึ่งใน board ไม่กี่แบบที่ lead เป็น +EV
  <br><b>• Range คู่ต่อสู้:</b> BTN ตอบ donk ด้วย overpairs, two pair, sets, flush draws (♣), straight ที่สูงกว่า (KQ). เราดึง value + charge draws ทันที
  <br><b>• ทำไมต้อง protect:</b> board เปียกสุด — turn ♣/board pair/Q/8 ทำลายหรือ counterfeit มือเราได้ เราจึงอยากให้เงินเข้ากองตอนเรานำชัด
  <br><b>• ทางเลือก check-raise:</b> ได้ value มากกว่าถ้า BTN c-bet สูง แต่เสี่ยงโดน check-back แล้วให้ free card. เลือกตาม c-bet frequency ของคู่ต่อสู้`
},
{
  id:'po8', cat:'postflop',
  stage:'Mid Stage', stack:'35bb',
  pot:8, toCall:5.5,
  board:['Ad','Kc','5h','7s'], hero:['Qh','Jh'], heroLine:'BTN',
  stacks:[['BTN',35],['BB',31]],
  streets:[{name:'Preflop', acts:[{pos:'YOU', a:'raise'},{pos:'BB', a:'call'}]},{name:'Flop', acts:[{pos:'BB', a:'check'},{pos:'YOU', a:'cbet', amt:'½'},{pos:'BB', a:'call'}]},{name:'Turn', acts:[{pos:'BB', a:'donk', amt:'5.5'}]}],
  q:'BB นำเบทที่ turn บน AK57, เราถือ QJ (gutshot ขอ T = Broadway) — ทำอย่างไร?',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call',sub:'5.5bb'}, {k:'raise',label:'Raise/Bluff'} ],
  best:0, ok:[1],
  why:`<b>เฉลย: Fold (Call ถ้าราคาดีและ implied สูง)</b> — BB ที่ check-call flop แล้วจู่ๆ lead turn (donk) มักแสดงมือแข็งจริง (two pair A5/K5/57, set, หรือ Ax ที่อยากเก็บ value) — range นี้ value หนัก
  <br><br>QJ มีแค่ gutshot (4 outs ขอ T) = ~8% ต่อ 1 ใบ. ราคา call ไม่คุ้ม pot odds ถ้าไม่มี implied odds มากพอ และเราไม่มี pair/backdoor เพิ่ม
  Ace-high + gutshot ไม่แข็งพอจะ call vs strong donk range. การ raise bluff เสี่ยงเพราะ range เขาแข็ง — fold เป็น disciplined ที่สุด`,
  deep:`<b>เจาะลึก</b><br>
  <b>• อ่าน donk turn:</b> BB check-call flop แล้วจู่ๆ lead turn = sizing tell ของมือแข็ง (two pair A5/K5/57, set, Ax ที่อยากเก็บ value) — donk range ของผู้เล่นส่วนใหญ่ value-heavy ไม่ค่อย bluff
  <br><b>• Math:</b> QJ มี gutshot 4 outs (T) ~8.5%/การ์ด. ต้องการ pot odds ~3.5:1 หรือ implied odds ชดเชย — แต่เราไม่มี backdoor/pair เพิ่มและ T บางใบให้ straight คนอื่น
  <br><b>• ทำไม raise แย่:</b> range เขาแข็ง → raise เป็น bluff จะโดน call/jam บ่อย และเราไม่มี equity พอเป็น semi-bluff ที่ดี
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> ราคาเล็ก + stack ลึก (implied สูง) → call หา T ได้. ถ้ามี backdoor flush/extra outs → call. vs คนชอบ donk-bluff → call/raise`
},
{
  id:'po9', cat:'postflop',
  stage:'Mid Stage', stack:'60bb',
  pot:14, toCall:11,
  board:['6s','6d','Kc','Kh','2s'], hero:['Ac','Kd'], heroLine:'CO • PFR',
  stacks:[['CO',60],['BB',28]],
  streets:[{name:'Preflop', acts:[{pos:'YOU', a:'raise'},{pos:'BB', a:'call'}]},{name:'Flop', acts:[{pos:'BB', a:'check'},{pos:'YOU', a:'cbet', amt:'⅓'},{pos:'BB', a:'call'}]},{name:'Turn', acts:[{pos:'BB', a:'check'},{pos:'YOU', a:'check'}]},{name:'River', acts:[{pos:'BB', a:'shove', amt:'11'}]}],
  q:'เราถือ K full house (AK บน 66KK2), BB jam river — call หรือ fold?',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call all-in'} ],
  best:1,
  why:`<b>เฉลย: Call (snap)</b> — บอร์ด 66KK2 + เราถือ AK = <b>Kings full of sixes (KKK66)</b>. Full house ใช้ไพ่แค่ 5 ใบ (KKK + 66) ดังนั้น <span class="k">kicker (A) ไม่ได้เล่น</span> — ใครถือ K สักใบก็ได้ KKK66 เท่ากันเป๊ะ → <b>chop</b> ไม่ว่า kicker สูงต่ำ
  <br><br>มือเดียวที่บีตเราได้คือ <b>quad sixes — และมันเป็นไปได้!</b> บอร์ดมี 6 แค่ <b>สองใบ</b> (6♠6♦) เหลือ 6♥ 6♣ ที่ยังไม่โผล่ ใครถือ <b>6♥6♣ พอดี</b> = four 6s บีต full house เรา (line ก็ตรง: เขา flop quads ตั้งแต่ 6♠6♦K♣ แล้ว slowplay มาจน jam). ส่วน <b>quad Kings เป็นไปไม่ได้</b> — K สามใบอยู่บอร์ด+มือเรา (K♣K♥ + K♦) เหลือ K♠ ใบเดียว ไม่มีใครถือ pocket KK
  <br><br>แต่ยังเป็น <b>snap call</b>: 66 มีแค่ <b>1 combo เป๊ะ</b> (6♥6♣) ในขณะที่ jam range ของ BB เต็มไปด้วย Kx (chop), busted draws/bluffs, มืออ่อน. เราชนะ/เสมอเกือบทั้ง range, ราคา 14:11 ขอ ~31% เรามีเกิน 90% — fold คือเผา value`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไม kicker ไม่เกี่ยว:</b> full house = ไพ่ 5 ใบพอดี (trips + pair) ไม่มีใบที่ 6 เป็น kicker. บน 66KK2 ทุกคนที่มี K ได้ KKK66 เหมือนกัน → AK, KQ, KJ, K3 chop กันหมด (kicker จะสำคัญก็ต่อเมื่อบอร์ดไม่ paired คู่)
  <br><b>• เราแพ้ได้ไหม — ได้ แต่มือเดียว (quad sixes):</b> บอร์ดมี 6 แค่ 2 ใบ (6♠6♦) → เหลือ 6♥ 6♣ ที่ยังไม่เห็นและไม่อยู่ในมือเรา. ถ้า BB ถือ 6♥6♣ พอดี = quads บีตเรา. line ตรงเป๊ะ — flop 6♠6♦K♣ เขา flop quads แล้ว slowplay จน jam river. นี่คือ <b>1 combo เท่านั้น</b>
  <br><b>• ทำไม quad Kings ไม่มี:</b> K♣ K♥ อยู่บอร์ด + K♦ อยู่ในมือเรา = 3 ใบ เหลือ K♠ ใบเดียว → ไม่มีใครถือ pocket KK. higher full house อื่นก็ไม่มี เพราะ pair บนบอร์ดมีแค่ 66/KK
  <br><b>• Math/Range:</b> BB jam = Kx (chop), busted draws/bluffs, มืออ่อนหวัง fold equity, + 66 (1 combo) ที่บีตเรา. vs range นี้ equity เรา >90%, ราคา 14:11 (ขอ ~31%) → snap call ทำกำไรมหาศาล
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> ถ้า BB เป็น nit ที่ jam เฉพาะ nutted จริงๆ + line อ่านออกว่าเป็น 66 → close ขึ้น แต่ปกติ 1 combo ไม่พอให้ fold full house. ถ้าเราถือ Kx kicker ต่ำ (ไม่ใช่ AK) ก็ยัง call — chop กับ Kx อื่น แพ้แค่ 66 เดิม`
},
{
  id:'po10', cat:'postflop',
  stage:'Bubble', stack:'30bb', icm:true,
  icmState:'🫧 <b>BUBBLE</b> · อีก 1-2 คน bust เข้าเงิน · ทุกคน fold ง่ายขึ้น · สแต็กใหญ่ได้เปรียบ',
  pot:7, toCall:0,
  board:['Qd','6c','2h'], hero:['Ac','5c'], heroLine:'BTN • PFR',
  stacks:[['BTN',30],['BB',27]],
  streets:[{name:'Preflop', acts:[{pos:'YOU', a:'raise'},{pos:'BB', a:'call'}]},{name:'Flop', acts:[{pos:'BB', a:'check'}]}],
  q:'บอร์ด Q62r, เราเป็น PFR ถือ A5 (ace-high, ไม่มี pair) — c-bet ไหม? ช่วง Bubble',
  opts:[ {k:'call',label:'Check'}, {k:'raise',label:'Bet',sub:'1/3 pot'} ],
  best:1, ok:[0],
  why:`<b>เฉลย: Bet เล็ก (1/3) เป็น c-bet bluff</b> — Q62 rainbow เป็น board ที่ PFR ได้เปรียบ range มาก (เรามี Qx/overpair มากกว่า BB)
  เบทเล็กราคาถูก ทำให้ BB fold มือที่ไม่มีอะไร (Jx/Tx/draws) และเรายังมี A overcard + backdoor flush เป็น equity backup
  <br><br>นี่คือ c-bet <span class="k">range bet</span> มาตรฐานบน dry board — กดดันด้วยต้นทุนต่ำ
  ช่วง bubble คู่ต่อสู้เล่น tight/passive ขึ้น = ยอม fold ง่ายขึ้น ยิ่งทำให้ c-bet ทำกำไร. Check ก็ใช้ได้ในกลยุทธ์ที่อยาก give up มือ ace-high ที่ดีที่สุด แต่ราคา 1/3 คุ้มเกือบเสมอ`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> BB check บน Q62r = Qx อ่อนบ้าง, pairs (66-22 บางส่วน), draws/overcards ที่ whiff. เรา (PFR) มี Qx/overpair มากกว่า → range advantage ทำให้ range bet ทำกำไร
  <br><b>• ทำไม A5 c-bet:</b> มี A overcard (6 outs), backdoor flush (♣), backdoor straight — equity เหลือเฟือเป็น bluff ที่ดี และ A5 เป็น "best ace-high" ที่อยาก bet มากกว่า give up
  <br><b>• Bubble/ICM:</b> short stacks fold ง่ายขึ้นช่วง bubble → fold equity สูงขึ้น = c-bet กำไรขึ้น. แต่ระวัง big stack ที่ใช้ ICM กดเรา (เราเองมี risk premium ด้วย)
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> board เปียก/มี draw เยอะ → ลด bluff frequency. vs station → check-give-up A5 ดีกว่า. multiway → c-bet bluff น้อยลงมาก`
},
{
  id:'po11', cat:'postflop',
  stage:'Mid Stage', stack:'40bb',
  pot:11, toCall:7,
  board:['Js','7s','3d','9c'], hero:['Ts','9s'], heroLine:'BB',
  stacks:[['CO',43],['BB',40]],
  streets:[{name:'Preflop', acts:[{pos:'CO', a:'raise'},{pos:'YOU', a:'call'}]},{name:'Flop', acts:[{pos:'YOU', a:'check'},{pos:'CO', a:'cbet', amt:'½'},{pos:'YOU', a:'call'}]},{name:'Turn', acts:[{pos:'YOU', a:'check'},{pos:'CO', a:'bet', amt:'7'}]}],
  q:'Turn ได้ pair 9 + flush draw + gutshot บน J739, CO เบทต่อ — ทำอย่างไร?',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call',sub:'7bb'}, {k:'raise',label:'Raise/Semi-bluff'} ],
  best:2, ok:[1],
  why:`<b>เฉลย: Raise (semi-bluff) — Call ก็ได้</b> — เรามี equity มหาศาล: flush draw 9 outs (♠) + gutshot ขอ 8 (4 outs) + pair 9 ที่บางครั้งดีอยู่ = monster draw ~15+ outs
  <br><br>การ raise ทำให้เรามี <span class="k">two ways to win</span>: fold equity ทันที (CO fold Jx ที่อ่อน) + ถ้าโดน call เราก็ยังตี river บ่อยมาก
  มือแบบนี้ "แข็งเกินกว่าจะแค่ call" — เราอยาก build pot ตอนที่ equity เราสูง. Call ก็ใช้ได้ในแนว pot-control แต่จะเสีย fold equity และยอมให้คู่ต่อสู้ realize equity ฟรี`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Equity:</b> flush draw 9 outs (♠) + gutshot 4 outs (8) + pair 9 ที่บางทีดีอยู่ = ~15+ outs, equity ~50%+ vs many made hands. นี่คือ monster draw ไม่ใช่ bluff เปล่า
  <br><b>• ทำไม raise > call:</b> two ways to win — (1) fold equity ทันที (CO fold Jx อ่อน/ overpair ที่กลัว) (2) ถ้าโดน call เราก็ hit river บ่อยมาก. raise ยัง build pot ตอน equity สูงสุดและ realize equity ของเราเอง (ไม่โดน barrel ไล่)
  <br><b>• Range คู่ต่อสู้:</b> CO double barrel = Jx, overpairs, sets, draws. ส่วนที่ fold ต่อ raise คือ Jx อ่อน/missed → fold equity จริง
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> stack ตื้น → jam เลย (commit). vs station ที่ไม่ fold → call (pure pot odds + implied) ดีกว่า raise เพราะ fold equity = 0. ถ้า flush draw เป็น non-nut ระวัง dominated`
},
{
  id:'po12', cat:'postflop',
  stage:'Mid Stage', stack:'33bb',
  pot:13, toCall:10,
  board:['Ah','Qd','7s','3c','Ks'], hero:['Ad','Jc'], heroLine:'BB',
  stacks:[['BTN',36],['BB',33]],
  streets:[{name:'Preflop', acts:[{pos:'BTN', a:'raise'},{pos:'YOU', a:'call'}]},{name:'Flop', acts:[{pos:'YOU', a:'check'},{pos:'BTN', a:'cbet', amt:'½'},{pos:'YOU', a:'call'}]},{name:'Turn', acts:[{pos:'YOU', a:'check'},{pos:'BTN', a:'check'}]},{name:'River', acts:[{pos:'YOU', a:'check'},{pos:'BTN', a:'bet', amt:'10'}]}],
  q:'River K มาเป็น scare card, เราถือ AJ (top pair อ่อน), BTN เบทใหญ่ — call หรือ fold?',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call',sub:'10bb'} ],
  best:0, ok:[1],
  why:`<b>เฉลย: Fold (close — แต่เอนไป fold)</b> — River K ทำให้ทุก Kx, KQ, AK เป็น two pair+ และ BTN เบทใหญ่ 3/4 pot ใน range ที่ value หนัก
  AJ ของเราตอนนี้แค่ <span class="k">one pair</span> ที่ K เพิ่งทำให้ kicker เราไม่เกี่ยว — เราแพ้ AK/KQ/AQ/sets/two pair เกือบทั้งหมดของ value range
  <br><br>มือเราชนะแค่ bluffs (busted draws) ซึ่งบน runout นี้มีน้อยกว่า value ที่ K river เติมเข้ามา
  pot odds ขอ ~30% แต่ equity vs เบทใหญ่ที่ river ของเราต่ำกว่านั้น. นี่คือ over-fold ที่ disciplined — เก็บชิปไว้ spot ที่ดีกว่า. (vs คนชอบ bluff หนัก call ก็ defensible)`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไม K river เป็นภัย:</b> turn ทั้งคู่ check (BTN ดู capped/control). river K เติม value ใหม่: AK, KQ, Kx กลายเป็น two pair+; AJ ของเรากลายเป็น one pair อันดับสองที่ kicker ไม่เกี่ยว
  <br><b>• Range คู่ต่อสู้:</b> BTN check turn แล้วเบทใหญ่ river = polar — value ที่ K เพิ่งเติม (Kx, AK, KQ, sets, two pair) + bluffs (busted draws). บน runout นี้ value > bluffs ที่ K river สร้าง
  <br><b>• Math:</b> เบ็ท 3/4 → ต้องชนะ ~30% ถึง call คุ้ม. AJ ชนะแค่ busted draws — ต่ำกว่า 30% vs range ที่ value หนัก จึง fold
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> vs คนชอบ over-bluff river / sizing เล็ก → call. ถ้าเราถือ AK/Kx เอง → snap call. ถ้า river เป็น brick (ไม่ใช่ K) → AJ กลายเป็น bluff catcher ที่ดีขึ้น`
},

/* ---------------------- HARD SPOTS (ph) ---------------------- */
{
  id:'ph1', cat:'preflop',
  stage:'Final Table', stack:'16bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 6 คน · pay jump ใหญ่ทุกอันดับ · MP (สแต็กใหญ่) cover เราหมด',
  pot:27, toCall:12,
  hero:['Qd','Qh'], heroLine:'CO • 16bb',
  stacks:[['UTG',12],['MP',46],['CO',16]],
  streets:[{name:'Preflop', acts:[{pos:'UTG', a:'shove', amt:'12'},{pos:'MP', a:'call', amt:'12'}]}],
  q:'QQ บน CO เจอ UTG jam 12bb แล้ว MP (สแต็กใหญ่) cold-call ทั้งกอง — Final Table เหลือ 6',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call all-in'} ],
  best:0, ok:[1],
  why:`<b>เฉลย: Fold (close แต่เอนไป fold เพราะ ICM)</b> — ปกติ QQ snap-call vs jam คนเดียว แต่ที่นี่มี <b>2 ฝ่าย</b>: UTG jam + MP <span class="k">cold-call ทั้งกอง</span>
  <br><br>การที่ MP ยอมเอาชิปทั้งกองตามเข้า all-in (ไม่ใช่ 3bet/iso) = range แข็งและ "capped ไปทาง value" — มักเป็น JJ-TT, AQs, AK บางส่วน, และ KK/AA ที่ slowplay บ้าง. QQ เจอ flip/โดน dominate บ่อย
  <br><br>multiway QQ เหลือ equity ~45-47% เท่านั้น และที่ <b>FT</b> การ bust แลกกับ pot ที่เราไม่ใช่ favorite ชัดเจน = -EV ในแง่ ICM. นี่คือ spot ที่ chipEV เกือบ breakeven แต่ ICM ดันให้ fold`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range คู่ต่อสู้:</b> UTG jam 16bb = กว้างพอควร (88+, AJ+, KQ) แต่ MP cold-call all-in คือ signal แข็ง — คนส่วนใหญ่ไม่ flat all-in ด้วยมือกลางๆ. MP มักเป็น JJ/TT/AQ/AK และมี AA/KK ปนบ้าง → QQ โดน squeeze ตรงกลาง
  <br><b>• Math:</b> vs 2 ranges นี้ QQ เหลือ ~45-47% (โดน overpair บางส่วน + ต้อง dodge สองมือ). toCall 12 เข้า pot 27 → ต้องการ ~31% chipEV แต่เป็น multiway ที่เราอาจไม่ใช่ favorite + dead money ไม่พอชดเชย
  <br><b>• ICM:</b> FT 16bb, pay jump ใหญ่ → risk premium สูงมาก. การเอาทั้งกองเข้า pot ที่เป็นแค่ flip/underdog = เผา equity ตาราง. fold รักษา 16bb ไว้กดดัน short stacks ต่อ
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> ถ้าเป็น UTG jam คนเดียว (ไม่มี MP call) → snap call. ถ้า MP เป็นคน loose ที่ flat all-in กว้าง → call. ถ้า chipEV ล้วน (ไม่มี ICM, early MTT) → call ได้`
},
{
  id:'ph2', cat:'preflop',
  stage:'Mid Stage', stack:'50bb',
  pot:12, toCall:6.8,
  hero:['As','5s'], heroLine:'BTN • 50bb',
  stacks:[['BTN',50],['SB',52]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP CO', a:'fold'},{pos:'YOU', a:'raise', amt:'2.2'},{pos:'SB', a:'3bet', amt:'9'},{pos:'BB', a:'fold'}]}],
  q:'A5s เปิดบน BTN โดน SB 3bet เป็น 9bb (50bb deep) — เล่นอย่างไร?',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call',sub:'6.8bb'}, {k:'raise',label:'4-Bet',sub:'22bb'} ],
  best:1, ok:[2],
  why:`<b>เฉลย: Call (in position)</b> — A5s vs SB 3bet ที่ 50bb เป็นมือที่ <span class="k">flat ได้สบาย</span>: มี nut-flush potential, playability ดี postflop, และอยู่ <b>in position</b> ตลอดมือ
  <br><br>เรา realize equity ได้เต็มเมื่ออยู่หลัง, flop หลายแบบเราเล่นต่อได้ (flush draw, wheel draw, top pair, backdoors). Fold ตึงเกินไปสำหรับ suited ace ที่มี blocker A
  <br><br>4-Bet เป็น <b>bluff</b> ที่ใช้ได้เป็นบางครั้ง (A5s เป็น 4bet-bluff combo มาตรฐานเพราะตัด AA/AK) — แต่เป็น mix ไม่ใช่ default. ที่ 50bb การ flat IP ทำกำไรชัดและเสี่ยงน้อยกว่า`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไม Call:</b> A5s มี equity + playability พอจะ continue vs SB 3bet range. IP ทำให้เรา realize equity สูง, ควบคุม pot, และ float/bluff turn ได้. toCall 6.8 เข้า pot 12 + implied (nut flush) = +EV
  <br><b>• 4-Bet bluff (ok):</b> A5s ตัด AA/A5/wheel ของ SB และมี backup equity เมื่อโดน call → เป็น 4bet-bluff combo ที่ดี. ใช้เป็น mix ~บางส่วน เพื่อ balance value 4bet (QQ+, AK). ถ้า SB fold ต่อ 4bet เยอะ → 4bet ดีขึ้น
  <br><b>• Range คู่ต่อสู้:</b> SB 3bet vs BTN กว้าง (value: TT+, AQ+ / bluff: Axs, suited gappers). vs range นี้ A5s flat แล้วเล่น postflop ได้กำไร, ไม่จำเป็นต้อง fold
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> ตื้นลง (~20-25bb) → flat แย่ลง, เลือก fold/jam แทน. SB 3bet ตึงมาก (value-heavy) → fold/4bet-bluff ชัดขึ้น ไม่ flat. ถ้าเป็น OOP (เช่นเราอยู่ blinds) → flat แย่กว่ามาก`
},
{
  id:'ph3', cat:'preflop',
  stage:'Bubble', stack:'25bb', icm:true,
  icmState:'🫧 <b>BUBBLE</b> · เราสแต็กอันดับ 2 · SB เป็นผู้นำชิป (คนเดียวที่ cover เรา) · อีก 1 คน bust = เข้าเงิน',
  pot:27, toCall:24,
  hero:['Ac','Qd'], heroLine:'BB • 25bb',
  stacks:[['SB',58],['BB',25]],
  streets:[{name:'Preflop', acts:[{pos:'UTG…BTN', a:'fold'},{pos:'SB', a:'shove', amt:'25'}]}],
  q:'AQo ใน BB เจอ SB (ผู้นำชิป, คนเดียวที่ cover เรา) jam 25bb — ช่วง Bubble',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call all-in'} ],
  best:0, ok:[1],
  why:`<b>เฉลย: Fold (ICM override)</b> — แบบ <span class="k">chipEV</span> ล้วน AQo call ได้สบาย vs SB jam ที่กว้างมาก (blinds vs blinds, SB jam 25bb ใส่ Ax/Kx/pairs/suited junk เพียบ) — เราเป็นต่อหรือ flip
  <br><br>แต่นี่คือ <b>bubble</b> และ SB เป็น <b>ผู้นำชิปคนเดียวที่ cover เรา</b> — ถ้าเราแพ้ = bust ทันทีบน bubble (ได้ศูนย์) ในขณะที่ทุกคนกำลังจะเข้าเงิน
  <br><br>ICM risk premium ตรงนี้สูงมาก: เกณฑ์ equity ที่ต้องการพุ่งเกิน 50% ทั้งที่ pot odds ขอแค่ ~47%. AQo vs jam range ของ SB ไม่ได้นำพอจะคุ้มความเสี่ยง bust-on-bubble — fold รักษาสแต็กอันดับ 2 ไว้ทำเงินชัวร์ๆ`,
  deep:`<b>เจาะลึก</b><br>
  <b>• chipEV vs ICM:</b> vs SB jam range กว้าง AQo มี ~52-55% (chipEV = call). toCall 24 เข้า pot 27 → pot odds ขอ ~47%. ดูเหมือน call ชัด... จนกระทั่งใส่ ICM
  <br><b>• ทำไม ICM พลิกเป็น fold:</b> เราเป็นสแต็กอันดับ 2, SB เป็นคนเดียวที่ cover. แพ้ = bust บน bubble (ศูนย์) ทั้งที่อีกนิดเดียวเข้าเงินชัวร์. risk premium ดัน threshold จาก 47% → เกิน 50-55%. AQo flip ๆ ไม่คุ้ม
  <br><b>• ใครควร call jam นี้:</b> เฉพาะ short stacks ที่ไม่ใช่คนถัดไปจะ bust หรือมือ premium จริง (AA/KK/AK). medium-big stack อย่างเรา fold ตึงได้ — ปล่อยให้ short stack อื่น bust ก่อน
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> ผ่าน bubble (ITM) แล้ว → call. เราเป็น short stack จะ blind out อยู่แล้ว → call. SB ไม่ cover เรา (เราชนะก็ไม่ bust) → call. SB tight jam (value only) → fold ชัดยิ่งขึ้น`
},
{
  id:'ph4', cat:'postflop',
  stage:'Mid Stage', stack:'45bb',
  pot:12, toCall:7,
  board:['Kh','9h','4s','2c'], hero:['Qh','Jh'], heroLine:'BB',
  stacks:[['CO',48],['BB',45]],
  streets:[{name:'Preflop', acts:[{pos:'CO', a:'raise', amt:'2.5'},{pos:'YOU', a:'call'}]},{name:'Flop', acts:[{pos:'YOU', a:'check'},{pos:'CO', a:'cbet', amt:'½'},{pos:'YOU', a:'call'}]},{name:'Turn', acts:[{pos:'YOU', a:'check'},{pos:'CO', a:'bet', amt:'⅔'}]}],
  q:'QJ♥ (flush draw + gutshot) ใน BB บน K♥9♥4-2 เจอ CO เบท turn — call, fold หรือ check-raise?',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call'}, {k:'raise',label:'Check-Raise'} ],
  best:2, ok:[1],
  why:`<b>เฉลย: Check-Raise (semibluff)</b> — เรามี <span class="k">combo draw มหึมา</span>: flush draw ♥ (9 outs) + gutshot ถึง nut straight (ต้องการ T → 9-T-J-Q-K, 3 outs ที่ไม่ใช่ ♥) รวม ~12+ outs สด ≈ equity ~45% vs ส่วนใหญ่ของ range
  <br><br>เมื่อ draw ใหญ่ขนาดนี้และเราอยู่ <b>OOP</b>, check-raise เป็น semibluff ที่ดีกว่า call เฉยๆ: เราได้ <b>fold equity</b> (CO fold มือกลางๆ เช่น Kx kicker อ่อน, draws ที่แย่กว่า) บวก equity เมื่อโดน call และยังถูก draw
  <br><br>Call ก็ใช้ได้ (realize equity, เห็น river ถูก) แต่ปล่อย initiative และทำให้ river เล่นยากเมื่อ miss. ขนาด draw ระดับนี้ aggression คุ้มกว่า`,
  deep:`<b>เจาะลึก</b><br>
  <b>• นับ outs:</b> ♥ อีก 9 ใบ = flush; T อีก 3 ใบ (ไม่นับ T♥ ที่ซ้ำ) = nut straight. รวม ~12 clean outs + บางครั้ง Q/J ขึ้น top pair ก็ช่วย → equity ~43-48% vs top pair/overpair
  <br><b>• ทำไม check-raise > call:</b> OOP + draw ใหญ่ = fold equity มีค่า. CO cbet/barrel กว้าง แล้วต้อง fold Kx อ่อน/missed draws/AQ-AJ จำนวนมากต่อ raise. เมื่อโดน call เราก็ยังมี ~45% — แทบไม่เคย drawing dead
  <br><b>• Range คู่ต่อสู้:</b> CO double-barrel turn = Kx (top pair), overpairs, flush draws ♥ ที่สูงกว่า, บาง bluffs. ส่วนที่ fold ต่อ check-raise เยอะพอให้ semibluff ทำกำไร
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> ถ้า board pair ♥ มาแล้ว (flush เป็นไปได้ในมือคนอื่น) หรือเราตื้นมาก → call/fold ดีกว่า raise. ถ้า CO เป็นคน station ไม่ fold เลย → call เอา implied แทน (ตัด fold equity ออก). ถ้า draw เล็กกว่านี้ (เช่น gutshot เปล่า) → fold`
},
{
  id:'ph5', cat:'postflop',
  stage:'Mid Stage', stack:'40bb',
  pot:12, toCall:12,
  board:['8d','7d','2c','Kc','3h'], hero:['9s','9c'], heroLine:'BB',
  stacks:[['BTN',38],['BB',40]],
  streets:[{name:'Preflop', acts:[{pos:'BTN', a:'raise', amt:'2.5'},{pos:'YOU', a:'call'}]},{name:'Flop', acts:[{pos:'YOU', a:'check'},{pos:'BTN', a:'cbet', amt:'½'},{pos:'YOU', a:'call'}]},{name:'Turn', acts:[{pos:'YOU', a:'check'},{pos:'BTN', a:'check'}]},{name:'River', acts:[{pos:'YOU', a:'check'},{pos:'BTN', a:'bet', amt:'12'}]}],
  q:'99 ใน BB บน 8♦7♦2-K-3 (draws พลาดหมด), BTN check turn แล้วเบทเต็มกอง river — call หรือ fold?',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call all-in-ish'} ],
  best:1, ok:[0],
  why:`<b>เฉลย: Call (bluff-catch)</b> — กุญแจคือ <span class="k">BTN check turn</span> ซึ่ง <b>cap range</b> ของเขา: มือแข็งจริง (Kx, sets, two pair) มักจะ barrel turn ต่อเพื่อ value ไม่ใช่ปล่อยฟรี
  <br><br>พอ check turn แล้ว river กลับ <b>เบทเต็มกอง</b> = polar — ถ้าเขามี value ที่ checked turn ก็มีจำกัด ในขณะที่ board นี้ <b>draws พลาดหมด</b>: diamond (8♦7♦) ไม่มาใบ 3, straight draws (T9/65/96) miss, club ขึ้นแค่ 2 ใบ. busted draws พวกนี้กลายเป็น bluff ใน range เขาเยอะ
  <br><br>99 ของเราบีต busted draws และ underpairs/Ax-high ทั้งหมด. pot-size bet ขอ ~33% equity — vs polar range ที่ bluff หนัก 99 มีพอ. ถ้า BTN เป็นคนไม่เคย bluff ค่อย fold`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไม check turn สำคัญ:</b> มันลบ value หนักออกจาก range BTN เกือบหมด (Kx/sets/two pair ส่วนใหญ่จะ bet turn). river ที่ฟ้าผ่ากลับมา bet เต็มกอง = มัก polar (nutted ไม่กี่ combo + bluffs เยอะ)
  <br><b>• runout เอื้อ bluff:</b> 8♦7♦2♣ → K♣ → 3♥. flush diamond miss, straight draws (T9, 96, 65, 64) miss, มีแค่ 2 clubs (ไม่ครบ flush). มือ draw ที่ check turn ไม่ลง แล้วเลือก bluff river มีจำนวนมาก
  <br><b>• Math:</b> เบท pot (12 เข้า 12) → ต้องชนะ ~33%. 99 บีต busted draws/Ax-high/underpairs ทั้งหมด — vs polar range ที่มี bluff หนัก equity เกิน 33% ชัด
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> ถ้า BTN barrel turn (ไม่ check) → range แข็งขึ้นมาก, 99 fold ง่ายขึ้น. vs ผู้เล่น nit ที่ไม่ bluff river → fold. ถ้า river เติม flush/straight ให้ board → 99 แย่ลง. sizing เล็ก (¼-⅓) → call ง่ายขึ้นอีก`
},
{
  id:'ph6', cat:'postflop',
  stage:'Mid Stage', stack:'35bb',
  pot:57, toCall:12,
  board:['6h','5h','4c','9d','8c'], hero:['Ah','Ad'], heroLine:'BTN',
  stacks:[['BTN',35],['BB',35]],
  streets:[{name:'Preflop', acts:[{pos:'YOU', a:'raise', amt:'2.5'},{pos:'BB', a:'call'}]},{name:'Flop', acts:[{pos:'BB', a:'check'},{pos:'YOU', a:'cbet', amt:'3'},{pos:'BB', a:'call'}]},{name:'Turn', acts:[{pos:'BB', a:'check'},{pos:'YOU', a:'bet', amt:'7'},{pos:'BB', a:'call'}]},{name:'River', acts:[{pos:'BB', a:'check'},{pos:'YOU', a:'bet', amt:'10'},{pos:'BB', a:'shove', amt:'22'}]}],
  q:'AA บน BTN, บอร์ด 6♥5♥4-9-8 (straight-heavy). เราเบท 3 streets, BB check-raise jam ที่ river — call หรือ fold?',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call all-in'} ],
  best:0, ok:[1],
  why:`<b>เฉลย: Fold</b> — board 6-5-4-9-8 เป็น <span class="k">straight-heavy สุดๆ</span>: ใบ 7 ใดก็ได้ = straight (5-6-7-8-9), บวก 7T (6-7-8-9-T), sets (99/88/66/55/44), และ two pair มากมาย ล้วนบีต AA
  <br><br>AA ของเราตอนนี้คือ <b>แค่ one pair</b>. การที่ BB <span class="k">check-call สอง street แล้ว check-raise jam river</span> เป็นไลน์ที่แข็งที่สุดในโป๊กเกอร์ — แทบไม่มีใคร turn มืออ่อนมาทำแบบนี้บน board ที่ straight ลงได้ง่ายขนาดนี้
  <br><br>แม้ pot odds จะดี (toCall 12 เข้า pot 57 → ขอแค่ ~17%) แต่ <b>value-to-bluff ratio</b> ของ check-raise jam นี้สูงเกิน: board แทบไม่มี draw ที่ "พลาด" มาเป็น bluff (flush เป็นไปไม่ได้) — มีแต่ value. AA ชนะ combos น้อยเกินกว่า 17% → fold ทิ้งอย่างมีวินัย`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไม board นี้อันตราย:</b> 6-5-4 บน flop แล้ว 9, 8 เติม → ใบ 7 ใดก็ได้ทำ straight, 7T ก็ได้, และ two pair/sets เพียบ. เป็น board ที่ favor calling range ของ BB (suited connectors, small pairs) มากกว่า overpair ของเรา
  <br><b>• ทำไม line นี้ = nutted:</b> check-call flop + check-call turn + <b>check-raise all-in river</b> = top of range เสมอ. ไม่มี balance ของ bluff พอ เพราะ draws บน board นี้ส่วนใหญ่ <b>ลงเป็น straight จริง</b> (ไม่ได้ miss มาเป็น bluff) และ flush เป็นไปไม่ได้ → แทบไม่มี busted-draw bluff
  <br><b>• Math vs ratio:</b> pot odds ขอแค่ ~17% (12 เข้า 57) — ดูเหมือน call ง่าย. แต่ AA ชนะเฉพาะ bluff ซึ่ง runout นี้แทบไม่มี. ถ้า BB bluff < 17% ของ jam range → call เป็น -EV. ที่นี่ bluff น้อยกว่านั้นมาก → fold
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> ถ้า board ไม่มี straw straight (เช่น A-K-x-x rainbow แห้ง) → AA snap call. ถ้าถือ A♥ + board สอง ♥ ทำให้เรามี nut-flush blocker/redraw → close ขึ้น. vs maniac ที่ over-bluff jam → call. ถ้าเราถือ set/straight เอง → snap call`
},

/* ---------------------- EXPERT SPOTS (px) — ระดับเซียน ---------------------- */
{
  id:'px1', cat:'preflop',
  stage:'Satellite Bubble', stack:'20bb', icm:true,
  icmState:'🎟️ <b>SATELLITE BUBBLE</b> · เหลือ 11 คน · ตั๋ว 10 ใบ มูลค่า<b>เท่ากันทุกใบ</b> · ชิปเกินตั๋ว = 0 · มี 2 short stacks (≤3bb) ที่โต๊ะอื่นกำลังจะ blind out ใน 1-2 รอบ',
  pot:21, toCall:19,
  hero:['Ah','Ad'], heroLine:'BB • 20bb',
  stacks:[['SB',25],['BB',20]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP CO BTN', a:'fold'},{pos:'SB', a:'shove', amt:'25'}]}],
  q:'AA ใน BB เจอ SB (cover เรา) jam — Satellite bubble (อีก 2 shorts โต๊ะอื่นจะ bust)',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call all-in'} ],
  best:0,
  why:`<b>เฉลย: Fold (ใช่ — AA ก็ fold ได้!)</b> — <span class="k">Satellite</span> ตั๋วทุกใบมูลค่า<b>เท่ากัน</b> และชิปเกินตั๋วมูลค่า = <b>ศูนย์</b>. กฎนี้พลิกทุกอย่างจาก MTT ปกติ
  <br><br>chipEV: AA vs SB jam range = monster (~85% equity) → +chipEV ชัด
  <br>ticket EV: ถ้าชนะ → ได้ "ชิปเกินตั๋ว" ที่ไร้ค่า. ถ้าแพ้ (15%) → <b>ตั๋วสูญทันที</b>
  <br><br>มี 2 shorts (≤3bb) โต๊ะอื่นกำลังจะ bust ใน 1-2 รอบ → P(survive ถ้า fold) ≈ <b>100%</b> · P(survive ถ้า call) = 85%
  <br>การ call = แลก 100% chance ตั๋ว → 85% chance ตั๋ว = <b>-15% ตั๋ว</b> ขาดทุนชัด แม้ AA จะ +chipEV
  <br><br>นี่คือ <b>"fold ที่ยากที่สุดในโป๊กเกอร์"</b> — และเป็นทางที่ถูก`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Satellite ICM ≠ MTT ICM:</b> ใน MTT ปกติ pay jumps ค่อยๆ ขึ้น → chip ยังมีค่า. ใน satellite ตั๋ว top N เท่ากันหมด → ชิปเหนือ survival threshold = <b>0</b>. เกณฑ์ stack off เข้มขึ้นมหาศาล
  <br><b>• Math เป๊ะ:</b> EV(fold) = ~1 ตั๋ว (เพราะ shorts จะ bust ก่อน). EV(call) = 0.85 × 1 + 0.15 × 0 = 0.85 ตั๋ว. ΔEV = <b>-0.15 ตั๋ว</b>. ถ้าตั๋วราคา $5,000 → fold = +$750 จริงๆ
  <br><b>• ทำไมคนพลาด:</b> สัญชาตญาณ "AA must call" + ไม่แยก chipEV กับ ticketEV. ที่ satellite bubble ใช้ ticketEV เท่านั้น
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> ถ้าเราสั้นที่สุด (จะ blind out ก่อน shorts) → call จำเป็น เพราะ survival ไม่ฟรี. structure ไม่ flat (เช่น top 3 ได้ payout ใหญ่กว่าตั๋วธรรมดา) → ใช้ ICMizer คำนวณใหม่. ไม่มี shorts ใกล้ bust (ทุกคนสแต็กพอๆ กัน) → call ได้บางครั้ง. หลัง bubble ผ่าน (mtt phase) → snap call`
},
{
  id:'px2', cat:'postflop',
  stage:'Mid Stage', stack:'35bb',
  pot:10, toCall:18,
  board:['Ah','Kc','4s','4h','9d'], hero:['Ad','Qc'], heroLine:'BB',
  stacks:[['CO',38],['BB',35]],
  streets:[
    {name:'Preflop', acts:[{pos:'CO', a:'raise', amt:'2.5'},{pos:'YOU', a:'call'}]},
    {name:'Flop', acts:[{pos:'YOU', a:'check'},{pos:'CO', a:'cbet', amt:'⅓'},{pos:'YOU', a:'call'}]},
    {name:'Turn', acts:[{pos:'YOU', a:'check'},{pos:'CO', a:'check'}]},
    {name:'River', acts:[{pos:'YOU', a:'check'},{pos:'CO', a:'bet', amt:'18 (1.8× pot)'}]}
  ],
  q:'AQo บน A-K-4-4-9, CO check turn แล้ว overbet jam-size river — top two pair อยู่ก็ fold?',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call'} ],
  best:0, ok:[1],
  why:`<b>เฉลย: Fold</b> — top two pair "ดูแข็ง" แต่ <span class="k">kicker เล่นจากบอร์ดเอง</span> (K จากบอร์ดเป็น kicker ของเรา) → AQ ของเรา <b>chop กับ Ax ทุกใบ</b>
  <br><br>เราถือ AQ = A-A-4-4-K. มือที่บีตเราใน CO range filtered: AK (Aces & Kings, 6 combos), A9 (Aces & Nines, ~6), <b>K4s</b>/<b>A4s</b> (full house, ~2-3), 44 (quads, 1), AA/KK/99 (full houses ~7), บาง 9x ที่ CO เปิดบ้าง — รวม ~20-30 combos ใน range ที่มาถึง river
  <br><br>line ของ CO ครีติคอล: <b>cbet flop → check turn → overbet jam river</b>. การ check turn ใน population MTT มัก slowplay มือแข็งบน paired board (A4/44/AA/KK ที่ flop full house ไม่กลัวอะไร). river 9 เติม value (A9, 99). overbet jam = polar, ใน MTT pop <b>bluff น้อยกว่า value มาก</b>
  <br><br>ราคา 1.8× pot ขอ ~36% equity. AQ vs filtered range ~20-25% → fold +EV. เก็บ tournament life ไว้ดีกว่า burn 18bb`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Showdown verifier (ground truth):</b> brute-force ทุกมือ villain = <b>814 แพ้เรา, 70 chop, 106 บีตเรา</b> ใน 990 combos. ที่บีต: trips 4 (70 — ส่วนใหญ่ไม่อยู่ใน CO range), various full houses (29), quads 44 (1), two pair Aces & Kings (6 = AK ทั้งหมด), Aces & Nines (6 = A9). หลังกรอง CO open range ที่มาถึง river ~20-30 combos ที่บีต
  <br><b>• ทำไม "two pair" เราอ่อน:</b> board paired 44 + ใบ K สูงสุดของ unpaired cards → ทุกคนที่มี A ใช้ board K เป็น kicker. AQ เราชนะแค่ "ใบที่ 5 ที่บอร์ดให้ฟรี" = ไม่ได้เด่นเลย. <b>A2/A3/A5/A6/A7/A8/AT/AJ/AQ chop กันหมด</b>
  <br><b>• ทำไม "check turn → jam river" ใน population MTT = value:</b> amateur ไม่ overbet-bluff river (ใจไม่ถึง). solver world bluff balance ทำได้ — แต่ live MTT pop ไม่. คน slowplay turn ด้วย flop full house เพราะ paired board "ไม่มีใครเปลี่ยน range" + river 9 เติม value
  <br><b>• เราไม่ block อะไร value, แต่ block bluffs:</b> Q ของเราตัด QJ/QT (bluff combos ที่ใช้ Q overcard เป็น bluff). ทำให้ราคา bluff-catch ยิ่งแย่
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> vs known maniac/aggro player → call (bluff frequency จริง). ถ้า river เป็น brick (ไม่ใช่ 9, ไม่เติม value ใหม่) → close ขึ้น แต่ยัง fold ปกติ. vs sizing เล็ก (½-⅔ pot) → call (linear range ของ value-bet, MDF ช่วย). ถ้าเราถือ AK เอง (Aces & Kings) → snap call. ถ้าเรามี K4/A4 (full house) → snap call/raise`
},
{
  id:'px3', cat:'postflop',
  stage:'Mid Stage', stack:'60bb',
  pot:7.5, toCall:0,
  board:['Qc','Jh','Th'], hero:['Kd','Kc'], heroLine:'MP • 60bb',
  stacks:[['MP',60],['BTN',62],['BB',55]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG', a:'fold'},{pos:'YOU', a:'raise', amt:'2.5'},{pos:'CO', a:'fold'},{pos:'BTN', a:'call'},{pos:'SB', a:'fold'},{pos:'BB', a:'call'}]},
    {name:'Flop', note:'3-way pot — BB acts first (OOP)', acts:[{pos:'BB', a:'check'}]}
  ],
  q:'KK ใน MP เปิด, BTN call, BB call (3-way). Flop QcJhTh — c-bet ไหม?',
  opts:[ {k:'call',label:'Check'}, {k:'raise',label:'Bet',sub:'½ pot'}, {k:'raise',label:'Bet',sub:'⅓ pot'} ],
  best:0, ok:[2],
  why:`<b>เฉลย: Check (give up — แล้วตัดสินใจ turn)</b> — KK overpair บน Q-J-T <b>3-way</b> ดูแข็งแต่ <span class="k">equity จริง ~35-42%</span> เท่านั้น เพราะ:
  <br>(1) <b>ใบ K ใดๆ ในมือคู่ต่อสู้ = K-high straight ทันที</b> — เราบล็อก 2 K → เหลือ K ใน range 2 ใบ → AK = ~6 combos ที่ทำ straight
  <br>(2) Tx, Jx, Qx ตี top pair เพียบ (BTN flat range + BB defend range มี broadway/suited มาก)
  <br>(3) sets QQ/JJ/TT, two pair (QJ/QT/JT), straight draws (KQ/89/AK) อยู่ในทั้งสอง range
  <br>(4) multiway → "<b>ใครสักคน hit</b>" สูง ทำให้ KK overpair ไม่ใช่ favorite อีกต่อไป
  <br><br>การ <b>c-bet multiway บนบอร์ด paint heavy = ระเบิดเงิน</b>: fold ออกเฉพาะ worse pairs ที่ไม่ค้าง pot อยู่แล้ว, isolate ตัวเองเจอ stronger ranges. <b>check decide-by-action</b> ดีกว่า — ถ้าเช็คตามกันมา turn ดูใบที่มาแล้วตัดสินใจ, ถ้าโดน bet ค่อยอ่าน range`,
  deep:`<b>เจาะลึก</b><br>
  <b>• กฎ multiway c-bet:</b> heads-up บน QJT คุณ c-bet ⅓-½ ได้ (range advantage). multiway frequency <b>ลดลงประมาณครึ่ง</b> และต้องการมือแข็งหรือมี equity จริง (sets, straights, OESD+overpair). KK overpair ไม่ใช่ "มือแข็ง" บน board นี้ multiway
  <br><b>• Equity vs 2 ranges:</b> KK vs (BTN call range: broadway/suited gappers/mid pairs) + (BB defend range: super wide รวม J-high, T-high, suited 1-gappers). KK equity ~35-42% multiway — เป็น <b>underdog ที่อาจกลายเป็น favorite</b> ตาม turn card
  <br><b>• ทำไม bet เล็ก (⅓) เป็น "ok":</b> เก็บ initiative + protect equity vs Ax overcards. แต่โดน raise จาก BTN ก็แทบต้อง fold (ดูเหมือนเสีย equity 35%). ทำได้ vs villains passive ที่ไม่ค่อย raise — เป็น exploit, ไม่ใช่ baseline
  <br><b>• Turn plan ถ้า check ทุกคน:</b> brick (เช่น 2,3,4,5) → bet ½ pot (range advantage ปรากฏ + capping ของ BB ชัดขึ้น). K → set top + กลายเป็นภัยใหม่ของ straight, bet ½ pot. A/9/8/7 → check-decide. ใบ ♥ ใบที่สี่ → flush draw ลง, มือเรากลายเป็น bluff-catcher
  <br><b>• Range วิเคราะห์:</b> ใน flop nutted range ของ BB/BTN: AK (straight nut), KQ/K9/89 (straight), QQ/JJ/TT (set), AJ/AQ/AT/KJ/KT/QJ/QT/JT (top/two pair) — ทั้งหมดนี้ <b>ไม่ fold</b> ต่อ c-bet ของเรา. มือที่ fold คือ 22-77, 9x ขยะ, A-high ที่ไม่มี draw = combo เราชนะอยู่แล้ว
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> heads-up บน QJT → c-bet ⅓ ปกติ. board แห้ง multiway (Q-7-2) → c-bet small ⅓. ถ้าถือ set KK ที่ K ตกในบอร์ด (เช่น K-Q-J multiway, เราทับ K) → bet ใหญ่ protect. ถ้าทุกคนตื้น (SPR ต่ำ) → c-bet jam commit เลย`
},
{
  id:'px4', cat:'preflop',
  stage:'Final Table', stack:'30bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 5 คน · pay jump <b>ใหญ่ทุกอันดับ</b> · MP (32bb) cover เราหมด',
  pot:47.5, toCall:14,
  hero:['As','Kd'], heroLine:'UTG • 30bb',
  stacks:[['UTG',30],['MP',32]],
  streets:[{name:'Preflop', acts:[
    {pos:'YOU', a:'raise', amt:'2.2'},
    {pos:'MP', a:'3bet', amt:'7'},
    {pos:'CO BTN SB BB', a:'fold'},
    {pos:'YOU', a:'4bet', amt:'16'},
    {pos:'MP', a:'shove', amt:'30 (all-in)'}
  ]}],
  q:'AKo เปิด UTG, MP 3bet, เรา 4bet, MP <b>5-bet shove all-in</b> — Final Table 5 คน',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call all-in'} ],
  best:0, ok:[1],
  why:`<b>เฉลย: Fold (close — ICM override)</b> — chipEV ล้วน: AKo vs MP 5-bet jam range (~QQ+, AK ส่วนใหญ่) มี ~38-40% equity และราคาดี (14:47.5 → ขอแค่ ~23%) → <b>+chipEV ชัด</b>
  <br><br>แต่นี่คือ <b>Final Table 30bb covered + pay jump ใหญ่</b>. ICM risk premium ที่ FT มัก 30-50% → equity threshold พุ่งจาก 23% → <b>~38-45%</b>. AKo อยู่ขอบเลย
  <br><br>Population: MP 5-bet jam vs UTG 4-bet มัก value-heavy (<b>KK+, AKs บางส่วน</b>). AKo vs (AA, KK, QQ, AKs) = ~33-36% → ต่ำกว่า ICM threshold. AKo <b>โดน dominated โดย AKs</b> (chop), <b>แพ้ AA แทบศูนย์ (~7%)</b>, แพ้ KK (~30%, เราบล็อก 1 K)
  <br><br>การ <b>เผา 30bb ที่ FT</b> เพื่อ +chipEV เล็กน้อย = ขาดทุน <b>ticketEV/$EV</b> ก้อนใหญ่ จาก pay jumps ที่จะหายไป. ถ้า MP เป็น aggro known 5-bet bluff → call. default = fold เพื่อรักษา tournament life`,
  deep:`<b>เจาะลึก</b><br>
  <b>• chipEV เป๊ะ:</b> pot ก่อนเราตัดสินใจ = 1.5 (blinds) + 16 (เรา) + 30 (MP all-in effective) = 47.5. toCall 14 → 14/(14+47.5) = 22.8% เกณฑ์ break-even. AKo vs (QQ+, AKs, AKo) = ~40% → +EV chipEV ~ +10.5bb ทันที
  <br><b>• ICM threshold เกิดขึ้นยังไง:</b> ที่ FT 5 คน 30bb covered, การ bust ตอนนี้เสีย future $EV มหาศาล (pay jump 5th→4th มัก 30-40%, 4th→3rd อีก 30%). risk premium ทั่วไปสำหรับ "medium stack covered ที่ FT" ≈ 25-40%. effective threshold = ~28-32% → AKo ที่ 40% chipEV กลายเป็น close fold/call ที่ ICM
  <br><b>• Range MP 5-bet jam realistic:</b> MP 3-bet vs UTG = แคบ (QQ+, AK เป็นส่วนใหญ่). หลังจากโดน 4-bet 5-bet jam แคบลงอีก: <b>KK/AA + AKs + บาง QQ และ AKo ที่ frustrated</b>. นี่คือ value-heavy range
  <br><b>• AKo vs AKs ต่างกันชัด:</b> AKs ที่ FT spot นี้ → call ได้ (~42% equity + nut flush blocker tighten range MP); AKo → fold close. นี่คือ "suit ของ AK สำคัญที่ FT"
  <br><b>• ICM Math practical:</b> ถ้า prize pool = $100K, payouts 5th=$10K → 1st=$30K. การ fold รักษา ~$15K equity (median outcome). การ call: 0.4 × $20K + 0.6 × $10K = $14K. ΔEV ~ -$1K ใน $EV จริง — fold ดีกว่าแม้จะ +chipEV
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> vs MP aggressive 5-bet bluff (history) → call (range เปิด, equity เพิ่ม). เราเป็น chip leader/เจ็บได้ → call. early phase (no ICM) → snap call. AKs แทน AKo → close call. ถ้า MP สั้นกว่า (เช่น 18bb) → call เพราะ effective stack ลดลง = pay jump loss น้อยลง`
},
{
  id:'px5', cat:'postflop',
  stage:'Mid Stage', stack:'40bb',
  pot:9.5, toCall:6,
  board:['Kc','9c','4d','2c'], hero:['Qh','Tc'], heroLine:'BB',
  stacks:[['BTN',42],['BB',40]],
  streets:[
    {name:'Preflop', acts:[{pos:'BTN', a:'raise', amt:'2.5'},{pos:'YOU', a:'call'}]},
    {name:'Flop', acts:[{pos:'YOU', a:'check'},{pos:'BTN', a:'cbet', amt:'⅓'},{pos:'YOU', a:'call'}]},
    {name:'Turn', acts:[{pos:'YOU', a:'check'},{pos:'BTN', a:'bet', amt:'⅔'}]}
  ],
  q:'QTcc บน K♣9♣4-2♣ (เพิ่งได้ flush draw + gutshot), BTN double-barrel — semibluff?',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call'}, {k:'raise',label:'Check-Raise',sub:'~3x'} ],
  best:2, ok:[1],
  why:`<b>เฉลย: Check-Raise (semibluff)</b> — turn 2♣ เปิด <span class="k">flush draw ครบ 9 outs</span> + เรามี <b>gutshot J</b> (สำหรับ K-Q-J-T-9 = nut straight) + Q overcard เป็น showdown value เพิ่ม
  <br><br>นับ outs: 9 ♣ (flush) + 3 J non-club (straight) = <b>~12 clean outs</b> + Q overcard บางที่ดี = ~13-14 outs ≈ <b>equity ~45-50%</b> vs Kx top pair
  <br><br>มือนี้ "<b>แข็งเกินกว่าจะแค่ call</b>": (1) <b>fold equity จริง</b> — BTN fold Kx kicker อ่อน (KJ, KT), missed Ax, AQ-AJ ที่ปั้น value ยาก (2) ถ้าโดน call equity เรา ~45% — แทบไม่เคย drawing dead (3) <b>denied free river</b> เมื่อ miss + ได้ initiative
  <br><br>การแค่ call ทำให้: pot เล็ก, เราเสีย initiative, river miss เล่นยากกับ BTN ที่ value-bet ต่อ. <b>raise OOP กับ combo draw 12+ outs คือ +EV ชัดเจน</b>`,
  deep:`<b>เจาะลึก</b><br>
  <b>• นับ outs ละเอียด:</b> club 9 ใบ (เราใช้ T♣, board K♣ 9♣ 2♣ — เหลือ ♣ ในเด็ค 13-4 = 9) → flush 9 outs. straight J = 4 ใบ (Jh, Jd, Jc, Js) - 1 (Jc ซ้อน flush ที่นับแล้ว) = 3 clean. รวม 12 outs สด. Q overcard = 3 ใบ (Qs, Qd, Qc) - บางที่ดีอยู่ vs missed AJ/AT
  <br><b>• OOP semibluff > IP semibluff (counter-intuitive):</b> ปกติ aggression อยากอยู่ IP. แต่ <b>OOP ต้องการ fold equity เพื่อชดเชย positional disadvantage</b>. raise OOP บีบ BTN ตัดสินใจกับ Kx อ่อน, missed Ax, AQ — ถ้าเรา flat-call แทน เราต้อง check river แล้ว BTN เลือก size ที่ exploit เรา (เบทเล็ก value-extract / เบทใหญ่ bluff เรา miss)
  <br><b>• Blocker บวก:</b> Q♥ ตัด AQ/KQ value combos บางส่วน. T♣ ตัด AT/KT/JT straight draws ของ BTN. ทำให้ range BTN ที่ fold ต่อ raise สมจริงขึ้น
  <br><b>• Sizing optimal:</b> check-raise ~3x (เบทเขา 6 → raise เป็น 18-20). ใหญ่พอ pressure Kx, เล็กพอ stack management plan ที่ river (ถ้า miss ก็ไม่ commit). ถ้าเราตื้น (SPR < 1.5 จาก turn) → check-jam ทันที (commit อยู่แล้ว)
  <br><b>• River plan:</b> hit flush/straight → bet ⅔-pot value. miss + BTN check → bet ⅓ pot bluff (story consistent — เรา rep K9/sets/straight ตั้งแต่ flop check-call → turn raise). BTN call river ของเรา = แสดงมือ Kx ที่ stuck. BTN re-jam = น่ากลัว, fold ถ้า miss
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> vs <b>station ที่ไม่ fold Kx</b> → call เก็บ implied (fold equity = 0, semibluff เป็น pure equity play). vs <b>nit ที่ barrel turn = value-only</b> → call/fold (ไม่มี bluffs ที่หาย, raise โดน 3bet ทันที). ถ้า board ครบ ♣ 4 ใบ (เรามี Tc + 3 board) → ระวัง straight flush draws ของ BTN. ถ้า turn เป็น brick non-club (no flush draw, แค่ gutshot 4 outs) → fold/call ดีกว่า raise`
},
{
  id:'px6', cat:'postflop',
  stage:'Mid Stage', stack:'30bb',
  pot:25.5, toCall:12,
  board:['7h','6h','5c','4d','Kc'], hero:['8s','8d'], heroLine:'BB',
  stacks:[['BTN',32],['BB',30]],
  streets:[
    {name:'Preflop', acts:[{pos:'BTN', a:'raise', amt:'2.5'},{pos:'YOU', a:'call'}]},
    {name:'Flop', acts:[{pos:'YOU', a:'check'},{pos:'BTN', a:'cbet', amt:'½'},{pos:'YOU', a:'call'}]},
    {name:'Turn', acts:[{pos:'YOU', a:'check'},{pos:'BTN', a:'bet', amt:'⅔'},{pos:'YOU', a:'call'}]},
    {name:'River', acts:[{pos:'YOU', a:'check'},{pos:'BTN', a:'bet', amt:'12'}]}
  ],
  q:'88 บน 7-6-5-4-K (เราตี 8-high straight ตั้งแต่ turn), BTN เบท ½ pot river K — call หรือ raise?',
  opts:[ {k:'fold',label:'Fold'}, {k:'call',label:'Call'}, {k:'raise',label:'Raise',sub:'~jam'} ],
  best:2, ok:[1],
  why:`<b>เฉลย: Raise (value, jam ได้)</b> — เรามี <span class="k">8-high straight (4-5-6-7-8)</span> บน 7-6-5-4-K = <b>effective nuts</b>. มือเดียวที่บีตคือ 9-high straight (89) ซึ่งเป็น <b>8 combos</b> ใน 990 มือ (~1%) — และใน BTN open range filter เหลือเพียง 89s ~2 combos
  <br><br>BTN เบท river K = signal <b>Kx ที่เพิ่งตี top pair</b> (KJ/KQ/AK ที่ barrel มาแล้ว, หรือ K9s/K8s/K7s ใน BTN open). ส่วนน้อยเป็น sets ที่ slowplay (44/55/66/77 ที่ check turn back ก็มี — ใน line นี้ไม่ใช่) หรือ straights chop (87/86 ก็ทำ straight เหมือนเรา)
  <br><br><b>raise = +EV มหาศาล</b>: Kx ส่วนใหญ่ call (เพิ่งตี top pair, ราคา perceived ดี), sets call/jam, straights chop. โดน re-jam → snap call (equity เรา >90% vs jam range filtered)
  <br><br><b>กับดักของ "scared money"</b>: คนกลัวเจอ 9x แล้วแค่ call. แต่ <b>89 ใน BTN range = ~2 combos จริง</b> vs <b>~30-50 combos value ที่จ่าย raise</b> → เผา EV เพราะกลัวเงาตัวเอง`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Showdown verifier (ground truth):</b> brute-force 990 villain combos บน board 7h6h5c4dKc กับ hero 8s8d = <b>903 แพ้, 79 chop, 8 บีต</b>. มือที่บีต: Straight 9-high (89) × 8 combos ทั้งหมด. มือที่ chop: 8x อื่นๆ × 79 combos (ทุก 8 ใน villain มือ → ใช้ board 4-5-6-7 + 8 = 4-5-6-7-8 เหมือนเรา)
  <br><b>• Filter ผ่าน BTN open range:</b> 89s = 4 combos × suited; แต่ในนั้น 8♠8♦ ของเราตัด 1 ใบ 8, board ตัด 4d-5c-6h-7h-Kc → 89s ที่เหลือใน range BTN ที่ดี: 9♣8♣ (board 5c Kc ไม่ตัด 8c 9c), 9♦8♥ (offsuit หลายราย), จริงๆ ~2-4 combos ที่อยู่ใน range BTN open
  <br><b>• BTN value range river:</b> Kx ที่ barrel มาตลอด → KJ/KQ/AK/K9s/K8s — รวม ~15-20 combos (มาก). sets/two pair มัก bet turn ใหญ่กว่านี้ (ไม่ใช่ ⅔). 87/86 (straights chop) บาง combos. รวม value ที่จ่าย raise ~25-35 combos
  <br><b>• Sizing raise/jam:</b> ตื้น 30bb-pot 25.5-toCall 12 → SPR หลัง call ~ 0.7. <b>jam ทันที</b> (stack เหลือเพียงพอ commit). Kx ที่ stuck ค้าง ½ pot bet มาแล้วมี chance call jam ก้อนสุดท้าย (sunk cost + pot odds ดี)
  <br><b>• ทำไมคนพลาด (3 จุด):</b> (1) เห็น board 4-card straight แล้ว overcount villain combos ที่ทำ 9-high straight — ลืมว่า BTN open ไม่ค่อยมี 89o, แค่ 89s sparse (2) เห็น river K เป็น scare card แล้วคิดว่า BTN ทับเรา — แต่ K ช่วยให้ Kx จ่าย raise เป็น value (3) ขาด combinatorics — ไม่ <b>count combos จริง</b> ว่า 89s มีกี่ combos ใน range
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> vs <b>UTG/MP opener</b> (range แคบ — 89s ไม่อยู่) → snap jam (เกือบไม่มีอะไรบีต). vs <b>aggro maniac</b> ที่ overbet jam river บ่อย → call เป็น trap (เขามักไม่ value-bet ⅔, ไป overbet เลย). ถ้า board pair (river 7 แทน K → board 7-6-5-4-7) → ระวัง full house (7x), raise ระมัดระวัง. ถ้า hero ถือ 9x แทน 8x → snap jam (เราเป็น nut straight แทน chop-prone)`
},

/* ---------------------- COMPLETE HANDS (h*) — preflop → showdown/fold ต่อเนื่อง ---------------------- */
// Hand 1 — BB defends 56s vs CO open, ตี 9-high straight, value-bet → showdown WIN
{
  id:'h1a', cat:'preflop', step:'1/4',
  stage:'Mid Stage', stack:'40bb',
  pot:4, toCall:1.5,
  hero:['5h','6h'], heroLine:'BB • 40bb',
  stacks:[['CO',45],['BB',40]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.5'},{pos:'BTN SB',a:'fold'}]}],
  q:'BB defend — CO เปิด 2.5bb, ทุกคน fold ถึงเรา. 56s — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'1.5bb'},{k:'raise',label:'3-Bet',sub:'9bb'}],
  best:1, ok:[2],
  nextSpotId:'h1b',
  why:`<b>เฉลย: Call</b> — 56s เป็นมือ "BB defend wide" คลาสสิก: ราคา 1.5 เข้า pot 4 ขอแค่ ~27% equity, suited connector มี playability ดี + implied odds สูง
  <br>3-Bet เป็น mix ได้ (suited gapper combos เพื่อ balance value 3bets), แต่ flat ใน position เสียเปรียบนี้ก็ทำกำไรชัด — เห็น flop ในราคาถูก`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Math:</b> 1.5/(1.5+4) = 27% pot odds. vs CO open ~30% range, 56s มี ~38% raw → call +EV แม้ก่อน implied
  <br><b>• Implied odds:</b> ถ้าตี straight/flush/two pair เรามักได้ value เพิ่ม 5-15bb. CO PFR range มี Kx/Ax overpairs ที่จ่ายเรา
  <br><b>• ทำไมไม่ fold:</b> 56s ตี flop ดีหลายทาง (OESD, flush draw 2-tone, top pair sneaky). fold คือทิ้ง equity ที่ math รับรอง
  <br><b>• ทำไมไม่ default 3-Bet:</b> OOP 3-bet ทำให้ pot บวมตอนเสียเปรียบตำแหน่ง. ใช้กับ value (TT+, AQs+) + bluffs (A5s, K5s, suited gappers รวม 56s บ้าง mix). default = flat`
},
{
  id:'h1b', cat:'postflop', step:'2/4', hidden:true,
  stage:'Mid Stage', stack:'40bb',
  pot:7.5, toCall:2,
  board:['4c','9d','7s'], hero:['5h','6h'], heroLine:'BB',
  stacks:[['CO',45],['BB',40]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.5'},{pos:'BTN SB',a:'fold'},{pos:'YOU',a:'call'}]},
    {name:'Flop', acts:[{pos:'YOU',a:'check'},{pos:'CO',a:'cbet',amt:'2'}]}
  ],
  q:'Flop 4-9-7 rainbow. เรามี <b>OESD</b> (3 หรือ 8 = straight). CO c-bet ⅓ pot — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'2bb'},{k:'raise',label:'Check-Raise',sub:'~6bb'}],
  best:1, ok:[2],
  nextSpotId:'h1c',
  why:`<b>เฉลย: Call (Check-Raise mix ก็ได้)</b> — OESD 8 outs สด ≈ 32% equity vs top pair บน 2 streets. ราคา 2 เข้า pot 7.5 (ขอ ~21%) → call +EV แม้ก่อน implied
  <br>เพิ่ม implied: ถ้าตี straight (turn 3/8) มักเก็บอีก 5-15bb จาก top pair/overpair. <br>Check-raise mix freq ~15-25% สำหรับ balance — fold equity vs Ax/overcards แต่ flat ปลอดภัยและ realize equity ดีกว่าใน OOP`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Outs:</b> 8 outs สด (3, 8 ทุกสี). + 5 backdoor (flush h, two pair 5/6) ≈ 9-10 effective outs ≈ 34% equity vs top pair 9x
  <br><b>• ทำไม Call > Raise default:</b> raise OOP build pot ตอนเป็นรอง + ตัด bluffs ของ CO ที่เราอยากให้ continue. flat keep range + เห็น turn ถูก
  <br><b>• Check-Raise เป็น mix:</b> fold equity vs Ax/overcards + protect range. ถ้า CO c-bet super high freq (>70%) → check-raise มากขึ้น</b>
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> มี flush draw เพิ่ม (combo draw ~13 outs) → raise/semibluff jam. board pair → fold (no equity to chase). vs nit ที่ c-bet only value → fold`
},
{
  id:'h1c', cat:'postflop', step:'3/4', hidden:true,
  stage:'Mid Stage', stack:'40bb',
  pot:9.5, toCall:0,
  board:['4c','9d','7s','8h'], hero:['5h','6h'], heroLine:'BB',
  stacks:[['CO',45],['BB',40]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.5'},{pos:'BTN SB',a:'fold'},{pos:'YOU',a:'call'}]},
    {name:'Flop', acts:[{pos:'YOU',a:'check'},{pos:'CO',a:'cbet',amt:'2'},{pos:'YOU',a:'call'}]},
    {name:'Turn', note:'ตาคุณ — OOP ก่อน', acts:[]}
  ],
  q:'Turn 8 — เราตี <b>9-high straight (5-6-7-8-9)</b>! BB OOP ก่อน — bet หรือ check?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'Bet',sub:'½ pot'},{k:'raise',label:'Bet',sub:'¾ pot'}],
  best:1, ok:[2],
  nextSpotId:'h1d',
  why:`<b>เฉลย: Bet ½ pot (value + protect)</b> — เรามี <span class="k">9-high straight</span>: ใบ 9 อยู่บอร์ด + เรามี 5-6 → ครบ 5-6-7-8-9. <b>มือเดียวที่บีตคือ JT (J-high straight) หรือ T6 (T-high)</b>
  <br>CO call turn bet ด้วย: top pair 9x (A9, K9), overpairs (TT-AA), sets (44/77/88/99), straight draws (T6 ที่ทำ straight แล้ว — แพ้เรา), gutshots (6x/Jx). เกือบทั้งหมด <b>จ่าย bet ของเรา</b>. JT ใน CO range มี ~12 combos = ~10-15% ของ range — เป็นรองส่วนน้อย
  <br>Check ปล่อย CO ตี river ฟรี + ถ้า turn ทำให้ flush draw ลง (no 2-tone bottom but 8h เพิ่ม heart) เราเสีย control`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Equity:</b> showdown verifier บน 4c9d7s8h2d (river brick) ให้ 953 lose, 9 chop, 28 beat (JT 16, T6 12). vs CO filtered range ~75% equity
  <br><b>• ทำไม Bet ½ optimal:</b> ½ keeps top pair + overpairs + draws in. ¾ fold out marginal pairs + missed gutshots. ½ extracts thin value across wide call range
  <br><b>• Range CO call turn bet:</b> 9x ~12 combos, TT-AA ~24, sets ~10, JT (beats us) ~12, T6 (beats us, rare) ~2. เราชนะ ~70-80% ของ range ที่ call
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> ถ้าเรามี nut straight (เช่นถือ JT) → bet ¾-pot ใหญ่ขึ้น. ถ้า turn คือ T (board 4-9-7-T) เรากลายเป็น 9-high straight underdog → check. ถ้า board completes flush (2 hearts on flop + 8h turn) → bet ¾ protect`
},
{
  id:'h1d', cat:'postflop', step:'4/4', hidden:true,
  stage:'Mid Stage', stack:'40bb',
  pot:18.5, toCall:0,
  board:['4c','9d','7s','8h','2d'], hero:['5h','6h'], heroLine:'BB',
  stacks:[['CO',45],['BB',40]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.5'},{pos:'BTN SB',a:'fold'},{pos:'YOU',a:'call'}]},
    {name:'Flop', acts:[{pos:'YOU',a:'check'},{pos:'CO',a:'cbet',amt:'2'},{pos:'YOU',a:'call'}]},
    {name:'Turn', acts:[{pos:'YOU',a:'bet',amt:'4.5'},{pos:'CO',a:'call'}]},
    {name:'River', note:'ตาคุณ — OOP ก่อน', acts:[]}
  ],
  q:'River 2 brick. เรายังถือ 9-high straight. BB OOP ก่อน — bet เท่าไร?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'Bet',sub:'⅓ pot'},{k:'raise',label:'Bet',sub:'⅔ pot'}],
  best:2, ok:[1],
  reveal:{pos:'CO', cards:['As','9s'], note:'call แล้วเปิด top pair top kicker<br>— straight เราชนะ'},
  why:`<b>เฉลย: Bet ⅔ pot (value)</b> — river brick ไม่เปลี่ยน range. CO ที่ call turn + check turn-back ไม่เคยทำ → CO call river ด้วย Kx? ไม่มี K. ที่จริง CO call ด้วย <b>9x/overpairs/sets/Tx</b>. เราชนะส่วนใหญ่
  <br>⅔ ขนาดดีที่สุดของ thin value: top pair จ่ายเต็ม, overpairs (AA-TT) จ่าย, sets จ่าย (เป็น "trap" สำหรับเขา). JT ยัง <b>raise/jam</b> (เราจะ snap call เพราะราคา) — ไม่ได้เสีย ev มาก
  <br><br>🏁 <b>จบมือ — Showdown:</b><br>
  CO call ⅔ pot ของเราด้วย <b>A♠9♠</b> (top pair top kicker — คิดว่าเราอาจ bluff straight draw ที่ miss)<br>
  เราโชว์ <b>5♥6♥</b> = 9-high straight<br>
  <span class="k">เราชนะ +12.3bb pot ใน hand นี้</span> · perfect BB defend → flop call OESD → turn value bet straight → river thin value extract`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• ทำไม line นี้ทำเงิน:</b> defend 56s เริ่มต้น +EV (ราคาดี + playability). flop call OESD +EV (implied odds). turn bet straight = value + protect. river bet ⅔ = max extract จาก top pair
  <br><b>• ทำไม CO ไม่ fold A9 river:</b> CO line = barrel flop + call turn + ถูก check river → CO เห็น "BB ที่เล่น passive ทั้งสาย" mindset bluff catch สูง. ราคา 12 of 30 = ขอ 29%, A9 perceived เกิน threshold
  <br><b>• Sizing ⅔ vs pot vs ⅓:</b> ½ thin (เสีย ev จาก TT/AA จ่ายเต็มได้), ⅔ sweet spot, pot fold out marginal. ⅓ ก็ใช้ได้ (ok) แต่ ⅔ value มากกว่า
  <br><b>• Hand summary:</b> ก่อน hand เริ่ม = 40bb. หลัง hand = ~52bb. +30% stack จากการเล่น BB defend ที่ถูกต้องทุก street`
},
// Hand 2 — UTG 88 opens, BB 3-bets, เรา call set-mine, flop KQ4 = fold (disciplined fold ends hand)
{
  id:'h2a', cat:'preflop', step:'1/3',
  stage:'Mid Stage', stack:'35bb',
  pot:1.5, toCall:0,
  hero:['8s','8d'], heroLine:'UTG • 35bb',
  stacks:[['UTG',35],['BB',38]],
  streets:[{name:'Preflop', note:'ตาคุณเปิดเป็นคนแรก', acts:[]}],
  q:'88 จาก UTG (9-max), 35bb — เปิดยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'raise',label:'Raise',sub:'2.2bb'}],
  best:1,
  nextSpotId:'h2b',
  why:`<b>เฉลย: Raise 2.2bb</b> — 88 อยู่ในขอบ UTG opening range ที่ 9-max (~12-14% top). มี playability ดี (set-mine value, overpair บางบอร์ด) และเล่นต่อ postflop ได้
  <br>limp/fold ที่ stack 35bb = ทิ้ง EV ฟรี. ปล่อย raise ปกติเพื่อ initiative + thin field`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range UTG 9-max:</b> 77+, AJs+, AQo+, KQs ประมาณ ~12% — 88 อยู่ใน range ชัด
  <br><b>• Sizing 2.2-2.5bb:</b> มาตรฐาน 9-max. เปิดเล็กลด commit ถ้าโดน 3bet
  <br><b>• Stack 35bb:</b> ยังเล่น postflop ได้ดี (set-mine SPR เหมาะ). ตื้นกว่า (20bb-) → เริ่ม mix shove`
},
{
  id:'h2b', cat:'preflop', step:'2/3', hidden:true,
  stage:'Mid Stage', stack:'35bb',
  pot:10.2, toCall:5.3,
  hero:['8s','8d'], heroLine:'UTG • 35bb',
  stacks:[['UTG',35],['BB',38]],
  streets:[{name:'Preflop', acts:[{pos:'YOU',a:'raise',amt:'2.2'},{pos:'MP CO BTN SB',a:'fold'},{pos:'BB',a:'3bet',amt:'7.5'}]}],
  q:'88 เปิด UTG, ทุกคน fold ถึง BB ที่ <b>3bet 7.5bb</b> — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'5.3bb'},{k:'raise',label:'4-Bet',sub:'17bb'}],
  best:1, ok:[0],
  nextSpotId:'h2c',
  why:`<b>เฉลย: Call (set-mine + realize equity)</b> — vs BB 3bet range จาก IP-OOP ที่ 35bb, 88 มี ~38-42% vs typical range (QQ+, AK + bluffs) แต่ "set or give up" บ่อย
  <br>ราคา 5.3 เข้า 10.2 (ขอ ~34% equity) + implied odds จาก set (12% ตี set = stack big pots) → call +EV
  <br>4-bet ปั้น value ยาก (โดน fold ออก worse pairs, โดน jam จาก QQ+/AK ที่เราเป็นรอง). Fold ตึง — call ได้ราคาดี`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range BB 3-bet vs UTG:</b> tight (QQ+, AK ส่วนใหญ่) + บาง bluffs (A5s, KQs). 88 vs (QQ+, AK) = ~30% equity, vs polarized (มี bluffs) ~42%
  <br><b>• Set-mine math:</b> 5.3 to win effective ~30bb (stack). 12% chance set → 12% × 30bb = 3.6bb implied. +pot odds equity = call profitable
  <br><b>• ทำไม 4-bet bad:</b> 4-bet ทำให้ range เรา polarized. 88 ที่ตำแหน่งระหว่าง "ไม่ดีพอ value, ไม่แย่พอ bluff" = leak. ใช้ AA/KK + บาง A5s แทน
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> stack ตื้น (<20bb) → 4-bet jam (commit อยู่แล้ว). BB เป็น nit (QQ+ เพียวๆ) → fold tight. BB aggro (3bet bluff หนัก) → call/4bet bluff combo`
},
{
  id:'h2c', cat:'postflop', step:'3/3', hidden:true,
  stage:'Mid Stage', stack:'35bb',
  pot:23.5, toCall:8,
  board:['Kh','Qc','4s'], hero:['8s','8d'], heroLine:'UTG',
  stacks:[['UTG',35],['BB',38]],
  streets:[
    {name:'Preflop', acts:[{pos:'YOU',a:'raise',amt:'2.2'},{pos:'MP CO BTN SB',a:'fold'},{pos:'BB',a:'3bet',amt:'7.5'},{pos:'YOU',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'cbet',amt:'8 (½ pot)'}]}
  ],
  q:'Flop K-Q-4 rainbow — <b>bad runout</b> สำหรับ 88. BB c-bet ½ pot — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'8bb'},{k:'raise',label:'Raise/Jam'}],
  best:0, ok:[],
  why:`<b>เฉลย: Fold (disciplined)</b> — 88 underpair บน K-Q-4 vs BB 3bet range = <b>ฝันร้าย</b>
  <br>(1) ใบ K, Q บล็อก top pairs ของเขา — แต่ BB 3bet range เต็มไปด้วย Kx/Qx (AK, AQ, KQ, KK, QQ) — เรา dominated หมด
  <br>(2) ไม่ตี set (12% หาย) + ไม่มี backdoor straight/flush ที่มีค่า
  <br>(3) ราคา 8 เข้า pot 23.5 ขอ ~25% equity — 88 vs typical 3-bet range บน K-Q-4 ≈ 12-18% (set draw 2 outs + outs vs bluffs น้อย)
  <br><br>🏁 <b>จบมือ — เรา fold</b>:<br>
  เสีย <b>7.5bb</b> ที่ลงไปก่อน flop (preflop call). <b>เก็บ stack 27.5bb</b> ไว้สู้มือหน้า — แทนที่จะ call-call ลงพอตใหญ่กับ underpair ที่แทบไม่ชนะ
  <br><br>BB คาดว่ามี AK/AQ/KQ — ถ้า peek จริงเขามักโชว์อะไรเหล่านี้`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• ทำไม fold ถูก:</b> 88 set-mine ราคา 5.3 ที่ pre — เมื่อไม่ตี set บน <b>scary board</b> ที่เราเป็นรอง = give up. นี่คือ "set or give up" mindset ที่ตรงไปตรงมา
  <br><b>• Equity vs BB c-bet range:</b> AK (44% vs us), AQ (28%), KQ (8%), KK (2%, set over set), QQ (8%), AA (18%), AT-KJ-QJ broadway draws (~30%). filtered c-bet range (เน้น value + some bluffs ของ Ax). 88 มี ~15-20% — ต่ำกว่า 25% threshold ของ pot odds
  <br><b>• ทำไมไม่ floor call:</b> board เปียกพอ (broadway draws เพียบ) + เป็น OOP + stack ตื้น (15bb หลัง call) → set up turn ที่เล่นยาก. ทุก scary turn (J, T, A) → fold/bluff catch
  <br><b>• Hand summary:</b> เริ่ม 35bb → จบ 27.5bb (เสีย 7.5bb pre-flop call). เทียบกับ "call flop call turn fold river" ที่อาจเสีย 22-25bb → fold flop คือ <b>save 14-17bb</b>
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> board paint แต่แห้งกว่า (เช่น Q-7-2 rainbow) → call (เรามี overpair vs Qx). board low (8-5-2 ทำให้ 88 = overpair) → snap call/raise. ถ้าเป็น 99-TT บน K-Q-4 → close แต่ยัง fold ส่วนใหญ่`
},

// Hand 3 — FT ICM: TT vs chip leader, ตี two pair แต่ river jam บนบอร์ด flush+paired = FOLD (blocker คือกับดัก)
{
  id:'h3a', cat:'preflop', step:'1/4',
  stage:'Final Table', stack:'24bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 6 คน · BB คือ chip leader (คนเดียวที่ cover เรา) · pay jump ถัดไปแพงมาก',
  pot:1.5, toCall:0,
  hero:['Ts','Td'], heroLine:'CO • 24bb',
  stacks:[['CO',24],['BB',40]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP',a:'fold'}]}],
  q:'TT ที่ CO, 24bb — Final Table เหลือ 6 คน (BB คือ chip leader). เปิดยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'raise',label:'Raise',sub:'2.2bb'},{k:'shove',label:'All-in',sub:'24bb'}],
  best:1,
  nextSpotId:'h3b',
  why:`<b>เฉลย: Raise 2.2bb</b> — TT แข็งพอเปิดจาก CO ทุกสถานการณ์ แต่ที่ 24bb การ <b>open-jam คือ overplay</b>: มือที่ call jam 24bb มีแต่ JJ+/AK ที่เราเป็นรอง/flip — เผา value ทั้งหมดของมือ
  <br>เปิดปกติเก็บ fold equity + เล่น postflop ได้ + ไม่ commit ทั้ง stack ที่ FT ตอน BB (chip leader) cover เรา`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไมไม่ jam:</b> 24bb ลึกเกิน push/fold zone (เส้นแบ่ง ~15-18bb). jam ทำให้ "มือแย่ fold หมด มือแข็งกว่า call หมด" = reverse implied
  <br><b>• ICM:</b> BB เป็น chip leader — ถ้าเขา 3bet เราต้องคิดหนัก (เขากดดันเราได้เพราะ bust = แพงสำหรับเรา ไม่ใช่เขา) แต่นั่นไม่ใช่เหตุผลให้ไม่เปิด TT
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> 15bb → open-jam ได้. มี short stack 4bb กำลังจะ blind out → fold มือ borderline ได้ (แต่ TT ไม่ borderline)`
},
{
  id:'h3b', cat:'postflop', step:'2/4', hidden:true,
  stage:'Final Table', stack:'24bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 6 คน · BB คือ chip leader (คนเดียวที่ cover เรา) · pay jump ถัดไปแพงมาก',
  pot:4.9, toCall:0,
  board:['Js','9s','2d'], hero:['Ts','Td'], heroLine:'CO',
  stacks:[['CO',24],['BB',40]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'YOU',a:'raise',amt:'2.2'},{pos:'BTN SB',a:'fold'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'}]}
  ],
  q:'BB (chip leader) call. Flop J♠9♠2♦ — TT ของเรากลายเป็น <b>underpair to J</b> + มี T♠. BB เช็คมา — เล่นยังไง?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'Bet',sub:'⅓ pot (1.6)'},{k:'raise',label:'Bet',sub:'¾ pot (3.7)'}],
  best:1, ok:[0],
  nextSpotId:'h3c',
  why:`<b>เฉลย: Bet ⅓ (Check ก็รับได้)</b> — TT บน J♠9♠2♦ เป็นมือ "กลางๆ ที่ยังนำ range BB": เขามี 9x, 8x, draws, ace-high เพียบที่จ่าย/fold ให้เบทเล็กได้
  <br>เบท ⅓ ทำ 3 อย่าง: <b>thin value</b> จาก 9x/draw, <b>deny equity</b> จาก overcards (K/Q/A ฟรีการ์ดเจ็บมาก), และตั้ง pot ขนาดควบคุมได้. T♠ ในมือช่วยลด combo flush draw ของเขาเล็กน้อย
  <br>เบทใหญ่ ¾ ผิด: isolate ตัวเองเจอแต่ Jx+ ที่บีตเรา. Check ใช้ได้ในแนว pot-control ICM แต่เสีย deny equity`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range BB call pre:</b> กว้าง (suited, connectors, Ax, pairs เล็ก) → flop นี้โดน Jx บ้างแต่ส่วนใหญ่คือ 9x/draw/อากาศ. TT อยู่หน้า ~60-65% ของ range
  <br><b>• ทำไม ⅓ ไม่ใช่ ¾:</b> มือเรา "แข็งพอเบท แต่ไม่แข็งพอเล่นพอตใหญ่" — เบทเล็ก = ทุก worse hand เล่นต่อผิดๆ ได้, เบทใหญ่ = เหลือแต่ better hands
  <br><b>• แผนถ้าโดน check-raise:</b> ที่ FT vs chip leader → fold ได้เลย (เขากดดันเราได้ด้วย ICM, เราไม่อยาก flip ทั้ง stack ด้วย underpair)
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> board แห้งกว่า (J-9-2 rainbow) → bet ⅓ ชัดขึ้นอีก. เราถือ TT ไม่มี T♠ → เหมือนเดิมแต่ระวัง flush runout มากขึ้น`
},
{
  id:'h3c', cat:'postflop', step:'3/4', hidden:true,
  stage:'Final Table', stack:'24bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 6 คน · BB คือ chip leader (คนเดียวที่ cover เรา) · pay jump ถัดไปแพงมาก',
  pot:13.5, toCall:5.4,
  board:['Js','9s','2d','8s'], hero:['Ts','Td'], heroLine:'CO',
  stacks:[['CO',24],['BB',40]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'YOU',a:'raise',amt:'2.2'},{pos:'BTN SB',a:'fold'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'},{pos:'YOU',a:'cbet',amt:'1.6'},{pos:'BB',a:'call'}]},
    {name:'Turn', acts:[{pos:'BB',a:'donk',amt:'5.4 (⅔)'}]}
  ],
  q:'Turn 8♠ — spade ใบที่สาม + บอร์ดต่อกัน J-9-8. BB จู่ๆ <b>donk lead ⅔ pot</b>. เรามี TT + T♠ + gutshot สองทาง (Q หรือ 7 = straight) — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'5.4bb'},{k:'raise',label:'Raise/Jam'}],
  best:1, ok:[0],
  nextSpotId:'h3d',
  why:`<b>เฉลย: Call (ขอบๆ — Fold รับได้)</b> — BB donk turn บน scare card = range แข็งจริง (flush ลงแล้ว, two pair, Jx ที่ protect) แต่เรายังมี equity ซ่อนอยู่เยอะ:
  <br>• <b>Q หรือ 7 ใดๆ = straight</b> (Q-J-T-9-8 / J-T-9-8-7) ≈ 8 outs (Q♠/7♠ เปื้อนเล็กน้อย — ทำ 4-flush)
  <br>• T♠ ในมือ = block flush combos บางส่วน + ถ้า spade มาอีกเรามี T-high flush เป็น backup บางสาย
  <br>ราคา 5.4 เข้า ~18.9 ขอ ~29% — equity เราใกล้เคียง (outs + ชนะ bluff บ้าง) → call หนึ่งใบแล้วประเมิน river. <b>ห้าม raise</b>: เผา stack ใส่ range ที่แข็งกว่าเราตอน ICM แพงสุด`,
  deep:`<b>เจาะลึก</b><br>
  <b>• อ่าน donk turn:</b> check-call flop แล้ว lead ⅔ บน spade ที่สาม = มัก flush made / two pair / Jx+draw ที่ไม่อยากให้เช็คผ่าน. bluff มีบ้าง (single spade สูง) แต่น้อยกว่า value
  <br><b>• นับ outs ละเอียด:</b> Q×4 + 7×4 = 8 ใบทำ straight. แต่ Q♠/7♠ ทำให้บอร์ด 4 spades (ใครถือ spade สูงกว่า T แซง) → ~6 clean + 2 dirty ≈ 15-18% ต่อใบ + implied เมื่อตี
  <br><b>• ทำไมไม่ jam:</b> semibluff jam ทำงานเมื่อ fold equity สูง — แต่ range donk นี้ไม่ fold (flush/two pair call หมด). jam = isolate เจอแต่มือที่บีตเรา ตอน bust แพงที่สุด
  <br><b>• ICM:</b> ที่ FT การ call หนึ่งใบด้วยราคาพอดี ≠ commit. เก็บสิทธิ์ fold river ไว้ — นี่คือเหตุผลที่ fold เฉยๆ ก็ยังรับได้ (ok)`
},
{
  id:'h3d', cat:'postflop', step:'4/4', hidden:true,
  stage:'Final Table', stack:'24bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 6 คน · BB คือ chip leader (คนเดียวที่ cover เรา) · pay jump ถัดไปแพงมาก',
  pot:33.7, toCall:14.8,
  board:['Js','9s','2d','8s','2c'], hero:['Ts','Td'], heroLine:'CO',
  stacks:[['CO',24],['BB',40]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'YOU',a:'raise',amt:'2.2'},{pos:'BTN SB',a:'fold'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'},{pos:'YOU',a:'cbet',amt:'1.6'},{pos:'BB',a:'call'}]},
    {name:'Turn', acts:[{pos:'BB',a:'donk',amt:'5.4'},{pos:'YOU',a:'call'}]},
    {name:'River', acts:[{pos:'BB',a:'shove',amt:'14.8'}]}
  ],
  q:'River 2♣ pair บอร์ด (J♠9♠2♦8♠2♣). เราตี <b>two pair (TT + 22)</b>... BB jam ทั้งกองที่เหลือของเรา (14.8bb) — Final Table. call หรือ fold?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call all-in'}],
  best:0,
  why:`<b>เฉลย: Fold (อย่าให้ "two pair" หลอก)</b> — มือเราฟังดูดีขึ้น (TT+22) แต่บอร์ด pair 2 คือ <b>หายนะเงียบ</b>: ตอนนี้ <span class="k">Jx ทุกตัว = J&2 ซึ่งแซง T&2 ของเรา</span> — มือ Jx ธรรมดาที่เมื่อก่อนเราอยากเจอ กลายเป็นมือที่บีตเราหมด (102 combos!)
  <br><br>ที่บีตเราอีก: <b>flush ทุกตัว</b> (36 combos — T♠ ของเรา block ได้นิดเดียว), 2x trips, full houses, QT/T7 straight ที่ลงตั้งแต่ turn. รวมแล้ว <b>~278 combos บีตเรา</b> ในขณะที่เราชนะแค่ 9x/8x/bluff เปล่า
  <br><br>กับดักคือ "T♠ blocker + two pair + ราคา 30%" ล่อให้ call — แต่ jam range ของ chip leader ที่ donk turn แล้ว jam river บนบอร์ดนี้คือ value ล้วนๆ. ICM ซ้ำดาบสอง: bust อันดับ 6 ทั้งที่จ่ายเงินห่างกันมาก
  <br><br>🏁 <b>จบมือ — เรา fold:</b> เสียไป 9.2bb ใน hand นี้ แต่<b>รักษา 14.8bb (61% ของ stack) ไว้ได้</b> — ที่ Final Table การแพ้ให้น้อยคือทักษะที่เงินที่สุด`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• ตัวเลขจริง (brute-force ทุก combo):</b> จาก 990 combos — บีตเรา 278: flush ×36, Jx (=J&2) ×102, 2x trips ×60+, full house (88/99/JJ/8x2/9x2/Jx2) ×33, QT/T7 straight ×16, overpairs (JJ-AA เป็น two pair สูงกว่า) ×18, quad 2 ×1. เราชนะ 711 แต่ส่วนใหญ่ไม่อยู่ใน jam range
  <br><b>• ทำไมบอร์ด pair ฆ่ามือเรา:</b> ก่อน river 2: Jx = one pair J (เราแพ้อยู่แล้ว)... จริงๆ TT ไม่เคยนำ Jx — ประเด็นคือ 2 ไม่ช่วยอะไรเราเลย แต่ทำให้มือเรา "ดูดีขึ้น" หลอกๆ. มือที่ donk turn (flush/two pair/Jx) ไม่มีตัวไหนกลัว river 2
  <br><b>• Math:</b> toCall 14.8 เข้า pot 48.5 ขอ ~30.5%. vs jam range จริง (flush, Jx, boats + bluff น้อย) equity เรา ~10-15% → fold ห่างชัด แม้ไม่มี ICM
  <br><b>• ICM คูณความชัด:</b> เหลือ 6 คนที่ FT, BB cover เรา — risk premium ทำให้ threshold ขึ้นไป ~35-40%. นี่คือ fold ที่ง่ายกว่าที่หน้าตาบอก
  <br><b>• Hand summary:</b> เปิด TT ถูก, c-bet ⅓ ถูก, call turn ขอบๆ ตามราคา, fold river ถูก. เริ่ม 24bb → จบ 14.8bb. บทเรียน: <b>เล่นถูกทุก street ก็ยังเสียชิปได้ — หน้าที่เราคือเสียให้น้อยที่สุด</b>`
},

// Hand 4 — Early deep 100bb: 3bet-bluff A5s แล้ว triple-barrel จน jam river บน runout ที่ draw พลาดหมด (ชนะโดยไม่โชว์มือ)
{
  id:'h4a', cat:'preflop', step:'1/4',
  stage:'Early', stack:'100bb',
  pot:3.8, toCall:1.3,
  hero:['As','5s'], heroLine:'BB • 100bb',
  stacks:[['CO',105],['BB',100]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'},{pos:'BTN SB',a:'fold'}]}],
  q:'A5s ใน BB เจอ CO เปิด 2.3bb — ลึก 100bb (Early stage). เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'1.3bb'},{k:'raise',label:'3-Bet',sub:'11bb'}],
  best:2, ok:[1],
  nextSpotId:'h4b',
  why:`<b>เฉลย: 3-Bet (bluff ที่มีโครงสร้างดีที่สุดในเกม)</b> — A5s คือ 3bet-bluff คลาสสิกจาก blinds: <b>A blocker</b> ตัด AA/AK combo ของ CO ลงเยอะ, มี nut-flush + wheel potential เมื่อโดน call, และ fold out มือที่ dominate เรา (A9-AJ) ได้ทันที
  <br>Call ก็เล่นได้ (ราคาดีมาก) แต่ลึก 100bb การมี initiative + เล่าเรื่อง 3 streets ได้ มีค่ากว่า — มือนี้จะพิสูจน์ตัวเองใน step ถัดไป`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไม A5s คือ bluff combo อันดับหนึ่ง:</b> (1) A blocker ลด combo มือ premium ที่ 4bet เรา (2) เมื่อโดน call เรามี nut flush draw / wheel เป็น equity จริง (3) มันอยู่ต่ำพอที่จะไม่เสียดายเมื่อต้อง fold ต่อ 4bet — ต่างจาก AJ ที่ "ดีเกินกว่าจะทิ้ง แย่เกินกว่าจะสู้"
  <br><b>• Balance:</b> 3bet range BB ของเรา = value (QQ+, AK, AQs) + bluffs (A2s-A5s, K9s, 76s). ถ้าเรา 3bet แต่ value คู่ต่อสู้ exploit ได้ง่าย
  <br><b>• Deep 100bb:</b> ยิ่งลึก position ยิ่งสำคัญ — เรา OOP ตลอดมือ การยึด initiative ลดโทษของตำแหน่ง
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> CO เป็น nit เปิดแคบ → flat/fold แทน. ตื้น 25bb → A5s เป็น jam/fold candidate ไม่ใช่ 3bet เล็ก`
},
{
  id:'h4b', cat:'postflop', step:'2/4', hidden:true,
  stage:'Early', stack:'100bb',
  pot:22.5, toCall:0,
  board:['Qs','7s','2d'], hero:['As','5s'], heroLine:'BB',
  stacks:[['CO',105],['BB',100]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'},{pos:'BTN SB',a:'fold'},{pos:'YOU',a:'3bet',amt:'11'},{pos:'CO',a:'call'}]},
    {name:'Flop', note:'ตาคุณ — OOP เล่นก่อน', acts:[]}
  ],
  q:'CO call 3bet. Flop Q♠7♠2♦ — เราได้ <b>nut flush draw</b> (A♠5♠). OOP เล่นก่อน — เปิดด้วยอะไร?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'C-bet',sub:'⅓ (7.5)'},{k:'raise',label:'C-bet',sub:'⅔ (15)'}],
  best:1, ok:[2],
  nextSpotId:'h4c',
  why:`<b>เฉลย: C-bet ⅓</b> — board Q♠7♠2♦ เข้า range 3bettor (เรามี QQ/AQ/KK+ เขามีน้อยกว่า) → c-bet ได้บ่อยมากในราคาถูก
  <br>A♠5♠ คือ semibluff สมบูรณ์แบบ: <b>nut flush draw 9 outs</b> + A overcard ~3 outs ≈ 45% vs มือ Qx — เบทตอนนี้ได้ fold equity ทันที + สร้าง pot ไว้สำหรับ barrel ใน street ถัดไป
  <br>⅔ ก็ใช้ได้ (polarize เร็วขึ้น) แต่ ⅓ ทำให้เรา c-bet ทั้ง range ได้ถูกกว่าและ CO defend ยากพอๆ กัน`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range advantage:</b> 3bet pot บน Q-high two-tone — เรามี overpairs + AQ ครบ, CO cap (QQ+/AK ส่วนใหญ่ 4bet ไปแล้ว). เบทเล็กทั้ง range = strategy ที่ defend ยากที่สุด
  <br><b>• Equity จริงของ A5s:</b> 9 flush outs + 3 aces (เมื่อ A ดีสุด) ≈ 12 outs. vs QJ เรามี ~48%, vs TT ~46% — เราแทบไม่เคย "bluff เปล่า"
  <br><b>• แผนทั้งมือ (สำคัญ):</b> เบท flop → barrel turn เกือบทุกใบ (เรามี nut draw + initiative) → river ตัดสินใจตาม runout. การคิดล่วงหน้าแบบนี้คือสิ่งที่แยกมือสมัครเล่นกับมือจริง
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> board เข้า caller (เช่น 8-7-6 two-tone) → check บ่อยขึ้น. CO เป็น station → ลด bluff c-bet, เน้น value`
},
{
  id:'h4c', cat:'postflop', step:'3/4', hidden:true,
  stage:'Early', stack:'100bb',
  pot:37.5, toCall:0,
  board:['Qs','7s','2d','6h'], hero:['As','5s'], heroLine:'BB',
  stacks:[['CO',105],['BB',100]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'},{pos:'BTN SB',a:'fold'},{pos:'YOU',a:'3bet',amt:'11'},{pos:'CO',a:'call'}]},
    {name:'Flop', acts:[{pos:'YOU',a:'cbet',amt:'7.5'},{pos:'CO',a:'call'}]},
    {name:'Turn', note:'ตาคุณ — OOP เล่นก่อน', acts:[]}
  ],
  q:'CO call flop. Turn 6♥ (Q♠7♠2♦-6♥). เรายังถือ nut flush draw + A overcard. OOP เล่นก่อน — barrel ต่อไหม?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'Bet',sub:'⅓ (12.5)'},{k:'raise',label:'Bet',sub:'⅔ (25)'}],
  best:2, ok:[1],
  nextSpotId:'h4d',
  why:`<b>เฉลย: Bet ⅔ (barrel ใหญ่)</b> — turn 6♥ เป็น brick ที่ไม่ช่วย CO calling range เลย แผนของเราเดินต่อ:
  <br>(1) เรายังมี <b>~12 outs</b> เมื่อโดน call — barrel นี้แทบไม่ใช่ความเสี่ยงล้วน
  <br>(2) ขนาด ⅔ เริ่ม <span class="k">polarize</span>: บอกเล่าว่าเราคือ QQ+/AQ/flush draw ใหญ่ — กดดัน Qx กลางๆ, JJ/TT, 88-99 ของ CO อย่างหนัก
  <br>(3) <b>setup river jam</b>: หลังเบทนี้ pot จะ ~87 และเราเหลือ ~56 — ขนาด jam พอดีสำหรับ street สุดท้าย ไม่ว่า draw จะมาหรือไม่
  <br>Check = ปล่อยแผนตาย, ให้ CO เช็คกลับแล้ว realize equity ฟรี`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไมไม่ check-fold/check-call:</b> มือเรามี equity สูงเกินกว่าจะเล่น passive — เบทคือการรวม fold equity + draw equity = EV สูงสุด. check-call ทำให้เราต้องเดา river โดยไม่มี initiative
  <br><b>• Sizing tell ของตัวเอง:</b> ⅓ บอกว่า "เบททั้ง range" / ⅔-1x บอกว่า "polar — nuts หรือ draw". เราอยากให้ CO เผชิญ ⅔ ด้วยมือ bluff-catcher เพราะ river เราจะ jam ใส่อีก
  <br><b>• โดน raise ทำไง:</b> โดน jam → call ตามราคา (เรามี ~40%+ vs range ที่ jam). โดน raise เล็ก → call ดู river
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> turn เป็น A (A♥) → เบทเช่นกันแต่เป็น thin value+protection. turn เป็น spade → เราได้ nut flush, เบท value เต็มที่. turn K/Q → ⅓ หรือ check บ้าง`
},
{
  id:'h4d', cat:'postflop', step:'4/4', hidden:true,
  stage:'Early', stack:'100bb',
  pot:87.5, toCall:0,
  board:['Qs','7s','2d','6h','4d'], hero:['As','5s'], heroLine:'BB',
  stacks:[['CO',105],['BB',100]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'},{pos:'BTN SB',a:'fold'},{pos:'YOU',a:'3bet',amt:'11'},{pos:'CO',a:'call'}]},
    {name:'Flop', acts:[{pos:'YOU',a:'cbet',amt:'7.5'},{pos:'CO',a:'call'}]},
    {name:'Turn', acts:[{pos:'YOU',a:'bet',amt:'25'},{pos:'CO',a:'call'}]},
    {name:'River', note:'ตาคุณ — OOP เล่นก่อน · เหลือ 56.5bb', acts:[]}
  ],
  q:'River 4♦ — <b>ทุก draw พลาดหมด</b> รวมถึงของเรา (เหลือ ace-high เปล่าๆ). pot 87.5, เราเหลือ 56.5bb. เช็คยอมแพ้ หรือ jam ปิดเรื่องที่เล่ามา 3 streets?',
  opts:[{k:'call',label:'Check',sub:'ยอมแพ้'},{k:'shove',label:'All-in',sub:'56.5bb'}],
  best:1,
  reveal:{pos:'CO', cards:['Ac','Qc'], note:'fold top pair แล้วหงายไพ่<br>— bluff เราสำเร็จ'},
  why:`<b>เฉลย: All-in (บลัฟที่ "ต้องทำ" ไม่ใช่แค่ "ทำได้")</b> — ความจริงที่โหดที่สุดก่อน: ace-high ของเรา <b>แพ้ 681 จาก 990 combos ที่ showdown</b> (ทุก pair ทุก Qx แม้แต่ K-high บางตัว... ที่จริง AK ก็บีตเรา) — การ check คือการยอมเสีย pot 87.5 เกือบแน่นอน <span class="k">เราไม่มีอะไรจะเสียไปมากกว่านี้แล้ว</span>
  <br><br>ในขณะที่เรื่องที่เราเล่ามา 3 streets ตรงเป๊ะ: 3bet pre → c-bet → barrel ⅔ → jam river = <b>QQ+/AQ/sets ชัดๆ</b>. CO ที่ call มาสองทาง (Qx, JJ/TT, 88-99, busted spade draws) เจอ jam 56.5 เข้า 87.5 ต้องจ่าย ~28% ของ 200bb pot ด้วย bluff-catcher ใบเดียว — เขา fold มือเกือบทั้งหมด รวมถึง <b>AQ/KQ ที่บีตเราขาดลอย</b>
  <br><br>และ A♠ ของเราคือ blocker ทอง: ตัด nut flush draw ที่ผ่อนมาแล้ว... ไม่มา (A♠X♠ ที่เขาอาจ hero-call ด้วย) — bluff นี้เลือก combo ถูกต้องที่สุดใน range เรา
  <br><br>🏁 <b>จบมือ:</b> CO คิดนานมาก... <b>fold A♣Q♣ หงายขึ้นมา (top pair top kicker!)</b> — เราเก็บ pot 87.5bb โดยไม่ต้องโชว์ ace-high. นี่คือพลังของการเล่าเรื่องให้จบ`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• ตัวเลขจริง (brute-force):</b> A♠5♠ บน Q♠7♠2♦6♥4♦ = high card. แพ้ 681/990, ชนะแค่ 300 (K-high/worse high), เสมอ 9. การ check หวัง showdown = แพ้ ~70% ของ random — และแพ้ ~100% ของ range ที่ call มาสองทาง
  <br><b>• Math ฝั่งเรา:</b> jam 56.5 เข้า 87.5 → breakeven ถ้า CO fold ≥ ~39%. range เขา (Qx, JJ-88, busted draws) fold ต่อ jam นี้ ~60-75% → +EV ห่าง
  <br><b>• Math ฝั่งเขา:</b> CO ต้อง call 56.5 เพื่อชิง 200.5 (ขอ ~28%) — ฟังดูถูก แต่ vs range "QQ+/AQ/sets + bluff ที่เลือกแล้ว" มือ one-pair มี equity ต่ำกว่านั้น → fold ของเขาไม่ผิดด้วยซ้ำ. นี่คือ spot ที่<b>ทั้งสองฝ่ายเล่นถูกและเราได้เงิน</b>
  <br><b>• ทำไม A♠ สำคัญ:</b> มือ hero-call อันดับหนึ่งของ CO คือ A♠X♠ (nut blocker ฝั่งเขา + เดาว่าเรา missed spades) — เราถือมันเอง = ลด combo hero-call ตรงๆ
  <br><b>• วินัยที่ซ่อนอยู่:</b> bluff นี้ valid เพราะเราวางแผนตั้งแต่ flop (semibluff ที่มี outs ทุก street) ไม่ใช่ตัดสินใจหน้างาน. ถ้า river เป็น spade เรา jam เหมือนกัน — ด้วย nuts. <b>line เดียว สอง outcome = unexploitable</b>
  <br><b>• Hand summary:</b> ลงทุน 43.5bb เก็บ 87.5bb — กำไร +44bb โดยมือที่แพ้ 70% ที่ showdown`
},

// Hand 5 — Cooler: TPTK เล่นถูกทุก street, call river ถูกตามคณิตศาสตร์ — แต่แพ้ set→boat (บทเรียน variance)
{
  id:'h5a', cat:'preflop', step:'1/4',
  stage:'Mid Stage', stack:'50bb',
  pot:1.5, toCall:0,
  hero:['Ah','Kd'], heroLine:'CO • 50bb',
  stacks:[['CO',50],['BTN',48]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP',a:'fold'}]}],
  q:'AKo ที่ CO, 50bb — เปิดยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'raise',label:'Raise',sub:'2.3bb'}],
  best:1,
  nextSpotId:'h5b',
  why:`<b>เฉลย: Raise 2.3bb</b> — มือ top 2% เปิดจากทุกตำแหน่ง ไม่มีอะไรซับซ้อน... ใน step นี้
  <br>มือนี้จะสอนบทเรียนที่แพงที่สุดในโป๊กเกอร์ในอีก 3 steps ข้างหน้า — เล่นให้ถูกแล้วดูว่าเกิดอะไรขึ้น`,
  deep:`<b>เจาะลึก</b><br>
  <b>• AKo ที่ 50bb:</b> เปิดปกติ พร้อม stack off ถ้าโดน 3bet (jam หรือ 4bet ตามสถานการณ์) — AK ไม่ fold pre ที่ความลึกนี้
  <br><b>• ทำไมไม่เปิดใหญ่กว่า:</b> sizing เดียวทั้ง range — ถ้าเปิดใหญ่เฉพาะมือสวยคือ tell ฟรีให้โต๊ะ`
},
{
  id:'h5b', cat:'postflop', step:'2/4', hidden:true,
  stage:'Mid Stage', stack:'50bb',
  pot:6.1, toCall:0,
  board:['Ad','7c','2s'], hero:['Ah','Kd'], heroLine:'CO',
  stacks:[['CO',50],['BTN',48]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'YOU',a:'raise',amt:'2.3'},{pos:'BTN',a:'call'},{pos:'SB BB',a:'fold'}]},
    {name:'Flop', note:'ตาคุณ — OOP เล่นก่อน', acts:[]}
  ],
  q:'BTN call (in position). Flop A♦7♣2♠ rainbow — เราตี <b>top pair top kicker</b>. OOP เล่นก่อน — เปิดด้วยอะไร?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'Bet',sub:'⅓ (2)'},{k:'raise',label:'Bet',sub:'⅔ (4)'}],
  best:1, ok:[0],
  nextSpotId:'h5c',
  why:`<b>เฉลย: Bet ⅓</b> — A72 rainbow แห้งสนิท + เราคือ PFR ที่มี range advantage มหาศาล (Ax ทุกตัวเป็นของเรา) → เบทเล็กทั้ง range คือ standard
  <br>AK ต้องการ <b>3 streets of value</b> จาก Ax ที่อ่อนกว่า (AQ-AT จะ call ทั้งสาย), 77-? ไม่มี... pairs กลาง (88-JJ) ที่ไม่ยอมตายง่าย. เริ่มสร้าง pot เดี๋ยวนี้ด้วยราคาที่ทุกมือ call ได้
  <br>Check ก็ mix ได้ (board แห้งมาก ไม่มี draw ให้ protect) แต่เสีย street of value ไปฟรีๆ`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไม ⅓ พอ:</b> board ไม่มี draw — ไม่ต้อง charge ใคร. เบทเล็กให้ 88-JJ/7x/float ทุกตัวอยู่ต่อแบบผิดๆ ได้. เบทใหญ่ fold out ทุกอย่างที่เราอยากเก็บไว้
  <br><b>• แผน 3 streets:</b> flop ⅓ → turn ⅔ → river ตามสถานการณ์. เป้า: เก็บ value จาก AQ/AJ/AT + pairs ที่ลังเล
  <br><b>• BTN range ที่ call flop:</b> Ax อ่อนกว่า, 77/22 (set!), 88-JJ, 7x suited, floats — จำไว้ว่า <b>set อยู่ในนั้นเงียบๆ เสมอ</b> แต่เราไม่มีทางรู้จนกว่าจะสายเกินไป
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> multiway → เบทตรงไปตรงมาขึ้น (value หนัก). board two-tone → ⅓→½`
},
{
  id:'h5c', cat:'postflop', step:'3/4', hidden:true,
  stage:'Mid Stage', stack:'50bb',
  pot:10.1, toCall:0,
  board:['Ad','7c','2s','8d'], hero:['Ah','Kd'], heroLine:'CO',
  stacks:[['CO',50],['BTN',48]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'YOU',a:'raise',amt:'2.3'},{pos:'BTN',a:'call'},{pos:'SB BB',a:'fold'}]},
    {name:'Flop', acts:[{pos:'YOU',a:'cbet',amt:'2'},{pos:'BTN',a:'call'}]},
    {name:'Turn', note:'ตาคุณ — OOP เล่นก่อน', acts:[]}
  ],
  q:'BTN call flop. Turn 8♦ (A♦7♣2♠-8♦) — เปิด flush draw เพชร + straight draws (56/9T). เรายังถือ TPTK — เล่นยังไง?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'Bet',sub:'⅓ (3.4)'},{k:'raise',label:'Bet',sub:'⅔ (6.7)'}],
  best:2, ok:[1],
  nextSpotId:'h5d',
  why:`<b>เฉลย: Bet ⅔</b> — turn 8♦ เปลี่ยนเกม: ตอนนี้มี <b>flush draw (♦) + 56/9T straight draws</b> โผล่มา — TPTK ต้องเปลี่ยนจาก "รีดเงียบๆ" เป็น <span class="k">value + charge draws</span>
  <br>⅔ ทำให้ draw ทุกตัวจ่ายแพงเกินราคา (flush draw ขอ ~19% ต่อใบ แต่ต้องจ่าย 25%+) และยังรีด value จาก Ax/88-JJ ต่อเนื่อง. K♦ ในมือเราเป็นโบนัส: block K♦X♦ flush combos
  <br>⅓ เบาไป (ให้ราคาถูกกับ draw), check แย่สุด (ฟรีการ์ดให้ 14+ outs ของฝั่งเขา)`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไมต้องใหญ่ขึ้นจาก flop:</b> board เปลี่ยนจาก static → dynamic. หลักการ: board แห้ง = เบทเล็กได้เรื่อยๆ, board มี draw = เบทใหญ่ทันทีก่อน equity เขาถึงบ้าน
  <br><b>• BTN range ตอนนี้:</b> Ax (call ต่อ), 88 (เพิ่ง turn set!), 77/22 (set เดิม), diamonds ใหม่, 56/9T. ส่วนที่เราชนะยังเยอะกว่า — แต่ระวังสัญญาณ raise
  <br><b>• แผน river:</b> ♦/9/6/5 ลง = ชะลอ (check-evaluate). brick = bet value ต่อหรือ check-call ตามขนาด pot
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> โดน raise turn → TPTK กลายเป็น bluff-catcher, call ดู river แล้วประเมิน. ถ้าเราถือ AK ไม่มี K♦ → เหมือนเดิมแต่ความสบายใจน้อยลงนิดเดียว`
},
{
  id:'h5d', cat:'postflop', step:'4/4', hidden:true,
  stage:'Mid Stage', stack:'50bb',
  pot:35.5, toCall:12,
  board:['Ad','7c','2s','8d','2h'], hero:['Ah','Kd'], heroLine:'CO',
  stacks:[['CO',50],['BTN',48]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'YOU',a:'raise',amt:'2.3'},{pos:'BTN',a:'call'},{pos:'SB BB',a:'fold'}]},
    {name:'Flop', acts:[{pos:'YOU',a:'cbet',amt:'2'},{pos:'BTN',a:'call'}]},
    {name:'Turn', acts:[{pos:'YOU',a:'bet',amt:'6.7'},{pos:'BTN',a:'call'}]},
    {name:'River', acts:[{pos:'YOU',a:'check'},{pos:'BTN',a:'bet',amt:'12 (½ pot)'}]}
  ],
  q:'River 2♥ pair บอร์ด — draws พลาดหมด (♦ ไม่มา, 56/9T ไม่มา). เราเช็คไป BTN เบท ½ pot. TPTK (ตอนนี้ Aces up: AA22-K) — call หรือ fold?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'12bb'}],
  best:1,
  reveal:{pos:'BTN', cards:['7s','7h'], note:'เปิด full house (777-22)<br>— cooler, call เราถูกแล้ว'},
  why:`<b>เฉลย: Call (ถูกต้อง 100%)... แล้วดูเฉลยของโต๊ะ</b> — มาดูเหตุผลก่อน:
  <br>• river 2♥ คือ brick สมบูรณ์: <b>ทุก draw ที่ไล่เรามา 2 streets พลาดหมด</b> (เพชร, 56, 9T) — มือพวกนั้นเหลือทางเดียวคือ bluff
  <br>• เราเช็ค = เชิญ bluff. BTN เบท ½ pot ขอเราชนะแค่ ~25% — เราบีต <b>busted draws ทั้งหมด + Ax ที่อ่อนกว่าที่เบท thin</b>
  <br>• จาก 990 combos เราแพ้แค่ <b>106</b> (sets ที่กลาย boat, 2x, A7/A8) — vs range เบทที่มี bluff ปนเราเกิน 25% สบายๆ → <b>call ชัดเจน</b>
  <br><br>🏁 <b>จบมือ — Showdown:</b> BTN หงาย <b>7♠7♥ = full house (777-22)</b>... เขา flop set แล้ว slowplay เงียบๆ สองทาง — เราเสีย 23bb ใน hand นี้
  <br><br><span class="k">แต่ฟังให้ชัด: เราไม่ได้เล่นผิดแม้แต่ street เดียว</span> — และนั่นคือบทเรียนของมือนี้`,
  deep:`<b>เจาะลึก / บทเรียนที่แพงที่สุดในโป๊กเกอร์</b><br>
  <b>• ตัวเลขจริง (brute-force):</b> AhKd บน A♦7♣2♠8♦2♥ = two pair (Aces&2s, K kicker). ชนะ 878/990, แพ้แค่ 106: 2x trips ×70, 77/88 (boat) ×6, A7/A8 ×12, A2/22 ×11, AA ×1. มือที่บีตเราเกือบทั้งหมดคือมือที่ <b>slowplay มาแต่ต้น — มองไม่เห็นล่วงหน้า</b>
  <br><b>• ทำไม call ถูกแม้แพ้:</b> ราคา 12 เข้า 47.5 = 25%. BTN bet range ที่ river นี้: busted diamonds (เยอะ), busted 56/9T, Ax thin value (เราบีต), sets/2x (เราแพ้). bluffs + worse value รวมกัน > 25% ชัดเจน. fold ตรงนี้ = โดน exploit ด้วย bluff ทุกครั้งที่ draw พลาด
  <br><b>• เล่นต่างจากนี้ได้ไหม:</b> ย้อนดูทุก street — เปิด AK ✓, c-bet ⅓ บอร์ดแห้ง ✓, charge draws ⅔ ที่ turn ✓, check-call river ✓. ทางเดียวที่ "ไม่เสีย" คือ fold TPTK ใส่ ½ pot bet ซึ่งผิดทางคณิตศาสตร์ระยะยาว
  <br><b>• Variance ≠ ความผิดพลาด:</b> ถ้าเจอ spot นี้ 100 ครั้ง: ~75 ครั้งเราเก็บ pot (เขา bluff/มืออ่อนกว่า), ~25 ครั้งเจอ slowplay. EV ของ call = บวกหนัก. คนที่ผลลัพธ์มือเดียวเปลี่ยนวิธีเล่นได้ คือคนที่โต๊ะรอเชือด
  <br><b>• Hand summary:</b> เริ่ม 50bb → จบ 27bb. เสีย 23bb แบบ "ถูกต้องทุกการตัดสินใจ" — จดมือแบบนี้ไว้แล้วเดินต่อ อย่าเอา tilt ไปมือถัดไป`
},

// Hand 6 — Bubble: value bet ไม่หยุดแม้ bubble, BB fold turn (ชนะโดยไม่เห็น river)
{
  id:'h6a', cat:'preflop', step:'1/3',
  stage:'Bubble', stack:'22bb', icm:true,
  icmState:'🫧 <b>BUBBLE</b> · อีก 1 คน bust = เข้าเงิน · BB คือ chip leader (50bb)',
  pot:1.5, toCall:0,
  hero:['Kh','Qh'], heroLine:'BTN • 22bb',
  stacks:[['BTN',22],['BB',50]],
  streets:[{name:'Preflop', acts:[{pos:'UTG…CO',a:'fold'}]}],
  q:'KQs บน BTN, 22bb, ช่วง Bubble (BB คือ chip leader) — เปิดยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'raise',label:'Raise',sub:'2.2bb'},{k:'shove',label:'All-in',sub:'22bb'}],
  best:1,
  nextSpotId:'h6b',
  why:`<b>เฉลย: Raise 2.2</b> — KQs บน BTN คือ top ~10% เปิดชัดแม้ bubble. jam 22bb = เผา value (มือที่ call ล้วนบีตเรา), fold = ยอมให้ ICM ทำให้เราเล่นผิด
  <br>bubble ไม่ได้แปลว่า "หยุดเล่น" — แปลว่า "เลือกเล่นแล้วเล่นให้คม"`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไมไม่ jam:</b> 22bb เปิดปกติได้ — jam fold out ทุกมือที่แย่กว่า + โดน call จากแค่มือที่บีต
  <br><b>• vs chip leader ใน BB:</b> เขา defend กว้าง/กดดันเราได้ แต่ KQs แข็งพอรับมือ — เล่น postflop ด้วย discipline
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> ตื้นกว่า 15bb → open-jam. มี short stack อื่นกำลัง blind out → fold มือ borderline ได้ (KQs ไม่ใช่ borderline)`
},
{
  id:'h6b', cat:'postflop', step:'2/3', hidden:true,
  stage:'Bubble', stack:'22bb', icm:true,
  icmState:'🫧 <b>BUBBLE</b> · อีก 1 คน bust = เข้าเงิน · BB คือ chip leader (50bb)',
  pot:4.9, toCall:0,
  board:['Ks','8d','3c'], hero:['Kh','Qh'], heroLine:'BTN',
  stacks:[['BTN',22],['BB',50]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG…CO',a:'fold'},{pos:'YOU',a:'raise',amt:'2.2'},{pos:'SB',a:'fold'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'}]}
  ],
  q:'BB call. Flop K♠8♦3♣ แห้งสนิท — เราตี top pair ดี. BB เช็คมา — เล่นยังไง?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'Bet',sub:'⅓ (1.6)'},{k:'raise',label:'Bet',sub:'⅔ (3.3)'}],
  best:1, ok:[2],
  nextSpotId:'h6c',
  why:`<b>เฉลย: Bet ⅓</b> — K83 rainbow คือ board ของ PFR เต็มๆ. เบทเล็กรีด value จาก 8x/pairs/floats + deny overcards ราคาถูก
  <br>bubble ทำให้เขา fold ง่ายขึ้น = เบทเล็กยิ่งทำกำไร — อย่าเช็คมือ value เพราะ "กลัว"`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range bet:</b> board แห้ง + range advantage → เบท ⅓ ได้ทั้ง range. KQ คือ value แท้ (Kx อ่อนกว่า/8x จ่าย)
  <br><b>• ทำไมไม่ ⅔:</b> ไม่มี draw ให้ charge — size ใหญ่แค่ไล่มือที่เราอยากเก็บ
  <br><b>• แผน:</b> barrel turn ส่วนใหญ่, ระวังเฉพาะ runout A หรือโดน check-raise`
},
{
  id:'h6c', cat:'postflop', step:'3/3', hidden:true,
  stage:'Bubble', stack:'22bb', icm:true,
  icmState:'🫧 <b>BUBBLE</b> · อีก 1 คน bust = เข้าเงิน · BB คือ chip leader (50bb)',
  pot:8.1, toCall:0,
  board:['Ks','8d','3c','2h'], hero:['Kh','Qh'], heroLine:'BTN',
  stacks:[['BTN',22],['BB',50]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG…CO',a:'fold'},{pos:'YOU',a:'raise',amt:'2.2'},{pos:'SB',a:'fold'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'},{pos:'YOU',a:'cbet',amt:'1.6'},{pos:'BB',a:'call'}]},
    {name:'Turn', acts:[{pos:'BB',a:'check'}]}
  ],
  q:'BB call แล้วเช็ค turn 2♥ (brick). barrel ต่อหรือพอ?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'Bet',sub:'⅔ (5.4)'}],
  best:1, ok:[0],
  why:`<b>เฉลย: Bet ⅔</b> — turn 2♥ ไม่เปลี่ยนอะไร เรายังนำ range เขาห่าง. ใส่ barrel ที่สองเพื่อรีดจาก Kx อ่อน/8x และบีบ float ทั้งหมดให้ตัดสินใจแพง — ช่วง bubble นี่คือเงินฟรี
  <br><br>🏁 <b>จบมือ:</b> BB คิดแป๊บเดียวแล้ว <b>fold</b> (มือประเภท QJ/T9/A-high float) — เราเก็บ pot 8.1bb โดยไม่ต้องเห็น river
  <br>ชนะเล็กๆ แบบนี้ซ้ำๆ คือวิธีที่ stack โตช่วง bubble โดยไม่ต้องเสี่ยง showdown`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• ทำไม barrel:</b> BB call flop ด้วย 8x/pairs เล็ก/floats เพียบ — มือพวกนี้ทนได้แค่ 1 เบท. เบทที่สอง = จุดที่ range เขาพับมากสุด
  <br><b>• ICM ทำงานให้เรา:</b> เขาเป็น chip leader ก็จริง แต่มือกลางๆ ของเขาไม่อยากเสี่ยงเจอเบทที่สาม — bubble กดทุกคนที่ไม่มีมือ
  <br><b>• ถ้าโดน check-raise:</b> ตอนนั้นค่อยถอย (มือเขา = 2x?? ไม่ — slowplay Kx ใหญ่/sets). KQ จ่ายต่อไม่ไหวที่ 22bb
  <br><b>• Hand summary:</b> เปิด → cbet ⅓ → barrel ⅔ → เก็บ 8.1bb. การเล่น value ตรงไปตรงมาคือ exploit ที่ดีที่สุดของ bubble`
},

// Hand 7 — FT: เปิดแล้วโดน rejam — open ≠ commit
{
  id:'h7a', cat:'preflop', step:'1/2',
  stage:'Final Table', stack:'18bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 5 คน · pay jump ใหญ่ · BB (35bb) cover เรา',
  pot:1.5, toCall:0,
  hero:['Ad','Jd'], heroLine:'SB • 18bb',
  stacks:[['SB',18],['BB',35]],
  streets:[{name:'Preflop', acts:[{pos:'UTG…BTN',a:'fold'}]}],
  q:'AJs ใน SB, 18bb, Final Table เหลือ 5 — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'raise',label:'Raise',sub:'2.5bb'},{k:'shove',label:'All-in',sub:'18bb'}],
  best:1, ok:[2],
  nextSpotId:'h7b',
  why:`<b>เฉลย: Raise 2.5 (jam รับได้)</b> — AJs SB vs BB แข็งเกิน fold ชัดเจน. ที่ 18bb เปิดเล็กดีกว่า jam เล็กน้อย: เก็บ option เล่น postflop + ไม่เสี่ยง 18bb กับมือที่ BB call jam ได้ (ซึ่ง dominate เราหลายตัว)
  <br>แต่ระวัง — การเปิดไม่ได้แปลว่าต้องสู้ทุกการตอบโต้ ดู step ถัดไป`,
  deep:`<b>เจาะลึก</b><br>
  <b>• SB vs BB:</b> heads-up situation — เปิดกว้างได้มาก (~40-50%) AJs คือส่วนบนของ range
  <br><b>• raise vs jam ที่ 18bb:</b> jam = fold equity สูงสุดแต่เสี่ยงเต็ม; raise = ยืดหยุ่น แต่ต้องมีแผนรับ 3bet/jam กลับ
  <br><b>• แผนที่ต้องคิดก่อนเปิด:</b> "ถ้าโดน rejam จะทำไง?" — ถ้าไม่มีคำตอบ อย่าเพิ่งเปิด`
},
{
  id:'h7b', cat:'preflop', step:'2/2', hidden:true,
  stage:'Final Table', stack:'18bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 5 คน · pay jump ใหญ่ · BB (35bb) cover เรา',
  pot:20.5, toCall:15.5,
  hero:['Ad','Jd'], heroLine:'SB • 18bb',
  stacks:[['SB',18],['BB',35]],
  streets:[{name:'Preflop', acts:[{pos:'UTG…BTN',a:'fold'},{pos:'YOU',a:'raise',amt:'2.5'},{pos:'BB',a:'shove',amt:'18'}]}],
  q:'BB (cover เรา) jam กลับทั้งกอง — AJs ต้องจ่ายอีก 15.5 เข้า pot 20.5. call หรือ fold?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call all-in'}],
  best:0, ok:[1],
  why:`<b>เฉลย: Fold (ICM ตัดสิน)</b> — ตัวเลขดูน่า call: ขอ ~40% equity. แต่ BB jam กลับใส่ SB open ที่ FT ไม่ใช่ random — range เขาคือ 66+/AT+/KQ ซึ่ง AJs มีแค่ ~40-43% <b>พอดีเส้น breakeven แบบ chipEV</b>
  <br><br>แล้ว ICM ก็เข้ามา: เขา cover เรา — แพ้ = bust อันดับ 5 ทิ้ง pay jumps ทั้งหมด. risk premium ที่ FT ดัน threshold เกิน 45% → AJs ไม่ถึง
  <br><br>🏁 <b>จบมือ — fold:</b> เสีย 2.5bb. การเปิดถูกต้อง การ fold ก็ถูกต้อง — <b>สองอย่างนี้ไม่ขัดกัน</b>`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• Math:</b> toCall 15.5 เข้า 36 → ขอ ~43%. AJs vs (66+, AT+, KQs) ≈ 41% — ลบอยู่แล้วก่อน ICM. ใส่ risk premium FT → fold ชัด
  <br><b>• ทำไมเปิดไม่ผิด:</b> ถ้า BB ไม่ jam เราชนะ pot เล็กบ่อยมาก / เห็น flop ได้. EV รวมของ "open-fold" > "fold ตั้งแต่แรก" และ > "jam ตั้งแต่แรก" vs คนที่ call กว้าง
  <br><b>• กับดักทางจิตวิทยา:</b> "ลงไปแล้ว 2.5 ต้องตาม" = sunk cost. ชิปที่ลงไปแล้วไม่ใช่ของเรา
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> BB jam กว้าง (maniac) → call. เราถือ AQs+ → call. ไม่มี ICM (cash game) → call close`
},

// Hand 8 — เทิร์น nut straight: เก็บเงินจาก top set ให้ครบ
{
  id:'h8a', cat:'preflop', step:'1/3',
  stage:'Mid Stage', stack:'60bb',
  pot:1.5, toCall:0,
  hero:['Ts','9s'], heroLine:'CO • 60bb',
  stacks:[['CO',60],['BTN',55]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP',a:'fold'}]}],
  q:'T9s ที่ CO, 60bb deep — เปิดไหม?',
  opts:[{k:'fold',label:'Fold'},{k:'raise',label:'Raise',sub:'2.3bb'}],
  best:1,
  nextSpotId:'h8b',
  why:`<b>เฉลย: Raise</b> — T9s คือมือเปิดมาตรฐานของ CO: playability สูงสุดตระกูล suited connector, ตี straight/flush/two pair ได้หลายทาง และ board ไหนที่เราตีมักเป็น board ที่ "ไม่มีใครเชื่อ"
  <br>ลึก 60bb ยิ่งดี — implied odds เต็มๆ`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไม T9s ดีกว่ามือ offsuit สูงๆ:</b> เล่นหลังฟลอปง่าย (draw ชัด ตัดสินใจง่าย) ต่างจาก KJo ที่ตี top pair แล้วโดน dominate
  <br><b>• CO opening range:</b> ~25-28% — T9s อยู่ในนั้นสบาย`
},
{
  id:'h8b', cat:'postflop', step:'2/3', hidden:true,
  stage:'Mid Stage', stack:'60bb',
  pot:6.1, toCall:0,
  board:['8s','7d','2c'], hero:['Ts','9s'], heroLine:'CO',
  stacks:[['CO',60],['BTN',55]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'YOU',a:'raise',amt:'2.3'},{pos:'BTN',a:'call'},{pos:'SB BB',a:'fold'}]},
    {name:'Flop', note:'ตาคุณ — OOP เล่นก่อน', acts:[]}
  ],
  q:'BTN call. Flop 8♠7♦2♣ — เราได้ <b>OESD</b> (J หรือ 6 = straight) + สอง overcards. เล่นยังไง?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'C-bet',sub:'⅓ (2)'},{k:'raise',label:'C-bet',sub:'⅔ (4)'}],
  best:2, ok:[1],
  nextSpotId:'h8c',
  why:`<b>เฉลย: C-bet ⅔ (semibluff polar)</b> — OESD 8 outs + overcards 6 outs (บางส่วนสะอาด) ≈ equity ~40%+ vs มือที่ call. เบทใหญ่กดดัน Ax/KQ ที่ลอยอยู่ + สร้าง pot ไว้ตอนเราตี
  <br>board 872r เข้า BTN range เหมือนกัน (88/77/65) → เบทแบบ polar (ใหญ่ ด้วยมือที่มี equity) ดีกว่า range-bet เล็ก`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไม ⅔ > ⅓ ที่นี่:</b> board นี้ไม่ใช่ range advantage ชัดของเรา → เลือกเบทเฉพาะมือที่ benefit: value + draw ใหญ่. เบทใหญ่ทำงานหนักกว่า
  <br><b>• ถ้าโดน raise:</b> call ตามราคา (draw ใหญ่ไม่ fold ต่อ raise เดียว)
  <br><b>• outs:</b> J×4, 6×4 = straight; T/9 อีก 6 ใบเป็น pair ที่บางทีดีสุด → live มาก`
},
{
  id:'h8c', cat:'postflop', step:'3/3', hidden:true,
  stage:'Mid Stage', stack:'60bb',
  pot:14.1, toCall:0,
  board:['8s','7d','2c','6h'], hero:['Ts','9s'], heroLine:'CO',
  stacks:[['CO',60],['BTN',55]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'YOU',a:'raise',amt:'2.3'},{pos:'BTN',a:'call'},{pos:'SB BB',a:'fold'}]},
    {name:'Flop', acts:[{pos:'YOU',a:'cbet',amt:'4'},{pos:'BTN',a:'call'}]},
    {name:'Turn', note:'ตาคุณ — OOP เล่นก่อน', acts:[]}
  ],
  q:'Turn 6♥ — <b>เราตี nut straight!</b> (T-9-8-7-6) บอร์ดยังไม่มี flush draw. รีดยังไงให้ได้มากสุด?',
  opts:[{k:'call',label:'Check',sub:'trap'},{k:'raise',label:'Bet',sub:'½ (7)'},{k:'raise',label:'Bet',sub:'¾ (10.5)'}],
  best:2, ok:[1],
  reveal:{pos:'BTN', cards:['8h','8d'], note:'เปิด top set<br>— แพ้ nut straight ของเรา'},
  why:`<b>เฉลย: Bet ¾</b> — เราถือ nuts แท้ของ runout นี้ (ไม่มี combo ไหนบีต — มีแค่ T9 เสมอ). คำถามเดียวคือ "รีดยังไงให้มากสุด"
  <br>BTN call flop ⅔ = range เต็มไปด้วย 8x/77/88/overpairs/65/T9 — <b>มือพวกนี้จ่ายเบทใหญ่ได้</b> และ board ไม่มี draw ที่จะมาแซง → ไม่ต้องกลัวอะไรเลย. Trap check เสีย value เปล่าๆ (มือเขาเช็คกลับเยอะ)
  <br><br>🏁 <b>จบมือ:</b> เราเบท 10.5 — BTN <b>check-raise jam!</b> (8♥8♦ top set). เรา snap call. River K♣ ไม่ pair บอร์ด → <b>nut straight ชนะ top set</b> เก็บ pot ~110bb 🔥`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• ยืนยันจาก verifier:</b> บน 8♠7♦2♣6♥K♣ ไม่มี combo ไหนบีต T9 (0 จาก 990) — เสมอแค่ T9 ด้วยกัน 9 combos. การ call jam คือ snap แท้
  <br><b>• ทำไมเบท > trap:</b> มือที่จ่ายเรา (sets, two pair, overpairs) จ่ายเพราะ "เขาคิดว่าเขานำ" — เบทเลยไม่ไล่เขา. trap ได้ผลแค่กับมือ bluff ซึ่งน้อย
  <br><b>• โชคของ line นี้:</b> set ของเขา = เขาช่วยสร้าง pot ให้เราเอง. นี่คือเหตุผลที่ semibluff flop สำคัญ — มันทำให้มือ nuts ของเรามี pot ใหญ่รออยู่
  <br><b>• ระวัง river pair:</b> ถ้า river เป็น 8/7/6/2 ซ้ำ → boat ของ set แซงเรา. การรีดหนักที่ turn (ก่อนใบอันตราย) คือ EV สูงสุด`
},

// Hand 9 — Set → Boat: check-raise, charge flush draw, แล้วรีด nut flush ที่ river
{
  id:'h9a', cat:'preflop', step:'1/4',
  stage:'Mid Stage', stack:'45bb',
  pot:3.9, toCall:1.4,
  hero:['9c','9d'], heroLine:'BB • 45bb',
  stacks:[['BTN',48],['BB',45]],
  streets:[{name:'Preflop', acts:[{pos:'UTG…CO',a:'fold'},{pos:'BTN',a:'raise',amt:'2.4'},{pos:'SB',a:'fold'}]}],
  q:'99 ใน BB เจอ BTN เปิด 2.4 — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'1.4bb'},{k:'raise',label:'3-Bet',sub:'10bb'}],
  best:1, ok:[2],
  nextSpotId:'h9b',
  why:`<b>เฉลย: Call</b> — 99 vs BTN steal: แข็งเกิน fold, แต่ 3bet แล้วโดน 4bet/call ก็อึดอัด (มือเรากลายเป็น "flip หรือเป็นรอง" ใน pot ใหญ่)
  <br>flat ราคา 1.4 = เห็น flop ถูกๆ พร้อม set-mine + เล่น overpair บน board ต่ำ. 3bet เป็น mix ที่ใช้ได้`,
  deep:`<b>เจาะลึก</b><br>
  <b>• 99 ใน BB vs BTN:</b> ทั้ง call และ 3bet เป็น GTO mix — เลือก call เมื่ออยากเล่น pot เล็กกับมือ medium
  <br><b>• Set value:</b> 12% ตี set — ที่ 45bb effective ได้ stack เต็มบ่อยเพราะ BTN range กว้างจ่ายง่าย`
},
{
  id:'h9b', cat:'postflop', step:'2/4', hidden:true,
  stage:'Mid Stage', stack:'45bb',
  pot:7.9, toCall:2.6,
  board:['9s','5h','2h'], hero:['9c','9d'], heroLine:'BB',
  stacks:[['BTN',48],['BB',45]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG…CO',a:'fold'},{pos:'BTN',a:'raise',amt:'2.4'},{pos:'SB',a:'fold'},{pos:'YOU',a:'call'}]},
    {name:'Flop', acts:[{pos:'YOU',a:'check'},{pos:'BTN',a:'cbet',amt:'2.6'}]}
  ],
  q:'Flop 9♠5♥2♥ — <b>TOP SET!</b> (มี flush draw หัวใจบนบอร์ด) BTN c-bet ½ — slowplay หรือ raise?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'slowplay'},{k:'raise',label:'Check-Raise',sub:'8bb'}],
  best:2, ok:[1],
  nextSpotId:'h9c',
  why:`<b>เฉลย: Check-Raise</b> — กฎง่ายๆ: <span class="k">board มี draw = อย่า slowplay set</span>. สองหัวใจบนบอร์ด + connector ต่ำ = turn หลายใบทำให้เราเสีย action หรือเสียมือ
  <br>raise ตอนนี้: รีด value จาก overpairs/9x/draws ที่ยัง "จ่ายไหว" + charge flush draw เต็มราคา. ถ้าเขามี AA/KK เราจะได้ stack ทั้งกองอยู่ดี`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Slowplay ผิดตรงไหน:</b> ปล่อย turn ฟรี → ♥ ลง = action ตาย (เราต้องเล่นระวังเอง), หรือเขา draw ทัน. เสีย EV สองทาง
  <br><b>• ขนาด raise:</b> 3x ของ cbet — ใหญ่พอ charge draw, เล็กพอให้ overpair call
  <br><b>• ถ้าโดน 3bet กลับ:</b> ปาร์ตี้ — jam ได้เลย (มีแค่ 99 เสมอที่... เราถือหมดแล้ว)`
},
{
  id:'h9c', cat:'postflop', step:'3/4', hidden:true,
  stage:'Mid Stage', stack:'45bb',
  pot:21.3, toCall:0,
  board:['9s','5h','2h','Kh'], hero:['9c','9d'], heroLine:'BB',
  stacks:[['BTN',48],['BB',45]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG…CO',a:'fold'},{pos:'BTN',a:'raise',amt:'2.4'},{pos:'SB',a:'fold'},{pos:'YOU',a:'call'}]},
    {name:'Flop', acts:[{pos:'YOU',a:'check'},{pos:'BTN',a:'cbet',amt:'2.6'},{pos:'YOU',a:'raise',amt:'8'},{pos:'BTN',a:'call'}]},
    {name:'Turn', note:'ตาคุณ — OOP เล่นก่อน', acts:[]}
  ],
  q:'BTN call check-raise. Turn K♥ — <b>flush ครบแล้วบนบอร์ด</b>. top set ของเราเล่นยังไง?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'Bet',sub:'½ (10.5)'},{k:'raise',label:'Bet',sub:'pot (21)'}],
  best:1, ok:[0],
  nextSpotId:'h9d',
  why:`<b>เฉลย: Bet ½</b> — ใช่ flush ลงแล้ว แต่อย่า panic: range ที่ call check-raise ของ BTN มี flush จริงแค่ส่วนน้อย (A♥X♥ บาง combo) — ส่วนใหญ่คือ overpairs, 9x, two pair, draw เดี่ยว
  <br>เบทครึ่ง pot: รีดต่อจากมือที่ยังนำ + <b>เราเองมี ~10 outs เป็น boat</b> (board pair ใดๆ) ถ้าโดน raise ก็เจ็บน้อย. เบท pot เต็ม = เจอแต่ flush, check = ฟรีให้ draw เดี่ยวตาม`,
  deep:`<b>เจาะลึก</b><br>
  <b>• นับ boat outs:</b> 9♥ (1), 5×2, 2×2, K×3... K ทำให้ KK?? — board pair ทุกใบ: 9/5/2/K ที่เหลือ = 10 ใบ → ~22% ต่อใบที่จะแซง flush กลับ
  <br><b>• ทำไมไม่ check-fold:</b> มือเราแข็งเกินไป — เสีย value จาก AA/KK ที่จะ call และ fold ผิดต่อ bluff
  <br><b>• แผน river:</b> board pair → รีดหนัก/jam. ♥ อีกใบ → check-evaluate. brick → bet/call ตามขนาด`
},
{
  id:'h9d', cat:'postflop', step:'4/4', hidden:true,
  stage:'Mid Stage', stack:'45bb',
  pot:42.3, toCall:0,
  board:['9s','5h','2h','Kh','5d'], hero:['9c','9d'], heroLine:'BB',
  stacks:[['BTN',48],['BB',45]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG…CO',a:'fold'},{pos:'BTN',a:'raise',amt:'2.4'},{pos:'SB',a:'fold'},{pos:'YOU',a:'call'}]},
    {name:'Flop', acts:[{pos:'YOU',a:'check'},{pos:'BTN',a:'cbet',amt:'2.6'},{pos:'YOU',a:'raise',amt:'8'},{pos:'BTN',a:'call'}]},
    {name:'Turn', acts:[{pos:'YOU',a:'bet',amt:'10.5'},{pos:'BTN',a:'call'}]},
    {name:'River', note:'ตาคุณ — เหลือ 24.1bb', acts:[]}
  ],
  q:'River 5♦ — <b>บอร์ด pair = เราได้ FULL HOUSE (999-55)!</b> flush ของเขากลายเป็นเหยื่อ. ปิดยังไง?',
  opts:[{k:'call',label:'Check',sub:'induce'},{k:'shove',label:'All-in',sub:'24.1bb'}],
  best:1, ok:[0],
  reveal:{pos:'BTN', cards:['Ah','Qh'], note:'เปิด nut flush<br>— แพ้ full house ของเรา'},
  why:`<b>เฉลย: All-in</b> — boat ของเราตอนนี้แพ้แค่ <b>4 combos จาก 990</b> (KK สาม combo + 5♠5♣ ควอดหนึ่ง combo — ยืนยันด้วย brute-force). ทุก flush ที่ตามเรามาตั้งแต่ turn <b>ต้อง call jam นี้</b> — เขามองว่ามือเขาคือ nuts ของเมื่อกี้
  <br><br>jam 24 เข้า 42 (~57% pot) คือไซส์ที่ flush "กดถูกใจ" — check-induce ได้เงินน้อยกว่าเพราะถ้าเขาเช็คกลับ = ศูนย์
  <br><br>🏁 <b>จบมือ:</b> BTN snap call ด้วย <b>A♥Q♥ (nut flush)</b> — full house ชนะ เก็บ pot ~90bb 💰 นี่คือรางวัลของการ "ไม่ slowplay set บน draw board" — pot โตทุก street พอดีจังหวะ`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• ตัวเลขจริง:</b> แพ้ 4/990 (KK ×3, 5♠5♣ ×1) ชนะ 986. มือที่ call jam: ทุก flush, Kx two pair, 9x — เกินครึ่ง range ที่มาถึง river
  <br><b>• ลำดับการสอนของมือนี้:</b> (1) check-raise set บน wet board (2) อย่ากลัว scare card ถ้า range เขายังกว้าง (3) board pair คือใบที่พลิก "ผู้ล่า → เหยื่อ" — รู้จังหวะรีด
  <br><b>• ถ้า river ไม่ pair:</b> (เช่น 8♣) — check-call ขนาดกลาง: มือเรากลายเป็น bluff-catcher ที่ดี ไม่ใช่มือรีด
  <br><b>• Hand summary:</b> เริ่ม 45bb → จบ ~90bb. ทุกเม็ดของ value มาจากการสร้าง pot ตั้งแต่ flop`
},

// Hand 10 — Push/fold พื้นฐานที่คนพลาดบ่อย (จบใน 1 การตัดสินใจ)
{
  id:'h10', cat:'preflop', step:'1/1',
  stage:'Late Stage', stack:'9bb',
  pot:1.5, toCall:0,
  hero:['Ac','8c'], heroLine:'CO • 9bb',
  stacks:[['CO',9],['BTN',30],['SB',25],['BB',38]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP',a:'fold'}]}],
  q:'A8s ที่ CO เหลือ 9bb — ทางเลือกเดียวที่ถูกคืออะไร?',
  opts:[{k:'fold',label:'Fold'},{k:'shove',label:'All-in',sub:'9bb'},{k:'raise',label:'Min-raise',sub:'2bb'}],
  best:1,
  reveal:{pos:'BB', cards:['Kd','Qd'], note:'call แล้วเปิด<br>— pair of aces เราชนะ race'},
  why:`<b>เฉลย: All-in</b> — 9bb คือโซน push/fold บริสุทธิ์ A8s จาก CO อยู่ในตาราง jam ห่างจากเส้นมาก (Nash jam ถึง A2s สบายๆ จากตำแหน่งนี้)
  <br>Min-raise คือคำตอบที่แพงที่สุด: โดน jam กลับแล้วต้อง call ด้วย pot odds = เสียทางเลือก, โดน call แล้วเล่น postflop 7bb = ฝันร้าย. Fold = เผา equity ของมือที่ดีกว่าค่าเฉลี่ยมาก
  <br><br>🏁 <b>จบมือ:</b> BB call ด้วย K♦Q♦ (race 60/40 เราเป็นต่อ) — board J♠7♦4♠ 2♥ A♥ → <b>เราชนะ double up เป็น ~19.5bb</b> กลับมามีเกมทันที`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไม jam คือทางเดียว:</b> ที่ 9bb ทุก raise = pot-committed อยู่แล้ว — แต่ min-raise ให้ "ข้อมูล + ทางเลือก" กับคู่ต่อสู้ฟรีๆ. jam เอา fold equity เต็มก้อนแลก
  <br><b>• A8s CO ในตาราง:</b> jam ได้ถึง ~13-14bb. ที่ 9bb คือ snap — ไม่ใช่เส้น
  <br><b>• ถ้า fold ไปเรื่อยๆ:</b> blind/ante กิน ~1.5bb ต่อรอบ = เหลือ 6 รอบก่อนตาย. มือแบบ A8s ไม่ได้มาบ่อยพอจะรอ
  <br><b>• ผลลัพธ์:</b> ชนะ race นี้ = กลับมาเล่นโป๊กเกอร์จริงได้; แพ้ = ตกรอบแบบถูกต้อง. ทั้งสองดีกว่า blind out`
},

// Hand 11 — FT: JJ vs jam — ตัดสินใจด้วยราคา ไม่ใช่ความกลัว
{
  id:'h11a', cat:'preflop', step:'1/2',
  stage:'Final Table', stack:'28bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 6 คน · CO (24bb) เปิดมา — เรา cover เขา',
  pot:3.7, toCall:1.2,
  hero:['Jh','Js'], heroLine:'BB • 28bb',
  stacks:[['CO',24],['BB',28]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.2'},{pos:'BTN SB',a:'fold'}]}],
  q:'JJ ใน BB เจอ CO (24bb) เปิด — Final Table เหลือ 6. เล่นยังไง?',
  opts:[{k:'call',label:'Call',sub:'1.2bb'},{k:'raise',label:'3-Bet',sub:'6.5bb'},{k:'shove',label:'All-in',sub:'28bb'}],
  best:1, ok:[2],
  nextSpotId:'h11b',
  why:`<b>เฉลย: 3-Bet 6.5</b> — JJ แข็งเกินกว่าจะ flat (ปล่อยให้เขา realize equity ฟรีด้วย overcards). 3bet ขนาดกลางรีดจาก worse (TT/99/AJ/KQ ที่ call) และให้ room เขา jam มือที่เราต้องการให้ jam
  <br>jam ตรง 28bb ก็ได้ผลใกล้กัน (ok) แต่ไล่มือ worse ที่อาจจ่ายเพิ่ม. <b>สำคัญ: 3bet นี้ต้องมาพร้อมแผนรับ jam</b> — ดู step ถัดไป`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไมไม่ flat:</b> JJ ที่ FT vs CO open — flat เชิญ overcard flop (A/K/Q ลง ~60% ของ flop) แล้วเล่นยากทั้งมือ
  <br><b>• ขนาด 3bet:</b> ~3x ของ open จาก OOP — มาตรฐาน. เหลือ room ให้เขาตัดสินใจผิด (call OOP-IP / jam กว้างไป)
  <br><b>• เรา cover เขา:</b> ความเสี่ยงเราคือ "เสียครึ่ง stack" ไม่ใช่ bust — ICM กดเราน้อยกว่าเขา`
},
{
  id:'h11b', cat:'preflop', step:'2/2', hidden:true,
  stage:'Final Table', stack:'28bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 6 คน · CO (24bb) เปิดมา — เรา cover เขา',
  pot:31, toCall:17.5,
  hero:['Jh','Js'], heroLine:'BB • 28bb',
  stacks:[['CO',24],['BB',28]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.2'},{pos:'BTN SB',a:'fold'},{pos:'YOU',a:'3bet',amt:'6.5'},{pos:'CO',a:'shove',amt:'24'}]}],
  q:'CO jam กลับ 24bb — ต้องจ่ายอีก 17.5 เข้า pot 31. JJ ที่ FT call ไหม?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call all-in'}],
  best:1,
  reveal:{pos:'CO', cards:['As','Ks'], note:'เปิด AK — flip<br>— JJ เรายืน, CO ตกรอบ'},
  why:`<b>เฉลย: Call</b> — ราคาคือ 17.5 เพื่อชิง 48.5 = ขอแค่ <b>36%</b>. CO jam ทับ 3bet ที่ FT = 99+/AQ+/AK ซึ่ง JJ มี ~50-52% — เกิน threshold แม้บวก ICM premium แล้ว
  <br>และอย่าลืม: <b>เรา cover เขา</b> — แพ้ก็เหลือ 4bb?? ไม่ใช่: เหลือ 28-24 = 4bb... เจ็บมากแต่ไม่ bust ในขณะที่ชนะ = เขาตกรอบ + เราขึ้น ~52bb เป็น contender ทันที. asymmetry นี้คือเหตุผลสุดท้ายที่ดัน call
  <br><br>🏁 <b>จบมือ — Showdown:</b> CO เปิด <b>A♠K♠</b> (flip คลาสสิก เราเป็นต่อนิดๆ). Board 9♦6♦2♣ 8♥ 4♠ — ไม่มี A ไม่มี K → <b>JJ ยืน! CO ตกรอบอันดับ 6</b> เราขึ้น 52bb ลุ้นแชมป์เต็มตัว`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• Math:</b> ขอ 36% — JJ vs (99+, AQs+, AKo) ≈ 51%. แม้หัก ICM risk premium ~5-8% ก็ยังเกินชัด → call ไม่ใช่ hero call แต่เป็นเลขล้วน
  <br><b>• ทำไม cover สำคัญ:</b> ผู้เล่นที่ bust ได้คือเขา ไม่ใช่เรา — ICM ลงโทษ "ผู้เสี่ยง bust" หนักสุด. spot กลับด้าน (เขา cover เรา) JJ จะ close กว่ามาก
  <br><b>• แผนที่วางไว้ตั้งแต่ 3bet:</b> "ถ้าโดน jam จาก 24bb → call" คิดจบก่อนกด 3bet แล้ว — ไม่มีการตกใจหน้างาน
  <br><b>• อะไรเปลี่ยนคำตอบ:</b> CO เป็น nit ที่ jam แต่ QQ+/AK → fold JJ ได้ (vs range นั้นเหลือ ~37% พอดีเส้น). เขาสั้นกว่านี้ (15bb) → call ง่ายขึ้นอีก`
},

// Hand 12 — 3bet pot: TPTK โดน check-raise — อ่าน line + ยืนระยะ
{
  id:'h12a', cat:'preflop', step:'1/3',
  stage:'Mid Stage', stack:'50bb',
  pot:3.8, toCall:2.3,
  hero:['Ad','Qd'], heroLine:'BTN • 50bb',
  stacks:[['CO',52],['BTN',50]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'}]}],
  q:'AQs บน BTN เจอ CO เปิด — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'2.3bb'},{k:'raise',label:'3-Bet',sub:'7.5bb'}],
  best:2, ok:[1],
  nextSpotId:'h12b',
  why:`<b>เฉลย: 3-Bet</b> — AQs vs CO open คือ value 3bet ชัด: dominate AJ/AT/KQ/QJ ที่ CO เปิดมาเพียบ. เรา IP ตลอดมือ + initiative
  <br>flat ก็เล่นได้ (ok) แต่ปล่อย blinds เข้ามาถูกๆ และเสีย value จากมือที่ call 3bet แบบเป็นรอง`,
  deep:`<b>เจาะลึก</b><br>
  <b>• AQs vs ตำแหน่ง:</b> vs UTG open = flat/fold (range เขาแคบ เราโดน dominate), vs CO/BTN = 3bet value
  <br><b>• ถ้าโดน 4bet:</b> call (IP, suited, 50bb) — ไม่ jam ไม่ fold`
},
{
  id:'h12b', cat:'postflop', step:'2/3', hidden:true,
  stage:'Mid Stage', stack:'50bb',
  pot:16.5, toCall:0,
  board:['Qs','Ts','4h'], hero:['Ad','Qd'], heroLine:'BTN',
  stacks:[['CO',52],['BTN',50]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'},{pos:'YOU',a:'3bet',amt:'7.5'},{pos:'SB BB',a:'fold'},{pos:'CO',a:'call'}]},
    {name:'Flop', acts:[{pos:'CO',a:'check'}]}
  ],
  q:'CO call. Flop Q♠T♠4♥ — TPTK บน board เปียก (spades + JT/KJ ลอยเต็ม). CO เช็ค — เล่นยังไง?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'C-bet',sub:'½ (8)'}],
  best:1,
  nextSpotId:'h12c',
  why:`<b>เฉลย: C-bet ½</b> — TPTK ใน 3bet pot บน board ที่ draw เพียบ = เบทชัดเจน: value จาก Qx/JJ/TT/draws + charge ทุก draw ที่พร้อมไล่เรา
  <br>check ฟรีการ์ดบน board นี้คือบาป — KJ/spades/AK ได้ดูใบฟรีทันที`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ½ ไม่ใช่ ⅓:</b> board เปียก → ขยับ size ขึ้น. ½ pot ทำให้ draw จ่ายผิดราคาแต่ Qx/TT ยัง call ได้
  <br><b>• CO range ใน 3bet pot:</b> JJ-88, AQ/KQ, JTs, spades suited — เราตีหนักกว่า range เขาทั้งแผง`
},
{
  id:'h12c', cat:'postflop', step:'3/3', hidden:true,
  stage:'Mid Stage', stack:'50bb',
  pot:46.5, toCall:14,
  board:['Qs','Ts','4h'], hero:['Ad','Qd'], heroLine:'BTN',
  stacks:[['CO',52],['BTN',50]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'},{pos:'YOU',a:'3bet',amt:'7.5'},{pos:'SB BB',a:'fold'},{pos:'CO',a:'call'}]},
    {name:'Flop', acts:[{pos:'CO',a:'check'},{pos:'YOU',a:'cbet',amt:'8'},{pos:'CO',a:'raise',amt:'22'}]}
  ],
  q:'CO <b>check-raise เป็น 22</b> ใน 3bet pot! TPTK ของเราโดนทดสอบ — fold, call หรือ jam?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'+14bb'},{k:'shove',label:'All-in'}],
  best:1, ok:[2],
  reveal:{pos:'CO', cards:['Ks','Js'], note:'เปิด monster draw ที่พลาดหมด<br>— AQ เราชนะ'},
  why:`<b>เฉลย: Call</b> — check-raise ใน 3bet pot บน Q♠T♠4♥ = range เขาคือ <b>draw หนักๆ เป็นส่วนใหญ่</b> (spade combos, KJ, J9s) ปนกับ value จริงไม่กี่ตัว (QT/44/TT). TPTK ของเราอยู่หน้า range นั้น — fold คือยอมแพ้ equity ที่เราจ่ายมาแล้ว, jam ก็ได้ (ok) แต่ call ให้เขา barrel bluff ต่อพลาดๆ
  <br><br>🏁 <b>จบมือ:</b> turn 2♦ CO jam ที่เหลือ 18 เข้า pot ~64 — ราคาบังคับ call ชัด (ขอ ~18%). River 7♣. CO เปิด <b>K♠J♠</b> — flush draw + open-ender ที่<b>พลาดทุกทาง</b> → <b>AQ ชนะ pot ~110bb</b>
  <br>มือ monster draw ของเขามี equity เกือบ 50% ตอน flop — เขาเล่นไม่ผิด เราแค่ยืนระยะถูกและการ์ดเข้าข้าง`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• อ่าน check-raise บน QT4ss:</b> board นี้ check-raise range = semibluff หนักสุดใน poker (KJ/spades มี equity สูงจน "raise ฟรี") — TPTK ห้าม fold
  <br><b>• ทำไม call > jam:</b> call เก็บ bluff ทั้งหมดไว้ใน pot — เขา jam turn ด้วย draw ต่อให้เราได้ทั้งกองตอนเราเป็นต่อ. jam flop = เขา fold draw ที่จ่ายเรา / call ด้วยมือที่บีตเรา
  <br><b>• ยืนยันจาก verifier:</b> KJs ที่ river เหลือ K-high — แพ้ทุกทาง. AQ ที่ showdown แพ้แค่ 100/990 (sets/two pair ที่ slowplay)
  <br><b>• ถ้า turn เป็น ♠:</b> ตอนนั้นค่อยคิดใหม่ — มือเรายังมี A♠?? ไม่มี (เราถือ A♦Q♦) → board ♠ = fold ต่อ jam ได้`
},

// Hand 13 — Bubble: AK vs QQ — flip ที่ "ต้องเอา" และผลที่ตามมา
{
  id:'h13a', cat:'preflop', step:'1/2',
  stage:'Bubble', stack:'30bb', icm:true,
  icmState:'🫧 <b>BUBBLE</b> · อีก 1 คน bust = ทุกคนเข้าเงิน · SB (28bb) เราคุมเขาอยู่',
  pot:1.5, toCall:0,
  hero:['As','Kc'], heroLine:'CO • 30bb',
  stacks:[['CO',30],['SB',28]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP',a:'fold'}]}],
  q:'AKo ที่ CO ช่วง Bubble, 30bb — เปิดยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'raise',label:'Raise',sub:'2.3bb'},{k:'shove',label:'All-in',sub:'30bb'}],
  best:1,
  nextSpotId:'h13b',
  why:`<b>เฉลย: Raise ปกติ</b> — AK เปิดมาตรฐาน. open-jam 30bb = เสีย value มหาศาล (ทุกมือที่แย่กว่า fold หมด เหลือแต่ AA/KK call)
  <br>bubble ไม่เปลี่ยนอะไรกับมือ premium — เปิดแล้วพร้อมรับทุก action`,
  deep:`<b>เจาะลึก</b><br>
  <b>• AK ที่ 30bb:</b> เปิด → ถ้าโดน 3bet → jam (มาตรฐานทุกตำรา). ไม่ flat 3bet OOP/IP ที่ความลึกนี้
  <br><b>• Bubble + เรา cover คนหลัง:</b> ยิ่งกดดันได้ — short/medium stacks ไม่อยากชน AK ของเรา`
},
{
  id:'h13b', cat:'preflop', step:'2/2', hidden:true,
  stage:'Bubble', stack:'30bb', icm:true,
  icmState:'🫧 <b>BUBBLE</b> · อีก 1 คน bust = ทุกคนเข้าเงิน · SB (28bb) เราคุมเขาอยู่',
  pot:11.3, toCall:5.7,
  hero:['As','Kc'], heroLine:'CO • 30bb',
  stacks:[['CO',30],['SB',28]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'YOU',a:'raise',amt:'2.3'},{pos:'BTN',a:'fold'},{pos:'SB',a:'3bet',amt:'8'},{pos:'BB',a:'fold'}]}],
  q:'SB 3-bet เป็น 8bb (เขาเหลือ 28 — เราคุมเขา) — AKo ตอบยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'5.7bb'},{k:'shove',label:'All-in',sub:'30bb'}],
  best:2, ok:[1],
  reveal:{pos:'SB', cards:['Qh','Qc'], note:'เปิด QQ — flip<br>— top pair K เราชนะ, bubble แตก'},
  why:`<b>เฉลย: All-in</b> — AK ที่ 28bb effective เจอ 3bet = jam ตามตำรา: (1) fold equity ใส่ 99-JJ/AQ ที่ต้อง fold หรือ call แบบผิด (2) เมื่อโดน call เราไม่เคยแย่กว่า flip (3) <b>เราคุมเขา</b> — แพ้ก็ไม่ bust, เขาแพ้ = bust บน bubble
  <br>ICM ทำงาน<b>ให้เรา</b>ที่นี่: แรงกดทั้งหมดอยู่ฝั่งเขา
  <br><br>🏁 <b>จบมือ — Showdown:</b> SB call ทั้งกองด้วย <b>Q♥Q♣</b> (flip 46/54 เราเป็นรองนิด). Board K♦7♣2♥ T♠ 3♦ — <b>top pair K! SB bust = BUBBLE แตก ทุกคนเข้าเงิน 🎉</b> เราขึ้น ~58bb เป็น chip leader โซนนี้`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• ทำไม jam > call:</b> call 3bet OOP?? เราคือ IP... call ก็เล่นได้ (ok) แต่ AK ชอบ "จบก่อน flop": เราชนะ pot 11.3 ทันทีเมื่อเขา fold ~35-40% และ realize equity เต็มเมื่อโดน call (ไม่มี flop ที่ทำให้เรา fold ผิด)
  <br><b>• ฝั่งเขาผิดไหม:</b> QQ call jam บน bubble ตอนโดน cover = ตัดสินใจหนักมาก — GTO บอก call ก้ำกึ่ง, ICM หนักๆ บอก fold ได้เลย. เราบังคับให้เขาอยู่ใน spot ที่ "ถูกก็เจ็บ"
  <br><b>• ยืนยัน:</b> board K72T3 — QQ แพ้ pair K (verifier: AK ชนะ 890/990 ที่ runout นี้)
  <br><b>• ถ้าแพ้ flip นี้:</b> เหลือ 2bb?? ไม่ — เราคุมเขา: 30-28 = เหลือ 2bb... เจ็บจริงแต่ยังไม่ตาย และ play คือถูกระยะยาว. นี่คือความต่างระหว่าง "ผลแย่" กับ "เล่นแย่"`
},

// Hand 14 — Blind vs blind: top two ที่ turn — รีดให้สุดทาง
{
  id:'h14a', cat:'preflop', step:'1/3',
  stage:'Mid Stage', stack:'40bb',
  pot:4, toCall:2,
  hero:['Qs','Js'], heroLine:'BB • 40bb',
  stacks:[['SB',42],['BB',40]],
  streets:[{name:'Preflop', acts:[{pos:'UTG…BTN',a:'fold'},{pos:'SB',a:'raise',amt:'3'}]}],
  q:'QJs ใน BB เจอ SB เปิด 3x (blind vs blind) — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'2bb'},{k:'raise',label:'3-Bet',sub:'9bb'}],
  best:1, ok:[2],
  nextSpotId:'h14b',
  why:`<b>เฉลย: Call</b> — blind vs blind ทั้งสอง range กว้างมาก QJs คือมือแข็งของสถานการณ์นี้ + เรามี <b>position ตลอดมือ</b> (BB อยู่หลัง SB ทุก street หลังฟลอป)
  <br>call เก็บ range เขาไว้กว้างๆ ให้เราใช้ position รีด. 3bet ก็ดี (ok) แต่ไล่มือ junk ที่เราอยากให้เล่นต่อ`,
  deep:`<b>เจาะลึก</b><br>
  <b>• bvb dynamics:</b> SB เปิด ~40-50% → QJs dominate ส่วนใหญ่ของ Qx/Jx เขา
  <br><b>• position หลังฟลอป:</b> SB ต้องเล่นก่อนเราทุก street — ความได้เปรียบที่แปลงเป็นชิปได้จริง`
},
{
  id:'h14b', cat:'postflop', step:'2/3', hidden:true,
  stage:'Mid Stage', stack:'40bb',
  pot:9, toCall:3,
  board:['Jd','8c','3s'], hero:['Qs','Js'], heroLine:'BB',
  stacks:[['SB',42],['BB',40]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG…BTN',a:'fold'},{pos:'SB',a:'raise',amt:'3'},{pos:'YOU',a:'call'}]},
    {name:'Flop', acts:[{pos:'SB',a:'cbet',amt:'3'}]}
  ],
  q:'Flop J♦8♣3♠ — top pair Q kicker. SB c-bet ½ — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'3bb'},{k:'raise',label:'Raise',sub:'9bb'}],
  best:1, ok:[2],
  nextSpotId:'h14c',
  why:`<b>เฉลย: Call</b> — top pair ดีบน board แห้ง vs range bvb ที่กว้าง — แข็งพอเล่นแต่ยังไม่ต้องปั้น pot: raise ตอนนี้ไล่ A-high/K-high/bluffs ที่จะ barrel ให้เราต่อ
  <br>เก็บทุก bluff ไว้ใน range เขา แล้วให้ position ทำงาน`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไมไม่ raise:</b> J83r ไม่มี draw ให้ charge — raise ได้ value แค่จาก Jx ที่แย่กว่า (น้อย) แต่เสีย bluff stream ทั้งหมด
  <br><b>• แผน:</b> call ทุก street ขนาดสมเหตุผล / กลายเป็น value-raise ถ้า turn เพิ่มมือเรา`
},
{
  id:'h14c', cat:'postflop', step:'3/3', hidden:true,
  stage:'Mid Stage', stack:'40bb',
  pot:20, toCall:8,
  board:['Jd','8c','3s','Qh'], hero:['Qs','Js'], heroLine:'BB',
  stacks:[['SB',42],['BB',40]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG…BTN',a:'fold'},{pos:'SB',a:'raise',amt:'3'},{pos:'YOU',a:'call'}]},
    {name:'Flop', acts:[{pos:'SB',a:'cbet',amt:'3'},{pos:'YOU',a:'call'}]},
    {name:'Turn', acts:[{pos:'SB',a:'bet',amt:'8'}]}
  ],
  q:'Turn Q♥ — <b>TOP TWO PAIR!</b> SB barrel ต่อ ⅔ pot. ถึงเวลาหรือยัง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'8bb'},{k:'raise',label:'Raise',sub:'22bb'}],
  best:2, ok:[1],
  reveal:{pos:'SB', cards:['Ah','Qd'], note:'เปิด top pair top kicker<br>— แพ้ top two ของเรา'},
  why:`<b>เฉลย: Raise</b> — turn Q ทำให้เราแซงทุกมือที่ barrel: AQ/KQ (top pair), QT, JT, T9 (draw). ตอนนี้แหละคือจังหวะปั้น pot — เขาเพิ่งเบทบอกว่ามีของ และ Q คือใบที่ "ช่วยเขา" ในสายตาเขา
  <br>call อีกก็ได้ (ok) แต่ river อาจ check จบ — เสียโอกาสรีด stack จาก AQ/KQ ที่ไม่หนีแล้ว
  <br><br>🏁 <b>จบมือ:</b> SB call 22 ด้วย A♥Q♦ (top pair top kicker — เขาหนีไม่ได้แล้วจริงๆ). River 4♣ brick, SB check, เราเบทที่เหลือ 12 — SB call. <b>Top two ชนะ เก็บ pot ~64bb</b>`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• Raise turn ตรงนี้สอนอะไร:</b> มือ medium (top pair) เล่น passive เก็บ bluff / มือ strong (two pair+) สลับเป็น aggressive ตอน "การ์ดที่เข้าทาง range เขา" มา — Q คือใบที่เขาคิดว่าเขานำ
  <br><b>• ยืนยัน:</b> verifier บน J83Q4: แพ้แค่ T9 (straight ×16) + sets — AQ/KQ/QT จ่ายเราเต็มๆ
  <br><b>• ราคา:</b> raise 22 ≈ 2.75x ของเบทเขา — ใหญ่พอตั้ง river jam, เล็กพอให้ TPTK call
  <br><b>• Hand summary:</b> call-call-raise = เส้นทางที่เก็บ bluff ครบ + รีด value เต็มตอนมือพีค`
},

// Hand 15 — FT: overpair เล็กเจอ A river — วินัยขั้นสุดท้าย
{
  id:'h15a', cat:'preflop', step:'1/4',
  stage:'Final Table', stack:'35bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 7 คน · CO คือ chip leader (40bb) cover เรา',
  pot:3.8, toCall:2.3,
  hero:['8h','8d'], heroLine:'BTN • 35bb',
  stacks:[['CO',40],['BTN',35]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'}]}],
  q:'88 บน BTN เจอ CO (chip leader) เปิด — Final Table เหลือ 7. เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'2.3bb'},{k:'raise',label:'3-Bet',sub:'7bb'}],
  best:1, ok:[2],
  nextSpotId:'h15b',
  why:`<b>เฉลย: Call</b> — 88 vs chip leader ที่ FT: flat IP คุม pot ขนาดที่เราคุมได้. 3bet เชิญเขา jam ทับด้วย leverage ของ ICM (เขา bust เราได้ เราทำอะไรเขาไม่ได้)
  <br>มือ medium pair ชอบ pot เล็ก-กลาง — โดยเฉพาะตอนแพ้แล้วเจ็บกว่าชนะ`,
  deep:`<b>เจาะลึก</b><br>
  <b>• เจอ cover ที่ FT:</b> ทุก pot ใหญ่ที่เราเล่นกับเขา = เสี่ยงทัวร์ทั้งใบ — เลือกสนามรบให้เป็น
  <br><b>• 88 IP:</b> set-mine + เล่น board ต่ำได้ — มือดีสำหรับ flat`
},
{
  id:'h15b', cat:'postflop', step:'2/4', hidden:true,
  stage:'Final Table', stack:'35bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 7 คน · CO คือ chip leader (40bb) cover เรา',
  pot:9.1, toCall:3,
  board:['7c','5d','2s'], hero:['8h','8d'], heroLine:'BTN',
  stacks:[['CO',40],['BTN',35]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'},{pos:'YOU',a:'call'},{pos:'SB BB',a:'fold'}]},
    {name:'Flop', acts:[{pos:'CO',a:'cbet',amt:'3'}]}
  ],
  q:'Flop 7♣5♦2♠ — 88 เป็น overpair ของบอร์ด. CO c-bet ⅓ — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'3bb'},{k:'raise',label:'Raise',sub:'9bb'}],
  best:1, ok:[2],
  nextSpotId:'h15c',
  why:`<b>เฉลย: Call</b> — บอร์ดนี้พลาด range CO (broadway หนัก) — cbet ⅓ ของเขาคือ range bet อัตโนมัติ. 88 นำมือเขาเกือบหมด แต่ raise ไม่ได้อะไร: มือแย่กว่า fold, มือดีกว่าไม่ไป
  <br>call แล้วให้เขา barrel มือ A-high ต่อ`,
  deep:`<b>เจาะลึก</b><br>
  <b>• 88 บน 752r:</b> นำ AK/AQ/KQ ทั้งหมด — มือพวกนี้คือส่วนใหญ่ของ cbet เขา → อย่าไล่
  <br><b>• ใบที่ต้องระวัง:</b> overcards (เกือบทุกใบ A-9) — แผนคือ call ขนาดเล็ก แล้วประเมินใหม่ทุก street`
},
{
  id:'h15c', cat:'postflop', step:'3/4', hidden:true,
  stage:'Final Table', stack:'35bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 7 คน · CO คือ chip leader (40bb) cover เรา',
  pot:21.1, toCall:9,
  board:['7c','5d','2s','4h'], hero:['8h','8d'], heroLine:'BTN',
  stacks:[['CO',40],['BTN',35]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'},{pos:'YOU',a:'call'},{pos:'SB BB',a:'fold'}]},
    {name:'Flop', acts:[{pos:'CO',a:'cbet',amt:'3'},{pos:'YOU',a:'call'}]},
    {name:'Turn', acts:[{pos:'CO',a:'bet',amt:'9'}]}
  ],
  q:'Turn 4♥ (บอร์ด 7-5-2-4 เริ่มต่อกัน) CO barrel ¾ — 88 ยังไหวไหม?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'9bb'},{k:'raise',label:'Raise/Jam'}],
  best:1, ok:[0],
  nextSpotId:'h15d',
  why:`<b>เฉลย: Call (ใบสุดท้ายที่จ่าย)</b> — 4♥ ให้เราเพิ่ม: gutshot 6 (4-5-6-7-8) + ยังนำ Ax barrels. ราคา 9 เข้า 30 (~30%) — overpair + 4 outs ยังคุ้ม
  <br>แต่ขีดเส้นชัด: <b>นี่คือ street สุดท้ายที่มือนี้จ่ายแบบไม่มีอะไรเพิ่ม</b>. ใบ scare ที่ river (A/K/Q, ใบทำ straight) = ถอย. ok=fold เพราะ ICM กับ cover ทำให้ถอยตรงนี้ไม่ผิด`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไมยัง call:</b> CO double barrel บน runout นี้มี A-high/อากาศเยอะ (เขาเปิด broadway แล้วพลาดทั้งสอง street) + เรามี equity เพิ่ม (gutshot)
  <br><b>• ทำไม fold เริ่ม ok:</b> chip leader barrel ใส่เราที่ FT = แรงกดสองชั้น (ชิป+ICM). มือ "นำนิดเดียวหรือแพ้เยอะ" ไม่จำเป็นต้อง hero
  <br><b>• เตรียมใจกับ river:</b> ใบดี: 8/6/3/brick ต่ำ. ใบแย่: A (top of his barrels), K/Q, 6?? — 6 ดีสำหรับเรา (straight) แต่ A คือใบที่เขาตีบ่อยสุด`
},
{
  id:'h15d', cat:'postflop', step:'4/4', hidden:true,
  stage:'Final Table', stack:'35bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 7 คน · CO คือ chip leader (40bb) cover เรา',
  pot:50.8, toCall:20.7,
  board:['7c','5d','2s','4h','As'], hero:['8h','8d'], heroLine:'BTN',
  stacks:[['CO',40],['BTN',35]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'},{pos:'YOU',a:'call'},{pos:'SB BB',a:'fold'}]},
    {name:'Flop', acts:[{pos:'CO',a:'cbet',amt:'3'},{pos:'YOU',a:'call'}]},
    {name:'Turn', acts:[{pos:'CO',a:'bet',amt:'9'},{pos:'YOU',a:'call'}]},
    {name:'River', acts:[{pos:'CO',a:'shove',amt:'20.7'}]}
  ],
  q:'River A♠ — ใบที่เราไม่อยากเห็นที่สุด. CO jam ทั้งกองที่เหลือของเรา — 88 call หรือ fold?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call all-in'}],
  best:0,
  reveal:{pos:'CO', cards:['Ac','3c'], note:'โชว์ wheel (A-2-3-4-5)<br>— fold ของเราถูกต้อง'},
  why:`<b>เฉลย: Fold (ไม่ใกล้เคียงด้วยซ้ำ)</b> — A♠ คือหายนะสามชั้นสำหรับ 88:
  <br>(1) ทุก <b>Ax ที่ barrel มาตลอด</b> เพิ่งแซงเรา — และ Ax คือส่วนใหญ่ของ range เขา
  <br>(2) โหดกว่านั้น: บอร์ด 7-5-2-4-A ทำให้ <b>ใบ 3 ใบเดียวในมือเขา = wheel</b> (A-2-3-4-5) — brute-force: มือที่บีตเรามี 391 combos โดย straight 5-high อย่างเดียว ×154!
  <br>(3) ICM: จ่าย 20.7 สุดท้ายแพ้ = เหลือฝุ่นที่ FT ทั้งที่ pay jump ใกล้เข้ามา
  <br><br>🏁 <b>จบมือ — fold:</b> CO โชว์ <b>A♣3♣</b> — wheel ตั้งแต่ turn (เบท turn คือ value ไม่ใช่ bluff) river ยังเติม pair A ให้อีก. เสีย 14.3bb แต่รักษา 20.7bb ไว้สู้ต่อที่ FT ✊`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• ตัวเลขจริง:</b> 88 บน 7524A แพ้ 391/990: wheel ×154 (ใบ 3 อะไรก็ได้!), 7-high straight (36) ×16, two pair ทุกชุด, Ax ทุกตัว. เราชนะแค่ 88 ต่ำกว่า/อากาศ — แต่ของพวกนั้นไม่ jam
  <br><b>• เส้นที่ลากไว้ตั้งแต่ turn ช่วยเรา:</b> ตัดสินใจ "จ่ายใบสุดท้ายแล้วถอยถ้า scare" ไว้ล่วงหน้า = ตอน river ไม่มี emotion มีแต่ execution
  <br><b>• ทำไมไม่ใช่ hero-call spot:</b> hero call ต้องการ (1) bluff เยอะใน range — ไม่มี: ทุก draw ของเขาคือ wheel ที่เข้าแล้ว (2) blocker — เราไม่มี A ไม่มี 3
  <br><b>• Hand summary:</b> เริ่ม 35bb → จบ 20.7bb. เล่นแบบมีแผนทุก street, แพ้น้อยสุดเท่าที่มือนี้แพ้ได้`
},

// Hand 16 — Deep AA: 4bet pot vs overplayed QQ
{
  id:'h16a', cat:'preflop', step:'1/3',
  stage:'Early', stack:'100bb',
  pot:1.5, toCall:0,
  hero:['Ah','As'], heroLine:'UTG • 100bb',
  stacks:[['UTG',100],['MP',105]],
  streets:[{name:'Preflop', note:'ตาคุณเปิดเป็นคนแรก', acts:[]}],
  q:'AA จาก UTG, 100bb deep — เปิดยังไง?',
  opts:[{k:'call',label:'Limp',sub:'trap'},{k:'raise',label:'Raise',sub:'2.5bb'}],
  best:1,
  nextSpotId:'h16b',
  why:`<b>เฉลย: Raise ปกติ</b> — limp-trap AA คือกับดักที่ดักตัวเอง: เชิญ multiway (AA ชอบ heads-up), เสีย initiative, และ mark ตัวเองทันทีที่ limp-reraise
  <br>เปิดเหมือนทุกมือใน range — ความ unreadable คือ value ที่ใหญ่ที่สุด`,
  deep:`<b>เจาะลึก</b><br>
  <b>• AA multiway:</b> equity ลดฮวบ (vs 1 คน ~85%, vs 4 คน ~55%) — limp เชิญสิ่งนี้
  <br><b>• Limp-reraise:</b> ใช้ได้เป็น exploit นานๆ ครั้งกับโต๊ะ aggro — ไม่ใช่ default`
},
{
  id:'h16b', cat:'preflop', step:'2/3', hidden:true,
  stage:'Early', stack:'100bb',
  pot:12, toCall:5.5,
  hero:['Ah','As'], heroLine:'UTG • 100bb',
  stacks:[['UTG',100],['MP',105]],
  streets:[{name:'Preflop', acts:[{pos:'YOU',a:'raise',amt:'2.5'},{pos:'MP',a:'3bet',amt:'8'},{pos:'CO…BB',a:'fold'}]}],
  q:'MP 3-bet เป็น 8 — AA deep 100bb เลือกอะไร?',
  opts:[{k:'call',label:'Call',sub:'trap'},{k:'raise',label:'4-Bet',sub:'19bb'}],
  best:1, ok:[0],
  nextSpotId:'h16c',
  why:`<b>เฉลย: 4-Bet 19</b> — ลึก 100bb เป้าหมายคือ "ให้เงินทั้งหมดลงกลางตอนเรานำ" — เริ่มสร้างตั้งแต่ตอนนี้. 4bet ขนาด ~2.4x ให้ room เขา call ด้วย QQ/JJ/AK ทั้งหมด
  <br>trap call ก็มีที่ใช้ (ok — vs คน 3bet bluff หนัก) แต่ default คือสร้าง pot`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Deep stack = สร้างเร็ว:</b> 100bb ถ้าเริ่มสร้างที่ flop จะใส่ไม่หมด — pot ต้องโตตั้งแต่ pre
  <br><b>• ขนาด 4bet:</b> ~2.3-2.5x ของ 3bet เมื่อ IP?? เรา OOP — 2.5x มาตรฐาน: เล็กพอเขา call กว้าง ใหญ่พอตั้ง jam ของ street ถัดไป`
},
{
  id:'h16c', cat:'postflop', step:'3/3', hidden:true,
  stage:'Early', stack:'100bb',
  pot:39.5, toCall:0,
  board:['Ks','9h','3d'], hero:['Ah','As'], heroLine:'UTG',
  stacks:[['UTG',100],['MP',105]],
  streets:[
    {name:'Preflop', acts:[{pos:'YOU',a:'raise',amt:'2.5'},{pos:'MP',a:'3bet',amt:'8'},{pos:'CO…BB',a:'fold'},{pos:'YOU',a:'4bet',amt:'19'},{pos:'MP',a:'call'}]},
    {name:'Flop', note:'ตาคุณ — OOP เล่นก่อน', acts:[]}
  ],
  q:'MP call 4bet. Flop K♠9♥3♦ ใน pot 39.5 (SPR ~2) — AA เล่นยังไง?',
  opts:[{k:'call',label:'Check',sub:'trap'},{k:'raise',label:'C-bet',sub:'⅓ (13)'}],
  best:1, ok:[0],
  reveal:{pos:'MP', cards:['Qh','Qc'], note:'เปิด QQ ที่ overplay<br>— AA เราชนะ pot ยักษ์'},
  why:`<b>เฉลย: C-bet ⅓</b> — SPR ~2 ใน 4bet pot = เงินจะลงหมดอยู่แล้ว แค่หาทางที่เนียนที่สุด. เบท ⅓ ให้ QQ/JJ "ทนไม่ไหวแต่ก็ fold ไม่ลง" และให้ AK ตามมาเต็มก้อน
  <br><br>🏁 <b>จบมือ:</b> เราเบท 13 — MP <b>jam 86bb!</b> (overplay คลาสสิกของ QQ ที่ "เบื่อโดน K ขู่"). เรา snap call. MP เปิด <b>Q♥Q♣</b>. Turn 6♠ river 2♦ — <b>AA ยืน เก็บ pot ~200bb</b> 🚀 เกือบ double ตั้งแต่ early stage
  <br><br>สังเกต: เราไม่ได้ทำอะไรพิสดารเลยทั้งมือ — เปิดปกติ, 4bet ปกติ, เบทปกติ. มือใหญ่ + line ตรงไปตรงมา = เงินเข้าเอง`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• SPR หลัง 4bet:</b> pot 39.5, เหลือ ~81 → SPR 2 = ไม่มี fold อีกแล้วสำหรับ overpair ทั้งสองฝั่ง. การวางแผนไซส์ตั้งแต่ pre ทำให้ตรงนี้ "อัตโนมัติ"
  <br><b>• ยืนยัน:</b> บน K93-6-2: AA แพ้แค่ 121/990 (KK/99/33 sets + two pairs ที่ไม่อยู่ใน range 3bet เขา) — vs QQ/JJ/AK เรานำขาด
  <br><b>• ฝั่งเขาพลาดตรงไหน:</b> QQ เจอ 4bet ควร "call แล้วเล่นระวังบน K-high" — การ jam คือเปลี่ยน bluff-catcher เป็นเป้านิ่ง
  <br><b>• ถ้า flop เป็น Q-high:</b> เขา set เรา... ก็จ่าย — SPR 2 ไม่มีใครหนี set ได้ นั่นคือ variance ไม่ใช่ความผิด`
},

// Hand 17 — KK เจอ A บนฟลอป: เปลี่ยนโหมดจาก value เป็น bluff-catcher
{
  id:'h17a', cat:'preflop', step:'1/3',
  stage:'Mid Stage', stack:'35bb',
  pot:6.1, toCall:1.8,
  hero:['Ks','Kh'], heroLine:'SB • 35bb',
  stacks:[['CO',38],['BTN',40],['SB',35]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'},{pos:'BTN',a:'call'}]}],
  q:'KK ใน SB — CO เปิด + BTN call มาแล้ว. squeeze เท่าไร?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'1.8bb'},{k:'raise',label:'Squeeze',sub:'11bb'}],
  best:2,
  nextSpotId:'h17b',
  why:`<b>เฉลย: Squeeze 11</b> — KK + dead money สองก้อน = squeeze ตามตำรา: ขนาดใหญ่ (4-5x) เพราะ OOP + มีคน call มาแล้ว. flat KK ตรงนี้คือเชิญ BB เข้ามาเล่น 4-way ด้วยมือที่ดีที่สุดอันดับสองของเกม
  <br>ใครจ่ายก็ได้เงิน ใคร fold ก็ได้ 6bb ฟรี`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ขนาด squeeze:</b> สูตร: 4x open + 1x ต่อ caller เมื่อ OOP → 2.3×4 + 2.3 ≈ 11 ✓
  <br><b>• อันตรายของ flat:</b> multiway + OOP + ไม่มี initiative = KK เล่นยากแบบไม่จำเป็น`
},
{
  id:'h17b', cat:'postflop', step:'2/3', hidden:true,
  stage:'Mid Stage', stack:'35bb',
  pot:25.3, toCall:0,
  board:['Ad','7s','4c'], hero:['Ks','Kh'], heroLine:'SB',
  stacks:[['CO',38],['BTN',40],['SB',35]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'},{pos:'BTN',a:'call'},{pos:'YOU',a:'squeeze',amt:'11'},{pos:'BB',a:'fold'},{pos:'CO',a:'call'},{pos:'BTN',a:'fold'}]},
    {name:'Flop', note:'ตาคุณ — OOP เล่นก่อน', acts:[]}
  ],
  q:'CO call squeeze. Flop A♦7♠4♣ — <b>ใบ A ทับ KK พอดี</b>. เล่นยังไง?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'C-bet',sub:'⅓ (8.5)'},{k:'raise',label:'C-bet',sub:'⅔ (17)'}],
  best:0, ok:[1],
  nextSpotId:'h17c',
  why:`<b>เฉลย: Check</b> — A บนฟลอปเปลี่ยนสถานะ KK ทันที: จาก "มือ value" เป็น <span class="k">bluff-catcher</span>. เบทไปได้อะไร? Ax ไม่ fold (เราเผาเงิน), มือต่ำกว่า fold (ไม่ได้ value)
  <br>check ทำสองอย่าง: คุม pot ขนาดที่ bluff-catcher รับได้ + เปิดทางให้เขา bluff มือที่แพ้เรา (JJ/TT/QJ)`,
  deep:`<b>เจาะลึก</b><br>
  <b>• สูตรเมื่อ overpair โดน overcard ทับ:</b> ถามว่า "เบทแล้วมือไหนจ่ายที่แพ้เรา?" ถ้าคำตอบว่างเปล่า → check
  <br><b>• CO call squeeze range:</b> TT-QQ, AQ/AJs, KQs — ส่วน Ax เขาน้อยกว่าที่กลัว (AK มัก 4bet) แต่ก็มี
  <br><b>• แผนทั้งมือ:</b> check-call ขนาดเล็ก-กลาง 1-2 street / fold ต่อ aggression หนักต่อเนื่อง`
},
{
  id:'h17c', cat:'postflop', step:'3/3', hidden:true,
  stage:'Mid Stage', stack:'35bb',
  pot:39.3, toCall:14,
  board:['Ad','7s','4c','8c','3d'], hero:['Ks','Kh'], heroLine:'SB',
  stacks:[['CO',38],['BTN',40],['SB',35]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'},{pos:'BTN',a:'call'},{pos:'YOU',a:'squeeze',amt:'11'},{pos:'BB',a:'fold'},{pos:'CO',a:'call'},{pos:'BTN',a:'fold'}]},
    {name:'Flop', acts:[{pos:'YOU',a:'check'},{pos:'CO',a:'check'}]},
    {name:'Turn', acts:[{pos:'YOU',a:'check'},{pos:'CO',a:'check'}]},
    {name:'River', acts:[{pos:'YOU',a:'check'},{pos:'CO',a:'bet',amt:'14'}]}
  ],
  q:'เช็คกันมาสองสตรีท (A74-8-3) — river CO เพิ่งเบท 14. KK call ไหม?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'14bb'}],
  best:1,
  reveal:{pos:'CO', cards:['Jh','Th'], note:'เปิด float ที่พลาดทุกอย่าง<br>— KK จับ bluff สำเร็จ'},
  why:`<b>เฉลย: Call</b> — อ่าน line เขา: ถ้ามี Ax จริง <b>ทำไมเช็คผ่าน flop และ turn ทั้งสองครั้ง?</b> Ax ใน squeeze pot อยากเบทเก็บ value ก่อน river. การตื่นมาเบทตอนใบสุดท้ายหลังเงียบสองสตรีท = มือที่ "เพิ่งตัดสินใจว่าต้องชนะด้วยการเบท" — bluff หนักๆ
  <br>เราบีตทุก bluff (JJ/TT/QJ/KQ ที่ float) และราคา 14 เข้า 53 ขอแค่ ~26%
  <br><br>🏁 <b>จบมือ:</b> CO โชว์ <b>J♥T♥</b> — float ที่พลาดทุกอย่างแล้วขอ stab เดียวจบ. <b>KK เก็บ pot ~53bb</b> ด้วยการ "ไม่ทำอะไรเลย" สองสตรีทแล้ว call เดียว`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• สามเหตุผลที่ call ง่าย:</b> (1) line เขาขัดแย้งกับ Ax (2) เราบล็อก KQ/KJ บางส่วน?? — ไม่: เราถือ K สอง = บล็อก KQ/KJ ที่เป็น bluff ของเขา... นั่นแย่สำหรับเรานิดหน่อย แต่ (3) ราคา 26% ชดเชยเหลือเฟือ — มือที่เช็คสองรอบแล้วเบท = bluff เกิน 26% เสมอในประชากรผู้เล่นจริง
  <br><b>• ยืนยัน:</b> KK บน A7483 แพ้ Ax ทุกตัว (90 combos) + sets/two pair — แต่ range "เช็ค-เช็ค-เบท" ของเขาแทบไม่มีพวกนั้น. Range > combo ดิบ
  <br><b>• บทเรียนใหญ่:</b> มือแข็งที่โดน scare card ไม่ต้อง "เลิกเล่น" — เปลี่ยนบทบาทจากพระเอกบู๊เป็นยามเฝ้าประตู
  <br><b>• Hand summary:</b> squeeze → check → check → call = เส้นที่เสียน้อยสุดเมื่อแพ้ (เจอ Ax จริงเสียแค่ 25) และชนะบ่อยสุดเมื่อชนะ`
},

// Hand 18 — Bubble big stack: semibluff ที่กลายเป็น flush — และ short stack ที่หมดทางถอย
{
  id:'h18a', cat:'preflop', step:'1/3',
  stage:'Bubble', stack:'50bb', icm:true,
  icmState:'🫧 <b>BUBBLE</b> · เราคือ big stack (50bb) — เครื่องมือกดดันครบมือ · BB เหลือ 18bb',
  pot:1.5, toCall:0,
  hero:['6c','5c'], heroLine:'BTN • 50bb',
  stacks:[['BTN',50],['BB',18]],
  streets:[{name:'Preflop', acts:[{pos:'UTG…CO',a:'fold'}]}],
  q:'65s บน BTN — เราเป็น big stack ช่วง bubble, BB เหลือ 18bb. เปิดไหม?',
  opts:[{k:'fold',label:'Fold'},{k:'raise',label:'Raise',sub:'2.5bb'}],
  best:1,
  nextSpotId:'h18b',
  why:`<b>เฉลย: Raise — หน้าที่ของ big stack</b> — ช่วง bubble big stack ที่ไม่ steal คือการทิ้งเงินบนโต๊ะ: ทุกคนที่ cover ไม่ได้ต้อง fold มือเกือบทั้งหมดให้เรา
  <br>65s ยังมี playability เผื่อโดน call — ไม่ใช่ any-two แบบมั่ว แต่เปิดด้วยเหตุผลเดียวกัน`,
  deep:`<b>เจาะลึก</b><br>
  <b>• คณิตของ bubble steal:</b> เปิด 2.5 ชิง 1.5+antes — ถ้าเขา fold >60% (ซึ่ง bubble ทำให้จริง) = กำไรทันทีไม่ต้องเห็น flop
  <br><b>• เลือกเหยื่อ:</b> BB 18bb คือโซนเจ็บสุด — ใหญ่พอไม่อยาก gamble, เล็กพอโดน blind กิน`
},
{
  id:'h18b', cat:'postflop', step:'2/3', hidden:true,
  stage:'Bubble', stack:'50bb', icm:true,
  icmState:'🫧 <b>BUBBLE</b> · เราคือ big stack (50bb) — เครื่องมือกดดันครบมือ · BB เหลือ 18bb',
  pot:5.5, toCall:0,
  board:['Tc','7d','3c'], hero:['6c','5c'], heroLine:'BTN',
  stacks:[['BTN',50],['BB',18]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG…CO',a:'fold'},{pos:'YOU',a:'raise',amt:'2.5'},{pos:'SB',a:'fold'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'}]}
  ],
  q:'BB ยอม call. Flop T♣7♦3♣ — เราได้ flush draw + gutshot (ใบ 4). BB เช็ค — กดต่อไหม?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'Bet',sub:'⅔ (3.7)'}],
  best:1, ok:[0],
  nextSpotId:'h18c',
  why:`<b>เฉลย: Bet ⅔</b> — มือเรามี equity จริง (9 club outs + 4 gutshot ≈ 12 outs) + สถานการณ์ bubble ที่ BB เล่น fit-or-fold — ส่วนผสมของ semibluff สมบูรณ์
  <br>เขา fold ทันที = ดี. เขา call = เรายังมีไพ่ทั้งเด็คช่วย`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Equity เมื่อโดน call:</b> ~45% vs top pair — bubble semibluff ที่ "ติดก็ไม่ตาย"
  <br><b>• BB 18bb เจอเบทนี้:</b> ต้องตัดสินใจระดับ "ทัวร์ทั้งใบ" ด้วยมือกลางๆ — แรงกดที่เงินจริงซื้อไม่ได้`
},
{
  id:'h18c', cat:'postflop', step:'3/3', hidden:true,
  stage:'Bubble', stack:'50bb', icm:true,
  icmState:'🫧 <b>BUBBLE</b> · เราคือ big stack (50bb) — เครื่องมือกดดันครบมือ · BB เหลือ 18bb',
  pot:24.7, toCall:11.8,
  board:['Tc','7d','3c','4c'], hero:['6c','5c'], heroLine:'BTN',
  stacks:[['BTN',50],['BB',18]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG…CO',a:'fold'},{pos:'YOU',a:'raise',amt:'2.5'},{pos:'SB',a:'fold'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'},{pos:'YOU',a:'cbet',amt:'3.7'},{pos:'BB',a:'call'}]},
    {name:'Turn', acts:[{pos:'BB',a:'shove',amt:'11.8'}]}
  ],
  q:'Turn 4♣ — <b>เราได้ FLUSH (T-high) + straight!</b> BB จู่ๆ jam ที่เหลือทั้งหมด (11.8) — call ใช่ไหม?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call all-in'}],
  best:1,
  reveal:{pos:'BB', cards:['7h','7s'], note:'เปิด set of sevens<br>— แพ้ flush เรา, bubble แตก'},
  why:`<b>เฉลย: Call (เร็วๆ)</b> — turn 4♣ เติมให้เราสองชั้น: club flush + straight 3-4-5-6-7. brute-force ยืนยัน: มีแค่ <b>28 combos จาก 990</b> ที่บีตเรา (flush ที่สูงกว่าเท่านั้น)
  <br>BB jam 11.8 เข้า 24.7 หลังจาก check-call มา = มือประเภท top pair ที่ "พอแล้ว ขอวัดเลย", two pair, set, หรือ A♣X semibluff — เกือบทั้งหมดแพ้เราแล้ว. ราคา 11.8 เข้า 36.5 ขอ ~32% — เรามีเกิน 90%
  <br><br>🏁 <b>จบมือ:</b> BB เปิด <b>7♥7♠ (set of sevens)</b> — ต้องการ board pair เท่านั้น. River 9♥ เปล่า → <b>flush ชนะ BB bust = BUBBLE แตก!</b> โต๊ะปรบมือ ทุกคนเข้าเงิน — และเราขึ้น ~75bb 👑`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• ทำไมมือนี้เกิดขึ้น:</b> ย้อนกลับ: steal เปิดกว้าง → semibluff มี equity → การ์ดเข้า. ทุกขั้นถูกต้องโดยไม่ต้องรู้อนาคต — กำไรมาจาก "เล่นในจุดที่ทุก outcome ไม่เลว"
  <br><b>• ฝั่ง BB:</b> set check-call บน flush draw board ช่วง bubble แล้ว jam ตอน flush เข้า = เส้นที่เจ็บมาก... GTO บอกเขาควร raise flop protect ตั้งแต่แรก — บทเรียนฟรีของคนดู
  <br><b>• flush T-high กลัวไหม:</b> ใน vacuum แพ้ A♣/K♣/Q♣/9♣8♣ combos — แต่ BB 18bb ที่ check-call flop แทบไม่มี nut flush ใน range (มี = เขา jam flop ไปแล้วบ่อยๆ)
  <br><b>• Hand summary:</b> 2.5 → 3.7 → call 11.8 = ลงทุน 18bb เก็บ ~43bb และพา bubble แตกด้วยมือ 65s`
},

// Hand 19 — FT 4 คน: rejam TT — มาตรฐานที่ห้ามลังเล (จบใน 1 การตัดสินใจ)
{
  id:'h19', cat:'preflop', step:'1/1',
  stage:'Final Table', stack:'16bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 4 คน · BTN (40bb) เปิดมา 2.2 · pay jump ถัดไป = อันดับ 3',
  pot:3.7, toCall:1.2,
  hero:['Th','Tc'], heroLine:'BB • 16bb',
  stacks:[['BTN',40],['BB',16]],
  streets:[{name:'Preflop', acts:[{pos:'BTN',a:'raise',amt:'2.2'},{pos:'SB',a:'fold'}]}],
  q:'TT ใน BB, 16bb, FT เหลือ 4 คน — BTN (chip leader) เปิดมา. ตัดสินใจ?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'1.2bb'},{k:'shove',label:'All-in',sub:'16bb'}],
  best:2, ok:[1],
  reveal:{pos:'BTN', cards:['Ad','Kh'], note:'เปิด AK — race<br>— TT เรายืน, double up'},
  why:`<b>เฉลย: All-in</b> — TT 16bb vs BTN steal (เปิดกว้างมากตอน 4-handed) = rejam ทุกตำรา ทุก solver ทุก ICM model. มือเราแข็งเกิน fold ชัด และ flat OOP คือเชิญ flop overcard มาทำลายมือ (A/K/Q/J ลง ~57% ของ flop)
  <br>jam บังคับ BTN ทิ้ง steal ทั้งหมด (เก็บ 3.7 ฟรี) หรือ call แบบเป็นรอง
  <br><br>🏁 <b>จบมือ:</b> BTN call ด้วย A♦K♥ (ราคาบังคับเขา). Board 6♠5♦2♦ Q♣ 3♣ — sweat ทุกใบ... <b>TT ยืน! double เป็น ~33bb</b> ขึ้นอันดับ 2 ทันที — จาก "รอตาย" เป็น "ล่าแชมป์" ในมือเดียว`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไมไม่ flat:</b> 16bb OOP เจอ overcard flop แล้วทำอะไร? check-fold = เสีย 1.2 ฟรี, check-call = เดาทาง. jam ตัดทุกปัญหา + เก็บ fold equity ~50-60%
  <br><b>• ICM 4-handed:</b> ใช่ pay jump มีจริง — แต่ TT vs BTN-open range อยู่เหนือ threshold สบาย (มือที่เริ่ม close คือ 66/A9s ไม่ใช่ TT)
  <br><b>• ยืนยัน runout:</b> 652Q3 — AK พลาดหมด (verifier: TT ชนะ 618/990 รวม... และชนะ AK เฉพาะนี้แน่นอน)
  <br><b>• ถ้าแพ้:</b> ตกรอบอันดับ 4 ด้วยการเล่นที่ถูก — รับได้เสมอ. ถ้า fold TT ตรงนี้ซ้ำๆ = ตายช้าๆ แบบไม่มีลุ้นแชมป์`
},

// Hand 20 — KK vs check-raise all-in บน flush draw board: เลขชนะความกลัว
{
  id:'h20a', cat:'preflop', step:'1/3',
  stage:'Mid Stage', stack:'55bb',
  pot:11.3, toCall:6.2,
  hero:['Kc','Kd'], heroLine:'CO • 55bb',
  stacks:[['CO',55],['BB',60]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'YOU',a:'raise',amt:'2.3'},{pos:'BTN SB',a:'fold'},{pos:'BB',a:'3bet',amt:'8.5'}]}],
  q:'เราเปิด KK ที่ CO โดน BB (ตัว aggro) 3-bet — เลือกอะไร?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'trap'},{k:'raise',label:'4-Bet',sub:'18bb'}],
  best:2, ok:[1],
  nextSpotId:'h20b',
  why:`<b>เฉลย: 4-Bet</b> — vs ผู้เล่น aggro ที่ 3bet กว้าง: 4bet คือการเก็บ value จาก range ที่กว้างนั้นทันทีก่อนเขาเห็น flop แล้วถอย. trap call ก็เล่นได้ (ok) แต่เสี่ยง board A ทับ + ปล่อย equity ฟรีให้มือ junk เขา
  <br>ขนาด 18 (~2.1x) — เล็กพอให้เขา call/jam ด้วยมือที่แพ้`,
  deep:`<b>เจาะลึก</b><br>
  <b>• vs aggro:</b> มือ value ต้องรีดตอน range เขายังกว้าง — ทุก street ที่ผ่านไป range เขาแคบลงและฉลาดขึ้น
  <br><b>• ถ้าโดน jam กลับ:</b> snap call — KK ไม่ fold pre vs aggro เด็ดขาด`
},
{
  id:'h20b', cat:'postflop', step:'2/3', hidden:true,
  stage:'Mid Stage', stack:'55bb',
  pot:36.5, toCall:0,
  board:['Qh','6h','2c'], hero:['Kc','Kd'], heroLine:'CO',
  stacks:[['CO',55],['BB',60]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'YOU',a:'raise',amt:'2.3'},{pos:'BTN SB',a:'fold'},{pos:'BB',a:'3bet',amt:'8.5'},{pos:'YOU',a:'4bet',amt:'18'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'}]}
  ],
  q:'BB call 4bet. Flop Q♥6♥2♣ (สองหัวใจ) BB เช็ค — KK เล่นยังไง?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'C-bet',sub:'⅓ (12)'}],
  best:1,
  nextSpotId:'h20c',
  why:`<b>เฉลย: C-bet ⅓</b> — overpair ใน 4bet pot บน board ต่ำกว่า K = เบทต่อเนื่องชัดเจน: value จาก QX/JJ/TT + charge หัวใจ. SPR ต่ำ (~1) — เงินกำลังจะลงหมดอยู่แล้ว
  <br>ไซส์เล็กพอให้ทุกมือใน range เขา "ตามได้อีกนิด" ซึ่งคือสิ่งที่เราต้องการ`,
  deep:`<b>เจาะลึก</b><br>
  <b>• BB call-4bet range:</b> QQ/JJ/TT, AQ, AK, A♥X♥ บ้าง — เรานำเกือบหมด (แพ้แค่ QQ set)
  <br><b>• SPR ~1:</b> ไม่มีการ fold overpair อีกแล้ว — แค่เลือกว่าเงินลงตอนไหน`
},
{
  id:'h20c', cat:'postflop', step:'3/3', hidden:true,
  stage:'Mid Stage', stack:'55bb',
  pot:90.5, toCall:30,
  board:['Qh','6h','2c'], hero:['Kc','Kd'], heroLine:'CO',
  stacks:[['CO',55],['BB',60]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'YOU',a:'raise',amt:'2.3'},{pos:'BTN SB',a:'fold'},{pos:'BB',a:'3bet',amt:'8.5'},{pos:'YOU',a:'4bet',amt:'18'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'},{pos:'YOU',a:'cbet',amt:'12'},{pos:'BB',a:'shove',amt:'42'}]}
  ],
  q:'BB <b>check-raise ALL-IN 42bb!</b> — KK ต้องจ่ายอีก 30 เข้า pot 90.5. ใจสั่นแต่... ?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call all-in'}],
  best:1,
  reveal:{pos:'BB', cards:['Ah','4h'], note:'เปิด nut flush draw ที่พลาด<br>— KK เราชนะ'},
  why:`<b>เฉลย: Call (เลขไม่ให้ fold)</b> — ราคา 30 เพื่อชิง 120.5 = ขอแค่ <b>25%</b>. มือเดียวที่ทำให้เราเป็นรองหนักคือ QQ (set) ซึ่งมี 3 combos — ในขณะที่ range jam ของ aggro ตรงนี้เต็มไปด้วย: A♥X♥ (nut FD ~จำนวนมาก), AQ (top pair), JJ/TT ที่จาม, AK panic
  <br>vs range นั้น KK มี ~65-70% — fold คือให้ความกลัวเซ็นเช็ค
  <br><br>🏁 <b>จบมือ:</b> BB เปิด <b>A♥4♥</b> — nut flush draw (เขามี ~38%, เล่นไม่ผิดด้วย fold equity). Turn 9♦... river 7♣ — <b>หัวใจไม่มา! KK เก็บ pot ~120bb</b> เป็น big stack ของโต๊ะทันที`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• Math ที่ต้องคิดให้ทันใน 30 วินาที:</b> ขอ 25% → แพ้ขาดแค่ QQ (3 combos), flip-ish vs A♥X♥ (เรา ~62%), ชนะขาด AQ/JJ/TT/AK. ถ่วงน้ำหนัก → ~67% → call ห่างเส้นมาก
  <br><b>• ยืนยัน showdown:</b> Qh6h2c-9d-7c: KK แพ้ 143/990 (sets, two pair, 85-straight) — A4 หัวใจพลาด = A-high
  <br><b>• ทำไม 4bet pre ทำให้ตรงนี้ง่าย:</b> pot ใหญ่ตั้งแต่ pre = SPR ต่ำ = การตัดสินใจสุดท้ายเป็น "เลขล้วน" ไม่มีชั้นเชิง. มือใหญ่ชอบ pot ที่โตเร็ว
  <br><b>• ถ้าเจอ QQ:</b> ก็จ่าย — overpair vs set ใน pot SPR 1 ไม่มีใครในโลกหนีได้`
},

// Hand 21 — Monster draw 15 outs: raise → barrel → พลาดหมด → bluff ปิดจ๊อบ
{
  id:'h21a', cat:'preflop', step:'1/4',
  stage:'Mid Stage', stack:'70bb',
  pot:3.8, toCall:2.3,
  hero:['Jc','Tc'], heroLine:'BTN • 70bb',
  stacks:[['CO',72],['BTN',70]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'}]}],
  q:'JTs บน BTN เจอ CO เปิด, 70bb deep — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'2.3bb'},{k:'raise',label:'3-Bet',sub:'7.5bb'}],
  best:1, ok:[2],
  nextSpotId:'h21b',
  why:`<b>เฉลย: Call</b> — JTs IP ลึกๆ คือมือ flat ที่สมบูรณ์แบบ: เชื่อมต่อกับทุก broadway board, ทำ nut straight ได้สองทาง, เล่นหลัง flop ง่าย
  <br>3bet ก็ mix ได้ — แต่มือนี้ "อยากเห็น flop" มากกว่ามือไหนๆ`,
  deep:`<b>เจาะลึก</b><br>
  <b>• JTs คือราชา playability:</b> straight ได้ 4 แบบ (AKQ/KQ9/Q98/987 + JT), flush, two pair ที่ connect
  <br><b>• Deep + IP:</b> implied odds เต็มก้อน — มือแบบนี้ทำเงินจากความลึก`
},
{
  id:'h21b', cat:'postflop', step:'2/4', hidden:true,
  stage:'Mid Stage', stack:'70bb',
  pot:10.1, toCall:4,
  board:['Kc','Qc','4d'], hero:['Jc','Tc'], heroLine:'BTN',
  stacks:[['CO',72],['BTN',70]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'},{pos:'YOU',a:'call'},{pos:'SB BB',a:'fold'}]},
    {name:'Flop', acts:[{pos:'CO',a:'cbet',amt:'4'}]}
  ],
  q:'Flop K♣Q♣4♦ — <b>monster draw:</b> OESD (A/9 = straight) + flush draw ♣ + สอง straight-flush outs! CO c-bet — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'4bb'},{k:'raise',label:'Raise',sub:'12bb'}],
  best:2, ok:[1],
  nextSpotId:'h21c',
  why:`<b>เฉลย: Raise</b> — นับ outs: A/9 ×8 (straight) + ♣ ×9 (flush) - ซ้ำ 2 = <b>15 outs ≈ 54% vs top pair!</b> มือที่ "เป็นต่อทุกมือเดียว" ไม่ใช่ draw — มันคือมือที่ดีที่สุดบนโต๊ะตอนนี้
  <br>raise: ชนะใหญ่ทุกทาง — เขา fold = เก็บเลย, เขา call = เรายังเป็นต่อ/เสมอ, เขา jam = เรา call ด้วยความยินดี`,
  deep:`<b>เจาะลึก</b><br>
  <b>• A♣/9♣ = straight flush:</b> สอง outs ที่ "ไม่มีทางแพ้แม้เจอ nuts ของเขา"
  <br><b>• เทียบ call:</b> call ก็กำไร (ok) แต่ปล่อย initiative — มือ 54% ควรเป็นฝ่ายใส่เงิน ไม่ใช่ฝ่ายตาม`
},
{
  id:'h21c', cat:'postflop', step:'3/4', hidden:true,
  stage:'Mid Stage', stack:'70bb',
  pot:30.1, toCall:0,
  board:['Kc','Qc','4d','7h'], hero:['Jc','Tc'], heroLine:'BTN',
  stacks:[['CO',72],['BTN',70]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'},{pos:'YOU',a:'call'},{pos:'SB BB',a:'fold'}]},
    {name:'Flop', acts:[{pos:'CO',a:'cbet',amt:'4'},{pos:'YOU',a:'raise',amt:'12'},{pos:'CO',a:'call'}]},
    {name:'Turn', acts:[{pos:'CO',a:'check'}]}
  ],
  q:'CO call raise แล้วเช็ค turn 7♥ (brick) — เอาไงต่อกับ 15 outs ของเรา?',
  opts:[{k:'call',label:'Check',sub:'รับใบฟรี'},{k:'raise',label:'Bet',sub:'⅔ (20)'}],
  best:1, ok:[0],
  nextSpotId:'h21d',
  why:`<b>เฉลย: Bet ⅔</b> — เขาเช็คหลัง call-raise = ยกธงขาวครึ่งผืน (Kx kicker กลาง, QJ, 88-JJ). barrel ตอนนี้: (1) fold equity จริงจัง — มือพวกนั้นเกลียดเบทที่สอง (2) เมื่อโดน call เรายังมี 15 outs (3) ตั้งสถานการณ์ river jam ที่เขารับไม่ไหว
  <br>รับใบฟรีก็ไม่ผิด (ok) — แต่มือ equity สูงขนาดนี้ "ฟรี" คือราคาที่แพงเกินไป`,
  deep:`<b>เจาะลึก</b><br>
  <b>• สองเครื่องยนต์:</b> fold equity + card equity — barrel ด้วย 15 outs ไม่ใช่ bluff มันคือ "เบทที่ชนะสองแบบ"
  <br><b>• แผน river:</b> ตี = เบท value เต็มๆ. พลาด = ตัดสินใจที่ step ถัดไป (สำคัญ: คิดไว้ก่อนแล้ว)`
},
{
  id:'h21d', cat:'postflop', step:'4/4', hidden:true,
  stage:'Mid Stage', stack:'70bb',
  pot:70.1, toCall:0,
  board:['Kc','Qc','4d','7h','2d'], hero:['Jc','Tc'], heroLine:'BTN',
  stacks:[['CO',72],['BTN',70]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.3'},{pos:'YOU',a:'call'},{pos:'SB BB',a:'fold'}]},
    {name:'Flop', acts:[{pos:'CO',a:'cbet',amt:'4'},{pos:'YOU',a:'raise',amt:'12'},{pos:'CO',a:'call'}]},
    {name:'Turn', acts:[{pos:'CO',a:'check'},{pos:'YOU',a:'bet',amt:'20'},{pos:'CO',a:'call'}]},
    {name:'River', acts:[{pos:'CO',a:'check'}]}
  ],
  q:'River 2♦ — <b>15 outs พลาดเกลี้ยง</b> เหลือ J-high. CO เช็คมา. pot 70 เราเหลือ 35.7 — ยอมหรือยิง?',
  opts:[{k:'call',label:'Check',sub:'ยอมแพ้'},{k:'shove',label:'All-in',sub:'35.7bb'}],
  best:1,
  reveal:{pos:'CO', cards:['Kd','9d'], note:'fold top pair แล้วหงายไพ่<br>— bluff เราสำเร็จ'},
  why:`<b>เฉลย: All-in</b> — ตรรกะเดิมจาก Hand 4 แต่ stake สูงกว่า: J-high ชนะอะไรที่ showdown? <b>ไม่มี</b> (brute-force: แพ้ 701/990 — ทุก pair บีตเรา). check = ยกธง 70bb ทิ้ง
  <br>ในขณะที่ story เราตรงเป๊ะทุกตัวอักษร: raise flop + barrel turn + jam river บน K♣Q♣ = "ผมมี KQ/sets/AK มาตลอด" และมือเขา (Kx อ่อน, Qx, JJ) เจอ jam 36 เข้า 70 ต้อง call 25% ของ stack ด้วย bluff-catcher... หลังเราโชว์ความแข็งสามสตรีท
  <br><br>🏁 <b>จบมือ:</b> CO เข้า tank ยาว... ทิ้ง <b>K♦9♦ (top pair!)</b> หงายขึ้นมาด้วยความภูมิใจ — เราเก็บ pot 70bb เงียบๆ ไม่ต้องโชว์อะไร 🎭`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• ทำไมมือนี้คือ "บลัฟบังคับ":</b> มือเราอยู่ก้นสุดของ range (J-high) = ไม่มี showdown value เลย → ค่าเสียโอกาสของการ check คือ pot ทั้งก้อน. มือกลางๆ (เช่น A-high) ต่างหากที่ check ได้
  <br><b>• Blocker วิเศษ:</b> เราถือ J♣T♣ = บล็อก JT (straight ที่เข้า?? ไม่มี — A/9 ไม่มา)... ที่สำคัญกว่า: บล็อก J♣/T♣ flush combos ที่เขาอาจ call ด้วย — และบน board สองคลับ flush เขาเป็นไปไม่ได้อยู่แล้ว
  <br><b>• คณิต:</b> jam 35.7 ชิง 70 → breakeven ที่ fold ~34%. Kx-อ่อน/Qx/pairs ของเขา fold มากกว่านั้นแน่นอนเจอ line นี้
  <br><b>• สมมาตรกับมือที่ตี:</b> ถ้า river เป็น ♣/A/9 เราก็ jam เหมือนกันเป๊ะ — นี่คือสิ่งที่ทำให้ jam นี้ "unexploitable" ไม่ใช่การเดา. line เดียว สอง outcome`
},

// Hand 22 — Bubble: top pair vs jam บนใบ flush — fold ที่เจ็บแต่ถูก
{
  id:'h22a', cat:'preflop', step:'1/4',
  stage:'Bubble', stack:'25bb', icm:true,
  icmState:'🫧 <b>BUBBLE</b> · SB คือ chip leader (60bb) cover ทั้งโต๊ะ · เราอันดับกลาง',
  pot:4, toCall:2,
  hero:['As','Ts'], heroLine:'BB • 25bb',
  stacks:[['SB',60],['BB',25]],
  streets:[{name:'Preflop', acts:[{pos:'UTG…BTN',a:'fold'},{pos:'SB',a:'raise',amt:'3'}]}],
  q:'ATs ใน BB เจอ SB (chip leader) เปิด 3x ช่วง bubble — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'2bb'},{k:'raise',label:'3-Bet',sub:'9bb'}],
  best:1, ok:[2],
  nextSpotId:'h22b',
  why:`<b>เฉลย: Call</b> — ATs vs SB กว้างๆ = มือเราดีเกิน fold เยอะ. แต่ 3bet vs คนเดียวที่ bust เราได้ตอน bubble = เปิดประตูให้เขา jam ทับด้วย leverage ที่เราไม่อยากเจอ
  <br>call ใช้ position (เราอยู่หลังเขาทุก street) เล่น pot ขนาดที่เราคุมเอง`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Leverage ของ cover ตอน bubble:</b> ทุกการ raise ของเราเชิญ "คำถาม 25bb" ที่เราไม่อยากตอบ — เล่นแบบที่คำถามมาไม่ถึง
  <br><b>• ATs IP postflop:</b> มือ realize equity เก่ง — call คือใช้จุดแข็งนั้น`
},
{
  id:'h22b', cat:'postflop', step:'2/4', hidden:true,
  stage:'Bubble', stack:'25bb', icm:true,
  icmState:'🫧 <b>BUBBLE</b> · SB คือ chip leader (60bb) cover ทั้งโต๊ะ · เราอันดับกลาง',
  pot:9, toCall:3,
  board:['Ah','9c','5c'], hero:['As','Ts'], heroLine:'BB',
  stacks:[['SB',60],['BB',25]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG…BTN',a:'fold'},{pos:'SB',a:'raise',amt:'3'},{pos:'YOU',a:'call'}]},
    {name:'Flop', acts:[{pos:'SB',a:'cbet',amt:'3'}]}
  ],
  q:'Flop A♥9♣5♣ — top pair. SB c-bet ½ — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'3bb'},{k:'raise',label:'Raise'}],
  best:1,
  nextSpotId:'h22c',
  why:`<b>เฉลย: Call</b> — top pair kicker กลางๆ vs range กว้าง: มือ bluff-catch มาตรฐาน. raise ไล่ทุกมือที่แพ้เรา + เปิดศึกกับคนที่ bust เราได้
  <br>เส้นทางของมือนี้: call แล้วประเมินทีละ street ด้วยตาเปิด`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไมไม่ raise protect:</b> board มี club draw จริง แต่ "protect" ด้วยการ raise = isolate ตัวเองกับมือที่บีตเรา (AK/AQ/AJ/two pair)
  <br><b>• ระวังล่วงหน้า:</b> ใบ ♣ ที่ turn/river จะเป็นจุดตัดสินใจจริงของมือนี้`
},
{
  id:'h22c', cat:'postflop', step:'3/4', hidden:true,
  stage:'Bubble', stack:'25bb', icm:true,
  icmState:'🫧 <b>BUBBLE</b> · SB คือ chip leader (60bb) cover ทั้งโต๊ะ · เราอันดับกลาง',
  pot:21, toCall:9,
  board:['Ah','9c','5c','7d'], hero:['As','Ts'], heroLine:'BB',
  stacks:[['SB',60],['BB',25]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG…BTN',a:'fold'},{pos:'SB',a:'raise',amt:'3'},{pos:'YOU',a:'call'}]},
    {name:'Flop', acts:[{pos:'SB',a:'cbet',amt:'3'},{pos:'YOU',a:'call'}]},
    {name:'Turn', acts:[{pos:'SB',a:'bet',amt:'9'}]}
  ],
  q:'Turn 7♦ — SB barrel ¾ pot. top pair ของเรายังยืนไหวไหม?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'9bb'},{k:'raise',label:'Raise/Jam'}],
  best:1, ok:[0],
  nextSpotId:'h22d',
  why:`<b>เฉลย: Call (ด้วยแผนชัด)</b> — chip leader barrel กว้างที่สุดตอน bubble — fold top pair ตรงนี้คือยอมเป็น ATM ของเขา. ราคา 9 เข้า 30 = 30% ซึ่ง A-T มีเหลือเฟือ vs range barrel (Ax น้อยกว่า, club draws, 9x, อากาศ)
  <br>แต่ทำสัญญากับตัวเอง: <b>river ♣ หรือ jam ใหญ่ผิดปกติ = ปล่อยได้</b>`,
  deep:`<b>เจาะลึก</b><br>
  <b>• เลเวลของการ "ยืน":</b> ยืนด้วยเลข (30% threshold) ไม่ใช่ด้วยอีโก้ — มี exit plan ก่อนใบถัดไปเสมอ
  <br><b>• ok=fold:</b> ตอน bubble vs cover การถอยมือ one-pair เร็วเกินไม่ใช่บาปใหญ่ — แค่เสีย EV เล็กน้อยแลกความอยู่รอด`
},
{
  id:'h22d', cat:'postflop', step:'4/4', hidden:true,
  stage:'Bubble', stack:'25bb', icm:true,
  icmState:'🫧 <b>BUBBLE</b> · SB คือ chip leader (60bb) cover ทั้งโต๊ะ · เราอันดับกลาง',
  pot:40, toCall:10,
  board:['Ah','9c','5c','7d','Kc'], hero:['As','Ts'], heroLine:'BB',
  stacks:[['SB',60],['BB',25]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG…BTN',a:'fold'},{pos:'SB',a:'raise',amt:'3'},{pos:'YOU',a:'call'}]},
    {name:'Flop', acts:[{pos:'SB',a:'cbet',amt:'3'},{pos:'YOU',a:'call'}]},
    {name:'Turn', acts:[{pos:'SB',a:'bet',amt:'9'},{pos:'YOU',a:'call'}]},
    {name:'River', acts:[{pos:'SB',a:'shove',amt:'10'}]}
  ],
  q:'River K♣ — <b>club ใบที่สาม</b> และ SB jam ก้อนสุดท้ายของเรา (10bb). ราคาดีมาก (ขอ 20%)... call ไหม?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call all-in'}],
  best:0, ok:[1],
  reveal:{pos:'SB', cards:['Qc','Jc'], note:'โชว์ flush<br>— fold ของเราถูกต้อง'},
  why:`<b>เฉลย: Fold (แผนที่วางไว้ — execute)</b> — นี่คือใบที่เราทำสัญญาไว้ตั้งแต่ turn. K♣ ทำสามอย่างพร้อมกัน: เติม <b>club flush</b>, เพิ่ม Kx ที่ไล่ตามมา, และทำให้ AT ของเราแพ้แม้แต่ AJ ที่... ไม่ — AT ยังบีต AJ ไม่ได้อยู่แล้ว ประเด็นคือ: <b>มือที่ barrel สองสตรีทแล้ว jam บนใบ flush = value ล้นทะลัก</b> (Q♣J♣/club combos ที่ semi-bluff มาตลอด — ตอนนี้คือ nuts ของเขา)
  <br>ราคา 20% ล่อใจมาก แต่ bluff ที่เหลือใน range เขาต่ำกว่านั้น และนี่คือ 10bb สุดท้ายตอน bubble — แพ้ = ศูนย์บาท ทุกคนที่เหลือเข้าเงิน
  <br><br>🏁 <b>จบมือ — fold:</b> SB โชว์ <b>Q♣J♣ (flush)</b> — semibluff ที่วิ่งมาตลอดทางแล้วเข้าเส้นชัย. เราเสีย 15bb เหลือ 10bb... <b>เจ็บ แต่ยังมีชีวิต — และอีก 2 มือถัดมามีคน bust แทนเรา: เข้าเงิน 🎉</b>`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• ยืนยันจาก verifier:</b> AT บน A957K(สามคลับ) แพ้ 164/990: ทุก club flush, 68-straight, two pairs, sets. range jam ของเขาบนใบนี้กระจุกอยู่ในกลุ่มที่บีตเราพอดี
  <br><b>• ทำไมราคา 20% ไม่พอ:</b> pot odds ต่ำช่วยเมื่อ range เขามี bluff >20% — แต่ใครจะ bluff-jam ใบที่ "ทุก draw ของตัวเองเพิ่งเข้า"? bluff ที่นี่แทบไม่มีโดยธรรมชาติ
  <br><b>• ICM คูณสอง:</b> chipEV ก็ fold อยู่แล้ว (ขอบๆ) — bubble + 10bb สุดท้าย = fold สนิท. survival มีมูลค่าเป็นเงินจริง
  <br><b>• Hand summary:</b> เล่นถูกทุกขั้น เสีย 15bb — และคำว่า "ถูก" พิสูจน์ตัวเองตอนเข้าเงินด้วย 10bb ที่เหลือ`
},

// Hand 23 — QQ 25bb vs 3bet: jam มาตรฐานที่ต้องกดไม่ลังเล
{
  id:'h23a', cat:'preflop', step:'1/2',
  stage:'Mid Stage', stack:'25bb',
  pot:1.5, toCall:0,
  hero:['Qs','Qh'], heroLine:'MP • 25bb',
  stacks:[['MP',25],['BTN',35]],
  streets:[{name:'Preflop', acts:[{pos:'UTG',a:'fold'}]}],
  q:'QQ ที่ MP, 25bb — เปิดเท่าไร?',
  opts:[{k:'fold',label:'Fold'},{k:'raise',label:'Raise',sub:'2.2bb'},{k:'shove',label:'All-in',sub:'25bb'}],
  best:1,
  nextSpotId:'h23b',
  why:`<b>เฉลย: Raise ปกติ</b> — QQ เปิดเหมือนทุกมือ. open-jam 25bb = บอกโต๊ะว่า "มือผมแข็งแต่ไม่อยากเล่นโป๊กเกอร์" — เสีย value จากทุกมือที่อยากตามมาผิดๆ`,
  deep:`<b>เจาะลึก</b><br>
  <b>• แผนรับ 3bet:</b> ที่ 25bb คำตอบเตรียมไว้แล้ว: jam (ดู step ถัดไป) — เปิดโดยรู้คำตอบล่วงหน้าทุก branch`
},
{
  id:'h23b', cat:'preflop', step:'2/2', hidden:true,
  stage:'Mid Stage', stack:'25bb',
  pot:9.7, toCall:3.8,
  hero:['Qs','Qh'], heroLine:'MP • 25bb',
  stacks:[['MP',25],['BTN',35]],
  streets:[{name:'Preflop', acts:[{pos:'UTG',a:'fold'},{pos:'YOU',a:'raise',amt:'2.2'},{pos:'BTN',a:'3bet',amt:'6'},{pos:'SB BB',a:'fold'}]}],
  q:'BTN 3-bet เป็น 6 — QQ ที่ 25bb ตอบยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'3.8bb'},{k:'shove',label:'All-in',sub:'25bb'}],
  best:2, ok:[1],
  reveal:{pos:'BTN', cards:['Ad','Kd'], note:'เปิด AK — flip<br>— QQ เรายืน, double up'},
  why:`<b>เฉลย: All-in</b> — QQ ที่ 25bb เจอ 3bet = jam ไม่ต้องคิดเยอะ: (1) นำ range 3bet ของ BTN ห่าง (AQ/AJ/KQ/TT/99/bluffs) (2) flat แล้ว A หรือ K ทับ flop ~40% — เปลี่ยนมือ premium เป็นปริศนา (3) fold equity เพิ่ม EV อีกชั้น
  <br>มือที่บีตเรา (KK/AA) ก็ต้องเจออยู่ดี — นั่นคือ cooler ไม่ใช่เหตุผลให้เล่นอ้อม
  <br><br>🏁 <b>จบมือ:</b> BTN call ด้วย <b>A♦K♦</b> — flip ฝั่งเรา 54%. Board 8♣4♥2♥ J♦ 9♠ ไม่มี A/K → <b>QQ ยืน double เป็น ~51bb!</b>`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• ทำไม jam > call ที่ 25bb:</b> call เหลือ SPR ~1.5 บน flop ที่ 40% มี overcard — เราจะ "check-fold มือที่ดีกว่าเขา" หรือ "stack off ตอนเป็นรอง" บ่อยเกิน. jam ตัดสถานการณ์เลวร้ายทั้งหมดออก
  <br><b>• ยืนยัน:</b> 842J9 — AK พลาด (QQ ชนะ 848/990 รวมทุก combo)
  <br><b>• เส้นแบ่ง:</b> 40bb+ → call 3bet ได้ (SPR พอเล่น) / ≤30bb → jam คือ default ของ QQ`
},

// Hand 24 — FT: TPTK โดน check-raise บน draw board — jam deny ให้ครบ
{
  id:'h24a', cat:'preflop', step:'1/3',
  stage:'Final Table', stack:'20bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 8 คน · BB (22bb) ใกล้เคียงเรา · pay jumps เริ่มมีผล',
  pot:1.5, toCall:0,
  hero:['Ah','Qh'], heroLine:'CO • 20bb',
  stacks:[['CO',20],['BB',22]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP',a:'fold'}]}],
  q:'AQs ที่ CO, 20bb, FT เหลือ 8 — เปิดยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'raise',label:'Raise',sub:'2.2bb'},{k:'shove',label:'All-in',sub:'20bb'}],
  best:1,
  nextSpotId:'h24b',
  why:`<b>เฉลย: Raise</b> — AQs 20bb เปิดปกติ — jam ทิ้ง value (มือ call ล้วนเป็นต่อ/flip เรา). ถ้าโดน rejam ค่อยตัดสินใจ (ซึ่ง AQs call ได้ vs ส่วนใหญ่)`,
  deep:`<b>เจาะลึก</b><br>
  <b>• AQs ที่ FT:</b> top-5% ของมือ — เล่นแบบมือใหญ่: เปิด, สู้ rejam จากคนสั้น, ระวังแค่ action หนาแน่นจากหลายคน`
},
{
  id:'h24b', cat:'postflop', step:'2/3', hidden:true,
  stage:'Final Table', stack:'20bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 8 คน · BB (22bb) ใกล้เคียงเรา · pay jumps เริ่มมีผล',
  pot:4.9, toCall:0,
  board:['Qd','Jd','8c'], hero:['Ah','Qh'], heroLine:'CO',
  stacks:[['CO',20],['BB',22]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'YOU',a:'raise',amt:'2.2'},{pos:'BTN SB',a:'fold'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'}]}
  ],
  q:'BB call. Flop Q♦J♦8♣ — TPTK บนบอร์ดที่<b>อันตรายที่สุดในเกม</b> (เพชร + T9/KT/T9 ลอยทั่ว). BB เช็ค — ไซส์ไหน?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'Bet',sub:'⅓ (1.6)'},{k:'raise',label:'Bet',sub:'⅔ (3.3)'}],
  best:2, ok:[1],
  nextSpotId:'h24c',
  why:`<b>เฉลย: Bet ⅔</b> — บอร์ดแบบนี้ไม่มีคำว่า "เบทเบาๆ": ทุก gutshot, ทุกเพชร, ทุก pair+draw พร้อมจ่ายหรือไล่เรา — ให้เขาจ่ายแพงตั้งแต่ตอนเรานำ
  <br>check คือบาปมหันต์บนบอร์ดนี้ (ใบฟรี = มีดที่ยื่นให้เขาแทงเรา)`,
  deep:`<b>เจาะลึก</b><br>
  <b>• เลือกไซส์ตามบอร์ด:</b> แห้ง K83 → ⅓ / เปียก QJ8ss → ⅔+ — หลักเดียวที่ครอบ 80% ของการตัดสินใจ cbet
  <br><b>• ที่ 20bb:</b> เบท ⅔ = ตั้ง jam turn พอดีมือ — โครงสร้าง stack ทำงานให้เรา`
},
{
  id:'h24c', cat:'postflop', step:'3/3', hidden:true,
  stage:'Final Table', stack:'20bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE</b> · เหลือ 8 คน · BB (22bb) ใกล้เคียงเรา · pay jumps เริ่มมีผล',
  pot:17.2, toCall:5.7,
  board:['Qd','Jd','8c'], hero:['Ah','Qh'], heroLine:'CO',
  stacks:[['CO',20],['BB',22]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'YOU',a:'raise',amt:'2.2'},{pos:'BTN SB',a:'fold'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'},{pos:'YOU',a:'cbet',amt:'3.3'},{pos:'BB',a:'raise',amt:'9'}]}
  ],
  q:'BB check-raise เป็น 9! เราเหลือ 14.5 หลังเบท — fold, call หรือใส่หมด?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'5.7bb'},{k:'shove',label:'All-in',sub:'14.5bb'}],
  best:2, ok:[1],
  reveal:{pos:'BB', cards:['Kd','Td'], note:'เปิด 15-out draw ที่พลาดหมด<br>— AQ เราชนะ'},
  why:`<b>เฉลย: All-in</b> — check-raise บน Q♦J♦8♣ = <b>draw มากกว่า made hand</b> โดยธรรมชาติของบอร์ด (T9/KT/เพชร/combo มี "สิทธิ์ raise" มากกว่า two pair ที่มักจะ call). TPTK ของเรานำ range นั้น
  <br>ที่ 20bb ทางเลือกจริงมีสองทาง: jam หรือ fold — และ fold TPTK ให้บอร์ดที่ "เขามี draw ครึ่ง range" คือ over-fold มหาศาล. <b>jam = deny equity เต็มก้อน</b>: draw ของเขาต้องจ่ายราคาเต็มเพื่อดูสองใบ
  <br><br>🏁 <b>จบมือ:</b> BB call ด้วย <b>K♦T♦</b> — open-ender + flush draw (15 outs, 49/51 แทบ flip!). Turn 2♠... river 4♣ — <b>พลาดทุกใบ! AQ เก็บ pot ~41bb</b> ขยับขึ้น top-3 ของ FT 💪`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• ทำไม call (ok) ด้อยกว่า jam:</b> call → turn เพชร/9/T ลง 40%+ แล้วเราเจอเบทอีกก้อนแบบไม่รู้อะไรเลย. jam ตอนนำ + ไม่ให้ข้อมูลเพิ่ม = EV สูงสุดที่ stack นี้
  <br><b>• เลขของเขา:</b> KT เพชร 15 outs ~49% + ราคา — เขา call ถูกด้วยซ้ำ. สองฝ่ายเล่นถูก เงินไหลตาม variance — มือแบบนี้แหละคือโป๊กเกอร์
  <br><b>• ยืนยัน:</b> QJ82-4: KT เหลือ K-high (AQ ชนะ 868/990)
  <br><b>• ICM เหลือ 8:</b> premium ยังเบา (jumps เล็ก) — ยิ่งยืนยัน jam. ถ้าเหลือ 4-5 คน → คิดหนักขึ้นนิด แต่ TPTK บนบอร์ดนี้ก็ยังไป`
},

// Hand 25 — Multiway: monster draw vs 2 คน — squeeze ตรงจุดที่ dead money สูงสุด
{
  id:'h25a', cat:'preflop', step:'1/3',
  stage:'Mid Stage', stack:'45bb',
  pot:6.3, toCall:1.4,
  hero:['8d','7d'], heroLine:'BB • 45bb',
  stacks:[['CO',50],['BTN',48],['BB',45]],
  streets:[{name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.4'},{pos:'BTN',a:'call'},{pos:'SB',a:'fold'}]}],
  q:'87s ใน BB — CO เปิด + BTN call. ราคา 1.4 เข้า pot 6.3 — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'1.4bb'},{k:'raise',label:'Squeeze',sub:'12bb'}],
  best:1,
  nextSpotId:'h25b',
  why:`<b>เฉลย: Call</b> — ขอ ~18% equity กับมือ suited connector ใน multiway pot = ราคาที่ปฏิเสธไม่ได้. 87s ตี board ต่ำ-กลางที่ทั้งสองคนพลาดบ่อยมาก
  <br>squeeze ด้วยมือนี้ OOP vs 2 คน = เปลี่ยนมือ implied-odds เป็น bluff ที่โดน call สองทาง`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Multiway = nut potential สำคัญขึ้น:</b> 87s ทำ straight/flush ที่ "ชนะ stack" — ตรงสเปคพอดี
  <br><b>• แผน:</b> ตีแล้วเล่นใหญ่ / พลาดแล้วหนีเร็ว — ไม่มีตรงกลาง`
},
{
  id:'h25b', cat:'postflop', step:'2/3', hidden:true,
  stage:'Mid Stage', stack:'45bb',
  pot:15.7, toCall:4,
  board:['6d','5c','2d'], hero:['8d','7d'], heroLine:'BB',
  stacks:[['CO',50],['BTN',48],['BB',45]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.4'},{pos:'BTN',a:'call'},{pos:'SB',a:'fold'},{pos:'YOU',a:'call'}]},
    {name:'Flop', acts:[{pos:'YOU',a:'check'},{pos:'CO',a:'cbet',amt:'4'},{pos:'BTN',a:'call'}]}
  ],
  q:'Flop 6♦5♣2♦ — <b>OESD + flush draw (15 outs!)</b> CO เบท, BTN call ตาม — ตาเรา: เงินกองอยู่ตรงหน้า 15.7',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'4bb'},{k:'raise',label:'Check-Raise',sub:'16bb'}],
  best:2, ok:[1],
  nextSpotId:'h25c',
  why:`<b>เฉลย: Check-Raise 16</b> — สูตรทอง: <b>monster draw + dead money สองก้อน</b>. เงิน 15.7 ที่กองอยู่ทำให้ check-raise กำไรแม้ทั้งคู่ fold แค่บางครั้ง — และเมื่อโดน call เรามี ~54% vs overpair
  <br>มือ 15-outs เล่น passive = ขายหุ้นบริษัทตัวเองราคาถูก`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ทำไมต้องตอนนี้:</b> BTN call กลาง = range capped (มี monster เขา raise ไปแล้ว) / CO เบทเข้า 2 คน = แข็งแต่ไม่เสมอไป — จุดที่ fold equity สูงสุดของทั้งมือ
  <br><b>• เมื่อโดน jam ทับ:</b> call สบาย — 15 outs ไม่กลัวใคร`
},
{
  id:'h25c', cat:'postflop', step:'3/3', hidden:true,
  stage:'Mid Stage', stack:'45bb',
  pot:43.7, toCall:0,
  board:['6d','5c','2d','9h'], hero:['8d','7d'], heroLine:'BB',
  stacks:[['CO',50],['BTN',48],['BB',45]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG MP',a:'fold'},{pos:'CO',a:'raise',amt:'2.4'},{pos:'BTN',a:'call'},{pos:'SB',a:'fold'},{pos:'YOU',a:'call'}]},
    {name:'Flop', acts:[{pos:'YOU',a:'check'},{pos:'CO',a:'cbet',amt:'4'},{pos:'BTN',a:'call'},{pos:'YOU',a:'raise',amt:'16'},{pos:'CO',a:'call'},{pos:'BTN',a:'fold'}]},
    {name:'Turn', note:'ตาคุณ — เหลือ 26.6bb', acts:[]}
  ],
  q:'CO call (BTN หนี). Turn 9♥ — <b>STRAIGHT เข้าแล้ว!</b> (9-8-7-6-5) เหลือ 26.6 ใส่ยังไง?',
  opts:[{k:'call',label:'Check',sub:'trap'},{k:'shove',label:'All-in',sub:'26.6bb'}],
  best:1,
  reveal:{pos:'CO', cards:['As','Ac'], note:'เปิด AA<br>— แพ้ straight ของเรา'},
  why:`<b>เฉลย: All-in</b> — straight เข้าบนใบที่ "ดูไม่มีพิษ" ในสายตา overpair. jam 26.6 เข้า 43.7 — AA/KK/sets ของ CO ที่ทนการ check-raise มาแล้วหนึ่งรอบ ไม่หนีตอนนี้ (เขามองว่าเราอาจ semibluff ต่อ)
  <br>trap check เสี่ยงเขาเช็คกลับ + ใบ river เพชร/pair ทำเรื่องยุ่ง — เก็บตอนนี้ที่ equity เราพีคสุด
  <br><br>🏁 <b>จบมือ:</b> CO call ด้วย <b>A♠A♣</b> (overpair ที่ "ทนมามากพอแล้ว"). River T♦ — เติม <b>flush ให้เราอีกชั้น</b> (กันเอง 555?? ไม่ต้องกัน — straight ก็พอ). <b>เก็บ pot ~97bb!</b> มือ 87s ที่ราคา 1.4 ทำเงิน 50bb+ 🎆`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• เส้นทางของมือ:</b> call ราคาถูก → check-raise จุด dead money → jam ตอนการ์ดเข้า. ทุกขั้นมีคณิตหนุน ไม่มีขั้นไหน "เสี่ยงดวง"
  <br><b>• ทำไม AA call:</b> จากมุมเขา: เรา check-raise flop draw-heavy แล้ว jam ใบ 9 — range เรามี bluff/semibluff เยอะพอให้ AA "ต้อง" call. เราได้เงินเพราะ <b>เคย</b> bluff ได้ในจุดเดียวกัน — aggression จ่ายดอกเบี้ยย้อนหลัง
  <br><b>• ยืนยัน:</b> 652-9-T เพชรสอง?? สาม (6♦2♦T♦) — เราจบด้วย flush ทับ straight: แพ้แค่ 25 combo flush สูงกว่า (verifier)
  <br><b>• Hand summary:</b> 1.4 → 16 → 26.6: เงินลงหนักขึ้นเรื่อยๆ ตาม equity ที่ชัดขึ้นเรื่อยๆ — รูปทรงของมือที่เล่นถูก`
},

// Hand 26 — FT 3 คน: TP+FD stack off — แพ้... และทำไมถึง "ต้องแพ้แบบนี้"
{
  id:'h26a', cat:'preflop', step:'1/3',
  stage:'Final Table', stack:'30bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE — เหลือ 3 คน!</b> · อันดับ 1 ห่างอันดับ 3 หลายเท่า · BB (35bb) คือ leader',
  pot:1.5, toCall:0,
  hero:['Kh','Jh'], heroLine:'BTN • 30bb',
  stacks:[['BTN',30],['SB',25],['BB',35]],
  streets:[{name:'Preflop', note:'3-handed — BTN เปิดก่อน', acts:[]}],
  q:'KJs บน BTN — เหลือ 3 คนชิงแชมป์. เปิดไหม?',
  opts:[{k:'fold',label:'Fold'},{k:'raise',label:'Raise',sub:'2.2bb'},{k:'shove',label:'All-in',sub:'30bb'}],
  best:1,
  nextSpotId:'h26b',
  why:`<b>เฉลย: Raise</b> — 3-handed KJs คือมือ premium (เทียบเท่า AQ+ ตอนโต๊ะเต็ม). ใครไม่ปรับ range ตอน short-handed คือคนที่โดน blind กินจนตาย`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Range เลื่อนตามจำนวนคน:</b> 9-max KJs = กลางๆ / 3-handed = top 8% — ความแข็งของมือคือเรื่อง "เทียบกับใคร" เสมอ`
},
{
  id:'h26b', cat:'postflop', step:'2/3', hidden:true,
  stage:'Final Table', stack:'30bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE — เหลือ 3 คน!</b> · อันดับ 1 ห่างอันดับ 3 หลายเท่า · BB (35bb) คือ leader',
  pot:4.9, toCall:0,
  board:['Kd','8h','4h'], hero:['Kh','Jh'], heroLine:'BTN',
  stacks:[['BTN',30],['SB',25],['BB',35]],
  streets:[
    {name:'Preflop', acts:[{pos:'YOU',a:'raise',amt:'2.2'},{pos:'SB',a:'fold'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'}]}
  ],
  q:'BB call. Flop K♦8♥4♥ — <b>top pair + flush draw</b>. BB เช็ค — เล่นยังไง?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'Bet',sub:'⅔ (3.2)'}],
  best:1,
  nextSpotId:'h26c',
  why:`<b>เฉลย: Bet ⅔</b> — top pair + flush draw = มือที่แข็งเป็นอันดับต้นๆ ของ board นี้. เบทใหญ่: value จาก Kx/8x/draws + สร้าง pot ที่เราพร้อมเล่นจนจบ`,
  deep:`<b>เจาะลึก</b><br>
  <b>• TP+FD ที่ 30bb:</b> มือนี้ "ไม่ fold ที่ความลึกนี้" — ตัดสินใจไว้ตอนนี้เลยจะได้ไม่ลังเลทีหลัง
  <br><b>• ⅔ ไม่ใช่ ⅓:</b> board มี draw + เราอยาก stack ลงภายใน 2 streets`
},
{
  id:'h26c', cat:'postflop', step:'3/3', hidden:true,
  stage:'Final Table', stack:'30bb', icm:true,
  icmState:'🏆 <b>FINAL TABLE — เหลือ 3 คน!</b> · อันดับ 1 ห่างอันดับ 3 หลายเท่า · BB (35bb) คือ leader',
  pot:18.1, toCall:6.8,
  board:['Kd','8h','4h'], hero:['Kh','Jh'], heroLine:'BTN',
  stacks:[['BTN',30],['SB',25],['BB',35]],
  streets:[
    {name:'Preflop', acts:[{pos:'YOU',a:'raise',amt:'2.2'},{pos:'SB',a:'fold'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'},{pos:'YOU',a:'cbet',amt:'3.2'},{pos:'BB',a:'raise',amt:'10'}]}
  ],
  q:'BB check-raise เป็น 10 — TP + flush draw ของเรา ตอบยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'6.8bb'},{k:'shove',label:'All-in',sub:'27.8bb'}],
  best:1, ok:[2],
  reveal:{pos:'BB', cards:['8d','8c'], note:'เปิด set of eights<br>— cooler, เราเล่นถูกแล้ว'},
  why:`<b>เฉลย: Call (และพร้อมไปจนสุด)</b> — top pair ดี + flush draw vs check-raise: มือเราแข็งเกิน fold ในทุกจักรวาล (vs sets เรายังมี ~38%, vs draws/worse Kx เรานำขาด). call เก็บ range เขาไว้กว้าง — jam ก็ได้ (ok)
  <br><br>🏁 <b>จบมือ:</b> turn 2♣ BB jam — ราคา + equity บังคับ call (เหลือ 17.8 เข้า pot ~43). River 6♠ ไม่ใช่หัวใจ. BB เปิด <b>8♦8♣ — SET</b> → <b>เราตกรอบอันดับ 3</b> 💔
  <br><br>หยุดก่อนจะ tilt: ย้อนดูทุกการตัดสินใจ — เปิด KJs ✓ เบท TP+FD ✓ ไม่ fold ต่อ check-raise ✓ call jam ด้วย odds ✓. <b>มือนี้เล่นใหม่ 100 ครั้งก็เล่นแบบนี้ทุกครั้ง</b> — อันดับ 3 ที่ได้เงินจริง ดีกว่าอันดับ 3 ที่ได้จากการหนีทุก confrontation จน blind หมด`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• เลขตอน stack off:</b> TP+FD vs set = ~38% / vs Kx worse = 80%+ / vs heart draw = 75% / vs 8x two pair = 45% — ถ่วงรวม ~55-60% + dead money → ไป
  <br><b>• ICM 3-handed ไม่เปลี่ยนคำตอบไหม:</b> เปลี่ยนที่ขอบ (มือ marginal โฟลด์ง่ายขึ้น) — แต่ TP+FD ไม่ใช่ marginal. การเล่น "กลัวทุก pot" 3-handed คือการมอบแชมป์ให้ chip leader ฟรี
  <br><b>• ยืนยัน:</b> K842-6: KJ แพ้ 145/990 — set 88 อยู่ในนั้น. มันคือ 3 combos จากร้อยกว่าที่เราชนะ/flip
  <br><b>• บทเรียนปิด:</b> ผลของมือเดียว ≠ คุณภาพการเล่น. จดไว้: "แพ้แบบถูกต้อง" แล้วกลับมาล่าแชมป์ใหม่พรุ่งนี้`
},

// Hand 27 — Deep set-mining: bottom set บน board เปียก — เร่งให้สุดก่อนใบอันตราย
{
  id:'h27a', cat:'preflop', step:'1/4',
  stage:'Early', stack:'120bb',
  pot:1.5, toCall:0,
  hero:['5h','5s'], heroLine:'MP • 120bb',
  stacks:[['MP',120],['BTN',115],['BB',125]],
  streets:[{name:'Preflop', acts:[{pos:'UTG',a:'fold'}]}],
  q:'55 ที่ MP, 120bb deep (early) — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'raise',label:'Raise',sub:'2.5bb'}],
  best:1,
  nextSpotId:'h27b',
  why:`<b>เฉลย: Raise</b> — pocket pair เล็กตอน deep = ตั๋ว lottery ที่ราคาถูกเทียบกับรางวัล: ตี set (12%) ตอน 120bb = โอกาส stack คนทั้งโต๊ะที่ "ไม่มีทางเชื่อว่าเรามี 555"`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Set-mining formula:</b> ต้องการ effective stack ≥ 15-20x ราคาที่จ่าย — 120bb ผ่านเกณฑ์แบบเหลือๆ`
},
{
  id:'h27b', cat:'postflop', step:'2/4', hidden:true,
  stage:'Early', stack:'120bb',
  pot:8, toCall:0,
  board:['Qc','Js','5d'], hero:['5h','5s'], heroLine:'MP',
  stacks:[['MP',120],['BTN',115],['BB',125]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG',a:'fold'},{pos:'YOU',a:'raise',amt:'2.5'},{pos:'BTN',a:'call'},{pos:'SB',a:'fold'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'}]}
  ],
  q:'3-way pot. Flop Q♣J♠5♦ — <b>BOTTOM SET!</b> บน board ที่ KT/T9/AK ลอยเพียบ. BB เช็คมา ตาเรา — slowplay ไหม?',
  opts:[{k:'call',label:'Check',sub:'slowplay'},{k:'raise',label:'Bet',sub:'⅔ (5.3)'}],
  best:1,
  nextSpotId:'h27c',
  why:`<b>เฉลย: Bet — ห้าม slowplay เด็ดขาด</b> — กฎเหล็ก: <b>set บน board ต่อกัน + multiway = เบทเสมอ</b>. KT เข้า = เราเหลือ 10 outs, AT/T9 เข้าครึ่งทาง, ทุก broadway ใน range สองคน
  <br>โชคดีที่ board นี้ "เข้า range เรา" — เบท ⅔ ดูเหมือน AQ/KQ ธรรมดา ได้ action จาก Qx/Jx/draws เต็มๆ`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Multiway slowplay = บาปคูณสอง:</b> สองคน = โอกาสมีคนตี turn สูงขึ้น + pot ที่ควรโตตั้งแต่ตอนนี้ไม่โต
  <br><b>• ใบที่กลัว:</b> T (ทุก KT/AT/T9 แซง/ไล่) — ยิ่งต้องเบทตอนนี้`
},
{
  id:'h27c', cat:'postflop', step:'3/4', hidden:true,
  stage:'Early', stack:'120bb',
  pot:29.3, toCall:10.7,
  board:['Qc','Js','5d'], hero:['5h','5s'], heroLine:'MP',
  stacks:[['MP',120],['BTN',115],['BB',125]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG',a:'fold'},{pos:'YOU',a:'raise',amt:'2.5'},{pos:'BTN',a:'call'},{pos:'SB',a:'fold'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'},{pos:'YOU',a:'bet',amt:'5.3'},{pos:'BTN',a:'raise',amt:'16'},{pos:'BB',a:'fold'}]}
  ],
  q:'BTN raise เป็น 16 (BB หนี) — bottom set ของเรา deep 120bb. call หรือ 3-bet?',
  opts:[{k:'call',label:'Call'},{k:'raise',label:'3-Bet',sub:'40bb'},{k:'fold',label:'Fold'}],
  best:1, ok:[0],
  nextSpotId:'h27d',
  why:`<b>เฉลย: 3-Bet 40</b> — เขา raise บน board นี้ = range แคบและแข็ง: QJ (two pair), AQ/KQ, KT (straight ทำแล้ว?!), sets อื่น, T9/AT draws. <b>ลึก 120bb มือเราต้องสร้างทันที</b> — ถ้า flat แล้ว turn T/9/K ลง เราจะไม่มีวันได้ stack เขาแบบสบายใจอีก
  <br>3bet 40 ถาม真จริงตรงๆ: "QJ/AQ จ่ายไหม? KT โชว์ตัวสิ"`,
  deep:`<b>เจาะลึก</b><br>
  <b>• Deep + bottom set + wet = เร่ง:</b> ทุกใบ turn ที่ไม่ pair board ทำให้มือเราอ่านยากขึ้นและ "แพ้กลับ" ได้ — เงินต้องลงตอนเรายังชัวร์ว่านำ range
  <br><b>• ok=call:</b> trap line ก็มีอยู่จริง (เก็บ bluff เขา) — แต่ที่ลึกขนาดนี้ ความเสี่ยง runout แพงกว่า bluff ที่เก็บได้`
},
{
  id:'h27d', cat:'postflop', step:'4/4', hidden:true,
  stage:'Early', stack:'120bb',
  pot:88, toCall:0,
  board:['Qc','Js','5d','2h'], hero:['5h','5s'], heroLine:'MP',
  stacks:[['MP',120],['BTN',115],['BB',125]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG',a:'fold'},{pos:'YOU',a:'raise',amt:'2.5'},{pos:'BTN',a:'call'},{pos:'SB',a:'fold'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'},{pos:'YOU',a:'bet',amt:'5.3'},{pos:'BTN',a:'raise',amt:'16'},{pos:'BB',a:'fold'},{pos:'YOU',a:'3bet',amt:'40'},{pos:'BTN',a:'call'}]},
    {name:'Turn', note:'ตาคุณ — เหลือ 77.5bb · pot 88', acts:[]}
  ],
  q:'BTN call 40. Turn 2♥ brick. pot 88 เราเหลือ 77.5 — จบมันเลยไหม?',
  opts:[{k:'call',label:'Check',sub:'ระวัง KT'},{k:'shove',label:'All-in',sub:'77.5bb'}],
  best:1, ok:[0],
  reveal:{pos:'BTN', cards:['Qs','Jd'], note:'เปิด top two<br>— แพ้ set ของเรา, pot ยักษ์'},
  why:`<b>เฉลย: All-in</b> — SPR เหลือไม่ถึง 1 — เงินลงหมดแน่นอนอยู่แล้ว คำถามเดียวคือใครเป็นคนใส่. jam เองดีกว่า: (1) KT ที่ทำ straight แล้วต้อง call อยู่ดี — เราเสียเท่ากันทุกทาง (2) แต่ QJ/AQ/AhQh ที่ลังเล <b>ต้องตัดสินใจตอนนี้โดยไม่มีใบฟรี</b>
  <br>check ด้วยความกลัว KT = ให้ใบฟรีกับ draw ทุกตัวที่ยอม check กลับ
  <br><br>🏁 <b>จบมือ:</b> BTN tank ยาวมาก... call ด้วย <b>Q♠J♦ (top two!)</b> — เขาคิดว่าเขานำ. River A♣ ไม่ช่วยใคร → <b>SET OF FIVES เก็บ pot ~240bb!</b> double-up ยักษ์ตั้งแต่ early — จากมือ 55 ราคา 2.5bb 💎`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• ทำไม QJ จ่าย 77bb:</b> จากมุมเขา top two บน board นี้ vs line เรา (bet-3bet-jam) — เขาแพ้แค่ KT/sets ซึ่งเขา "หวังว่า" เราคือ AQ/semibluff. ความลึกทำให้คนตัดสินใจพลาดแพงขึ้น — สองทาง
  <br><b>• ยืนยัน:</b> QJ52A: 555 แพ้แค่ 41/990 (KT broadway ×16, 34 wheel ×16, QQ/JJ/AA trips) — QJ two pair ไม่อยู่ในนั้น
  <br><b>• เส้นเรื่องของมือ:</b> เปิดเล็ก → ตี set → เบทตรง → 3bet ตรง → jam ตรง. <b>ไม่มี move ลับเลย</b> — ความตรงไปตรงมา + ตำแหน่งมือที่ใช่ = มือที่ใหญ่ที่สุดมักเป็นมือที่เล่นง่ายที่สุด
  <br><b>• Hand summary:</b> 120bb → ~240bb. ตั๋ว 2.5bb ถูกรางวัลที่หนึ่ง — และเราเก็บครบทุกบาทเพราะไม่ slowplay`
},

// Hand 28 — Bubble: AK vs 3bet — jam แล้วชนะ race สำคัญ
{
  id:'h28a', cat:'preflop', step:'1/2',
  stage:'Bubble', stack:'17bb', icm:true,
  icmState:'🫧 <b>BUBBLE</b> · อีก 1 คน bust = เข้าเงิน · เรา 17bb อันดับกลางล่าง — โดน blind บีบ',
  pot:1.5, toCall:0,
  hero:['Ad','Kd'], heroLine:'UTG • 17bb',
  stacks:[['UTG',17],['MP',50]],
  streets:[{name:'Preflop', note:'ตาคุณเปิดเป็นคนแรก', acts:[]}],
  q:'AKs จาก UTG, 17bb, ช่วง bubble — เปิดยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'raise',label:'Raise',sub:'2.2bb'},{k:'shove',label:'All-in',sub:'17bb'}],
  best:1, ok:[2],
  nextSpotId:'h28b',
  why:`<b>เฉลย: Raise (jam รับได้)</b> — AKs ที่ 17bb: เปิดเล็กแล้วพร้อมใส่หมดต่อทุก action ดีกว่า jam ตรงนิดหน่อย (เก็บมือ dominated ของคนอื่นไว้ในเกม — A-rag/KQ ที่อาจตามมา)`,
  deep:`<b>เจาะลึก</b><br>
  <b>• AKs ตอน bubble:</b> มือที่ "ไม่กลัวใคร" — ICM ทำให้มือกลางๆ เล่นยาก แต่ AKs ไม่ใช่มือกลางๆ
  <br><b>• 17bb open → จาก plan:</b> โดน 3bet = jam, โดน flat = เล่น flop ปกติ`
},
{
  id:'h28b', cat:'preflop', step:'2/2', hidden:true,
  stage:'Bubble', stack:'17bb', icm:true,
  icmState:'🫧 <b>BUBBLE</b> · อีก 1 คน bust = เข้าเงิน · เรา 17bb อันดับกลางล่าง — โดน blind บีบ',
  pot:9.7, toCall:3.8,
  hero:['Ad','Kd'], heroLine:'UTG • 17bb',
  stacks:[['UTG',17],['MP',50]],
  streets:[{name:'Preflop', acts:[{pos:'YOU',a:'raise',amt:'2.2'},{pos:'MP',a:'3bet',amt:'6'},{pos:'CO…BB',a:'fold'}]}],
  q:'MP (50bb big stack) 3-bet — AKs 17bb ตอน bubble. ถอยหรือสู้?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'3.8bb'},{k:'shove',label:'All-in',sub:'17bb'}],
  best:2,
  reveal:{pos:'MP', cards:['Js','Jc'], note:'เปิด JJ — race<br>— AK ตีเอซ เราชนะ'},
  why:`<b>เฉลย: All-in</b> — ใช่ เขา cover เรา ใช่ มัน bubble — แต่ AKs vs 3bet ที่ 17bb คือ jam ในทุกตำรา ICM: (1) fold = ทิ้ง 2.2 + ปล่อยให้ blinds กินเราต่อจนมือถัดไปแย่กว่านี้ (2) flat OOP เหลือ 15bb ใน pot 13 = เล่นไม่เป็น (3) jam: เขา fold บ่อยพอ + เมื่อ call เราแย่สุดแค่ flip
  <br>"survival" ที่แท้จริงไม่ใช่การหนีทุก confrontation — คือการเลือก confrontation ที่เรา +EV
  <br><br>🏁 <b>จบมือ:</b> MP call ด้วย <b>J♠J♣</b> (race แท้ 50/50). Board <b>A♠</b>9♥3♣ 6♦ 2♠ — เอซมาใบแรกจบเกม! <b>Double เป็น ~36bb</b> ทะยานขึ้นกลุ่มนำ — bubble ที่เหลือกลายเป็นเวลาเก็บเหยื่อของเรา`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• เลขของ jam:</b> MP 3bet range vs UTG ~8-10% (TT+/AQ+) — AKs vs นั้น = 47%. + fold equity (เขาทิ้ง AQ/TT บางส่วนตอน bubble) → EV jam > fold ห่าง
  <br><b>• ทำไม fold ผิดแม้ "ปลอดภัย":</b> 17bb โดน blind+ante กิน ~1.5/รอบ = อีก 3-4 รอบเราจะเหลือ 12bb แล้วถูกบังคับเล่นมือแย่กว่า AKs ในสถานการณ์แย่กว่า — การหนีวันนี้คือการยอมตายพรุ่งนี้
  <br><b>• ยืนยัน:</b> A93-6-2: JJ แพ้ pair A (AK ชนะ 877/990 ที่ runout นี้)
  <br><b>• ถ้าแพ้ race:</b> ตกรอบบน bubble ด้วย AKs vs JJ — ไม่มีใครในโลกโป๊กเกอร์ตำหนิ play นี้ได้`
},

// Hand 29 — Thin value: ความต่างระหว่าง reg ธรรมดากับคนที่เก็บทุกหยด
{
  id:'h29a', cat:'preflop', step:'1/3',
  stage:'Mid Stage', stack:'38bb',
  pot:3.7, toCall:1.2,
  hero:['Ks','Ts'], heroLine:'BB • 38bb',
  stacks:[['BTN',40],['BB',38]],
  streets:[{name:'Preflop', acts:[{pos:'UTG…CO',a:'fold'},{pos:'BTN',a:'raise',amt:'2.2'},{pos:'SB',a:'fold'}]}],
  q:'KTs ใน BB เจอ BTN เปิด — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'1.2bb'},{k:'raise',label:'3-Bet',sub:'8bb'}],
  best:1, ok:[2],
  nextSpotId:'h29b',
  why:`<b>เฉลย: Call</b> — KTs vs BTN steal: defend มาตรฐาน (ราคา + playability). 3bet เป็น mix — มือนี้อยู่ขอบบนของ defend range`,
  deep:`<b>เจาะลึก</b><br>
  <b>• KTs vs BTN ~45% open:</b> เรา dominate K9/KQ?? — โดน KQ dominate แต่ dominate Kx ต่ำกว่า + Tx ทั้งหมด — สุทธิ์: ดีพอ defend สบาย`
},
{
  id:'h29b', cat:'postflop', step:'2/3', hidden:true,
  stage:'Mid Stage', stack:'38bb',
  pot:6.5, toCall:1.6,
  board:['Th','6c','6s'], hero:['Ks','Ts'], heroLine:'BB',
  stacks:[['BTN',40],['BB',38]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG…CO',a:'fold'},{pos:'BTN',a:'raise',amt:'2.2'},{pos:'SB',a:'fold'},{pos:'YOU',a:'call'}]},
    {name:'Flop', acts:[{pos:'YOU',a:'check'},{pos:'BTN',a:'cbet',amt:'1.6'}]}
  ],
  q:'Flop T♥6♣6♠ paired — top pair K kicker. BTN c-bet เล็ก ⅓ — เล่นยังไง?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'1.6bb'},{k:'raise',label:'Check-Raise'}],
  best:1,
  nextSpotId:'h29c',
  why:`<b>เฉลย: Call</b> — paired board เข้าทาง caller (เรามี 6x ใน range มากกว่า) แต่ KT แค่ "ดีพอจับ bluff" ไม่ใช่มือ raise: ไล่อากาศที่จะ barrel + โดน 6x/overpair เล่นกลับ
  <br>เก็บเขาไว้ใน pot กับ A-high/K-high ที่จะจ่ายเราอีก`,
  deep:`<b>เจาะลึก</b><br>
  <b>• cbet เล็กบน paired board:</b> เขาทำกับทั้ง range — อย่าตกใจ มันแปลว่า "ไม่มีข้อมูล" ไม่ใช่ "มีของ"`
},
{
  id:'h29c', cat:'postflop', step:'3/3', hidden:true,
  stage:'Mid Stage', stack:'38bb',
  pot:8.1, toCall:0,
  board:['Th','6c','6s','8d','2d'], hero:['Ks','Ts'], heroLine:'BB',
  stacks:[['BTN',40],['BB',38]],
  streets:[
    {name:'Preflop', acts:[{pos:'UTG…CO',a:'fold'},{pos:'BTN',a:'raise',amt:'2.2'},{pos:'SB',a:'fold'},{pos:'YOU',a:'call'}]},
    {name:'Flop', acts:[{pos:'YOU',a:'check'},{pos:'BTN',a:'cbet',amt:'1.6'},{pos:'YOU',a:'call'}]},
    {name:'Turn', acts:[{pos:'YOU',a:'check'},{pos:'BTN',a:'check'}]},
    {name:'River', note:'ตาคุณ — BTN เช็ค turn แล้ว (capped)', acts:[]}
  ],
  q:'BTN เช็ค turn กลับ. River 2♦ (T66-8-2). ตาเราก่อน — เช็คจบ หรือรีดอีกหยด?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'Bet',sub:'½ (4)'},{k:'raise',label:'Bet',sub:'pot (8)'}],
  best:1, ok:[0],
  reveal:{pos:'BTN', cards:['9s','8s'], note:'call แล้วเปิด pair 8<br>— thin value เก็บสำเร็จ'},
  why:`<b>เฉลย: Bet ½ (thin value)</b> — BTN เช็ค turn = ลบมือแข็งออกเกือบหมด (6x/overpair เบทไปแล้ว). เหลืออะไร? Ax/K-high ที่อยาก showdown, 9x/88, T ที่ kicker แย่กว่า — <b>หลายมือในนั้น call เบทครึ่ง pot "เผื่อเรา bluff"</b>
  <br>เช็คจบก็ "ไม่ผิด" (ok) แต่ทิ้งเงินบนโต๊ะทุกครั้งที่เขาถือ T9/88/A-high ที่ใจอ่อน — รีดหยดเล็กพันครั้ง = stack ที่คนอื่นไม่มี
  <br><br>🏁 <b>จบมือ:</b> BTN call ด้วย <b>9♠8♠</b> (คู่ 8 ที่ "ขอดูหน่อยเผื่อ float") → <b>KT เก็บ pot 16bb</b> — เพิ่มมา 4bb ที่ผู้เล่นส่วนใหญ่ไม่เคยเก็บ`,
  deep:`<b>เจาะลึก / Hand recap</b><br>
  <b>• สูตร thin value:</b> ถาม: "มีมือแย่กว่าที่ call ≥ มือดีกว่าที่ call ไหม?" — ที่นี่: แย่กว่าที่ call (Tx-worse, 88, 9x, A-high บางส่วน) เยอะกว่าดีกว่าที่ call (6x ที่ check turn?? แทบไม่มี) หลายเท่า → เบท
  <br><b>• ไซส์ ½ ไม่ใช่ pot:</b> เป้าหมายคือมือ "ลังเล" — pot-size ไล่พวกเขาหมด เหลือแต่มือที่บีตเรา (ทฤษฎีไซส์กลับหัวของ thin value)
  <br><b>• ยืนยัน:</b> KT บน T6682 แพ้แค่ 145/990 (6x trips, 79 straight, 88-boat... 88 = full house!? — ใช่ 88 ทำ boat 88866... ระวัง: ถ้าโดน raise river → fold เร็ว) — vs range "check turn" ความเสี่ยงต่ำกว่านั้นมาก
  <br><b>• ภาพใหญ่:</b> มือโชว์เคสว่า "ชนะ pot เล็กให้บ่อยและให้สุด" สำคัญพอๆ กับมือใหญ่ — ทัวร์ตัดสินกันที่ bb/100 ไม่ใช่ highlight`
},

// Hand 30 — HEADS-UP ชิงแชมป์: top pair + flush draw → flush → THE TITLE
{
  id:'h30a', cat:'preflop', step:'1/3',
  stage:'HEADS-UP', stack:'45bb', icm:true,
  icmState:'🏆 <b>HEADS-UP ชิงแชมป์!</b> · เรา 45bb vs BB 55bb · ส่วนต่างอันดับ 1-2 = ก้อนใหญ่สุดของทัวร์',
  pot:1.5, toCall:0,
  hero:['Qd','9d'], heroLine:'BTN • 45bb (HU)',
  stacks:[['BTN',45],['BB',55]],
  streets:[{name:'Preflop', note:'Heads-up: BTN (เรา) act ก่อน preflop', acts:[]}],
  q:'Heads-up ชิงแชมป์! Q9s บน BTN — เปิดไหม?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Limp'},{k:'raise',label:'Raise',sub:'2.2bb'}],
  best:2, ok:[1],
  nextSpotId:'h30b',
  why:`<b>เฉลย: Raise</b> — heads-up Q9s คือมือ<b>ดีกว่าค่าเฉลี่ย</b>ชัดเจน (top ~30%). HU การ fold BTN บ่อย = ยอมแพ้สงคราม blind ที่ตัดสินแชมป์
  <br>เปิด 2.2 มาตรฐาน — เกมยาว เก็บทีละ pot`,
  deep:`<b>เจาะลึก</b><br>
  <b>• HU ranges:</b> BTN เปิด 70-85% ของมือ — Q9s อยู่กลางๆ ของ range นั้นแบบสบาย
  <br><b>• โครงสร้าง HU:</b> ใครชนะ pot เล็กบ่อยกว่า คุม momentum — แชมป์ตัดสินที่ความสม่ำเสมอ ไม่ใช่มือเดียว`
},
{
  id:'h30b', cat:'postflop', step:'2/3', hidden:true,
  stage:'HEADS-UP', stack:'45bb', icm:true,
  icmState:'🏆 <b>HEADS-UP ชิงแชมป์!</b> · เรา 45bb vs BB 55bb · ส่วนต่างอันดับ 1-2 = ก้อนใหญ่สุดของทัวร์',
  pot:4.4, toCall:0,
  board:['9c','7d','4d'], hero:['Qd','9d'], heroLine:'BTN • (HU)',
  stacks:[['BTN',45],['BB',55]],
  streets:[
    {name:'Preflop', acts:[{pos:'YOU',a:'raise',amt:'2.2'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'}]}
  ],
  q:'Flop 9♣7♦4♦ — top pair + flush draw + เกมชิงแชมป์. BB เช็ค — ใส่เลยไหม?',
  opts:[{k:'call',label:'Check'},{k:'raise',label:'Bet',sub:'⅔ (3)'}],
  best:1,
  nextSpotId:'h30c',
  why:`<b>เฉลย: Bet ⅔</b> — top pair + flush draw HU = มือใหญ่ระดับ "พร้อมเล่นทั้ง stack". เบทเก็บ value จากทุก 7x/4x/draw/overcards ที่ HU เรียกกันถี่มาก`,
  deep:`<b>เจาะลึก</b><br>
  <b>• ความแข็งของมือ HU:</b> top pair ธรรมดา HU ≈ two pair ที่โต๊ะเต็ม — TP+FD คือ monster
  <br><b>• แผน:</b> โดน check-raise → ไม่ไปไหน (ดู step ถัดไป)`
},
{
  id:'h30c', cat:'postflop', step:'3/3', hidden:true,
  stage:'HEADS-UP', stack:'45bb', icm:true,
  icmState:'🏆 <b>HEADS-UP ชิงแชมป์!</b> · เรา 45bb vs BB 55bb · ส่วนต่างอันดับ 1-2 = ก้อนใหญ่สุดของทัวร์',
  pot:16.4, toCall:6,
  board:['9c','7d','4d'], hero:['Qd','9d'], heroLine:'BTN • (HU)',
  stacks:[['BTN',45],['BB',55]],
  streets:[
    {name:'Preflop', acts:[{pos:'YOU',a:'raise',amt:'2.2'},{pos:'BB',a:'call'}]},
    {name:'Flop', acts:[{pos:'BB',a:'check'},{pos:'YOU',a:'bet',amt:'3'},{pos:'BB',a:'raise',amt:'9'}]}
  ],
  q:'BB check-raise เป็น 9 — มือชิงแชมป์อยู่ตรงหน้า. fold / call / หรือใส่หมดเลย?',
  opts:[{k:'fold',label:'Fold'},{k:'call',label:'Call',sub:'6bb'},{k:'shove',label:'All-in',sub:'42.8bb'}],
  best:1, ok:[2],
  reveal:{pos:'BB', cards:['Ah','5h'], note:'เปิด bluff ที่วิ่งสุดทาง<br>— flush เราชนะ 🏆 CHAMPION!'},
  why:`<b>เฉลย: Call</b> — HU check-raise range กว้างมหาศาล (ทุก draw, ทุก pair, อากาศเพียบ) — TP+FD ของเราอยู่<b>เหนือ</b> range นั้นชัด. call ปล่อยให้เขา barrel ต่อด้วยมือที่แพ้เรา (jam ก็ได้ — ok — แต่ไล่ bluff เขาหมด)
  <br><br>🏁 <b>จบมือ — THE CHAMPIONSHIP:</b> Turn <b>2♦ — FLUSH!</b> BB jam ทั้งหมดด้วย A♥5♥ (gutshot + overcard — bluff สุดทาง). เรา snap call. River 8♠ เปล่า...
  <br><br><b>🏆🏆 CHAMPION! Q-high flush ชนะ — จบทัวร์อันดับ 1!</b> จาก 30 hands ของการฝึก: เปิดให้ถูก, เบทให้ตรง, อ่าน line ให้ขาด, ทิ้งให้เป็น, แล้ววันที่การ์ดเข้าข้าง — เก็บให้ครบ. GG! 🎉`,
  deep:`<b>เจาะลึก / Hand recap / จบหลักสูตร</b><br>
  <b>• ยืนยันใบสุดท้าย:</b> Q♦9♦ บน 9c7d4d2d8s = Q-high flush — แพ้แค่ 13/990 (K♦x♦, A♦x♦) ซึ่ง A♥5♥ ไม่ใช่. snap call ถูกต้องสมบูรณ์
  <br><b>• ทำไม BB jam:</b> จากมุมเขา: flush เข้าแต่เขามี A♥ + เรื่องราว check-raise — fold equity คือไพ่ใบเดียวที่เหลือ. HU ทำให้คน bluff จุดแบบนี้บ่อยขึ้นมาก — เหตุผลที่เรา "call down กว้างขึ้น" ทั้งเกม
  <br><b>• สามบทเรียนปิดหลักสูตร:</b> (1) ความแข็งของมือ = relative กับ format/จำนวนคน/สถานการณ์เสมอ (2) วางแผนทั้งมือก่อนใส่ชิปแรก (3) ผลลัพธ์มือเดียวไม่บอกอะไร — กระบวนการพันมือต่างหากที่พาเรามาถึง heads-up
  <br><b>• ไปสนามจริง:</b> ฝึกซ้ำจนทุกเฉลยในนี้กลายเป็น "ความรู้สึก" — แล้วที่โต๊ะจริงเหลือแค่เรื่องเดียว: อ่านคนตรงหน้า. โชคดีครับแชมป์ 🏆`
},
];
