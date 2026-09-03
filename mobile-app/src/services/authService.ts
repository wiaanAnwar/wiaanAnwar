import { apiRequest, setToken, ApiError } from './httpClient';
import { AccountType } from '../data/account';

export interface ApiUser {
  id: string;
  phone: string;
  name: string;
  nameAr: string | null;
  accountType: AccountType;
  organization: { id: string; name: string; nameAr: string; contractRef: string; validUntil: string; sdgRate: number } | null;
}

export const authService = {
  async sendCode(phone: string): Promise<{ ok: true }> {
    return apiRequest('/auth/send-code', { method: 'POST', body: { phone }, auth: false });
  },

  async verifyCode(phone: string, code: string): Promise<{ ok: true; user: ApiUser } | { ok: false }> {
    try {
      const { token, user } = await apiRequest<{ token: string; user: ApiUser }>('/auth/verify-code', {
        method: 'POST',
        body: { phone, code },
        auth: false,
      });
      await setToken(token);
      return { ok: true, user };
    } catch (e) {
      if (e instanceof ApiError && (e.code === 'incorrect_code' || e.code === 'expired_or_missing' || e.code === 'too_many_attempts')) {
        return { ok: false };
      }
      throw e;
    }
  },

  async me(): Promise<ApiUser> {
    const { user } = await apiRequest<{ user: ApiUser }>('/auth/me');
    return user;
  },

  async signOut(): Promise<void> {
    await setToken(null);
  },
};
