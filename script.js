// ORGANIC CHEMISTRY STUDIO - แอพเรียนเคมีอินทรีย์ ม.6 สำหรับ GitHub Pages
// ใช้ Vanilla JavaScript ทั้งหมด ไม่ต้องมี Backend

const prefixes = ['', 'Meth', 'Eth', 'Prop', 'But', 'Pent', 'Hex', 'Hept', 'Oct', 'Non', 'Dec', 'Undec', 'Dodec', 'Tridec', 'Tetradec', 'Pentadec', 'Hexadec', 'Heptadec', 'Octadec', 'Nonadec', 'Eicos'];

const functionalGroups = {
  none: { th:'ไม่มีหมู่ฟังก์ชัน', en:'Hydrocarbon', suffix:'', formula:'', hint:'ดูชนิดพันธะเป็นหลัก', minC:1 },
  alcohol: { th:'แอลกอฮอล์', en:'Alcohol', suffix:'ol', formula:'-OH', hint:'หมู่ -OH อ่านลงท้าย -ol', minC:1 },
  aldehyde: { th:'แอลดีไฮด์', en:'Aldehyde', suffix:'al', formula:'-CHO', hint:'หมู่ -CHO อยู่ปลายโซ่ อ่านลงท้าย -al', minC:1 },
  ketone: { th:'คีโตน', en:'Ketone', suffix:'one', formula:'>C=O', hint:'หมู่ C=O อยู่กลางโซ่ อ่านลงท้าย -one', minC:3 },
  acid: { th:'กรดคาร์บอกซิลิก', en:'Carboxylic Acid', suffix:'oic acid', formula:'-COOH', hint:'หมู่ -COOH อ่านลงท้าย -oic acid', minC:1 },
  ester: { th:'เอสเทอร์', en:'Ester', suffix:'oate', formula:'-COO-', hint:'เอสเทอร์อ่าน alkyl + alkanoate', minC:2 },
  amine: { th:'เอมีน', en:'Amine', suffix:'amine', formula:'-NH₂', hint:'หมู่ -NH₂ อ่านลงท้าย -amine', minC:1 },
  amide: { th:'เอไมด์', en:'Amide', suffix:'amide', formula:'-CONH₂', hint:'หมู่ -CONH₂ อ่านลงท้าย -amide', minC:1 },
  ether: { th:'อีเทอร์', en:'Ether', suffix:'ether', formula:'-O-', hint:'มี O คั่นกลางระหว่างคาร์บอน', minC:2 },
  halo: { th:'ฮาโลอัลเคน', en:'Haloalkane', suffix:'', formula:'-Cl', hint:'ใช้ chloro- เป็นคำนำหน้า เช่น chloropropane', minC:1 }
};

const planets = [
  {id:'carbon', title:'Carbon World', desc:'ธาตุในสารอินทรีย์ สมบัติคาร์บอน โซ่ตรง โซ่กิ่ง วงแหวน', emoji:'⚛️'},
  {id:'bond', title:'Bond Laboratory', desc:'ทดลองพันธะเดี่ยว คู่ สาม และ σ/π bond', emoji:'🔗'},
  {id:'structure', title:'Structure Studio', desc:'สูตรโมเลกุล แบบเต็ม แบบย่อ และเส้นมุม', emoji:'🧬'},
  {id:'hydrocarbon', title:'Hydrocarbon Planet', desc:'Alkane Alkene Alkyne พร้อมสูตรทั่วไปแบบปรับค่าได้', emoji:'🚀'},
  {id:'fg', title:'Functional Group Museum', desc:'แกลเลอรีหมู่ฟังก์ชัน พร้อมจุดสังเกต', emoji:'🧪'},
  {id:'iupac', title:'IUPAC Academy', desc:'อ่านชื่อสารอินทรีย์ รวมถึงสารที่มีหมู่ฟังก์ชัน', emoji:'📘'},
  {id:'builder', title:'Organic Builder', desc:'สร้างโมเลกุลเอง ปรับจำนวน C พันธะ ตำแหน่ง และหมู่ฟังก์ชัน', emoji:'🛠️'},
  {id:'challenge', title:'Challenge Arena', desc:'มินิเกมและแบบทดสอบสุ่ม', emoji:'🏆'},
  {id:'exam', title:'Final Examination', desc:'แบบทดสอบท้ายบทพร้อมสรุปผล', emoji:'🎓'}
];

let student = JSON.parse(localStorage.getItem('ocs_student') || 'null');
let progress = JSON.parse(localStorage.getItem('ocs_progress') || '{}');
let currentQuiz = null;
let hearts = 3;
let score = Number(localStorage.getItem('ocs_score') || 0);

function save(){ localStorage.setItem('ocs_progress', JSON.stringify(progress)); localStorage.setItem('ocs_score', score); }
function $(id){ return document.getElementById(id); }
function setAssistant(text){ $('assistantText').textContent = text; }

function startApp(){
  student = {
    name: $('studentName').value.trim() || 'นักเรียนเคมีอินทรีย์',
    className: $('studentClass').value.trim() || 'ม.6',
    no: $('studentNo').value.trim() || '-',
    school: $('studentSchool').value.trim() || '-'
  };
  localStorage.setItem('ocs_student', JSON.stringify(student));
  $('userChip').textContent = `${student.name} | ${student.className}`;
  renderHome(); show('homeScreen');
}

function show(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); $(id).classList.add('active'); }
function goHome(){ renderHome(); show('homeScreen'); setAssistant('เลือกเรียนด่านไหนก่อนก็ได้ค่ะ แนะนำลอง Organic Builder เพื่อเห็นภาพรวมก่อน'); }

function renderHome(){
  if(student) $('userChip').textContent = `${student.name} | ${student.className}`;
  $('planetGrid').innerHTML = planets.map((p,i)=>{
    const pct = progress[p.id]?.passed ? 100 : (progress[p.id]?.visited ? 45 : 0);
    return `<div class="planet glass">
      <div class="num">${p.emoji}</div><h3>${i+1}. ${p.title}</h3><p>${p.desc}</p>
      <div class="progress-bar"><div style="width:${pct}%"></div></div>
      <button class="primary" onclick="openLesson('${p.id}')">เข้าเรียน / ทดลอง</button>
    </div>`;
  }).join('');
}

function openLesson(id){
  progress[id] = progress[id] || {}; progress[id].visited = true; save();
  const fn = lessons[id];
  $('lessonContent').innerHTML = fn ? fn() : '<div class="card glass">ยังไม่มีบทเรียน</div>';
  show('lessonScreen');
  setTimeout(()=>{ if(id==='builder') updateBuilder(); if(id==='hydrocarbon') updateHydrocarbon(); if(id==='bond') updateBond(); if(id==='iupac') updateNaming(); },50);
}

const lessons = {
  carbon(){ setAssistant('คาร์บอนมีเวเลนซ์อิเล็กตรอน 4 ตัว จึงสร้างพันธะได้ 4 พันธะ'); return lessonWrap('Carbon World', `
    <div class="card glass"><h3>สารอินทรีย์และสมบัติของคาร์บอน</h3><p>สารอินทรีย์มักประกอบด้วย C, H, O, N, S, P และฮาโลเจน คาร์บอนสร้างพันธะได้ 4 พันธะ ทำให้เกิดโซ่ตรง โซ่กิ่ง และวงแหวนได้</p><div class="pill-row">${['C','H','O','N','S','P','F','Cl','Br','I'].map(e=>`<button onclick="this.classList.toggle('primary')">${e}</button>`).join('')}</div></div>
    <div class="card glass"><h3>ทดลองเลือกรูปแบบโครงสร้าง</h3><div class="controls"><select id="chainType" onchange="drawCarbonModel()"><option value="straight">โซ่ตรง</option><option value="branch">โซ่กิ่ง</option><option value="ring">วงแหวน</option></select><input type="range" id="carbonCountMini" min="3" max="8" value="5" oninput="drawCarbonModel()"></div><div class="molecule-panel" id="carbonModel"></div></div>
    ${quizBox('carbon')}`); },
  bond(){ setAssistant('พันธะเดี่ยวมี σ 1, พันธะคู่มี σ 1 + π 1, พันธะสามมี σ 1 + π 2'); return lessonWrap('Bond Laboratory', `
    <div class="card glass"><h3>ปรับชนิดพันธะ</h3><div class="controls"><select id="bondType" onchange="updateBond()"><option value="1">พันธะเดี่ยว C—C</option><option value="2">พันธะคู่ C=C</option><option value="3">พันธะสาม C≡C</option></select></div><div class="molecule-panel" id="bondViewer"></div><div id="bondInfo" class="result-box"></div></div>${quizBox('bond')}`); },
  structure(){ setAssistant('สูตรเส้นมุมใช้ปลายเส้นและจุดหักมุมแทนคาร์บอน'); return lessonWrap('Structure Studio', `
    <div class="card glass"><h3>แปลงรูปแบบโครงสร้าง</h3><div class="controls"><select id="structureC" onchange="updateStructure()">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<option value="${n}">${n} Carbon</option>`).join('')}</select><select id="structureType" onchange="updateStructure()"><option value="alkane">Alkane</option><option value="alkene">Alkene</option><option value="alkyne">Alkyne</option></select></div><button onclick="updateStructure()" class="primary">Transform Structure</button><div class="result-box" id="structureText"></div><div class="molecule-panel" id="structureViewer"></div></div>${quizBox('structure')}`); },
  hydrocarbon(){ setAssistant('ลองเลื่อนจำนวนคาร์บอน สูตรของ Alkane/Alkene/Alkyne จะเปลี่ยนตามค่าจริง'); return lessonWrap('Hydrocarbon Planet', `
    <div class="card glass"><h3>Hydrocarbon Formula Generator</h3><label>จำนวนคาร์บอน: <b id="hydroCLabel">4</b></label><input type="range" id="hydroC" min="1" max="20" value="4" oninput="updateHydrocarbon()"><div class="controls"><select id="hydroType" onchange="updateHydrocarbon()"><option value="alkane">Alkane CnH₂n+₂</option><option value="alkene">Alkene CnH₂n</option><option value="alkyne">Alkyne CnH₂n−2</option><option value="aromatic">Aromatic: Benzene</option></select></div><div id="hydroResult" class="result-box"></div><div class="molecule-panel" id="hydroViewer"></div></div>${quizBox('hydrocarbon')}`); },
  fg(){ setAssistant('กด Highlight เพื่อดูตำแหน่งหมู่ฟังก์ชันที่ต้องสังเกต'); const cards = Object.entries(functionalGroups).filter(([k])=>k!=='none').map(([k,g])=>`<div class="card glass"><h3>${g.en} <span class="badge">${g.formula}</span></h3><p>${g.th} | จุดสังเกต: ${g.hint}</p><button onclick="showFG('${k}')">ดูโครงสร้างตัวอย่าง</button></div>`).join(''); return lessonWrap('Functional Group Museum', `<div class="planet-grid">${cards}</div><div class="card glass"><h3>ตัวอย่างโครงสร้าง</h3><div class="molecule-panel" id="fgViewer">เลือกหมู่ฟังก์ชันเพื่อดูภาพ</div><div id="fgText" class="result-box">-</div></div>${quizBox('fg')}`); },
  iupac(){ setAssistant('หลักคือ หาโซ่หลัก → เลขตำแหน่ง → หมู่ฟังก์ชัน → รวมชื่อ'); return lessonWrap('IUPAC Academy', `
    <div class="card glass"><h3>IUPAC Name Generator มีหมู่ฟังก์ชัน</h3><div class="controls"><select id="nameC" onchange="updateNaming()">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<option value="${n}">${n} Carbon</option>`).join('')}</select><select id="nameBond" onchange="updateNaming()"><option value="alkane">Alkane</option><option value="alkene">Alkene</option><option value="alkyne">Alkyne</option></select><select id="nameFG" onchange="updateNaming()">${Object.entries(functionalGroups).map(([k,g])=>`<option value="${k}">${g.en} ${g.formula}</option>`).join('')}</select><select id="namePos" onchange="updateNaming()"></select></div><div id="nameResult" class="result-box"></div><div class="molecule-panel" id="nameViewer"></div></div>
    <div class="card glass"><h3>ตาราง Prefix</h3><table class="table"><tr><th>C</th><th>Prefix</th><th>ตัวอย่าง Alkane</th></tr>${[1,2,3,4,5,6,7,8,9,10].map(n=>`<tr><td>${n}</td><td>${prefixes[n]}-</td><td>${prefixes[n]}ane</td></tr>`).join('')}</table></div>${quizBox('iupac')}`); },
  builder(){ setAssistant('นี่คือหัวใจของแอป ปรับ Carbon, พันธะ, หมู่ฟังก์ชัน แล้วดูผลสูตรและชื่อแบบ Real-time'); return lessonWrap('Organic Builder', `
    <div class="card glass"><h3>Build Molecule Sandbox</h3><label>จำนวนคาร์บอน: <b id="builderCLabel">4</b></label><input type="range" id="builderC" min="1" max="15" value="4" oninput="updateBuilder()"><div class="controls"><select id="builderBond" onchange="updateBuilder()"><option value="alkane">Alkane</option><option value="alkene">Alkene</option><option value="alkyne">Alkyne</option></select><select id="builderFG" onchange="updateBuilder()">${Object.entries(functionalGroups).map(([k,g])=>`<option value="${k}">${g.en} ${g.formula}</option>`).join('')}</select><select id="builderPos" onchange="updateBuilder()"></select><select id="builderBranch" onchange="updateBuilder()"><option value="none">ไม่มีกิ่ง</option><option value="methyl">เพิ่ม Methyl branch</option></select></div><button onclick="resetBuilder()">Reset</button><div id="builderResult" class="result-box"></div><div class="molecule-panel" id="builderViewer"></div></div>${quizBox('builder')}`); },
  challenge(){ setAssistant('ตอบคำถามเพื่อสะสมคะแนน ด่านนี้สุ่มจากเนื้อหาทั้งหมด'); return lessonWrap('Challenge Arena', `<div class="card glass"><h3>Mini Challenge</h3><p>ตอบให้ถูกก่อนหัวใจหมด</p></div>${quizBox('challenge')}`); },
  exam(){ setAssistant('ทำข้อสอบท้ายบท ระบบจะบันทึกคะแนนรวมให้ใน Certificate'); return lessonWrap('Final Examination', `<div class="card glass"><h3>Final Examination</h3><p>รวมคำถามเรื่องโครงสร้าง พันธะ หมู่ฟังก์ชัน และ IUPAC Naming</p></div>${quizBox('exam')}`); }
};

function lessonWrap(title, inner){ return `<div class="section-title"><h2>${title}</h2></div><div class="lesson-layout"><div>${inner}</div><div class="card glass"><h3>สรุปจำง่าย</h3><div class="pill-row"><span class="pill">C สร้างพันธะ 4</span><span class="pill">-ane เดี่ยว</span><span class="pill">-ene คู่</span><span class="pill">-yne สาม</span><span class="pill">-ol Alcohol</span><span class="pill">-al Aldehyde</span><span class="pill">-one Ketone</span><span class="pill">-oic acid กรด</span></div><hr><div class="molecule-panel" id="sideMolecule">${drawSVG(4,'alkane','none',1,false)}</div></div></div>`; }

function formula(n,type,fg='none'){
  if(type==='aromatic') return 'C₆H₆';
  let h = 2*n+2; if(type==='alkene') h = 2*n; if(type==='alkyne') h = 2*n-2;
  if(fg==='alcohol'||fg==='ether') return sub(`C${n}H${h}O`);
  if(fg==='aldehyde'||fg==='ketone') return sub(`C${n}H${Math.max(0,h-2)}O`);
  if(fg==='acid'||fg==='ester') return sub(`C${n}H${Math.max(0,h-2)}O2`);
  if(fg==='amine') return sub(`C${n}H${h+1}N`);
  if(fg==='amide') return sub(`C${n}H${Math.max(0,h-1)}NO`);
  if(fg==='halo') return sub(`C${n}H${h-1}Cl`);
  return sub(`C${n}H${h}`);
}
function sub(s){ return s.replace(/(\d+)/g, m=>[...m].map(d=>'₀₁₂₃₄₅₆₇₈₉'[d]).join('')); }
function baseName(n,type){ const p = prefixes[n] || `${n}-carbon`; if(type==='alkene') return p+'ene'; if(type==='alkyne') return p+'yne'; return p+'ane'; }
function iupacName(n,type,fg,pos=1,branch='none'){
  if(type==='aromatic') return 'Benzene';
  const p = prefixes[n] || `${n}-carbon`;
  const loc = (n>2 && (type==='alkene'||type==='alkyne')) ? `-${Math.min(pos,n-1)}-` : '';
  let root = type==='alkene' ? `${p}${loc}ene` : type==='alkyne' ? `${p}${loc}yne` : `${p}ane`;
  if(fg==='none') return addBranch(root,pos,branch);
  if(fg==='alcohol') root = `${p}an-${pos}-ol`;
  if(fg==='aldehyde') root = `${p}anal`;
  if(fg==='ketone') root = `${p}an-${Math.max(2,pos)}-one`;
  if(fg==='acid') root = `${p}anoic acid`;
  if(fg==='amine') root = `${p}an-${pos}-amine`;
  if(fg==='amide') root = `${p}anamide`;
  if(fg==='halo') root = `${pos}-Chloro${p.toLowerCase()}ane`;
  if(fg==='ether') root = `Methoxy${p.toLowerCase()}ane`;
  if(fg==='ester') root = `Methyl ${p.toLowerCase()}anoate`;
  return addBranch(root,pos,branch);
}
function addBranch(name,pos,branch){ return branch==='methyl' ? `${Math.max(2,pos)}-Methyl${name[0].toLowerCase()+name.slice(1)}` : name; }
function condensed(n,type,fg='none',pos=1){
  if(n===1 && fg==='none') return 'CH₄';
  if(type==='alkene' && n>=2) return n===2?'CH₂=CH₂':`CH₂=CH${'CH₂'.repeat(Math.max(0,n-3))}CH₃`;
  if(type==='alkyne' && n>=2) return n===2?'HC≡CH':`HC≡C${'CH₂'.repeat(Math.max(0,n-3))}CH₃`;
  let chain = n===1?'CH₄':`CH₃${'CH₂'.repeat(Math.max(0,n-2))}CH₃`;
  if(fg==='alcohol') return n===1?'CH₃OH':`CH₃${'CH₂'.repeat(Math.max(0,n-2))}CH₂OH`;
  if(fg==='aldehyde') return n===1?'HCHO':`CH₃${'CH₂'.repeat(Math.max(0,n-2))}CHO`;
  if(fg==='ketone') return n>=3 ? `CH₃CO${'CH₂'.repeat(Math.max(0,n-3))}CH₃` : 'ต้องมี C ≥ 3';
  if(fg==='acid') return n===1?'HCOOH':`CH₃${'CH₂'.repeat(Math.max(0,n-2))}COOH`;
  if(fg==='amine') return n===1?'CH₃NH₂':`CH₃${'CH₂'.repeat(Math.max(0,n-2))}CH₂NH₂`;
  if(fg==='amide') return n===1?'HCONH₂':`CH₃${'CH₂'.repeat(Math.max(0,n-2))}CONH₂`;
  if(fg==='ester') return `CH₃COO${n>2?'CH₂CH₃':'CH₃'}`;
  if(fg==='ether') return `CH₃O${n>1?'CH₂CH₃':'CH₃'}`;
  if(fg==='halo') return n===1?'CH₃Cl':`CH₃${'CH₂'.repeat(Math.max(0,n-2))}CH₂Cl`;
  return chain;
}

function drawSVG(n=4,type='alkane',fg='none',pos=1,branch=false){
  n = Number(n); pos = Math.min(Math.max(1, Number(pos)||1), n);
  if(type==='aromatic') return benzeneSVG();
  const w = Math.max(360, n*82+100), y=160, start=55, gap=75;
  let svg = `<svg viewBox="0 0 ${w} 320" role="img">`;
  for(let i=1;i<n;i++){
    const x1=start+(i-1)*gap, x2=start+i*gap; let cls='bond';
    if(type==='alkene' && i===Math.min(pos,n-1)) svg += lineSet(x1,y,x2,y,2);
    else if(type==='alkyne' && i===Math.min(pos,n-1)) svg += lineSet(x1,y,x2,y,3);
    else svg += `<line class="${cls}" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/>`;
  }
  for(let i=0;i<n;i++){ const x=start+i*gap; svg += atom(x,y,'C'); if(i===pos-1 && branch) { svg += `<line class="bond fg" x1="${x}" y1="${y-24}" x2="${x}" y2="${y-82}"/>${atom(x,y-105,'CH₃','fg')}`; } }
  const fgX = start+(pos-1)*gap;
  if(fg==='alcohol') svg += `<line class="bond fg" x1="${fgX}" y1="${y+24}" x2="${fgX}" y2="${y+78}"/>${atom(fgX,y+104,'OH','fg')}`;
  if(fg==='amine') svg += `<line class="bond fg" x1="${fgX}" y1="${y+24}" x2="${fgX}" y2="${y+78}"/>${atom(fgX,y+104,'NH₂','fg')}`;
  if(fg==='halo') svg += `<line class="bond fg" x1="${fgX}" y1="${y+24}" x2="${fgX}" y2="${y+78}"/>${atom(fgX,y+104,'Cl','fg')}`;
  if(fg==='aldehyde'||fg==='acid'||fg==='amide') { const x=start+(n-1)*gap; svg += `<line class="bond fg" x1="${x+24}" y1="${y}" x2="${x+78}" y2="${y}"/>`; svg += atom(x+108,y, fg==='aldehyde'?'CHO':fg==='acid'?'COOH':'CONH₂','fg'); }
  if(fg==='ketone') { const x=fgX; svg += lineSet(x,y-25,x,y-86,2,'fg'); svg += atom(x,y-112,'O','fg'); }
  if(fg==='ester') { const x=start+(n-1)*gap; svg += `<line class="bond fg" x1="${x+24}" y1="${y}" x2="${x+72}" y2="${y}"/>${atom(x+110,y,'COOCH₃','fg')}`; }
  if(fg==='ether') { const x=fgX; svg += `<line class="bond fg" x1="${x}" y1="${y+24}" x2="${x}" y2="${y+75}"/>${atom(x,y+104,'OCH₃','fg')}`; }
  svg += `<text x="20" y="300" fill="#637083" font-size="16">Dynamic SVG: โครงสร้างเปลี่ยนตามค่าที่เลือกจริง</text></svg>`;
  return svg;
}
function lineSet(x1,y1,x2,y2,count,extra='') { let out=''; const offsets = count===2?[-7,7]:[-11,0,11]; offsets.forEach(o=> out += `<line class="bond ${count===2?'double':'triple'} ${extra}" x1="${x1}" y1="${y1+o}" x2="${x2}" y2="${y2+o}"/>`); return out; }
function atom(x,y,t,cls=''){ return `<g><circle class="atom ${cls}" cx="${x}" cy="${y}" r="25"/><text class="atomText" x="${x}" y="${y+7}" text-anchor="middle">${t}</text></g>`; }
function benzeneSVG(){ return `<svg viewBox="0 0 420 320"><polygon points="210,65 295,115 295,205 210,255 125,205 125,115" fill="none" class="bond"/><circle cx="210" cy="160" r="58" fill="none" stroke="#ff9f1c" stroke-width="4" stroke-dasharray="8 8"><animateTransform attributeName="transform" type="rotate" from="0 210 160" to="360 210 160" dur="8s" repeatCount="indefinite"/></circle>${atom(210,65,'C')}${atom(295,115,'C')}${atom(295,205,'C')}${atom(210,255,'C')}${atom(125,205,'C')}${atom(125,115,'C')}<text x="150" y="305" fill="#17324d" font-size="22" font-weight="800">Benzene C₆H₆</text></svg>`; }

function drawCarbonModel(){ const n=$('carbonCountMini')?.value||5, type=$('chainType')?.value||'straight'; let svg = type==='ring'?benzeneSVG():drawSVG(n,'alkane','none',2,type==='branch'); $('carbonModel').innerHTML=svg; }
function updateBond(){ const b=$('bondType').value; const type=b==='1'?'alkane':b==='2'?'alkene':'alkyne'; $('bondViewer').innerHTML=drawSVG(2,type,'none',1,false); $('bondInfo').innerHTML = b==='1'?'พันธะเดี่ยว: σ bond 1 พันธะ | ตัวอย่าง CH₃–CH₃':b==='2'?'พันธะคู่: σ bond 1 + π bond 1 | ตัวอย่าง CH₂=CH₂':'พันธะสาม: σ bond 1 + π bond 2 | ตัวอย่าง HC≡CH'; }
function updateStructure(){ const n=+$('structureC').value, type=$('structureType').value; $('structureText').innerHTML=`<b>ชื่อ:</b> ${baseName(n,type)}<br><b>สูตรโมเลกุล:</b> ${formula(n,type)}<br><b>สูตรย่อ:</b> ${condensed(n,type)}<br><b>สูตรเส้นมุม:</b> ปลายเส้นและจุดหักมุมแทน C`; $('structureViewer').innerHTML=drawSVG(n,type,'none',1,false); }
function updateHydrocarbon(){ const n=+$('hydroC').value, type=$('hydroType').value; $('hydroCLabel').textContent=n; const realType = type==='aromatic'?'aromatic':type; $('hydroResult').innerHTML=`<b>ชนิด:</b> ${type}<br><b>ชื่อ:</b> ${type==='aromatic'?'Benzene':baseName(n,type)}<br><b>สูตร:</b> ${formula(n,realType)}<br><b>สูตรย่อ:</b> ${type==='aromatic'?'C₆H₆ วงเบนซีน':condensed(n,type)}`; $('hydroViewer').innerHTML=drawSVG(type==='aromatic'?6:n,realType,'none',1,false); }
function showFG(k){ const g=functionalGroups[k]; const n = k==='ketone'?4:k==='ester'?3:3; const pos=k==='ketone'?2:1; $('fgViewer').innerHTML=drawSVG(n,'alkane',k,pos,false); $('fgText').innerHTML=`<b>${g.en}</b> ${g.formula}<br>${g.hint}<br><b>ตัวอย่างชื่อ:</b> ${iupacName(n,'alkane',k,pos)}`; setAssistant(g.hint); }
function fillPositions(prefix){ const n=+$(prefix+'C').value; const el=$(prefix+'Pos'); if(!el) return; el.innerHTML = Array.from({length:n},(_,i)=>`<option value="${i+1}">ตำแหน่ง ${i+1}</option>`).join(''); }
function updateNaming(){ fillPositions('name'); const n=+$('nameC').value, type=$('nameBond').value, fg=$('nameFG').value, pos=+$('namePos').value||1; const min=functionalGroups[fg].minC; if(n<min){ $('nameResult').innerHTML=`หมู่ ${functionalGroups[fg].en} ต้องใช้คาร์บอนอย่างน้อย ${min} ตัว`; return; } $('nameResult').innerHTML=`<b>IUPAC Name:</b> ${iupacName(n,type,fg,pos)}<br><b>Molecular Formula:</b> ${formula(n,type,fg)}<br><b>Condensed Formula:</b> ${condensed(n,type,fg,pos)}<br><b>หลักจำ:</b> ${functionalGroups[fg].hint}`; $('nameViewer').innerHTML=drawSVG(n,type,fg,pos,false); }
function updateBuilder(){ fillPositions('builder'); const n=+$('builderC').value, type=$('builderBond').value, fg=$('builderFG').value, pos=+$('builderPos').value||1, branch=$('builderBranch').value; $('builderCLabel').textContent=n; const min=functionalGroups[fg].minC; if(n<min){ $('builderResult').innerHTML=`⚠️ หมู่ ${functionalGroups[fg].en} ต้องใช้คาร์บอนอย่างน้อย ${min} ตัว`; $('builderViewer').innerHTML=''; return; } $('builderResult').innerHTML=`<b>IUPAC Name:</b> ${iupacName(n,type,fg,pos,branch)}<br><b>Molecular Formula:</b> ${formula(n,type,fg)}<br><b>Condensed Formula:</b> ${condensed(n,type,fg,pos)}<br><b>Functional Group:</b> ${functionalGroups[fg].en} ${functionalGroups[fg].formula}<br><b>คำใบ้:</b> ${functionalGroups[fg].hint}`; $('builderViewer').innerHTML=drawSVG(n,type,fg,pos,branch==='methyl'); }
function resetBuilder(){ $('builderC').value=4; $('builderBond').value='alkane'; $('builderFG').value='none'; $('builderBranch').value='none'; updateBuilder(); }

const quizBank = [
  {q:'คาร์บอนสร้างพันธะได้กี่พันธะ', a:'4', choices:['1','2','3','4']},
  {q:'Alkane ลงท้ายด้วยอะไร', a:'-ane', choices:['-ane','-ene','-yne','-ol']},
  {q:'Alkene มีพันธะชนิดใด', a:'พันธะคู่', choices:['พันธะเดี่ยว','พันธะคู่','พันธะสาม','ไอออนิก']},
  {q:'Alcohol มีหมู่ฟังก์ชันใด', a:'-OH', choices:['-OH','-CHO','-COOH','-NH₂']},
  {q:'Ketone อ่านลงท้ายว่าอะไร', a:'-one', choices:['-ol','-al','-one','-amide']},
  {q:'CH₃CH₂OH คือสารใด', a:'Ethanol', choices:['Methanol','Ethanol','Ethanal','Ethanoic acid']},
  {q:'CH₃COOH อ่านชื่อว่าอะไร', a:'Ethanoic acid', choices:['Ethanol','Ethanal','Ethanoic acid','Propanone']},
  {q:'Propan-2-ol มี OH ที่คาร์บอนตำแหน่งใด', a:'2', choices:['1','2','3','ไม่มี OH']},
  {q:'Aldehyde มีหมู่ใด', a:'-CHO', choices:['-CHO','>C=O','-COO-','-CONH₂']},
  {q:'C₃H₈ เป็นสูตรของสารใด', a:'Propane', choices:['Methane','Ethane','Propane','Butane']},
  {q:'พันธะสามประกอบด้วย π bond กี่พันธะ', a:'2', choices:['0','1','2','3']},
  {q:'Carboxylic acid อ่านลงท้ายว่าอะไร', a:'-oic acid', choices:['-ol','-one','-oic acid','-amine']}
];
function quizBox(id){ hearts=3; const qs = shuffle([...quizBank]).slice(0, id==='exam'?10:5); currentQuiz={id,qs,index:0,correct:0}; return `<div class="card glass"><h3>แบบทดสอบประจำด่าน</h3><div class="hearts" id="hearts">❤️❤️❤️</div><div id="quizArea"></div><button onclick="renderQuiz()" class="primary">เริ่ม/โหลดข้อสอบ</button></div>`; }
function renderQuiz(){ const q=currentQuiz.qs[currentQuiz.index]; if(!q){ finishQuiz(); return; } $('quizArea').innerHTML=`<h3>ข้อ ${currentQuiz.index+1}: ${q.q}</h3>${q.choices.map(c=>`<button class="quiz-option" onclick="answerQuiz(this,'${escapeJS(c)}')">${c}</button>`).join('')}<button onclick="setAssistant('คำใบ้: ${escapeJS(q.a)} เกี่ยวข้องกับคำตอบข้อนี้')">ขอคำใบ้</button>`; }
function answerQuiz(btn,ans){ const q=currentQuiz.qs[currentQuiz.index]; if(ans===q.a){ btn.classList.add('correct'); currentQuiz.correct++; score+=10; } else { btn.classList.add('wrong'); hearts--; $('hearts').textContent='❤️'.repeat(hearts)+'🤍'.repeat(3-hearts); setAssistant(`ยังไม่ถูกค่ะ คำตอบที่ถูกคือ ${q.a}`); } save(); setTimeout(()=>{ if(hearts<=0){ $('quizArea').innerHTML='<h3>หัวใจหมดแล้ว เริ่มแบบทดสอบด่านนี้ใหม่นะคะ</h3><button onclick="renderQuiz()">เริ่มใหม่</button>'; hearts=3; currentQuiz.index=0; currentQuiz.correct=0; $('hearts').textContent='❤️❤️❤️'; } else { currentQuiz.index++; renderQuiz(); } },700); }
function finishQuiz(){ const pct=Math.round(currentQuiz.correct/currentQuiz.qs.length*100); progress[currentQuiz.id]={visited:true,passed:pct>=60,score:pct}; save(); $('quizArea').innerHTML=`<h3>สำเร็จ!</h3><p>ได้ ${currentQuiz.correct}/${currentQuiz.qs.length} ข้อ (${pct}%)</p><button onclick="goHome()" class="primary">กลับ Learning Galaxy</button>`; setAssistant(pct>=60?'ผ่านด่านแล้วค่ะ เก่งมาก!':'ลองทบทวนแล้วทำใหม่ได้ค่ะ'); }
function shuffle(a){ return a.sort(()=>Math.random()-.5); }
function escapeJS(s){ return String(s).replace(/'/g,"\\'"); }

function showCertificate(){
  const passed = planets.filter(p=>progress[p.id]?.passed).length;
  const total = Math.min(100, score);
  const level = total>=80?'Organic Master':total>=60?'Structure Explorer':'Carbon Beginner';
  $('certificateCard').innerHTML = `<div class="cert-title">Certificate of Organic Chemistry</div><p>มอบให้</p><h2>${student?.name||'นักเรียน'}</h2><p>${student?.className||''} เลขที่ ${student?.no||'-'}<br>${student?.school||''}</p><div class="score-big">${total}</div><h3>${level}</h3><p>ผ่านแล้ว ${passed}/${planets.length} ด่าน</p><table class="table"><tr><th>ด่าน</th><th>สถานะ</th><th>คะแนน</th></tr>${planets.map(p=>`<tr><td>${p.title}</td><td>${progress[p.id]?.passed?'ผ่าน':'ยังไม่ผ่าน'}</td><td>${progress[p.id]?.score??'-'}</td></tr>`).join('')}</table><br><button onclick="window.print()" class="primary">พิมพ์/บันทึกเป็น PDF</button>`;
  show('certificateScreen');
}
function resetProgress(){ if(confirm('ต้องการล้างข้อมูลทั้งหมดหรือไม่')){ localStorage.removeItem('ocs_progress'); localStorage.removeItem('ocs_score'); progress={}; score=0; renderHome(); } }

// เริ่มต้นระบบ
if(student){ $('userChip').textContent = `${student.name} | ${student.className}`; renderHome(); show('homeScreen'); }
else show('loginScreen');
