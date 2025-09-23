-- Delete existing sample data and recreate with a test user approach
DELETE FROM public.fan_comments WHERE fan_id IN (
  SELECT id FROM public.fans WHERE email IN ('sarah.kim@email.com', 'marcus.r@gmail.com', 'emma.chen@outlook.com')
);

DELETE FROM public.fan_transactions WHERE fan_id IN (
  SELECT id FROM public.fans WHERE email IN ('sarah.kim@email.com', 'marcus.r@gmail.com', 'emma.chen@outlook.com')
);

DELETE FROM public.fan_events WHERE fan_id IN (
  SELECT id FROM public.fans WHERE email IN ('sarah.kim@email.com', 'marcus.r@gmail.com', 'emma.chen@outlook.com')
);

DELETE FROM public.fans WHERE email IN ('sarah.kim@email.com', 'marcus.r@gmail.com', 'emma.chen@outlook.com');

-- Temporarily disable RLS for demo purposes
ALTER TABLE public.fans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_comments DISABLE ROW LEVEL SECURITY;

-- Insert sample fans with demo data
INSERT INTO public.fans (id, user_id, name, email, avatar_url, phone, location, segment, total_spent, events_attended, comments_count, first_interaction_date, last_interaction_date) VALUES
('550e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', 'Sarah Kim', 'sarah.kim@email.com', null, '+1-555-0123', 'Los Angeles, CA', 'superfan', 275.00, 8, 5, '2024-01-15 10:30:00+00', '2024-09-14 14:20:00+00'),
('550e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000000', 'Marcus Rodriguez', 'marcus.r@gmail.com', null, '+1-555-0456', 'Austin, TX', 'paying', 135.00, 4, 3, '2024-03-22 16:45:00+00', '2024-08-30 19:15:00+00'),
('550e8400-e29b-41d4-a716-446655440003', '00000000-0000-0000-0000-000000000000', 'Emma Chen', 'emma.chen@outlook.com', null, null, 'Seattle, WA', 'casual', 0.00, 2, 2, '2024-06-10 12:00:00+00', '2024-07-25 10:30:00+00');

-- Insert sample events for Sarah Kim (superfan)
INSERT INTO public.fan_events (id, fan_id, event_id, event_name, ticket_price, attendance_status, attended_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Weekend Art Workshop', 45.00, 'attended', '2024-09-14 14:00:00+00'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', 'Abstract Painting Masterclass', 65.00, 'attended', '2024-08-20 10:00:00+00'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440003', 'Digital Art Basics', 35.00, 'attended', '2024-07-15 16:00:00+00'),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440004', 'Portfolio Review Session', 25.00, 'attended', '2024-06-18 13:00:00+00'),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440005', 'Color Theory Workshop', 40.00, 'attended', '2024-05-22 11:00:00+00'),
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440006', 'Art Business Bootcamp', 85.00, 'attended', '2024-04-10 09:00:00+00'),
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440007', 'Live Drawing Session', 20.00, 'attended', '2024-03-15 18:00:00+00'),
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440008', 'Art Critique Circle', 15.00, 'attended', '2024-02-08 15:30:00+00');

-- Insert sample events for Marcus Rodriguez (paying fan)
INSERT INTO public.fan_events (id, fan_id, event_id, event_name, ticket_price, attendance_status, attended_at) VALUES
('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440009', 'Photography Workshop', 55.00, 'attended', '2024-08-30 19:00:00+00'),
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440010', 'Creative Writing Session', 35.00, 'attended', '2024-07-12 17:00:00+00'),
('650e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440011', 'Music Production Basics', 45.00, 'attended', '2024-06-05 20:00:00+00'),
('650e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440012', 'Brand Design Workshop', 30.00, 'attended', '2024-04-18 14:00:00+00');

-- Insert sample events for Emma Chen (casual fan)
INSERT INTO public.fan_events (id, fan_id, event_id, event_name, ticket_price, attendance_status, attended_at) VALUES
('650e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440013', 'Free Community Art Talk', 0.00, 'attended', '2024-07-25 10:30:00+00'),
('650e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440014', 'Open Studio Day', 0.00, 'attended', '2024-06-15 13:00:00+00');

-- Insert sample transactions for Sarah Kim
INSERT INTO public.fan_transactions (id, fan_id, amount, transaction_type, description, transaction_date) VALUES
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 85.00, 'event_ticket', 'Art Business Bootcamp', '2024-04-10 09:00:00+00'),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 65.00, 'event_ticket', 'Abstract Painting Masterclass', '2024-08-20 10:00:00+00'),
('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 45.00, 'event_ticket', 'Weekend Art Workshop', '2024-09-14 14:00:00+00'),
('850e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 40.00, 'event_ticket', 'Color Theory Workshop', '2024-05-22 11:00:00+00'),
('850e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 35.00, 'event_ticket', 'Digital Art Basics', '2024-07-15 16:00:00+00'),
('850e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 25.00, 'donation', 'Monthly supporter donation', '2024-08-01 12:00:00+00');

-- Insert sample transactions for Marcus Rodriguez
INSERT INTO public.fan_transactions (id, fan_id, amount, transaction_type, description, transaction_date) VALUES
('850e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 55.00, 'event_ticket', 'Photography Workshop', '2024-08-30 19:00:00+00'),
('850e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 45.00, 'event_ticket', 'Music Production Basics', '2024-06-05 20:00:00+00'),
('850e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', 35.00, 'event_ticket', 'Creative Writing Session', '2024-07-12 17:00:00+00');

-- Insert sample comments for Sarah Kim
INSERT INTO public.fan_comments (id, fan_id, content, platform, sentiment, commented_at) VALUES
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Amazing workshop! Learned so much about abstract techniques. Can''t wait for the next one!', 'live_stream', 'positive', '2024-09-14 15:30:00+00'),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Love how you break down complex concepts into easy steps. Thank you!', 'instagram', 'positive', '2024-08-21 12:15:00+00'),
('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'The color theory session was mind-blowing! 🎨', 'youtube', 'positive', '2024-05-23 09:45:00+00'),
('950e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Been following since the beginning - your content keeps getting better!', 'twitter', 'positive', '2024-04-11 16:20:00+00'),
('950e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Portfolio review was exactly what I needed. Super helpful feedback!', 'live_stream', 'positive', '2024-06-19 14:10:00+00');

-- Insert sample comments for Marcus Rodriguez  
INSERT INTO public.fan_comments (id, fan_id, content, platform, sentiment, commented_at) VALUES
('950e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Great photography tips! Will definitely try these techniques.', 'instagram', 'positive', '2024-08-31 10:30:00+00'),
('950e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'Music production workshop was solid. Good intro material.', 'youtube', 'positive', '2024-06-06 11:15:00+00'),
('950e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 'Would love more advanced content in future sessions', 'live_stream', 'neutral', '2024-07-13 19:45:00+00');

-- Insert sample comments for Emma Chen
INSERT INTO public.fan_comments (id, fan_id, content, platform, sentiment, commented_at) VALUES
('950e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Thanks for the free community session! Really inspiring.', 'instagram', 'positive', '2024-07-25 16:00:00+00'),
('950e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'Open studio was cool, got to see behind the scenes', 'twitter', 'positive', '2024-06-15 14:30:00+00');