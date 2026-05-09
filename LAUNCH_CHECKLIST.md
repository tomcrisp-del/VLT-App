# Pre-Launch Checklist

Things to do before the OWLS app is ready for public use. Grouped by priority.

---

## 🚨 Blockers — won't work without these

- [ ] **Set Cloudinary credentials** in `js/owls.js` lines 25–26.
      Currently: `CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME'` / `CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET'`.
      Photo uploads (issue reports + completion notes) silently fail until these are real.

- [ ] **Deploy Firestore Security Rules** — the rules block I provided earlier
      (allow auth read/write with admin override) needs to be pasted into
      Firebase Console → Firestore → Rules → Publish. Without it, either the
      app blocks legitimate writes or anyone can wipe the database.

- [ ] **Bootstrap the first admin.** Open Firebase Console → Firestore →
      `users/{your-uid}` → add field `isAdmin: true` (boolean). Sign out,
      sign back in. From then on, you can promote others through the
      Manage Members panel.

- [ ] **Privacy policy & terms of service** — the Volunteer Info form
      collects name, phone, address, DOB, and emergency contact. You need
      a privacy policy explaining how this data is stored, who sees it,
      and how members can request deletion. Required for App Store / TOS
      with Firebase, and ethically necessary regardless.

---

## ⚠️ High priority — needed for a real launch

- [ ] **Photo retroactive attach** — let admins (and the original reporter)
      add a photo to an existing issue from the Show More Info panel. Right
      now if you forget the photo at submit time, there's no way to add it
      later. ~15 min of work.

- [ ] **Strip EXIF / GPS metadata** from uploaded photos. iPhone JPEGs
      include the GPS coordinates of where the photo was taken — currently
      uploaded as-is to Cloudinary, where anyone with the URL can read
      that location. Add EXIF stripping in `compressImage()` (one extra
      canvas re-encode does it).

- [ ] **Email verification on signup.** Right now anyone with a working
      email can register. Use `firebase.auth().currentUser.sendEmailVerification()`
      after signup; gate the volunteer features behind a verified flag.

- [ ] **Password reset flow.** No "forgot password" UI today. Add a link
      on the login modal that calls `auth.sendPasswordResetEmail(email)`.

- [ ] **Form validation** on the Volunteer Info questionnaire. Currently
      nothing checks that the phone is digits, the DOB is a date, or that
      required fields aren't blank.

- [ ] **First-time onboarding.** A new Owl logs in and lands on a page with
      empty pills, no badges, no preferred trails. A 1-screen welcome
      ("Welcome! Tell us a few things about yourself…") that opens the
      Edit My Info sheet directly would help.

---

## 📈 Important polish — improves usability significantly

- [ ] **Notifications for admins.** Email or push when a new submission
      enters the approval queue. Admins shouldn't have to check the page
      to know there's pending work. Cheapest option: use a Firebase
      Cloud Function that emails the admin list on new doc creation in
      `issues` with `status === 'pending_approval'`.

- [ ] **Search.** Admin Manage Issues should let you search by title /
      reporter / trail. Once there are 100+ issues, scrolling for a
      specific one is painful.

- [ ] **PWA manifest + install prompt.** Trail volunteers want this on
      their phone home screen, working offline at trailheads with patchy
      signal. Add `manifest.json` + a service worker that caches the shell.

- [ ] **Offline issue queue.** If a user reports an issue with no signal,
      the submission should queue locally and fire when reconnected.
      Firestore's offline persistence handles a lot of this; just need
      to enable it (`db.enablePersistence()`) and confirm photo upload
      gracefully retries.

- [ ] **Self-serve account deletion.** Users should be able to delete
      their own account + data (GDPR-style). Right now only admins can.

- [ ] **Bulk admin operations.** Multi-select in Manage Issues for
      bulk approve / bulk delete / bulk-mark-resolved.

- [ ] **Better questionnaire prompts.** The "About Me" hint already lists
      examples; consider adding optional fields for emergency medical
      conditions (allergies, etc.) since this is volunteer trail work
      that can involve injury.

- [ ] **Comment moderation.** Comments on issues are public and persistent.
      Need: ability for an Owl to delete their own comment, ability for
      admin to delete any comment, abuse report flow, optional rate limit
      / max length already enforced (500 chars). Currently only the
      character cap exists.

---

## 🎨 Nice to have — quality-of-life

- [ ] **Analytics + error monitoring.** Firebase Analytics for usage,
      Sentry or similar for runtime errors.

- [ ] **Performance monitoring.** Firebase Performance to see real-world
      load times.

- [ ] **Push notifications.** When an Owl's reported issue is approved,
      they get a notification. When an issue is resolved on a trail
      they've marked as preferred, they get a notification. Etc.

- [ ] **Trail KML caching.** Currently re-fetched on every trail map
      open. Cache in localStorage with a version key.

- [ ] **Map tile licensing.** Currently using `mt1.google.com` satellite
      tiles which is a TOS gray area. For production, switch to a
      properly-licensed provider (Mapbox satellite, Esri, etc.) or get
      Google Maps API key.

- [ ] **Member invitations / approval-on-signup.** Currently anyone with
      an email can become an Owl. Consider an invite-only flow (admin
      sends email link) or admin approval before new accounts get
      Volunteer features.

- [ ] **Calendar integration for Events tab.** The Events view exists
      but is empty. Build it out, or integrate with Google Calendar.

- [ ] **Auto-resolve stale issues.** High-severity items currently never
      expire. Add a "Is this still there?" weekly check, or auto-resolve
      after N days with no activity.

- [ ] **Issue attempts audit trail.** The `attempts[]` array exists but
      isn't surfaced anywhere. Admins might want to see who tried what.

- [ ] **Trail issue map clustering.** When trails get busy with many
      pins, cluster them at low zoom levels.

- [ ] **Accessibility audit.** No formal a11y review yet — color
      contrast, keyboard navigation, screen reader labels.

- [ ] **Dark mode.** Volunteers using the app at dusk on the trail
      would appreciate it.

---

## ✅ Recently shipped (for reference)

- Public stats doc + impact strip visible logged-out
- Issue comments with avatar/byline + Cmd+Enter to post
- One-vote-per-member with mutually exclusive up/down
- Slot-machine trail selector → clean horizontal pill bar
- Mini-map in Show More Info with pinch + zoom buttons
- Chainsaw Certified badge & checkbox
- Profile-complete pill above Waiver pill
- Manage All Issues page redesigned to match Tasks UX
- Trail group sticky headers
- 40+ achievement badges on Flock cards
- Preferred Trails (max 5 per Owl)
- Mark Resolved goes straight to resolved (no review step)
