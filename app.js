// ===================== Deer Count app logic =====================

const DEER_ICON_B64 = {
  red: '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',
  roe: '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',
  fallow: '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',
  sika: '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',
  muntjac: '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',
  cwd: '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',
};

const DEER_SPECIES = [
  { id:'red',    name:'Red Deer',           classes:['Stag','Hind','Calf'] },
  { id:'roe',    name:'Roe Deer',           classes:['Buck','Doe','Kid'] },
  { id:'fallow', name:'Fallow Deer',        classes:['Buck','Doe','Fawn'] },
  { id:'sika',   name:'Sika Deer',          classes:['Stag','Hind','Calf'] },
  { id:'muntjac',name:'Muntjac',            classes:['Buck','Doe','Kid'] },
  { id:'cwd',    name:'Chinese Water Deer', classes:['Buck','Doe','Fawn'] },
];
function deerIconImg(id, size){
  const b64 = DEER_ICON_B64[id];
  if(!b64) return '';
  return `<img src="data:image/png;base64,${b64}" style="width:${size}px;height:${size}px;vertical-align:middle;object-fit:contain;">`;
}

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

const APP_VERSION = 'v1.2.0';

function setDeerDetailLabel(on){
  const el = $('deer-detail-label');
  if(el) el.textContent = on ? 'Logging: Male / Female / Young' : 'Logging: Species (one total)';
}

let DC; // firebase handles, set on ready
let currentUser = null;
let currentFarmId = null;
let currentFarmData = null;
let farmsUnsub = null;
let sessionsUnsub = null;
let allFarms = [];
let currentSessions = [];
let activeSession = null; // { id: null|existingId, date, time, method, weather, notes, fields:[{parcelId,parcelName,counts:[]}] }

let map, drawnItemsLayer, badgeLayer, drawControl;
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

  $('set-farm-name').addEventListener('change', e=> { saveFarmField('name', e.target.value); $('map-farm-name-text').textContent = e.target.value||'Farm'; $('settings-farm-name').textContent = e.target.value||'Settings'; });
  $('set-farmer-name').addEventListener('change', e=> { saveFarmField('farmerName', e.target.value); $('map-farmer-name-text').textContent = e.target.value||''; });
  $('set-address').addEventListener('change', e=> saveFarmField('address', e.target.value));
  $('set-postcode').addEventListener('change', e=> { saveFarmField('postcode', e.target.value); fetchWeather(); });
  $('add-other-species-btn').addEventListener('click', ()=> addChipPrompt('otherSpecies', 'Add species', 'e.g. Grey Squirrel'));
  $('add-crop-btn').addEventListener('click', ()=> addChipPrompt('crops', 'Add crop', 'e.g. Winter Wheat'));
  $('add-livestock-btn').addEventListener('click', ()=> addChipPrompt('livestock', 'Add livestock', 'e.g. Sheep', true));
  $('add-scheme-btn').addEventListener('click', ()=> addChipPrompt('schemes', 'Add scheme', 'e.g. Countryside Stewardship'));
  $('add-gamecover-btn').addEventListener('click', ()=> addChipPrompt('gameCovers', 'Add game cover', 'e.g. Maize'));
  $('shoot-toggle').addEventListener('click', ()=> toggleFarmBool('hasShoot', 'shoot-toggle'));
  $('deer-detail-toggle').addEventListener('click', async ()=>{
    const newVal = !(currentFarmData.deerDetailBreakdown !== false);
    setToggleState('deer-detail-toggle', newVal);
    setDeerDetailLabel(newVal);
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
  $('app-version').textContent = APP_VERSION;
  if(!allFarms.length){
    list.innerHTML = `<div class="empty">No farms yet.<br>Tap + to add your first farm.</div>`;
    return;
  }
  list.innerHTML = allFarms.map(f=>{
    const parcels = f.parcels||[];
    const parcelCount = parcels.length;
    const totalAcres = parcels.reduce((a,p)=> a + (Number(p.sizeAcres)||0), 0);
    const totalHectares = totalAcres * 0.404686;
    const acresStr = totalAcres ? `${totalAcres.toFixed(1)} acres (${totalHectares.toFixed(1)} ha)` : '';
    const speciesNames = (f.deerSpecies||[]).map(id => DEER_SPECIES.find(d=>d.id===id)?.name).filter(Boolean);
    const otherNames = (f.otherSpecies||[]).map(s=>s.name);
    const allSpecies = [...speciesNames, ...otherNames].slice(0,3).join(', ') || 'No species set';
    return `<div class="farm-card" data-id="${f.id}">
      <div><div class="fname">${escapeHtml(f.name || 'Unnamed farm')}</div>
      <div class="fmeta">${parcelCount} field${parcelCount!==1?'s':''}${acresStr?' · '+acresStr:''} · ${escapeHtml(allSpecies)}${f.hasShoot?' · Shoot ✓':''}</div></div>
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
      name: name.trim(), farmerName:'', address:'', postcode:'', ownerId: currentUser.uid,
      deerSpecies:[], otherSpecies:[], parcels:[], livestock:[], schemes:[], crops:[], gameCovers:[],
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
  $('map-farm-name-text').textContent = currentFarmData.name || 'Farm';
  $('map-farmer-name-text').textContent = currentFarmData.farmerName || '';
  activeSession = null;
  currentSessions = [];
  showScreen('screen-map');
  fetchWeather();
  subscribeSessions(farmId);
  if(!map){ initMap(); } else { redrawParcels(); }
  renderCountBar();
  setTimeout(()=> map && map.invalidateSize(), 150);
}

function initMap(){
  map = L.map('map', { zoomControl:false, attributionControl:true }).setView([52.0, -0.6], 13);
  L.control.zoom({ position:'topright' }).addTo(map);
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri, Maxar, Earthstar Geographics', maxZoom: 20
  }).addTo(map);

  drawnItemsLayer = new L.FeatureGroup();
  map.addLayer(drawnItemsLayer);
  badgeLayer = new L.FeatureGroup();
  map.addLayer(badgeLayer);

  drawControl = new L.Control.Draw({
    position:'topright',
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
  map.on(L.Draw.Event.EDITED, e=>{
    const updates = [];
    e.layers.eachLayer(layer=>{
      if(!layer._parcelId) return;
      const latlngs = layer.getLatLngs()[0].map(ll=>({ lat: ll.lat, lng: ll.lng }));
      updates.push({ id: layer._parcelId, latlngs });
    });
    if(updates.length){
      const parcels = (currentFarmData.parcels||[]).map(p=>{
        const u = updates.find(x=>x.id===p.id);
        return u ? {...p, latlngs:u.latlngs} : p;
      });
      saveFarmField('parcels', parcels).then(()=> showToast('Field boundary updated'));
    }
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
  if(badgeLayer) badgeLayer.clearLayers();
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
  if(badgeLayer) badgeLayer.clearLayers();
  drawnItemsLayer.eachLayer(layer=>{
    const parcelId = layer._parcelId;
    layer._badgeMarker = null;

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
    layer._badgeMarker = L.marker(center, { icon, interactive:false });
    badgeLayer.addLayer(layer._badgeMarker);
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
        speciesHtml += `<div style="font-size:12px;color:var(--muted);margin:8px 0 4px;display:flex;align-items:center;gap:6px;">${deerIconImg(sp.id,18)} ${sp.name}</div>`;
        sp.classes.forEach(cls=>{
          const key = `${sp.id}|${cls}`;
          speciesHtml += stepperRowHtml(key, escapeHtml(cls), existingCountFor(key));
        });
      } else {
        const key = `${sp.id}|total`;
        speciesHtml += stepperRowHtml(key, `${deerIconImg(sp.id,18)} ${sp.name}`, existingCountFor(key));
      }
    });
  }
  if(otherSpecies.length){
    speciesHtml += `<div class="species-group-title">Other species</div>`;
    otherSpecies.forEach(sp=>{
      const key = `other|${sp.name}`;
      speciesHtml += stepperRowHtml(key, escapeHtml(sp.name), existingCountFor(key));
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
function stepperRowHtml(key, labelHtml, startVal){
  return `<div class="stepper-row">
    <span class="sname">${labelHtml}</span>
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
  $('set-farmer-name').value = currentFarmData.farmerName || '';
  $('set-address').value = currentFarmData.address || '';
  $('set-postcode').value = currentFarmData.postcode || '';
  $('dropbox-token').value = localStorage.getItem('dc_dropbox_token_'+currentFarmId) || '';
  renderDeerChips();
  renderChipList('otherSpecies', 'other-species-chips', false);
  renderChipList('crops', 'crop-chips', false);
  renderChipList('livestock', 'livestock-chips', true);
  renderChipList('schemes', 'scheme-chips', false);
  renderChipList('gameCovers', 'gamecover-chips', false);
  renderParcelSettingsList();
  setToggleState('shoot-toggle', !!currentFarmData.hasShoot);
  setToggleState('dropbox-toggle', !!currentFarmData.dropboxEnabled);
  const detailOn = currentFarmData.deerDetailBreakdown !== false;
  setToggleState('deer-detail-toggle', detailOn);
  setDeerDetailLabel(detailOn);
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
    return `<button class="chip" data-id="${sp.id}" style="${on?'border-color:var(--accent2);background:var(--panel3);':'opacity:.55;'}padding:5px 12px 5px 6px;">
      ${deerIconImg(sp.id,22)} ${sp.name}
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
  if(field==='crops') renderChipList('crops','crop-chips',false);
  if(field==='livestock') renderChipList('livestock','livestock-chips',true);
  if(field==='schemes') renderChipList('schemes','scheme-chips',false);
  if(field==='gameCovers') renderChipList('gameCovers','gamecover-chips',false);
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
