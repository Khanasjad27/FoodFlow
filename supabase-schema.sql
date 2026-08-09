-- FoodFlow AI: Supabase Database Schema & Seed Script
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create Restaurants Table
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create NGOs Table
CREATE TABLE IF NOT EXISTS public.ngos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT NOT NULL,
  reliability_score INT DEFAULT 80 CHECK (reliability_score >= 0 AND reliability_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Listings Table
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  food_type TEXT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  expiry_time TIMESTAMPTZ NOT NULL,
  pickup_location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'picked_up')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Claims Table
CREATE TABLE IF NOT EXISTS public.claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  ngo_id UUID REFERENCES public.ngos(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'claimed' CHECK (status IN ('claimed', 'picked_up')),
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  picked_up_at TIMESTAMPTZ
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users for all tables
CREATE POLICY "Allow authenticated read on restaurants" ON public.restaurants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on ngos" ON public.ngos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on listings" ON public.listings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on claims" ON public.claims FOR SELECT TO authenticated USING (true);

-- Allow users to insert/update their own restaurant or NGO profile
CREATE POLICY "Allow insert own restaurant" ON public.restaurants FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Allow insert own ngo" ON public.ngos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow restaurants to insert and update their own listings
CREATE POLICY "Allow insert listing" ON public.listings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update listing" ON public.listings FOR UPDATE TO authenticated USING (true);

-- Allow NGOs to insert and update claims
CREATE POLICY "Allow insert claim" ON public.claims FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow update claim" ON public.claims FOR UPDATE TO authenticated USING (true);

-- Seed Data: Sample Restaurants
INSERT INTO public.restaurants (id, name, email, location) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Green Leaf Bistro', 'bistro@greenleaf.com', '124 Market St, Downtown'),
  ('a2222222-2222-2222-2222-222222222222', 'Harvest Table Cafe', 'contact@harvesttable.org', '580 Grand Ave, West End'),
  ('a3333333-3333-3333-3333-333333333333', 'Fresh Choice Deli', 'hello@freshchoicedeli.com', '89 Oak Street, Midtown'),
  ('a4444444-4444-4444-4444-444444444444', 'Artisan Bakery Royale', 'pastry@bakeryroyale.com', '312 Pine Plaza, East District'),
  ('a5555555-5555-5555-5555-555555555555', 'Urban Kitchen Express', 'info@urbankitchen.com', '705 University Ave, Northside');

-- Seed Data: Sample NGOs
INSERT INTO public.ngos (id, name, email, location, reliability_score) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Hope Food Bank', 'contact@hopefoodbank.org', '45 Community Way, Sector 4', 92),
  ('b2222222-2222-2222-2222-222222222222', 'Community Table Network', 'info@communitytable.org', '110 Shelter Boulevard', 88),
  ('b3333333-3333-3333-3333-333333333333', 'Shelter Services Coalition', 'support@shelterservices.org', '302 Mission Street', 85),
  ('b4444444-4444-4444-4444-444444444444', 'Meals for All Foundation', 'hello@mealsforall.org', '90 Care Drive, Southside', 95),
  ('b5555555-5555-5555-5555-555555555555', 'City Rescue Mission', 'dispatch@cityrescuemission.org', '512 Harbor View Road', 80);

-- Seed Data: Sample Listings
INSERT INTO public.listings (id, restaurant_id, food_type, quantity, expiry_time, pickup_location, status) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Prepared Meals', 45, NOW() + INTERVAL '3 hours', '124 Market St (Back Entrance Loading Bay)', 'pending'),
  ('c2222222-2222-2222-2222-222222222222', 'a4444444-4444-4444-4444-444444444444', 'Bakery & Bread', 30, NOW() + INTERVAL '6 hours', '312 Pine Plaza (Front Counter)', 'pending'),
  ('c3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'Sandwiches & Salads', 20, NOW() + INTERVAL '4 hours', '89 Oak Street (Kitchen Alley)', 'pending'),
  ('c4444444-4444-4444-4444-444444444444', 'a2222222-2222-2222-2222-222222222222', 'Prepared Meals', 50, NOW() + INTERVAL '8 hours', '580 Grand Ave (Side Gate)', 'claimed'),
  ('c5555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555555', 'Fresh Produce & Soups', 60, NOW() - INTERVAL '2 hours', '705 University Ave', 'picked_up'),
  ('c6666666-6666-6666-6666-666666666666', 'a1111111-1111-1111-1111-111111111111', 'Dairy & Packaged Items', 25, NOW() - INTERVAL '5 hours', '124 Market St', 'picked_up');

-- Seed Data: Sample Claims
INSERT INTO public.claims (id, listing_id, ngo_id, status, claimed_at, picked_up_at) VALUES
  ('d4444444-4444-4444-4444-444444444444', 'c4444444-4444-4444-4444-444444444444', 'b1111111-1111-1111-1111-111111111111', 'claimed', NOW() - INTERVAL '30 minutes', NULL),
  ('d5555555-5555-5555-5555-555555555555', 'c5555555-5555-5555-5555-555555555555', 'b4444444-4444-4444-4444-444444444444', 'picked_up', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours'),
  ('d6666666-6666-6666-6666-666666666666', 'c6666666-6666-6666-6666-666666666666', 'b2222222-2222-2222-2222-222222222222', 'picked_up', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 hours');
