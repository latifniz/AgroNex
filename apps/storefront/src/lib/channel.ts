import { cookies } from 'next/headers';

const CHANNEL_COOKIE = 'agronex-channel';

export async function getChannelToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CHANNEL_COOKIE)?.value ?? (process.env.VENDURE_CHANNEL_TOKEN || null);
}
