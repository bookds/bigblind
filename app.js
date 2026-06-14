/* ============================================================
   BigBlind — app engine
   ============================================================ */
(function(){
  const $ = id => document.getElementById(id);
  const SUITS = {s:{sym:'♠',c:'black'}, h:{sym:'♥',c:'red'}, d:{sym:'♦',c:'red'}, c:{sym:'♣',c:'black'}};

  // ---- persisted stats ----
  const LS = 'bigblind_stats_v1';
  let stats = load();
  function load(){ try{ return JSON.parse(localStorage.getItem(LS)) || fresh(); }catch(e){ return fresh(); } }
  function fresh(){ return {streak:0, best:0, correct:0, total:0, seen:[]}; }
  function save(){ try{ localStorage.setItem(LS, JSON.stringify(stats)); }catch(e){} }

  // ---- state ----
  let filter = 'all';
  let current = null;
  let queue = [];
  let history = [];   // [{id, chosen}]  ลำดับมือที่เล่นไปแล้ว
  let pos = -1;       // ตำแหน่งปัจจุบันใน history

  // ---- persisted session (จำมือปัจจุบันข้าม refresh) ----
  const SS = 'bigblind_session_v1';
  function saveSession(){ try{ localStorage.setItem(SS, JSON.stringify({filter, queue, history, pos})); }catch(e){} }
  function loadSession(){ try{ return JSON.parse(localStorage.getItem(SS)); }catch(e){ return null; } }

  // ---- card rendering ----
  function cardEl(code, small){
    const r = code.slice(0, code.length-1);
    const s = SUITS[code.slice(-1)];
    const el = document.createElement('div');
    el.className = 'pc deal ' + (small?'sm ':'') + s.c;
    el.innerHTML = `<div class="r">${r}</div><div class="s">${s.sym}</div>`;
    return el;
  }

  // ---- pick next spot (avoid repeats until pool exhausted) ----
  // hidden:true = middle/last step ของมือต่อเนื่อง — ห้ามโผล่เป็นจุดเริ่ม (เข้าได้ผ่าน nextSpotId เท่านั้น)
  function pool(){
    return SPOTS.filter(s => (filter==='all' || s.cat===filter) && !s.hidden);
  }
  function refillQueue(){
    queue = pool().map(s=>s.id);
    // shuffle
    for(let i=queue.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [queue[i],queue[j]]=[queue[j],queue[i]]; }
  }
  function nextSpot(){
    if(queue.length===0) refillQueue();
    // avoid immediate repeat of current
    let id = queue.shift();
    if(current && id===current.id && queue.length){ queue.push(id); id = queue.shift(); }
    return SPOTS.find(s=>s.id===id);
  }

  // ---- render a spot ---- (chosen=null คือยังไม่ตอบ, มีค่าคือโหมดทบทวน)
  function render(spot, chosen){
    current = spot;

    // meta badges
    const meta = $('meta'); meta.innerHTML='';
    meta.appendChild(tag('cat', spot.cat==='preflop'?'PREFLOP':'POSTFLOP'));
    if(spot.step) meta.appendChild(tag('hstep', '🎬 ขั้น '+spot.step));
    if(spot.stage) meta.appendChild(tag('stage', spot.stage));
    if(spot.stack) meta.appendChild(tag('stack', '💰 '+spot.stack));
    if(spot.icm) meta.appendChild(tag('icm', '⚠ ICM'));

    // ICM tournament-state bar
    const ib = $('icmbar');
    if(spot.icmState){ ib.style.display='block'; ib.innerHTML = spot.icmState; }
    else { ib.style.display='none'; ib.innerHTML=''; }

    // pot line (กลางโต๊ะ — โชว์เฉพาะ pot, รายละเอียดอยู่ใน header ของ log)
    $('potline').innerHTML = `Pot: <b>${spot.pot}bb</b>`;

    // board
    const board = $('board'); board.innerHTML='';
    if(spot.board && spot.board.length){
      spot.board.forEach((c,i)=>{ const el=cardEl(c,false); el.style.animationDelay=(i*0.05)+'s'; board.appendChild(el); });
    } else {
      const ph=document.createElement('div'); ph.className='ph'; ph.textContent='— PRE-FLOP —'; board.appendChild(ph);
    }

    // hole cards
    const hole=$('hole'); hole.innerHTML='';
    spot.hero.forEach((c,i)=>{ const el=cardEl(c,false); el.style.animationDelay=(0.15+i*0.06)+'s'; hole.appendChild(el); });
    $('heroinfo').innerHTML = `คุณ: <b>${spot.heroLine}</b>`;

    // action log (visual streets)
    renderStreets(spot);

    // action buttons
    const act=$('actions'); act.innerHTML='';
    act.className = 'actions' + (spot.opts.length===3?' three':'');
    spot.opts.forEach((o,i)=>{
      const b=document.createElement('button');
      b.className='btn '+o.k;
      b.innerHTML = `${o.label}` + (o.sub?`<small>${o.sub}</small>`:'');
      b.onclick = ()=>choose(i);
      act.appendChild(b);
    });

    $('hint').textContent = spot.cat==='preflop' ? 'Preflop — คิดถึง position & stack' : 'Postflop — คิดถึง range & board texture';
    if(chosen!=null){ markAnswer(spot, chosen); } else { closeSheet(); }
    updateStats(); updateNav();
  }

  function tag(cls, text){ const t=document.createElement('div'); t.className='tag '+cls; t.textContent=text; return t; }

  // ---- visual action log ----
  const ACT_LABEL = {fold:'Fold', check:'Check', call:'Call', bet:'Bet', cbet:'C-bet', donk:'Lead', raise:'Raise', '3bet':'3-Bet', '4bet':'4-Bet', shove:'All-in', squeeze:'Squeeze'};
  const ACT_CLASS = {fold:'fold', check:'check', call:'call', bet:'bet', cbet:'bet', donk:'bet', raise:'raise', '3bet':'raise', '4bet':'raise', shove:'shove', squeeze:'raise'};

  // ===POT-ENGINE-START=== (pot_check.js โหลดโค้ดช่วงนี้ไปตรวจกับทุก spot — แก้แล้วรัน node pot_check.js)
  // ไล่คำนวณจาก action จริง: pot ตอนเข้าแต่ละ street + ชิปคงเหลือของแต่ละคนหลังทุก action
  function potEngine(spot){
    const FR = {'½':0.5,'⅓':1/3,'⅔':2/3,'¾':0.75};
    const heroPos = (spot.heroLine||'').split('•')[0].trim() || 'YOU';
    const isHU = (spot.stage||'').toUpperCase().indexOf('HEADS') >= 0;
    let pot = 1.5, curBet = 1;
    const commit = {}, total = {};            // commit = street นี้, total = ทั้งมือ
    const seed = isHU ? {BTN:0.5, BB:1} : {SB:0.5, BB:1};   // blinds
    for(const k in seed){ commit[k]=seed[k]; total[k]=seed[k]; }
    const startPots=[], rowsPerStreet=[];
    (spot.streets||[]).forEach((st,si)=>{
      if(si>0){ for(const k in commit) commit[k]=0; curBet=0; }
      startPots.push(+pot.toFixed(2));
      const rows=[];
      (st.acts||[]).forEach(a=>{
        const p = a.pos==='YOU' ? heroPos : a.pos;
        const grouped = /[\s…]/.test(p.trim());          // 'UTG MP' / 'UTG…BTN' (fold รวบ)
        const num = a.amt ? parseFloat(a.amt) : NaN;
        const frac = a.amt && FR[a.amt.trim()];
        let added = 0;
        if(a.a==='check' || a.a==='fold'){ added = 0; }
        else if(a.a==='bet' || a.a==='cbet' || a.a==='donk'){
          const size = !isNaN(num) ? num : (frac ? +(pot*frac).toFixed(1) : 0);
          added = size; curBet = (commit[p]||0) + size;
        } else if(a.a==='call'){
          const to = !isNaN(num) ? num : curBet;
          added = Math.max(0, to - (commit[p]||0));
        } else {                                          // raise / 3bet / 4bet / squeeze / shove = ยอด "to"
          const to = !isNaN(num) ? num : 2.5;             // raise ไม่ระบุ amt (spot เก่า) สมมติ 2.5
          added = Math.max(0, to - (commit[p]||0)); curBet = Math.max(curBet, to);
        }
        if(!grouped && added){ commit[p]=(commit[p]||0)+added; total[p]=(total[p]||0)+added; pot += added; }
        rows.push(grouped ? null : (total[p]||0));        // ชิปที่ลงไปแล้วทั้งหมดของคนนั้น หลัง action นี้
      });
      rowsPerStreet.push(rows);
    });
    return { startPots, rowsPerStreet,
             ok: Math.abs(pot - (spot.pot||0)) <= 0.6,    // pot field ตรงกับ action → เชื่อถือได้
             finalPot:+pot.toFixed(2),
             heroToCall:+Math.max(0, curBet-(commit[heroPos]||0)).toFixed(2) };  // hero ค้างจ่ายเท่าไร
  }
  // ===POT-ENGINE-END===

  const fmtBB = n => (+n.toFixed(1)).toString();

  function pill(a, heroPos, remain){
    const el=document.createElement('div');
    const isHero = a.pos==='YOU';
    el.className='pill '+ (ACT_CLASS[a.a]||'') + (isHero?' hero':'');
    const posTxt = isHero ? `You(${heroPos||'?'})` : a.pos;
    const amt = a.amt ? ` ${a.amt}` : '';
    const stk = (remain!=null && !isNaN(remain)) ? `<span class="pstk">${fmtBB(remain)}bb</span>` : '';
    el.innerHTML = `<span class="pos">${posTxt}${stk}</span><span class="act">${ACT_LABEL[a.a]||a.a}${amt}</span>`;
    return el;
  }

  function renderStreets(spot){
    const log=$('log'); log.innerHTML='';
    const heroPos = (spot.heroLine||'').split('•')[0].trim() || 'YOU';
    const eng = potEngine(spot);
    const stackMap = {}; (spot.stacks||[]).forEach(([p,bb])=> stackMap[p]=bb);

    // stacks ของผู้เล่นที่อยู่ในมือ (คู่แข่ง + เรา) — มีผลต่อการตัดสินใจ
    if(Array.isArray(spot.stacks) && spot.stacks.length){
      const sr=document.createElement('div'); sr.className='stacks';
      sr.innerHTML = '<span class="slab">stacks</span>' + spot.stacks.map(([p,bb])=>{
        const isHero = p===heroPos;
        const cls = isHero ? 'stk hero' : (bb<=15 ? 'stk short' : (bb>=50 ? 'stk big' : 'stk'));
        return `<span class="${cls}"><b>${p}</b><span>${bb}bb</span></span>`;
      }).join('');
      log.appendChild(sr);
    }

    (spot.streets||[]).forEach((st,si)=>{
      const head=document.createElement('div'); head.className='st-head';
      // pot ตอนเข้า street นี้ — โชว์เฉพาะเมื่อยอดคำนวณจาก action ตรงกับ pot ของ spot
      head.innerHTML = st.name + (eng.ok ? `<span class="sthp"> · pot ${fmtBB(eng.startPots[si])}bb</span>` : '');
      log.appendChild(head);
      const row=document.createElement('div'); row.className='st-row';
      (st.acts||[]).forEach((a,ai)=>{
        const p = a.pos==='YOU' ? heroPos : a.pos;
        const committed = eng.rowsPerStreet[si][ai];
        // โชว์ stack คงเหลือเฉพาะเมื่อ replay เชื่อถือได้ (pot ตรง) — เลี่ยงเลขขัดกันใน legacy spot
        const remain = (eng.ok && committed!=null && stackMap[p]!=null) ? stackMap[p]-committed : null;
        row.appendChild(pill(a, heroPos, remain));
      });
      if(st.note){ const n=document.createElement('div'); n.className='st-note'; n.textContent=st.note; row.appendChild(n); }
      log.appendChild(row);
    });

    // สรุปสถานการณ์ปัจจุบัน (ท้าย history — ใกล้จุดตัดสินใจ): ตำแหน่งคุณ + pot + ยอดต้องจ่าย
    const hd=document.createElement('div'); hd.className='log-head';
    hd.innerHTML =
      `<div class="lh pos"><small>คุณ</small> ${spot.heroLine}</div>` +
      `<div class="lh pot"><small>POT</small> ${spot.pot}bb</div>` +
      (spot.toCall ? `<div class="lh call"><small>ต้องจ่าย</small> ${spot.toCall}bb</div>` : '');
    log.appendChild(hd);

    log.scrollTop = log.scrollHeight;
    $('turn').innerHTML = `<span class="tdot"></span><span>${spot.q}</span>`;
  }

  // ---- choose / grade ----
  function choose(idx){
    const rec = history[pos];
    if(rec && rec.chosen!=null) return;   // มือนี้ตอบไปแล้ว
    if(rec) rec.chosen = idx;
    const spot = current;
    const okSet = new Set([spot.best, ...(spot.ok||[])]);
    const isOk = okSet.has(idx);

    // stats (นับครั้งเดียวต่อมือ)
    stats.total++;
    if(isOk){ stats.correct++; stats.streak++; if(stats.streak>stats.best) stats.best=stats.streak; }
    else { stats.streak=0; }
    save();

    markAnswer(spot, idx);
    updateStats();
    saveSession();
    if(navigator.vibrate) navigator.vibrate(isOk?20:[10,40,10]);
  }

  // ---- mark buttons + show feedback (ใช้ทั้งตอนตอบและตอนทบทวน) ----
  function markAnswer(spot, idx){
    const okSet = new Set([spot.best, ...(spot.ok||[])]);
    const isBest = idx === spot.best;
    const isOk = okSet.has(idx);
    const btns = $('actions').children;
    for(let i=0;i<btns.length;i++){
      btns[i].disabled = true;
      btns[i].classList.remove('pick-good','pick-bad','show-best');
      if(i===spot.best) btns[i].classList.add('show-best');
    }
    if(btns[idx]) btns[idx].classList.add(isOk?'pick-good':'pick-bad');
    showSheet(spot, idx, isBest, isOk);
  }

  // ---- feedback sheet ----
  function showSheet(spot, idx, isBest, isOk){
    const vb = $('vbadge'), vbest=$('vbest');
    if(isBest){ vb.className='vbadge good'; vb.textContent='✓ ดีที่สุด'; }
    else if(isOk){ vb.className='vbadge ok'; vb.textContent='≈ พอรับได้'; }
    else { vb.className='vbadge bad'; vb.textContent='✗ ไม่ดีที่สุด'; }

    const bestLabel = spot.opts[spot.best].label + (spot.opts[spot.best].sub?` (${spot.opts[spot.best].sub})`:'');
    vbest.innerHTML = isBest ? '' : `ทางที่ดีที่สุด: <b>${bestLabel}</b>`;

    // เปิดไพ่คู่ต่อสู้ (showdown หรือ fold-หงาย) — เฉพาะ spot ที่มีข้อมูล reveal
    const rv = $('reveal');
    if(spot.reveal && spot.reveal.cards){
      rv.style.display='flex'; rv.innerHTML='';
      const lab=document.createElement('div'); lab.className='rlab';
      lab.innerHTML = `🃏 <b>${spot.reveal.pos}</b><br>${spot.reveal.note||'เปิดไพ่'}`;
      const rc=document.createElement('div'); rc.className='rcards';
      spot.reveal.cards.forEach(c=> rc.appendChild(cardEl(c, true)));
      rv.appendChild(rc); rv.appendChild(lab);
    } else { rv.style.display='none'; rv.innerHTML=''; }

    $('explain').innerHTML = spot.why;
    // reset deep "why" panel each time the sheet opens
    $('deep').classList.remove('open');
    $('deep').innerHTML = spot.deep || '<i style="color:var(--muted)">— ยังไม่มีคำอธิบายเจาะลึกสำหรับมือนี้ —</i>';
    $('whyBtn').classList.remove('on');
    $('peekBtn').classList.remove('show');     // ออกจากโหมดย่อ ถ้ามี
    $('sheet').classList.add('up');
    $('scrim').classList.add('up');
  }
  // ปิดสนิท (ใช้ตอนเปลี่ยนมือ) — ไม่โชว์ปุ่มดูเฉลย
  function closeSheet(){ $('sheet').classList.remove('up'); $('scrim').classList.remove('up'); $('peekBtn').classList.remove('show'); }
  // ย่อชั่วคราวเพื่อดูมือปัจจุบัน — โชว์ปุ่มลอยให้เปิดเฉลยกลับมา
  function peekSheet(){ $('sheet').classList.remove('up'); $('scrim').classList.remove('up'); $('peekBtn').classList.add('show'); }
  function reopenSheet(){ $('sheet').classList.add('up'); $('scrim').classList.add('up'); $('peekBtn').classList.remove('show'); }

  // ---- stats UI ----
  function updateStats(){
    $('sStreak').textContent = stats.streak;
    $('sCount').textContent = stats.total;
    $('sAcc').textContent = stats.total ? Math.round(stats.correct/stats.total*100)+'%' : '—';
  }

  // ---- navigation ----
  function updateNav(){
    const atStart = pos<=0;
    $('back').disabled = atStart;
    $('prev').disabled = atStart;
    const last = pos >= history.length-1;
    $('next').textContent = last ? 'มือถัดไป ▶' : 'ถัดไป ▶';
  }
  function gotoNew(){
    const s = nextSpot();
    history = history.slice(0, pos+1);   // ตัด forward ทิ้งเมื่อแตกแขนงใหม่
    history.push({id:s.id, chosen:null});
    pos = history.length-1;
    render(s, null);
    saveSession();
  }
  function goTo(p){
    pos = p;
    const rec = history[pos];
    render(SPOTS.find(x=>x.id===rec.id), rec.chosen);
    saveSession();
  }
  function goForward(){
    // ถ้า spot ปัจจุบันมี nextSpotId และเรา "ตอบไม่ใช่ fold" → ไปต่อขั้นถัดไปของ hand เดิม
    if(pos >= 0 && pos < history.length){
      const rec = history[pos];
      const cur = SPOTS.find(s=>s.id===rec.id);
      if(cur && cur.nextSpotId && rec.chosen != null){
        const chose = cur.opts[rec.chosen];
        const folded = chose && chose.k === 'fold';
        if(!folded){
          const nxt = SPOTS.find(s=>s.id===cur.nextSpotId);
          if(nxt){
            history = history.slice(0, pos+1);
            history.push({id:nxt.id, chosen:null});
            pos = history.length-1;
            render(nxt, null);
            saveSession();
            return;
          }
        }
      }
    }
    if(pos < history.length-1) goTo(pos+1); else gotoNew();
  }
  function goBack(){ if(pos > 0) goTo(pos-1); }

  // ---- events ----
  $('next').onclick  = goForward;
  $('scrim').onclick = peekSheet;   // แตะพื้นที่มืด = ย่อกล่องเฉยๆ อยู่มือเดิม (ไม่ไปมือถัดไป)
  $('prev').onclick  = goBack;
  $('back').onclick  = goBack;
  $('sheetGrab').onclick = peekSheet;   // ลากที่จับลง = ย่อเพื่อดูมือ
  $('peekBtn').onclick    = reopenSheet; // ปุ่มลอย = เปิดเฉลยกลับมา

  document.querySelectorAll('.chip').forEach(c=>{
    c.onclick = ()=>{
      document.querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));
      c.classList.add('on');
      filter = c.dataset.f;
      history = []; pos = -1;
      refillQueue();
      gotoNew();
    };
  });

  // ============================================================
  //   "ทำไม? เจาะลึก" toggle  +  AI chat (Claude API)
  // ============================================================
  $('whyBtn').onclick = ()=>{
    const d = $('deep');
    const open = d.classList.toggle('open');
    $('whyBtn').classList.toggle('on', open);
    if(open) d.scrollTop = 0;
  };

  // ---- chat state ----
  const KEY_LS = 'bigblind_apikey';
  let chatSpot = null, chatSpotId = null, chatMsgs = [];

  const SYSTEM = "You are an expert poker tournament (MTT) coach helping a serious player practice tough decision spots. The user will ask follow-up questions about a specific spot (provided below). Answer concisely and concretely. ALWAYS reply in Thai but keep English poker terms (GTO, ICM, range, c-bet, 3bet, 4bet, equity, pot odds, blocker, EV, SPR, etc.). Be direct and practical: talk about villain ranges, the math, and how the correct play changes with different reads, stacks, positions, and ICM. Keep answers short (a few sentences to a short paragraph) unless the user explicitly asks for more depth. Use **bold** for key terms. If the user doubts the recommended play, explain the assumptions behind it and the exact conditions under which a different line becomes better.";

  const SUGGEST = ['range คู่ต่อสู้น่าจะมีอะไร?', 'ถ้าเขาเล่น tight ล่ะ?', 'คิด pot odds ยังไง?', 'ถ้า stack สั้นกว่านี้?'];

  function getKey(){ try{ return localStorage.getItem(KEY_LS) || ''; }catch(e){ return ''; } }

  function plainSpot(s){
    const streets = (s.streets||[]).map(st=>{
      const acts = (st.acts||[]).map(a=>`${a.pos==='YOU'?'เรา':a.pos} ${a.a}${a.amt?' '+a.amt:''}`).join(', ');
      return `  ${st.name}: ${acts || st.note || '-'}`;
    }).join('\n');
    const opts = s.opts.map((o,i)=>`${i===s.best?'★ ':'• '}${o.label}${o.sub?' ('+o.sub+')':''}`).join('  ');
    const why = (s.why||'').replace(/<[^>]+>/g, '');
    const deep = (s.deep||'').replace(/<[^>]+>/g, ' ').replace(/\s+/g,' ').trim();
    return `ประเภท: ${s.cat}\n`+
      `มือเรา: ${s.hero.join(' ')} | ${s.heroLine}${s.icm?' | ICM spot':''}\n`+
      (s.board&&s.board.length?`บอร์ด: ${s.board.join(' ')}\n`:'(ยังไม่เปิดบอร์ด — preflop)\n')+
      `Pot: ${s.pot}bb${s.toCall?' | ต้องจ่าย '+s.toCall+'bb':''}\n`+
      `ประวัติ action:\n${streets}\n`+
      `คำถามของ spot: ${s.q}\n`+
      `ตัวเลือก (★ = ที่แนะนำ): ${opts}\n`+
      `เหตุผลที่แนะนำ: ${why}\n`+
      (deep?`รายละเอียดเพิ่มเติม: ${deep}`:'');
  }

  function fmt(t){
    return t.replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))
            .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  }
  function addBubble(role, text){
    const d = document.createElement('div');
    d.className = 'msg ' + role;
    d.textContent = text;
    $('chatBody').appendChild(d);
    $('chatBody').scrollTop = $('chatBody').scrollHeight;
    return d;
  }
  function autoGrow(){
    const t = $('chatText'); t.style.height = '44px';
    t.style.height = Math.min(t.scrollHeight, 120) + 'px';
  }
  function renderSuggest(){
    const c = $('chatSuggest'); c.innerHTML = '';
    SUGGEST.forEach(q=>{
      const b = document.createElement('div'); b.className='sg'; b.textContent=q;
      b.onclick = ()=> sendMsg(q);
      c.appendChild(b);
    });
  }

  function openChat(){
    if(!current) return;
    chatSpot = current;
    if(chatSpotId !== chatSpot.id){            // new spot → fresh conversation
      chatSpotId = chatSpot.id; chatMsgs = []; $('chatBody').innerHTML = '';
    }
    const hasKey = !!getKey();
    $('keybox').style.display = hasKey ? 'none' : 'flex';
    ['chatCtx','chatBody','chatSuggest','chatInputRow'].forEach(id=>{ $(id).style.display = hasKey ? '' : 'none'; });
    if(hasKey){
      $('chatCtx').innerHTML = `🎯 <b>${chatSpot.hero.join(' ')}</b> · ${chatSpot.heroLine} · Pot ${chatSpot.pot}bb`;
      if(chatMsgs.length === 0) renderSuggest();
    }
    $('chat').classList.add('up');
    if(hasKey) setTimeout(()=> $('chatText').focus(), 320);
  }
  function closeChat(){ $('chat').classList.remove('up'); }

  async function streamClaude(key, msgs, onText){
    const sys = [
      {type:'text', text: SYSTEM, cache_control:{type:'ephemeral'}},
      {type:'text', text: 'สถานการณ์ปัจจุบัน (spot):\n' + plainSpot(chatSpot), cache_control:{type:'ephemeral'}}
    ];
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST',
      headers:{
        'content-type':'application/json',
        'x-api-key': key,
        'anthropic-version':'2023-06-01',
        'anthropic-dangerous-direct-browser-access':'true'
      },
      body: JSON.stringify({
        model:'claude-opus-4-7',
        max_tokens: 2048,
        thinking:{type:'adaptive'},
        system: sys,
        messages: msgs.map(m=>({role:m.role, content:m.content})),
        stream: true
      })
    });
    if(!resp.ok){
      let detail = '';
      try{ const e = await resp.json(); detail = (e.error && e.error.message) || JSON.stringify(e); }
      catch(_){ try{ detail = await resp.text(); }catch(__){ detail = ''; } }
      throw new Error(resp.status + ' ' + detail);
    }
    const reader = resp.body.getReader();
    const dec = new TextDecoder();
    let buf = '';
    while(true){
      const {done, value} = await reader.read();
      if(done) break;
      buf += dec.decode(value, {stream:true});
      const parts = buf.split('\n'); buf = parts.pop();
      for(const line of parts){
        const l = line.trim();
        if(!l.startsWith('data:')) continue;
        const js = l.slice(5).trim();
        if(!js || js === '[DONE]') continue;
        let ev; try{ ev = JSON.parse(js); }catch(_){ continue; }
        if(ev.type === 'content_block_delta' && ev.delta && ev.delta.type === 'text_delta'){ onText(ev.delta.text); }
        else if(ev.type === 'error'){ throw new Error((ev.error && ev.error.message) || 'stream error'); }
      }
    }
  }

  async function sendMsg(text){
    text = (text||'').trim();
    if(!text) return;
    const key = getKey();
    if(!key){ openChat(); return; }
    addBubble('u', text);
    chatMsgs.push({role:'user', content:text});
    $('chatSuggest').innerHTML = '';
    $('chatText').value = ''; autoGrow();
    $('chatSend').disabled = true;
    const bubble = addBubble('a', '');
    bubble.classList.add('typing'); bubble.textContent = 'กำลังคิด…';
    let acc = '';
    try{
      await streamClaude(key, chatMsgs, (chunk)=>{
        acc += chunk;
        bubble.classList.remove('typing');
        bubble.innerHTML = fmt(acc);
        $('chatBody').scrollTop = $('chatBody').scrollHeight;
      });
      if(!acc){ bubble.classList.remove('typing'); bubble.innerHTML = '<i>(ไม่มีคำตอบ)</i>'; }
      chatMsgs.push({role:'assistant', content: acc});
    }catch(err){
      bubble.className = 'msg sys';
      bubble.textContent = 'ผิดพลาด: ' + err.message + (String(err.message).indexOf('401')>=0 ? ' (ตรวจสอบ API key)' : '');
      chatMsgs.pop();   // drop the user turn so the convo stays consistent
    }
    $('chatSend').disabled = false;
    $('chatBody').scrollTop = $('chatBody').scrollHeight;
  }

  $('askBtn').onclick    = openChat;
  $('chatClose').onclick = closeChat;
  $('keySave').onclick   = ()=>{
    const v = $('keyInput').value.trim();
    if(!v) return;
    try{ localStorage.setItem(KEY_LS, v); }catch(e){}
    $('keyInput').value = '';
    openChat();
  };
  $('chatSend').onclick = ()=> sendMsg($('chatText').value);
  $('chatText').addEventListener('input', autoGrow);
  $('chatText').addEventListener('keydown', e=>{
    if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); sendMsg($('chatText').value); }
  });

  // ---- boot ----
  updateStats();
  (function boot(){
    const sess = loadSession();
    // restore เฉพาะเมื่อ session ใช้ได้และมีมือค้างอยู่จริง
    if(sess && Array.isArray(sess.history) && sess.history.length && typeof sess.pos==='number'
       && sess.pos>=0 && sess.pos < sess.history.length
       && SPOTS.find(x=>x.id === sess.history[sess.pos].id)){
      filter  = sess.filter || 'all';
      queue   = Array.isArray(sess.queue) ? sess.queue : [];
      history = sess.history;
      pos     = sess.pos;
      // sync filter chip UI
      document.querySelectorAll('.chip').forEach(c=>{
        c.classList.toggle('on', c.dataset.f === filter);
      });
      goTo(pos);   // วาดมือเดิม + สถานะที่ตอบไปแล้ว
      return;
    }
    refillQueue();
    gotoNew();
  })();
})();
