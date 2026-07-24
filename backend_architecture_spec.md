# 🚀 Backend Architecture Specification & Gemini Pro Master Prompt

Dieser Leitfaden ist als **Master-Instruktion für Gemini Pro** (oder einen Entwickler-Subagenten) formuliert. Du kannst den gesamten Text im Kasten unten kopieren und direkt an Gemini Pro übergeben, um das komplette Cloud-Backend mit Datenbank, Authentifizierung und Push-Benachrichtigungen aufzusetzen.

---

```markdown
# 🤖 MASTER PROMPT FÜR GEMINI PRO: FamilyPlaner Backend & Supabase/PostgreSQL Setup

## 🎯 ZIELSETZUNG
Erstelle ein vollständiges, ausführungssicheres Cloud-Backend für die Mobile App "FamilyPlaner".
Das Backend soll Mehrfamilien-Funktionen, Echtzeit-Synchronisation (WebSockets), Parental Controls (Rollen-Rechte) und Push-Benachrichtigungen (Firebase/Expo Push) unterstützen.

---

## 🛠️ ARCHITEKTUR & TECH STACK

- **Backend / Database Platform:** **Supabase** (PostgreSQL + Realtime WebSockets + Auth + Storage)
- **Database Language:** PostgreSQL (mit Row Level Security - RLS)
- **Authentication:** Supabase Auth (Support für Email/Passwort, Vereinfachten Kinder-PIN & QR-Code Login)
- **Realtime Sync:** Supabase Realtime Engine (Pub/Sub Broadcasts für Spontan-Anfragen & Wünsche)
- **Push Notifications:** Expo Push Notifications / Firebase Cloud Messaging (FCM) via Supabase Edge Functions

---

## 🗄️ VOLLSTÄNDIGES DATENBANK-SCHEMA (PostgreSQL DDL)

Bitte erstelle die folgenden Tabellen in PostgreSQL inkl. Fremdschlüsseln und Indizes:

### 1. `families` (Haushalte / Familien)
```sql
CREATE TABLE public.families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    invite_code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. `users` (Eltern & Kinder-Profile)
```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(30) CHECK (role IN ('parent', 'child_independent', 'child_managed')),
    avatar VARCHAR(10) DEFAULT '👨',
    age INT,
    is_parent BOOLEAN DEFAULT FALSE,
    has_own_device BOOLEAN DEFAULT FALSE,
    pin_code VARCHAR(6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. `family_connections` (Vernetzte Befreundete Familien)
```sql
CREATE TABLE public.family_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_a_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    family_b_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'connected' CHECK (status IN ('pending', 'connected', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(family_a_id, family_b_id)
);
```

### 4. `ad_hoc_requests` (Spontan-Anfragen "Wer hat JETZT Lust?")
```sql
CREATE TABLE public.ad_hoc_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    activity VARCHAR(255) NOT NULL,
    scheduled_time VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    target_audience VARCHAR(100) DEFAULT 'Alle befreundeten Familien',
    cost VARCHAR(50),
    parent_present VARCHAR(100) DEFAULT 'Mit Eltern-Begleitung',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. `ad_hoc_rsvps` (Rückmeldungen / Zusage-Status)
```sql
CREATE TABLE public.ad_hoc_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.ad_hoc_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    response VARCHAR(50) NOT NULL, -- z.B. 'Dabei! 👍', 'Leider keine Zeit'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. `wishes` (Kinder-Wunschliste)
```sql
CREATE TABLE public.wishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    child_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    cost VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. `recurring_hobbies` (Wöchentliche Hobbys & Hol-/Bringdienste)
```sql
CREATE TABLE public.recurring_hobbies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    child_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    schedule VARCHAR(100) NOT NULL, -- z.B. 'Jeden Di & Do 17:00'
    location VARCHAR(255) NOT NULL,
    bring_driver VARCHAR(100) NOT NULL, -- z.B. 'Tom (Papa)' oder 'Fam. Weber'
    get_driver VARCHAR(100) NOT NULL,
    parent_present VARCHAR(100) DEFAULT 'Ohne Eltern',
    status VARCHAR(50) DEFAULT 'Fahrten geregelt ✅',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. `kid_permissions` (Eltern-Kontrollrechte pro Kind)
```sql
CREATE TABLE public.kid_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    can_send_adhoc_directly BOOLEAN DEFAULT TRUE,
    requires_wish_approval BOOLEAN DEFAULT TRUE,
    max_budget VARCHAR(50) DEFAULT '15 €'
);
```

---

## 🔒 ROW LEVEL SECURITY (RLS) POLICIES

Schreibe Supabase RLS-Regeln für:
1. **Familien-Isolation:** Benutzer sehen nur Daten der eigenen Familie oder von explizit verknüpften Familien (`family_connections`).
2. **Eltern-Rechte (Supervision):** Eltern dürfen `wishes` genehmigen/ablehnen, Spontan-Anfragen `ad_hoc_requests` stornieren und `kid_permissions` ändern.
3. **Kinder-Einschränkungen:** Kinder können keine Eltern-Profile ändern oder Fremde verknüpfen.

---

## ⚡ REALTME & PUSH NOTIFICATIONS LOGIC

1. Erstelle einen **Supabase Database Trigger** bei `ad_hoc_requests` INSERT:
   - Sende automatisch eine Push-Benachrichtigung an alle verbundenen Familien (`family_connections`).
2. Erstelle einen **Wish-Match Trigger** bei `wishes` INSERT:
   - Wenn zwei Kinder aus befreundeten Familien den gleichen Wunsch (`category`) eingetragen haben, erstelle automatisch einen Eintrag in `wish_matches` und benachrichtige die Eltern beider Familien.

---

## 📑 AUFGABEN FÜR GEMINI PRO

Bitte generiere folgenden Output:
1. Das komplette SQL-Migrations-Skript für Supabase (`schema.sql`).
2. Den TypeScript Supabase Client Helper (`supabaseClient.ts`) für React Native / Web.
3. Die Supabase Edge Function (`index.ts`) für Expo Push Notifications.
```
