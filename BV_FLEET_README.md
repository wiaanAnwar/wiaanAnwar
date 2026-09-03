# BV Fleet

Customer-facing rental app for BV Bavarian Rent A Car (Khartoum), built from the
Claude Design handoff in `project/` and `chats/` (see `DESIGN_HANDOFF_README.md`
for the original bundle notes).

- `mobile-app/` — Expo (React Native + TypeScript) app
- `backend/` — Express + Prisma + SQLite API

## Run it

**Backend**
```bash
cd backend
cp .env.example .env   # then set a real JWT_SECRET
npm install
npx prisma migrate dev
npm run seed
npm run dev             # http://localhost:4000
```

**Mobile app**
```bash
cd mobile-app
cp .env.example .env   # set EXPO_PUBLIC_API_URL (see note below)
npm install
npx expo start
```
Press `i` (iOS simulator), `a` (Android emulator), or scan the QR code with
Expo Go on a physical device.

`EXPO_PUBLIC_API_URL` in `mobile-app/.env`:
- iOS simulator: `http://localhost:4000` (default)
- Android emulator: `http://10.0.2.2:4000`
- Physical device via Expo Go: your machine's LAN IP, e.g. `http://192.168.1.20:4000`

## Demo accounts

Seeded phone numbers (any 4-digit code works in dev mode — the backend
console prints the real generated code, prefixed `[DEV OTP]`):

| Phone | Account type |
|---|---|
| `0900000001` | Individual |
| `0900000002` | Business |
| `0900000003` | UN & INGO |
