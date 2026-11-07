const routineDefaults=[{"id": "bed", "icon": "🛏️", "label": "Make the bed", "time": "07:15", "minutes": 5, "enabled": true}, {"id": "breakfast", "icon": "🥣", "label": "Eat breakfast", "time": "07:30", "minutes": 20, "enabled": true}, {"id": "bath", "icon": "🛁", "label": "Bath and get dressed", "time": "08:00", "minutes": 30, "enabled": true}, {"id": "homework", "icon": "📚", "label": "Do homework", "time": "15:30", "minutes": 30, "enabled": true}, {"id": "play", "icon": "⚽", "label": "Go and play", "time": "16:15", "minutes": 45, "enabled": true}];
const names=['Puppy','Dragon','Robot','Unicorn','Capybara','Dino','Axolotl','Panda','Cow','Kitten','Astro','Lion'];const emojis=['🐶','🐉','🤖','🦄','🦫','🦕','🦎','🐼','🐮','🐱','🧑‍🚀','🦁'];const $=s=>document.querySelector(s);const app=$('#app');const defaults={name:'',age:7,language:'en-GB',avatar:'Puppy',premium:false,pin:'',wake:'07:00',reminders:true,voice:true,chat:[],stickers:[],stickerPage:[],drawing:null,colouring:null,routines:routineDefaults};let state={...defaults,...JSON.parse(localStorage.getItem('zfKidsV1')||'{}')},view='home';state.routines=routineDefaults.map(t=>({...t,...(Array.isArray(state.routines)?state.routines.find(x=>x.id===t.id):null)}));const save=()=>localStorage.setItem('zfKidsV1',JSON.stringify(state));const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));function toast(s){$('#toast').textContent=s;$('#toast').style.display='block';setTimeout(()=>$('#toast').style.display='none',2800)}function navigate(v){if(v==='parent'&&state.pin&&view!=='parent'){let p=prompt('Enter parent PIN');if(p!==state.pin)return toast('Incorrect PIN')}view=v;render();window.scrollTo(0,0)}document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>navigate(b.dataset.view));function hero(t,sub){return `<div class="center"><h1>${t}</h1><p class="sub">${sub}</p></div>`}function friendCard(n,i){return `<div class="friend ${state.avatar===n?'selected':''}" data-friend="${n}" tabindex="0" role="button" aria-label="Select ${n}"><img src="/assets/${n.toLowerCase()}.png" alt="${n}"><span class="tag ${i<2?'free':''}">${i<2?'FREE':'🔒 PREMIUM'}</span><strong>${n}</strong></div>`}function render(){if(view==='home'){app.innerHTML=hero('Meet Your New Best Friend! 🌈','Talk, learn, play, draw and grow with your favourite cartoon buddy.')+`<div class="panel center"><img class="avatar" src="/assets/${state.avatar.toLowerCase()}.png" alt="${state.avatar}"><h2>Hello${state.name?', '+esc(state.name):''}! 👋</h2><p>Your friend is <b>${state.avatar}</b></p><div class="actions"><button id="start">💬 Talk to ${state.avatar}</button><button id="choose" class="secondary">🐾 Choose Friend</button><button id="setup" class="secondary">⚙️ Parent Setup</button></div><p class="notice">This is a children's learning companion, not a real person. Parents should supervise use. Demo conversations work without an API key.</p></div>`;$('#start').onclick=()=>navigate('chat');$('#choose').onclick=()=>navigate('friends');$('#setup').onclick=()=>navigate('parent')}
if(view==='parent'){app.innerHTML=hero('Parent Setup 🔐','Set up your child’s experience before they begin.')+`<form id="parentForm" class="panel form"><label class="field">Child’s first name or nickname<input name="name" maxlength="30" value="${esc(state.name)}" required></label><label class="field">Child’s age (1–15)<select name="age">${Array.from({length:15},(_,i)=>`<option value="${i+1}" ${state.age===i+1?'selected':''}>${i+1} years</option>`).join('')}</select></label><label class="field">Voice language<select name="language"><option value="en-GB" ${state.language==='en-GB'?'selected':''}>English</option><option value="af-ZA" ${state.language==='af-ZA'?'selected':''}>Afrikaans (if device supports it)</option></select></label><label class="field">Wake-up reminder time<input type="time" name="wake" value="${state.wake}"></label><label class="field">Parent PIN (4–8 digits)<input name="pin" type="password" pattern="[0-9]{4,8}" maxlength="8" placeholder="Optional; protect settings" value="${esc(state.pin)}"></label><label class="field">Premium access (developer test only)<select name="premium"><option value="false">Free</option><option value="true" ${state.premium?'selected':''}>Preview premium features</option></select></label><label class="field"><span><input type="checkbox" name="reminders" ${state.reminders?'checked':''}> Enable wake-up reminder while app is open</span></label><label class="field"><span><input type="checkbox" name="voice" ${state.voice?'checked':''}> Read replies aloud</span></label><div class="wide routine-setup"><h2>⏰ Daily Routine & Chores</h2><p>Set a start time and how many minutes your child has for each activity.</p><div class="routine-fields">${state.routines.map((task,i)=>`<div class="routine-item"><label><input type="checkbox" name="routine_on_${task.id}" ${task.enabled?'checked':''}> ${task.icon} ${task.label}</label><label>Start time<input type="time" name="routine_time_${task.id}" value="${esc(task.time)}"></label><label>Minutes<input type="number" min="1" max="240" step="1" name="routine_minutes_${task.id}" value="${task.minutes}"></label></div>`).join('')}</div></div><p class="wide notice">PIN and settings are stored on this device, not securely authenticated. Premium preview is for testing, not a payment system. Wake reminders only run while this app is open; they cannot replace your phone alarm.</p><div class="actions wide"><button type="submit">Save & Choose Avatar →</button></div></form>`;$('#parentForm').onsubmit=e=>{e.preventDefault();let f=e.target.elements;state.name=f.namedItem('name').value.trim();state.age=Number(f.namedItem('age').value);state.language=f.namedItem('language').value;state.wake=f.namedItem('wake').value;state.pin=f.namedItem('pin').value;state.premium=f.namedItem('premium').value==='true';state.reminders=f.namedItem('reminders').checked;state.voice=f.namedItem('voice').checked;state.routines=state.routines.map(task=>({...task,enabled:f.namedItem('routine_on_'+task.id).checked,time:f.namedItem('routine_time_'+task.id).value,minutes:Math.min(240,Math.max(1,Number(f.namedItem('routine_minutes_'+task.id).value)||task.minutes))}));save();navigate('friends')}}
if(view==='friends'){app.innerHTML=hero('Choose Your AI Friend ✨','Our 12 original ZF Kids AI characters')+`<div class="grid">${names.map(friendCard).join('')}</div><div class="actions"><button id="gochat">Continue with ${state.avatar} →</button></div>`;document.querySelectorAll('[data-friend]').forEach(el=>{const fn=()=>{let n=el.dataset.friend;document.querySelectorAll('.friend').forEach(card=>card.classList.remove('friend-dancing'));el.classList.add('friend-dancing');sayWithCharacter('Hello! I am '+n+'! Let us dance!',n);if(names.indexOf(n)>1&&!state.premium){toast('Premium character: ask a parent to unlock.');setTimeout(()=>el.classList.remove('friend-dancing'),2600);return;}state.avatar=n;save();setTimeout(()=>{if(view==='friends')render()},2600)};el.onclick=fn;el.onkeydown=e=>{if(e.key==='Enter')fn()}});$('#gochat').onclick=()=>navigate('chat')}
if(view==='chat'){app.innerHTML=hero(`Talk with ${state.avatar} 💬`,'Type or use your microphone to ask questions and play.')+`<div class="panel chat-panel"><div class="avatar-top"><div class="friend-stage" data-mood="idle"><span class="friend-sparkle" aria-hidden="true">✨</span><img class="avatar animated-friend" src="/assets/${state.avatar.toLowerCase()}.png" alt="${state.avatar}"><span class="friend-status">😊 Ready to chat</span></div></div><div class="avatar-dock"><div class="center"><div class="friend-stage" id="friendStage" data-mood="idle"><span class="friend-sparkle" aria-hidden="true">✨</span><img class="avatar animated-friend" src="/assets/${state.avatar.toLowerCase()}.png" alt="${state.avatar}"><span class="friend-status" id="friendStatus" aria-live="polite">😊 Ready to chat</span></div><div class="friend-controls"><button type="button" id="waveFriend" class="secondary">👋 Wave</button><button type="button" id="danceFriend" class="secondary">🎉 Dance</button><button type="button" id="helloFriend" class="secondary">🔊 Say hello</button><button type="button" id="testVoice" class="secondary">🔈 Test voice</button></div></div></div><div class="chat-workspace"><div id="chatlog" class="chatlog" aria-live="polite">${state.chat.map(m=>`<div class="bubble ${m.who==='me'?'me':''}"><b>${m.who==='me'?'You':state.avatar}:</b> ${esc(m.text)}</div>`).join('')||`<div class="bubble">Hi! I'm ${state.avatar}. Want to learn or play?</div>`}</div><div class="chat-clear-row"><button type="button" id="clearChats" class="clear-chat-button" aria-label="Clear chat history">🗑️ Clear chats</button></div><form id="chatForm" class="chatinput"><input id="message" maxlength="600" autocomplete="off" placeholder="Ask your friend something..." required><button type="submit">Send ➤</button><button type="button" id="mic">🎤 Speak</button><button type="button" id="stop">🔇 Stop</button></form><p class="notice" id="mode">Checking AI connection…</p><div class="actions"><button id="story" class="secondary">📖 Tell me a story</button><button id="question" class="secondary">🧠 Let's do maths</button></div></div></div>`;document.querySelector('.chat-workspace').appendChild(document.querySelector('.avatar-dock'));$('#waveFriend').onclick=()=>friendMood('wave',1800);$('#danceFriend').onclick=()=>friendMood('dance',3000);$('#helloFriend').onclick=()=>speak('Hello! I am '+state.avatar+'. I am happy to be your friend!');$('#testVoice').onclick=()=>speak('Hello! I am '+state.avatar+'. My voice is working!');const send=async msg=>{friendMood('thinking',12000);state.chat.push({who:'me',text:msg});save();renderChat();$('#message').value='';try{let r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg,age:state.age,avatar:state.avatar})});let d=await r.json();state.chat.push({who:'bot',text:d.reply||'Try again soon.'});save();renderChat();$('#mode').textContent=d.mode==='live'?'🟢 Gemini AI answered successfully':d.mode==='error'?'🔴 '+(d.notice||'Gemini failed'):d.mode==='safety'?'🟡 Safety response':'🟡 Demo response — check Gemini key and deployment';if(state.voice!==false)speak(d.reply);else{friendMood('happy',1600);toast('Automatic voice is off in Parent Setup. Use Test voice to hear me.')}}catch{friendMood('idle');toast('Could not connect. Please try again.')}};function renderChat(){$('#chatlog').innerHTML=state.chat.map(m=>`<div class="bubble ${m.who==='me'?'me':''}"><b>${m.who==='me'?'You':state.avatar}:</b> ${esc(m.text)}</div>`).join('');$('#chatlog').scrollTop=$('#chatlog').scrollHeight}$('#clearChats').onclick=()=>{if(!state.chat.length)return toast('Chat is already empty');if(!window.confirm('Clear all chat messages on this device? This cannot be undone.'))return;if('speechSynthesis'in window)speechSynthesis.cancel();activeSpeech=null;state.chat=[];save();renderChat();friendMood('idle');toast('Chats cleared')};$('#chatForm').onsubmit=e=>{e.preventDefault();send($('#message').value.trim())};$('#story').onclick=()=>send('Tell me a story');$('#question').onclick=()=>send('Can we do some math?');$('#stop').onclick=()=>{if('speechSynthesis'in window)speechSynthesis.cancel();activeSpeech=null;friendMood('idle')};$('#mic').onclick=()=>{let SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return toast('Speech recognition not available in this browser. Try Chrome.');let rec=new SR();rec.lang=state.language;rec.onresult=e=>{$('#message').value=e.results[0][0].transcript;friendMood('happy',1200)};rec.onerror=()=>{friendMood('idle');toast('Microphone unavailable or permission denied')};rec.onend=()=>{if($('#friendStage')?.dataset.mood==='listening')friendMood('idle')};friendMood('listening');rec.start()};fetch('/api/health').then(r=>r.json()).then(d=>{$('#mode').textContent=d.ai?'🟠 Gemini key detected — send a message to test':'🔴 No Gemini key detected by server'}).catch(()=>{})}
if(view==='games')gamesView();
if(view==='colour'||view==='draw')drawView(view==='colour');if(view==='stickers')stickersView()}
let friendTimer;function friendMood(mood,duration=0){const stages=document.querySelectorAll('.chat-panel .friend-stage');if(!stages.length)return;clearTimeout(friendTimer);stages.forEach(stage=>{stage.dataset.mood=mood;if(mood!=='speaking')stage.classList.remove('mouth-beat');if(!stage.querySelector('.talk-mouth')){const mouth=document.createElement('span');mouth.className='talk-mouth';mouth.setAttribute('aria-hidden','true');stage.appendChild(mouth)}});const statuses=document.querySelectorAll('.chat-panel .friend-status');const statusText=({idle:'😊 Ready to chat',speaking:'🗣️ Talking...',listening:'🎤 Listening...',thinking:'🤔 Thinking...',happy:'🌟 Happy!',wave:'👋 Hello!',dance:'🎉 Dancing!'})[mood]||'';statuses.forEach(status=>status.textContent=statusText);if(duration)friendTimer=setTimeout(()=>friendMood('idle'),duration)}const characterVoiceSettings={Puppy:{rate:1.14,pitch:1.35,voice:0},Dragon:{rate:.85,pitch:.65,voice:1},Robot:{rate:.96,pitch:.78,voice:2},Unicorn:{rate:1.06,pitch:1.55,voice:3},Capybara:{rate:.9,pitch:.92,voice:4},Dino:{rate:.91,pitch:.72,voice:5},Axolotl:{rate:1.15,pitch:1.48,voice:6},Panda:{rate:.91,pitch:1.06,voice:7},Cow:{rate:.88,pitch:.85,voice:8},Kitten:{rate:1.17,pitch:1.62,voice:9},Astro:{rate:1.03,pitch:1.12,voice:10},Lion:{rate:.85,pitch:.7,voice:11}};
let activeSpeech=null,voiceTimer=null;
function sayWithCharacter(text,character=state.avatar){
 if(!('speechSynthesis' in window)||!window.SpeechSynthesisUtterance){toast('Speech is unavailable in this browser. Try Chrome or Edge.');return;}
 const synth=window.speechSynthesis;
 if(voiceTimer){clearTimeout(voiceTimer);voiceTimer=null;}
 synth.cancel();
 const cfg=characterVoiceSettings[character]||characterVoiceSettings.Puppy;
 const message=String(text||'').trim().slice(0,1200);
 if(!message)return;
 let utterance=new SpeechSynthesisUtterance(message);
 activeSpeech=utterance;
 utterance.lang=state.language||'en-GB';utterance.rate=Math.max(.65,Math.min(1.4,cfg.rate*(state.age<6?.92:1)));utterance.pitch=cfg.pitch;utterance.volume=1;
 const chooseVoice=()=>{
  const all=synth.getVoices();
  const lang=(state.language||'en-GB').split('-')[0].toLowerCase();
  const matching=all.filter(v=>v.lang.toLowerCase().split('-')[0]===lang);
  const usable=matching.length?matching:all;
  if(usable.length)utterance.voice=usable[cfg.voice%usable.length];
 };
 chooseVoice();
 utterance.onstart=()=>{if(view==='chat')friendMood('speaking')};
 utterance.onboundary=()=>{if(view==='chat')document.querySelectorAll('.chat-panel .friend-stage').forEach(stage=>{stage.classList.remove('mouth-beat');void stage.offsetWidth;stage.classList.add('mouth-beat')})};
 utterance.onend=()=>{if(activeSpeech===utterance)activeSpeech=null;if(view==='chat')friendMood('happy',1200)};
 utterance.onerror=e=>{if(activeSpeech===utterance)activeSpeech=null;if(e.error!=='canceled'&&e.error!=='interrupted')toast('Voice failed: '+e.error+'. Try Chrome/Edge and check device sound.');if(view==='chat')friendMood('idle')};
 // Speech engines sometimes need a short delay after cancel or a fresh voice list.
 voiceTimer=setTimeout(()=>{voiceTimer=null;try{chooseVoice();synth.resume();synth.speak(utterance)}catch(e){toast('Unable to start voice: '+e.message)}},120);
}
function speak(text){sayWithCharacter(text,state.avatar)}
const colouringPictures=[{"name": "Puppy", "src": "/assets/colouring/01-puppy.png"}, {"name": "Kitten", "src": "/assets/colouring/02-kitten.png"}, {"name": "Lion", "src": "/assets/colouring/03-lion.png"}, {"name": "Elephant", "src": "/assets/colouring/04-elephant.png"}, {"name": "Unicorn", "src": "/assets/colouring/05-unicorn.png"}, {"name": "Dinosaur", "src": "/assets/colouring/06-dinosaur.png"}, {"name": "Rocket", "src": "/assets/colouring/07-rocket.png"}, {"name": "Astronaut", "src": "/assets/colouring/08-astronaut.png"}, {"name": "Train", "src": "/assets/colouring/09-train.png"}, {"name": "Racing Car", "src": "/assets/colouring/10-racing-car.png"}, {"name": "Fairy", "src": "/assets/colouring/11-fairy.png"}, {"name": "Princess", "src": "/assets/colouring/12-princess.png"}, {"name": "Pirate", "src": "/assets/colouring/13-pirate.png"}, {"name": "Shark", "src": "/assets/colouring/14-shark.png"}, {"name": "Turtle", "src": "/assets/colouring/15-turtle.png"}, {"name": "Cupcake", "src": "/assets/colouring/16-cupcake.png"}, {"name": "Butterfly", "src": "/assets/colouring/17-butterfly.png"}, {"name": "Sunflower", "src": "/assets/colouring/18-sunflower.png"}, {"name": "Beach", "src": "/assets/colouring/19-beach.png"}];

let chosenColouringPicture=null;
function colouringGallery(){
app.innerHTML=hero('Choose a Picture 🎨','Pick one of 19 pictures to colour!')+`<div class="colour-gallery">${colouringPictures.map((p,i)=>`<button class="colour-choice" data-picture="${i}"><img src="${p.src}" alt="${p.name} colouring picture" loading="lazy"><strong>${i+1}. ${p.name}</strong><small>🎨 Colour me</small></button>`).join('')}</div>`;
document.querySelectorAll('[data-picture]').forEach(b=>b.onclick=()=>{chosenColouringPicture=+b.dataset.picture;state.colouring=null;drawView(true)});
}

function drawView(colour){
if(colour&&chosenColouringPicture===null){colouringGallery();return}

app.innerHTML=hero(colour?'Colouring Book 🎨':'Drawing Studio ✏️',colour?'Choose a colour, then tap inside the picture to fill it.':'Create your own artwork!')+`<div class="panel center">${colour?'<button id="chooseAnother">🖼 Choose another picture</button>':''}<div class="palette" id="palette"></div><p id="artHint">${colour?'🪣 Fill mode: tap inside a shape. Small gaps are repaired automatically.':'✏️ Draw with your finger or mouse.'}</p><div class="canvaswrap"><canvas id="canvas" width="800" height="500" style="touch-action:none"></canvas></div><div class="actions">${colour?'<button id="artMode">✏️ Switch to Brush</button>':''}<button id="clear">🧽 Start Over</button><button id="download">⬇ Save Picture</button>${colour?'<button id="template">🌼 Change Picture</button>':''}</div></div>`;
let canvas=$('#canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true}),color='#fa327a',down=false,template=0,mode=colour?'fill':'brush',start=null,moved=false;
const colors=['#fa327a','#ff3c31','#ffa621','#f5d92c','#32ba62','#30b4fa','#6048df','#000000','#ffffff','#8b4e28'];
$('#palette').innerHTML=colors.map((c,i)=>`<button class="swatch" style="background:${c}" data-color="${c}" aria-label="Colour ${c}" title="Colour ${i+1}"></button>`).join('');
function selectColour(c){color=c;document.querySelectorAll('[data-color]').forEach(el=>{el.style.outline=el.dataset.color===c?'4px solid #ffda64':'';el.style.outlineOffset='2px'});}
document.querySelectorAll('[data-color]').forEach(el=>el.onclick=()=>selectColour(el.dataset.color));selectColour(color);
function persist(){if(colour)state.colouring=canvas.toDataURL();else state.drawing=canvas.toDataURL();save()}
function blank(){ctx.fillStyle='#ffffff';ctx.fillRect(0,0,800,500);if(colour&&chosenColouringPicture!==null){let im=new Image();im.onload=()=>{ctx.drawImage(im,0,0,800,500)};im.src=colouringPictures[chosenColouringPicture].src;return}if(colour){ctx.strokeStyle='#333333';ctx.lineWidth=6;ctx.lineJoin='round';if(template%2===0){ctx.beginPath();ctx.arc(400,250,65,0,Math.PI*2);ctx.stroke();for(let i=0;i<8;i++){let angle=i*Math.PI/4;ctx.beginPath();ctx.ellipse(400+120*Math.cos(angle),250+120*Math.sin(angle),62,37,angle,0,Math.PI*2);ctx.stroke()}ctx.beginPath();ctx.moveTo(400,320);ctx.lineTo(400,490);ctx.stroke()}else{ctx.beginPath();ctx.arc(400,250,135,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(345,220,15,0,Math.PI*2);ctx.arc(455,220,15,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(400,280,65,0,Math.PI);ctx.stroke()}}}
let old=colour?state.colouring:state.drawing;
if(old){let im=new Image();im.onload=()=>ctx.drawImage(im,0,0);im.onerror=blank;im.src=old}else blank();
const pos=e=>{let r=canvas.getBoundingClientRect();return {x:Math.max(0,Math.min(799,Math.floor((e.clientX-r.left)*800/r.width))),y:Math.max(0,Math.min(499,Math.floor((e.clientY-r.top)*500/r.height)))}}; 
function fillAt(x,y){
const w=canvas.width,h=canvas.height,img=ctx.getImageData(0,0,w,h),d=img.data,at=(y*w+x)*4,src=[d[at],d[at+1],d[at+2]],hex=color.slice(1),target=[parseInt(hex.slice(0,2),16),parseInt(hex.slice(2,4),16),parseInt(hex.slice(4,6),16)];
if(src.every((v,i)=>Math.abs(v-target[i])<8))return;
const isOutline=i=>d[i]<100&&d[i+1]<100&&d[i+2]<100;
if(isOutline(at)){toast('Tap inside a closed shape, not the black outline');return}
const matches=i=>Math.abs(d[i]-src[0])<=28&&Math.abs(d[i+1]-src[1])<=28&&Math.abs(d[i+2]-src[2])<=28&&!isOutline(i);
// Smart fill: bridge small gaps in outlines, but never flood the outside page.
const originalInk=new Uint8Array(w*h);
for(let n=0;n<w*h;n++){let i=n*4;originalInk[n]=(d[i]<135&&d[i+1]<135&&d[i+2]<135)?1:0}
function findRegion(barrier){
 let seen=new Uint8Array(w*h),stack=[y*w+x],region=[],edge=false;
 while(stack.length){
  let n=stack.pop();if(n<0||n>=w*h||seen[n]||barrier[n])continue;
  seen[n]=1;let i=n*4;
  if(!matches(i))continue;
  region.push(n);
  let px=n%w,py=(n/w)|0;
  if(px===0||px===w-1||py===0||py===h-1){edge=true;break}
  if(px>0)stack.push(n-1);
  if(px<w-1)stack.push(n+1);
  if(py>0)stack.push(n-w);
  if(py<h-1)stack.push(n+w);
 }
 return {region,edge};
}
let result=findRegion(originalInk);
// Close narrow horizontal/vertical breaks in the artwork without modifying the drawing.
if(result.edge){
 for(const gap of [5,10,18]){
  const barrier=originalInk.slice();
  for(let py=1;py<h-1;py++)for(let px=1;px<w-1;px++){
   const n=py*w+px;if(!originalInk[n])continue;
   for(let k=2;k<=gap;k++){
    if(px+k<w-1&&originalInk[n+k]){for(let t=1;t<k;t++)barrier[n+t]=1;break}
   }
   for(let k=2;k<=gap;k++){
    if(py+k<h-1&&originalInk[n+k*w]){for(let t=1;t<k;t++)barrier[n+t*w]=1;break}
   }
  }
  result=findRegion(barrier);
  if(!result.edge&&result.region.length>12)break;
 }
}
if(result.edge){
 toast('This outline is open. Try Brush mode to colour this area.');
 return;
}
if(result.region.length){
 for(const n of result.region){let i=n*4;d[i]=target[0];d[i+1]=target[1];d[i+2]=target[2];d[i+3]=255}
 ctx.putImageData(img,0,0);persist();
}
}
canvas.onpointerdown=e=>{if(e.button!==undefined&&e.button!==0)return;down=true;moved=false;start=pos(e);canvas.setPointerCapture(e.pointerId);if(mode==='brush'){ctx.beginPath();ctx.moveTo(start.x,start.y)}};
canvas.onpointermove=e=>{if(!down||mode!=='brush')return;let p=pos(e);moved=true;ctx.lineTo(p.x,p.y);ctx.strokeStyle=color;ctx.lineWidth=12;ctx.lineCap='round';ctx.stroke()};
canvas.onpointerup=e=>{if(!down)return;down=false;if(mode==='fill'){let p=pos(e);fillAt(p.x,p.y)}else{if(!moved&&start){ctx.beginPath();ctx.arc(start.x,start.y,6,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()}persist()}};
canvas.onpointercancel=()=>{down=false};
if(colour)$('#artMode').onclick=()=>{mode=mode==='fill'?'brush':'fill';$('#artMode').textContent=mode==='fill'?'✏️ Switch to Brush':'🪣 Switch to Fill';$('#artHint').textContent=mode==='fill'?'🪣 Tap inside a shape to fill it.':'✏️ Drag to draw with your selected colour.'};
$('#clear').onclick=()=>{blank();if(colour)state.colouring=null;else state.drawing=null;save()};
$('#download').onclick=()=>{let a=document.createElement('a');a.download='zf-kids-art.png';a.href=canvas.toDataURL();a.click()};
if(colour){$('#template').textContent='🖼 Choose Picture';$('#template').onclick=()=>{chosenColouringPicture=null;state.colouring=null;colouringGallery()};$('#chooseAnother').onclick=()=>{chosenColouringPicture=null;state.colouring=null;colouringGallery()}};
}

const dressStickers=[
['🧢','Blue cap',19],['🎩','Top hat',22],['👑','Crown',24],['👒','Sun hat',25],['🕶️','Sunglasses',19],
['👓','Glasses',18],['🥽','Goggles',19],['🎀','Pink bow',16],['🎧','Headphones',23],['🧣','Scarf',19],
['👔','Tie',16],['🦋','Butterfly',17],['⭐','Star',13],['❤️','Heart',13],['🌸','Flower',14]
];
let stickerSelected=0,stickerAvatar=null,stickerActive=null;
function stickersView(){
const locked=!state.premium;
if(!stickerAvatar)stickerAvatar=state.avatar||'Puppy';
if(!state.stickerPages||typeof state.stickerPages!=='object')state.stickerPages={};
const page=state.stickerPages[stickerAvatar]||[];
app.innerHTML=hero('My Sticker Book 📒','Choose an avatar, select a sticker, then tap where it belongs!')+
`<div class="panel center sticker-editor">
${locked?'<p class="notice">🔒 Premium sticker book. Ask a parent to unlock it in Parent Setup. This is a developer preview, not a payment system.</p>':''}
<h2>1. Choose an avatar</h2>
<div class="sticker-avatars">${names.map(n=>`<button class="sticker-avatar-choice ${stickerAvatar===n?'selected':''}" data-dress-avatar="${n}" ${locked?'disabled':''}><img src="/assets/${n.toLowerCase()}.png" alt=""><span>${n}</span></button>`).join('')}</div>
<h2>2. Choose one of 15 stickers</h2>
<div class="dress-palette">${dressStickers.map(([icon,label],i)=>`<button class="dress-sticker ${stickerSelected===i?'selected':''}" data-dress-sticker="${i}" title="${label}" ${locked?'disabled':''}><span>${icon}</span><small>${label}</small></button>`).join('')}</div>
<p id="dressHint">3. Tap on the avatar to place your selected sticker. Drag stickers to move them.</p>
<div class="dress-stage-wrap"><div class="dress-stage" id="dressStage" role="group" aria-label="Decorate ${stickerAvatar}">
<img class="dress-avatar-img" src="/assets/${stickerAvatar.toLowerCase()}.png" alt="${stickerAvatar}">
${page.map((item,i)=>`<span class="placed-sticker ${stickerActive===i?'active':''}" data-placed="${i}" style="left:${item.x}%;top:${item.y}%;font-size:${item.size||dressStickers[item.type][2]}px;transform:translate(-50%,-50%) rotate(${item.rotation||0}deg) scale(${item.flipX||1},${item.flipY||1})" role="button" tabindex="0" aria-label="Move ${dressStickers[item.type][1]}">${dressStickers[item.type][0]}</span>`).join('')}
</div></div>
<div class="dress-tools"><button id="stickerRotateLeft" ${locked?'disabled':''}>↶ Rotate 1° left</button><button id="stickerRotateRight" ${locked?'disabled':''}>↷ Rotate 1° right</button><button id="stickerFlipH" ${locked?'disabled':''}>↔ Mirror</button><button id="stickerFlipV" ${locked?'disabled':''}>↕ Mirror</button><button id="stickerNudgeLeft" ${locked?'disabled':''}>← Left</button><button id="stickerNudgeRight" ${locked?'disabled':''}>Right →</button><button id="stickerNudgeUp" ${locked?'disabled':''}>↑ Up</button><button id="stickerNudgeDown" ${locked?'disabled':''}>↓ Down</button><button id="stickerSmaller" ${locked?'disabled':''}>➖ Smaller</button><button id="stickerBigger" ${locked?'disabled':''}>➕ Bigger</button><button id="stickerRemove" ${locked?'disabled':''}>🗑 Remove selected</button><button id="stickerClear" ${locked?'disabled':''}>Clear avatar</button><button id="stickerSave" ${locked?'disabled':''}>⬇ Save picture</button></div>
<div class="sticker-adjust"><label>Sticker size <input id="stickerSizeSlider" type="range" min="9" max="220" value="${page[stickerActive]?.size||35}" ${locked?'disabled':''}></label><label>Rotation <input id="stickerRotationSlider" type="range" min="-180" max="180" value="${page[stickerActive]?.rotation||0}" ${locked?'disabled':''}></label></div><p class="sticker-help">Sticker positions and sizes are saved for each avatar on this device. Tap an existing sticker to select it, then resize or remove it.</p></div>`;
if(locked)return;
document.querySelectorAll('[data-dress-avatar]').forEach(b=>b.onclick=()=>{stickerAvatar=b.dataset.dressAvatar;stickerActive=null;stickersView()});
document.querySelectorAll('[data-dress-sticker]').forEach(b=>b.onclick=()=>{stickerSelected=+b.dataset.dressSticker;document.querySelectorAll('[data-dress-sticker]').forEach(x=>x.classList.toggle('selected',x===b));$('#dressHint').textContent='Tap on '+stickerAvatar+' to place '+dressStickers[stickerSelected][1]});
const stage=$('#dressStage');
let drag=null;
function coords(e){const r=stage.getBoundingClientRect();return {x:Math.max(2,Math.min(98,(e.clientX-r.left)*100/r.width)),y:Math.max(2,Math.min(98,(e.clientY-r.top)*100/r.height))}}
stage.onpointerdown=e=>{
 const target=e.target.closest('[data-placed]');
 if(target){stickerActive=+target.dataset.placed;drag={index:stickerActive,moved:false};target.setPointerCapture(e.pointerId);document.querySelectorAll('[data-placed]').forEach(x=>x.classList.toggle('active',x===target));$('#stickerSizeSlider').value=state.stickerPages[stickerAvatar][stickerActive].size||35;$('#stickerRotationSlider').value=state.stickerPages[stickerAvatar][stickerActive].rotation||0;e.preventDefault();return}
 const pos=coords(e),type=stickerSelected;
 const newSticker={type,x:+pos.x.toFixed(2),y:+pos.y.toFixed(2),size:dressStickers[type][2],rotation:0,flipX:1,flipY:1};
 (state.stickerPages[stickerAvatar]||=[]).push(newSticker);
 stickerActive=state.stickerPages[stickerAvatar].length-1;save();stickersView();
};
stage.onpointermove=e=>{
 if(!drag)return;
 const pos=coords(e),item=state.stickerPages[stickerAvatar][drag.index];if(!item)return;
 item.x=+pos.x.toFixed(2);item.y=+pos.y.toFixed(2);drag.moved=true;
 const el=stage.querySelector(`[data-placed="${drag.index}"]`);if(el){el.style.left=item.x+'%';el.style.top=item.y+'%'}
};
stage.onpointerup=()=>{if(drag){save();drag=null}};
stage.onpointercancel=()=>{if(drag){save();drag=null}};
function nudgeSticker(axis,delta){
 const item=(state.stickerPages[stickerAvatar]||[])[stickerActive];
 if(!item)return toast('Tap a sticker on the avatar first');
 item[axis]=Math.max(1,Math.min(99,+(item[axis]+delta).toFixed(2)));
 const el=stage.querySelector(`[data-placed="${stickerActive}"]`);
 if(el)el.style[axis==='x'?'left':'top']=item[axis]+'%';
 save();
}
$('#stickerNudgeLeft').onclick=()=>nudgeSticker('x',-0.5);
$('#stickerNudgeRight').onclick=()=>nudgeSticker('x',0.5);
$('#stickerNudgeUp').onclick=()=>nudgeSticker('y',-0.5);
$('#stickerNudgeDown').onclick=()=>nudgeSticker('y',0.5);
$('#stickerBigger').onclick=()=>resizeSticker(2);
$('#stickerRotateLeft').onclick=()=>adjustSticker('rotation',-1);
$('#stickerRotateRight').onclick=()=>adjustSticker('rotation',1);
$('#stickerFlipH').onclick=()=>flipSticker('flipX');
$('#stickerFlipV').onclick=()=>flipSticker('flipY');
$('#stickerSizeSlider').oninput=e=>adjustSticker('size',0,Number(e.target.value));
$('#stickerRotationSlider').oninput=e=>adjustSticker('rotation',0,Number(e.target.value));
function refreshSticker(){
 const item=(state.stickerPages[stickerAvatar]||[])[stickerActive],el=stage.querySelector(`[data-placed="${stickerActive}"]`);
 if(!item||!el)return;
 el.style.fontSize=(item.size||35)+'px';
 el.style.transform=`translate(-50%,-50%) rotate(${item.rotation||0}deg) scale(${item.flipX||1},${item.flipY||1})`;
 $('#stickerSizeSlider').value=item.size||35;$('#stickerRotationSlider').value=item.rotation||0;save();
}
function adjustSticker(prop,delta,value){
 const item=(state.stickerPages[stickerAvatar]||[])[stickerActive];
 if(!item)return toast('Tap a sticker on the avatar first');
 if(prop==='size')item.size=Math.max(9,Math.min(220,value??((item.size||35)+delta)));
 else item.rotation=Math.max(-180,Math.min(180,value??((item.rotation||0)+delta)));
 refreshSticker();
}
function flipSticker(prop){
 const item=(state.stickerPages[stickerAvatar]||[])[stickerActive];
 if(!item)return toast('Tap a sticker on the avatar first');
 item[prop]=-(item[prop]||1);refreshSticker();
}
$('#stickerSmaller').onclick=()=>resizeSticker(-2);
function resizeSticker(delta){const item=(state.stickerPages[stickerAvatar]||[])[stickerActive];if(!item)return toast('Tap a sticker on the avatar first');item.size=Math.min(220,Math.max(9,(item.size||35)+delta));save();stickersView()}
$('#stickerRemove').onclick=()=>{if(stickerActive===null)return toast('Tap a sticker first');state.stickerPages[stickerAvatar].splice(stickerActive,1);stickerActive=null;save();stickersView()};
$('#stickerClear').onclick=()=>{if(!confirm('Remove all stickers from '+stickerAvatar+'?'))return;state.stickerPages[stickerAvatar]=[];stickerActive=null;save();stickersView()};
$('#stickerSave').onclick=()=>{
 const canvas=document.createElement('canvas');canvas.width=700;canvas.height=700;
 const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,700,700);
 const img=new Image();img.onload=()=>{ctx.drawImage(img,0,0,700,700);
 for(const item of state.stickerPages[stickerAvatar]||[]){ctx.font=`${(item.size||20)*2}px "Segoe UI Emoji","Apple Color Emoji",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.save();ctx.translate(item.x*7,item.y*7);ctx.rotate((item.rotation||0)*Math.PI/180);ctx.scale(item.flipX||1,item.flipY||1);ctx.fillText(dressStickers[item.type][0],0,0);ctx.restore()}
 const a=document.createElement('a');a.download='zf-sticker-'+stickerAvatar.toLowerCase()+'.png';a.href=canvas.toDataURL('image/png');a.click()};img.onerror=()=>toast('Avatar image could not be loaded');img.src='/assets/'+stickerAvatar.toLowerCase()+'.png';
};
}


const boardCatalog=[
['🎲','Snakes and Ladders',5],['🦕','Dinosaur Board Game',4],['🛝','Chutes and Ladders',5],['🐍','Multiplayer Snakes and Ladders',5],
['🪿','Goose Game',5],['🎯','Ludo',6],['❌','Tic-Tac-Toe',4],['🔴','Checkers',6],['🟡','Four in a Row',5],
['🃏','Four Colors',6],['🁣','Dominoes',5],['♟️','Chess',7],['✏️','Dots and Boxes',5],['⛳','Mini Golf World',5],
['🫧','Bubble Shooter',5],['🔮','Marble Blast',6],['🐸','Froggy Road',5],['⚫','Nine Men’s Morris',8],
['⚪','Reversi',7],['🎲','Backgammon',8]];

let selectedPlayers=1,playerNames=['Player 1','Player 2','Player 3','Player 4'];
function choosePlayers(kind,index){
 const box=document.getElementById('gamePlay');if(!box)return;
 const game=kind==='board'?boardCatalog[index]:gameCatalog[index];
 box.hidden=false;box.innerHTML=`<div class="game-play-head"><h2>${game[0]} ${game[1]}</h2><button class="secondary" id="cancelPlayers">Back to games</button></div>
 <h3>👫 How many players?</h3><div class="player-count">${[1,2,3,4].map(n=>`<button type="button" data-count="${n}" class="${selectedPlayers===n?'chosen':''}">${n} ${n===1?'Player':'Players'}</button>`).join('')}</div>
 <div id="playerNames">${Array.from({length:selectedPlayers},(_,j)=>`<label>Player ${j+1} <input data-player-name="${j}" maxlength="22" value="${escapeGameText(playerNames[j])}"></label>`).join('')}</div>
 <p class="player-notice">Players share one device. Some games are still practice versions and do not yet support complete multiplayer rules.</p><button id="startChosenGame">▶ Start game</button>`;
 box.scrollIntoView({behavior:'smooth',block:'start'});
 document.getElementById('cancelPlayers').onclick=()=>{box.hidden=true};
 document.querySelectorAll('[data-count]').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('[data-player-name]').forEach(el=>playerNames[+el.dataset.playerName]=el.value);selectedPlayers=+btn.dataset.count;choosePlayers(kind,index)});
 document.getElementById('startChosenGame').onclick=()=>{document.querySelectorAll('[data-player-name]').forEach(el=>playerNames[+el.dataset.playerName]=el.value.trim()||'Player '+(+el.dataset.playerName+1));if(kind==='board')launchBoard(index);else launchGame(index)};
}
function escapeGameText(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}
function boardShell(i){const [emoji,name,age]=boardCatalog[i],box=document.getElementById('gamePlay');box.hidden=false;box.innerHTML=`<div class="game-play-head"><h2>${emoji} ${name}</h2><button class="secondary" id="gameClose">Back to games</button></div><div id="gameInner"></div>`;document.getElementById('gameClose').onclick=()=>{box.hidden=true;box.innerHTML=''};box.scrollIntoView({behavior:'smooth',block:'start'});return document.getElementById('gameInner')}
function launchBoard(i){
if(i===0)return launchGame(0);
if(i===6)return launchGame(1);
const inner=boardShell(i);
if([1,2,3,4,5,19].includes(i)){
const finish=i===5?40:i===19?60:100,players=selectedPlayers;let pos=Array(players).fill(1),turn=0,rolls=0;const snakes={17:7,34:14,49:27,62:39,87:65,98:78},ladders={4:15,9:31,21:42,36:58,51:72,71:91};
function draw(){let winner=pos.findIndex(p=>p>=finish);inner.innerHTML=`<p>${i===19?'Backgammon-inspired dice race':i===5?'Ludo-inspired race':i===1?'Dinosaur race':i===4?'Goose race':'Dice race'} · ${players===2?'Two players take turns':'Reach the finish!'} ${i===2?'Watch out for chutes!':''}</p><div class="snake-board">${Array.from({length:finish},(_,j)=>{let n=finish-j;return `<span class="${pos.includes(n)?'current':''}">${pos[0]===n?'🦕':pos[1]===n?'🐉':pos[2]===n?'🐼':pos[3]===n?'🦄':n}</span>`}).join('')}</div><p>${pos.map((p,j)=>`${escapeGameText(playerNames[j])}: ${p}`).join(' · ')} · ${winner<0?'Turn: '+escapeGameText(playerNames[turn]):'🏆 '+escapeGameText(playerNames[winner])+' wins!'}</p><button id="boardRoll" ${winner>=0?'disabled':''}>🎲 Roll</button><button id="boardReset" class="secondary">Restart</button>`;document.getElementById('boardReset').onclick=()=>{pos=Array(players).fill(1);turn=0;rolls=0;draw()};document.getElementById('boardRoll').onclick=()=>{let die=1+Math.floor(Math.random()*6);pos[turn]=Math.min(finish,pos[turn]+die);if(i===0||i===2||i===3){pos[turn]=ladders[pos[turn]]||snakes[pos[turn]]||pos[turn];pos[turn]=Math.min(finish,pos[turn])}toast('🎲 '+die);turn=(turn+1)%players;draw()}}draw();return}
if(i===8){let b=Array(42).fill(0),turn=1;function check(){for(let r=0;r<6;r++)for(let c=0;c<7;c++){let p=b[r*7+c];if(!p)continue;for(let [dr,dc] of [[0,1],[1,0],[1,1],[1,-1]])if(Array.from({length:4},(_,k)=>[r+dr*k,c+dc*k]).every(([rr,cc])=>rr>=0&&rr<6&&cc>=0&&cc<7&&b[rr*7+cc]===p))return p}return b.every(Boolean)?3:0}function draw(){let w=check();inner.innerHTML=`<p>Drop four discs in a row. Two-player game.</p><div class="connect-board">${b.map((v,j)=>`<button data-drop="${j%7}" ${w?'disabled':''}>${v===1?'🔴':v===2?'🟡':'⚪'}</button>`).join('')}</div><h3>${w?(w===3?'Draw!':'Player '+w+' wins!'):'Player '+turn+' turn'}</h3><button id="resetConnect">Restart</button>`;document.getElementById('resetConnect').onclick=()=>{b=Array(42).fill(0);turn=1;draw()};document.querySelectorAll('[data-drop]').forEach(x=>x.onclick=()=>{let c=+x.dataset.drop;for(let r=5;r>=0;r--)if(!b[r*7+c]){b[r*7+c]=turn;turn=3-turn;draw();return}toast('Column full')})}draw();return}
if(i===12){let cells=Array(16).fill(0),turn=1;function draw(){inner.innerHTML=`<p>Take turns claiming boxes. Most boxes wins! (Simple box-claiming version.)</p><div class="box-grid">${cells.map((v,j)=>`<button data-box="${j}" ${v?'disabled':''}>${v===1?'🟦':v===2?'🟥':'⬜'}</button>`).join('')}</div><p>Blue: ${cells.filter(x=>x===1).length} · Red: ${cells.filter(x=>x===2).length} · Player ${turn} turn</p><button id="resetBoxes">Restart</button>`;document.getElementById('resetBoxes').onclick=()=>{cells=Array(16).fill(0);turn=1;draw()};document.querySelectorAll('[data-box]').forEach(x=>x.onclick=()=>{cells[+x.dataset.box]=turn;turn=3-turn;draw()})}draw();return}
if(i===16){let lane=2,steps=0,obstacle=0;function draw(){inner.innerHTML=`<p>Move the frog left or right to avoid cars. Cross 12 steps!</p><div class="frog-grid">${Array.from({length:5},(_,j)=>`<span>${j===lane?'🐸':j===obstacle?'🚗':'🟩'}</span>`).join('')}</div><p>Progress: ${steps}/12</p><button id="frogLeft">⬅ Left</button><button id="frogForward">⬆ Forward</button><button id="frogRight">Right ➡</button>`;document.getElementById('frogLeft').onclick=()=>{lane=Math.max(0,lane-1);draw()};document.getElementById('frogRight').onclick=()=>{lane=Math.min(4,lane+1);draw()};document.getElementById('frogForward').onclick=()=>{if(lane===obstacle){steps=0;toast('🚗 Oops! Try again')}else{steps++;if(steps===12){toast('🏆 You crossed!');steps=0}}obstacle=Math.floor(Math.random()*5);draw()}}draw();return}
if(i===13){let strokes=0,hole=1;function draw(){inner.innerHTML=`<p>Mini Golf: get the ball into the hole in as few strokes as possible!</p><div class="golf-track">⛳ Hole ${hole}/5 <span style="font-size:45px">🏌️</span></div><p>Strokes: ${strokes}</p><button id="golfHit">🏌️ Swing</button><button id="golfReset">Restart</button>`;document.getElementById('golfHit').onclick=()=>{strokes++;if(Math.random()<.4){hole++;toast('⛳ In the hole!')}if(hole>5){inner.innerHTML=`<h3>🏆 Finished in ${strokes} strokes!</h3><button id="again">Play again</button>`;document.getElementById('again').onclick=()=>{hole=1;strokes=0;draw()}}else draw()};document.getElementById('golfReset').onclick=()=>{strokes=0;hole=1;draw()}}draw();return}
if([14,15].includes(i)){let board=Array.from({length:36},()=>Math.floor(Math.random()*4)),score=0;const balls=['🔴','🟡','🟢','🔵'];function draw(){inner.innerHTML=`<p>${i===14?'Tap groups of matching bubbles!':'Clear matching marbles!'} Match at least 2 neighbouring colours.</p><div class="bubble-board">${board.map((v,j)=>`<button data-bubble="${j}">${v<0?'':balls[v]}</button>`).join('')}</div><p>Score: ${score}</p><button id="resetBubbles">Restart</button>`;document.getElementById('resetBubbles').onclick=()=>{board=Array.from({length:36},()=>Math.floor(Math.random()*4));score=0;draw()};document.querySelectorAll('[data-bubble]').forEach(x=>x.onclick=()=>{let start=+x.dataset.bubble,c=board[start];if(c<0)return;let seen=new Set([start]),q=[start];while(q.length){let j=q.pop(),r=Math.floor(j/6),col=j%6;for(let n of [j-6,j+6,j-1,j+1])if(n>=0&&n<36&&(Math.abs(n-j)===6||Math.floor(n/6)===r)&&board[n]===c&&!seen.has(n)){seen.add(n);q.push(n)}}if(seen.size<2)return toast('Find two touching colours');seen.forEach(j=>board[j]=-1);score+=seen.size;draw()})}draw();return}
if([7,11,17,18].includes(i)){let size=i===11?8:i===18?8:i===7?8:5,board=Array(size*size).fill(''),turn='🔴';if(i===18){let mid=size/2;board[(mid-1)*size+mid-1]='⚪';board[mid*size+mid]='⚪';board[(mid-1)*size+mid]='⚫';board[mid*size+mid-1]='⚫';turn='⚫'}function draw(){inner.innerHTML=`<p>${i===11?'Chess practice board (piece placement; not full chess rules)':i===7?'Checkers practice board':i===17?'Nine Men’s Morris practice board':'Reversi practice board'} · Take turns placing pieces.</p><div class="strategy-board" style="grid-template-columns:repeat(${size},1fr)">${board.map((v,j)=>`<button data-square="${j}" ${v?'disabled':''}>${v||'·'}</button>`).join('')}</div><p>${turn} turn</p><button id="resetStrategy">Restart</button>`;document.getElementById('resetStrategy').onclick=()=>{board=Array(size*size).fill('');turn=i===18?'⚫':'🔴';draw()};document.querySelectorAll('[data-square]').forEach(x=>x.onclick=()=>{board[+x.dataset.square]=turn;turn=turn==='🔴'?'🔵':turn==='🔵'?'🔴':turn==='⚫'?'⚪':'⚫';draw()})}draw();return}
if([9,10].includes(i)){let score=0,round=0;const colors=['🔴','🟡','🟢','🔵'];function draw(){let target=Math.floor(Math.random()*4);inner.innerHTML=`<p>${i===9?'Four Colors: match the colour!':'Dominoes: find the matching number!'}</p><h2>${i===9?colors[target]:'🁣 '+(target+1)}</h2><div class="choices">${Array.from({length:4},(_,j)=>`<button data-pick="${j}">${i===9?colors[j]:j+1}</button>`).join('')}</div><p>Score: ${score} / ${round}</p>`;document.querySelectorAll('[data-pick]').forEach(x=>x.onclick=()=>{round++;if(+x.dataset.pick===target){score++;toast('Correct! 🌟')}else toast('Try again!');draw()})}draw();return}
inner.innerHTML='<p>This game is being prepared.</p>';
}

const gameCatalog=[
['🐍','Snakes & Ladders','board'],['❌','Tic-Tac-Toe','ttt'],['🃏','Memory Match','memory'],
['⭐','Counting Stars','count'],['➕','Addition','add'],['➖','Subtraction','subtract'],['✖️','Multiplication','multiply'],['➗','Division','divide'],
['🔤','Alphabet','alphabet'],['🐾','Animal Quiz','animals'],['🌍','World Facts','world'],['🪐','Space Quiz','space'],
['🎨','Colour Quiz','colors'],['🔷','Shapes','shapes'],['🍎','Healthy Foods','foods'],['🧩','Riddles','riddles'],
['⏰','Time Quiz','time'],['🌦️','Weather Quiz','weather'],['📖','Spelling','spelling'],['🌱','Nature Quiz','nature']
];
const gameBanks={
alphabet:[['Which letter comes after B?','C',['A','C','D','F']],['Which letter starts Apple?','A',['A','E','I','O']],['Which letter comes before M?','L',['K','L','N','P']]],
animals:[['Which animal says meow?','Cat',['Dog','Cat','Cow','Duck']],['Which animal has a trunk?','Elephant',['Lion','Elephant','Zebra','Panda']],['Which animal makes honey?','Bee',['Bee','Dog','Frog','Fish']]],
world:[['Which planet do we live on?','Earth',['Mars','Venus','Earth','Jupiter']],['Which is the biggest ocean?','Pacific',['Indian','Pacific','Arctic','Atlantic']],['What continent is South Africa in?','Africa',['Europe','Africa','Asia','Australia']]],
space:[['Which planet is called the Red Planet?','Mars',['Mars','Earth','Neptune','Venus']],['What shines in the sky by day?','Sun',['Moon','Sun','Mars','Cloud']],['What goes around Earth?','Moon',['Sun','Moon','Jupiter','Saturn']]],
colors:[['What colour is a ripe banana?','Yellow',['Red','Blue','Yellow','Purple']],['What colour is grass?','Green',['Pink','Green','Black','Orange']],['What colour do red and yellow make?','Orange',['Green','Orange','Purple','Blue']]],
shapes:[['Which shape has three sides?','Triangle',['Circle','Square','Triangle','Oval']],['Which shape has no corners?','Circle',['Triangle','Square','Circle','Rectangle']],['How many sides does a square have?','4',['3','4','5','6']]],
foods:[['Which is a fruit?','Apple',['Apple','Bread','Cheese','Rice']],['Which drink is best for staying hydrated?','Water',['Soda','Water','Syrup','Energy drink']],['Which vegetable is orange?','Carrot',['Lettuce','Carrot','Peas','Spinach']]],
riddles:[['What has hands but cannot clap?','Clock',['Clock','Dog','Tree','Shoe']],['What gets wetter as it dries?','Towel',['Towel','Sun','Paper','Stone']],['What has keys but cannot open doors?','Piano',['Piano','Chair','Lamp','Book']]],
time:[['How many minutes in one hour?','60',['30','45','60','90']],['What comes after Tuesday?','Wednesday',['Monday','Wednesday','Friday','Sunday']],['How many days in a week?','7',['5','6','7','8']]],
weather:[['What falls from clouds when it rains?','Water',['Sand','Water','Leaves','Stones']],['What do we see during a storm?','Lightning',['Rainbow','Lightning','Stars','Sunflower']],['What measures temperature?','Thermometer',['Ruler','Thermometer','Clock','Scale']]],
spelling:[['Which spelling is correct?','Elephant',['Elefant','Elephant','Elephent','Eliphant']],['Which spelling is correct?','Friend',['Freind','Frend','Friend','Friand']],['Which spelling is correct?','School',['Skool','School','Scholl','Scool']]],
nature:[['What do plants need to grow?','Sunlight',['Plastic','Sunlight','Metal','Glass']],['What do butterflies start as?','Caterpillars',['Puppies','Caterpillars','Fish','Birds']],['Which part of a tree grows underground?','Roots',['Leaves','Roots','Branches','Fruit']]]
};
function gamesView(){
const root=document.getElementById('app')||document.querySelector('#app');
root.innerHTML=hero('40 Fun Games 🎮','Choose a game, then choose 1–4 players!')+
`<h2>🎲 Board & Arcade Games</h2><div class="game-library">${boardCatalog.map(([emoji,name,age],i)=>`<button class="game-tile" data-board="${i}"><span class="game-emoji">${emoji}</span><strong>${name}</strong><small>Age ${age}+ · Play</small></button>`).join('')}</div><h2>📚 Learning Games</h2><div class="game-library">${gameCatalog.map(([emoji,name],i)=>`<button class="game-tile" data-game="${i}"><span class="game-emoji">${emoji}</span><strong>${name}</strong><small>▶ Play</small></button>`).join('')}</div><section class="panel game-play" id="gamePlay" hidden></section>`;
document.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>choosePlayers('learning',Number(b.dataset.game)));document.querySelectorAll('[data-board]').forEach(b=>b.onclick=()=>choosePlayers('board',Number(b.dataset.board)));
}
function launchGame(idx){
const [emoji,name,type]=gameCatalog[idx],box=document.getElementById('gamePlay');
box.hidden=false;box.innerHTML=`<div class="game-play-head"><h2>${emoji} ${name}</h2><button id="gameClose" class="secondary">Back to games</button></div><div id="gameInner"></div>`;
document.getElementById('gameClose').onclick=()=>{box.hidden=true;box.innerHTML=''};
box.scrollIntoView({behavior:'smooth',block:'start'});
const inner=document.getElementById('gameInner');
if(type==='board'){
 const count=Math.max(1,Math.min(4,selectedPlayers));
 let positions=Array(count).fill(1),turn=0,rolls=0,lastRoll=0;
 const pieces=['🔴','🔵','🟢','🟡'];
 const jumps={3:22,8:26,19:38,28:53,36:57,48:69,58:77,71:91,17:6,34:12,47:25,62:40,79:59,87:66,98:78};
 function show(){
  const winner=positions.findIndex(p=>p===100);
  inner.innerHTML=`<p>🎲 Take turns rolling the dice. Climb ladders 🪜 and avoid snakes 🐍. First to 100 wins!</p>
  <div class="snake-player-strip">${positions.map((pos,j)=>`<div class="snake-player ${winner<0&&turn===j?'active':''}"><span>${pieces[j]} ${escapeGameText(playerNames[j])}</span><strong>Square ${pos}</strong></div>`).join('')}</div>
  <div class="snake-controls"><p>${winner>=0?'🏆 '+escapeGameText(playerNames[winner])+' wins!':'🎯 '+pieces[turn]+' '+escapeGameText(playerNames[turn])+"’s turn"}${rolls?' · Last dice: '+lastRoll:''}</p>
  <button id="roll" ${winner>=0?'disabled':''}>🎲 Roll dice</button> <button id="restartSnakes" class="secondary">Restart</button>
</div>
  <div class="snake-board multiplayer-snake-board">${Array.from({length:100},(_,i)=>{const row=Math.floor(i/10),col=i%10,n=100-row*10-(row%2?9-col:col);const onSquare=positions.map((p,j)=>p===n?`<span class="snake-token" title="${escapeGameText(playerNames[j])}">${pieces[j]}</span>`:'').join('');return `<div class="snake-square ${onSquare?'occupied':''}"><small>${n}</small><span class="snake-mark">${jumps[n]?(jumps[n]>n?'🪜':'🐍'):''}</span><div class="snake-tokens">${onSquare}</div></div>`}).join('')}</div>`;
  document.getElementById('restartSnakes').onclick=()=>{positions=Array(count).fill(1);turn=0;rolls=0;lastRoll=0;show()};
  const roll=document.getElementById('roll');if(roll)roll.onclick=()=>{const die=1+Math.floor(Math.random()*6);lastRoll=die;rolls++;const before=positions[turn];let next=before+die;if(next<=100){next=jumps[next]||next;positions[turn]=next}const message=pieces[turn]+' '+escapeGameText(playerNames[turn])+': '+die+(positions[turn]===before&&before+die>100?' (exact roll needed)':'');if(positions[turn]!==100)turn=(turn+1)%count;show();toast(message)};
 }
 show();return;
}
if(type==='ttt'){let board=Array(9).fill(''),done=false;function winner(){for(let [a,b,c] of [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]])if(board[a]&&board[a]===board[b]&&board[b]===board[c])return board[a];return board.every(Boolean)?'draw':''}function show(){let w=winner();inner.innerHTML=`<p>${selectedPlayers===1?'You are ❌. Play against the computer ⭕.':'This game currently uses the computer opponent; multiplayer rules are coming.'}</p><div class="ttt-board">${board.map((v,i)=>`<button data-cell="${i}" ${v||w?'disabled':''}>${v}</button>`).join('')}</div><h3>${w?(w==='draw'?'It is a draw!':w==='X'?'🎉 You win!':'Computer wins!'):'Your turn!'}</h3><button id="restartTTT">Play again</button>`;document.getElementById('restartTTT').onclick=()=>{board=Array(9).fill('');show()};document.querySelectorAll('[data-cell]').forEach(b=>b.onclick=()=>{board[+b.dataset.cell]='X';if(!winner()){let free=board.map((v,i)=>v?-1:i).filter(i=>i>=0);board[free[Math.floor(Math.random()*free.length)]]='O'}show()})}show();return}
if(type==='memory'){const icons=['🐶','🦁','🐼','🦄','🐸','🐱','🦋','🐙'];let deck=[...icons,...icons].map((x,i)=>({x,id:i})).sort(()=>Math.random()-.5),open=[],matched=new Set(),busy=false;function show(){inner.innerHTML=`<p>Find the 8 matching pairs!</p><div class="memory-board">${deck.map((c,i)=>`<button data-card="${i}" ${matched.has(i)?'disabled':''}>${matched.has(i)||open.includes(i)?c.x:'❓'}</button>`).join('')}</div><p>Pairs: ${matched.size/2} / 8</p>${matched.size===16?'<h3>🎉 Great memory!</h3>':''}`;document.querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>{let i=+b.dataset.card;if(busy||open.includes(i))return;open.push(i);show();if(open.length===2){busy=true;let [a,c]=open;setTimeout(()=>{if(deck[a].x===deck[c].x){matched.add(a);matched.add(c)}open=[];busy=false;if(document.getElementById('gameInner')===inner)show()},700)}})}show();return}
let scores=Array(selectedPlayers).fill(0),round=0,locked=false;
function next(){locked=false;round++;let q,ans,options;
if(['count','add','subtract','multiply','divide'].includes(type)){let a=1+Math.floor(Math.random()*(state.age<7?5:12)),b=1+Math.floor(Math.random()*(state.age<7?5:12));if(type==='count'){ans=a+b;q=`Count: ${'⭐'.repeat(a)} + ${'⭐'.repeat(b)}`}if(type==='add'){ans=a+b;q=`What is ${a} + ${b}?`}if(type==='subtract'){ans=a;q=`What is ${a+b} − ${b}?`}if(type==='multiply'){ans=a*b;q=`What is ${a} × ${b}?`}if(type==='divide'){ans=a;q=`What is ${a*b} ÷ ${b}?`}options=[ans,ans+1,Math.max(0,ans-1),ans+2].map(String)}
else{let bank=gameBanks[type]||gameBanks.animals;let item=bank[Math.floor(Math.random()*bank.length)];[q,ans,options]=item}
options=[...new Set(options)].sort(()=>Math.random()-.5);inner.innerHTML=`<p class="game-question">${q}</p><div class="choices">${options.map((o,i)=>`<button data-choice="${i}">${o}</button>`).join('')}</div><p id="gameScore">${scores.map((n,j)=>`${escapeGameText(playerNames[j])}: ${n}`).join(' · ')} · Turn: ${escapeGameText(playerNames[(round-1)%selectedPlayers])}</p><button id="gameNext">Skip / Next ↻</button>`;
document.getElementById('gameNext').onclick=next;
document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{if(locked)return;locked=true;let ok=options[+b.dataset.choice]===String(ans);if(ok)scores[(round-1)%selectedPlayers]++;document.getElementById('gameScore').textContent=(ok?'🌟 Correct!':'Good try! Answer: '+ans)+` · ${escapeGameText(playerNames[(round-1)%selectedPlayers])} · ${scores.map((n,j)=>escapeGameText(playerNames[j])+': '+n).join(' · ')}`;setTimeout(()=>{if(document.getElementById('gameInner')===inner)next()},1100)})}
next()
}


let routineActive=null;
const routineNotified=new Set();
function routineClock(){
 if(!state.reminders)return;
 const now=new Date(),today=now.toDateString(),hm=now.toTimeString().slice(0,5);
 for(const task of state.routines||[]){
  if(!task.enabled||!task.time)continue;
  const key=today+'-'+task.id;
  if(task.time===hm&&!routineNotified.has(key)){
   routineNotified.add(key);
   const minutes=Math.max(1,Number(task.minutes)||5);
   routineActive={id:task.id,ends:Date.now()+minutes*60000,label:task.label,minutes,icon:task.icon};
   const child=state.name?state.name+', ':'';
   const words=child+"it's time to "+task.label.toLowerCase()+". You have "+minutes+" minutes to finish. You can do it!";
   toast(task.icon+' '+words);
   if(state.voice)speak(words);
   updateRoutineBanner();
  }
 }
 if(routineActive)updateRoutineBanner();
}
function updateRoutineBanner(){
 let el=document.getElementById('routine-banner');
 if(!el){el=document.createElement('section');el.id='routine-banner';el.setAttribute('role','status');el.setAttribute('aria-live','polite');document.body.appendChild(el)}
 if(!routineActive){el.hidden=true;return}
 let left=Math.max(0,Math.ceil((routineActive.ends-Date.now())/1000));
 el.hidden=false;
 const mm=Math.floor(left/60),ss=String(left%60).padStart(2,'0');
 el.innerHTML=`<strong>${routineActive.icon} ${esc(routineActive.label)}</strong><span>Time left: ${mm}:${ss}</span><button id="routineDone">✓ Done</button><button id="routineDismiss" aria-label="Dismiss reminder">✕</button>`;
 document.getElementById('routineDone').onclick=()=>{let name=routineActive.label;routineActive=null;el.hidden=true;toast('🌟 Great job finishing '+name+'!');if(state.voice)speak('Great job! You did it!')};
 document.getElementById('routineDismiss').onclick=()=>{routineActive=null;el.hidden=true};
 if(left===0){const name=routineActive.label;routineActive=null;el.hidden=true;toast('⏰ Time is up for '+name+'. Ask a grown-up if you need more time.');if(state.voice)speak('Time is up for '+name+'. Ask a grown-up if you need more time.')}
}
setInterval(routineClock,1000);
routineClock();

let lastAlarm='';setInterval(()=>{if(!state.reminders||!state.wake)return;let d=new Date(),hm=d.toTimeString().slice(0,5),today=d.toDateString();if(hm===state.wake&&lastAlarm!==today){lastAlarm=today;toast('☀️ Good morning! Time to wake up!');speak('Good morning! Rise and shine!')}} ,15000);render();
