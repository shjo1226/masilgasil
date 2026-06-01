This is a [Next.js](https://nextjs.org/) app that serves as both the frontend and server layer for MasilGasil.

## Getting Started

1. Copy `.env.example` to `.env.local`.
2. Fill in Kakao and Supabase credentials.
   - `DB_KAKAO_API_KEY` is used for Kakao login.
   - `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY` is used for Kakao Maps SDK.
   - Register `http://localhost:3000` in Kakao Developers > Platform > Web site domain for local map testing.
3. Load `supabase/schema.sql` and `supabase/seed.sql` into your Supabase project.
4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Useful local endpoints:

- `/api/health` confirms whether the app is running in `mock` or `supabase` mode.
- `/call/api/v1/...` is the compatibility layer that replaces the old backend.

## Learn More

To learn more about the stack, take a look at:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

## Deploy on Vercel

Deploy this repository to Vercel and set `NEXT_PUBLIC_SITE_URL`, `NEXTAUTH_URL`, and the Supabase env vars in the project settings.
