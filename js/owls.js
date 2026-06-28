// ============================================================
// Owls Auth — Firebase Authentication & Profile Management
// ============================================================

// Nav button inner HTML for the two states
const WILDLIFE_NAV_IDS = [
    'nav-wildlife', 'wildlife-nav-wildlife', 'map-nav-wildlife',
    'activities-nav-wildlife', 'owls-nav-wildlife', 'events-nav-wildlife',
];

const WILDLIFE_BTN_HTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.5S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg><span>Wildlife</span>`;

const TASKS_BTN_HTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg><span>Tasks</span>`;

const firebaseConfig = {
    apiKey: "AIzaSyA7pGNhM6aX96v5A34EFZnV4UnV6056jGE",
    authDomain: "vlt-owls.firebaseapp.com",
    projectId: "vlt-owls",
    storageBucket: "vlt-owls.firebasestorage.app",
    messagingSenderId: "259071768718",
    appId: "1:259071768718:web:7c2d7c6afa79dd6e97b1df",
};

// ── Cloudinary (free unsigned uploads) ──────────────────────────
// Unsigned preset only — no API key/secret here (this file is public).
const CLOUDINARY_CLOUD_NAME    = 'dgxm7tzpd';
const CLOUDINARY_UPLOAD_PRESET = 'nqubozdj';

firebase.initializeApp(firebaseConfig);
const auth    = firebase.auth();
const db      = firebase.firestore();

// Persist login as long as humanly possible.
// LOCAL persistence keeps the user signed in across browser restarts,
// device sleeps, app reloads — until they explicitly log out OR their
// browser data is cleared (e.g., iOS Safari ITP after 7+ days inactive).
// Wrapped in a Promise.catch so a Safari-private-mode IndexedDB error
// can't break the rest of auth setup.
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .catch(err => console.warn('Auth persistence setup:', err.message));

let currentOwl = null; // { uid, email, displayName, isAdmin, joinedAt }

// ── PIN login ───────────────────────────────────────────────
// Firebase requires passwords of 6+ chars, so a 4-digit PIN is expanded
// into a real password by appending this fixed, app-wide suffix. Volunteers
// only ever see/type the 4 digits — the suffix is invisible to them.
const PIN_SUFFIX = '#vltOwls2024';
function pinToPassword(pin) { return String(pin) + PIN_SUFFIX; }

// A publicly-readable roster of {displayName, email} powers the login name
// picker (it must load BEFORE anyone is signed in). We refresh a user's
// roster entry every time they sign in, so the list stays current on its own.
async function upsertRoster(user, displayName) {
    try {
        await db.collection('roster').doc(user.uid).set({
            displayName: displayName || user.email.split('@')[0],
            email:       user.email,
        }, { merge: true });
    } catch (e) {
        console.warn('roster upsert:', e.message);
    }
}

// ── Auth State ──────────────────────────────────────────────
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const ref  = db.collection('users').doc(user.uid);
        try {
            const snap = await ref.get();
            if (snap.exists) {
                currentOwl = { uid: user.uid, ...snap.data() };
            } else {
                const profile = {
                    email:       user.email,
                    displayName: user.email.split('@')[0],
                    isAdmin:     false,
                    joinedAt:    firebase.firestore.FieldValue.serverTimestamp(),
                };
                await ref.set(profile);
                currentOwl = { uid: user.uid, ...profile };
            }
        } catch (e) {
            currentOwl = { uid: user.uid, email: user.email, displayName: user.email.split('@')[0], isAdmin: false };
        }
        // Keep the public login roster in sync with this user's current name.
        upsertRoster(user, currentOwl.displayName);
        updateOwlsView(true);
        // Flush any reports queued while offline.
        setTimeout(syncOfflineReports, 2500);
    } else {
        currentOwl = null;
        updateOwlsView(false);
    }
});

// ── View Update ─────────────────────────────────────────────
function updateOwlsView(loggedIn) {
    const loginBtn            = document.getElementById('owls-login-btn');
    const profileCard         = document.getElementById('owls-profile');
    const becomeOwlBtn        = document.getElementById('become-owl-btn-el');
    const wildlifeResourceItem = document.getElementById('wildlife-resources-item');

    const adminSection  = document.getElementById('owl-admin-section');

    if (loggedIn && currentOwl) {
        // Auth UI
        loginBtn.classList.add('hidden');
        profileCard.classList.remove('hidden');
        if (becomeOwlBtn) becomeOwlBtn.style.display = 'none';

        // Profile card
        const raw      = currentOwl.displayName || currentOwl.email || 'OW';
        const initials = raw.split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2) || 'OW';
        document.getElementById('owl-initials').textContent      = initials;
        document.getElementById('owl-profile-name').textContent  = currentOwl.displayName || currentOwl.email;
        document.getElementById('owl-profile-email').textContent = currentOwl.email;

        // Waiver pill (now lives inside the combined profile card)
        updateWaiverPill();

        // Availability section: visible for all logged-in users; live-saves
        const availSection = document.getElementById('owl-availability-section');
        if (availSection) {
            availSection.classList.remove('hidden');
            refreshAvailabilityToggles();
        }

        // Preferred trails section: visible for all logged-in users; live-saves (max 5)
        const prefSection = document.getElementById('owl-preferred-trails-section');
        if (prefSection) {
            prefSection.classList.remove('hidden');
            renderPreferredTrailToggles();
        }

        // Hide recruitment content, show The Flock leaderboard.
        // (Impact strip is shown to everyone — it's outside this block.)
        const owlsLogo   = document.getElementById('owls-logo');
        const owlsText   = document.getElementById('owls-text');
        const owlsFlock  = document.getElementById('owls-flock');
        if (owlsLogo)   owlsLogo.classList.add('hidden');
        if (owlsText)   owlsText.classList.add('hidden');
        if (owlsFlock)  owlsFlock.classList.remove('hidden');
        loadFlock();

        // Admin section: visible only for admins
        if (adminSection) {
            if (currentOwl.isAdmin) {
                adminSection.classList.remove('hidden');
                refreshAdminStats();
            } else {
                adminSection.classList.add('hidden');
            }
        }

        // Swap nav labels: Wildlife → Tasks
        WILDLIFE_NAV_IDS.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.innerHTML = TASKS_BTN_HTML;
        });

        // Admins get a notification badge (nav dot + home-icon badge) for
        // issues awaiting approval. Re-run after the nav labels are set so the
        // dot attaches to the freshly-rendered Tasks buttons.
        if (currentOwl.isAdmin) startAdminBadgePolling();
        else stopAdminBadgePolling();
        const wildlifeDetailTab = document.querySelector('.detail-tab[data-tab="wildlife"]');
        if (wildlifeDetailTab) wildlifeDetailTab.innerHTML = TASKS_BTN_HTML;

        // Show Wildlife + Trail Sightings in Resources
        if (wildlifeResourceItem) wildlifeResourceItem.classList.remove('hidden');
        document.getElementById('sightings-resources-item')?.classList.remove('hidden');

        // (FAB is always visible now — its click handler decides what to do
        //  based on auth state. No need to toggle display here.)

    } else {
        // Auth UI
        loginBtn.classList.remove('hidden');
        profileCard.classList.add('hidden');
        if (becomeOwlBtn) becomeOwlBtn.style.display = '';
        if (adminSection)  adminSection.classList.add('hidden');
        stopAdminBadgePolling();
        const availSection = document.getElementById('owl-availability-section');
        if (availSection) availSection.classList.add('hidden');
        const prefSection = document.getElementById('owl-preferred-trails-section');
        if (prefSection) prefSection.classList.add('hidden');

        // Show recruitment content, hide The Flock.
        // (Impact strip stays visible — it's a public stat now.)
        const owlsLogo   = document.getElementById('owls-logo');
        const owlsText   = document.getElementById('owls-text');
        const owlsFlock  = document.getElementById('owls-flock');
        if (owlsLogo)   owlsLogo.classList.remove('hidden');
        if (owlsText)   owlsText.classList.remove('hidden');
        if (owlsFlock)  owlsFlock.classList.add('hidden');

        // Restore nav labels: Tasks → Wildlife
        WILDLIFE_NAV_IDS.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.innerHTML = WILDLIFE_BTN_HTML;
        });
        const wildlifeDetailTab = document.querySelector('.detail-tab[data-tab="wildlife"]');
        if (wildlifeDetailTab) wildlifeDetailTab.innerHTML = WILDLIFE_BTN_HTML;

        // Hide Wildlife + Trail Sightings in Resources
        if (wildlifeResourceItem) wildlifeResourceItem.classList.add('hidden');
        document.getElementById('sightings-resources-item')?.classList.add('hidden');

        // Cancel any active pin drop / form. The FAB stays visible; its
        // click handler will route logged-out taps to the Volunteer page.
        if (typeof window.onDetailMapLeaving === 'function') window.onDetailMapLeaving();
    }
}

// ── Admin notification badge ─────────────────────────────────
// Shows admins how many trail issues are awaiting approval — as a red dot on
// the bottom-nav Tasks button (every screen) and, on an installed iPhone PWA,
// on the home-screen app icon. The icon badge only updates while the app is
// open (no background push), so we also refresh on focus and on a timer.
let adminBadgeTimer = null;

function setNavBadge(count) {
    WILDLIFE_NAV_IDS.forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        let badge = btn.querySelector('.nav-badge');
        if (count > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'nav-badge';
                btn.appendChild(badge);
            }
            badge.textContent = count > 9 ? '9+' : String(count);
            badge.classList.remove('hidden');
        } else if (badge) {
            badge.classList.add('hidden');
        }
    });
}

function setAppIconBadge(count) {
    try {
        if (count > 0 && 'setAppBadge' in navigator) navigator.setAppBadge(count);
        else if ('clearAppBadge' in navigator) navigator.clearAppBadge();
    } catch (_) { /* unsupported browser — ignore */ }
}

async function refreshAdminBadge() {
    if (!currentOwl || !currentOwl.isAdmin) { setNavBadge(0); setAppIconBadge(0); return; }
    try {
        const snap = await db.collection('issues').where('status', '==', 'pending_approval').get();
        setNavBadge(snap.size);
        setAppIconBadge(snap.size);
    } catch (e) {
        console.warn('admin badge refresh:', e.message);
    }
}

function startAdminBadgePolling() {
    refreshAdminBadge();
    if (adminBadgeTimer) clearInterval(adminBadgeTimer);
    adminBadgeTimer = setInterval(refreshAdminBadge, 5 * 60 * 1000); // every 5 min while open
}

function stopAdminBadgePolling() {
    if (adminBadgeTimer) { clearInterval(adminBadgeTimer); adminBadgeTimer = null; }
    setNavBadge(0);
    setAppIconBadge(0);
}

// Re-check the moment the app is brought back to the foreground.
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && currentOwl && currentOwl.isAdmin) refreshAdminBadge();
});
window.refreshAdminBadge = refreshAdminBadge;

// ── Modal Controls ───────────────────────────────────────────
let pendingLoginEmail = null;  // email of the account picked in the name list

function showLoginStep(step) {
    ['pick', 'pin', 'email'].forEach(s => {
        const el = document.getElementById('owl-login-step-' + s);
        if (el) el.classList.toggle('hidden', s !== step);
    });
}

function openLoginModal() {
    document.getElementById('owl-login-modal').classList.remove('hidden');
    showLoginStep('pick');
    loadAccountList();
}

function closeLoginModal() {
    document.getElementById('owl-login-modal').classList.add('hidden');
    document.getElementById('owl-login-error').textContent = '';
    document.getElementById('owl-login-email').value       = '';
    document.getElementById('owl-login-password').value    = '';
    const pinInput = document.getElementById('owl-login-pin');
    const pinErr   = document.getElementById('owl-pin-error');
    if (pinInput) pinInput.value = '';
    if (pinErr)   pinErr.textContent = '';
    pendingLoginEmail = null;
    const btn = document.getElementById('owl-login-submit');
    btn.disabled    = false;
    btn.textContent = 'Sign In';
}

// Step navigation
function backToPicker()   { showLoginStep('pick'); }
function showEmailLogin() {
    showLoginStep('email');
    setTimeout(() => document.getElementById('owl-login-email').focus(), 60);
}

// Build the name list from the public roster.
async function loadAccountList() {
    const listEl = document.getElementById('owl-account-list');
    if (!listEl) return;
    listEl.innerHTML = '<p class="owl-account-loading">Loading…</p>';
    try {
        const snap = await db.collection('roster').orderBy('displayName').get();
        if (snap.empty) {
            listEl.innerHTML = '<p class="owl-account-empty">No accounts yet. Use “Sign in with email instead.”</p>';
            return;
        }
        listEl.innerHTML = '';
        snap.forEach(doc => {
            const d     = doc.data();
            const name  = d.displayName || d.email;
            const init  = name.trim().split(/\s+/).map(w => w[0] || '').join('').toUpperCase().slice(0, 2) || 'OW';
            const btn   = document.createElement('button');
            btn.className = 'owl-account-btn';
            btn.innerHTML = `<span class="owl-account-avatar">${escapeHtml(init)}</span><span>${escapeHtml(name)}</span>`;
            btn.addEventListener('click', () => pickAccount(d.email, name));
            listEl.appendChild(btn);
        });
    } catch (e) {
        // Roster not readable (e.g. rules not updated yet) — fall back to email.
        console.warn('loadAccountList:', e.message);
        listEl.innerHTML = '<p class="owl-account-empty">Could not load names. Use “Sign in with email instead.”</p>';
    }
}

// A name was tapped → go to the PIN step.
function pickAccount(email, name) {
    pendingLoginEmail = email;
    document.getElementById('owl-pin-name').textContent = name;
    document.getElementById('owl-pin-error').textContent = '';
    const pinInput = document.getElementById('owl-login-pin');
    pinInput.value = '';
    showLoginStep('pin');
    setTimeout(() => pinInput.focus(), 60);
}

// Sign in with the picked account + entered PIN.
async function signInWithPin() {
    const pin     = (document.getElementById('owl-login-pin').value || '').trim();
    const errorEl = document.getElementById('owl-pin-error');
    const btn     = document.getElementById('owl-pin-submit');

    if (!/^\d{4}$/.test(pin)) {
        errorEl.textContent = 'Enter your 4-digit PIN.';
        return;
    }
    btn.disabled    = true;
    btn.textContent = 'Signing in…';
    errorEl.textContent = '';

    try {
        await auth.signInWithEmailAndPassword(pendingLoginEmail, pinToPassword(pin));
        closeLoginModal();
    } catch (e) {
        errorEl.textContent = 'Incorrect PIN. Try again.';
        btn.disabled    = false;
        btn.textContent = 'Sign In';
    }
}

// ── Sign In ──────────────────────────────────────────────────
async function signInOwl() {
    const email    = document.getElementById('owl-login-email').value.trim();
    const password = document.getElementById('owl-login-password').value;
    const errorEl  = document.getElementById('owl-login-error');
    const btn      = document.getElementById('owl-login-submit');

    if (!email || !password) {
        errorEl.textContent = 'Please enter your email and password.';
        return;
    }

    btn.disabled    = true;
    btn.textContent = 'Signing in…';
    errorEl.textContent = '';

    try {
        await auth.signInWithEmailAndPassword(email, password);
        closeLoginModal();
    } catch (e) {
        errorEl.textContent = 'Incorrect email or password.';
        btn.disabled    = false;
        btn.textContent = 'Sign In';
    }
}

// ── Sign Out ─────────────────────────────────────────────────
// Always asks for confirmation first — the OWLS app is designed to keep
// senior volunteers signed in indefinitely, so an accidental Log out tap
// shouldn't actually log them out.
async function signOutOwl() {
    // confirmAction may not be defined yet during very early page load —
    // fall back to native confirm in that edge case.
    let ok;
    if (typeof confirmAction === 'function') {
        ok = await confirmAction(
            'Log out of OWLS?',
            "You'll need to sign in with your email and password to come back. Most Owls don't need to log out — your login stays remembered on this device.",
            'Yes, log out'
        );
    } else {
        ok = window.confirm("Log out of OWLS? You'll need your email and password to come back.");
    }
    if (!ok) return;
    try {
        await auth.signOut();
    } catch (err) {
        console.error('Sign out error:', err);
    }
}

// ── Wildlife nav → Tasks intercept (capture phase) ───────────
// Runs before app.js bubble-phase listeners; redirects to tasks-view when logged in.
document.addEventListener('click', (e) => {
    if (!currentOwl) return;
    const btn = e.target.closest('button');
    if (!btn) return;

    const isWildlifeNav = WILDLIFE_NAV_IDS.includes(btn.id);
    const isWildlifeTab = btn.classList.contains('detail-tab') && btn.dataset.tab === 'wildlife';

    if (isWildlifeNav || isWildlifeTab) {
        e.stopImmediatePropagation();
        switchView('tasks-view');
    }
}, true);

// ── Wildlife → Resources navigation ─────────────────────────
document.getElementById('wildlife-resources-btn')?.addEventListener('click', () => {
    switchView('wildlife-view');
    if (typeof buildGlobalWildlifeList === 'function') buildGlobalWildlifeList();
});

// Show/hide the current PIN in the Edit My Info field.
function togglePinVisibility() {
    const input = document.getElementById('owl-set-pin-input');
    const eye   = document.getElementById('owl-pin-eye');
    if (!input) return;
    const reveal = input.type === 'password';
    input.type = reveal ? 'text' : 'password';
    if (eye) eye.classList.toggle('revealed', reveal);
}

// ── Keyboard shortcuts in modal ──────────────────────────────
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('owl-login-modal');
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') { closeLoginModal(); return; }
    if (e.key !== 'Enter') return;
    // Submit whichever step is active.
    if (!document.getElementById('owl-login-step-pin').classList.contains('hidden'))   signInWithPin();
    else if (!document.getElementById('owl-login-step-email').classList.contains('hidden')) signInOwl();
});

// ── Issue Reporting ──────────────────────────────────────────
// State
let issuePinMode       = false;
let issuePhotoFile     = null;
let tempIssueMarker    = null;
let pendingIssueLat    = null;
let pendingIssueLng    = null;
let selectedSeverity   = null;
let issueMapRef        = null;
let issueMapClickFn    = null;
let pinDropBannerEl    = null;
let issueReportBtnEl   = null;

const REPORT_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg><span class="issue-report-label">Report Trail Issue</span>`;
const CANCEL_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg><span class="issue-report-label">Cancel Pin Drop</span>`;

// Called by app.js once the detail map is initialised
window.onDetailMapReady = (map, prop) => {
    // The #detail-map div is reused across trails, so any FAB/banner we
    // manually appended for a PREVIOUS trail survives map teardown. Clear
    // them first — otherwise an MCHT trail inherits the last trail's button.
    map.getContainer().querySelectorAll('.issue-report-fab, .pin-drop-banner').forEach(el => el.remove());

    // MCHT properties opt out of the VLT volunteer task system entirely —
    // no FAB, no pins, no anything (they're managed by Maine Coast Heritage Trust).
    if (prop?.owner === 'mcht') return;
    issueMapRef = map;

    // Floating Action Button — ALWAYS rendered, even for logged-out visitors.
    // Logged-in: tapping enters pin-drop mode.
    // Logged-out: tapping navigates to the Volunteer page (login / sign up).
    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'issue-report-fab';
    fab.innerHTML = REPORT_SVG;
    fab.setAttribute('aria-label', 'Report a trail issue');
    fab.title = 'Report a trail issue';
    L.DomEvent.disableClickPropagation(fab);
    fab.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!currentOwl) {
            // Logged out → take them straight to the Volunteer page
            // (login / sign-up). Defensively try a few approaches in case
            // switchView isn't on this scope for some reason.
            try {
                // Collapse the expanded map so it's clean when they return
                const detailView = document.getElementById('detail-view');
                if (detailView) detailView.classList.remove('map-expanded');

                if (typeof switchView === 'function') {
                    switchView('owls-view');
                } else if (typeof window.switchView === 'function') {
                    window.switchView('owls-view');
                } else {
                    // Last-ditch fallback: simulate a click on the bottom-nav Volunteer tab
                    const owlsNav = document.querySelector('#nav-owls, .detail-tab[data-tab="owls"]');
                    if (owlsNav) owlsNav.click();
                }
            } catch (err) {
                console.error('Logged-out FAB nav failed:', err);
            }
            return;
        }
        issuePinMode ? cancelPinDrop() : enterPinDrop(map, fab);
    });
    map.getContainer().appendChild(fab);
    issueReportBtnEl = fab;

    // The rest of the in-map issue infrastructure (banner, layer group, toggle,
    // loaded pins) only matters once you're signed in. Bail here for logged-out users.
    if (!currentOwl) return;

    // Floating banner appended directly inside the Leaflet container
    const banner = document.createElement('div');
    banner.className   = 'pin-drop-banner hidden';
    banner.textContent = 'Tap map to drop issue pin';
    map.getContainer().appendChild(banner);
    pinDropBannerEl = banner;

    // LayerGroup for issue pins — makes bulk show/hide trivial
    maintenanceVisible = true;
    issueLayerGroup = L.layerGroup().addTo(map);

    // Add toggle button as a proper Leaflet topleft control so pointer-events work correctly.
    const ToggleIssuesControl = L.Control.extend({
        options: { position: 'topleft' },
        onAdd: function (m) {
            const btn = L.DomUtil.create('button', 'map-toggle-maintenance-btn');
            btn.textContent = '🔧 Hide Issues';
            btn.title = 'Toggle maintenance layer';
            L.DomEvent.disableClickPropagation(btn);
            btn.addEventListener('click', () => {
                maintenanceVisible = !maintenanceVisible;
                if (maintenanceVisible) {
                    issueLayerGroup.addTo(m);
                    btn.textContent = '🔧 Hide Issues';
                    btn.classList.remove('issues-hidden');
                } else {
                    m.removeLayer(issueLayerGroup);
                    btn.textContent = '🔧 Show Issues';
                    btn.classList.add('issues-hidden');
                }
            });
            return btn;
        },
    });
    map.addControl(new ToggleIssuesControl());
    toggleMaintenanceBtn = map.getContainer().querySelector('.map-toggle-maintenance-btn');

    // Load & display existing open issues for this trail
    loadTrailIssues(map, prop);
};

// Called by app.js when navigating away from the detail view
window.onDetailMapLeaving = () => {
    cancelPinDrop();
    closeIssueFormSilently();
    closeIssueDetail();
    // Remove the DOM nodes, not just the references — the map container is
    // reused, so a lingering button would show up on the next trail.
    if (issueReportBtnEl) issueReportBtnEl.remove();
    if (pinDropBannerEl)  pinDropBannerEl.remove();
    issueMarkers         = [];    // markers are removed with the map
    issueLayerGroup      = null;
    maintenanceVisible   = true;
    toggleMaintenanceBtn = null;
    issueMapRef          = null;
    issueReportBtnEl     = null;
    pinDropBannerEl      = null;
};

// ── Pin-drop mode ─────────────────────────────────────────────
function enterPinDrop(map, btn) {
    if (!currentOwl) return;
    // Defensive: clear any stale state from a previous (incomplete) attempt
    if (issueMapClickFn && issueMapRef) {
        issueMapRef.off('click', issueMapClickFn);
        issueMapClickFn = null;
    }
    if (tempIssueMarker && issueMapRef) {
        issueMapRef.removeLayer(tempIssueMarker);
        tempIssueMarker = null;
    }

    issuePinMode = true;
    btn.classList.add('pin-drop-active');
    btn.innerHTML = CANCEL_SVG;
    btn.title = 'Cancel pin drop';
    if (pinDropBannerEl) pinDropBannerEl.classList.remove('hidden');
    map.getContainer().classList.add('pin-drop-mode');

    // CRITICAL: register the map click listener on the NEXT tick, not this one.
    //
    // Why: the click that just triggered this function is still propagating.
    // On touch devices (and even some desktop browsers) the same tap can also
    // fire as a map click in the same JS tick — Leaflet's disableClickPropagation
    // doesn't always stop the synthesized click on the way up. Without this
    // setTimeout, the listener fires immediately, placePinAndOpenForm runs at
    // wherever the button was, and the user never gets to pick a spot.
    setTimeout(() => {
        if (!issuePinMode) return; // user already cancelled
        // Save the previously-issuing function reference so we can off it later
        issueMapClickFn = (e) => placePinAndOpenForm(map, e.latlng.lat, e.latlng.lng);
        map.on('click', issueMapClickFn);
    }, 100);
}

function cancelPinDrop() {
    issuePinMode = false;
    if (issueReportBtnEl) {
        issueReportBtnEl.classList.remove('pin-drop-active');
        issueReportBtnEl.innerHTML = REPORT_SVG;
        issueReportBtnEl.title = 'Report a trail issue';
    }
    if (pinDropBannerEl) pinDropBannerEl.classList.add('hidden');
    if (issueMapRef) {
        issueMapRef.getContainer().classList.remove('pin-drop-mode');
        if (issueMapClickFn) {
            issueMapRef.off('click', issueMapClickFn);
            issueMapClickFn = null;
        }
    }
    if (tempIssueMarker && issueMapRef) {
        issueMapRef.removeLayer(tempIssueMarker);
        tempIssueMarker = null;
    }
    pendingIssueLat = null;
    pendingIssueLng = null;
}

// ── Place pin → open form ─────────────────────────────────────
function placePinAndOpenForm(map, lat, lng) {
    issuePinMode = false;
    // Always clear the live click listener — we used .on() so .once isn't enough
    if (issueMapClickFn && issueMapRef) {
        issueMapRef.off('click', issueMapClickFn);
        issueMapClickFn = null;
    }
    if (issueReportBtnEl) {
        issueReportBtnEl.classList.remove('pin-drop-active');
        issueReportBtnEl.innerHTML = REPORT_SVG;
        issueReportBtnEl.title = 'Report a trail issue';
    }
    if (pinDropBannerEl) pinDropBannerEl.classList.add('hidden');
    map.getContainer().classList.remove('pin-drop-mode');

    pendingIssueLat = lat;
    pendingIssueLng = lng;

    const pendingIcon = L.divIcon({
        className: '',
        html: `<div class="issue-pin-marker pending">!</div>`,
        iconSize: [28, 28], iconAnchor: [14, 14],
    });
    if (tempIssueMarker) map.removeLayer(tempIssueMarker);
    tempIssueMarker = L.marker([lat, lng], { icon: pendingIcon, zIndexOffset: 2000 }).addTo(map);

    openIssueForm();
}

// ── Issue form ────────────────────────────────────────────────
function openIssueForm() {
    const prop = window.getCurrentDetailProp ? window.getCurrentDetailProp() : null;
    document.getElementById('issue-form-trail-name').textContent =
        prop ? prop.name.replace(/\n/g, ' ') : '';

    document.getElementById('issue-category').value  = '';
    document.getElementById('issue-title').value     = '';
    document.getElementById('issue-desc').value      = '';
    document.getElementById('issue-form-error').textContent = '';
    const btn = document.getElementById('issue-submit-btn');
    btn.disabled    = false;
    btn.textContent = reportSubmitLabel();
    selectedSeverity = null;
    document.querySelectorAll('.issue-severity-btn').forEach(b => (b.className = 'issue-severity-btn'));

    // Reset photo upload state
    issuePhotoFile = null;
    document.getElementById('issue-photo-input').value = '';
    document.getElementById('issue-photo-preview').src = '';
    document.getElementById('issue-photo-preview').classList.add('hidden');
    document.getElementById('issue-photo-remove').classList.add('hidden');
    document.getElementById('issue-photo-btn').style.display = '';
    document.getElementById('issue-progress').classList.add('hidden');
    document.getElementById('issue-progress-fill').style.width = '0%';

    document.getElementById('issue-form-panel').classList.remove('hidden');
}

function closeIssueForm() {
    document.getElementById('issue-form-panel').classList.add('hidden');
    if (tempIssueMarker && issueMapRef) {
        issueMapRef.removeLayer(tempIssueMarker);
        tempIssueMarker = null;
    }
    pendingIssueLat  = null;
    pendingIssueLng  = null;
    selectedSeverity = null;
}

function closeIssueFormSilently() {
    document.getElementById('issue-form-panel').classList.add('hidden');
    tempIssueMarker  = null;
    pendingIssueLat  = null;
    pendingIssueLng  = null;
    selectedSeverity = null;
}

// ── Severity selection ────────────────────────────────────────
document.getElementById('issue-severity-group').addEventListener('click', (e) => {
    const btn = e.target.closest('.issue-severity-btn');
    if (!btn) return;
    document.querySelectorAll('.issue-severity-btn').forEach(b => (b.className = 'issue-severity-btn'));
    selectedSeverity = btn.dataset.severity;
    btn.classList.add('selected-' + selectedSeverity);
});

document.getElementById('issue-submit-btn').addEventListener('click', submitIssue);
document.getElementById('issue-cancel-btn').addEventListener('click', closeIssueForm);

// Issue-form photo picker (mirrors the completion sheet flow)
document.getElementById('issue-photo-btn').addEventListener('click', () => {
    document.getElementById('issue-photo-input').click();
});
document.getElementById('issue-photo-input').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    issuePhotoFile = file;
    const reader = new FileReader();
    reader.onload = ev => {
        const preview = document.getElementById('issue-photo-preview');
        preview.src = ev.target.result;
        preview.classList.remove('hidden');
        document.getElementById('issue-photo-remove').classList.remove('hidden');
        document.getElementById('issue-photo-btn').style.display = 'none';
    };
    reader.readAsDataURL(file);
});
document.getElementById('issue-photo-remove').addEventListener('click', () => {
    issuePhotoFile = null;
    document.getElementById('issue-photo-input').value = '';
    document.getElementById('issue-photo-preview').classList.add('hidden');
    document.getElementById('issue-photo-remove').classList.add('hidden');
    document.getElementById('issue-photo-btn').style.display = '';
});
document.getElementById('issue-form-backdrop').addEventListener('click', closeIssueForm);

// ── Submit to Firestore ───────────────────────────────────────
async function submitIssue() {
    const errorEl   = document.getElementById('issue-form-error');
    const submitBtn = document.getElementById('issue-submit-btn');
    const category  = document.getElementById('issue-category').value;
    const title     = document.getElementById('issue-title').value.trim();
    const desc      = document.getElementById('issue-desc').value.trim();

    if (!category)          { errorEl.textContent = 'Please select a category.'; return; }
    if (!selectedSeverity)  { errorEl.textContent = 'Please select a severity level.'; return; }
    if (!title)             { errorEl.textContent = 'Please add a short title.'; return; }
    if (!currentOwl)        { errorEl.textContent = 'You must be logged in.'; return; }
    if (pendingIssueLat == null) { errorEl.textContent = 'No pin placed — try again.'; return; }

    // Guard: MCHT properties don't accept issue reports through this app.
    const propGuard = window.getCurrentDetailProp ? window.getCurrentDetailProp() : null;
    if (propGuard?.owner === 'mcht') {
        errorEl.textContent = 'This trail is managed by Maine Coast Heritage Trust. Please report issues directly to MCHT.';
        return;
    }

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Saving…';
    errorEl.textContent   = '';

    const prop = window.getCurrentDetailProp ? window.getCurrentDetailProp() : null;
    const reportData = {
        title, category, severity: selectedSeverity, description: desc,
        trailName: prop ? prop.folder : '',
        lat: pendingIssueLat, lng: pendingIssueLng,
        status: currentOwl.isAdmin ? 'open' : 'pending_approval',
        reportedBy: { uid: currentOwl.uid, displayName: currentOwl.displayName || currentOwl.email },
        // Medium/Low expire after 6 months; High never expires.
        expiresMonths: (selectedSeverity === 'Medium' || selectedSeverity === 'Low') ? 6 : 0,
    };

    // Compress the photo up front — works offline too.
    let photoBlob = null;
    if (issuePhotoFile) {
        try { photoBlob = await compressImage(issuePhotoFile); }
        catch (err) { console.warn('Photo compress failed:', err); photoBlob = null; }
    }

    // Reliable connectivity check — iOS often reports navigator.onLine: true
    // with no real connection, which would hang the Firestore write forever.
    const online = await isReallyOnline();

    // Offline → save to the local queue and confirm; it syncs automatically later.
    if (!online) {
        await queueOfflineReport(reportData, photoBlob);
        finishReportUI(prop, { reloadPins: true, toastMsg: 'Saved offline — it’ll post automatically when you’re back online.' });
        return;
    }

    // Online → upload the photo, then write the issue. Each step is time-limited
    // so a mid-submit connection drop can never hang the form.
    let reportedPhotoUrl = null;
    if (photoBlob) {
        const progressEl = document.getElementById('issue-progress');
        const fillEl     = document.getElementById('issue-progress-fill');
        const labelEl    = document.getElementById('issue-progress-label');
        try {
            progressEl.classList.remove('hidden');
            fillEl.style.width  = '0%';
            labelEl.textContent = 'Uploading photo…';
            reportedPhotoUrl = await withTimeout(uploadToCloudinary(photoBlob, pct => {
                fillEl.style.width = pct + '%';
                labelEl.textContent = `Uploading… ${pct}%`;
            }), 30000);
            fillEl.style.width = '100%';
            labelEl.textContent = 'Upload complete ✓';
        } catch (e) {
            // No Firestore write happened yet — safe to queue offline (no dup).
            console.warn('Photo upload failed, queueing offline:', e.message);
            await queueOfflineReport(reportData, photoBlob);
            finishReportUI(prop, { reloadPins: true, toastMsg: 'Connection dropped — saved offline; it’ll post when you’re back online.' });
            return;
        }
    }
    try {
        await withTimeout(db.collection('issues').add(buildIssueDoc(reportData, reportedPhotoUrl)), 12000);
        finishReportUI(prop, { reloadPins: true, toastMsg: currentOwl.isAdmin ? 'Issue posted to map ✓' : 'Issue submitted — admin will approve' });
    } catch (e) {
        // The write may still flush in the background — re-queuing would duplicate.
        // Close optimistically; the pin appears once it lands.
        console.warn('Issue write slow/failed:', e.message);
        finishReportUI(prop, { reloadPins: true, toastMsg: 'Submitting — it’ll appear shortly.' });
    }
}

// Build the Firestore issue document from queued/in-memory report data.
function buildIssueDoc(d, reportedPhotoUrl) {
    let expiresAt = null;
    if (d.expiresMonths) {
        const dt = new Date();
        dt.setMonth(dt.getMonth() + d.expiresMonths);
        expiresAt = firebase.firestore.Timestamp.fromDate(dt);
    }
    return {
        title: d.title, category: d.category, severity: d.severity, description: d.description,
        trailName: d.trailName, lat: d.lat, lng: d.lng,
        reportedPhotoUrl: reportedPhotoUrl || null,
        status: d.status,
        reportedBy: d.reportedBy,
        reportedAt: firebase.firestore.FieldValue.serverTimestamp(),
        upvotes: [], downvotes: [], claimedBy: null, completedAt: null, photos: [], expiresAt,
    };
}

// Shared form-finish UI. opts = { reloadPins, toastMsg }.
function finishReportUI(prop, opts) {
    opts = opts || {};
    document.getElementById('issue-form-panel').classList.add('hidden');
    document.getElementById('issue-progress')?.classList.add('hidden');
    pendingIssueLat  = null;
    pendingIssueLng  = null;
    selectedSeverity = null;
    const submitBtn = document.getElementById('issue-submit-btn');
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = reportSubmitLabel(); }

    if (tempIssueMarker && issueMapRef) {
        const confirmedIcon = L.divIcon({
            className: '',
            html: `<div class="issue-pin-marker confirmed">✓</div>`,
            iconSize: [28, 28], iconAnchor: [14, 14],
        });
        tempIssueMarker.setIcon(confirmedIcon);
        const m = tempIssueMarker, r = issueMapRef;
        setTimeout(() => { if (m && r) r.removeLayer(m); if (tempIssueMarker === m) tempIssueMarker = null; }, 2200);
    }

    if (opts.reloadPins && issueMapRef && prop) {
        issueMarkers.forEach(m => issueMapRef.removeLayer(m));
        issueMarkers = [];
        loadTrailIssues(issueMapRef, prop);
    }

    if (opts.toastMsg) showIssueToast(opts.toastMsg);
}

// Submit button reads "Log Issue" when offline (it'll be queued), else "Submit Issue".
function reportSubmitLabel() { return navigator.onLine ? 'Submit Issue' : 'Log Issue'; }
function refreshReportSubmitLabel() {
    const btn = document.getElementById('issue-submit-btn');
    if (btn && !btn.disabled) btn.textContent = reportSubmitLabel();
}
window.addEventListener('online',  refreshReportSubmitLabel);
window.addEventListener('offline', refreshReportSubmitLabel);

// Promise timeout + a real connectivity probe (navigator.onLine lies on iOS).
function withTimeout(promise, ms) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
    ]);
}
async function isReallyOnline() {
    if (!navigator.onLine) return false;
    try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 3500);
        // google.com/generate_204 isn't handled by our service worker, so this
        // hits the real network rather than a cache.
        await fetch('https://www.google.com/generate_204', { mode: 'no-cors', cache: 'no-store', signal: ctrl.signal });
        clearTimeout(t);
        return true;
    } catch {
        return false;
    }
}

// ── Offline report queue (IndexedDB) + auto-sync ─────────────
const OFFLINE_DB = 'vlt-offline';
const OFFLINE_STORE = 'reports';

function offlineDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(OFFLINE_DB, 1);
        req.onupgradeneeded = () => {
            if (!req.result.objectStoreNames.contains(OFFLINE_STORE)) {
                req.result.createObjectStore(OFFLINE_STORE, { keyPath: 'id' });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror   = () => reject(req.error);
    });
}
function idbOp(mode, fn) {
    return offlineDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(OFFLINE_STORE, mode);
        const store = tx.objectStore(OFFLINE_STORE);
        const out = fn(store);
        tx.oncomplete = () => resolve(out && out.result !== undefined ? out.result : out);
        tx.onerror    = () => reject(tx.error);
    }));
}
const offlineGetAll = () => idbOp('readonly',  s => s.getAll());
const offlinePut    = (item) => idbOp('readwrite', s => s.put(item));
const offlineDelete = (id) => idbOp('readwrite', s => s.delete(id));

async function queueOfflineReport(reportData, photoBlob) {
    const item = {
        id: 'r_' + Date.now() + '_' + Math.random().toString(36).slice(2),
        data: reportData,
        photoBlob: photoBlob || null,
    };
    try { await offlinePut(item); } catch (e) { console.warn('queue offline report failed:', e); }
}

let _syncingReports = false;
async function syncOfflineReports() {
    if (_syncingReports || !currentOwl) return;
    let items;
    try { items = await offlineGetAll(); } catch { return; }
    if (!items || !items.length) return;
    if (!(await isReallyOnline())) return;   // don't attempt while truly offline
    _syncingReports = true;
    let posted = 0;
    for (const item of items) {
        try {
            let photoUrl = null;
            if (item.photoBlob) photoUrl = await withTimeout(uploadToCloudinary(item.photoBlob, () => {}), 30000);
            await withTimeout(db.collection('issues').add(buildIssueDoc(item.data, photoUrl)), 15000);
            await offlineDelete(item.id);
            posted++;
        } catch (e) {
            console.warn('sync report failed (will retry later):', e.message);
            break; // likely offline again — stop and retry next trigger
        }
    }
    _syncingReports = false;
    if (posted > 0) {
        showIssueToast(posted === 1 ? 'Offline report posted ✓' : `${posted} offline reports posted ✓`);
        if (typeof refreshAdminBadge === 'function') refreshAdminBadge();
        // If the Tasks page is open, refresh it so the now-synced reports move
        // from the "Saved offline" section into the normal task list.
        const tv = document.getElementById('tasks-view');
        if (tv && !tv.classList.contains('hidden') && typeof loadTasks === 'function') loadTasks();
    }
}

// Auto-sync triggers: when the connection returns, and on a timer while open.
window.addEventListener('online', () => setTimeout(syncOfflineReports, 1500));
setInterval(() => { syncOfflineReports(); }, 15 * 60 * 1000); // every 15 min while open

// ── Issue map pins & detail — Task 4 ─────────────────────────
let issueMarkers         = [];    // Leaflet markers for existing issues
let issueLayerGroup      = null;  // LayerGroup holding all issue pins
let maintenanceVisible   = true;  // toggle state
let toggleMaintenanceBtn = null;  // reference to the toggle button element
let currentDetailIssue   = null;  // issue data object currently shown in detail panel
let currentDetailIssueId = null;

const CATEGORY_LABELS = {
    hazard:    'Safety Hazard',
    blowdown:  'Blow Down',
    invasive:  'Invasive Species',
    overgrown: 'Overgrown Vegetation',
    signage:   'Signage',
    trash:     'Trash / Litter',
    other:     'Other',
    // Legacy values from before category cleanup — kept so old issues still render
    erosion:     'Erosion / Washout',
    maintenance: 'Trail Maintenance',
    wildlife:    'Wildlife Concern',
};

const SEVERITY_COLORS = { High: '#dc2626', Medium: '#d97706', Low: '#059669' };

// Short, scannable trail names for pills, group headers, and card metadata.
// Keys are the literal `folder` values used as `trailName` on issues. Any
// trail not in this map falls back to its full folder name.
const TRAIL_ABBR = {
    'A.W. Smith Preserve (Fox Rocks)':                  'Fox Rocks',
    'Armbrust Hill Town Park':                          'Armbrust',
    "Barton's Quarry Preserve":                         "Barton's Quarry",
    'Eleanor L. Campbell Preserve (Polly Cove)':        'Polly Cove',
    'Granite Island Preserve & Story Book Trail':       'Granite Island',
    'Grimes Park':                                      'Grimes',
    'Lower Mill River Preserve (Fishhook & Overlook)':  'Mill River',
    'Marcuse Wetland Preserve':                         'Marcuse',
    'Middle Mountain Town Park':                        'Middle MTN',
    'Perry Creek North Preserve':                       'Perry Creek',
    'Round Pond Trail':                                 'Round Pond',
    'Starboard Rock Sanctuary':                         'Starboard',
    'State Beach Town Park':                            'State Beach',
    'Tip Toe Mountain Park':                            'Tiptoe',
    'Watershed Preserve & Wetland Point Trail':         'Watershed',
    'Whitmore Pond Sanctuary':                          'Whitmore',
};
function trailLabel(folder) {
    if (!folder) return '';
    return TRAIL_ABBR[folder] || String(folder).replace(/\s+/g, ' ').trim();
}

function formatIssueDate(ts) {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Task 8: an issue is expired once its expiresAt has passed.
// Only Medium/Low submissions get an expiresAt at creation time
// (High never expires). Returns false for issues without an expiresAt.
function isExpired(issue) {
    if (!issue?.expiresAt) return false;
    let ms;
    if (issue.expiresAt.toMillis)  ms = issue.expiresAt.toMillis();
    else if (issue.expiresAt.seconds) ms = issue.expiresAt.seconds * 1000;
    else                              ms = new Date(issue.expiresAt).getTime();
    return Number.isFinite(ms) && ms < Date.now();
}

// Load open issues for the current trail and place pins.
// If Firestore needs a composite index it will log a link to create it.
async function loadTrailIssues(map, prop) {
    try {
        // One simple query (single field) avoids composite index requirements.
        // We then filter client-side for visibility rules. Timeout-guarded so a
        // dead/iffy connection can't hang the map (and we still draw offline pins).
        const snap = await withTimeout(db.collection('issues')
            .where('trailName', '==', prop.folder)
            .get(), 8000);
        const uid     = currentOwl?.uid;
        const isAdmin = currentOwl?.isAdmin;
        snap.forEach(doc => {
            const d = doc.data();
            // Auto-expiry: skip stale Medium/Low reports automatically.
            // Admins still see them via Manage All Issues for cleanup.
            if (isExpired(d) && !isAdmin) return;
            if (d.status === 'open') {
                addIssueMarker(map, d, doc.id);
            } else if (d.status === 'pending_approval') {
                // Reporter sees their own pending pin (so it doesn't feel lost);
                // admins see ALL pending pins so they can approve in context.
                if (isAdmin || d.reportedBy?.uid === uid) {
                    addIssueMarker(map, d, doc.id);
                }
            }
            // 'claimed', 'pending_review', 'resolved' deliberately omitted from the map
        });
    } catch (e) {
        console.warn('loadTrailIssues:', e.message);
    }
    // Always overlay any locally-queued offline reports for this trail as dashed
    // "pending" pins, so a volunteer can see where their offline-logged issue
    // sits on the map even before it syncs.
    await addOfflineQueuedPins(map, prop);
}

// Draw dashed pending pins for reports still sitting in the offline queue.
async function addOfflineQueuedPins(map, prop) {
    let items;
    try { items = await offlineGetAll(); } catch (_) { return; }
    if (!items || !items.length) return;
    for (const item of items) {
        const d = item?.data;
        if (!d || d.trailName !== prop.folder) continue;
        if (d.lat == null || d.lng == null) continue;
        addQueuedIssueMarker(map, d, item.id);
    }
}

// A dashed, pulsing pin for an offline-queued issue. Reuses the pending-approval
// look; tapping explains it's saved offline and will post on reconnect.
function addQueuedIssueMarker(map, d, id) {
    const color  = SEVERITY_COLORS[d.severity] || '#666';
    const letter = d.severity ? d.severity[0] : '?';
    const icon = L.divIcon({
        className: '',
        html: `<div class="issue-map-pin pending-approval offline-queued" style="background:${color}">${letter}</div>`,
        iconSize: [30, 30], iconAnchor: [15, 15],
    });
    const target = issueLayerGroup || map;
    const marker = L.marker([d.lat, d.lng], { icon, zIndexOffset: 1500 }).addTo(target);
    marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        // Mid pin-drop → hand off the tap like a normal issue pin.
        if (issuePinMode) {
            if (issueMapClickFn && issueMapRef) { issueMapRef.off('click', issueMapClickFn); issueMapClickFn = null; }
            placePinAndOpenForm(issueMapRef || map, d.lat, d.lng);
            return;
        }
        showIssueToast('“' + (d.title || 'Issue') + '” is saved offline — it’ll post automatically when you’re back online.');
    });
    issueMarkers.push(marker);
    return marker;
}

function addIssueMarker(map, issue, issueId) {
    const color    = SEVERITY_COLORS[issue.severity] || '#666';
    const letter   = issue.severity ? issue.severity[0] : '?';
    const isPending = issue.status === 'pending_approval';
    const icon = L.divIcon({
        className: '',
        html: `<div class="issue-map-pin${isPending ? ' pending-approval' : ''}" style="background:${color}">${letter}</div>`,
        iconSize:   [30, 30],
        iconAnchor: [15, 15],
    });
    const target = issueLayerGroup || map;
    const marker = L.marker([issue.lat, issue.lng], { icon, zIndexOffset: 1500 }).addTo(target);
    marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        // If user is mid pin-drop, hand off — don't silently swallow the click.
        if (issuePinMode) {
            if (issueMapClickFn && issueMapRef) {
                issueMapRef.off('click', issueMapClickFn);
                issueMapClickFn = null;
            }
            placePinAndOpenForm(issueMapRef || map, issue.lat, issue.lng);
            return;
        }
        openIssueDetail(issue, issueId);
    });
    issueMarkers.push(marker);
    return marker;
}

function openIssueDetail(issue, issueId) {
    currentDetailIssue   = issue;
    currentDetailIssueId = issueId;

    // Badges — severity, category, plus trail
    const badgesEl = document.getElementById('issue-detail-badges');
    badgesEl.innerHTML =
        `<span class="issue-severity-badge ${issue.severity}">${issue.severity}</span>` +
        `<span class="issue-category-badge">${escapeHtml(CATEGORY_LABELS[issue.category] || issue.category || '')}</span>` +
        (issue.trailName ? `<span class="issue-trail-badge">${escapeHtml(trailLabel(issue.trailName))}</span>` : '');

    document.getElementById('issue-detail-title').textContent = issue.title;

    const descEl = document.getElementById('issue-detail-desc');
    descEl.textContent  = issue.description || '';
    descEl.style.display = issue.description ? '' : 'none';

    // Visual evidence — show photo if any, else show "No photo available" frame
    const photoEl   = document.getElementById('issue-detail-photo');
    const emptyEl   = document.getElementById('issue-detail-photo-empty');
    const photoUrl  = issue.reportedPhotoUrl || issue.completionPhotoUrl || null;
    if (photoUrl) {
        photoEl.src = photoUrl;
        photoEl.classList.remove('hidden');
        if (emptyEl) emptyEl.style.display = 'none';
    } else {
        photoEl.src = '';
        photoEl.classList.add('hidden');
        if (emptyEl) emptyEl.style.display = '';
    }

    const dateStr    = formatIssueDate(issue.reportedAt);
    const reporterName = issue.reportedBy?.displayName || 'An Owl';
    document.getElementById('issue-detail-meta').innerHTML =
        `Reported by <strong>${escapeHtml(reporterName)}</strong>${dateStr ? ' · ' + dateStr : ''}`;

    // Embedded mini-map — limited zoom, just the trail polyline + this one pin
    setupIssueDetailMiniMap(issue);

    renderVoteButtons(issue);
    renderComments(issue);

    // Edit button — visible to admins (any issue) and the reporter (their own).
    const editBtn = document.getElementById('issue-detail-edit-btn');
    if (editBtn) {
        const canEdit = !!currentOwl && (currentOwl.isAdmin || issue.reportedBy?.uid === currentOwl.uid);
        editBtn.classList.toggle('hidden', !canEdit);
    }

    document.getElementById('issue-detail-panel').classList.remove('hidden');
}

// ── Comments ─────────────────────────────────────────────────
function renderComments(issue) {
    const list      = document.getElementById('issue-comments-list');
    const countEl   = document.getElementById('issue-comments-count');
    const sectionEl = document.getElementById('issue-comments-section');
    if (!list || !countEl || !sectionEl) return;

    // Always reset to collapsed when opening a fresh issue
    sectionEl.classList.add('hidden');

    const comments = Array.isArray(issue.comments) ? issue.comments : [];
    countEl.textContent = comments.length;

    if (comments.length === 0) {
        list.innerHTML = '<p class="issue-comments-empty">No comments yet — be the first to chime in.</p>';
    } else {
        // Sort oldest first; newest at the bottom (chat-style)
        const sorted = comments.slice().sort((a, b) => (tsMillis(a.ts) || 0) - (tsMillis(b.ts) || 0));
        list.innerHTML = sorted.map(c => {
            const name     = escapeHtml(c.displayName || 'An Owl');
            const initials = (c.displayName || 'OW').split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2) || 'OW';
            const time     = timeAgo(tsMillis(c.ts));
            return `
                <div class="issue-comment">
                    <div class="issue-comment-avatar">${escapeHtml(initials)}</div>
                    <div class="issue-comment-body">
                        <div class="issue-comment-byline">
                            <span class="issue-comment-name">${name}</span>
                            <span class="issue-comment-time">${time}</span>
                        </div>
                        <p class="issue-comment-text">${escapeHtml(c.text || '')}</p>
                    </div>
                </div>`;
        }).join('');
    }
}

async function postComment() {
    if (!currentOwl || !currentDetailIssueId) return;
    const inputEl  = document.getElementById('issue-comment-input');
    const sendBtn  = document.getElementById('issue-comment-send');
    const text     = (inputEl?.value || '').trim();
    if (!text) return;

    sendBtn.disabled = true;
    sendBtn.textContent = 'Posting…';

    const newComment = {
        uid:         currentOwl.uid,
        displayName: currentOwl.displayName || currentOwl.email,
        text,
        ts:          firebase.firestore.Timestamp.now(),  // arrayUnion can't take serverTimestamp
    };

    // Optimistic UI
    const issue = currentDetailIssue;
    issue.comments = [...(issue.comments || []), newComment];
    renderComments(issue);
    // Keep the section open after posting
    document.getElementById('issue-comments-section').classList.remove('hidden');
    inputEl.value = '';

    try {
        await db.collection('issues').doc(currentDetailIssueId).update({
            comments: firebase.firestore.FieldValue.arrayUnion(newComment),
        });
    } catch (err) {
        console.error('Comment post error:', err);
        // Roll back
        issue.comments = (issue.comments || []).filter(c => c !== newComment);
        renderComments(issue);
        inputEl.value = text;
        showIssueToast('Could not post comment — try again.');
    }

    sendBtn.disabled = false;
    sendBtn.textContent = 'Post';
}

let _detailMiniMap = null;
function setupIssueDetailMiniMap(issue) {
    // Tear down any existing mini-map first (panel may be reopened)
    teardownIssueDetailMiniMap();

    const container = document.getElementById('issue-detail-map');
    if (!container) return;

    // No coordinates → hide the map entirely
    if (typeof issue.lat !== 'number' || typeof issue.lng !== 'number') {
        container.style.display = 'none';
        return;
    }
    container.style.display = '';

    // Defer creation to next tick so the panel has finalized layout / size
    requestAnimationFrame(() => {
        _detailMiniMap = L.map(container, {
            center: [issue.lat, issue.lng],
            zoom: 17,
            minZoom: 13,
            maxZoom: 20,
            zoomControl: true,        // show +/- buttons (top-left)
            attributionControl: false,
            scrollWheelZoom: true,    // mouse wheel
            doubleClickZoom: true,    // double-click / double-tap
            touchZoom: true,          // pinch on mobile
            boxZoom: false,
            keyboard: false,
            dragging: true,
            zoomAnimation: true,
            tap: true,
        });
        // Same satellite tiles as the trail detail map
        L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
            maxZoom: 20,
        }).addTo(_detailMiniMap);

        // Pin for this one issue
        const sevColor = SEVERITY_COLORS[issue.severity] || '#666';
        const sevLetter = issue.severity ? issue.severity[0] : '?';
        const icon = L.divIcon({
            className: '',
            html: `<div class="issue-map-pin" style="background:${sevColor}">${sevLetter}</div>`,
            iconSize:   [30, 30],
            iconAnchor: [15, 15],
        });
        L.marker([issue.lat, issue.lng], { icon, zIndexOffset: 2000 }).addTo(_detailMiniMap);

        // Load the trail polyline only (no other issues, no boundary clutter)
        const props = (typeof window.getAllProperties === 'function') ? window.getAllProperties() : [];
        const prop  = props.find(p => p.folder === issue.trailName);
        if (prop && typeof window.loadKml === 'function' && typeof window.propPath === 'function') {
            window.loadKml(window.propPath(prop, prop.trail))
                .then(geo => {
                    if (!_detailMiniMap) return;  // user closed panel before load finished
                    L.geoJSON(geo, {
                        style: { color: '#ff4444', weight: 4, opacity: 0.95 },
                        filter: f => f.geometry.type !== 'Point',
                    }).addTo(_detailMiniMap);
                })
                .catch(err => console.warn('mini-map trail load failed:', err.message));
        }

        // Force size recalc once the panel finishes its slide-up animation
        setTimeout(() => _detailMiniMap?.invalidateSize(), 250);
    });
}
function teardownIssueDetailMiniMap() {
    if (_detailMiniMap) {
        try { _detailMiniMap.remove(); } catch (_) {}
        _detailMiniMap = null;
    }
}

function renderVoteButtons(issue) {
    const upvotes      = issue.upvotes   || [];
    // Downvotes are now per-member (UID array). Legacy issues may have a
    // numeric downvoteCount instead — show that as the display value but
    // any new vote starts populating the proper array.
    const downvotesArr = Array.isArray(issue.downvotes) ? issue.downvotes : null;
    const downCount    = downvotesArr ? downvotesArr.length : (issue.downvoteCount || 0);
    const uid          = currentOwl?.uid;
    const userUpvoted   = !!uid && upvotes.includes(uid);
    const userDownvoted = !!uid && !!downvotesArr && downvotesArr.includes(uid);

    const upBtn = document.getElementById('issue-upvote-btn');
    upBtn.className = 'issue-vote-btn' + (userUpvoted ? ' active-up' : '');
    document.getElementById('issue-upvote-count').textContent = upvotes.length;

    const downBtn = document.getElementById('issue-downvote-btn');
    downBtn.className = 'issue-vote-btn' + (userDownvoted ? ' active-down' : '');
    document.getElementById('issue-downvote-count').textContent = downCount;

    // Disable vote buttons if not logged in
    upBtn.disabled   = !currentOwl;
    downBtn.disabled = !currentOwl;
}

function closeIssueDetail() {
    document.getElementById('issue-detail-panel').classList.add('hidden');
    currentDetailIssue   = null;
    currentDetailIssueId = null;
    teardownIssueDetailMiniMap();
}

// One vote per member: up XOR down XOR none. Casting one removes the other.
async function handleVote(direction) {
    if (!currentOwl || !currentDetailIssueId) return;
    if (direction !== 'up' && direction !== 'down') return;

    const issue        = currentDetailIssue;
    const uid          = currentOwl.uid;
    const prevUpvotes   = issue.upvotes   || [];
    const prevDownvotes = Array.isArray(issue.downvotes) ? issue.downvotes : [];
    const wasUp   = prevUpvotes.includes(uid);
    const wasDown = prevDownvotes.includes(uid);

    // Decide the next state
    let nextUp   = prevUpvotes.slice();
    let nextDown = prevDownvotes.slice();
    const update = {};

    if (direction === 'up') {
        if (wasUp) {
            // Toggle off
            nextUp = nextUp.filter(u => u !== uid);
            update.upvotes = firebase.firestore.FieldValue.arrayRemove(uid);
        } else {
            nextUp.push(uid);
            update.upvotes = firebase.firestore.FieldValue.arrayUnion(uid);
            if (wasDown) {
                nextDown = nextDown.filter(u => u !== uid);
                update.downvotes = firebase.firestore.FieldValue.arrayRemove(uid);
            }
        }
    } else { // 'down'
        if (wasDown) {
            nextDown = nextDown.filter(u => u !== uid);
            update.downvotes = firebase.firestore.FieldValue.arrayRemove(uid);
        } else {
            nextDown.push(uid);
            update.downvotes = firebase.firestore.FieldValue.arrayUnion(uid);
            if (wasUp) {
                nextUp = nextUp.filter(u => u !== uid);
                update.upvotes = firebase.firestore.FieldValue.arrayRemove(uid);
            }
        }
    }

    // Optimistic UI
    issue.upvotes   = nextUp;
    issue.downvotes = nextDown;
    renderVoteButtons(issue);

    try {
        await db.collection('issues').doc(currentDetailIssueId).update(update);
    } catch (err) {
        console.error('Vote error:', err);
        // Roll back the optimistic update
        issue.upvotes   = prevUpvotes;
        issue.downvotes = prevDownvotes;
        renderVoteButtons(issue);
        showIssueToast('Could not save vote — try again.');
    }
}

// Wire up detail panel buttons
document.getElementById('issue-detail-close').addEventListener('click', closeIssueDetail);
document.getElementById('issue-detail-backdrop').addEventListener('click', closeIssueDetail);
document.getElementById('issue-upvote-btn').addEventListener('click',   () => handleVote('up'));
document.getElementById('issue-downvote-btn').addEventListener('click', () => handleVote('down'));
document.getElementById('issue-detail-edit-btn')?.addEventListener('click', openIssueEdit);

// Comments toggle + send
document.getElementById('issue-comments-btn').addEventListener('click', () => {
    const sectionEl = document.getElementById('issue-comments-section');
    sectionEl.classList.toggle('hidden');
    if (!sectionEl.classList.contains('hidden')) {
        // Scroll the comments section into view inside the sheet
        sectionEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});
document.getElementById('issue-comment-send').addEventListener('click', postComment);
document.getElementById('issue-comment-input').addEventListener('keydown', (e) => {
    // Cmd/Ctrl+Enter to post
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        postComment();
    }
});

// ── Task Browser — slot-machine drives a real trail filter ─────
let allTasks            = [];
let offlineQueuedTasks  = [];       // reports still in the local offline queue
let editingOfflineId    = null;     // IndexedDB id of the queued item being edited
let activeTrailFilter   = '__all';  // '__all' or a trail folder name
let urgentOnly          = false;

// Called by app.js every time the tasks view is shown
window.onTasksViewShown = () => loadTasks();

async function loadTasks() {
    const feedEl    = document.getElementById('tasks-feed');
    const emptyEl   = document.getElementById('tasks-empty');
    const loadingEl = document.getElementById('tasks-loading');
    if (!feedEl) return;

    updateTasksOfflineTitle();

    feedEl.innerHTML = '';
    emptyEl.classList.add('hidden');
    loadingEl.classList.remove('hidden');

    try {
        // One fetch powers all three tabs; client-side filtering per tab.
        // Timeout-guarded so a dead connection can't hang the spinner forever
        // (we still render any locally-queued offline reports below).
        const snap = await withTimeout(db.collection('issues').get(), 8000);
        const isAdmin = currentOwl?.isAdmin;
        allTasks = [];
        snap.forEach(doc => {
            const d = doc.data();
            if (isExpired(d) && !isAdmin) return;
            allTasks.push({ id: doc.id, ...d });
        });
    } catch (e) {
        console.error('loadTasks error:', e);
    }

    // Reports logged offline live only in the local IndexedDB queue until they
    // sync. Surface them on the Tasks page so they can be edited/removed if
    // someone logged one incorrectly.
    try { offlineQueuedTasks = (await offlineGetAll()) || []; }
    catch (_) { offlineQueuedTasks = []; }

    loadingEl.classList.add('hidden');
    renderTasks();
}

// Tasks title shows a red "offline" tag when there's no connection.
function updateTasksOfflineTitle() {
    const el = document.getElementById('tasks-topbar-title');
    if (!el) return;
    el.innerHTML = navigator.onLine
        ? 'Tasks'
        : 'Tasks — <span class="tasks-offline-tag">offline</span>';
}
window.addEventListener('online',  updateTasksOfflineTitle);
window.addEventListener('offline', updateTasksOfflineTitle);

function renderTasks() {
    const callout = document.getElementById('tasks-callout');
    const bar     = document.getElementById('trail-filter-bar');
    if (callout) callout.style.display = '';
    if (bar)     bar.style.display     = '';
    return renderTrailGrouped();
}

function renderTrailGrouped() {
    const feedEl  = document.getElementById('tasks-feed');
    const emptyEl = document.getElementById('tasks-empty');
    if (!feedEl) return;
    feedEl.innerHTML = '';

    // Locally-queued offline reports first, so they're easy to find and fix.
    const offlineCount = renderOfflineQueuedSection(feedEl);

    const uid = currentOwl?.uid;

    // Open work pool. Only admin-approved issues ('open'/'claimed') appear here.
    // A non-admin's new report stays 'pending_approval' and is hidden from the
    // Tasks list — for everyone, including its reporter — until an admin
    // approves it in the admin panel. Once a volunteer marks an issue Fixed it
    // becomes 'pending_review' and likewise leaves the Tasks page, living only
    // in the admin panel until an admin marks it Resolved.
    const fullPool = allTasks.filter(t => {
        return t.status === 'open' || t.status === 'claimed';
    });

    // Group ALL trails (for the slot machine + callout — counts must reflect everything)
    const byTrail = new Map();
    fullPool.forEach(t => {
        const k = t.trailName || '(unknown trail)';
        if (!byTrail.has(k)) byTrail.set(k, []);
        byTrail.get(k).push(t);
    });

    // Sort within each trail: High → Medium → Low, then upvotes
    const severityOrder = { High: 0, Medium: 1, Low: 2 };
    byTrail.forEach(list => list.sort((a, b) => {
        const sd = (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3);
        if (sd !== 0) return sd;
        return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
    }));

    // Slot-machine + callout reflect the FULL pool, before filters apply
    renderTrailSlotMachine(byTrail);
    renderCallout(fullPool);

    // Apply filters to derive the feed pool
    const trailFilteredPool = (activeTrailFilter === '__all')
        ? fullPool
        : (byTrail.get(activeTrailFilter) || []);
    const feedPool = urgentOnly
        ? trailFilteredPool.filter(t => t.severity === 'High')
        : trailFilteredPool;

    if (feedPool.length === 0) {
        // If there are offline cards above, don't show the "all clear" empty
        // message — the page isn't actually empty.
        if (offlineCount > 0) { emptyEl.classList.add('hidden'); return; }
        if (urgentOnly && trailFilteredPool.length > 0) {
            emptyEl.textContent = 'No urgent tasks here — nice and quiet.';
        } else if (activeTrailFilter !== '__all') {
            emptyEl.textContent = `${trailLabel(activeTrailFilter)} is all clear right now.`;
        } else {
            emptyEl.textContent = 'No open tasks right now — trails are looking good!';
        }
        emptyEl.classList.remove('hidden');
        return;
    }
    emptyEl.classList.add('hidden');

    if (activeTrailFilter === '__all') {
        // "All Trails" mode: grouped by trail with sticky headers
        const groupsToShow = new Map();
        feedPool.forEach(t => {
            const k = t.trailName || '(unknown trail)';
            if (!groupsToShow.has(k)) groupsToShow.set(k, []);
            groupsToShow.get(k).push(t);
        });
        const sortedTrails = Array.from(groupsToShow.entries()).sort(([a], [b]) =>
            trailLabel(a).localeCompare(trailLabel(b))
        );
        sortedTrails.forEach(([trailName, list]) => {
            const header = document.createElement('div');
            header.className = 'trail-group-header';
            header.id = 'trail-anchor-' + slugifyTrail(trailName);
            header.innerHTML = `
                <span class="trail-group-name">${escapeHtml(trailLabel(trailName))}</span>
                <span class="trail-group-count">${list.length} ${list.length === 1 ? 'task' : 'tasks'}</span>`;
            feedEl.appendChild(header);
            list.forEach(t => feedEl.appendChild(buildTaskCard(t, { hideTrailName: true })));
        });
    } else {
        // Single-trail mode: no group header (slot machine already names the trail).
        // Just stack the cards.
        feedPool.forEach(t => feedEl.appendChild(buildTaskCard(t, { hideTrailName: true })));
    }
}

// ── Offline-queued reports on the Tasks page ─────────────────
// Render a section of reports still sitting in the local offline queue, each
// editable/removable so a mis-logged offline report can be fixed before it syncs.
function renderOfflineQueuedSection(feedEl) {
    if (!offlineQueuedTasks || !offlineQueuedTasks.length) return 0;
    const header = document.createElement('div');
    header.className = 'trail-group-header offline-group-header';
    header.innerHTML =
        `<span class="trail-group-name">📡 Saved offline — not synced</span>` +
        `<span class="trail-group-count">${offlineQueuedTasks.length}</span>`;
    feedEl.appendChild(header);
    offlineQueuedTasks.forEach(item => feedEl.appendChild(buildOfflineTaskCard(item)));
    return offlineQueuedTasks.length;
}

function buildOfflineTaskCard(item) {
    const d        = item.data || {};
    const colors   = { High: '#dc2626', Medium: '#d97706', Low: '#059669' };
    const color    = colors[d.severity] || '#888';
    const catLabel = CATEGORY_LABELS[d.category] || d.category || '';
    const desc     = (d.description || '').trim();

    const card = document.createElement('div');
    card.className = 'task-card offline-queued-card';
    card.innerHTML = `
        <div class="task-severity-bar" style="background:${color}"></div>
        <div class="task-card-body">
            <div class="task-card-head">
                <span class="task-offline-badge">📡 Saved offline · not synced yet</span>
            </div>
            <div class="task-card-head" style="margin-top:6px">
                ${d.severity ? `<span class="task-sev-pill task-sev-${d.severity}">${d.severity}</span>` : ''}
                ${catLabel ? `<span class="task-cat-badge">${escapeHtml(catLabel)}</span>` : ''}
            </div>
            <h3 class="task-card-title">${escapeHtml(d.title || '(no title)')}</h3>
            ${desc ? `<p class="task-card-desc">${escapeHtml(desc)}</p>` : ''}
            ${item.photoBlob ? `<p class="task-card-desc task-offline-photo-note">📷 Photo attached — uploads when you’re back online</p>` : ''}
            <div class="task-card-meta-line">
                ${d.trailName ? `<span class="task-card-trail">${escapeHtml(trailLabel(d.trailName))}</span>` : ''}
            </div>
            <div class="task-action-row">
                <button class="task-info-btn"           data-action="edit-offline">✏️ Edit</button>
                <button class="task-offline-delete-btn" data-action="delete-offline">🗑 Delete</button>
            </div>
        </div>`;
    card.querySelector('[data-action="edit-offline"]').addEventListener('click', () => openOfflineEdit(item.id));
    card.querySelector('[data-action="delete-offline"]').addEventListener('click', () => deleteOfflineQueued(item.id));
    return card;
}

// Open the shared edit sheet for a queued offline report (saves to IndexedDB,
// not Firestore — the item hasn't synced yet).
function openOfflineEdit(queueId) {
    const item = offlineQueuedTasks.find(i => i.id === queueId);
    if (!item) return;
    editingOfflineId = queueId;
    adminEditId = null;
    populateEditPanel(item.data || {}, null);
}

async function saveOfflineEdit() {
    const errorEl  = document.getElementById('admin-edit-error');
    const saveBtn  = document.getElementById('admin-edit-save-btn');
    const title    = document.getElementById('admin-edit-title').value.trim();
    const category = document.getElementById('admin-edit-category').value;
    const desc     = document.getElementById('admin-edit-desc').value.trim();

    if (!title)             { errorEl.textContent = 'Title can’t be empty.'; return; }
    if (!adminEditSeverity) { errorEl.textContent = 'Please choose a severity.'; return; }

    const item = offlineQueuedTasks.find(i => i.id === editingOfflineId);
    if (!item) { closeAdminEdit(); return; }

    errorEl.textContent = '';
    saveBtn.disabled = true; saveBtn.textContent = 'Saving…';
    Object.assign(item.data, { title, category, severity: adminEditSeverity, description: desc || '' });
    try {
        await offlinePut(item);          // persist the edit back to the queue
        closeAdminEdit();
        renderTasks();
        showIssueToast('Offline report updated ✓');
    } catch (e) {
        console.error('saveOfflineEdit error:', e);
        errorEl.textContent = 'Could not save — please try again.';
        saveBtn.disabled = false; saveBtn.textContent = 'Save Changes';
    }
}

async function deleteOfflineQueued(queueId) {
    const ok = await confirmAction(
        'Delete this offline report?',
        "It hasn't synced yet — deleting removes it permanently before it ever posts.",
        'Yes, delete'
    );
    if (!ok) return;
    try { await offlineDelete(queueId); } catch (_) { /* already gone */ }
    offlineQueuedTasks = offlineQueuedTasks.filter(i => i.id !== queueId);
    renderTasks();
    showIssueToast('Offline report deleted.');
}

// Dynamic actionable callout — replaces the dumb stat strip with a
// single recommendation that adapts to the current state.
function renderCallout(fullPool) {
    const el = document.getElementById('tasks-callout');
    if (!el) return;
    el.classList.remove('callout-urgent', 'callout-clear', 'callout-positive');
    el.disabled = false;
    el.onclick = null;

    const total  = fullPool.length;
    const urgent = fullPool.filter(t => t.severity === 'High').length;

    if (total === 0) {
        // Whole island is clear
        el.innerHTML = `<span class="callout-text">🌲 All trails are looking good. Thanks Owls.</span>`;
        el.classList.add('callout-positive');
        el.disabled = true;
        return;
    }
    if (urgent === 0) {
        // Open tasks exist but none urgent
        el.innerHTML = `<span class="callout-text">✅ Nothing urgent — pick a trail to browse.</span>`;
        el.classList.add('callout-clear');
        el.disabled = true;
        return;
    }
    if (urgentOnly) {
        // Filter is on — offer to clear it
        el.innerHTML = `<span class="callout-text">🔥 Showing ${urgent} urgent ${urgent === 1 ? 'task' : 'tasks'}</span><span class="callout-action">Show all ✕</span>`;
        el.classList.add('callout-urgent');
        el.onclick = () => { urgentOnly = false; renderTasks(); };
        return;
    }
    // Urgent tasks exist, filter not yet on — invite the user to focus
    el.innerHTML = `<span class="callout-text">🔥 ${urgent} urgent ${urgent === 1 ? 'task needs' : 'tasks need'} attention</span><span class="callout-action">Focus →</span>`;
    el.classList.add('callout-urgent');
    el.onclick = () => { urgentOnly = true; renderTasks(); };
}

// Stable id-safe slug for a trail folder name (used as scroll anchor)
function slugifyTrail(name) {
    return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── Trail filter bar ─────────────────────────────────────────
// Clean horizontal-scrolling pill bar. Tap a pill to filter — no snap,
// no arrows, no scaling. Same UX pattern as the Wildlife page filter.
function renderTrailSlotMachine(byTrail) {
    const bar = document.getElementById('trail-filter-bar');
    if (!bar) return;

    const allProps = (typeof window.getAllProperties === 'function') ? window.getAllProperties() : [];
    const folders = new Set();
    allProps.forEach(p => {
        if (p?.owner === 'mcht') return;
        if (p?.folder) folders.add(p.folder);
    });
    byTrail.forEach((_, name) => folders.add(name));

    const sorted = Array.from(folders).sort((a, b) =>
        trailLabel(a).localeCompare(trailLabel(b))
    );

    let allTotal = 0;
    byTrail.forEach(list => { allTotal += list.length; });

    const allPill = makeFilterPill('__all', 'All Trails', allTotal);
    const trailPills = sorted.map(folder => {
        const count = byTrail.has(folder) ? byTrail.get(folder).length : 0;
        return makeFilterPill(folder, trailLabel(folder), count);
    }).join('');

    bar.innerHTML = allPill + trailPills;

    bar.querySelectorAll('.trail-filter-pill').forEach(el => {
        el.addEventListener('click', () => {
            activeTrailFilter = el.dataset.folder;
            renderTrailGrouped();
            // Scroll the active pill into view (gently)
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });
}

function makeFilterPill(folder, label, count) {
    const isActive = folder === activeTrailFilter;
    const indicator = count > 0
        ? `<span class="trail-filter-count">${count}</span>`
        : `<span class="trail-filter-clear">✓</span>`;
    return `
        <button class="trail-filter-pill${isActive ? ' active' : ''}" type="button" data-folder="${escapeHtml(folder)}">
            <span class="trail-filter-name">${escapeHtml(label)}</span>
            ${indicator}
        </button>`;
}

// (Activity feed removed entirely — Tasks page is the single destination)

// ─── Helpers ──────────────────────────────────────────────────
function latestTaskTs(t) {
    return tsMillis(t.completedAt) || tsMillis(t.claimedAt) || tsMillis(t.approvedAt) || tsMillis(t.reportedAt) || 0;
}
function dateGroup(ms) {
    if (!ms) return 'earlier';
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const ev = new Date(ms);
    ev.setHours(0, 0, 0, 0);
    const days = Math.round((now - ev) / 86400000);
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 7)   return 'thisweek';
    return 'earlier';
}
function timeAgo(ms) {
    if (!ms) return '';
    const sec = Math.floor((Date.now() - ms) / 1000);
    if (sec < 60)        return 'just now';
    if (sec < 3600)      return Math.floor(sec / 60)    + 'm';
    if (sec < 86400)     return Math.floor(sec / 3600)  + 'h';
    if (sec < 604800)    return Math.floor(sec / 86400) + 'd';
    if (sec < 2592000)   return Math.floor(sec / 604800)+ 'w';
    return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function buildTaskCard(task, opts = {}) {
    const colors = { High: '#dc2626', Medium: '#d97706', Low: '#059669' };
    const color  = colors[task.severity] || '#888';
    const uid    = currentOwl?.uid;

    const isPendingApproval = task.status === 'pending_approval';
    const isMyOwnPending    = isPendingApproval && task.reportedBy?.uid === uid;

    let actionHTML;
    if (isMyOwnPending) {
        actionHTML = `<span class="task-review-badge">⏳ Awaiting Approval</span>`;
    } else {
        actionHTML = `
            <button class="task-info-btn"    data-id="${task.id}" data-action="info">Show more info</button>
            <button class="task-resolve-btn" data-id="${task.id}" data-action="resolve">✓ Mark as Fixed</button>`;
    }

    const upvotes    = task.upvotes?.length || 0;
    const dateStr    = formatIssueDate(task.reportedAt);
    const catLabel   = CATEGORY_LABELS[task.category] || task.category || '';
    const sevLabel   = task.severity || '';
    const reportedBy = task.reportedBy?.displayName || '';
    const desc       = (task.description || '').trim();

    // When the card is rendered inside a trail group header, the trail name
    // is already shown above — hide it on the card to avoid redundancy.
    const showTrail = !opts.hideTrailName;

    const card = document.createElement('div');
    card.className = 'task-card';

    card.innerHTML = `
        <div class="task-severity-bar" style="background:${color}"></div>
        <div class="task-card-body">
            <div class="task-card-head">
                <span class="task-sev-pill task-sev-${sevLabel}">${sevLabel}</span>
                <span class="task-cat-badge">${escapeHtml(catLabel)}</span>
                ${upvotes > 0 ? `<span class="task-card-upvotes">👍 ${upvotes}</span>` : ''}
            </div>
            <h3 class="task-card-title">${escapeHtml(task.title)}</h3>
            ${desc ? `<p class="task-card-desc">${escapeHtml(desc)}</p>` : ''}
            ${task.reportedPhotoUrl ? `<div class="img-loading"><img class="task-card-photo" src="${task.reportedPhotoUrl}" alt="Reported photo" loading="lazy" onload="this.parentElement.classList.add('loaded')" onerror="this.parentElement.classList.add('loaded')"></div>` : ''}
            <div class="task-card-meta-line">
                ${showTrail && task.trailName ? `<span class="task-card-trail">${escapeHtml(trailLabel(task.trailName))}</span>` : ''}
                ${reportedBy ? `<span class="task-card-by">Reported by ${escapeHtml(reportedBy)}</span>` : ''}
                <span class="task-card-date">${dateStr}</span>
            </div>
            <div class="task-action-row">${actionHTML}</div>
        </div>`;

    card.querySelector('[data-action="resolve"]')?.addEventListener('click', () => openCompletionSheet(task));
    card.querySelector('[data-action="info"]')?.addEventListener('click',    () => openIssueDetail(task, task.id));
    card.querySelector('.task-card-photo')?.addEventListener('click',        () => openIssueDetail(task, task.id));
    return card;
}

function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// (claimTask / unclaimTask removed — tasks now resolve directly without
//  a claim step, per the trust-based "see it, do it" workflow.)

// Admin: approve a pending submission so it appears on the map
async function approveSubmission(issueId, btn) {
    if (!currentOwl?.isAdmin) return;
    btn.disabled = true;
    const origLabel = btn.textContent;
    btn.textContent = 'Approving…';
    try {
        await db.collection('issues').doc(issueId).update({
            status:     'open',
            approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
            approvedBy: { uid: currentOwl.uid, displayName: currentOwl.displayName || currentOwl.email },
        });
        // Keep both caches in sync (volunteer task list + admin issues list)
        const task = allTasks.find(t => t.id === issueId);
        if (task) { task.status = 'open'; task.approvedAt = new Date(); }
        const adminIssue = allAdminIssues.find(i => i.id === issueId);
        if (adminIssue) { adminIssue.status = 'open'; adminIssue.approvedAt = new Date(); }
        renderTasks();
        if (typeof renderAdminIssues === 'function') renderAdminIssues();
        if (typeof refreshAdminStats === 'function') refreshAdminStats();
        refreshAdminBadge();
        showIssueToast('Approved — now visible on the map ✓');
    } catch (e) {
        console.error('approveSubmission error:', e);
        btn.disabled = false;
        btn.textContent = origLabel;
        showIssueToast('Could not approve — try again.');
    }
}

// (legacy tab switcher removed — Activity is now a small corner link, see below)

// Refresh button on the Tasks header
document.getElementById('tasks-refresh-btn').addEventListener('click', () => {
    const btn = document.getElementById('tasks-refresh-btn');
    btn.classList.add('spinning');
    setTimeout(() => btn.classList.remove('spinning'), 700);
    loadTasks();
});

// (Activity link removed — Tasks page is the single destination)

// ── Task 6: Completion Flow ───────────────────────────────────
let completionTask      = null;
let completionPhotoFile = null;

function openCompletionSheet(task) {
    completionTask      = task;
    completionPhotoFile = null;

    document.getElementById('completion-task-name').textContent      = task.title + ' · ' + trailLabel(task.trailName);
    document.getElementById('completion-note').value                 = '';
    document.getElementById('completion-error').textContent          = '';
    document.getElementById('completion-photo-input').value          = '';
    document.getElementById('completion-photo-preview').src          = '';
    document.getElementById('completion-photo-preview').classList.add('hidden');
    document.getElementById('completion-photo-remove').classList.add('hidden');
    document.getElementById('completion-photo-btn').style.display    = '';
    document.getElementById('completion-progress').classList.add('hidden');
    document.getElementById('completion-progress-fill').style.width  = '0%';
    document.getElementById('completion-submit-btn').disabled        = false;
    document.getElementById('completion-submit-btn').textContent     = 'Mark as Fixed';

    document.getElementById('completion-panel').classList.remove('hidden');
}

function closeCompletionSheet() {
    document.getElementById('completion-panel').classList.add('hidden');
    completionTask      = null;
    completionPhotoFile = null;
}

document.getElementById('completion-cancel-btn').addEventListener('click', closeCompletionSheet);
document.getElementById('completion-backdrop').addEventListener('click',  closeCompletionSheet);

document.getElementById('completion-photo-btn').addEventListener('click', () => {
    document.getElementById('completion-photo-input').click();
});

document.getElementById('completion-photo-input').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    completionPhotoFile = file;
    const reader = new FileReader();
    reader.onload = ev => {
        const preview = document.getElementById('completion-photo-preview');
        preview.src = ev.target.result;
        preview.classList.remove('hidden');
        document.getElementById('completion-photo-remove').classList.remove('hidden');
        document.getElementById('completion-photo-btn').style.display = 'none';
    };
    reader.readAsDataURL(file);
});

document.getElementById('completion-photo-remove').addEventListener('click', () => {
    completionPhotoFile = null;
    document.getElementById('completion-photo-input').value = '';
    document.getElementById('completion-photo-preview').classList.add('hidden');
    document.getElementById('completion-photo-remove').classList.add('hidden');
    document.getElementById('completion-photo-btn').style.display = '';
});

document.getElementById('completion-submit-btn').addEventListener('click', submitCompletion);

// Resize + compress a photo to max 1200px / JPEG 0.82 before uploading
function compressImage(file) {
    return new Promise(resolve => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            const MAX = 1200;
            let { width, height } = img;
            if (width > MAX || height > MAX) {
                if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
                else                { width  = Math.round(width  * MAX / height); height = MAX; }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width; canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            canvas.toBlob(blob => resolve(blob || file), 'image/jpeg', 0.82);
        };
        img.onerror = () => resolve(file); // fall back to original on error
        img.src = url;
    });
}

// Upload to Cloudinary via unsigned preset — returns the secure image URL
function uploadToCloudinary(blob, onProgress) {
    return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('file', blob, 'completion.jpg');
        form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);

        xhr.upload.addEventListener('progress', e => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText).secure_url);
            } else {
                reject(new Error('Cloudinary error ' + xhr.status));
            }
        });
        xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
        xhr.send(form);
    });
}

async function submitCompletion() {
    if (!completionTask || !currentOwl) return;

    const submitBtn  = document.getElementById('completion-submit-btn');
    const errorEl    = document.getElementById('completion-error');
    const progressEl = document.getElementById('completion-progress');
    const fillEl     = document.getElementById('completion-progress-fill');
    const labelEl    = document.getElementById('completion-progress-label');
    const note       = document.getElementById('completion-note').value.trim();
    const issueId    = completionTask.id;

    errorEl.textContent   = '';
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Submitting…';

    let photoUrl = null;

    if (completionPhotoFile) {
        try {
            progressEl.classList.remove('hidden');
            fillEl.style.width  = '0%';
            labelEl.textContent = 'Compressing photo…';

            const compressed    = await compressImage(completionPhotoFile);
            labelEl.textContent = 'Uploading photo…';

            photoUrl = await uploadToCloudinary(compressed, pct => {
                fillEl.style.width  = pct + '%';
                labelEl.textContent = `Uploading… ${pct}%`;
            });

            fillEl.style.width  = '100%';
            labelEl.textContent = 'Upload complete ✓';
        } catch (err) {
            console.error('Photo upload failed:', err);
            errorEl.textContent   = 'Photo upload failed — try again or remove the photo.';
            progressEl.classList.add('hidden');
            submitBtn.disabled    = false;
            submitBtn.textContent = 'Mark as Fixed';
            return;
        }
    }

    try {
        // Audit trail entry — survives even if admin later un-resolves
        const attempt = {
            uid:         currentOwl.uid,
            displayName: currentOwl.displayName || currentOwl.email,
            completedAt: new Date(),   // arrayUnion can't take serverTimestamp
            note:        note || null,
            photoUrl:    photoUrl,
            outcome:     'fixed',
        };

        // Volunteer marks it Fixed → goes to the admin panel for final
        // resolution. We record who/when/photo/note as review evidence, but
        // do NOT set resolvedAt/resolvedBy — that's the admin's "Mark Resolved".
        const update = {
            status:             'pending_review',
            completedBy:        { uid: currentOwl.uid, displayName: currentOwl.displayName || currentOwl.email },
            completedAt:        firebase.firestore.FieldValue.serverTimestamp(),
            completionNote:     note || null,
            completionPhotoUrl: photoUrl,
            attempts:           firebase.firestore.FieldValue.arrayUnion(attempt),
        };
        await db.collection('issues').doc(issueId).update(update);

        // Drop from local cache — once Fixed it leaves the Tasks page entirely
        // and lives only in the admin panel until an admin resolves it.
        const idx = allTasks.findIndex(t => t.id === issueId);
        if (idx !== -1) allTasks.splice(idx, 1);

        closeCompletionSheet();
        renderTasks();
        showIssueToast('Marked as fixed — sent to admin for review ✓');
    } catch (err) {
        console.error('submitCompletion error:', err);
        errorEl.textContent   = 'Could not save — check your connection and try again.';
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Mark as Fixed';
    }
}

// (approveTask removed — admin "approve completion" now lives in
//  Manage All Issues panel via adminResolveIssue.)

// Admin: reject → back to open queue. Works from any context (admin panel etc.)
async function rejectTask(issueId, btn) {
    if (!currentOwl?.isAdmin) return;
    const origLabel = btn.textContent;
    btn.disabled    = true;
    btn.textContent = 'Sending back…';

    try {
        // Free the issue for re-claim, but DO NOT touch attempts[] —
        // that's the audit trail volunteers earn lifetime credit from.
        await db.collection('issues').doc(issueId).update({
            status:             'open',
            claimedBy:          null,
            claimedAt:          null,
            completedBy:        null,
            completedAt:        null,
            completionNote:     null,
            completionPhotoUrl: null,
        });
        // Sync both caches
        const task = allTasks.find(t => t.id === issueId);
        if (task) {
            task.status = 'open';
            task.claimedBy = task.claimedAt = task.completedBy = task.completionNote = task.completionPhotoUrl = null;
        }
        const adminIssue = allAdminIssues.find(i => i.id === issueId);
        if (adminIssue) {
            adminIssue.status = 'open';
            adminIssue.claimedBy = adminIssue.completedBy = null;
        }
        if (typeof renderTasks === 'function')        renderTasks();
        if (typeof renderAdminIssues === 'function') renderAdminIssues();
        if (typeof refreshAdminStats === 'function') refreshAdminStats();
        showIssueToast('Sent back to queue.');
    } catch (err) {
        console.error('rejectTask error:', err);
        btn.disabled    = false;
        btn.textContent = origLabel;
        showIssueToast('Could not send back — try again.');
    }
}

// ── Toast notification ────────────────────────────────────────
function showIssueToast(message) {
    const toast = document.createElement('div');
    toast.className   = 'issue-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('visible')));
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 280);
    }, 2500);
}

// ============================================================
// Task 7: Member Profile + Admin Panel
// ============================================================

// ── Generic confirm dialog ────────────────────────────────────
let _confirmResolver = null;
function confirmAction(title, msg, yesLabel = 'Yes, do it') {
    return new Promise(resolve => {
        _confirmResolver = resolve;
        document.getElementById('confirm-dialog-title').textContent = title;
        document.getElementById('confirm-dialog-msg').textContent   = msg;
        document.getElementById('confirm-dialog-yes').textContent   = yesLabel;
        document.getElementById('confirm-dialog').classList.remove('hidden');
    });
}
function _resolveConfirm(answer) {
    document.getElementById('confirm-dialog').classList.add('hidden');
    if (_confirmResolver) { _confirmResolver(answer); _confirmResolver = null; }
}
document.getElementById('confirm-dialog-yes').addEventListener('click',     () => _resolveConfirm(true));
document.getElementById('confirm-dialog-no').addEventListener('click',      () => _resolveConfirm(false));
document.getElementById('confirm-dialog-overlay').addEventListener('click', () => _resolveConfirm(false));

// ── Member profile / questionnaire ────────────────────────────
function updateWaiverPill() {
    const pill = document.getElementById('owl-waiver-status');
    if (!pill || !currentOwl) return;
    if (currentOwl.waiverSigned) {
        pill.textContent = 'Waiver ✓';
        pill.classList.remove('owl-waiver-incomplete');
        pill.classList.add('owl-waiver-complete');
    } else {
        pill.textContent = 'No Waiver';
        pill.classList.remove('owl-waiver-complete');
        pill.classList.add('owl-waiver-incomplete');
    }
    updateProfileStatusPill();
}

// "Profile Complete" pill — true only when all required volunteer-info
// fields are filled (waiver is tracked separately).
function isProfileComplete(owl) {
    const p = owl?.profile;
    if (!p) return false;
    const ec = p.emergencyContact || {};
    return !!(p.fullName && p.phoneNumber && p.address && p.dateOfBirth && ec.name && ec.phone);
}
function updateProfileStatusPill() {
    const pill = document.getElementById('owl-profile-status');
    if (!pill || !currentOwl) return;
    if (isProfileComplete(currentOwl)) {
        pill.textContent = 'Profile Complete';
        pill.classList.remove('incomplete');
        pill.classList.add('complete');
    } else {
        pill.textContent = 'Profile Incomplete';
        pill.classList.remove('complete');
        pill.classList.add('incomplete');
    }
}

function openMemberProfile() {
    if (!currentOwl) return;
    const p = currentOwl.profile || {};
    const ec = p.emergencyContact || {};

    document.getElementById('member-fullname').value     = p.fullName     || currentOwl.displayName || '';
    document.getElementById('member-phone').value        = p.phoneNumber  || '';
    document.getElementById('member-address').value      = p.address      || '';
    document.getElementById('member-dob').value          = p.dateOfBirth  || '';
    document.getElementById('member-ec-name').value      = ec.name        || '';
    document.getElementById('member-ec-phone').value     = ec.phone       || '';
    document.getElementById('member-ec-relation').value  = ec.relation    || '';
    document.getElementById('member-experience').value   = p.experience   || '';
    document.getElementById('member-availability').value = p.availability || '';
    document.getElementById('member-waiver-check').checked = !!currentOwl.waiverSigned;
    document.getElementById('member-chainsaw-check').checked = !!currentOwl.chainsawCertified;
    document.getElementById('member-profile-error').textContent = '';

    // Login PIN — prefilled (masked) so the eye toggle can reveal the current value.
    const pinInput = document.getElementById('owl-set-pin-input');
    const pinEye   = document.getElementById('owl-pin-eye');
    if (pinInput) { pinInput.value = currentOwl.pin || ''; pinInput.type = 'password'; }
    if (pinEye)   pinEye.classList.remove('revealed');

    // Profile photo — show current photo or initials; reset pending state.
    memberPhotoFile = null; memberPhotoCleared = false;
    const raw      = currentOwl.displayName || currentOwl.email || 'OW';
    const initials = raw.split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2) || 'OW';
    const mPreview = document.getElementById('member-photo-preview');
    const mInit    = document.getElementById('member-photo-initials');
    const mRemove  = document.getElementById('member-photo-remove');
    if (mInit) mInit.textContent = initials;
    if (currentOwl.photoUrl) {
        mPreview.src = currentOwl.photoUrl;
        mPreview.classList.remove('hidden');
        mInit.classList.add('hidden');
        mRemove.classList.remove('hidden');
    } else {
        mPreview.src = '';
        mPreview.classList.add('hidden');
        mInit.classList.remove('hidden');
        mRemove.classList.add('hidden');
    }

    document.getElementById('member-profile-panel').classList.remove('hidden');
}

function closeMemberProfile() {
    document.getElementById('member-profile-panel').classList.add('hidden');
}

async function saveMemberProfile() {
    if (!currentOwl) return;
    const saveBtn = document.getElementById('member-profile-save-btn');
    const errorEl = document.getElementById('member-profile-error');
    saveBtn.disabled = true; saveBtn.textContent = 'Saving…'; errorEl.textContent = '';

    // Validate the PIN up front (if changed) so we don't half-save.
    const pinVal     = (document.getElementById('owl-set-pin-input').value || '').trim();
    const pinChanged = pinVal !== (currentOwl.pin || '');
    if (pinChanged && !/^\d{4}$/.test(pinVal)) {
        errorEl.textContent = 'Login PIN must be exactly 4 digits.';
        saveBtn.disabled = false; saveBtn.textContent = 'Save My Info';
        return;
    }

    const profile = {
        fullName:     document.getElementById('member-fullname').value.trim(),
        phoneNumber:  document.getElementById('member-phone').value.trim(),
        address:      document.getElementById('member-address').value.trim(),
        dateOfBirth:  document.getElementById('member-dob').value || null,
        emergencyContact: {
            name:     document.getElementById('member-ec-name').value.trim(),
            phone:    document.getElementById('member-ec-phone').value.trim(),
            relation: document.getElementById('member-ec-relation').value.trim(),
        },
        experience:   document.getElementById('member-experience').value || null,
        availability: document.getElementById('member-availability').value.trim(),
    };
    const waiverSigned       = document.getElementById('member-waiver-check').checked;
    const chainsawCertified  = document.getElementById('member-chainsaw-check').checked;

    const update = { profile, waiverSigned, chainsawCertified };
    if (waiverSigned && !currentOwl.waiverSigned) {
        update.waiverSignedAt = firebase.firestore.FieldValue.serverTimestamp();
    } else if (!waiverSigned) {
        update.waiverSignedAt = null;
    }
    if (chainsawCertified && !currentOwl.chainsawCertified) {
        update.chainsawCertifiedAt = firebase.firestore.FieldValue.serverTimestamp();
    } else if (!chainsawCertified) {
        update.chainsawCertifiedAt = null;
    }

    // Profile photo: upload a newly chosen one, or clear it if removed.
    if (memberPhotoFile) {
        try {
            const compressed = await compressImage(memberPhotoFile);
            update.photoUrl = await uploadToCloudinary(compressed, function(){});
        } catch (e) {
            console.error('Profile photo upload failed:', e);
            errorEl.textContent = 'Photo upload failed — try again or remove the photo.';
            saveBtn.disabled = false; saveBtn.textContent = 'Save My Info';
            return;
        }
    } else if (memberPhotoCleared) {
        update.photoUrl = null;
    }

    try {
        await db.collection('users').doc(currentOwl.uid).update(update);
        Object.assign(currentOwl, { profile, waiverSigned, chainsawCertified });
        if ('photoUrl' in update) currentOwl.photoUrl = update.photoUrl;
        memberPhotoFile = null; memberPhotoCleared = false;
        if (waiverSigned && !currentOwl.waiverSignedAt) currentOwl.waiverSignedAt = new Date();
        if (chainsawCertified && !currentOwl.chainsawCertifiedAt) currentOwl.chainsawCertifiedAt = new Date();
        updateWaiverPill();
    } catch (err) {
        console.error('saveMemberProfile error:', err);
        errorEl.textContent = 'Could not save — try again.';
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save My Info';
        return;
    }

    // Apply a PIN change last — it touches the auth password, which can fail
    // independently (e.g. needs a recent login). Profile is already saved.
    if (pinChanged) {
        try {
            await auth.currentUser.updatePassword(pinToPassword(pinVal));
            await db.collection('users').doc(currentOwl.uid).set({ pin: pinVal }, { merge: true });
            currentOwl.pin = pinVal;
        } catch (e) {
            errorEl.textContent = (e.code === 'auth/requires-recent-login')
                ? 'Info saved, but to change your PIN please log out and back in first.'
                : 'Info saved, but the PIN could not be updated — try again.';
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save My Info';
            return;
        }
    }

    closeMemberProfile();
    showIssueToast('Profile saved ✓');
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save My Info';
}

document.getElementById('owl-edit-profile-btn').addEventListener('click', openMemberProfile);
document.getElementById('member-profile-cancel-btn').addEventListener('click', closeMemberProfile);
document.getElementById('member-profile-backdrop').addEventListener('click',  closeMemberProfile);
document.getElementById('member-profile-save-btn').addEventListener('click',  saveMemberProfile);

// ── Profile photo picker (saved with "Save My Info") ───────────
let memberPhotoFile    = null;   // newly chosen file pending upload
let memberPhotoCleared = false;  // user removed their existing photo

document.getElementById('member-photo-btn').addEventListener('click', () => {
    document.getElementById('member-photo-input').click();
});
document.getElementById('member-photo-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    memberPhotoFile = file;
    memberPhotoCleared = false;
    const reader = new FileReader();
    reader.onload = ev => {
        const preview = document.getElementById('member-photo-preview');
        preview.src = ev.target.result;
        preview.classList.remove('hidden');
        document.getElementById('member-photo-initials').classList.add('hidden');
        document.getElementById('member-photo-remove').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
});
document.getElementById('member-photo-remove').addEventListener('click', () => {
    memberPhotoFile = null;
    memberPhotoCleared = true;
    document.getElementById('member-photo-input').value = '';
    document.getElementById('member-photo-preview').src = '';
    document.getElementById('member-photo-preview').classList.add('hidden');
    document.getElementById('member-photo-initials').classList.remove('hidden');
    document.getElementById('member-photo-remove').classList.add('hidden');
});

// ── Live availability toggles (no save button) ─────────────────
// Day numbers match JS getDay(): 0=Sun … 6=Sat. Stored as a number array.
// Seasons: 'summer' | 'offseason'. Stored as a string array.
function refreshAvailabilityToggles() {
    const days    = currentOwl?.availableDays    || [];
    const seasons = currentOwl?.availableSeasons || [];
    document.querySelectorAll('#availability-day-toggles .day-toggle').forEach(btn => {
        const d = parseInt(btn.dataset.day, 10);
        btn.classList.toggle('active', days.includes(d));
    });
    document.querySelectorAll('#availability-season-toggles .season-toggle').forEach(btn => {
        btn.classList.toggle('active', seasons.includes(btn.dataset.season));
    });
}

// Generic optimistic toggle helper — used by both day and season pills.
async function liveToggleArrayField(field, value, btn) {
    if (!currentOwl) return;
    const wasActive = btn.classList.contains('active');
    btn.classList.toggle('active', !wasActive);
    try {
        await db.collection('users').doc(currentOwl.uid).update({
            [field]: wasActive
                ? firebase.firestore.FieldValue.arrayRemove(value)
                : firebase.firestore.FieldValue.arrayUnion(value),
        });
        const arr = currentOwl[field] || [];
        currentOwl[field] = wasActive
            ? arr.filter(x => x !== value)
            : Array.from(new Set([...arr, value]));
    } catch (err) {
        console.error(`${field} save error:`, err);
        btn.classList.toggle('active', wasActive);
        showIssueToast('Could not save — try again.');
    }
}

document.getElementById('availability-day-toggles').addEventListener('click', e => {
    const btn = e.target.closest('.day-toggle');
    if (!btn) return;
    liveToggleArrayField('availableDays', parseInt(btn.dataset.day, 10), btn);
});
document.getElementById('availability-season-toggles').addEventListener('click', e => {
    const btn = e.target.closest('.season-toggle');
    if (!btn) return;
    liveToggleArrayField('availableSeasons', btn.dataset.season, btn);
});

// ── Preferred Trails — live-saves, capped at 5 ───────────────
const PREFERRED_TRAILS_MAX = 3;

function renderPreferredTrailToggles() {
    const wrap = document.getElementById('pref-trail-toggles');
    if (!wrap) return;
    wrap.innerHTML = '';

    const allProps = (typeof window.getAllProperties === 'function')
        ? window.getAllProperties()
        : [];
    const folders = allProps
        .filter(p => p?.owner !== 'mcht' && p?.folder)
        .map(p => p.folder)
        .sort((a, b) => trailLabel(a).localeCompare(trailLabel(b)));

    const picked = currentOwl?.preferredTrails || [];
    folders.forEach(folder => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = picked.includes(folder);
        btn.className = 'pref-trail-toggle' + (isActive ? ' active' : '');
        btn.dataset.folder = folder;
        btn.textContent = trailLabel(folder);
        wrap.appendChild(btn);
    });

    updatePrefCount();
}

function updatePrefCount() {
    const el = document.getElementById('owl-pref-count');
    if (!el) return;
    const n = (currentOwl?.preferredTrails || []).length;
    el.textContent = `${n} / ${PREFERRED_TRAILS_MAX}`;
    el.classList.toggle('full', n >= PREFERRED_TRAILS_MAX);
}

document.getElementById('pref-trail-toggles').addEventListener('click', async (e) => {
    const btn = e.target.closest('.pref-trail-toggle');
    if (!btn || !currentOwl) return;
    const folder    = btn.dataset.folder;
    const wasActive = btn.classList.contains('active');
    const picked    = currentOwl.preferredTrails || [];

    // Cap at 5: silently ignore taps that would push us over
    if (!wasActive && picked.length >= PREFERRED_TRAILS_MAX) {
        showIssueToast(`You can pick up to ${PREFERRED_TRAILS_MAX} trails — un-pick one to swap.`);
        return;
    }

    btn.classList.toggle('active', !wasActive);
    try {
        await db.collection('users').doc(currentOwl.uid).update({
            preferredTrails: wasActive
                ? firebase.firestore.FieldValue.arrayRemove(folder)
                : firebase.firestore.FieldValue.arrayUnion(folder),
        });
        currentOwl.preferredTrails = wasActive
            ? picked.filter(x => x !== folder)
            : Array.from(new Set([...picked, folder]));
        updatePrefCount();
    } catch (err) {
        console.error('preferredTrails save error:', err);
        btn.classList.toggle('active', wasActive);
        showIssueToast('Could not save — try again.');
    }
});

// ── Admin: stats ──────────────────────────────────────────────
async function refreshAdminStats() {
    if (!currentOwl?.isAdmin) return;
    try {
        const snap = await db.collection('issues').get();
        let pending = 0;
        snap.forEach(doc => {
            if (doc.data().status === 'pending_approval') pending++;
        });
        document.getElementById('stat-pending').textContent = pending;
        const pendingTile = document.querySelector('.owl-stat-pending');
        if (pendingTile) pendingTile.classList.toggle('has-backlog', pending > 0);
    } catch (err) {
        console.error('refreshAdminStats error:', err);
    }
}

// ── Admin: All Issues panel ───────────────────────────────────
let allAdminIssues       = [];
let adminIssueFilter     = 'all';      // status filter: all/pending_approval/open/resolved/expired
let adminTrailFilter     = '__all';    // trail filter: '__all' or trail folder

async function openAdminIssuesPanel() {
    if (!currentOwl?.isAdmin) return;
    document.getElementById('admin-issues-panel').classList.remove('hidden');
    const listEl    = document.getElementById('admin-issues-list');
    const emptyEl   = document.getElementById('admin-issues-empty');
    const loadingEl = document.getElementById('admin-issues-loading');
    listEl.innerHTML = '';
    emptyEl.classList.add('hidden');
    loadingEl.classList.remove('hidden');

    try {
        const snap = await db.collection('issues').get();
        allAdminIssues = [];
        snap.forEach(doc => allAdminIssues.push({ id: doc.id, ...doc.data() }));
        // Newest first
        allAdminIssues.sort((a, b) => {
            const ta = a.reportedAt?.toMillis?.() || 0;
            const tb = b.reportedAt?.toMillis?.() || 0;
            return tb - ta;
        });
    } catch (err) {
        console.error('loadAdminIssues error:', err);
    }

    loadingEl.classList.add('hidden');
    renderAdminIssues();
}

function renderAdminIssues() {
    const listEl   = document.getElementById('admin-issues-list');
    const emptyEl  = document.getElementById('admin-issues-empty');
    const sweepRow = document.getElementById('admin-sweep-row');
    const sweepBtn = document.getElementById('admin-sweep-expired-btn');
    listEl.innerHTML = '';

    // Always-visible callout: how many submissions need admin approval
    renderAdminCallout(allAdminIssues);

    // Trail filter pill bar — same pattern as Tasks
    renderAdminTrailFilter(allAdminIssues);

    // Apply STATUS filter first (admin-specific), then TRAIL filter
    let filtered = allAdminIssues;
    if (adminIssueFilter === 'expired')      filtered = filtered.filter(isExpired);
    else if (adminIssueFilter !== 'all')      filtered = filtered.filter(i => i.status === adminIssueFilter);
    if (adminTrailFilter !== '__all')         filtered = filtered.filter(i => i.trailName === adminTrailFilter);

    // Sweep button visibility — only when expired filter active AND there's something
    const expiredCount = allAdminIssues.filter(isExpired).length;
    if (sweepRow && sweepBtn) {
        if (expiredCount > 0 && (adminIssueFilter === 'expired' || adminIssueFilter === 'all')) {
            sweepRow.classList.remove('hidden');
            sweepBtn.textContent = `🧹 Sweep ${expiredCount} Expired`;
        } else {
            sweepRow.classList.add('hidden');
        }
    }

    if (filtered.length === 0) {
        emptyEl.classList.remove('hidden');
        return;
    }
    emptyEl.classList.add('hidden');

    // Group by trail and render with sticky headers (mirrors Tasks page)
    const byTrail = new Map();
    filtered.forEach(i => {
        const k = i.trailName || '(unknown trail)';
        if (!byTrail.has(k)) byTrail.set(k, []);
        byTrail.get(k).push(i);
    });

    // Sort within each trail by status urgency (pending → open → resolved), then severity
    const statusOrder = { pending_approval: 0, open: 1, claimed: 2, pending_review: 3, resolved: 4 };
    const sevOrder    = { High: 0, Medium: 1, Low: 2 };
    byTrail.forEach(list => list.sort((a, b) => {
        const sd = (statusOrder[a.status] ?? 5) - (statusOrder[b.status] ?? 5);
        if (sd !== 0) return sd;
        return (sevOrder[a.severity] ?? 3) - (sevOrder[b.severity] ?? 3);
    }));

    const sortedTrails = Array.from(byTrail.entries()).sort(([a], [b]) =>
        trailLabel(a).localeCompare(trailLabel(b))
    );

    const grouped = adminTrailFilter === '__all';
    sortedTrails.forEach(([trailName, list]) => {
        if (grouped) {
            const header = document.createElement('div');
            header.className = 'trail-group-header';
            header.innerHTML = `
                <span class="trail-group-name">${escapeHtml(trailLabel(trailName))}</span>
                <span class="trail-group-count">${list.length} ${list.length === 1 ? 'issue' : 'issues'}</span>`;
            listEl.appendChild(header);
        }
        list.forEach(issue => listEl.appendChild(buildAdminIssueCard(issue)));
    });
}

// Admin-specific callout: surfaces what needs admin action
function renderAdminCallout(pool) {
    const el = document.getElementById('admin-issues-callout');
    if (!el) return;
    el.classList.remove('callout-urgent', 'callout-clear', 'callout-positive');
    el.disabled = false;
    el.onclick = null;

    const pending = pool.filter(i => i.status === 'pending_approval').length;
    const expired = pool.filter(isExpired).length;

    if (pending > 0) {
        el.innerHTML = `<span class="callout-text">⏳ ${pending} ${pending === 1 ? 'submission' : 'submissions'} awaiting your approval</span><span class="callout-action">Focus →</span>`;
        el.classList.add('callout-urgent');
        el.onclick = () => {
            adminIssueFilter = 'pending_approval';
            highlightAdminStatusPill();
            renderAdminIssues();
        };
        return;
    }
    if (expired > 0) {
        el.innerHTML = `<span class="callout-text">🧹 ${expired} expired ${expired === 1 ? 'issue' : 'issues'} ready to sweep</span><span class="callout-action">Review →</span>`;
        el.classList.add('callout-clear');
        el.onclick = () => {
            adminIssueFilter = 'expired';
            highlightAdminStatusPill();
            renderAdminIssues();
        };
        return;
    }
    el.innerHTML = `<span class="callout-text">✅ No admin action needed right now.</span>`;
    el.classList.add('callout-positive');
    el.disabled = true;
}

// Trail filter pill bar — reuses Tasks-page styling for visual continuity
function renderAdminTrailFilter(pool) {
    const bar = document.getElementById('admin-trail-filter-bar');
    if (!bar) return;

    // Apply STATUS filter first so trail counts reflect what the admin is currently viewing
    let scoped = pool;
    if (adminIssueFilter === 'expired')      scoped = scoped.filter(isExpired);
    else if (adminIssueFilter !== 'all')      scoped = scoped.filter(i => i.status === adminIssueFilter);

    const allProps = (typeof window.getAllProperties === 'function') ? window.getAllProperties() : [];
    const folders = new Set();
    allProps.forEach(p => {
        if (p?.owner === 'mcht') return;
        if (p?.folder) folders.add(p.folder);
    });
    scoped.forEach(i => { if (i.trailName) folders.add(i.trailName); });

    const sorted = Array.from(folders).sort((a, b) => trailLabel(a).localeCompare(trailLabel(b)));

    const counts = new Map();
    scoped.forEach(i => {
        if (!i.trailName) return;
        counts.set(i.trailName, (counts.get(i.trailName) || 0) + 1);
    });

    const allHTML = makeAdminFilterPill('__all', 'All Trails', scoped.length);
    const trailHTML = sorted.map(folder =>
        makeAdminFilterPill(folder, trailLabel(folder), counts.get(folder) || 0)
    ).join('');
    bar.innerHTML = allHTML + trailHTML;

    bar.querySelectorAll('.trail-filter-pill').forEach(el => {
        el.addEventListener('click', () => {
            adminTrailFilter = el.dataset.folder;
            renderAdminIssues();
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });
}

function makeAdminFilterPill(folder, label, count) {
    const isActive = folder === adminTrailFilter;
    const indicator = count > 0
        ? `<span class="trail-filter-count">${count}</span>`
        : `<span class="trail-filter-clear">✓</span>`;
    return `
        <button class="trail-filter-pill admin-trail-pill${isActive ? ' active' : ''}" type="button" data-folder="${escapeHtml(folder)}">
            <span class="trail-filter-name">${escapeHtml(label)}</span>
            ${indicator}
        </button>`;
}

function highlightAdminStatusPill() {
    document.querySelectorAll('#admin-status-bar .admin-status-pill').forEach(b => {
        b.classList.toggle('active', b.dataset.status === adminIssueFilter);
    });
}

const STATUS_LABEL = {
    pending_approval: 'Pending Approval',
    open:             'Open',
    claimed:          'Claimed',
    pending_review:   'Fixed · Needs Review',
    resolved:         'Resolved',
};

// Admin issue card — same visual language as a volunteer task card,
// with a status pill in the head row and admin actions inline.
function buildAdminIssueCard(issue) {
    const card = document.createElement('div');
    card.className = 'task-card admin-issue-card-v2';

    const colors = { High: '#dc2626', Medium: '#d97706', Low: '#059669' };
    const sevColor = colors[issue.severity] || '#888';
    const sevLabel = issue.severity || '';
    const statusLbl = STATUS_LABEL[issue.status] || issue.status;
    const catLabel  = CATEGORY_LABELS[issue.category] || issue.category || '';
    const dateStr   = formatIssueDate(issue.reportedAt);
    const reporter  = issue.reportedBy?.displayName || '';
    const expired   = isExpired(issue);
    const desc      = (issue.description || '').trim();

    const isPendingApproval = issue.status === 'pending_approval';
    const isPendingReview   = issue.status === 'pending_review';
    const isResolved        = issue.status === 'resolved';

    if (expired) card.classList.add('admin-issue-card-expired');

    // Volunteer-fixed, awaiting admin sign-off — highlight it clearly so the
    // admin can tell it apart from open/resolved issues at a glance.
    let reviewBlock = '';
    if (isPendingReview) {
        card.classList.add('admin-issue-card-fixed');
        const who   = issue.completedBy?.displayName ? escapeHtml(issue.completedBy.displayName) : 'a volunteer';
        const note  = issue.completionNote
            ? `<p class="task-completion-note">"${escapeHtml(issue.completionNote)}"</p>` : '';
        const photo = issue.completionPhotoUrl
            ? `<img class="task-completion-thumb" src="${issue.completionPhotoUrl}" alt="Fix photo">` : '';
        reviewBlock = `<div class="admin-issue-review">
            <div class="admin-fixed-banner">🛠 Marked fixed by ${who} — tap “Mark Resolved” to confirm</div>
            ${note}${photo}</div>`;
    }

    // Per-status admin actions. "Edit" is available on every issue.
    const editBtn = `<button class="admin-edit-btn" data-id="${issue.id}">Edit</button>`;
    let actions;
    if (isPendingApproval) {
        actions = `
            <button class="admin-approve-btn" data-id="${issue.id}">Approve</button>
            ${editBtn}
            <button class="admin-delete-btn"  data-id="${issue.id}">Reject &amp; Delete</button>`;
    } else if (isPendingReview) {
        actions = `
            <button class="admin-resolve-btn" data-id="${issue.id}">Mark Resolved</button>
            ${editBtn}
            <button class="admin-reject-btn"  data-id="${issue.id}">Send Back</button>
            <button class="admin-delete-btn"  data-id="${issue.id}">Delete</button>`;
    } else if (!isResolved) {
        actions = `
            <button class="admin-resolve-btn" data-id="${issue.id}">Mark Resolved</button>
            ${editBtn}
            <button class="admin-delete-btn"  data-id="${issue.id}">Delete</button>`;
    } else {
        actions = `
            ${editBtn}
            <button class="admin-delete-btn" data-id="${issue.id}">Delete</button>`;
    }

    card.innerHTML = `
        <div class="task-severity-bar" style="background:${sevColor}"></div>
        <div class="task-card-body">
            <div class="task-card-head">
                ${sevLabel ? `<span class="task-sev-pill task-sev-${sevLabel}">${sevLabel}</span>` : ''}
                <span class="task-cat-badge">${escapeHtml(catLabel)}</span>
                <span class="admin-issue-status s-${issue.status}">${statusLbl}</span>
                ${expired ? '<span class="admin-issue-status s-expired">Expired</span>' : ''}
            </div>
            <h3 class="task-card-title">${escapeHtml(issue.title || '(untitled)')}</h3>
            ${desc ? `<p class="task-card-desc">${escapeHtml(desc)}</p>` : ''}
            ${issue.reportedPhotoUrl ? `<div class="img-loading"><img class="task-card-photo admin-reported-photo" src="${issue.reportedPhotoUrl}" alt="Reported photo" loading="lazy" onload="this.parentElement.classList.add('loaded')" onerror="this.parentElement.classList.add('loaded')"></div>` : ''}
            <div class="task-card-meta-line">
                ${issue.trailName ? `<span class="task-card-trail">${escapeHtml(trailLabel(issue.trailName))}</span>` : ''}
                ${reporter ? `<span class="task-card-by">Reported by ${escapeHtml(reporter)}</span>` : ''}
                <span class="task-card-date">${dateStr}</span>
            </div>
            ${reviewBlock}
            <div class="task-action-row admin-issue-actions">${actions}</div>
        </div>`;

    // Tap the reported photo to view it full-size in a new tab.
    card.querySelector('.admin-reported-photo')?.addEventListener('click', () => {
        if (issue.reportedPhotoUrl) window.open(issue.reportedPhotoUrl, '_blank', 'noopener');
    });
    card.querySelector('.admin-approve-btn')?.addEventListener('click', e => approveSubmission(e.currentTarget.dataset.id, e.currentTarget));
    card.querySelector('.admin-resolve-btn')?.addEventListener('click', e => adminResolveIssue(e.currentTarget.dataset.id, e.currentTarget));
    card.querySelector('.admin-reject-btn')?.addEventListener('click',  e => rejectTask(e.currentTarget.dataset.id, e.currentTarget));
    card.querySelector('.admin-edit-btn')?.addEventListener('click',    e => openAdminEdit(e.currentTarget.dataset.id));
    card.querySelector('.admin-delete-btn').addEventListener('click',   e => adminDeleteIssue(e.currentTarget.dataset.id, e.currentTarget));
    return card;
}

async function adminResolveIssue(issueId, btn) {
    if (!currentOwl?.isAdmin) return;
    btn.disabled = true; btn.textContent = 'Working…';
    try {
        await db.collection('issues').doc(issueId).update({
            status:     'resolved',
            resolvedAt: firebase.firestore.FieldValue.serverTimestamp(),
            resolvedBy: { uid: currentOwl.uid, displayName: currentOwl.displayName || currentOwl.email },
        });
        const issue = allAdminIssues.find(i => i.id === issueId);
        if (issue) issue.status = 'resolved';
        renderAdminIssues();
        refreshAdminStats();
        showIssueToast('Issue resolved ✓');
    } catch (err) {
        console.error('adminResolveIssue error:', err);
        btn.disabled = false; btn.textContent = 'Mark Resolved';
        showIssueToast('Could not resolve.');
    }
}

async function adminDeleteIssue(issueId, btn) {
    if (!currentOwl?.isAdmin) return;
    const ok = await confirmAction('Delete issue?', 'This permanently removes the issue and all its data. This cannot be undone.', 'Delete');
    if (!ok) return;
    btn.disabled = true; btn.textContent = 'Deleting…';
    try {
        await db.collection('issues').doc(issueId).delete();
        allAdminIssues = allAdminIssues.filter(i => i.id !== issueId);
        renderAdminIssues();
        refreshAdminStats();
        refreshAdminBadge();
        showIssueToast('Issue deleted.');
    } catch (err) {
        console.error('adminDeleteIssue error:', err);
        btn.disabled = false; btn.textContent = 'Delete';
        showIssueToast('Could not delete — check permissions.');
    }
}

// ── Admin: edit an issue (title / category / severity / description) ──
let adminEditId       = null;
let adminEditSeverity = null;

function populateEditPanel(issue, issueId) {
    adminEditId       = issueId;
    adminEditSeverity = issue.severity || null;

    document.getElementById('admin-edit-trail-name').textContent =
        trailLabel(issue.trailName || '') || '';
    document.getElementById('admin-edit-title').value    = issue.title || '';
    document.getElementById('admin-edit-category').value = issue.category || 'other';
    document.getElementById('admin-edit-desc').value     = issue.description || '';
    document.getElementById('admin-edit-error').textContent = '';

    // Reflect the current severity selection on the buttons.
    document.querySelectorAll('#admin-edit-severity-group .issue-severity-btn').forEach(b => {
        b.className = 'issue-severity-btn';
        if (b.dataset.severity === adminEditSeverity) b.classList.add('selected-' + adminEditSeverity);
    });

    const heading = document.getElementById('admin-edit-heading');
    if (heading) heading.textContent = editingOfflineId ? 'Edit Offline Report' : 'Edit Issue';

    const saveBtn = document.getElementById('admin-edit-save-btn');
    saveBtn.disabled = false; saveBtn.textContent = 'Save Changes';
    document.getElementById('admin-edit-panel').classList.remove('hidden');
}

// Admin-panel edit (admin only) — issue comes from the admin cache.
function openAdminEdit(issueId) {
    if (!currentOwl?.isAdmin) return;
    const issue = allAdminIssues.find(i => i.id === issueId);
    if (!issue) return;
    editingOfflineId = null;
    populateEditPanel(issue, issueId);
}

// Issue-detail edit (Tasks page) — admins on any issue, the reporter on theirs.
function openIssueEdit() {
    const issue = currentDetailIssue, issueId = currentDetailIssueId;
    if (!issue || !issueId || !currentOwl) return;
    if (!(currentOwl.isAdmin || issue.reportedBy?.uid === currentOwl.uid)) return;
    editingOfflineId = null;
    populateEditPanel(issue, issueId);
}

function closeAdminEdit() {
    document.getElementById('admin-edit-panel').classList.add('hidden');
    adminEditId = null;
    editingOfflineId = null;
}

async function saveAdminEdit() {
    // Editing a not-yet-synced offline report → save to the local queue instead.
    if (editingOfflineId) return saveOfflineEdit();
    if (!currentOwl || !adminEditId) return;
    // Find the issue in whichever cache holds it, to check permission + sync.
    const cached = (currentDetailIssue && currentDetailIssueId === adminEditId) ? currentDetailIssue
        : (allAdminIssues.find(i => i.id === adminEditId) || (typeof allTasks !== 'undefined' && allTasks.find(t => t.id === adminEditId)));
    const allowed = currentOwl.isAdmin || cached?.reportedBy?.uid === currentOwl.uid;
    if (!allowed) return;

    const errorEl = document.getElementById('admin-edit-error');
    const saveBtn = document.getElementById('admin-edit-save-btn');
    const title   = document.getElementById('admin-edit-title').value.trim();
    const category = document.getElementById('admin-edit-category').value;
    const desc    = document.getElementById('admin-edit-desc').value.trim();

    if (!title)             { errorEl.textContent = 'Title can’t be empty.'; return; }
    if (!adminEditSeverity) { errorEl.textContent = 'Please choose a severity.'; return; }

    errorEl.textContent = '';
    saveBtn.disabled = true; saveBtn.textContent = 'Saving…';

    const changes = { title, category, severity: adminEditSeverity, description: desc || null };
    try {
        await db.collection('issues').doc(adminEditId).update(changes);
        // Sync every cached copy of this issue.
        [allAdminIssues, (typeof allTasks !== 'undefined' ? allTasks : null)].forEach(arr => {
            const it = arr && arr.find(x => x.id === adminEditId);
            if (it) Object.assign(it, changes);
        });
        const editedId = adminEditId;
        if (currentDetailIssue && currentDetailIssueId === editedId) Object.assign(currentDetailIssue, changes);
        if (typeof renderAdminIssues === 'function') renderAdminIssues();
        if (typeof renderTasks === 'function') renderTasks();
        closeAdminEdit();
        // If the issue detail is open on this issue, refresh it to show the edits.
        const detailPanel = document.getElementById('issue-detail-panel');
        if (currentDetailIssue && currentDetailIssueId === editedId && detailPanel && !detailPanel.classList.contains('hidden')) {
            openIssueDetail(currentDetailIssue, editedId);
        }
        showIssueToast('Issue updated ✓');
    } catch (err) {
        console.error('saveAdminEdit error:', err);
        errorEl.textContent = 'Could not save — please try again.';
        saveBtn.disabled = false; saveBtn.textContent = 'Save Changes';
    }
}

// Severity buttons inside the edit sheet (scoped so they don't touch the report form).
document.getElementById('admin-edit-severity-group').addEventListener('click', (e) => {
    const btn = e.target.closest('.issue-severity-btn');
    if (!btn) return;
    e.currentTarget.querySelectorAll('.issue-severity-btn').forEach(b => (b.className = 'issue-severity-btn'));
    adminEditSeverity = btn.dataset.severity;
    btn.classList.add('selected-' + adminEditSeverity);
});
document.getElementById('admin-edit-save-btn').addEventListener('click', saveAdminEdit);
document.getElementById('admin-edit-cancel-btn').addEventListener('click', closeAdminEdit);
document.getElementById('admin-edit-backdrop').addEventListener('click', closeAdminEdit);

document.getElementById('owl-admin-issues-btn').addEventListener('click', openAdminIssuesPanel);
document.getElementById('admin-issues-back-btn').addEventListener('click', () => {
    document.getElementById('admin-issues-panel').classList.add('hidden');
});
document.getElementById('admin-issues-refresh-btn').addEventListener('click', () => {
    const btn = document.getElementById('admin-issues-refresh-btn');
    btn.classList.add('spinning');
    setTimeout(() => btn.classList.remove('spinning'), 700);
    openAdminIssuesPanel();
});
document.getElementById('admin-status-bar').addEventListener('click', e => {
    const btn = e.target.closest('.admin-status-pill');
    if (!btn) return;
    adminIssueFilter = btn.dataset.status;
    highlightAdminStatusPill();
    renderAdminIssues();
});

// Sweep Expired — bulk-deletes every issue whose expiresAt has passed.
document.getElementById('admin-sweep-expired-btn').addEventListener('click', async () => {
    if (!currentOwl?.isAdmin) return;
    const expired = allAdminIssues.filter(isExpired);
    if (expired.length === 0) return;
    const ok = await confirmAction(
        'Sweep expired issues?',
        `This permanently deletes ${expired.length} expired issue${expired.length === 1 ? '' : 's'} (Medium/Low reports past their 6-month expiry). High-severity issues never expire and won't be touched. This cannot be undone.`,
        `Delete ${expired.length}`
    );
    if (!ok) return;
    const sweepBtn = document.getElementById('admin-sweep-expired-btn');
    sweepBtn.disabled = true;
    sweepBtn.textContent = 'Sweeping…';
    let deleted = 0;
    for (const issue of expired) {
        try {
            await db.collection('issues').doc(issue.id).delete();
            deleted++;
        } catch (err) {
            console.error('Sweep delete failed for', issue.id, err);
        }
    }
    allAdminIssues = allAdminIssues.filter(i => !isExpired(i));
    renderAdminIssues();
    refreshAdminStats();
    sweepBtn.disabled = false;
    showIssueToast(`Swept ${deleted} expired issue${deleted === 1 ? '' : 's'}.`);
});

// ── Admin: Manage Members panel ───────────────────────────────
let allAdminMembers = [];

async function openAdminMembersPanel() {
    if (!currentOwl?.isAdmin) return;
    document.getElementById('admin-members-panel').classList.remove('hidden');
    const listEl    = document.getElementById('admin-members-list');
    const emptyEl   = document.getElementById('admin-members-empty');
    const loadingEl = document.getElementById('admin-members-loading');
    listEl.innerHTML = '';
    emptyEl.classList.add('hidden');
    loadingEl.classList.remove('hidden');

    try {
        const snap = await db.collection('users').get();
        allAdminMembers = [];
        snap.forEach(doc => allAdminMembers.push({ uid: doc.id, ...doc.data() }));
        // Sort: admins first, then by displayName
        allAdminMembers.sort((a, b) => {
            if (!!a.isAdmin !== !!b.isAdmin) return a.isAdmin ? -1 : 1;
            return (a.displayName || a.email || '').localeCompare(b.displayName || b.email || '');
        });
    } catch (err) {
        console.error('loadAdminMembers error:', err);
    }

    loadingEl.classList.add('hidden');
    renderAdminMembers();
}

function renderAdminMembers() {
    const listEl  = document.getElementById('admin-members-list');
    const emptyEl = document.getElementById('admin-members-empty');
    listEl.innerHTML = '';
    if (allAdminMembers.length === 0) {
        emptyEl.classList.remove('hidden');
        return;
    }
    emptyEl.classList.add('hidden');
    allAdminMembers.forEach(m => listEl.appendChild(buildAdminMemberCard(m)));
}

function buildAdminMemberCard(member) {
    const card = document.createElement('div');
    card.className = 'admin-member-card';

    const raw      = member.displayName || member.email || 'OW';
    const initials = raw.split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2) || 'OW';

    const isMe = member.uid === currentOwl.uid;
    const profileBits = [];
    if (member.profile?.phoneNumber) profileBits.push(member.profile.phoneNumber);
    if (member.profile?.address)     profileBits.push((member.profile.address || '').split('\n')[0]);

    card.innerHTML = `
        <div class="admin-member-avatar">${escapeHtml(initials)}</div>
        <div class="admin-member-info">
            <div class="admin-member-name">${escapeHtml(member.displayName || member.email)}</div>
            <div class="admin-member-email">${escapeHtml(member.email || '')}</div>
            <div class="admin-member-tags">
                ${member.isAdmin       ? '<span class="admin-member-tag tag-admin">Admin</span>' : ''}
                ${member.waiverSigned  ? '<span class="admin-member-tag tag-waiver">Waiver ✓</span>'
                                       : '<span class="admin-member-tag tag-nowaiver">No Waiver</span>'}
            </div>
        </div>
        <button class="admin-member-menu-btn" aria-label="More actions">⋯</button>
        <div class="admin-member-actions">
            ${profileBits.length ? `<div style="font-size:.8rem;color:#555;font-family:system-ui;padding:4px 0">${escapeHtml(profileBits.join(' · '))}</div>` : ''}
            ${isMe ? '' : `<button class="admin-member-action-btn" data-action="toggleAdmin" data-uid="${member.uid}">${member.isAdmin ? 'Remove admin role' : 'Make admin'}</button>`}
            ${isMe ? '' : `<button class="admin-member-action-btn danger" data-action="removeMember" data-uid="${member.uid}">Remove member access</button>`}
        </div>`;

    card.querySelector('.admin-member-menu-btn').addEventListener('click', () => card.classList.toggle('expanded'));
    card.querySelectorAll('.admin-member-action-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const action = e.currentTarget.dataset.action;
            const uid    = e.currentTarget.dataset.uid;
            if (action === 'toggleAdmin')  toggleMemberAdmin(uid, e.currentTarget);
            if (action === 'removeMember') removeMember(uid, e.currentTarget);
        });
    });
    return card;
}

async function toggleMemberAdmin(uid, btn) {
    if (!currentOwl?.isAdmin) return;
    const member = allAdminMembers.find(m => m.uid === uid);
    if (!member) return;
    const newVal = !member.isAdmin;
    const ok = await confirmAction(
        newVal ? 'Make admin?' : 'Remove admin role?',
        newVal ? `Grant full admin permissions to ${member.displayName || member.email}?`
               : `Revoke admin permissions from ${member.displayName || member.email}?`,
        newVal ? 'Make admin' : 'Remove role'
    );
    if (!ok) return;
    btn.disabled = true; btn.textContent = 'Working…';
    try {
        await db.collection('users').doc(uid).update({ isAdmin: newVal });
        member.isAdmin = newVal;
        renderAdminMembers();
        showIssueToast(newVal ? 'Admin role granted.' : 'Admin role removed.');
    } catch (err) {
        console.error('toggleMemberAdmin error:', err);
        btn.disabled = false;
        showIssueToast('Could not update.');
    }
}

async function removeMember(uid, btn) {
    if (!currentOwl?.isAdmin) return;
    const member = allAdminMembers.find(m => m.uid === uid);
    if (!member) return;
    const ok = await confirmAction(
        'Remove member access?',
        `Delete the member record for ${member.displayName || member.email}? They will lose Owl access on next login. This does not delete their Firebase Auth account.`,
        'Remove access'
    );
    if (!ok) return;
    btn.disabled = true; btn.textContent = 'Removing…';
    try {
        await db.collection('users').doc(uid).delete();
        allAdminMembers = allAdminMembers.filter(m => m.uid !== uid);
        renderAdminMembers();
        showIssueToast('Member removed.');
    } catch (err) {
        console.error('removeMember error:', err);
        btn.disabled = false; btn.textContent = 'Remove member access';
        showIssueToast('Could not remove.');
    }
}

document.getElementById('owl-admin-members-btn').addEventListener('click', openAdminMembersPanel);
document.getElementById('admin-members-back-btn').addEventListener('click', () => {
    document.getElementById('admin-members-panel').classList.add('hidden');
});

// ── Admin: Add User (create a new owl on the go) ──────────────
function openAddUserPanel() {
    if (!currentOwl?.isAdmin) return;
    document.getElementById('adduser-name').value  = '';
    document.getElementById('adduser-email').value = '';
    document.getElementById('adduser-pin').value   = '';
    document.getElementById('adduser-error').textContent = '';
    const btn = document.getElementById('adduser-submit-btn');
    btn.disabled = false;
    btn.textContent = 'Create Owl';
    document.getElementById('admin-adduser-panel').classList.remove('hidden');
    setTimeout(() => document.getElementById('adduser-name').focus(), 60);
}
function closeAddUserPanel() {
    document.getElementById('admin-adduser-panel').classList.add('hidden');
}

async function createNewOwl() {
    const errorEl = document.getElementById('adduser-error');
    const btn     = document.getElementById('adduser-submit-btn');
    const name    = document.getElementById('adduser-name').value.trim();
    const email   = document.getElementById('adduser-email').value.trim().toLowerCase();
    const pin     = document.getElementById('adduser-pin').value.trim();

    if (!currentOwl?.isAdmin) { errorEl.textContent = 'Admins only.'; return; }
    if (!name)                { errorEl.textContent = 'Please enter a name.'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errorEl.textContent = 'Enter a valid email address.'; return; }
    if (!/^\d{4}$/.test(pin)) { errorEl.textContent = 'PIN must be exactly 4 digits.'; return; }
    if (!navigator.onLine)    { errorEl.textContent = 'You need to be online to create a new owl.'; return; }

    btn.disabled    = true;
    btn.textContent = 'Creating…';
    errorEl.textContent = '';

    // Create the auth account on a SECONDARY Firebase app so the admin's own
    // session is never swapped out (createUserWithEmailAndPassword would
    // otherwise sign the admin in as the new user). The new owl is briefly
    // signed in on that secondary app, which lets us write their own /users and
    // /roster docs under their uid — satisfying the usual uid == userId rules.
    let secondary = null;
    try {
        try { secondary = firebase.app('secondary'); }
        catch (_) { secondary = firebase.initializeApp(firebaseConfig, 'secondary'); }
        await secondary.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

        const cred   = await secondary.auth().createUserWithEmailAndPassword(email, pinToPassword(pin));
        const newUid = cred.user.uid;
        const sdb    = secondary.firestore();

        await sdb.collection('users').doc(newUid).set({
            email,
            displayName: name,
            isAdmin:     false,           // promote later via the member card if needed
            joinedAt:    firebase.firestore.FieldValue.serverTimestamp(),
        });
        // Public roster entry powers the name picker on the login screen.
        await sdb.collection('roster').doc(newUid).set({ displayName: name, email });
        await secondary.auth().signOut();

        closeAddUserPanel();
        showIssueToast(`✓ ${name} added — they can sign in with their name + PIN.`);
        openAdminMembersPanel();          // refresh the list so the new owl shows
    } catch (e) {
        console.error('createNewOwl error:', e);
        let msg = 'Could not create the owl — please try again.';
        if (e.code === 'auth/email-already-in-use') msg = 'That email already has an account.';
        else if (e.code === 'auth/invalid-email')   msg = 'That email address looks invalid.';
        else if (e.code === 'auth/weak-password')    msg = 'That PIN was rejected — try a different one.';
        errorEl.textContent = msg;
        btn.disabled    = false;
        btn.textContent = 'Create Owl';
    } finally {
        // Release the secondary app so a later add starts clean.
        if (secondary) { try { await secondary.delete(); } catch (_) { /* already gone */ } }
    }
}

document.getElementById('admin-members-add-btn').addEventListener('click', openAddUserPanel);
document.getElementById('adduser-cancel-btn').addEventListener('click', closeAddUserPanel);
document.getElementById('admin-adduser-backdrop').addEventListener('click', closeAddUserPanel);
document.getElementById('adduser-submit-btn').addEventListener('click', createNewOwl);
document.getElementById('adduser-pin').addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
});

// ============================================================
// Task 7b: The Flock — leaderboard with badges (non-competitive)
// ============================================================

// Badge definitions — military-style, icon-only on cards. Tap for name/desc.
// Each badge is a separate axis of contribution; tiered tracks accumulate
// (a 100-report owl shows ALL four reporter badges, like rank insignia).
//
// DORMANT: badges are hidden for now. The whole system (BADGES list, earn
// logic, legend) is intact — flip this to true to bring badges back on the
// Flock cards and re-show the "What do badges mean?" legend.
const FLOCK_SHOW_BADGES = false;

// This account's Flock card shows a single "All Trails / VLT Steward" pill
// instead of preferred-trail pills.
const STEWARD_EMAIL = 'tom.crisp@vinalhavenlandtrust.org';

// Assistant stewards get the same "All Trails" pill, labeled Assistant Steward.
// Matched case-insensitively against the signed-in email.
const ASSISTANT_STEWARD_EMAILS = [
    'blake.lazaro@vinalhavenschool.org',
    'jwfh2002@gmail.com',
];

const BADGES = [
    // Welcome
    { id: 'new_owl',      icon: '🦉', name: 'New Owl',           desc: 'Welcome to the Flock',                       earn: () => true },

    // Reporting frequency
    { id: 'rep_1',        icon: '📝', name: 'First Sighting',    desc: 'Reported your first trail issue',            earn: s => s.reported >= 1 },
    { id: 'rep_5',        icon: '📋', name: 'Field Reporter',    desc: 'Reported 5+ issues',                         earn: s => s.reported >= 5 },
    { id: 'rep_25',       icon: '📑', name: 'Field Scribe',      desc: 'Reported 25+ issues',                        earn: s => s.reported >= 25 },
    { id: 'rep_100',      icon: '📚', name: 'Master Cartographer', desc: 'Reported 100+ issues',                     earn: s => s.reported >= 100 },

    // Working frequency
    { id: 'task_1',       icon: '🛠️', name: 'First Task',         desc: 'Claimed your first task',                   earn: s => s.claimed >= 1 },
    { id: 'comp_1',       icon: '🪓', name: 'Trail Tender',       desc: 'Completed your first task',                 earn: s => s.completed >= 1 },
    { id: 'comp_5',       icon: '⚒️', name: 'Trail Crew',         desc: 'Completed 5+ tasks',                        earn: s => s.completed >= 5 },
    { id: 'comp_25',      icon: '🏗️', name: 'Trail Steward',      desc: 'Completed 25+ tasks',                       earn: s => s.completed >= 25 },
    { id: 'comp_100',     icon: '👑', name: 'Trail Master',       desc: 'Completed 100+ tasks',                      earn: s => s.completed >= 100 },

    // Trail breadth
    { id: 'wander_3',     icon: '🏔️', name: 'Wanderer',           desc: 'Reported on 3+ different trails',           earn: s => s.trailsReportedCount >= 3 },
    { id: 'wander_6',     icon: '🗺️', name: 'Cartographer',       desc: 'Reported on 6+ different trails',           earn: s => s.trailsReportedCount >= 6 },
    { id: 'work_3',       icon: '🌲', name: 'Multi-Trail Tender', desc: 'Worked on 3+ different trails',             earn: s => s.trailsCompletedCount >= 3 },
    { id: 'work_6',       icon: '🌳', name: 'Forest Network',     desc: 'Worked on 6+ different trails',             earn: s => s.trailsCompletedCount >= 6 },

    // Severity specialists
    { id: 'sev_high_1',   icon: '💪', name: 'Heavy Lifter',       desc: 'Completed a high-severity task',            earn: s => s.completedHigh >= 1 },
    { id: 'sev_high_3',   icon: '⚡', name: 'Critical Responder', desc: 'Completed 3+ high-severity tasks',          earn: s => s.completedHigh >= 3 },
    { id: 'sev_low_10',   icon: '🎯', name: 'Detail Oriented',    desc: 'Completed 10+ low-severity tasks',          earn: s => s.completedLow >= 10 },

    // Category specialists (reporting) — matches the 6 active categories
    { id: 'cat_hazard',   icon: '⚠️', name: 'Hazard Hunter',      desc: 'Reported 3+ safety hazards',                earn: s => s.catCounts.hazard >= 3 },
    { id: 'cat_blowdown', icon: '🌬️', name: 'Storm Spotter',      desc: 'Reported 3+ blow downs',                    earn: s => s.catCounts.blowdown >= 3 },
    { id: 'cat_invasive', icon: '🌿', name: 'Invasive Ranger',    desc: 'Reported 3+ invasive species',              earn: s => s.catCounts.invasive >= 3 },
    { id: 'cat_signage',  icon: '🪧', name: 'Sign Sentinel',      desc: 'Reported 3+ signage issues',                earn: s => s.catCounts.signage >= 3 },
    { id: 'cat_trash',    icon: '🗑️', name: 'Litter Patrol',      desc: 'Reported 3+ trash / litter issues',         earn: s => s.catCounts.trash >= 3 },

    // Time-based
    { id: 'time_winter',  icon: '❄️', name: 'All-Weather Owl',   desc: 'Reported during a winter month',            earn: s => s.winterReports >= 1 },
    { id: 'time_early',   icon: '🌅', name: 'Early Bird',         desc: 'Reported before 7am',                       earn: s => s.earlyReports >= 1 },
    { id: 'time_late',    icon: '🌙', name: 'Night Owl',          desc: 'Reported after 8pm',                        earn: s => s.lateReports >= 1 },
    { id: 'time_weekend', icon: '📆', name: 'Weekend Warrior',    desc: '5+ reports on a weekend',                   earn: s => s.weekendReports >= 5 },

    // Recognition (community appreciation)
    { id: 'up_total_10',  icon: '🦅', name: 'Sharp Eye',          desc: '10+ upvotes total across your reports',     earn: s => s.totalUpvotes >= 10 },
    { id: 'up_one_10',    icon: '🌟', name: 'Star Report',        desc: 'A single report earned 10+ upvotes',        earn: s => s.maxUpvotesOnReport >= 10 },
    { id: 'up_total_50',  icon: '🎖️', name: 'Beloved',           desc: '50+ upvotes total across your reports',     earn: s => s.totalUpvotes >= 50 },

    // Voting (community voice)
    { id: 'vote_10',      icon: '👍', name: 'Voter',              desc: 'Upvoted 10+ reports',                       earn: s => s.upvotedCount >= 10 },
    { id: 'vote_50',      icon: '📣', name: 'Community Voice',    desc: 'Upvoted 50+ reports',                       earn: s => s.upvotedCount >= 50 },

    // Tenure tiers
    { id: 'ten_3mo',      icon: '🌱', name: 'Three Months',       desc: 'Three months as an Owl',                    earn: s => s.tenureYears >= 0.25 },
    { id: 'ten_6mo',      icon: '🍃', name: 'Six Months',         desc: 'Six months as an Owl',                      earn: s => s.tenureYears >= 0.5 },
    { id: 'ten_1yr',      icon: '🎂', name: 'Year One',           desc: 'One full year as an Owl',                   earn: s => s.tenureYears >= 1 },
    { id: 'ten_2yr',      icon: '🏆', name: 'Two Years',          desc: 'Two years as an Owl',                       earn: s => s.tenureYears >= 2 },
    { id: 'ten_3yr',      icon: '📅', name: 'Veteran Owl',        desc: 'Three or more years on the trails',         earn: s => s.tenureYears >= 3 },

    // Leadership / special
    { id: 'chainsaw',     icon: '🪚', name: 'Chainsaw Certified', desc: 'Trained to safely operate a chainsaw on the trails', earn: s => s.chainsawCertified },
    { id: 'admin',        icon: '🤝', name: 'Crew Leader',        desc: 'Serves the Flock as an admin',              earn: s => s.isAdmin },
    { id: 'mentor',       icon: '🎓', name: 'Mentor',             desc: 'Admin with 1+ year of tenure',              earn: s => s.isAdmin && s.tenureYears >= 1 },
    { id: 'charter',      icon: '📜', name: 'Charter Owl',        desc: 'Among the first ten members of the Flock',  earn: s => s.isCharter },
    { id: 'helper',       icon: '🤲', name: 'Helping Hand',       desc: 'Claimed 5+ reports made by other Owls',     earn: s => s.helpingClaims >= 5 },
];

function formatJoinedDate(ts) {
    let d;
    if (ts?.toDate)               d = ts.toDate();
    else if (ts?.seconds)         d = new Date(ts.seconds * 1000);
    else if (typeof ts === 'string' || typeof ts === 'number') d = new Date(ts);
    else                          return null;
    if (isNaN(d)) return null;
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function tsMillis(ts) {
    if (!ts) return null;
    if (ts.toMillis)  return ts.toMillis();
    if (ts.seconds)   return ts.seconds * 1000;
    const n = new Date(ts).getTime();
    return isNaN(n) ? null : n;
}

// Update the two numbers in the impact strip
function paintImpactNumbers(owls, resolved) {
    const owlsEl = document.getElementById('flock-owls');
    const doneEl = document.getElementById('flock-tasks-done');
    if (owlsEl) owlsEl.textContent = (owls === null || owls === undefined) ? '–' : owls;
    if (doneEl) doneEl.textContent = (resolved === null || resolved === undefined) ? '–' : resolved;
}

// On page load, read the last known numbers from localStorage so
// logged-out visitors immediately see real impact stats instead of "–".
function paintImpactFromCache() {
    try {
        const raw = localStorage.getItem('vlt-impact-cache');
        if (!raw) return;
        const data = JSON.parse(raw);
        paintImpactNumbers(data.owls, data.resolved);
    } catch (_) { /* corrupt JSON or no localStorage — fall through to dashes */ }
}

// Try to fetch live numbers from the public stats doc.
// Requires Firestore rules to allow read on /public/{doc} for everyone.
// Falls back silently to whatever is already painted (cache or dashes).
async function loadPublicImpactStats() {
    try {
        const snap = await db.collection('public').doc('stats').get();
        if (!snap.exists) return;
        const d = snap.data();
        paintImpactNumbers(d.owls, d.resolvedThisYear);
        // Refresh local cache from the live source
        try {
            localStorage.setItem('vlt-impact-cache', JSON.stringify({
                owls: d.owls,
                resolved: d.resolvedThisYear,
                cachedAt: Date.now(),
            }));
        } catch (_) { /* ignore */ }
    } catch (err) {
        // Most likely the public read rule isn't deployed yet.
        // The cache already provided "good enough" numbers — don't surface this.
        console.warn('Public stats read failed:', err.message);
    }
}

// Cache paints instantly; live fetch refines (or no-ops if rules block).
paintImpactFromCache();
loadPublicImpactStats();

async function loadFlock() {
    const flockEl   = document.getElementById('owls-flock');
    const listEl    = document.getElementById('flock-list');
    const loadingEl = document.getElementById('flock-loading');
    if (!flockEl || !listEl) return;

    listEl.innerHTML = '';
    loadingEl?.classList.remove('hidden');

    try {
        const [usersSnap, issuesSnap] = await Promise.all([
            db.collection('users').get(),
            db.collection('issues').get(),
        ]);

        const users = [];
        usersSnap.forEach(d => users.push({ uid: d.id, ...d.data() }));
        flockUsers = users;   // kept so the admin "Info" button can look up full profiles
        const issues = [];
        issuesSnap.forEach(d => issues.push({ id: d.id, ...d.data() }));

        // Community Impact — single sentence, visible to everyone (logged-in
        // and logged-out). "This year" = rolling 365 days. Logged-in users
        // refresh the cached counts; logged-out visitors see whatever the
        // cache last held (see paintImpactFromCache below).
        const ROLLING_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
        const cutoff = Date.now() - ROLLING_YEAR_MS;
        let resolvedRollingYear = 0;
        issues.forEach(i => {
            if (i.status !== 'resolved') return;
            const ms = tsMillis(i.resolvedAt);
            if (ms && ms >= cutoff) resolvedRollingYear++;
        });
        paintImpactNumbers(users.length, resolvedRollingYear);
        // Cache locally for instant paint on next visit
        try {
            localStorage.setItem('vlt-impact-cache', JSON.stringify({
                owls: users.length,
                resolved: resolvedRollingYear,
                cachedAt: Date.now(),
            }));
        } catch (_) { /* localStorage may be disabled — ignore */ }

        // Also publish to /public/stats so logged-out visitors see real
        // numbers (the public/stats doc is publicly readable per Firestore rules).
        db.collection('public').doc('stats').set({
            owls:             users.length,
            resolvedThisYear: resolvedRollingYear,
            updatedAt:        firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true }).catch(err => console.warn('Public stats write failed:', err.message));

        // Determine Charter Owls — first 10 by joinedAt
        const charterIds = new Set(
            [...users]
                .filter(u => tsMillis(u.joinedAt) !== null)
                .sort((a, b) => (tsMillis(a.joinedAt) || 0) - (tsMillis(b.joinedAt) || 0))
                .slice(0, 10)
                .map(u => u.uid)
        );

        // Per-user stats → earned badges
        const now = Date.now();
        users.forEach(u => {
            const trailsReported  = new Set();
            const trailsCompleted = new Set();
            const catCounts = { hazard: 0, blowdown: 0, invasive: 0, signage: 0, trash: 0, other: 0 };
            let reported = 0, claimed = 0, completed = 0;
            let totalUpvotes = 0, maxUpvotesOnReport = 0, upvotedCount = 0;
            let completedHigh = 0, completedLow = 0;
            let earlyReports = 0, lateReports = 0, weekendReports = 0, winterReports = 0;
            let helpingClaims = 0;

            issues.forEach(i => {
                // Reports authored by this owl
                if (i.reportedBy?.uid === u.uid) {
                    reported++;
                    if (i.trailName) trailsReported.add(i.trailName);
                    const upv = i.upvotes?.length || 0;
                    totalUpvotes += upv;
                    if (upv > maxUpvotesOnReport) maxUpvotesOnReport = upv;
                    if (i.category && catCounts[i.category] !== undefined) catCounts[i.category]++;
                    // Time-of-report metrics
                    const ms = tsMillis(i.reportedAt);
                    if (ms) {
                        const d = new Date(ms);
                        const hr = d.getHours();
                        const dow = d.getDay();      // 0 = Sun, 6 = Sat
                        const mon = d.getMonth();    // 11 = Dec, 0 = Jan, 1 = Feb
                        if (hr < 7)            earlyReports++;
                        if (hr >= 20)          lateReports++;
                        if (dow === 0 || dow === 6) weekendReports++;
                        if (mon === 11 || mon === 0 || mon === 1) winterReports++;
                    }
                }
                // Lifetime completion credit comes from attempts[] when present;
                // we fall back to the live completedBy field for legacy issues
                // that pre-date the attempts audit trail.
                const userAttempts = Array.isArray(i.attempts) ? i.attempts.filter(a => a.uid === u.uid) : [];
                if (userAttempts.length > 0) {
                    completed     += userAttempts.length;
                    if (i.trailName) trailsCompleted.add(i.trailName);
                    if (i.severity === 'High') completedHigh += userAttempts.length;
                    if (i.severity === 'Low')  completedLow  += userAttempts.length;
                } else if (i.completedBy?.uid === u.uid) {
                    completed++;
                    if (i.trailName) trailsCompleted.add(i.trailName);
                    if (i.severity === 'High') completedHigh++;
                    if (i.severity === 'Low')  completedLow++;
                }
                // Claims (current snapshot — used for First Task and Helping Hand)
                if (i.claimedBy?.uid === u.uid) {
                    claimed++;
                    if (i.reportedBy?.uid && i.reportedBy.uid !== u.uid) helpingClaims++;
                }
                // Upvotes cast by this owl
                if (Array.isArray(i.upvotes) && i.upvotes.includes(u.uid)) upvotedCount++;
            });

            const joinedMs = tsMillis(u.joinedAt) ?? now;
            const tenureYears = (now - joinedMs) / (1000 * 60 * 60 * 24 * 365.25);

            const stats = {
                reported, claimed, completed,
                trailsReportedCount:  trailsReported.size,
                trailsCompletedCount: trailsCompleted.size,
                catCounts,
                completedHigh, completedLow,
                totalUpvotes, maxUpvotesOnReport, upvotedCount,
                earlyReports, lateReports, weekendReports, winterReports,
                helpingClaims,
                isAdmin:           !!u.isAdmin,
                isCharter:         charterIds.has(u.uid),
                chainsawCertified: !!u.chainsawCertified,
                tenureYears,
            };
            u._stats  = stats;
            u._badges = BADGES.filter(b => b.earn(stats));
        });

        // Random order — egalitarian, no permanent ranking — then float the
        // members who've set a profile photo to the top. Array.sort is stable,
        // so the random order is preserved within each group.
        for (let i = users.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [users[i], users[j]] = [users[j], users[i]];
        }
        users.sort((a, b) => (b.photoUrl ? 1 : 0) - (a.photoUrl ? 1 : 0));

        listEl.innerHTML = '';
        users.forEach(u => listEl.appendChild(buildOwlCard(u)));

        // Badges (and their legend) are dormant — see FLOCK_SHOW_BADGES.
        const legendBtn = document.getElementById('flock-legend-btn');
        if (legendBtn) legendBtn.style.display = FLOCK_SHOW_BADGES ? '' : 'none';
        if (FLOCK_SHOW_BADGES) renderBadgeLegend();
    } catch (err) {
        console.error('loadFlock error:', err);
    }

    loadingEl?.classList.add('hidden');
}

function buildOwlCard(u) {
    const card = document.createElement('div');
    card.className = 'owl-card';
    const isMe = currentOwl && u.uid === currentOwl.uid;
    if (isMe) card.classList.add('owl-card-me');

    const name     = u.displayName || u.email || 'Owl';
    const initials = name.split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2) || 'OW';
    const joined   = formatJoinedDate(u.joinedAt);
    const tenure   = joined ? `Since ${joined}` : 'New Owl';
    const youTag   = isMe ? ' <span class="owl-you-tag">YOU</span>' : '';

    // Circular profile shot, or initials fallback
    const avatarInner = u.photoUrl
        ? `<img src="${u.photoUrl}" alt="" loading="lazy">`
        : escapeHtml(initials);

    // Compact availability: 7 mini day pills + a short season line
    const days    = u.availableDays    || [];
    const seasons = u.availableSeasons || [];
    const DAY_LIST = [
        { d: 1, l: 'M' }, { d: 2, l: 'T' }, { d: 3, l: 'W' },
        { d: 4, l: 'T' }, { d: 5, l: 'F' }, { d: 6, l: 'S' }, { d: 0, l: 'S' },
    ];
    const dayHTML = DAY_LIST.map(({ d, l }) =>
        `<span class="owl-day-pill ${days.includes(d) ? 'active' : ''}">${l}</span>`
    ).join('');
    const seasonTxt = seasons.length
        ? seasons.map(s => s === 'summer' ? 'Summer' : 'Off-season').join(' · ')
        : 'Anytime';

    // Preferred trails — show all, up to the current cap (handles legacy
    // profiles that saved more than the new max; all of them display).
    // Special case: the VLT steward's card shows a single steward pill;
    // assistant stewards show the same pill labeled "Assistant Steward".
    let prefsHTML;
    if (u.email === STEWARD_EMAIL) {
        prefsHTML = '<span class="owl-pref-pill owl-pref-steward">All Trails<br>VLT Steward</span>';
    } else if (ASSISTANT_STEWARD_EMAILS.includes((u.email || '').toLowerCase())) {
        prefsHTML = '<span class="owl-pref-pill owl-pref-steward">All Trails<br>Asst. Steward</span>';
    } else {
        const prefs = (u.preferredTrails || []).slice(0, PREFERRED_TRAILS_MAX);
        prefsHTML = prefs.length
            ? prefs.map(f => `<span class="owl-pref-pill">${escapeHtml(trailLabel(f))}</span>`).join('')
            : '<span class="owl-pref-empty">No trails yet</span>';
    }

    // Badges are dormant; render only when re-enabled.
    const badgesHTML = (FLOCK_SHOW_BADGES && u._badges && u._badges.length)
        ? `<div class="owl-card-badges">${u._badges.map(b =>
            `<span class="owl-badge" title="${escapeHtml(b.name)} — ${escapeHtml(b.desc)}">${b.icon}</span>`).join('')}</div>`
        : '';

    card.innerHTML = `
        <div class="owl-card-avatar">${avatarInner}</div>
        <div class="owl-card-name-line">
            <span class="owl-card-name">${escapeHtml(name)}</span>${youTag}
        </div>
        <div class="owl-card-tenure">${escapeHtml(tenure)}</div>
        ${badgesHTML}
        <div class="owl-card-avail">
            <div class="owl-day-strip">${dayHTML}</div>
            <div class="owl-season-line">${escapeHtml(seasonTxt)}</div>
        </div>
        <div class="owl-card-prefs">${prefsHTML}</div>
        <div class="owl-card-btn-row">
            ${currentOwl?.isAdmin ? `<button class="owl-action-btn owl-action-btn-secondary owl-card-info" data-action="info-owl" data-uid="${u.uid}" type="button">Info</button>` : ''}
            <button class="owl-action-btn owl-card-contact" data-action="contact-owl"
                    data-name="${escapeHtml(name)}"
                    data-email="${escapeHtml(u.email || '')}"
                    data-phone="${escapeHtml(u.profile?.phoneNumber || '')}"
                    data-about="${escapeHtml(u.profile?.availability || '')}"
                    data-photo="${escapeHtml(u.photoUrl || '')}"
                    type="button">Contact</button>
        </div>`;
    return card;
}

let flockUsers = [];   // full user docs from the last Flock load (admin Info lookup)

// Admin-only "Info" popup — shows everything a member listed in their profile.
function openOwlInfo(u) {
    if (!u) return;
    document.getElementById('owl-info-pop')?.remove();
    const p  = u.profile || {};
    const ec = p.emergencyContact || {};
    const EXP = { beginner: 'New to trail work', intermediate: 'Some experience', experienced: 'Experienced trail crew' };
    const DAYN = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };

    const rows = [];
    const add = (label, val) => {
        if (val == null || String(val).trim() === '') return;
        rows.push(`<div class="owl-info-row"><div class="owl-info-label">${label}</div><div class="owl-info-val">${escapeHtml(String(val))}</div></div>`);
    };
    add('Full legal name', p.fullName);
    add('Email', u.email);
    add('Phone', p.phoneNumber);
    add('Mailing address', p.address);
    add('Date of birth', p.dateOfBirth);
    const ecStr = [ec.name, ec.phone, ec.relation].filter(Boolean).join(' · ');
    add('Emergency contact', ecStr);
    add('Trail work experience', EXP[p.experience] || p.experience);
    add('About', p.availability);
    const days = (u.availableDays || []).slice().sort((a, b) => a - b).map(d => DAYN[d]).filter(Boolean);
    if (days.length) add('Available days', days.join(', '));
    const seasons = (u.availableSeasons || []).map(s => s === 'summer' ? 'Summer' : 'Off-season');
    if (seasons.length) add('Seasons', seasons.join(', '));
    const prefs = (u.preferredTrails || []).map(f => trailLabel(f));
    if (prefs.length) add('Preferred trails', prefs.join(', '));
    add('Waiver', u.waiverSigned ? 'Signed ✓' : 'Not signed');
    add('Chainsaw certified', u.chainsawCertified ? 'Yes ✓' : 'No');
    if (!rows.length) rows.push('<div class="owl-contact-empty">This Owl hasn’t filled in their info yet.</div>');

    const pop = document.createElement('div');
    pop.id = 'owl-info-pop';
    pop.className = 'owl-contact-pop';
    pop.innerHTML = `
        <div class="owl-contact-backdrop"></div>
        <div class="owl-contact-card owl-info-card">
            <h3 class="owl-contact-title">${escapeHtml(u.displayName || u.email || 'Owl')}</h3>
            <div class="owl-info-list">${rows.join('')}</div>
            <button class="owl-contact-close" type="button">Close</button>
        </div>`;
    document.body.appendChild(pop);
    pop.querySelector('.owl-contact-backdrop').addEventListener('click', () => pop.remove());
    pop.querySelector('.owl-contact-close').addEventListener('click', () => pop.remove());
}

// Contact popup for a member card — Email always (it's their login), plus
// Call / Text when a phone number is on file.
function openOwlContact(name, email, phone, about, photo) {
    document.getElementById('owl-contact-pop')?.remove();

    const dial = (phone || '').replace(/[^\d+]/g, '');
    const initials = (name || 'Owl').trim().split(/\s+/).map(w => w[0] || '').slice(0, 2).join('').toUpperCase();
    const avatarHTML = photo
        ? `<div class="owl-contact-avatar"><img src="${photo}" alt="" loading="lazy"></div>`
        : `<div class="owl-contact-avatar">${escapeHtml(initials)}</div>`;
    const rows = [];
    if (email) {
        rows.push(`<a class="owl-contact-row" href="mailto:${encodeURIComponent(email)}">
            <span class="owl-contact-ic">✉️</span>
            <span class="owl-contact-txt">Email<span class="owl-contact-sub">${escapeHtml(email)}</span></span></a>`);
    }
    if (dial) {
        rows.push(`<div class="owl-contact-row owl-contact-phone-row">
            <span class="owl-contact-ic">📞</span>
            <span class="owl-contact-txt">Call or Text<span class="owl-contact-sub">${escapeHtml(phone)}</span></span>
            <span class="owl-contact-phone-btns">
                <a href="tel:${dial}">Call</a>
                <a href="sms:${dial}">Text</a>
            </span></div>`);
    }
    if (!rows.length) rows.push('<div class="owl-contact-empty">No contact info on file yet.</div>');

    const pop = document.createElement('div');
    pop.id = 'owl-contact-pop';
    pop.className = 'owl-contact-pop';
    const aboutHTML = (about && about.trim())
        ? `<div class="owl-contact-about"><div class="owl-contact-about-label">About</div>${escapeHtml(about.trim())}</div>`
        : '';
    pop.innerHTML = `
        <div class="owl-contact-backdrop"></div>
        <div class="owl-contact-card">
            ${avatarHTML}
            <h3 class="owl-contact-title">Contact ${escapeHtml(name || 'Owl')}</h3>
            ${aboutHTML}
            ${rows.join('')}
            <button class="owl-contact-close" type="button">Close</button>
        </div>`;
    document.body.appendChild(pop);
    pop.querySelector('.owl-contact-backdrop').addEventListener('click', () => pop.remove());
    pop.querySelector('.owl-contact-close').addEventListener('click', () => pop.remove());
}

function renderBadgeLegend() {
    const legend = document.getElementById('flock-legend');
    if (!legend || legend.dataset.rendered) return;
    legend.innerHTML = BADGES.map(b => `
        <div class="flock-legend-item">
            <span class="flock-legend-item-icon">${b.icon}</span>
            <div>
                <span class="flock-legend-item-name">${escapeHtml(b.name)}</span>
                <span class="flock-legend-item-desc">${escapeHtml(b.desc)}</span>
            </div>
        </div>`).join('');
    legend.dataset.rendered = '1';
}

document.getElementById('flock-legend-btn').addEventListener('click', () => {
    document.getElementById('flock-legend').classList.toggle('hidden');
});

document.getElementById('flock-refresh-btn').addEventListener('click', () => {
    const btn = document.getElementById('flock-refresh-btn');
    btn.classList.add('spinning');
    setTimeout(() => btn.classList.remove('spinning'), 700);
    loadFlock();
});

// Delegated handler for member-card actions (cards are re-rendered on each load).
document.getElementById('flock-list')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    if (btn.dataset.action === 'contact-owl') {
        openOwlContact(btn.dataset.name, btn.dataset.email, btn.dataset.phone, btn.dataset.about, btn.dataset.photo);
    } else if (btn.dataset.action === 'info-owl') {
        if (currentOwl?.isAdmin) openOwlInfo(flockUsers.find(u => u.uid === btn.dataset.uid));
    }
});

// ============================================================
// Trail Sightings — a simple photo feed for logged-in Owls
// ============================================================
let sightings = [];
let sightingPhotoFile = null;
let editingSightingId = null;         // id when editing an existing note, else null
let editingExistingPhotoUrl = null;   // keep the original photo unless a new one is picked
const openSightingComments = new Set();   // sighting ids with comments expanded

function formatSightingDate(ts) {
    const ms = tsMillis(ts);
    if (!ms) return 'Just now';
    return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function openSightings() {
    if (!currentOwl) { switchView('owls-view'); return; }   // OWLS-only
    switchView('sightings-view');
    loadSightings();
}
function closeSightings() { switchView('activities-view'); }

async function loadSightings() {
    const feed    = document.getElementById('sightings-feed');
    const empty   = document.getElementById('sightings-empty');
    const loading = document.getElementById('sightings-loading');
    feed.innerHTML = ''; empty.classList.add('hidden'); loading.classList.remove('hidden');
    try {
        const snap = await db.collection('sightings').orderBy('postedAt', 'desc').get();
        sightings = [];
        snap.forEach(d => sightings.push({ id: d.id, ...d.data() }));
    } catch (e) {
        console.warn('loadSightings:', e.message);
    }
    loading.classList.add('hidden');
    renderSightingsFeed();
}

function renderSightingsFeed() {
    const feed  = document.getElementById('sightings-feed');
    const empty = document.getElementById('sightings-empty');
    feed.innerHTML = '';
    if (!sightings.length) { empty.classList.remove('hidden'); return; }
    empty.classList.add('hidden');
    sightings.forEach(s => feed.appendChild(buildSightingCard(s)));
}

function buildSightingCard(s) {
    const card = document.createElement('div');
    card.className = 'sighting-card';
    const uid      = currentOwl?.uid;
    const likes    = Array.isArray(s.likes) ? s.likes : [];
    const liked    = uid && likes.includes(uid);
    const comments = Array.isArray(s.comments) ? s.comments : [];
    const poster   = escapeHtml(s.postedBy?.displayName || 'An Owl');
    const date     = formatSightingDate(s.postedAt);
    const canDelete = uid === s.postedBy?.uid || currentOwl?.isAdmin;
    const open      = openSightingComments.has(s.id);
    const commentsHTML = comments.slice()
        .sort((a, b) => (tsMillis(a.ts) || 0) - (tsMillis(b.ts) || 0))
        .map(c => `<div class="sighting-comment"><span class="sighting-comment-name">${escapeHtml(c.displayName || 'An Owl')}</span> ${escapeHtml(c.text || '')}</div>`)
        .join('') || '<p class="sighting-comments-empty">No comments yet.</p>';

    card.innerHTML = `
        ${s.photoUrl ? `<div class="img-loading"><img class="sighting-photo" src="${s.photoUrl}" alt="${escapeHtml(s.title || 'Sighting')}" loading="lazy" onload="this.parentElement.classList.add('loaded')" onerror="this.parentElement.classList.add('loaded')"></div>` : ''}
        <div class="sighting-body">
            ${s.title ? `<h3 class="sighting-title">${escapeHtml(s.title)}</h3>` : ''}
            ${s.caption ? `<p class="sighting-caption">${escapeHtml(s.caption)}</p>` : ''}
            <div class="sighting-meta">${poster} · ${date}</div>
            <div class="sighting-actions">
                <button class="sighting-like-btn ${liked ? 'liked' : ''}" data-id="${s.id}" data-action="like" type="button">
                    <span class="sighting-heart">${liked ? '♥' : '♡'}</span> <span class="sighting-like-count">${likes.length}</span>
                </button>
                <button class="sighting-comment-btn" data-id="${s.id}" data-action="comments" type="button">
                    💬 <span class="sighting-comment-count">${comments.length}</span>
                </button>
                ${canDelete ? `<button class="sighting-edit-btn" data-id="${s.id}" data-action="edit" type="button">Edit</button>` : ''}
                ${canDelete ? `<button class="sighting-del-btn" data-id="${s.id}" data-action="delete" type="button">Delete</button>` : ''}
            </div>
            <div class="sighting-comments ${open ? '' : 'hidden'}" data-comments="${s.id}">
                <div class="sighting-comments-list">${commentsHTML}</div>
                <div class="sighting-comment-compose">
                    <input type="text" class="sighting-comment-input" data-input="${s.id}" placeholder="Add a comment…" maxlength="300">
                    <button class="sighting-comment-send" data-id="${s.id}" data-action="send-comment" type="button">Post</button>
                </div>
            </div>
        </div>`;
    return card;
}

async function toggleSightingLike(id) {
    if (!currentOwl) return;
    const s = sightings.find(x => x.id === id);
    if (!s) return;
    const uid   = currentOwl.uid;
    const likes = Array.isArray(s.likes) ? s.likes : [];
    const liked = likes.includes(uid);
    s.likes = liked ? likes.filter(u => u !== uid) : [...likes, uid];
    // Update just this card's button (no full re-render → no image flicker)
    const btn = document.querySelector(`.sighting-like-btn[data-id="${id}"]`);
    if (btn) {
        btn.classList.toggle('liked', !liked);
        btn.querySelector('.sighting-heart').textContent = liked ? '♡' : '♥';
        btn.querySelector('.sighting-like-count').textContent = s.likes.length;
    }
    try {
        await db.collection('sightings').doc(id).update({
            likes: liked ? firebase.firestore.FieldValue.arrayRemove(uid)
                         : firebase.firestore.FieldValue.arrayUnion(uid),
        });
    } catch (e) { console.error('like error:', e); }
}

function toggleSightingComments(id) {
    if (openSightingComments.has(id)) openSightingComments.delete(id);
    else openSightingComments.add(id);
    const el = document.querySelector(`.sighting-comments[data-comments="${id}"]`);
    if (el) el.classList.toggle('hidden');
}

async function postSightingComment(id) {
    if (!currentOwl) return;
    const input = document.querySelector(`.sighting-comment-input[data-input="${id}"]`);
    const text  = (input?.value || '').trim();
    if (!text) return;
    const s = sightings.find(x => x.id === id);
    if (!s) return;
    const comment = {
        uid: currentOwl.uid,
        displayName: currentOwl.displayName || currentOwl.email,
        text,
        ts: firebase.firestore.Timestamp.now(),   // arrayUnion can't take serverTimestamp
    };
    s.comments = [...(s.comments || []), comment];
    // Append to the DOM
    const listEl = document.querySelector(`.sighting-comments[data-comments="${id}"] .sighting-comments-list`);
    if (listEl) {
        const emptyP = listEl.querySelector('.sighting-comments-empty');
        if (emptyP) listEl.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'sighting-comment';
        div.innerHTML = `<span class="sighting-comment-name">${escapeHtml(comment.displayName)}</span> ${escapeHtml(text)}`;
        listEl.appendChild(div);
    }
    const countEl = document.querySelector(`.sighting-comment-btn[data-id="${id}"] .sighting-comment-count`);
    if (countEl) countEl.textContent = s.comments.length;
    input.value = '';
    try {
        await db.collection('sightings').doc(id).update({
            comments: firebase.firestore.FieldValue.arrayUnion(comment),
        });
    } catch (e) { console.error('comment error:', e); showIssueToast('Could not post comment.'); }
}

async function deleteSighting(id) {
    const ok = await confirmAction('Delete this note?', 'This removes it for everyone. This cannot be undone.', 'Delete');
    if (!ok) return;
    try {
        await db.collection('sightings').doc(id).delete();
        sightings = sightings.filter(s => s.id !== id);
        renderSightingsFeed();
        showIssueToast('Note deleted.');
    } catch (e) { console.error('delete sighting:', e); showIssueToast('Could not delete.'); }
}

// Open the composer for a note the current user is allowed to edit.
function editSighting(id) {
    const s = sightings.find(x => x.id === id);
    if (!s) return;
    if (!(currentOwl?.uid === s.postedBy?.uid || currentOwl?.isAdmin)) return;
    openSightingComposer(s);
}

// ── Composer ──
// Pass a note object to edit it; call with no argument to create a new one.
function openSightingComposer(edit) {
    if (!currentOwl) return;
    const editing = !!(edit && edit.id);
    editingSightingId = editing ? edit.id : null;
    editingExistingPhotoUrl = editing ? (edit.photoUrl || null) : null;
    sightingPhotoFile = null;
    document.getElementById('sighting-title').value   = editing ? (edit.title || '') : '';
    document.getElementById('sighting-caption').value = editing ? (edit.caption || '') : '';
    document.getElementById('sighting-error').textContent = '';
    document.getElementById('sighting-photo-input').value = '';

    const preview = document.getElementById('sighting-photo-preview');
    const removeBtn = document.getElementById('sighting-photo-remove');
    const addBtn = document.getElementById('sighting-photo-btn');
    if (editing && editingExistingPhotoUrl) {
        preview.src = editingExistingPhotoUrl;
        preview.classList.remove('hidden');
        removeBtn.classList.remove('hidden');
        addBtn.style.display = 'none';
    } else {
        preview.src = '';
        preview.classList.add('hidden');
        removeBtn.classList.add('hidden');
        addBtn.style.display = '';
    }

    document.getElementById('sighting-progress').classList.add('hidden');
    document.getElementById('sighting-progress-fill').style.width = '0%';
    const titleEl = document.querySelector('#sighting-composer .issue-form-title');
    if (titleEl) titleEl.textContent = editing ? 'Edit Note' : 'Post a Note';
    const btn = document.getElementById('sighting-submit-btn');
    btn.disabled = false; btn.textContent = editing ? 'Save Changes' : 'Post Note';
    document.getElementById('sighting-composer').classList.remove('hidden');
}
function closeSightingComposer() { document.getElementById('sighting-composer').classList.add('hidden'); }

async function submitSighting() {
    if (!currentOwl) return;
    const editing = !!editingSightingId;
    const restLabel = editing ? 'Save Changes' : 'Post Note';
    const errorEl = document.getElementById('sighting-error');
    const btn     = document.getElementById('sighting-submit-btn');
    const title   = document.getElementById('sighting-title').value.trim();
    const caption = document.getElementById('sighting-caption').value.trim();
    errorEl.textContent = '';
    if (!sightingPhotoFile && !editingExistingPhotoUrl) { errorEl.textContent = 'Please add a photo.'; return; }

    btn.disabled = true; btn.textContent = editing ? 'Saving…' : 'Posting…';
    const progressEl = document.getElementById('sighting-progress');
    const fillEl     = document.getElementById('sighting-progress-fill');
    const labelEl    = document.getElementById('sighting-progress-label');

    // Keep the existing photo unless the user picked a new one.
    let photoUrl = editingExistingPhotoUrl;
    if (sightingPhotoFile) {
        try {
            progressEl.classList.remove('hidden'); fillEl.style.width = '0%'; labelEl.textContent = 'Compressing photo…';
            const compressed = await compressImage(sightingPhotoFile);
            labelEl.textContent = 'Uploading photo…';
            photoUrl = await uploadToCloudinary(compressed, pct => { fillEl.style.width = pct + '%'; labelEl.textContent = `Uploading… ${pct}%`; });
        } catch (e) {
            console.error('Sighting photo upload failed:', e);
            errorEl.textContent = 'Photo upload failed — try again or pick another photo.';
            progressEl.classList.add('hidden');
            btn.disabled = false; btn.textContent = restLabel;
            return;
        }
    }
    try {
        if (editing) {
            await db.collection('sightings').doc(editingSightingId).update({
                title:   title || null,
                caption: caption || null,
                photoUrl,
            });
            closeSightingComposer();
            showIssueToast('Note updated ✓');
        } else {
            await db.collection('sightings').add({
                title:    title || null,
                caption:  caption || null,
                photoUrl,
                postedBy: { uid: currentOwl.uid, displayName: currentOwl.displayName || currentOwl.email },
                postedAt: firebase.firestore.FieldValue.serverTimestamp(),
                likes:    [],
                comments: [],
            });
            closeSightingComposer();
            showIssueToast('Note posted ✓');
        }
        loadSightings();
    } catch (e) {
        console.error('submitSighting:', e);
        errorEl.textContent = editing ? 'Could not save — please try again.' : 'Could not post — please try again.';
        progressEl.classList.add('hidden');
        btn.disabled = false; btn.textContent = restLabel;
    }
}

// ── Sightings wiring ──
document.getElementById('sightings-resources-btn')?.addEventListener('click', openSightings);
document.getElementById('sightings-back-btn')?.addEventListener('click', closeSightings);
document.getElementById('sighting-new-btn')?.addEventListener('click', () => openSightingComposer());
document.getElementById('sighting-submit-btn')?.addEventListener('click', submitSighting);
document.getElementById('sighting-cancel-btn')?.addEventListener('click', closeSightingComposer);
document.getElementById('sighting-composer-backdrop')?.addEventListener('click', closeSightingComposer);

document.getElementById('sighting-photo-btn')?.addEventListener('click', () => document.getElementById('sighting-photo-input').click());
document.getElementById('sighting-photo-input')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    sightingPhotoFile = file;
    const reader = new FileReader();
    reader.onload = ev => {
        const p = document.getElementById('sighting-photo-preview');
        p.src = ev.target.result; p.classList.remove('hidden');
        document.getElementById('sighting-photo-remove').classList.remove('hidden');
        document.getElementById('sighting-photo-btn').style.display = 'none';
    };
    reader.readAsDataURL(file);
});
document.getElementById('sighting-photo-remove')?.addEventListener('click', () => {
    sightingPhotoFile = null;
    editingExistingPhotoUrl = null;   // dropping the kept photo → a new one is required
    document.getElementById('sighting-photo-input').value = '';
    document.getElementById('sighting-photo-preview').classList.add('hidden');
    document.getElementById('sighting-photo-remove').classList.add('hidden');
    document.getElementById('sighting-photo-btn').style.display = '';
});

// Feed delegation: like / comments toggle / post comment / delete
document.getElementById('sightings-feed')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    switch (btn.dataset.action) {
        case 'like':         toggleSightingLike(id); break;
        case 'comments':     toggleSightingComments(id); break;
        case 'send-comment': postSightingComment(id); break;
        case 'edit':         editSighting(id); break;
        case 'delete':       deleteSighting(id); break;
    }
});
document.getElementById('sightings-feed')?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const input = e.target.closest('.sighting-comment-input');
    if (input) { e.preventDefault(); postSightingComment(input.dataset.input); }
});

// ── Global API ───────────────────────────────────────────────
window.openLoginModal  = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.signInOwl       = signInOwl;
window.signOutOwl      = signOutOwl;
window.getCurrentOwl   = () => currentOwl;
