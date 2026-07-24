/* ==========================================================================
   FAMILYPLANER - INTERACTIVE LOGIC & STATE MANAGEMENT
   ========================================================================== */

// --- Application State ---
const defaultState = {
  activeProfile: 'parent', // 'parent' | 'child_independent' | 'child_managed'
  currentFamily: 'Familie Müller',
  googleCalendarSynced: true,
  lastGoogleSync: 'Vor 5 Minuten',

  // Family Members Management (Addable/Editable)
  members: [
    { id: 'parent', name: 'Tom (Vater)', role: 'parent', avatar: '👨', age: 41, isParent: true },
    { id: 'mother', name: 'Sarah (Mutter)', role: 'parent', avatar: '👩', age: 39, isParent: true },
    { id: 'child_independent', name: 'Nick (Sohn)', role: 'child_independent', avatar: '👦', age: 11, isParent: false, hasOwnDevice: true, permissions: { canSendAdHocDirectly: true, requiresWishApproval: true, maxBudget: '15 €' } },
    { id: 'child_managed', name: 'Maya (Tochter)', role: 'child_managed', avatar: '👧', age: 7, isParent: false, hasOwnDevice: false, permissions: { canSendAdHocDirectly: false, requiresWishApproval: true, maxBudget: '10 €' } }
  ],

  // Ad-Hoc Requests ("Wer hat JETZT Lust?") with Targeted Audience
  adHocRequests: [
    {
      id: 'adhoc-1',
      creator: 'Nick (11 J.)',
      avatar: '👦',
      activity: '⚽ Fußball spielen & Bolzen',
      time: 'Heute 15:00 Uhr',
      location: 'Bolzplatz Parkstraße',
      targetAudience: 'Nur Jungs (Nick, Jonas, Ben)',
      cost: 'Kostenlos',
      parentPresent: 'Ohne Eltern (Kinder unter sich)',
      status: 'Aktiv',
      rsvps: [
        { family: 'Familie Weber', name: 'Jonas', status: 'Dabei! 🎉', avatar: '👦' },
        { family: 'Familie Fischer', name: 'Ben', status: 'Ausstehend...', avatar: '👦' }
      ]
    },
    {
      id: 'adhoc-2',
      creator: 'Maya (7 J.) - via Tom',
      avatar: '👧',
      activity: '🍦 Eis essen & Spielplatz',
      time: 'Heute 16:30 Uhr',
      location: 'Eiscafé Venezia',
      targetAudience: 'Nur Mädchen (Maya, Emma)',
      cost: 'ca. 4 € / Kind',
      parentPresent: 'Mit Eltern-Begleitung',
      status: 'Aktiv',
      rsvps: [
        { family: 'Familie Weber', name: 'Emma', status: 'Ab 17 Uhr dabei!', avatar: '👧' }
      ]
    }
  ],

  // Recurring Weekly Hobbies & Internal/External Driver Logistics
  recurringHobbies: [
    {
      id: 'hob-1',
      child: 'Nick',
      avatar: '👦',
      title: '⚽ Fußball-Training',
      schedule: 'Jeden Di & Do, 17:00 - 18:30 Uhr',
      location: 'Sportpark Ost',
      bringDriver: '👨 Tom (Papa)',
      getDriver: '👩 Sarah (Mama)',
      parentPresent: 'Ohne Eltern (Trainer schaut)',
      status: 'Familien-intern aufgeteilt ✅'
    },
    {
      id: 'hob-2',
      child: 'Maya',
      avatar: '👧',
      title: '💃 Tanzen & Ballett',
      schedule: 'Jeden Donnerstag, 15:30 - 16:30 Uhr',
      location: 'Tanzstudio Motion',
      bringDriver: '👨 Tom (Papa)',
      getDriver: '👩 Mutter von Emma (Fam. Weber)',
      parentPresent: 'Mit Eltern-Begleitung',
      status: 'Gemischter Hol/Bringdienst ✅'
    },
    {
      id: 'hob-3',
      child: 'Nick & Maya',
      avatar: '👦👧',
      title: '🏊 Schwimmverein (Kinderschwimmen)',
      schedule: 'Jeden Freitag, 16:00 - 17:30 Uhr',
      location: 'Stadtbad Aqua',
      bringDriver: '🏡 Fam. Fischer',
      getDriver: '⚠️ Offen (Wer holt ab?)',
      parentPresent: 'Mit Eltern-Begleitung',
      status: 'Holdienst offen'
    }
  ],

  // Kids Wishlist with Parent Approval Status
  wishes: [
    {
      id: 'wish-1',
      child: 'Nick',
      avatar: '👦',
      category: '🏊 Schwimmbad / Rutschen',
      desc: 'Wollte unbedingt mal wieder in die Wasserwelt mit Sprungturm!',
      cost: '12 € Eintritt',
      status: 'Genehmigt',
      dateAdded: 'Gestern'
    },
    {
      id: 'wish-2',
      child: 'Maya',
      avatar: '👧',
      category: '🎬 Kino / Filmabend',
      desc: 'Neuer Animationsfilm im Kinopolis',
      cost: '9,50 € Ticket',
      status: 'Ausstehend',
      dateAdded: 'Vor 2 Tagen'
    },
    {
      id: 'wish-3',
      child: 'Nick',
      avatar: '👦',
      category: '🎲 Brettspiel-Nachmittag',
      desc: 'Siedler von Catan mit Freunden spielen',
      cost: 'Kostenlos',
      status: 'Genehmigt',
      dateAdded: 'Heute'
    }
  ],

  // Wish Matches with Friend Families
  wishMatches: [
    {
      id: 'match-1',
      wishCategory: '🏊 Schwimmbad',
      ourChild: 'Nick (Familie Müller)',
      friendChild: 'Jonas (Familie Weber)',
      recommendation: 'Jonas hat gestern auch "Schwimmbad" gewünscht. Wollt ihr Samstag zusammen gehen?'
    }
  ],

  // Calendar Events & Carpooling & Optional Costs
  calendarEvents: [
    {
      id: 'evt-1',
      title: '⚽ Fußball-Punktspiel',
      forMember: 'Nick',
      time: 'Samstag, 10:00 - 12:00 Uhr',
      location: 'Sportpark Ost',
      cost: 'Kostenlos',
      parentPresent: 'Mit Eltern-Begleitung (Tom & Sarah)',
      carpool: '🚗 Hin: Tom (Papa) / 🚗 Rück: Fam. Weber',
      source: 'Local',
      status: 'Bestätigt'
    },
    {
      id: 'evt-gcal-1',
      title: '🏫 Schulfest & Flohmarkt (Google Calendar)',
      forMember: 'Familie',
      time: 'Freitag, 14:00 - 17:00 Uhr',
      location: 'Grundschule Goethestraße',
      cost: 'Kostenlos',
      parentPresent: 'Mit Eltern-Begleitung',
      carpool: '🚗 Keine Fahrt nötig',
      source: 'Google',
      status: 'Google Sync 🔄'
    },
    {
      id: 'evt-2',
      title: '🎂 Geburtstagsparty von Emma',
      forMember: 'Maya',
      time: 'Sonntag, 14:30 - 18:00 Uhr',
      location: 'Familie Weber Zuhause',
      cost: 'Geschenk ~15 €',
      parentPresent: 'Ohne Eltern',
      carpool: '🚗 Hin: Tom (Papa) / 🚗 Rück: Sarah (Mama)',
      source: 'Local',
      status: 'Bestätigt'
    }
  ],

  // Connected Families
  connectedFamilies: [
    {
      id: 'fam-weber',
      name: 'Familie Weber',
      members: 'Julia & Marc (Eltern), Jonas (11 J.), Emma (7 J.)',
      status: 'Verknüpft ✅',
      avatar: '🏡'
    },
    {
      id: 'fam-fischer',
      name: 'Familie Fischer',
      members: 'Lars (Vater), Ben (10 J.)',
      status: 'Verknüpft ✅',
      avatar: '🏡'
    }
  ]
};

// --- Supabase Cloud & Live Sync Engine ---
const supabase = window.supabaseClient;
let currentFamilyId = null;

const state = Object.assign({}, defaultState);

async function initSupabase() {
  if (!supabase) return;
  
  // Check for Child PIN Session first
  const childSession = localStorage.getItem('familyplaner_child_session');
  if (childSession) {
    const data = JSON.parse(childSession);
    currentFamilyId = data.familyId;
    state.activeProfile = 'child_independent'; // Simulate active child
    
    // Hide Auth Overlay
    document.getElementById('auth-overlay').style.display = 'none';
    
    // Fetch data and subscribe
    await fetchCloudData();
    setupRealtimeSubscriptions();
    return;
  }

  // Check for active parent session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // Show Auth Overlay
    document.getElementById('auth-overlay').style.display = 'flex';
    return;
  }
  
  // Hide Auth Overlay if logged in
  document.getElementById('auth-overlay').style.display = 'none';

  // 1. Get current user profile and family
  const { data: userProfile } = await supabase.from('users').select('*').eq('auth_id', session.user.id).single();
  
  if (userProfile) {
    currentFamilyId = userProfile.family_id;
    // Set active profile based on logged-in user
    state.activeProfile = userProfile.id; // Switch active profile to real user ID
    
    // Check if they are admin
    if (userProfile.is_admin) {
       console.log("Logged in as Family Admin");
    }
  } else {
    // Fallback if no user profile is found but auth exists
    console.warn("User profile not linked. Proceeding with default logic.");
    let { data: families } = await supabase.from('families').select('*').eq('invite_code', 'MUELLER-2026-FP').limit(1);
    if (!families || families.length === 0) {
      const { data: newFam } = await supabase.from('families').insert([{ name: 'Familie Müller', invite_code: 'MUELLER-2026-FP' }]).select();
      if (newFam) currentFamilyId = newFam[0].id;
    } else {
      currentFamilyId = families[0].id;
    }
  }

  // 2. Fetch Initial Data
  if (currentFamilyId) {
    await fetchCloudData();
    // 3. Subscribe to Realtime changes
    setupRealtimeSubscriptions();
  }
}

async function fetchCloudData() {
  const [adhocRes, wishesRes, hobbiesRes] = await Promise.all([
    supabase.from('ad_hoc_requests').select('*').eq('family_id', currentFamilyId).order('created_at', { ascending: false }),
    supabase.from('wishes').select('*').eq('family_id', currentFamilyId).order('created_at', { ascending: false }),
    supabase.from('recurring_hobbies').select('*').eq('family_id', currentFamilyId).order('created_at', { ascending: false })
  ]);
  
  if (adhocRes.data && adhocRes.data.length > 0) state.adHocRequests = adhocRes.data.map(mapAdHocFromDB);
  if (wishesRes.data && wishesRes.data.length > 0) state.wishes = wishesRes.data.map(mapWishFromDB);
  if (hobbiesRes.data && hobbiesRes.data.length > 0) state.recurringHobbies = hobbiesRes.data.map(mapHobbyFromDB);
  
  renderApp();
}

function setupRealtimeSubscriptions() {
  supabase.channel('public:family_planer')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'ad_hoc_requests' }, payload => {
      fetchCloudData();
      showToast('⚡ Live-Sync: Neue Spontan-Anfrage empfangen!');
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'wishes' }, payload => {
      fetchCloudData();
      showToast('⚡ Live-Sync: Wunschliste aktualisiert!');
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'recurring_hobbies' }, payload => {
      fetchCloudData();
    })
    .subscribe();
}

// Mapper functions (DB schema to UI format)
function mapAdHocFromDB(dbRow) {
  return {
    id: dbRow.id,
    creator: dbRow.creator_name,
    avatar: dbRow.creator_name.includes('Maya') ? '👧' : '👦',
    activity: dbRow.activity,
    time: dbRow.scheduled_time,
    location: dbRow.location,
    targetAudience: dbRow.target_audience,
    cost: dbRow.cost,
    parentPresent: dbRow.parent_present,
    status: dbRow.status === 'active' ? 'Aktiv' : (dbRow.status === 'cancelled' ? 'Storniert' : 'Beendet'),
    rsvps: [] // Simplified for MVP
  };
}

function mapWishFromDB(dbRow) {
  return {
    id: dbRow.id,
    child: dbRow.child_name,
    avatar: dbRow.child_name.includes('Maya') ? '👧' : '👦',
    category: dbRow.category,
    desc: dbRow.description,
    cost: dbRow.cost,
    status: dbRow.status === 'approved' ? 'Genehmigt' : (dbRow.status === 'declined' ? 'Abgelehnt' : 'Ausstehend'),
    dateAdded: 'Zuletzt aktualisiert'
  };
}

function mapHobbyFromDB(dbRow) {
  return {
    id: dbRow.id,
    child: dbRow.child_name,
    avatar: dbRow.child_name.includes('Maya') ? '👧' : '👦',
    title: dbRow.title,
    schedule: dbRow.schedule,
    location: dbRow.location,
    bringDriver: dbRow.bring_driver,
    getDriver: dbRow.get_driver,
    parentPresent: dbRow.parent_present,
    status: dbRow.status
  };
}

// Backwards compatibility dummy for local UI toggles (like changing profiles)
function saveState() {}

// Theme Switcher Handler
function setAppTheme(themeMode) {
  document.body.classList.remove('theme-light', 'theme-dark');
  document.querySelectorAll('#theme-btn-light, #theme-btn-dark, #theme-btn-auto').forEach(btn => btn.classList.remove('active'));

  if (themeMode === 'light') {
    document.body.classList.add('theme-light');
    const btn = document.getElementById('theme-btn-light');
    if (btn) btn.classList.add('active');
  } else if (themeMode === 'dark') {
    document.body.classList.add('theme-dark');
    const btn = document.getElementById('theme-btn-dark');
    if (btn) btn.classList.add('active');
  } else {
    const btn = document.getElementById('theme-btn-auto');
    if (btn) btn.classList.add('active');
  }

  localStorage.setItem('familyplaner_theme', themeMode);
}

// Restore saved theme on startup
const savedTheme = localStorage.getItem('familyplaner_theme') || 'auto';
setTimeout(() => setAppTheme(savedTheme), 100);

// --- DOM Initialization & Render ---
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
  renderApp();
  
  setTimeout(() => {
    showToast('✨ Wilkommen bei FamilyPlaner! Jonas (Fam. Weber) möchte auch schwimmen gehen!');
  }, 1500);
});

// Main Render Dispatcher
function renderApp() {
  renderHeaderAndProfile();
  renderDashboard();
  renderAdHocList();
  renderWishesList();
  renderRecurringHobbies();
  renderCalendarEvents();
  renderOwnFamilyMembers();
  renderPermissions();
  renderConnectedFamilies();
  populateDropdowns();
}

// Render Header & Profile Badge
function renderHeaderAndProfile() {
  const curMember = state.members.find(m => m.id === state.activeProfile) || state.members[0];
  document.getElementById('active-avatar').textContent = curMember.avatar;
  document.getElementById('active-profile-name').textContent = curMember.name;
  document.getElementById('active-profile-role').textContent = curMember.isParent ? 'Eltern-Modus' : (curMember.hasOwnDevice ? 'Eigener Account' : 'Verwaltet');

  // Banner text
  const banner = document.getElementById('mode-banner');
  const bannerTitle = document.getElementById('mode-banner-title');
  const bannerSub = document.getElementById('mode-banner-sub');

  if (curMember.isParent) {
    banner.className = 'mode-banner';
    bannerTitle.textContent = '🛡️ Eltern-Supervision aktiv';
    bannerSub.textContent = 'Du siehst alle Familienaktivitäten, Wunsch-Freigaben, Spontan-Veto & Live-Sync.';
  } else {
    banner.className = 'mode-banner child-mode';
    bannerTitle.textContent = `${curMember.avatar} Kind-Modus (${curMember.name})`;
    bannerSub.textContent = 'Erstelle Spontan-Anfragen & trage deine Wünsche ein!';
  }

  // Profile Modal Options List
  const profileList = document.getElementById('profile-modal-list');
  profileList.innerHTML = state.members.map(m => `
    <div class="profile-option-card ${m.id === state.activeProfile ? 'active' : ''}" onclick="setActiveProfile('${m.id}')">
      <div class="profile-avatar large">${m.avatar}</div>
      <div class="profile-details">
        <strong>${m.name}</strong>
        <span class="role-badge ${m.isParent ? 'parent' : (m.hasOwnDevice ? 'child' : 'managed')}">
          ${m.isParent ? 'Eltern-Modus' : (m.hasOwnDevice ? 'Eigenes Handy' : 'Verwaltet')}
        </span>
        <p>${m.isParent ? 'Eltern-Freigabe, Live-Sync & Hol-/Bringdienste.' : 'Kindgerechte Sicht: Spontan-Anfragen & Wünsche.'}</p>
      </div>
      <span class="radio-check">✓</span>
    </div>
  `).join('');
}

// Populate Dynamic Dropdowns for Creating Wishes, Hobbies & AdHocs
function populateDropdowns() {
  const adhocCreator = document.getElementById('adhoc-creator-select');
  const wishChild = document.getElementById('wish-child-select');
  const hobbyChild = document.getElementById('hobby-child-select');

  if (adhocCreator) {
    adhocCreator.innerHTML = state.members.map(m => `<option value="${m.name}">${m.avatar} ${m.name}</option>`).join('') + `<option value="${state.currentFamily}">👨‍👩‍👧‍👦 Gesamte Familie</option>`;
  }

  const kids = state.members.filter(m => !m.isParent);
  const optionsHtml = kids.length > 0 ? kids.map(m => `<option value="${m.name.split(' ')[0]}">${m.avatar} ${m.name}</option>`).join('') : `<option value="Nick">👦 Nick</option>`;
  
  if (wishChild) wishChild.innerHTML = optionsHtml;
  if (hobbyChild) hobbyChild.innerHTML = optionsHtml;
}

// Render Own Family Members List (Tab 5)
function renderOwnFamilyMembers() {
  const container = document.getElementById('own-family-members-list');
  container.innerHTML = state.members.map(m => `
    <div class="list-item">
      <div class="list-item-left">
        <span class="item-avatar">${m.avatar}</span>
        <div>
          <div class="item-title">${m.name} (${m.age ? m.age + ' J.' : 'Mitglied'})</div>
          <div class="item-sub">${m.isParent ? '👨‍👩‍👦 Elternteil (Admin)' : (m.hasOwnDevice ? '📱 Eigenes Smartphone' : '👧 Verwaltetes Kinder-Profil')}</div>
        </div>
      </div>
      ${state.activeProfile === 'parent' && state.members.length > 1 ? `
        <button class="btn btn-ghost btn-sm" onclick="removeFamilyMember('${m.id}')">Entfernen</button>
      ` : ''}
    </div>
  `).join('');
}

// Add New Family Member
function handleAddMember(event) {
  event.preventDefault();
  const name = document.getElementById('member-name').value;
  const role = document.getElementById('member-role').value;
  const avatar = document.getElementById('member-avatar').value;
  const age = document.getElementById('member-age').value;

  const isParent = role === 'parent';
  const hasOwnDevice = role === 'child_independent';

  const newMember = {
    id: `mem-${Date.now()}`,
    name: name,
    role: role,
    avatar: avatar,
    age: age ? parseInt(age) : null,
    isParent: isParent,
    hasOwnDevice: hasOwnDevice,
    permissions: !isParent ? { canSendAdHocDirectly: true, requiresWishApproval: true, maxBudget: '15 €' } : null
  };

  state.members.push(newMember);
  saveState();
  closeModal('modal-add-member');
  renderApp();
  showToast(`👨‍👩‍👧‍👦 Neues Familienmitglied "${name}" hinzugefügt!`);
}

function removeFamilyMember(memberId) {
  state.members = state.members.filter(m => m.id !== memberId);
  saveState();
  renderApp();
  showToast('Mitglied entfernt.');
}

function openAddMemberModal() {
  document.getElementById('modal-add-member').classList.add('active');
}

// Render Dashboard View
function renderDashboard() {
  const curMember = state.members.find(m => m.id === state.activeProfile) || state.members[0];

  // Pending Wish Approvals (Only visible to parents)
  const approvalWidget = document.getElementById('parent-approval-widget');
  const pendingWishes = state.wishes.filter(w => w.status === 'Ausstehend');
  
  if (curMember.isParent && pendingWishes.length > 0) {
    approvalWidget.style.display = 'block';
    document.getElementById('pending-wish-count').textContent = `${pendingWishes.length} Prüfen`;
    document.getElementById('dashboard-pending-wishes').innerHTML = pendingWishes.map(w => `
      <div class="list-item">
        <div class="list-item-left">
          <span class="item-avatar">${w.avatar}</span>
          <div>
            <div class="item-title">${w.category} (für ${w.child})</div>
            <div class="item-sub">💶 Kosten: ${w.cost} • ${w.desc}</div>
          </div>
        </div>
        <div class="wish-approval-actions">
          <button class="btn-approve" onclick="approveWish('${w.id}')">Genehmigen ✅</button>
          <button class="btn-decline" onclick="declineWish('${w.id}')">Ablehnen ❌</button>
        </div>
      </div>
    `).join('');
  } else {
    approvalWidget.style.display = 'none';
  }

  // Dashboard Carpool Driver Logistics Widget (Internal & External)
  const carpoolContainer = document.getElementById('dashboard-carpool-list');
  carpoolContainer.innerHTML = state.recurringHobbies.map(h => `
    <div class="list-item">
      <div class="list-item-left">
        <span class="item-avatar">${h.avatar}</span>
        <div>
          <div class="item-title">${h.title}</div>
          <div class="item-sub">⏰ ${h.schedule}</div>
          <div class="item-sub" style="color:var(--primary); font-weight:600;">🚗 Hin: ${h.bringDriver} | 🚗 Rück: ${h.getDriver}</div>
        </div>
      </div>
      <span class="item-status-pill ${h.status.includes('offen') ? 'pending' : 'accepted'}">${h.status}</span>
    </div>
  `).join('');

  // Ad-hoc Summary List
  const adhocContainer = document.getElementById('dashboard-adhoc-list');
  document.getElementById('adhoc-count-badge').textContent = `${state.adHocRequests.length} Aktiv`;
  document.getElementById('nav-adhoc-badge').textContent = state.adHocRequests.length;

  adhocContainer.innerHTML = state.adHocRequests.map(req => `
    <div class="list-item">
      <div class="list-item-left">
        <span class="item-avatar">${req.avatar}</span>
        <div>
          <div class="item-title">${req.activity}</div>
          <div class="item-sub">📍 ${req.location} • ⏰ ${req.time}</div>
          <div style="display:flex; gap:4px; margin-top:3px; flex-wrap:wrap;">
            ${req.targetAudience ? `<span class="target-audience-pill">🎯 ${req.targetAudience}</span>` : ''}
            ${req.cost ? `<span class="cost-badge">💶 ${req.cost}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="rsvp-buttons">
        <button class="btn-rsvp yes" onclick="respondAdHoc('${req.id}', 'Dabei!')">Dabei! 👍</button>
      </div>
    </div>
  `).join('');

  // Today's Events
  const todayContainer = document.getElementById('dashboard-today-list');
  todayContainer.innerHTML = state.calendarEvents.map(evt => `
    <div class="list-item">
      <div class="list-item-left">
        <span class="item-avatar">${evt.source === 'Google' ? '🗓️' : '📅'}</span>
        <div>
          <div class="item-title">${evt.title}</div>
          <div class="item-sub">👤 ${evt.forMember} • ⏰ ${evt.time}</div>
          ${evt.cost ? `<div class="item-sub"><span class="cost-badge">💶 ${evt.cost}</span></div>` : ''}
          <div class="item-sub" style="color: var(--primary); font-weight:600;">🚗 Fahrgemeinschaft: ${evt.carpool}</div>
        </div>
      </div>
      <span class="item-status-pill accepted">${evt.status}</span>
    </div>
  `).join('');
}

// Render Ad-Hoc Section (With Target Audience & Parent Cancel Veto)
function renderAdHocList() {
  const curMember = state.members.find(m => m.id === state.activeProfile) || state.members[0];
  const container = document.getElementById('adhoc-full-list');
  
  container.innerHTML = state.adHocRequests.map(req => `
    <div class="section-card">
      <div class="card-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:24px;">${req.avatar}</span>
          <div>
            <h3>${req.activity}</h3>
            <span style="font-size:11px; color:var(--text-muted)">Erstellt von ${req.creator}</span>
          </div>
        </div>
        <span class="badge pulse">⚡ Spontan</span>
      </div>

      <div style="font-size:12px; margin: 10px 0; display:flex; flex-direction:column; gap:4px; background:var(--bg-subtle); padding:10px; border-radius:var(--radius-md);">
        <div>🎯 <strong>Empfänger / Zielgruppe:</strong> <span class="target-audience-pill">${req.targetAudience || 'Alle Familien'}</span></div>
        <div>⏰ <strong>Zeit:</strong> ${req.time}</div>
        <div>📍 <strong>Ort:</strong> ${req.location}</div>
        <div>👨‍👩‍👧 <strong>Begleitung:</strong> <span class="parent-presence-pill ${req.parentPresent.includes('Mit') ? 'with-parent' : 'without-parent'}">${req.parentPresent}</span></div>
        ${req.cost ? `<div>💶 <strong>Kosten:</strong> <span class="cost-badge">${req.cost}</span></div>` : ''}
      </div>

      <h4 style="font-size:12px; margin-bottom:6px;">Rückmeldungen von befreundeten Familien:</h4>
      <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:12px;">
        ${req.rsvps.map(r => `
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; background:white; padding:6px 10px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
            <span>${r.avatar} <strong>${r.name}</strong> (${r.family})</span>
            <span class="item-status-pill ${r.status.includes('Dabei') ? 'accepted' : 'pending'}">${r.status}</span>
          </div>
        `).join('')}
      </div>

      <div style="display:flex; gap:8px;">
        <button class="btn btn-primary full-width" onclick="respondAdHoc('${req.id}', 'Ich bin dabei!')">👍 Zusage senden</button>
        
        ${curMember.isParent ? `
          <button class="btn-cancel-adhoc" onclick="cancelAdHocByParent('${req.id}')">🚫 Stornieren (Eltern-Veto)</button>
        ` : `
          <button class="btn btn-secondary full-width" onclick="respondAdHoc('${req.id}', 'Leider keine Zeit')">❌ Absagen</button>
        `}
      </div>
    </div>
  `).join('');
}

// Parent Veto / Cancel Ad-Hoc
function cancelAdHocByParent(reqId) {
  const req = state.adHocRequests.find(r => r.id === reqId);
  if (req) {
    state.adHocRequests = state.adHocRequests.filter(r => r.id !== reqId);
    saveState();
    renderApp();
    showToast(`🚫 Spontan-Anfrage "${req.activity}" durch Eltern storniert.`);
  }
}

// Render Recurring Hobbies & Internal/External Driver Logistics
function renderRecurringHobbies() {
  const curMember = state.members.find(m => m.id === state.activeProfile) || state.members[0];
  const container = document.getElementById('recurring-hobbies-list');
  
  if (state.recurringHobbies.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-size:12px; margin:20px 0;">Keine wöchentlichen Hobbys hinterlegt.</p>';
    return;
  }
  
  container.innerHTML = state.recurringHobbies.map(h => {
    const isClickable = curMember.isParent ? `cursor:pointer; transition: transform 0.2s;` : ``;
    const onClickAttr = curMember.isParent ? `onclick="openEditHobbyModal('${h.id}')"` : ``;
    
    return `
    <div class="list-item" style="flex-direction:column; align-items:flex-start; ${isClickable}" ${onClickAttr}>
      <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
        <div class="list-item-left">
          <span class="item-avatar">${h.avatar}</span>
          <div>
            <div class="item-title">${h.title} (${h.child})</div>
            <div class="item-sub">🗓️ ${h.schedule} • 📍 ${h.location}</div>
          </div>
        </div>
        <span class="recurring-badge">Wöchentlich</span>
      </div>

      <div style="width:100%; margin-top:8px; padding-top:8px; border-top:1px dashed var(--border-color); font-size:12px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="color:var(--text-muted)">Hol- & Bringdienst (Intern / Extern):</span>
          <div style="font-weight:700; color:var(--text-main); margin-top:2px;">
            🚗 Hin: ${h.bringDriver} | 🚗 Rück: ${h.getDriver}
          </div>
          <div style="margin-top:2px;">
            <span class="parent-presence-pill ${h.parentPresent.includes('Mit') ? 'with-parent' : 'without-parent'}">${h.parentPresent}</span>
          </div>
        </div>
        ${curMember.isParent ? `
          <button class="btn btn-ghost btn-sm" onclick="showToast('🚗 Fahrgemeinschaft für ${h.title} angepasst!')">Bearbeiten</button>
        ` : ''}
      </div>
    </div>
  `).join('');
}

// Render Wishes Section with Approval Actions
function renderWishesList() {
  const curMember = state.members.find(m => m.id === state.activeProfile) || state.members[0];
  const matchesContainer = document.getElementById('wish-matches-container');
  matchesContainer.innerHTML = state.wishMatches.map(m => `
    <div class="match-card">
      <div>
        <strong style="font-size:13px; color:var(--secondary)">💡 Match: ${m.ourChild} & ${m.friendChild}</strong>
        <p style="font-size:11px; color:var(--text-muted); margin-top:2px;">Wunsch: ${m.wishCategory}</p>
      </div>
      <button class="btn btn-sm btn-primary" onclick="createMatchEvent('${m.id}')">Gemeinsamen Termin anlegen</button>
    </div>
  `).join('');

  const container = document.getElementById('wishes-full-list');
  container.innerHTML = state.wishes.map(w => {
    let statusClass = 'accepted';
    if (w.status === 'Ausstehend') statusClass = 'pending';
    if (w.status === 'Abgelehnt') statusClass = 'rejected';

    return `
      <div class="list-item">
        <div class="list-item-left">
          <span class="item-avatar">${w.avatar}</span>
          <div>
            <div class="item-title">${w.category} (für ${w.child})</div>
            <div class="item-sub">${w.desc}</div>
            ${w.cost ? `<div class="item-sub" style="margin-top:2px;"><span class="cost-badge">💶 ${w.cost}</span></div>` : ''}
          </div>
        </div>
        
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
          <span class="item-status-pill ${statusClass}">${w.status}</span>
          
          ${curMember.isParent && w.status === 'Ausstehend' ? `
            <div class="wish-approval-actions">
              <button class="btn-approve" onclick="approveWish('${w.id}')">Genehmigen ✅</button>
              <button class="btn-decline" onclick="declineWish('${w.id}')">Ablehnen ❌</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Wish Approval Handlers
function approveWish(wishId) {
  const wish = state.wishes.find(w => w.id === wishId);
  if (wish) {
    wish.status = 'Genehmigt';
    saveState();
    renderApp();
    showToast(`✅ Wunsch "${wish.category}" für ${wish.child} genehmigt!`);
  }
}

function declineWish(wishId) {
  const wish = state.wishes.find(w => w.id === wishId);
  if (wish) {
    wish.status = 'Abgelehnt';
    saveState();
    renderApp();
    showToast(`❌ Wunsch "${wish.category}" abgelehnt.`);
  }
}

// Google Calendar Trigger Simulation
function triggerGoogleSync() {
  showToast('🔄 Google Kalender wird synchronisiert...');
  setTimeout(() => {
    state.lastGoogleSync = 'Gerade eben';
    saveState();
    showToast('✅ Google Kalender erfolgreich abgeglichen! 14 Termine aktualisiert.');
    renderApp();
  }, 1200);
}

// Render Calendar & Filter
let calendarFilter = 'all';

function filterCalendar(member) {
  calendarFilter = member;
  document.querySelectorAll('#calendar-filters .pill').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.includes(member) || (member === 'all' && btn.textContent.includes('Alle')));
  });
  renderCalendarEvents();
}

function renderCalendarEvents() {
  const container = document.getElementById('calendar-event-list');
  const filtered = state.calendarEvents.filter(e => {
    if (calendarFilter === 'all') return true;
    return e.forMember.includes(calendarFilter);
  });

  container.innerHTML = filtered.map(evt => `
    <div class="section-card">
      <div class="card-header">
        <h3>${evt.title}</h3>
        <span class="badge ${evt.source === 'Google' ? '' : 'green'}">${evt.status}</span>
      </div>
      <div style="font-size:12px; color:var(--text-muted); display:flex; flex-direction:column; gap:4px; margin-bottom:8px;">
        <div>👤 <strong>Für:</strong> ${evt.forMember}</div>
        <div>⏰ <strong>Zeit:</strong> ${evt.time}</div>
        <div>📍 <strong>Ort:</strong> ${evt.location}</div>
        ${evt.parentPresent ? `<div>👨‍👩‍👧 <strong>Begleitung:</strong> <span class="parent-presence-pill ${evt.parentPresent.includes('Mit') ? 'with-parent' : 'without-parent'}">${evt.parentPresent}</span></div>` : ''}
        ${evt.cost ? `<div>💶 <strong>Kosten:</strong> <span class="cost-badge">${evt.cost}</span></div>` : ''}
      </div>
      <div style="background:var(--primary-light); color:var(--primary); font-size:12px; font-weight:700; padding:8px 12px; border-radius:var(--radius-md);">
        🚗 Fahrgemeinschaft: ${evt.carpool}
      </div>
    </div>
  `).join('');
}

// Render Kid Permissions Settings
function renderPermissions() {
  const container = document.getElementById('kid-permissions-container');
  const kids = state.members.filter(m => !m.isParent);

  if (kids.length === 0) {
    container.innerHTML = `<p style="font-size:12px; color:var(--text-muted)">Keine Kinderprofile vorhanden.</p>`;
    return;
  }

  container.innerHTML = kids.map(k => `
    <div class="permission-card">
      <div class="perm-header">
        <span style="font-size:22px;">${k.avatar}</span>
        <div>
          <strong>${k.name} (${k.age ? k.age + ' Jahre' : 'Kind'})</strong>
          <span style="font-size:10px; color:var(--text-muted); display:block;">${k.hasOwnDevice ? 'Eigenständiger Account' : 'Verwaltetes Profil'}</span>
        </div>
      </div>
      <div class="perm-options">
        <div class="perm-toggle-row">
          <span>⚡ Darf Spontan-Anfragen direkt senden</span>
          <label class="toggle-switch">
            <input type="checkbox" ${k.permissions && k.permissions.canSendAdHocDirectly ? 'checked' : ''} onchange="togglePermission('${k.id}', 'canSendAdHocDirectly')">
            <span class="slider"></span>
          </label>
        </div>
        <div class="perm-toggle-row">
          <span>✨ Wünsche benötigen Eltern-Freigabe</span>
          <label class="toggle-switch">
            <input type="checkbox" ${k.permissions && k.permissions.requiresWishApproval ? 'checked' : ''} onchange="togglePermission('${k.id}', 'requiresWishApproval')">
            <span class="slider"></span>
          </label>
        </div>
        <div class="perm-toggle-row">
          <span>💶 Max. Budget pro Wunsch: <strong>${k.permissions ? k.permissions.maxBudget : '15 €'}</strong></span>
        </div>
      </div>
    </div>
  `).join('');
}

function togglePermission(memberId, permKey) {
  const m = state.members.find(mem => mem.id === memberId);
  if (m && m.permissions) {
    m.permissions[permKey] = !m.permissions[permKey];
    saveState();
    showToast(`⚙️ Rechte für ${m.name} aktualisiert!`);
  }
}

// Render Connected Families
function renderConnectedFamilies() {
  const container = document.getElementById('friends-family-list');
  container.innerHTML = state.connectedFamilies.map(fam => `
    <div class="list-item">
      <div class="list-item-left">
        <span class="item-avatar">${fam.avatar}</span>
        <div>
          <div class="item-title">${fam.name}</div>
          <div class="item-sub">👥 ${fam.members}</div>
        </div>
      </div>
      <span class="item-status-pill accepted">${fam.status}</span>
    </div>
  `).join('');
}

// --- Navigation & Tab Switcher ---
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  const navBtn = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
  if (navBtn) navBtn.classList.add('active');
}

// --- Profile / Role Switcher ---
function toggleProfileModal() {
  const modal = document.getElementById('modal-profile');
  modal.classList.toggle('active');
}

function setActiveProfile(roleKey) {
  state.activeProfile = roleKey;
  saveState();
  closeModal('modal-profile');
  renderApp();
  const curMember = state.members.find(m => m.id === roleKey) || state.members[0];
  showToast(`👤 Rolle gewechselt zu: ${curMember.name}`);
}

// --- Modal Handlers ---
function openAdHocModal() {
  document.getElementById('modal-adhoc').classList.add('active');
}

function openWishModal() {
  document.getElementById('modal-wish').classList.add('active');
}

function openHobbyModal() {
  document.getElementById('modal-hobby').classList.add('active');
}

function showConnectModal() {
  document.getElementById('modal-connect').classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// --- Edit Recurring Hobby (Fahrgemeinschaft) ---
function openEditHobbyModal(id) {
  const hobby = state.recurringHobbies.find(h => h.id === id);
  if (!hobby) return;
  
  document.getElementById('edit-hobby-id').value = hobby.id;
  
  // Populate options dynamically based on family members
  const memberOptions = state.members.map(m => `<option value="${m.name}">${m.name}</option>`).join('');
  const allOptions = `
    <option value="Offen (Wer fährt?)">⚠️ Offen (Wer fährt?)</option>
    <optgroup label="Unsere Familie">
      ${memberOptions}
    </optgroup>
    <optgroup label="Verknüpfte Familien">
      ${state.connectedFamilies.map(f => `<option value="${f.name}">${f.name}</option>`).join('')}
    </optgroup>
  `;
  
  document.getElementById('edit-hobby-bring').innerHTML = allOptions;
  document.getElementById('edit-hobby-get').innerHTML = allOptions;
  
  // Set existing values if possible
  document.getElementById('edit-hobby-bring').value = hobby.bringDriver;
  document.getElementById('edit-hobby-get').value = hobby.getDriver;

  document.getElementById('modal-edit-hobby').classList.add('active');
}

async function handleUpdateHobby(event) {
  event.preventDefault();
  const id = document.getElementById('edit-hobby-id').value;
  const bring = document.getElementById('edit-hobby-bring').value;
  const get = document.getElementById('edit-hobby-get').value;
  const newStatus = (bring.includes('Offen') || get.includes('Offen')) ? 'Fahrt offen ⚠️' : 'Fahrten geregelt ✅';

  if (currentFamilyId) {
    await supabase.from('recurring_hobbies')
      .update({ bring_driver: bring, get_driver: get, status: newStatus })
      .eq('id', id);
  }

  closeModal('modal-edit-hobby');
  showToast('Fahrgemeinschaft wurde aktualisiert!');
}

// --- Hobby Creation ---
async function handleCreateHobby(event) {
  event.preventDefault();
  const child = document.getElementById('hobby-child-select').value;
  const title = document.getElementById('hobby-title').value;
  const time = document.getElementById('hobby-time').value;
  const location = document.getElementById('hobby-location').value;
  const bring = document.getElementById('hobby-bring').value;
  const get = document.getElementById('hobby-get').value;
  const parentPresent = document.getElementById('hobby-parent-present').value;

  if (currentFamilyId) {
    await supabase.from('recurring_hobbies').insert([{
      family_id: currentFamilyId,
      child_name: child,
      title: title,
      schedule: time,
      location: location,
      bring_driver: bring,
      get_driver: get,
      parent_present: parentPresent,
      status: (bring.includes('Offen') || get.includes('Offen')) ? 'Fahrt offen ⚠️' : 'Fahrten geregelt ✅'
    }]);
  }

  closeModal('modal-hobby');
  // UI updates automatically via Realtime WebSockets subscription
  showToast(`🏆 Wöchentliches Hobby "${title}" gespeichert!`);
}

// --- Ad-Hoc Creation & Response ---
async function handleCreateAdHoc(event) {
  event.preventDefault();
  const creator = document.getElementById('adhoc-creator-select').value;
  const activity = document.getElementById('adhoc-activity').value;
  const time = document.getElementById('adhoc-time').value;
  const location = document.getElementById('adhoc-location').value;
  const targetAudience = document.getElementById('adhoc-target-audience').value;
  const cost = document.getElementById('adhoc-cost').value;
  const parentPresent = document.getElementById('adhoc-parent-present').value;

  if (currentFamilyId) {
    await supabase.from('ad_hoc_requests').insert([{
      family_id: currentFamilyId,
      creator_name: creator,
      activity: `⚡ ${activity}`,
      scheduled_time: time,
      location: location,
      target_audience: targetAudience,
      cost: cost || null,
      parent_present: parentPresent,
      status: 'active'
    }]);
  }

  closeModal('modal-adhoc');
  showToast(`⚡ Spontan-Anfrage an ${targetAudience} gesendet!`);
}

function respondAdHoc(reqId, answerText) {
  const req = state.adHocRequests.find(r => r.id === reqId);
  const curMember = state.members.find(m => m.id === state.activeProfile) || state.members[0];

  if (req) {
    req.rsvps.push({
      family: state.currentFamily,
      name: curMember.name,
      status: `${answerText} ✅`,
      avatar: curMember.avatar
    });
    saveState();
    renderApp();
    showToast(`Rückmeldung "${answerText}" gesendet!`);
  }
}

// --- Wish Creation ---
async function handleCreateWish(event) {
  event.preventDefault();
  const child = document.getElementById('wish-child-select').value;
  const category = document.getElementById('wish-category').value;
  const desc = document.getElementById('wish-desc').value;
  const cost = document.getElementById('wish-cost').value;
  const curMember = state.members.find(m => m.id === state.activeProfile) || state.members[0];

  const status = curMember.isParent ? 'approved' : 'pending';

  if (currentFamilyId) {
    await supabase.from('wishes').insert([{
      family_id: currentFamilyId,
      child_name: child,
      category: category,
      description: desc || 'Keine Zusatzbeschreibung',
      cost: cost || 'Kostenlos',
      status: status
    }]);
  }

  closeModal('modal-wish');

  if (status === 'pending') {
    showToast(`✨ Wunsch "${category}" eingetragen! Wartet auf Eltern-Freigabe.`);
  } else {
    showToast(`✨ Wunsch "${category}" eingetragen und genehmigt!`);
  }
}

// Match Event Creation
function createMatchEvent(matchId) {
  const match = state.wishMatches.find(m => m.id === matchId);
  if (match) {
    state.calendarEvents.unshift({
      id: `evt-${Date.now()}`,
      title: `${match.wishCategory} mit Fam. Weber`,
      forMember: 'Nick & Jonas',
      time: 'Samstag Nachmittag',
      location: 'Wasserwelt Stadt',
      cost: '12 € / Person',
      parentPresent: 'Mit Eltern-Begleitung (Tom)',
      carpool: '🚗 Hin: Tom (Papa) / 🚗 Rück: Fam. Weber',
      source: 'Local',
      status: 'Bestätigt'
    });
    saveState();
    showToast(`🎉 Gemeinsamer Termin im Kalender angelegt!`);
    switchTab('tab-calendar');
    renderApp();
  }
}

// Connect Family Handlers
function copyInviteCode() {
  showToast(`📋 Einladungscode "MUELLER-2026-FP" in Zwischenablage kopiert!`);
}

function handleConnectFamily() {
  const code = document.getElementById('connect-code-input').value;
  if (!code) return;
  
  state.connectedFamilies.push({
    id: `fam-${Date.now()}`,
    name: `Familie ${code.split('-')[0] || 'Schneider'}`,
    members: 'Eltern & Kinder',
    status: 'Verknüpft ✅',
    avatar: '🏡'
  });
  
  saveState();
  closeModal('modal-connect');
  renderApp();
  showToast(`🤝 Familie erfolgreich verknüpft!`);
}

// --- Toast System ---
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span>${message}</span>
    <span style="font-size:10px; opacity:0.7">jetzt</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --- Authentication & Session Handlers ---
let isRegisterMode = false;
let familyMode = 'create'; // 'create' or 'join'

function setAuthMode(mode) {
  isRegisterMode = (mode === 'register');
  
  document.getElementById('tab-login').className = isRegisterMode ? 'btn btn-ghost full-width' : 'btn btn-primary full-width';
  document.getElementById('tab-register').className = isRegisterMode ? 'btn btn-primary full-width' : 'btn btn-ghost full-width';
  
  document.getElementById('auth-register-fields').style.display = isRegisterMode ? 'flex' : 'none';
  document.getElementById('auth-submit-btn').textContent = isRegisterMode ? 'Registrieren & Weiter' : 'Einloggen';
}

function toggleFamilyMode() {
  const modes = document.getElementsByName('family_mode');
  for (let m of modes) {
    if (m.checked) familyMode = m.value;
  }
  
  if (familyMode === 'create') {
    document.getElementById('auth-group-family-create').style.display = 'block';
    document.getElementById('auth-group-family-join').style.display = 'none';
  } else {
    document.getElementById('auth-group-family-create').style.display = 'none';
    document.getElementById('auth-group-family-join').style.display = 'block';
  }
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  const submitBtn = document.getElementById('auth-submit-btn');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Lädt...';

  try {
    if (isRegisterMode) {
      const name = document.getElementById('auth-name').value || 'Elternteil';
      
      // 1. Sign up in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;

      let famId = null;
      let isAdmin = false;

      if (familyMode === 'create') {
        const familyName = document.getElementById('auth-family-name').value || 'Meine Familie';
        const inviteCode = familyName.substring(0, 3).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
        
        const { data: familyData, error: famError } = await supabase.from('families').insert([{ name: familyName, invite_code: inviteCode }]).select().single();
        if (famError) throw famError;
        
        famId = familyData.id;
        isAdmin = true; // Creator is admin
      } else {
        const inviteCode = document.getElementById('auth-invite-code').value.trim();
        const { data: existingFam, error: findFamError } = await supabase.from('families').select('*').eq('invite_code', inviteCode).single();
        
        if (findFamError || !existingFam) {
          throw new Error('Familie mit diesem Einladungs-Code nicht gefunden!');
        }
        
        famId = existingFam.id;
        isAdmin = false; // Joiner is not admin
      }

      // 3. Create User Profile linked to auth_id
      await supabase.from('users').insert([{
        auth_id: authData.user.id,
        family_id: famId,
        email: email,
        name: name,
        role: 'parent',
        is_parent: true,
        is_admin: isAdmin
      }]);

      showToast('Registrierung erfolgreich!');
    } else {
      // Login Mode
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showToast('Erfolgreich eingeloggt!');
    }

    initSupabase();
  } catch (error) {
    alert('Fehler: ' + error.message);
    submitBtn.disabled = false;
    submitBtn.textContent = isRegisterMode ? 'Registrieren & Weiter' : 'Einloggen';
  }
}

// --- Child PIN Login ---
function openChildLogin() {
  document.getElementById('modal-child-login').classList.add('active');
}

async function handleChildLogin(event) {
  event.preventDefault();
  const inviteCode = document.getElementById('child-invite-code').value.trim();
  const name = document.getElementById('child-name').value.trim();
  const pin = document.getElementById('child-pin').value.trim();
  
  if (pin !== '1234') { // MVP Simplified PIN Check for demo
    alert('Falsche PIN. Für die Demo bitte "1234" verwenden.');
    return;
  }
  
  try {
    const { data: family, error } = await supabase.from('families').select('id, name').eq('invite_code', inviteCode).single();
    if (error || !family) {
      alert('Familie nicht gefunden. Einladungs-Code überprüfen!');
      return;
    }
    
    // Store localized child session
    localStorage.setItem('familyplaner_child_session', JSON.stringify({
      familyId: family.id,
      familyName: family.name,
      childName: name
    }));
    
    closeModal('modal-child-login');
    window.location.reload(); // Reload to trigger initSupabase and load child view
  } catch (err) {
    console.error(err);
  }
}

async function logout() {
  localStorage.removeItem('familyplaner_child_session');
  await supabase.auth.signOut();
  window.location.reload();
}
