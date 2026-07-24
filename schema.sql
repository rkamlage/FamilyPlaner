-- Drop tables if they exist to allow clean re-run
DROP TABLE IF EXISTS public.kid_permissions CASCADE;
DROP TABLE IF EXISTS public.recurring_hobbies CASCADE;
DROP TABLE IF EXISTS public.wishes CASCADE;
DROP TABLE IF EXISTS public.ad_hoc_rsvps CASCADE;
DROP TABLE IF EXISTS public.ad_hoc_requests CASCADE;
DROP TABLE IF EXISTS public.family_connections CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.families CASCADE;

-- 1. `families`
CREATE TABLE public.families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    invite_code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. `users`
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE, -- Links to Supabase auth.users
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(30) CHECK (role IN ('parent', 'child_independent', 'child_managed')),
    avatar VARCHAR(10) DEFAULT '👨',
    age INT,
    is_parent BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE, -- ONLY ONE ADMIN PER FAMILY
    has_own_device BOOLEAN DEFAULT FALSE,
    pin_code VARCHAR(6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. `family_connections`
CREATE TABLE public.family_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_a_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    family_b_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'connected' CHECK (status IN ('pending', 'connected', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(family_a_id, family_b_id)
);

-- 4. `ad_hoc_requests`
CREATE TABLE public.ad_hoc_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    creator_name VARCHAR(100) NOT NULL, -- Simplified for quick use
    activity VARCHAR(255) NOT NULL,
    scheduled_time VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    target_audience VARCHAR(100) DEFAULT 'Alle befreundeten Familien',
    cost VARCHAR(50),
    parent_present VARCHAR(100) DEFAULT 'Mit Eltern-Begleitung',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. `ad_hoc_rsvps`
CREATE TABLE public.ad_hoc_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.ad_hoc_requests(id) ON DELETE CASCADE,
    responder_name VARCHAR(100) NOT NULL,
    responder_family VARCHAR(100) NOT NULL,
    response VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. `wishes`
CREATE TABLE public.wishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    child_name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    cost VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. `recurring_hobbies`
CREATE TABLE public.recurring_hobbies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    child_name VARCHAR(100) NOT NULL,
    title VARCHAR(150) NOT NULL,
    schedule VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    bring_driver VARCHAR(100) NOT NULL,
    get_driver VARCHAR(100) NOT NULL,
    parent_present VARCHAR(100) DEFAULT 'Ohne Eltern',
    status VARCHAR(50) DEFAULT 'Fahrten geregelt ✅',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. `kid_permissions`
CREATE TABLE public.kid_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    can_send_adhoc_directly BOOLEAN DEFAULT TRUE,
    requires_wish_approval BOOLEAN DEFAULT TRUE,
    max_budget VARCHAR(50) DEFAULT '15 €'
);

-- Setup Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.ad_hoc_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ad_hoc_rsvps;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wishes;
