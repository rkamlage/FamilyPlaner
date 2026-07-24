/* ==========================================================================
   FAMILYPLANER - INTERACTIVE LOGIC & STATE MANAGEMENT
   ========================================================================== */

// --- Application State ---
const state = {
  // Profiles in current household
  activeProfile: 'parent', // 'parent' | 'child_independent' | 'child_managed'
  currentFamily: 'Familie Müller',
  
  profiles: {
    parent: {
      id: 'p1',
      name: 'Tom (Vater)',
      role: 'Eltern-Modus',
      avatar: '👨',
      isParent: true,
      canApprove: true
    },
    child_independent: {
      id: 'c1',
      name: 'Nick (11 J.)',
      role: 'Eigenes Handy',
      avatar: '👦',
      isParent: false,
      hasOwnDevice: true,
      permissions: {
        canSendAdHocDirectly: true,
        requiresWishApproval: true,
        maxBudget: '15 €'
      }
    },
    child_managed: {
      id: 'c2',
      name: 'Maya (7 J.)',
      role: 'Verwaltet',
      avatar: '👧',
      isParent: false,
      hasOwnDevice: false,
      permissions: {
        canSendAdHocDirectly: false,
        requiresWishApproval: true,
        maxBudget: '10 €'
      }
    }
  },

  // Ad-Hoc Requests ("Wer hat JETZT Lust?")
  adHocRequests: [
    {
      id: 'adhoc-1',
      creator: 'Nick (11 J.)',
      avatar: '👦',
      activity: '⚽ Fußball spielen & Bolzen',
      time: 'Heute 15:00 Uhr',
      location: 'Bolzplatz Parkstraße',
      cost: 'Kostenlos',
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
      cost: 'ca. 4 € / Kind',
      status: 'Aktiv',
      rsvps: [
        { family: 'Familie Weber', name: 'Emma', status: 'Ab 17 Uhr dabei!', avatar: '👧' }
      ]
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
      carpool: '🚗 Hin: Fam. Müller / 🚗 Rück: Fam. Weber',
      status: 'Bestätigt'
    },
    {
      id: 'evt-2',
      title: '🎂 Geburtstagsparty von Emma',
      forMember: 'Maya',
      time: 'Sonntag, 14:30 - 18:00 Uhr',
      location: 'Familie Weber Zuhause',
      cost: 'Geschenk ~15 €',
      carpool: '🚗 Bringt & holt Fam. Müller',
      status: 'Bestätigt'
    },
    {
      id: 'evt-3',
      title: '🏊 Gemeinsamer Schwimmbad-Ausflug',
      forMember: 'Nick & Maya',
      time: 'Nächsten Mittwoch, 15:00 Uhr',
      location: 'Hallenbad Stadtmitte',
      cost: '12 € / Person',
      carpool: '🚗 Offen (Wer kann fahren?)',
      status: 'Geplant (Wish Match)'
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

// --- DOM Initialization & Render ---
document.addEventListener('DOMContentLoaded', () => {
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
  renderCalendarEvents();
  renderPermissions();
  renderConnectedFamilies();
}

// Render Header & Profile Badge
function renderHeaderAndProfile() {
  const cur = state.profiles[state.activeProfile];
  document.getElementById('active-avatar').textContent = cur.avatar;
  document.getElementById('active-profile-name').textContent = cur.name;
  document.getElementById('active-profile-role').textContent = cur.role;

  // Banner text
  const banner = document.getElementById('mode-banner');
  const bannerTitle = document.getElementById('mode-banner-title');
  const bannerSub = document.getElementById('mode-banner-sub');

  if (state.activeProfile === 'parent') {
    banner.className = 'mode-banner';
    bannerTitle.textContent = '🛡️ Eltern-Supervision aktiv';
    bannerSub.textContent = 'Du siehst alle Familienaktivitäten, Anfragen, Wunsch-Freigaben & Kosten.';
  } else if (state.activeProfile === 'child_independent') {
    banner.className = 'mode-banner child-mode';
    bannerTitle.textContent = '👦 Nicks Kind-Modus (Eigenes Handy)';
    bannerSub.textContent = 'Erstelle Spontan-Anfragen & trage deine Wünsche ein!';
  } else {
    banner.className = 'mode-banner child-mode';
    bannerTitle.textContent = '👧 Mayas Profil (Verwaltet von Eltern)';
    bannerSub.textContent = 'Eltern verwalten Anfragen und Wünsche für Maya.';
  }

  // Update active modal option
  document.querySelectorAll('.profile-option-card').forEach((card, idx) => {
    const keys = ['parent', 'child_independent', 'child_managed'];
    if (keys[idx] === state.activeProfile) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

// Render Dashboard View
function renderDashboard() {
  // Pending Wish Approvals (Only visible to parents)
  const approvalWidget = document.getElementById('parent-approval-widget');
  const pendingWishes = state.wishes.filter(w => w.status === 'Ausstehend');
  
  if (state.activeProfile === 'parent' && pendingWishes.length > 0) {
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
          ${req.cost ? `<span class="cost-badge">💶 ${req.cost}</span>` : ''}
        </div>
      </div>
      <div class="rsvp-buttons">
        <button class="btn-rsvp yes" onclick="respondAdHoc('${req.id}', 'Dabei!')">Dabei! 👍</button>
      </div>
    </div>
  `).join('');

  // Wish Matches
  const wishMatchContainer = document.getElementById('dashboard-wish-matches');
  wishMatchContainer.innerHTML = state.wishMatches.map(m => `
    <div class="match-card">
      <div>
        <strong style="font-size:13px; color: var(--secondary)">🎯 ${m.wishCategory}</strong>
        <p style="font-size:11px; color: var(--text-muted); margin-top:2px;">${m.recommendation}</p>
      </div>
      <button class="btn btn-sm btn-primary" onclick="createMatchEvent('${m.id}')">Termin ausmachen</button>
    </div>
  `).join('');

  // Today's Events
  const todayContainer = document.getElementById('dashboard-today-list');
  todayContainer.innerHTML = state.calendarEvents.map(evt => `
    <div class="list-item">
      <div class="list-item-left">
        <span class="item-avatar">📅</span>
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

// Render Ad-Hoc Section
function renderAdHocList() {
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
        <div>⏰ <strong>Zeit:</strong> ${req.time}</div>
        <div>📍 <strong>Ort:</strong> ${req.location}</div>
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
        <button class="btn btn-secondary full-width" onclick="respondAdHoc('${req.id}', 'Leider keine Zeit')">❌ Absagen</button>
      </div>
    </div>
  `).join('');
}

// Render Wishes Section with Approval Actions
function renderWishesList() {
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
          
          ${state.activeProfile === 'parent' && w.status === 'Ausstehend' ? `
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
    renderApp();
    showToast(`✅ Wunsch "${wish.category}" für ${wish.child} genehmigt!`);
  }
}

function declineWish(wishId) {
  const wish = state.wishes.find(w => w.id === wishId);
  if (wish) {
    wish.status = 'Abgelehnt';
    renderApp();
    showToast(`❌ Wunsch "${wish.category}" abgelehnt.`);
  }
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
        <span class="badge green">${evt.status}</span>
      </div>
      <div style="font-size:12px; color:var(--text-muted); display:flex; flex-direction:column; gap:4px; margin-bottom:8px;">
        <div>👤 <strong>Für:</strong> ${evt.forMember}</div>
        <div>⏰ <strong>Zeit:</strong> ${evt.time}</div>
        <div>📍 <strong>Ort:</strong> ${evt.location}</div>
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
  const nick = state.profiles.child_independent;
  const maya = state.profiles.child_managed;

  container.innerHTML = `
    <div class="permission-card">
      <div class="perm-header">
        <span style="font-size:22px;">👦</span>
        <div>
          <strong>Nick (11 Jahre - Eigenes Handy)</strong>
          <span style="font-size:10px; color:var(--text-muted); display:block;">Eigenständiger Account</span>
        </div>
      </div>
      <div class="perm-options">
        <div class="perm-toggle-row">
          <span>⚡ Darf Spontan-Anfragen direkt senden</span>
          <label class="toggle-switch">
            <input type="checkbox" ${nick.permissions.canSendAdHocDirectly ? 'checked' : ''} onchange="togglePermission('child_independent', 'canSendAdHocDirectly')">
            <span class="slider"></span>
          </label>
        </div>
        <div class="perm-toggle-row">
          <span>✨ Wünsche benötigen Eltern-Freigabe</span>
          <label class="toggle-switch">
            <input type="checkbox" ${nick.permissions.requiresWishApproval ? 'checked' : ''} onchange="togglePermission('child_independent', 'requiresWishApproval')">
            <span class="slider"></span>
          </label>
        </div>
        <div class="perm-toggle-row">
          <span>💶 Max. Budget pro Wunsch: <strong>${nick.permissions.maxBudget}</strong></span>
        </div>
      </div>
    </div>

    <div class="permission-card">
      <div class="perm-header">
        <span style="font-size:22px;">👧</span>
        <div>
          <strong>Maya (7 Jahre - Verwaltetes Profil)</strong>
          <span style="font-size:10px; color:var(--text-muted); display:block;">Profil wird von Eltern gesteuert</span>
        </div>
      </div>
      <div class="perm-options">
        <div class="perm-toggle-row">
          <span>⚡ Darf Spontan-Anfragen direkt senden</span>
          <label class="toggle-switch">
            <input type="checkbox" ${maya.permissions.canSendAdHocDirectly ? 'checked' : ''} onchange="togglePermission('child_managed', 'canSendAdHocDirectly')">
            <span class="slider"></span>
          </label>
        </div>
        <div class="perm-toggle-row">
          <span>✨ Wünsche benötigen Eltern-Freigabe</span>
          <label class="toggle-switch">
            <input type="checkbox" ${maya.permissions.requiresWishApproval ? 'checked' : ''} onchange="togglePermission('child_managed', 'requiresWishApproval')">
            <span class="slider"></span>
          </label>
        </div>
        <div class="perm-toggle-row">
          <span>💶 Max. Budget pro Wunsch: <strong>${maya.permissions.maxBudget}</strong></span>
        </div>
      </div>
    </div>
  `;
}

function togglePermission(profileKey, permKey) {
  const p = state.profiles[profileKey].permissions;
  p[permKey] = !p[permKey];
  showToast(`⚙️ Rechte für ${state.profiles[profileKey].name} aktualisiert!`);
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
  closeModal('modal-profile');
  renderApp();
  const name = state.profiles[roleKey].name;
  showToast(`👤 Rolle gewechselt zu: ${name}`);
}

// --- Modal Handlers ---
function openAdHocModal() {
  document.getElementById('modal-adhoc').classList.add('active');
}

function openWishModal() {
  document.getElementById('modal-wish').classList.add('active');
}

function showConnectModal() {
  document.getElementById('modal-connect').classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// --- Ad-Hoc Creation & Response ---
function handleCreateAdHoc(event) {
  event.preventDefault();
  const creator = document.getElementById('adhoc-creator-select').value;
  const activity = document.getElementById('adhoc-activity').value;
  const time = document.getElementById('adhoc-time').value;
  const location = document.getElementById('adhoc-location').value;
  const cost = document.getElementById('adhoc-cost').value;

  const newReq = {
    id: `adhoc-${Date.now()}`,
    creator: creator,
    avatar: creator.includes('Nick') ? '👦' : (creator.includes('Maya') ? '👧' : '👨‍👩‍👧‍👦'),
    activity: `⚡ ${activity}`,
    time: time,
    location: location,
    cost: cost || null,
    status: 'Aktiv',
    rsvps: [
      { family: 'Familie Weber', name: 'Jonas', status: 'Angefragt 📩', avatar: '👦' }
    ]
  };

  state.adHocRequests.unshift(newReq);
  closeModal('modal-adhoc');
  renderApp();
  showToast(`⚡ Spontan-Anfrage an befreundete Familien gesendet!`);
}

function respondAdHoc(reqId, answerText) {
  const req = state.adHocRequests.find(r => r.id === reqId);
  if (req) {
    req.rsvps.push({
      family: 'Familie Müller',
      name: state.profiles[state.activeProfile].name,
      status: `${answerText} ✅`,
      avatar: state.profiles[state.activeProfile].avatar
    });
    renderApp();
    showToast(`Rückmeldung "${answerText}" gesendet!`);
  }
}

// --- Wish Creation ---
function handleCreateWish(event) {
  event.preventDefault();
  const child = document.getElementById('wish-child-select').value;
  const category = document.getElementById('wish-category').value;
  const desc = document.getElementById('wish-desc').value;
  const cost = document.getElementById('wish-cost').value;

  const newWish = {
    id: `wish-${Date.now()}`,
    child: child,
    avatar: child === 'Nick' ? '👦' : '👧',
    category: category,
    desc: desc || 'Keine Zusatzbeschreibung',
    cost: cost || 'Kostenlos',
    status: state.activeProfile === 'parent' ? 'Genehmigt' : 'Ausstehend',
    dateAdded: 'Gerade eben'
  };

  state.wishes.unshift(newWish);
  closeModal('modal-wish');
  renderApp();

  if (newWish.status === 'Ausstehend') {
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
      carpool: '🚗 Fam. Müller fährt hin / Fam. Weber holt ab',
      status: 'Bestätigt'
    });
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
