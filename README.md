# N8N Nuxt Reddit Clone - Kommentarsystem

Ein vollständiges Kommentarsystem für einen Reddit-Clone, gebaut mit Nuxt.js 4 und Appwrite.

## Features

- ✅ Vollständig funktionsfähiges Kommentarsystem
- ✅ Verschachtelte Kommentare (Thread-Struktur)
- ✅ Upvote/Downvote Mechanismus
- ✅ Realtime-fähige Architektur
- ✅ Sortierung und Filterung (Neu, Beliebt, Älteste)
- ✅ SSR-kompatible Darstellung
- ✅ Performance-optimiert für große Kommentar-Threads
- ✅ Responsive Design mit TailwindCSS

## Schnellstart

### 1. Installation

```bash
npm install
```

### 2. Umgebungsvariablen

Kopiere `.env.example` zu `.env` und fülle die Appwrite-Konfiguration aus:

```bash
cp .env.example .env
```

### 3. Appwrite Setup

1. Erstelle ein neues Projekt in [Appwrite](https://appwrite.io)
2. Erstelle eine neue Datenbank
3. Erstelle die folgenden Collections:

#### Comments Collection
- **Name**: `comments`
- **Attributes**:
  - `content` (String, required)
  - `authorId` (String, required)
  - `authorName` (String, required)
  - `postId` (String, required)
  - `parentId` (String, optional)
  - `upvotes` (Integer, default: 0)
  - `downvotes` (Integer, default: 0)
  - `score` (Integer, default: 0)
  - `depth` (Integer, default: 0)
  - `childCount` (Integer, default: 0)

#### Votes Collection
- **Name**: `votes`
- **Attributes**:
  - `userId` (String, required)
  - `commentId` (String, required)
  - `type` (String, required) - "upvote" oder "downvote"

### 4. Development Server

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) um die Demo zu sehen.

## Architektur

### Komponenten

- **CommentSection**: Hauptcontainer für das Kommentarsystem
- **CommentItem**: Einzelner Kommentar mit verschachtelten Antworten
- **CommentForm**: Formular zum Erstellen neuer Kommentare/Antworten

### Composables

- **useComments**: Zentrale Logik für Kommentar-Management
  - Laden und Sortieren von Kommentaren
  - Erstellen neuer Kommentare
  - Voting-System
  - Tree-Struktur für verschachtelte Kommentare

### Features

#### Verschachtelte Kommentare
Das System unterstützt beliebig tiefe Verschachtelung von Kommentaren mit automatischer Tree-Struktur-Generierung.

#### Voting System
- Upvote/Downvote für jeden Kommentar
- Automatische Score-Berechnung
- Toggle-Verhalten (erneuter Klick entfernt Vote)

#### Sortierung
- **Beliebt**: Nach Score (Upvotes - Downvotes)
- **Neu**: Nach Erstellungsdatum (neueste zuerst)
- **Älteste**: Nach Erstellungsdatum (älteste zuerst)

#### Realtime-fähig
Die Architektur ist darauf vorbereitet, Appwrite's Realtime-Features zu nutzen für Live-Updates.

## Epic Implementation Status

- [x] #12 Appwrite DB-Struktur für Kommentare
- [x] #13 Kommentar-Komponente mit Reply-Chain
- [x] #14 SSR-Darstellung verschachtelter Kommentare
- [x] #15 Kommentar via Editor posten
- [x] #16 Upvote/Downvote Funktion
- [x] #17 Sortierung: Neu, Beliebt, Älteste
- [ ] #18 Realtime Subscription aktivieren (Architektur vorbereitet)

## Technische Details

- **Framework**: Nuxt.js 4
- **Backend**: Appwrite
- **Styling**: TailwindCSS
- **Icons**: Heroicons
- **Datum/Zeit**: Day.js
- **TypeScript**: Vollständig typisiert

## Deployment

### Build für Produktion

```bash
npm run build
```

### Preview

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
