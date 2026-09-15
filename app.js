// ===================== Deer Count app logic =====================

const DEER_SPECIES = [
  { id:'red',    name:'Red Deer',           classes:['Stag','Hind','Calf'] },
  { id:'roe',    name:'Roe Deer',           classes:['Buck','Doe','Kid'] },
  { id:'fallow', name:'Fallow Deer',        classes:['Buck','Doe','Fawn'] },
  { id:'sika',   name:'Sika Deer',          classes:['Stag','Hind','Calf'] },
  { id:'muntjac',name:'Muntjac',            classes:['Buck','Doe','Kid'] },
  { id:'cwd',    name:'Chinese Water Deer', classes:['Buck','Doe','Fawn'] },
];

const SCAN_METHODS = [
  'Drone scan', 'Drone scan (thermal)',
  'Manual / on-foot', 'Manual / on-foot (thermal)',
  'Vehicle / lamping', 'Vehicle / lamping (thermal)',
  'Other'
];

const PARCEL_TYPES = [
  { id:'grass', label:'Grass', color:'#8aa85c' },
  { id:'crop', label:'Crop', color:'#c9a63f' },
  { id:'woodland', label:'Woodland', color:'#3f5c2e' },
  { id:'water', label:'Water/Pond', color:'#4a7ba6' },
  { id:'other', label:'Other', color:'#7c7c7c' },
];

let DC; // firebase handles, set on ready
let currentUser = null;
let currentFarmId = null;
let currentFarmData = null;
let farmsUnsub = null;
let sessionsUnsub = null;
let allFarms = [];
let currentSessions = [];
let activeSession = null; // { id: null|existingId, date, time, method, weather, notes, fields:[{parcelId,parcelName,counts:[]}] }

let map, drawnItemsLayer, drawControl;
let activeParcelId = null;
let pendingDrawLayer = null;

function $(id){ return document.getElementById(id); }
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  $(id).classList.add('active');
}
function showToast(msg, isErr){
  const t = $('toast');
  t.textContent = msg;
  t.className = isErr ? 'show err' : 'show';
  clearTimeout(showToast._tm);
  showToast._tm = setTimeout(()=>{ t.className=''; }, 2600);
}
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s??''; return d.innerHTML; }

// -------------------- Offline indicator --------------------
function updateOnlineStatus(){
  $('offline-pill').classList.toggle('show', !navigator.onLine);
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// -------------------- Boot --------------------
window.addEventListener('firebase-ready', () => {
  DC = window.__DC;
  updateOnlineStatus();
  wireStaticEvents();

  DC.fns.onAuthStateChanged(DC.auth, user => {
    if(user){
      currentUser = user;
      showScreen('screen-farms');
      subscribeFarms();
    } else {
      currentUser = null;
      if(farmsUnsub) farmsUnsub();
      if(sessionsUnsub) sessionsUnsub();
      showScreen('screen-login');
    }
  });
});

// -------------------- Auth --------------------
function wireStaticEvents(){
  $('login-btn').addEventListener('click', doLogin);
  $('login-password').addEventListener('keydown', e=>{ if(e.key==='Enter') doLogin(); });
  $('forgot-link').addEventListener('click', ()=>{ $('forgot-err').textContent=''; showScreen('screen-forgot'); });
  $('back-to-login-btn').addEventListener('click', ()=> showScreen('screen-login'));
  $('send-reset-btn').addEventListener('click', doSendReset);

  $('account-btn').addEventListener('click', ()=>{
    if(confirm('Log out of Deer Count?')){ DC.fns.signOut(DC.auth); }
  });
  $('add-farm-fab').addEventListener('click', createNewFarm);

  $('map-back-btn').addEventListener('click', ()=>{
    if(activeSession && !confirm('Discard this in-progress count before leaving?')) return;
    activeSession = null;
    showScreen('screen-farms');
  });
  $('map-settings-btn').addEventListener('click', ()=> openSettingsScreen());
  $('map-history-btn').addEventListener('click', ()=> openHistorySheet());
  $('settings-back-btn').addEventListener('click', ()=> showScreen('screen-map'));
  $('start-count-btn').addEventListener('click', ()=> openSessionSetupModal());
  $('discard-count-btn').addEventListener('click', ()=>{
    if(!confirm('Discard this count? Anything logged so far will be lost.')) return;
    activeSession = null;
    renderCountBar();
    refreshAllBadges();
  });
  $('save-count-btn').addEventListener('click', saveActiveSession);
  $('export-all-btn') && $('export-all-btn').addEventListener('click', exportAllFarms);

  $('set-farm-name').addEventListener('change', e=> saveFarmField('name', e.target.value));
  $('set-postcode').addEventListener('change', e=> { saveFarmField('postcode', e.target.value); fetchWeather(); });
  $('add-other-species-btn').addEventListener('click', ()=> addChipPrompt('otherSpecies', 'Add species', 'e.g. Grey Squirrel'));
  $('add-livestock-btn').addEventListener('click', ()=> addChipPrompt('livestock', 'Add livestock', 'e.g. Sheep', true));
  $('add-scheme-btn').addEventListener('click', ()=> addChipPrompt('schemes', 'Add scheme', 'e.g. Countryside Stewardship'));
  $('shoot-toggle').addEventListener('click', ()=> toggleFarmBool('hasShoot', 'shoot-toggle'));
  $('deer-detail-toggle').addEventListener('click', async ()=>{
    const newVal = !(currentFarmData.deerDetailBreakdown !== false);
    setToggleState('deer-detail-toggle', newVal);
    await saveFarmField('deerDetailBreakdown', newVal);
  });
  $('dropbox-toggle').addEventListener('click', ()=> toggleFarmBool('dropboxEnabled', 'dropbox-toggle'));
  $('dropbox-token').addEventListener('change', e=>{
    localStorage.setItem('dc_dropbox_token_'+currentFarmId, e.target.value);
    showToast('Dropbox token saved on this device');
  });
  $('export-btn').addEventListener('click', exportExcel);
  $('delete-farm-btn').addEventListener('click', deleteCurrentFarm);
}

function doLogin(){
  const email = $('login-email').value.trim();
  const pw = $('login-password').value;
  $('login-err').textContent = '';
  if(!email || !pw){ $('login-err').textContent = 'Enter email and password.'; return; }
  DC.fns.signInWithEmailAndPassword(DC.auth, email, pw).catch(err=>{
    $('login-err').textContent = friendlyAuthError(err);
  });
}
function doSendReset(){
  const email = $('forgot-email').value.trim();
  $('forgot-err').textContent = '';
  if(!email){ $('forgot-err').textContent = 'Enter your email.'; return; }
  DC.fns.sendPasswordResetEmail(DC.auth, email).then(()=>{
    showToast('Reset link sent — check your email');
    showScreen('screen-login');
  }).catch(err=>{ $('forgot-err').textContent = friendlyAuthError(err); });
}
function friendlyAuthError(err){
  const c = err.code || '';
  if(c.includes('wrong-password') || c.includes('invalid-credential') || c.includes('invalid-login')) return 'Incorrect email or password.';
  if(c.includes('user-not-found')) return 'No account with that email.';
  if(c.includes('too-many-requests')) return 'Too many attempts — try again shortly.';
  if(c.includes('network')) return 'No connection — check you\'re online.';
  return err.message || 'Something went wrong.';
}

// -------------------- Farms list --------------------
function subscribeFarms(){
  const q = DC.fns.query(DC.fns.collection(DC.db, 'farms'), DC.fns.where('ownerId','==', currentUser.uid));
  farmsUnsub = DC.fns.onSnapshot(q, snap=>{
    allFarms = [];
    snap.forEach(d=> allFarms.push({ id:d.id, ...d.data() }));
    allFarms.sort((a,b)=> (a.name||'').localeCompare(b.name||''));
    renderFarmList();
  }, err=>{
    console.error(err);
    showToast('Could not load farms (offline data will still show)', true);
  });
}
function renderFarmList(){
  const list = $('farm-list');
  if(!allFarms.length){
    list.innerHTML = `<div class="empty">No farms yet.<br>Tap + to add your first farm.</div>`;
    return;
  }
  list.innerHTML = allFarms.map(f=>{
    const parcelCount = (f.parcels||[]).length;
    const speciesNames = (f.deerSpecies||[]).map(id => DEER_SPECIES.find(d=>d.id===id)?.name).filter(Boolean);
    const otherNames = (f.otherSpecies||[]).map(s=>s.name);
    const allSpecies = [...speciesNames, ...otherNames].slice(0,3).join(', ') || 'No species set';
    return `<div class="farm-card" data-id="${f.id}">
      <div><div class="fname">${escapeHtml(f.name || 'Unnamed farm')}</div>
      <div class="fmeta">${parcelCount} field${parcelCount!==1?'s':''} · ${escapeHtml(allSpecies)}${f.hasShoot?' · Shoot ✓':''}</div></div>
      <span class="chev">›</span>
    </div>`;
  }).join('');
  list.querySelectorAll('.farm-card').forEach(card=>{
    card.addEventListener('click', ()=> openFarmMap(card.dataset.id));
  });
}
async function createNewFarm(){
  const name = prompt('Name this farm:');
  if(!name || !name.trim()) return;
  try{
    const ref = await DC.fns.addDoc(DC.fns.collection(DC.db,'farms'), {
      name: name.trim(), postcode:'', ownerId: currentUser.uid,
      deerSpecies:[], otherSpecies:[], parcels:[], livestock:[], schemes:[],
      hasShoot:false, dropboxEnabled:false, deerDetailBreakdown:true, createdAt: DC.fns.serverTimestamp()
    });
    showToast('Farm created');
    openFarmMap(ref.id);
  }catch(e){
    console.error(e);
    showToast('Could not create farm — check connection', true);
  }
}

// -------------------- Farm map screen --------------------
function openFarmMap(farmId){
  currentFarmId = farmId;
  currentFarmData = allFarms.find(f=>f.id===farmId) || {};
  $('map-farm-name').textContent = currentFarmData.name || 'Farm';
  activeSession = null;
  showScreen('screen-map');
  fetchWeather();
  subscribeSessions(farmId);
  if(!map){ initMap(); } else { redrawParcels(); }
  renderCountBar();
  setTimeout(()=> map && map.invalidateSize(), 150);
}

function initMap(){
  map = L.map('map', { zoomControl:true, attributionControl:true }).setView([52.0, -0.6], 13);
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri, Maxar, Earthstar Geographics', maxZoom: 20
  }).addTo(map);

  drawnItemsLayer = new L.FeatureGroup();
  map.addLayer(drawnItemsLayer);

  drawControl = new L.Control.Draw({
    position:'bottomleft',
    edit:{ featureGroup: drawnItemsLayer, remove:false },
    draw:{
      polygon:{ shapeOptions:{ color:'#7cb35c', weight:2, fillOpacity:0.25 } },
      rectangle:{ shapeOptions:{ color:'#7cb35c', weight:2, fillOpacity:0.25 } },
      polyline:false, circle:false, circlemarker:false, marker:false
    }
  });
  map.addControl(drawControl);

  map.on(L.Draw.Event.CREATED, e=>{
    pendingDrawLayer = e.layer;
    openNewParcelModal(e.layer);
  });

  redrawParcels();

  navigator.geolocation && navigator.geolocation.getCurrentPosition(pos=>{
    if(!currentFarmData.parcels || !currentFarmData.parcels.length){
      map.setView([pos.coords.latitude, pos.coords.longitude], 16);
    }
  }, ()=>{}, {timeout:4000});
}

function parcelColor(type){
  return (PARCEL_TYPES.find(p=>p.id===type)||{}).color || '#7c7c7c';
}

function redrawParcels(){
  if(!drawnItemsLayer) return;
  drawnItemsLayer.clearLayers();
  const parcels = currentFarmData.parcels || [];
  parcels.forEach(p=>{
    const latlngs = p.latlngs.map(c=> L.latLng(c.lat, c.lng));
    const layer = L.polygon(latlngs, { color: parcelColor(p.type), weight:2, fillOpacity:0.28 });
    layer._parcelId = p.id;
    layer.bindTooltip(p.name, { permanent:true, direction:'center', className:'parcel-label' });
    layer.on('click', ()=> onParcelTapped(p.id));
    drawnItemsLayer.addLayer(layer);
  });
  refreshAllBadges();
  if(parcels.length){
    try{ map.fitBounds(drawnItemsLayer.getBounds(), {maxZoom:17, padding:[30,30]}); }catch(e){}
  }
}

function openNewParcelModal(layer, existingParcel){
  const isEdit = !!existingParcel;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>${isEdit ? 'Edit field' : 'Name this field'}</h3>
      <label style="margin-top:0;">Name</label>
      <input type="text" id="pm-name" value="${isEdit?escapeHtml(existingParcel.name):''}" placeholder="e.g. Long Meadow">
      <label>Type</label>
      <select id="pm-type">
        ${PARCEL_TYPES.map(t=>`<option value="${t.id}" ${isEdit && existingParcel.type===t.id?'selected':''}>${t.label}</option>`).join('')}
      </select>
      <label>Size (acres)</label>
      <input type="number" id="pm-size" min="0" step="0.1" value="${isEdit?(existingParcel.sizeAcres||''):''}" placeholder="e.g. 12.5">
      <div class="actions">
        <button class="btn secondary" id="pm-cancel">Cancel</button>
        <button class="btn" id="pm-save" style="flex:1;">Save</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#pm-name').focus();
  const cleanup = ()=> document.body.removeChild(overlay);

  overlay.querySelector('#pm-cancel').onclick = ()=>{
    if(!isEdit && layer){ drawnItemsLayer.removeLayer(layer); pendingDrawLayer=null; }
    cleanup();
  };
  overlay.querySelector('#pm-save').onclick = async ()=>{
    const name = overlay.querySelector('#pm-name').value.trim() || 'Unnamed field';
    const type = overlay.querySelector('#pm-type').value;
    const sizeAcres = parseFloat(overlay.querySelector('#pm-size').value) || null;
    if(isEdit){
      const parcels = (currentFarmData.parcels||[]).map(p=> p.id===existingParcel.id ? {...p, name, type, sizeAcres} : p);
      await saveFarmField('parcels', parcels);
    } else {
      const latlngs = layer.getLatLngs()[0].map(ll=>({ lat: ll.lat, lng: ll.lng }));
      const parcel = { id: uid(), name, type, sizeAcres, latlngs };
      const parcels = [...(currentFarmData.parcels||[]), parcel];
      await saveFarmField('parcels', parcels);
    }
    cleanup();
    redrawParcels();
    renderParcelSettingsList();
    showToast('Field saved');
  };
}

// -------------------- Weather --------------------
async function fetchWeather(){
  const postcode = (currentFarmData && currentFarmData.postcode || '').trim();
  const pill = $('weather-pill');
  if(!pill) return;
  if(!postcode){ pill.textContent = 'Set postcode for weather'; return; }
  if(!navigator.onLine){ pill.textContent = '📡 Offline'; return; }
  pill.textContent = 'Loading weather…';
  try{
    const geo = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`).then(r=>r.json());
    if(!geo.result) throw new Error('bad postcode');
    const { latitude, longitude } = geo.result;
    const w = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code`).then(r=>r.json());
    const t = Math.round(w.current.temperature_2m);
    const wind = Math.round(w.current.wind_speed_10m);
    pill.textContent = `${t}°C · ${wind}mph wind`;
    pill.dataset.cached = JSON.stringify({temp:t, wind, code:w.current.weather_code, at: new Date().toISOString()});
  }catch(e){
    pill.textContent = 'Weather unavailable';
  }
}

// -------------------- Count sessions (log + history) --------------------
function subscribeSessions(farmId){
  if(sessionsUnsub) sessionsUnsub();
  const q = DC.fns.collection(DC.db, 'farms', farmId, 'sessions');
  sessionsUnsub = DC.fns.onSnapshot(q, snap=>{
    currentSessions = [];
    snap.forEach(d=> currentSessions.push({ id:d.id, ...d.data() }));
    currentSessions.sort((a,b)=> `${b.date} ${b.time||''}`.localeCompare(`${a.date} ${a.time||''}`));
    refreshAllBadges();
    renderFarmList();
  }, err=> console.error(err));
}

function nowTimeStr(){
  const d = new Date();
  return d.toTimeString().slice(0,5);
}

// ---- Count bar (start / save / discard) ----
function renderCountBar(){
  const active = !!activeSession;
  $('start-count-btn').style.display = active ? 'none' : 'block';
  $('active-session-bar').style.display = active ? 'flex' : 'none';
  if(active){
    $('active-session-info').innerHTML =
      `<b>${activeSession.date}</b> ${activeSession.time||''} · ${escapeHtml(activeSession.method||'')} · ${activeSession.fields.length} field${activeSession.fields.length!==1?'s':''} logged`;
  }
}

function openSessionSetupModal(existingSession){
  const isEdit = !!existingSession;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  const nowDate = new Date().toISOString().slice(0,10);
  const weatherRaw = $('weather-pill').dataset.cached;
  let weatherStr = $('weather-pill').textContent;
  try{ if(weatherRaw){ const w = JSON.parse(weatherRaw); weatherStr = `${w.temp}°C, ${w.wind}mph wind`; } }catch(e){}

  overlay.innerHTML = `
    <div class="modal">
      <h3>${isEdit ? 'Edit count' : 'Start a count'}</h3>
      <label style="margin-top:0;">Date</label>
      <input type="date" id="sess-date" value="${isEdit?existingSession.date:nowDate}">
      <label>Time</label>
      <input type="text" id="sess-time" value="${isEdit?(existingSession.time||''):nowTimeStr()}" placeholder="HH:MM">
      <label>Method</label>
      <select id="sess-method">${SCAN_METHODS.map(m=>`<option ${isEdit&&existingSession.method===m?'selected':''}>${m}</option>`).join('')}</select>
      <label>Weather</label>
      <input type="text" id="sess-weather" value="${isEdit?(existingSession.weather||''):weatherStr}">
      <div class="actions">
        <button class="btn secondary" id="sess-cancel">Cancel</button>
        <button class="btn" id="sess-confirm" style="flex:1;">${isEdit?'Continue editing':'Start'}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  const cleanup = ()=> document.body.removeChild(overlay);
  overlay.querySelector('#sess-cancel').onclick = cleanup;
  overlay.querySelector('#sess-confirm').onclick = ()=>{
    const date = overlay.querySelector('#sess-date').value;
    const time = overlay.querySelector('#sess-time').value.trim();
    const method = overlay.querySelector('#sess-method').value;
    const weather = overlay.querySelector('#sess-weather').value.trim();
    if(!date){ showToast('Pick a date', true); return; }
    activeSession = isEdit
      ? { ...existingSession, date, time, method, weather }
      : { id:null, date, time, method, weather, notes:'', fields:[] };
    cleanup();
    renderCountBar();
    refreshAllBadges();
    showToast(isEdit ? 'Editing count — tap fields to update' : 'Count started — tap a field to log it');
  };
}

async function saveActiveSession(){
  if(!activeSession) return;
  if(!activeSession.fields.length){ showToast('Log at least one field before saving', true); return; }
  const payload = {
    date: activeSession.date, time: activeSession.time||'', method: activeSession.method,
    weather: activeSession.weather||'', notes: activeSession.notes||'', fields: activeSession.fields,
    updatedAt: DC.fns.serverTimestamp()
  };
  try{
    if(activeSession.id){
      await DC.fns.updateDoc(DC.fns.doc(DC.db,'farms',currentFarmId,'sessions',activeSession.id), payload);
    } else {
      payload.createdAt = DC.fns.serverTimestamp();
      await DC.fns.addDoc(DC.fns.collection(DC.db,'farms',currentFarmId,'sessions'), payload);
    }
    showToast(navigator.onLine ? 'Count saved' : 'Saved offline — will sync later');
    activeSession = null;
    renderCountBar();
    refreshAllBadges();
    if(currentFarmData.dropboxEnabled){ backupToDropbox(); }
  }catch(e){
    console.error(e);
    showToast('Could not save — check connection', true);
  }
}

// ---- Badges on the map ----
function refreshAllBadges(){
  if(!drawnItemsLayer) return;
  drawnItemsLayer.eachLayer(layer=>{
    const parcelId = layer._parcelId;
    if(layer._badgeMarker){ map.removeLayer(layer._badgeMarker); layer._badgeMarker=null; }

    let total = null, staged = false;
    if(activeSession){
      const f = activeSession.fields.find(x=>x.parcelId===parcelId);
      if(f){ total = f.counts.reduce((a,c)=>a+Number(c.count||0),0); staged = true; }
    }
    if(total===null){
      const savedSession = currentSessions.find(s=> (s.fields||[]).some(f=>f.parcelId===parcelId));
      if(savedSession){
        const f = savedSession.fields.find(f=>f.parcelId===parcelId);
        total = (f.counts||[]).reduce((a,c)=>a+Number(c.count||0),0);
      }
    }
    if(total===null || !total) return;
    const center = layer.getBounds().getCenter();
    const icon = L.divIcon({ className:'', html:`<div class="count-badge-icon${staged?' staged':''}">${total}</div>`, iconSize:[24,24] });
    layer._badgeMarker = L.marker(center, { icon, interactive:false }).addTo(map);
  });
}

// ---- Tapping a field on the map ----
function onParcelTapped(parcelId){
  if(activeSession){
    openFieldEntrySheet(parcelId);
  } else {
    const parcel = (currentFarmData.parcels||[]).find(p=>p.id===parcelId);
    const overlay = document.createElement('div');
    overlay.className = 'sheet-overlay';
    overlay.id = 'no-session-overlay';
    overlay.innerHTML = `
      <div class="sheet">
        <button class="sheet-close" id="no-session-close">&times;</button>
        <div class="sheet-handle"></div>
        <h2>${escapeHtml(parcel?.name||'Field')}</h2>
        <div class="sub">No count in progress</div>
        <button class="btn" id="no-session-start" style="margin-top:6px;">Start a count now</button>
        <button class="btn secondary" id="no-session-history" style="margin-top:8px;">View history</button>
      </div>`;
    document.body.appendChild(overlay);
    const cleanup = ()=> document.body.contains(overlay) && document.body.removeChild(overlay);
    overlay.querySelector('#no-session-close').onclick = cleanup;
    overlay.addEventListener('click', e=>{ if(e.target===overlay) cleanup(); });
    overlay.querySelector('#no-session-start').onclick = ()=>{
      cleanup();
      openSessionSetupModal();
      const origConfirm = document.querySelector('#sess-confirm');
      // after starting, jump straight into this field's entry sheet
      if(origConfirm){
        origConfirm.addEventListener('click', ()=> setTimeout(()=>{ if(activeSession) openFieldEntrySheet(parcelId); }, 50), { once:true });
      }
    };
    overlay.querySelector('#no-session-history').onclick = ()=>{ cleanup(); openHistorySheet(); };
  }
}

function openFieldEntrySheet(parcelId){
  activeParcelId = parcelId;
  const parcel = (currentFarmData.parcels||[]).find(p=>p.id===parcelId);
  if(!parcel || !activeSession) return;
  const existing = activeSession.fields.find(f=>f.parcelId===parcelId);

  const overlay = document.createElement('div');
  overlay.className = 'sheet-overlay';
  overlay.id = 'log-sheet-overlay';

  const deerSpecies = (currentFarmData.deerSpecies||[]);
  const otherSpecies = (currentFarmData.otherSpecies||[]);
  const detailBreakdown = currentFarmData.deerDetailBreakdown !== false;

  function existingCountFor(key){
    if(!existing) return 0;
    const [group,label] = key.split('|');
    let speciesName = label;
    if(group!=='other'){
      const sp = DEER_SPECIES.find(d=>d.id===group);
      speciesName = (label==='total') ? sp.name : `${sp.name} - ${label}`;
    }
    const c = existing.counts.find(c=>c.species===speciesName);
    return c ? c.count : 0;
  }

  let speciesHtml = '';
  if(deerSpecies.length){
    speciesHtml += `<div class="species-group-title">Deer</div>`;
    deerSpecies.forEach(sid=>{
      const sp = DEER_SPECIES.find(d=>d.id===sid);
      if(!sp) return;
      if(detailBreakdown){
        speciesHtml += `<div style="font-size:12px;color:var(--muted);margin:8px 0 4px;">${sp.name}</div>`;
        sp.classes.forEach(cls=>{
          const key = `${sp.id}|${cls}`;
          speciesHtml += stepperRowHtml(key, cls, existingCountFor(key));
        });
      } else {
        const key = `${sp.id}|total`;
        speciesHtml += stepperRowHtml(key, sp.name, existingCountFor(key));
      }
    });
  }
  if(otherSpecies.length){
    speciesHtml += `<div class="species-group-title">Other species</div>`;
    otherSpecies.forEach(sp=>{
      const key = `other|${sp.name}`;
      speciesHtml += stepperRowHtml(key, sp.name, existingCountFor(key));
    });
  }
  if(!deerSpecies.length && !otherSpecies.length){
    speciesHtml = `<div class="empty" style="padding:14px;">No species set up yet — add them in Settings.</div>`;
  }

  overlay.innerHTML = `
    <div class="sheet">
      <button class="sheet-close" id="log-sheet-close">&times;</button>
      <div class="sheet-handle"></div>
      <h2>${escapeHtml(parcel.name)}</h2>
      <div class="sub">${activeSession.date} ${activeSession.time||''} · ${escapeHtml(activeSession.method||'')}</div>

      <div id="species-steppers">${speciesHtml}</div>

      <button class="btn" id="save-scan-btn" style="margin-top:14px;">${existing?'Update field':'Add to count'}</button>
    </div>`;
  document.body.appendChild(overlay);

  overlay.querySelectorAll('.stepper').forEach(st=>{
    const valEl = st.querySelector('.val');
    st.querySelector('.minus').addEventListener('click', ()=>{
      valEl.textContent = Math.max(0, Number(valEl.textContent)-1);
    });
    st.querySelector('.plus').addEventListener('click', ()=>{
      valEl.textContent = Number(valEl.textContent)+1;
    });
  });

  overlay.querySelector('#log-sheet-close').addEventListener('click', closeLogSheet);
  overlay.addEventListener('click', e=>{ if(e.target===overlay) closeLogSheet(); });
  overlay.querySelector('#save-scan-btn').addEventListener('click', ()=> addFieldToSession(parcel));
}
function stepperRowHtml(key, label, startVal){
  return `<div class="stepper-row">
    <span class="sname">${escapeHtml(label)}</span>
    <div class="stepper" data-key="${escapeHtml(key)}">
      <button class="minus">–</button><span class="val">${startVal||0}</span><button class="plus">+</button>
    </div>
  </div>`;
}
function closeLogSheet(){
  const overlay = $('log-sheet-overlay');
  if(overlay) overlay.remove();
  activeParcelId = null;
}

function addFieldToSession(parcel){
  const counts = [];
  document.querySelectorAll('#log-sheet-overlay .stepper').forEach(st=>{
    const n = Number(st.querySelector('.val').textContent);
    if(n>0){
      const [group, label] = st.dataset.key.split('|');
      let speciesName = label;
      if(group!=='other'){
        const sp = DEER_SPECIES.find(d=>d.id===group);
        speciesName = (label==='total') ? sp.name : `${sp.name} - ${label}`;
      }
      counts.push({ species: speciesName, count: n });
    }
  });
  if(!counts.length){ showToast('Log at least one animal', true); return; }

  activeSession.fields = activeSession.fields.filter(f=>f.parcelId!==parcel.id);
  activeSession.fields.push({ parcelId: parcel.id, parcelName: parcel.name, counts });
  closeLogSheet();
  renderCountBar();
  refreshAllBadges();
  showToast(`${parcel.name} added to count`);
}

// ---- History ----
function sessionTallyHtml(session){
  return (session.fields||[]).map(f=>{
    const tally = (f.counts||[]).map(c=>`${c.species}: ${c.count}`).join(', ');
    return `<div class="hist-field-row" data-parcel="${f.parcelId}">
      <div><div class="fname">${escapeHtml(f.parcelName)}</div><div class="ftally">${escapeHtml(tally)}</div></div>
      <button class="del-field" data-session="${session.id}" data-parcel="${f.parcelId}">&times;</button>
    </div>`;
  }).join('');
}
function openHistorySheet(){
  const overlay = document.createElement('div');
  overlay.className = 'sheet-overlay';
  overlay.id = 'history-sheet-overlay';
  overlay.innerHTML = `
    <div class="sheet">
      <button class="sheet-close" id="history-close">&times;</button>
      <div class="sheet-handle"></div>
      <h2>Count history</h2>
      <div class="sub">${currentSessions.length} count${currentSessions.length!==1?'s':''} logged</div>
      <div id="history-list"></div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#history-close').onclick = ()=> overlay.remove();
  overlay.addEventListener('click', e=>{ if(e.target===overlay) overlay.remove(); });
  renderHistoryList();
}
function renderHistoryList(){
  const el = $('history-list');
  if(!el) return;
  if(!currentSessions.length){
    el.innerHTML = `<div class="empty">No counts logged yet.</div>`;
    return;
  }
  el.innerHTML = currentSessions.map(s=>{
    const totalAnimals = (s.fields||[]).reduce((sum,f)=> sum + (f.counts||[]).reduce((a,c)=>a+Number(c.count||0),0), 0);
    return `<div class="hist-session" data-id="${s.id}">
      <div class="top" data-toggle="${s.id}">
        <div><div class="date">${s.date} ${s.time||''}</div>
        <div class="sub">${escapeHtml(s.method||'')}${s.weather?' · '+escapeHtml(s.weather):''} · ${totalAnimals} animals across ${(s.fields||[]).length} field${(s.fields||[]).length!==1?'s':''}</div></div>
        <div class="actions">
          <button class="edit" data-id="${s.id}">Edit</button>
          <button class="del" data-id="${s.id}">Delete</button>
        </div>
      </div>
      <div class="hist-session-fields" id="fields-${s.id}" style="display:none;">${sessionTallyHtml(s)}</div>
    </div>`;
  }).join('');

  el.querySelectorAll('[data-toggle]').forEach(row=>{
    row.addEventListener('click', e=>{
      if(e.target.closest('.actions')) return;
      const id = row.dataset.toggle;
      const fieldsEl = $('fields-'+id);
      fieldsEl.style.display = fieldsEl.style.display==='none' ? 'block' : 'none';
    });
  });
  el.querySelectorAll('.edit').forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.stopPropagation();
      const session = currentSessions.find(s=>s.id===btn.dataset.id);
      $('history-sheet-overlay').remove();
      openSessionSetupModal(session);
    });
  });
  el.querySelectorAll('.del').forEach(btn=>{
    btn.addEventListener('click', async e=>{
      e.stopPropagation();
      if(!confirm('Delete this whole count? This removes every field logged in it and cannot be undone.')) return;
      try{
        await DC.fns.deleteDoc(DC.fns.doc(DC.db,'farms',currentFarmId,'sessions',btn.dataset.id));
        showToast('Count deleted');
        renderHistoryList();
      }catch(err){ console.error(err); showToast('Could not delete — check connection', true); }
    });
  });
  el.querySelectorAll('.del-field').forEach(btn=>{
    btn.addEventListener('click', async e=>{
      e.stopPropagation();
      if(!confirm('Remove this field from the count?')) return;
      const session = currentSessions.find(s=>s.id===btn.dataset.session);
      if(!session) return;
      const newFields = (session.fields||[]).filter(f=>f.parcelId!==btn.dataset.parcel);
      try{
        if(newFields.length){
          await DC.fns.updateDoc(DC.fns.doc(DC.db,'farms',currentFarmId,'sessions',session.id), { fields:newFields });
        } else {
          await DC.fns.deleteDoc(DC.fns.doc(DC.db,'farms',currentFarmId,'sessions',session.id));
        }
        showToast('Field removed');
        renderHistoryList();
      }catch(err){ console.error(err); showToast('Could not remove — check connection', true); }
    });
  });
}

// -------------------- Settings screen --------------------
function openSettingsScreen(){
  $('settings-farm-name').textContent = currentFarmData.name || 'Settings';
  $('set-farm-name').value = currentFarmData.name || '';
  $('set-postcode').value = currentFarmData.postcode || '';
  $('dropbox-token').value = localStorage.getItem('dc_dropbox_token_'+currentFarmId) || '';
  renderDeerChips();
  renderChipList('otherSpecies', 'other-species-chips', false);
  renderChipList('livestock', 'livestock-chips', true);
  renderChipList('schemes', 'scheme-chips', false);
  renderParcelSettingsList();
  setToggleState('shoot-toggle', !!currentFarmData.hasShoot);
  setToggleState('dropbox-toggle', !!currentFarmData.dropboxEnabled);
  setToggleState('deer-detail-toggle', currentFarmData.deerDetailBreakdown !== false);
  showScreen('screen-settings');
}
function setToggleState(id, on){
  const el = $(id);
  el.classList.toggle('off', !on);
}
async function toggleFarmBool(field, toggleId){
  const newVal = !currentFarmData[field];
  setToggleState(toggleId, newVal);
  await saveFarmField(field, newVal);
}
function renderDeerChips(){
  const wrap = $('deer-species-chips');
  const active = currentFarmData.deerSpecies || [];
  wrap.innerHTML = DEER_SPECIES.map(sp=>{
    const on = active.includes(sp.id);
    return `<button class="chip" data-id="${sp.id}" style="${on?'border-color:var(--accent2);background:var(--panel3);':'opacity:.55;'}">
      🦌 ${sp.name}
    </button>`;
  }).join('');
  wrap.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', async ()=>{
      let active = [...(currentFarmData.deerSpecies||[])];
      const id = chip.dataset.id;
      if(active.includes(id)) active = active.filter(x=>x!==id);
      else active.push(id);
      await saveFarmField('deerSpecies', active);
      renderDeerChips();
    });
  });
}
function renderChipList(field, containerId, colored){
  const wrap = $(containerId);
  const items = currentFarmData[field] || [];
  wrap.innerHTML = items.map((item, i)=>{
    const name = typeof item === 'string' ? item : item.name;
    const color = colored && item.color ? item.color : null;
    return `<span class="chip">${color?`<span class="dot" style="background:${color};"></span>`:''}${escapeHtml(name)}
      <button class="x" data-field="${field}" data-idx="${i}">&times;</button></span>`;
  }).join('');
  wrap.querySelectorAll('.x').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const arr = [...(currentFarmData[btn.dataset.field]||[])];
      arr.splice(Number(btn.dataset.idx),1);
      await saveFarmField(btn.dataset.field, arr);
      renderChipList(btn.dataset.field, containerId, colored);
    });
  });
}
const LIVESTOCK_COLORS = ['#c99a3f','#b3503f','#4a7ba6','#7cb35c','#93a493','#a65f9f'];
async function addChipPrompt(field, title, placeholder, withColor){
  const name = prompt(title + ' — ' + placeholder);
  if(!name || !name.trim()) return;
  const arr = [...(currentFarmData[field]||[])];
  if(withColor){
    const color = LIVESTOCK_COLORS[arr.length % LIVESTOCK_COLORS.length];
    arr.push({ name: name.trim(), color });
  } else {
    arr.push(field==='otherSpecies' ? { name: name.trim() } : name.trim());
  }
  await saveFarmField(field, arr);
  if(field==='otherSpecies') renderChipList('otherSpecies','other-species-chips',false);
  if(field==='livestock') renderChipList('livestock','livestock-chips',true);
  if(field==='schemes') renderChipList('schemes','scheme-chips',false);
}
function renderParcelSettingsList(){
  const wrap = $('parcel-list');
  const parcels = currentFarmData.parcels || [];
  $('parcel-empty-hint').style.display = parcels.length ? 'none' : 'block';
  wrap.innerHTML = parcels.map(p=>{
    const typeInfo = PARCEL_TYPES.find(t=>t.id===p.type) || PARCEL_TYPES[4];
    return `<div class="parcel-row" data-id="${p.id}">
      <div><div class="pname"><span class="swatch" style="background:${typeInfo.color};"></span>${escapeHtml(p.name)}</div>
      <div class="pmeta">${typeInfo.label}${p.sizeAcres?` · ${p.sizeAcres} acres`:''}</div></div>
      <button class="rm-x" data-id="${p.id}">&times;</button>
    </div>`;
  }).join('');
  wrap.querySelectorAll('.parcel-row').forEach(row=>{
    row.addEventListener('click', e=>{
      if(e.target.classList.contains('rm-x')) return;
      const parcel = parcels.find(p=>p.id===row.dataset.id);
      openNewParcelModal(null, parcel);
    });
  });
  wrap.querySelectorAll('.rm-x').forEach(btn=>{
    btn.addEventListener('click', async e=>{
      e.stopPropagation();
      if(!confirm('Delete this field? Its scan history will be kept but unlinked.')) return;
      const arr = (currentFarmData.parcels||[]).filter(p=>p.id!==btn.dataset.id);
      await saveFarmField('parcels', arr);
      renderParcelSettingsList();
      redrawParcels();
    });
  });
}

async function saveFarmField(field, value){
  currentFarmData[field] = value;
  try{
    await DC.fns.updateDoc(DC.fns.doc(DC.db,'farms',currentFarmId), { [field]: value });
  }catch(e){
    console.error(e);
    // Firestore offline persistence still queues the write locally; inform gently
    if(!navigator.onLine) showToast('Saved offline — will sync later');
    else showToast('Could not save — try again', true);
  }
}

async function deleteCurrentFarm(){
  if(!confirm(`Delete "${currentFarmData.name}" completely? This removes all its fields and scan history and can't be undone.`)) return;
  if(!confirm('Really sure? Type OK to confirm deletion.')) return;
  try{
    const sessionsSnap = await DC.fns.getDocs(DC.fns.collection(DC.db,'farms',currentFarmId,'sessions'));
    const batch = DC.fns.writeBatch(DC.db);
    sessionsSnap.forEach(d=> batch.delete(d.ref));
    batch.delete(DC.fns.doc(DC.db,'farms',currentFarmId));
    await batch.commit();
    showToast('Farm deleted');
    showScreen('screen-farms');
  }catch(e){
    console.error(e);
    showToast('Could not delete — check connection', true);
  }
}

// -------------------- Export (Excel) --------------------
function buildWorkbookForSessions(farmName, sessions){
  const rows = [];
  const totals = {};
  sessions.forEach(s=> (s.fields||[]).forEach(f=> (f.counts||[]).forEach(c=>{
    totals[c.species] = (totals[c.species]||0) + Number(c.count||0);
  })));
  rows.push(['Deer Count — Export', farmName || '']);
  rows.push(['Generated', new Date().toLocaleString()]);
  rows.push([]);
  rows.push(['TOTALS']);
  Object.entries(totals).sort((a,b)=>b[1]-a[1]).forEach(([sp,ct])=> rows.push(['', sp, ct]));
  rows.push([]);
  rows.push(['Farm','Date','Time','Weather','Field name','Method','Animal','Count','Notes']);
  sessions.slice().sort((a,b)=> `${a.date} ${a.time||''}`.localeCompare(`${b.date} ${b.time||''}`)).forEach(s=>{
    (s.fields||[]).forEach(f=>{
      (f.counts||[]).forEach(c=>{
        rows.push([farmName||'', s.date, s.time||'', s.weather||'', f.parcelName||'', s.method||'', c.species, c.count, s.notes||'']);
      });
    });
  });
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{wch:18},{wch:12},{wch:8},{wch:16},{wch:16},{wch:22},{wch:20},{wch:8},{wch:30}];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Counts');
  return wb;
}
function exportExcel(){
  if(!currentSessions.length){ showToast('No counts to export yet', true); return; }
  const wb = buildWorkbookForSessions(currentFarmData.name, currentSessions);
  const fname = `deer-count-${(currentFarmData.name||'farm').replace(/[^a-z0-9]+/gi,'-')}-${new Date().toISOString().slice(0,10)}.xlsx`;
  XLSX.writeFile(wb, fname);
  showToast('Export downloaded');
}
async function exportAllFarms(){
  if(!allFarms.length){ showToast('No farms to export', true); return; }
  showToast('Exporting all farms…');
  for(const farm of allFarms){
    try{
      const snap = await DC.fns.getDocs(DC.fns.collection(DC.db,'farms',farm.id,'sessions'));
      const sessions = [];
      snap.forEach(d=> sessions.push({ id:d.id, ...d.data() }));
      if(!sessions.length) continue;
      const wb = buildWorkbookForSessions(farm.name, sessions);
      const fname = `deer-count-${(farm.name||'farm').replace(/[^a-z0-9]+/gi,'-')}-${new Date().toISOString().slice(0,10)}.xlsx`;
      XLSX.writeFile(wb, fname);
      await new Promise(r=>setTimeout(r, 400));
    }catch(e){ console.error('Export failed for farm', farm.name, e); }
  }
  showToast('All farm exports downloaded');
}

// -------------------- Dropbox backup --------------------
async function backupToDropbox(){
  const token = localStorage.getItem('dc_dropbox_token_'+currentFarmId);
  if(!token){ return; }
  if(!navigator.onLine){ return; }
  try{
    const payload = JSON.stringify({ farm: currentFarmData, sessions: currentSessions, backedUpAt: new Date().toISOString() });
    const res = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method:'POST',
      headers:{
        'Authorization': 'Bearer ' + token,
        'Dropbox-API-Arg': JSON.stringify({ path: `/${(currentFarmData.name||'farm').replace(/[^a-z0-9]+/gi,'-')}-backup.json`, mode:'overwrite', mute:true }),
        'Content-Type': 'application/octet-stream'
      },
      body: payload
    });
    if(res.ok){ showToast('Backed up to Dropbox'); }
    else { console.warn('Dropbox backup failed', await res.text()); }
  }catch(e){ console.warn('Dropbox backup error', e); }
}
