import { create } from 'zustand';
import { Alert, Platform } from 'react-native';
import { useAuthStore } from './authStore';

interface SubscriptionState {
  isPremium: boolean;
  isRestoring: boolean;
  isPurchasing: boolean;

  checkPremium: () => boolean;
  purchase: () => Promise<void>;
  restore: () => Promise<void>;
  setPremium: (value: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  isPremium: false,
  isRestoring: false,
  isPurchasing: false,

  checkPremium: () => {
    const user = useAuthStore.getState().user;
    return user?.is_premium || false;
  },

  purchase: async () => {
    set({ isPurchasing: true });
    try {
      // TODO: RevenueCat integration
      // import Purchases from 'react-native-purchases';
      // const { customerInfo } = await Purchases.purchaseProduct('vitaflow_premium_monthly');
      // if (customerInfo.entitlements.active['premium']) {
      //   set({ isPremium: true });
      // }
      Alert.alert('Coming Soon', 'Subscription will be available soon!');
    } catch (err: any) {
      if (!err.userCancelled) {
        Alert.alert('Error', err.message);
      }
    } finally {
      set({ isPurchasing: false });
    }
  },

  restore: async () => {
    set({ isRestoring: true });
    try {
      // TODO: RevenueCat integration
      // import Purchases from 'react-native-purchases';
      // const customerInfo = await Purchases.restorePurchases();
      // if (customerInfo.entitlements.active['premium']) {
      //   set({ isPremium: true });
      // } else {
      //   Alert.alert('No Purchases', 'No active subscriptions found');
      // }
      Alert.alert('Coming Soon', 'Restore will be available soon!');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      set({ isRestoring: false });
    }
  },

  setPremium: (value) => set({ isPremium: value }),
}));

// Premium feature gates
export const PREMIUM_LIMITS = {
  maxResumes: 1,        // Free: 1, Premium: unlimited
  maxAIPerDay: 5,       // Free: 5/day, Premium: unlimited
  freeTemplateIds: [1, 2, 3], // Template IDs that are free
} as const;

export function canCreateResume(currentCount: number, isPremium: boolean): boolean {
  return isPremium || currentCount < PREMIUM_LIMITS.maxResumes;
}

export function canUseTemplate(templateId: number, isPremium: boolean): boolean {
  return isPremium || (PREMIUM_LIMITS.freeTemplateIds as readonly number[]).includes(templateId);
}

export function shouldShowWatermark(isPremium: boolean): boolean {
  return !isPremium;
}
