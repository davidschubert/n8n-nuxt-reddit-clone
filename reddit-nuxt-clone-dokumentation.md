# 📘 Lastenheft: Reddit-ähnliches Kommentarsystem mit Nuxt 4 & Appwrite

## 1. Zielsetzung
Entwicklung einer modernen, skalierbaren Webanwendung mit Nuxt 4 (Composition API) und Appwrite, die ein Reddit-ähnliches Kommentarsystem mit Benutzeranmeldung, verschachtelten Kommentaren, Upvotes/Downvotes und Realtime-Funktionalität bietet.

## 2. Zielgruppe
- Technikaffine Nutzer
- Communities mit strukturierter Diskussion
- Mobile- und Desktop-Nutzer

## 3. Anforderungen

### Funktionale Anforderungen
- Registrierung/Login/Logout via Appwrite Auth
- Sessionmanagement über SSR & HttpOnly-Cookies
- Benutzerprofile mit Avatar und Aktivitätsverlauf
- Beitragserstellung & Kommentarsystem (inkl. Antworten)
- Upvote-/Downvote-Mechanismus
- Sortierung (z. B. Neu, Beliebt)
- Realtime-Updates via Appwrite Subscriptions

### Nicht-funktionale Anforderungen
- SSR-Rendering für SEO und Performance
- Mobile-Optimierung (Responsive Design mit Nuxt UI + Tailwind v4 + Reka UI)
- Barrierefreiheit nach WCAG
- TypeScript & Pinia-first Entwicklung
- Security (RBAC, Zugriffskontrolle via Appwrite)

---

# 🗂️ Projektablaufplan

## Phase 1: Setup & Infrastruktur
1. Nuxt 4 Projekt mit Tailwind & Nuxt UI initialisieren
2. Appwrite Backend einrichten (Self-hosted oder Cloud)
3. Datenbankstruktur in Appwrite definieren
4. Authentifizierung via SSR + HttpOnly-Cookie

## Phase 2: Basis-Funktionalitäten
5. Registrierung & Login via SSR
6. Nutzerprofilseite mit Account-Daten
7. Beitragserstellung (Post Editor)
8. Beitragsübersicht mit SSR Rendering

## Phase 3: Kommentarsystem
9. Struktur für verschachtelte Kommentare erstellen
10. Kommentar-Komponente mit Antworten & Voting
11. Realtime Subscription via Appwrite Channels
12. Sortier- und Filteroptionen

## Phase 4: Interaktion & Feinschliff
13. Upvote/Downvote mit Optimistic UI
14. Error Handling, Loading States, Feedback
15. Responsive Layout finalisieren
16. SEO: Meta-Tags, Sitemap, Canonicals

## Phase 5: Deployment
17. GitHub Integration & CI/CD Setup
18. Deployment auf Hetzner mit Ploi
19. Testing: Unit, E2E
20. Launch & Monitoring (z. B. Umami)

---

# ✅ GitHub Issues

## Epic 1 – Setup & Auth
1. `[setup] Nuxt 4 Projekt initialisieren mit Tailwind & Nuxt UI`
2. `[setup] Appwrite SDK (Client + Server) einbinden`
3. `[auth] Registrierung & Login via SSR mit HttpOnly-Cookie`
4. `[auth] Pinia Store für Auth mit SSR-Support`

## Epic 2 – Nutzer & Beiträge
5. `[profile] Profilseite erstellen`
6. `[profile] Benutzerinformationen anzeigen`
7. `[posts] Editor für Beitragserstellung`
8. `[posts] Beitrag speichern in Appwrite`
9. `[posts] SSR-Rendering für Beitragsübersicht`

## Epic 3 – Kommentarsystem
10. `[comments] Appwrite DB-Struktur für Kommentare`
11. `[comments] Kommentar-Komponente mit Reply-Chain`
12. `[comments] SSR-Darstellung verschachtelter Kommentare`
13. `[comments] Kommentar via Editor posten`
14. `[comments] Upvote/Downvote Funktion`
15. `[comments] Sortierung: Neu, Beliebt, Älteste`
16. `[comments] Realtime Subscription aktivieren`

## Epic 4 – UX & Optimierung
17. `[ui] Loading & Error States`
18. `[ui] Toast-Messages & Feedback`
19. `[ui] Barrierefreiheit mit Reka UI`
20. `[ui] Responsives Design finalisieren`
21. `[ui] SEO Meta-Daten & Open Graph`

## Epic 5 – Deployment & Monitoring
22. `[devops] CI/CD via GitHub Actions`
23. `[devops] Deployment auf Hetzner via Ploi`
24. `[test] Unit-Tests für kritische Funktionen`
25. `[test] End-to-End Tests`
26. `[monitoring] Umami einrichten`
27. `[launch] Finaler Produktions-Launch`

---

> Letztes Update: 2025-08-05