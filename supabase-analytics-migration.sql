-- =========================================================================
-- CalculationHub — Privacy-First Analytics Schema Migration for Supabase
-- =========================================================================

-- 1. Table: page_views (raw visit rows, retained for 90 days)
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  page TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  referrer TEXT,
  device TEXT NOT NULL CHECK (device IN ('mobile', 'tablet', 'desktop')),
  country TEXT,
  city TEXT
);

-- Indexes for fast querying & date range filtering
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_hash ON public.page_views (visitor_hash);
CREATE INDEX IF NOT EXISTS idx_page_views_page ON public.page_views (page);

-- 2. Table: tool_uses (anonymous calculator execution events, NO INPUTS STORED)
CREATE TABLE IF NOT EXISTS public.tool_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  calculator TEXT NOT NULL CHECK (calculator IN ('salary', 'zakat', 'property', 'gst', 'fitrana', 'ushr')),
  tool_name TEXT NOT NULL,
  visitor_hash TEXT NOT NULL
);

-- Indexes for calculator tool usage aggregation
CREATE INDEX IF NOT EXISTS idx_tool_uses_created_at ON public.tool_uses (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tool_uses_calculator ON public.tool_uses (calculator);

-- 3. Table: daily_analytics_summary (ONE row per day, RETAINED FOREVER / LIFETIME)
CREATE TABLE IF NOT EXISTS public.daily_analytics_summary (
  date DATE PRIMARY KEY,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  page_views INTEGER NOT NULL DEFAULT 0,
  calculator_uses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_summary_date ON public.daily_analytics_summary (date DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_uses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_analytics_summary ENABLE ROW LEVEL SECURITY;

-- 5. Policies: Allow server / service_role full access; allow public insert for analytics beacon
DROP POLICY IF EXISTS "Allow anon insert to page_views" ON public.page_views;
CREATE POLICY "Allow anon insert to page_views" ON public.page_views
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon insert to tool_uses" ON public.tool_uses;
CREATE POLICY "Allow anon insert to tool_uses" ON public.tool_uses
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon insert to daily_analytics_summary" ON public.daily_analytics_summary;
CREATE POLICY "Allow anon insert to daily_analytics_summary" ON public.daily_analytics_summary
  FOR ALL USING (true);

-- 6. Automated 90-day retention cleanup for raw events (Daily summaries are NEVER deleted)
-- Optional cron if pg_cron is enabled in Supabase:
-- SELECT cron.schedule('purge-old-analytics', '0 3 * * *', $$
--   DELETE FROM public.page_views WHERE created_at < now() - INTERVAL '90 days';
--   DELETE FROM public.tool_uses WHERE created_at < now() - INTERVAL '90 days';
-- $$);

