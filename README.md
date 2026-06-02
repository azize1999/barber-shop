# 💈 Barber Shop - Application de Réservation

Application Next.js pour la gestion des réservations de coiffeur avec interface admin en temps réel.

## ✨ Fonctionnalités

- 📅 **Système de réservation** : Clients peuvent réserver des créneaux sur 30 jours
- 👨‍💼 **Interface admin** : Gestion des réservations en temps réel (accepter/refuser)
- 📧 **Notifications email** : Confirmations et mises à jour via Resend
- 📱 **Notifications SMS** : Confirmations et mises à jour via Twilio
- 🔐 **Authentification admin** : Endpoints sécurisés pour les admins
- ⚡ **Real-time updates** : SSE pour les mises à jour en temps réel
- 📱 **Responsive** : Conçu pour mobile et desktop

## 🛠️ Stack Technique

- **Framework** : Next.js 16 (App Router)
- **Database** : Prisma ORM + SQLite (dev) / Production
- **Styling** : Tailwind CSS + Radix UI
- **Forms** : React Hook Form + Zod
- **Notifications** : Resend (Email) + Twilio (SMS)
- **Deployment** : Vercel

## 📋 Prérequis

- Node.js 18+ ou 20+
- pnpm (recommandé) ou npm
- Comptes externes :
  - Resend (pour les emails)
  - Twilio (pour les SMS)

## 🚀 Installation locale

```bash
# 1. Clone le repository
git clone https://github.com/azize1999/barber-shop.git
cd barber-shop

# 2. Installe les dépendances
pnpm install

# 3. Configure les variables d'environnement
cp .env.example .env.local
# Édite .env.local avec tes credentials

# 4. Initialise la base de données
pnpm prisma migrate dev

# 5. Lance le serveur de développement
pnpm dev
```

L'app sera disponible sur http://localhost:3000

## 🔑 Variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Admin
ADMIN_PASSWORD="ton-mot-de-passe-admin"

# Resend (Email)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="noreply@example.com"

# Twilio (SMS)
TWILIO_ACCOUNT_SID="AC_xxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="ton-token"
TWILIO_PHONE_NUMBER="+33123456789"

# Configuration
SHOP_NAME="Barbershop Paris"
NODE_ENV="development"
```

Voir [.env.example](.env.example) pour la liste complète.

## 📂 Structure du projet

```
app/
├── api/
│   └── reservations/
│       └── route.ts         # API REST pour les réservations
├── admin/
│   └── reservations/
│       └── page.tsx         # Interface admin
├── reservation/
│   └── page.tsx             # Page de réservation client
└── page.tsx                 # Page d'accueil

lib/
├── prisma.ts               # Configuration Prisma (singleton)
├── sse.ts                  # Server-Sent Events pour real-time
└── utils.ts                # Utilitaires généraux

prisma/
└── schema.prisma           # Schéma de la base de données
```

## 🔌 Endpoints API

### GET /api/reservations
Récupère les créneaux disponibles ou la liste des réservations (admin).

**Paramètres** :
- `date` (optionnel) : Format YYYY-MM-DD, filtre par date
- `Authorization` : Bearer {ADMIN_PASSWORD} pour les données admin

**Exemple** :
```bash
# Public : voir les créneaux occupés du 15 janvier
curl http://localhost:3000/api/reservations?date=2025-01-15

# Admin : voir toutes les réservations du 15 janvier
curl -H "Authorization: Bearer mon-mot-de-passe" \
  http://localhost:3000/api/reservations?date=2025-01-15
```

### POST /api/reservations
Crée une nouvelle réservation.

**Body** :
```json
{
  "name": "Jean Dupont",
  "telephone": "+33612345678",
  "email": "jean@example.com",
  "service": "Haircut",
  "barber": "optional",
  "date": "2025-01-15",
  "time": "10:00"
}
```

### PATCH /api/reservations
Met à jour le statut d'une réservation (admin uniquement).

**Headers** : `Authorization: Bearer {ADMIN_PASSWORD}`

**Body** :
```json
{
  "id": 1,
  "status": "ACCEPTED"
}
```

Statuts valides : `PENDING`, `ACCEPTED`, `REFUSED`

### DELETE /api/reservations
Supprime une réservation (admin uniquement).

**Headers** : `Authorization: Bearer {ADMIN_PASSWORD}`

**Query** : `?id=1`

## 🏗️ Architecture

### Prisma & Database

**Important** : Pour que le projet fonctionne, `prisma generate` doit être exécuté avant le build. C'est géré par :

1. **Script postinstall** : Génère le client après `pnpm install`
2. **Script build** : Exécute `prisma generate && next build`
3. **vercel.json** : Configure Vercel pour exécuter le build command correct

Si vous rencontrez une erreur "Cannot find module '@prisma/client'", c'est que `prisma generate` n'a pas été exécuté. Lancez :

```bash
pnpm prisma generate
```

### SSE (Server-Sent Events)

Les mises à jour admin en temps réel utilisent SSE. Voir [lib/sse.ts](lib/sse.ts).

### Notifications

- **Email** : Via Resend API
- **SMS** : Via Twilio API
- Les erreurs d'envoi sont loggées mais ne bloquent pas la réservation

## 📦 Build et Déploiement

### Build local

```bash
pnpm build
```

### Déploiement sur Vercel

Voir [DEPLOYMENT.md](DEPLOYMENT.md) pour les instructions détaillées.

**Résumé** :
1. Connecter ton repo GitHub à Vercel
2. Ajouter les variables d'environnement dans Settings → Environment Variables
3. S'assurer que `vercel.json` existe (ou utiliser le build command personnalisé)
4. Déployer !

## 🧪 Tests

```bash
# Lancer ESLint
pnpm lint

# Tests API (utilise curl ou Postman)
# Voir les exemples dans les commentaires de route.ts
```

## 🐛 Débogage

### Activer les logs Prisma

```bash
DEBUG=1 pnpm dev
```

### Voir les logs du build Vercel

1. Aller sur https://vercel.com/dashboard
2. Cliquer sur le dernier déploiement
3. Aller dans "Build Logs"

### Problèmes courants

Voir [DEPLOYMENT.md](DEPLOYMENT.md#problèmes-courants-et-solutions)

## 📄 License

MIT

## 👤 Author

Azize - [@azize1999](https://github.com/azize1999)

## 🤝 Contributing

Les contributions sont bienvenues ! Fais un fork, crée une branche et envoie une PR.
