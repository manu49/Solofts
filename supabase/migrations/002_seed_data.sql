-- ============================================================
-- SOLOFTS — Seed Data
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- Seed gear items (no auth required — service role)
insert into public.gear_items (name, brand, category, description, price_usd, affiliate_url) values
  ('GoPro Hero 13 Black', 'GoPro', 'camera', 'Best-in-class action camera. Waterproof to 33ft, 5.3K video, HyperSmooth 6.0 stabilization. Solo travelers love the built-in mounting options.', 399, 'https://www.amazon.com/dp/B0CF3B7VB7'),
  ('DJI Osmo Pocket 3', 'DJI', 'camera', 'Tiny stabilized camera that fits in your pocket. Perfect for solo travel — no tripod needed for smooth footage.', 519, 'https://www.amazon.com/dp/B0CG3KY1TV'),
  ('Pacsafe Venturesafe X Anti-Theft Backpack', 'Pacsafe', 'backpack', 'Slash-proof, RFID-blocking, lockable zippers. The gold standard for solo female travelers in crowded destinations.', 159, 'https://www.amazon.com/dp/B076P52B4D'),
  ('Garmin inReach Mini 2', 'Garmin', 'safety', 'Satellite communicator for off-grid adventures. Two-way messaging and SOS — works when your phone has zero signal.', 349, 'https://www.amazon.com/dp/B09MN499HV'),
  ('She''s Birdie Personal Alarm', 'She''s Birdie', 'safety', '130dB alarm, strobe light, easy activation. Fits on a keychain. Every solo female traveler should have one.', 28, 'https://www.amazon.com/dp/B07BGSZ87M'),
  ('Osprey Farpoint 40 Women''s', 'Osprey', 'backpack', 'Best carry-on sized travel pack. Women-specific fit, removable daypack. Fits in most overhead bins.', 165, 'https://www.amazon.com/dp/B00G0LIM2M'),
  ('Apple AirTag 4-Pack', 'Apple', 'tech', 'Track your luggage in real-time. Sew one into your bag and never panic at baggage claim again.', 99, 'https://www.amazon.com/dp/B0933BVK6T'),
  ('Anker 733 Power Bank', 'Anker', 'tech', '20,000mAh, USB-C PD 65W. Charges laptop + phone simultaneously. Enough power for 3+ days off-grid.', 80, 'https://www.amazon.com/dp/B09VPHVT2Z'),
  ('Wise Travel Card', 'Wise', 'tech', 'Multi-currency card with real exchange rates. Accepted worldwide, no foreign transaction fees. A solo traveler essential.', 0, 'https://wise.com'),
  ('Sea to Summit Silk Travel Liner', 'Sea to Summit', 'sleep', 'Lightweight silk sleeping bag liner. Adds warmth to sketchy hostel blankets and protects against bed bugs.', 89, 'https://www.amazon.com/dp/B000BH2Y8I');

-- Seed a few sample safety reports (using placeholder UUIDs — replace with real user IDs)
-- These are just for demonstration; real data comes from user submissions
