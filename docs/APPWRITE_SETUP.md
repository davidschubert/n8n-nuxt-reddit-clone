# Appwrite Integration Setup

## 🚀 Übersicht

Diese Reddit Clone verwendet **Appwrite** als Backend-as-a-Service für:

- 🔐 **Authentication** - Benutzer-Registrierung und Login
- 🗄️ **Database** - Posts, Comments, Votes Storage
- 📁 **Storage** - Bild-Uploads für Posts und Avatars
- ⚡ **Realtime** - Live-Updates für Comments und Votes

## 📋 Voraussetzungen

1. **Appwrite Account** erstellen auf [cloud.appwrite.io](https://cloud.appwrite.io)
2. **Neues Projekt** erstellen
3. **API Key** mit allen Berechtigung generieren

## ⚙️ Setup

### 1. Environment Configuration

```bash
# .env.example zu .env kopieren
npm run setup:env

# .env bearbeiten mit deinen Appwrite-Daten
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
```

### 2. Database Setup

```bash
# Automatisches Database Setup
npm run setup:db
```

Das Script erstellt automatisch:
- ✅ Database: `reddit-clone-db`
- ✅ Collections: `posts`, `comments`, `votes`, `users`
- ✅ Attributes & Indexes
- ✅ Storage Buckets: `post-images`, `user-avatars`
- ✅ Permissions

### 3. Entwicklung starten

```bash
npm run dev
```

## 📚 Appwrite Services

### Authentication (`useAuth`)

```typescript
const { user, login, register, logout, isLoggedIn } = useAuth()

// Login
await login({ email: 'user@example.com', password: 'password' })

// Register  
await register({ 
  email: 'user@example.com', 
  password: 'password',
  name: 'Username' 
})

// Logout
await logout()
```

### Database Collections

#### Posts Collection
```typescript
{
  title: string        // Post Titel
  content: string      // Post Inhalt  
  author: string       // Autor Name
  authorId: string     // Autor User ID
  subreddit: string    // Subreddit Name
  upvotes: number      // Anzahl Upvotes
  downvotes: number    // Anzahl Downvotes
  score: number        // Gesamt Score (upvotes - downvotes)
  commentCount: number // Anzahl Comments
  imageUrl?: string    // Optional: Bild URL
  url?: string         // Optional: External Link
}
```

#### Comments Collection
```typescript
{
  postId: string       // Zugehöriger Post
  parentId?: string    // Parent Comment (für Replies)
  content: string      // Comment Inhalt
  author: string       // Autor Name
  authorId: string     // Autor User ID
  upvotes: number      // Anzahl Upvotes
  downvotes: number    // Anzahl Downvotes
  score: number        // Gesamt Score
  depth: number        // Verschachtelungstiefe
}
```

#### Votes Collection
```typescript
{
  userId: string          // User der voted
  targetId: string        // Post/Comment ID
  targetType: 'post' | 'comment'  // Vote Typ
  voteType: 'upvote' | 'downvote' // Vote Richtung
}
```

## 🔒 Permissions

- **Read**: Alle (auch Gäste)
- **Create/Update/Delete**: Nur eingeloggte Benutzer
- **Storage**: Nur eingeloggte Benutzer

## 🛠️ Manual Setup (Alternative)

Falls automatisches Setup nicht funktioniert:

### 1. Database erstellen
- Name: `reddit-clone-db`

### 2. Collections erstellen

**Posts Collection (`posts`)**
- title (String, 255, required)
- content (String, 10000, optional)
- author (String, 100, required)
- authorId (String, 50, required)
- subreddit (String, 50, required)
- upvotes (Integer, default: 0)
- downvotes (Integer, default: 0)
- score (Integer, default: 0)
- commentCount (Integer, default: 0)
- imageUrl (String, 500, optional)
- url (String, 500, optional)

**Comments Collection (`comments`)**
- postId (String, 50, required)
- parentId (String, 50, optional)
- content (String, 5000, required)
- author (String, 100, required)
- authorId (String, 50, required)
- upvotes (Integer, default: 0)
- downvotes (Integer, default: 0)
- score (Integer, default: 0)
- depth (Integer, default: 0)

**Votes Collection (`votes`)**
- userId (String, 50, required)
- targetId (String, 50, required)
- targetType (String, 20, required)
- voteType (String, 20, required)

### 3. Storage Buckets erstellen

**Post Images (`post-images`)**
- Allowed Extensions: jpg, jpeg, png, gif, webp
- Max Size: unlimited

**User Avatars (`user-avatars`)**
- Allowed Extensions: jpg, jpeg, png, webp
- Max Size: 1MB

## 🔧 Development

```bash
# TypeScript Check
npm run typecheck

# Build für Production
npm run build

# Preview Production Build
npm run preview
```

## 📝 Environment Variables

```env
# Required
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key

# Database
APPWRITE_DATABASE_ID=reddit-clone-db

# Collections
APPWRITE_COLLECTION_POSTS=posts
APPWRITE_COLLECTION_COMMENTS=comments  
APPWRITE_COLLECTION_VOTES=votes
APPWRITE_COLLECTION_USERS=users

# Storage
APPWRITE_BUCKET_IMAGES=post-images
APPWRITE_BUCKET_AVATARS=user-avatars

# Public (für Client-Side)
NUXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NUXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
```

## 🆘 Troubleshooting

### Connection Errors
- ✅ Project ID korrekt?
- ✅ API Key mit allen Berechtigungen?
- ✅ Appwrite Server erreichbar?

### Database Setup Errors
- ✅ API Key hat Database-Berechtigungen?
- ✅ Collections bereits vorhanden?
- ✅ Richtige Database ID?

### Authentication Issues  
- ✅ Public Key vs API Key?
- ✅ Domain in Appwrite konfiguriert?
- ✅ Authentication aktiviert?
