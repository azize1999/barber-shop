# Déploiement sur Vercel

Ce guide explique comment déployer correctement l'application Barber Shop sur Vercel.

## Prérequis

- Compte Vercel (gratuit sur https://vercel.com)
- Repository GitHub connecté à Vercel
- Les services externes configurés (Resend, Twilio, Database)

## Configuration des variables d'environnement sur Vercel

### 1. Aller dans les paramètres du projet Vercel

- Aller sur https://vercel.com/dashboard
- Sélectionner votre projet
- Aller dans **Settings → Environment Variables**

### 2. Ajouter les variables d'environnement nécessaires

Voici la liste complète des variables à configurer :

#### Database
- `DATABASE_URL` : Votre URL de base de données (SQLite, PostgreSQL, etc.)
  - Format SQLite : `file:./prisma/dev.db` ou une URL distante

#### Admin
- `ADMIN_PASSWORD` : Un mot de passe fort pour protéger les endpoints admin
  - Exemple : Un uuid long + caractères spéciaux
  - ⚠️ Ne pas utiliser de caractères simples

#### Email (Resend)
- `RESEND_API_KEY` : Votre clé API Resend (https://resend.com)
  - Format : `re_xxxxxxxxxxxxx`
- `EMAIL_FROM` : Adresse email pour envoyer les emails
  - Exemple : `noreply@yourbarber.shop`
  - ⚠️ Doit être vérifiée dans Resend

#### SMS (Twilio)
- `TWILIO_ACCOUNT_SID` : Votre SID Twilio (https://www.twilio.com)
  - Format : `AC_xxxxxxxxxxxxx`
- `TWILIO_AUTH_TOKEN` : Votre token auth Twilio
- `TWILIO_PHONE_NUMBER` : Votre numéro Twilio pour envoyer les SMS
  - Format : `+33123456789`

#### Configuration
- `SHOP_NAME` : Nom de votre barbershop pour les notifications
  - Exemple : `Barbershop Paris`

## Problèmes courants et solutions

### ❌ Erreur : "Cannot find module '@prisma/client'"

**Cause** : `prisma generate` n'a pas été exécuté avant le build.

**Solution** : Vérifiez que le fichier `vercel.json` existe avec la commande `buildCommand: "prisma generate && next build"`.

### ❌ Erreur : "DATABASE_URL is not set"

**Cause** : La variable d'environnement `DATABASE_URL` n'est pas configurée sur Vercel.

**Solution** :
1. Aller dans Settings → Environment Variables
2. Ajouter `DATABASE_URL` avec la bonne URL

### ❌ Erreur : "ADMIN_PASSWORD is not set"

**Cause** : La variable `ADMIN_PASSWORD` manque sur Vercel.

**Solution** :
1. Générer un mot de passe fort (min 32 caractères)
2. Ajouter `ADMIN_PASSWORD` dans les variables d'environnement
3. Mettre à jour votre client API pour utiliser ce mot de passe

### ❌ Erreur : "Emails not sending"

**Cause** : `RESEND_API_KEY` ou `EMAIL_FROM` manquent ou sont mal configurés.

**Solution** :
1. Vérifier la clé API Resend
2. Vérifier que `EMAIL_FROM` est une adresse vérifiée dans Resend
3. Vérifier les logs Resend pour les détails d'erreur

### ❌ Erreur : "SMS not sending"

**Cause** : Credentials Twilio manquants ou malformés.

**Solution** :
1. Vérifier `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
2. S'assurer que votre compte Twilio a des crédits
3. Vérifier les logs Twilio

## Vérification après le déploiement

Une fois déployé, vérifiez que tout fonctionne :

```bash
# Test endpoint public (liste des créneaux)
curl https://votre-app.vercel.app/api/reservations?date=2025-01-15

# Test création réservation
curl -X POST https://votre-app.vercel.app/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "telephone": "+33612345678",
    "email": "test@example.com",
    "service": "Haircut",
    "date": "2025-01-15",
    "time": "10:00"
  }'
```

## Logs et débogage

Pour voir les logs de déploiement :
1. Aller dans le dashboard Vercel
2. Sélectionner votre projet
3. Cliquer sur le dernier déploiement
4. Aller dans **"Logs"** ou **"Build Logs"**

## Variables d'environnement par environnement

### Development (local)
Créer un fichier `.env.local` avec toutes les variables.

### Production (Vercel)
Utiliser Settings → Environment Variables dans le dashboard Vercel.

### Staging (optionnel)
Créer une branch `staging` et un projet Vercel séparé avec ses propres variables.
