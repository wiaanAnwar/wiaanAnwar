import { apiRequest } from './httpClient';
import { Location } from '../data/locations';
import { Addon, Approver, PayMethod } from '../data/addons';

interface ApiLocation { id: number; nameEn: string; nameAr: string; subEn: string; subAr: string }
interface ApiAddon { id: string; nameEn: string; nameAr: string; subEn: string; subAr: string; priceUsd: number; unit: 'once' | 'day' }
interface ApiApprover { id: string; name: string; nameAr: string; role: string; roleAr: string }
interface ApiPayMethod { id: string; nameEn: string; nameAr: string; subEn: string; subAr: string; orgOnly: boolean }

export const referenceService = {
  async getLocations(): Promise<Location[]> {
    const { locations } = await apiRequest<{ locations: ApiLocation[] }>('/locations', { auth: false });
    return locations.map((l) => ({ en: l.nameEn, ar: l.nameAr, enSub: l.subEn, arSub: l.subAr }));
  },

  async getAddons(): Promise<Addon[]> {
    const { addons } = await apiRequest<{ addons: ApiAddon[] }>('/addons', { auth: false });
    return addons.map((a) => ({ id: a.id, en: a.nameEn, ar: a.nameAr, enSub: a.subEn, arSub: a.subAr, price: a.priceUsd, unit: a.unit }));
  },

  async getApprovers(): Promise<Approver[]> {
    const { approvers } = await apiRequest<{ approvers: ApiApprover[] }>('/approvers');
    return approvers.map((a) => ({ id: a.id, en: a.name, ar: a.nameAr, enRole: a.role, arRole: a.roleAr }));
  },

  async getPayMethods(): Promise<PayMethod[]> {
    const { paymentMethods } = await apiRequest<{ paymentMethods: ApiPayMethod[] }>('/payment-methods');
    return paymentMethods.map((p) => ({ id: p.id as PayMethod['id'], en: p.nameEn, ar: p.nameAr, enSub: p.subEn, arSub: p.subAr, orgOnly: p.orgOnly }));
  },
};
