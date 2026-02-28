# Specification

## Summary
**Goal:** Implement all remaining core features for Vivah Connect: OTP-based registration, detailed multi-section profiles, photo uploads with a 4-photo gate, AI compatibility scoring, like/reject with mutual matching, payment-gated chat, encrypted chat with auto-lock on contact detection, and phone number privacy enforcement.

**Planned changes:**
- Add mandatory phone number field to registration with mock OTP verification (always `123456`); block registration if phone is missing; optionally verify email with mock OTP if provided
- Build detailed profile editing with four sections: Personal Details (name, gender, DOB with auto-age, height, weight, religion, caste, sub-caste, gotra, mother tongue, marital status, location, manglik status), Education & Job (qualification, job type, company, position, work location, monthly/annual income), Family Details (father/mother name, occupation, income, phone, siblings count, family type/status), and optional horoscope file upload
- Implement photo upload with client-side image compression; require at least 4 photos before a profile appears in match suggestions; allow users to view and delete their own photos; hide profile from browsing if photo count drops below 4
- Build a backend compatibility scoring engine (0–100%) using age, religion/caste, gotra, horoscope availability, location, education, income, and family background; return ranked match suggestions sorted by score descending; display score prominently on match cards
- Add Like and Reject actions on match cards; create a mutual match when both users have liked each other; persist matches in backend; prevent rejected profiles from reappearing; show mutual matches list in dashboard
- Implement payment-gated chat: after mutual match, prompt each user to pay ₹200 via mock UPI (8456916064@ybl / 6370081492@ybl); unlock chat only after both users have paid; store transaction records with status, date, amount, and counterpart; show payment history in user dashboard and admin panel
- Build a polling-based chat interface for matched, payment-verified users; detect phone numbers, UPI IDs, and email addresses client-side before send; on detection, block the message, lock the chat thread, warn the sender, and create an admin notification containing only metadata (user IDs, timestamp, reason — no message content); show locked chat entries in an admin Locked Chats Monitor
- Enforce phone number privacy: blur all candidate phone numbers by default in UI and API responses (e.g., `98XXXXXX12`); show a "View Phone Number – ₹250" button; after mock payment confirmed, backend returns plain-text number for that specific candidate only; admin always sees full phone numbers

**User-visible outcome:** Users can register with phone OTP verification, fill out comprehensive profiles, upload photos, browse AI-ranked match suggestions with compatibility scores, like/reject profiles to form mutual matches, pay ₹200 to unlock chat with a match, and message safely with auto-lock protection. Phone numbers remain private until a separate ₹250 payment is made per candidate.
