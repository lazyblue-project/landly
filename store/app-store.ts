import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  UserProfile,
  AppMode,
  Language,
  PassPlan,
  ReceiptRecord,
  CareVisitPrepNote,
  StayPlanInput,
  StayDocument,
  CalendarEvent,
  StampGoal,
  CompanionProfile,
  ReminderItem,
  type BetaMissionId,
  type BetaFeedbackRecord,
  type TranslationFeedbackRecord,
  type UserFeedbackRecord,
} from "@/types";
import { mockUser } from "@/data/mock-user";
import { shopReceipts } from "@/data/shop-receipts";
import { careVisitNotes } from "@/data/care-visit-notes";
import { stayDocuments as initialStayDocuments } from "@/data/stay-documents";

interface SnackbarState {
  id: number;
  message: string;
  tone: "default" | "success" | "warning";
}

interface AppState {
  user: UserProfile;
  savedPassPlans: PassPlan[];
  savedShopStoreIds: string[];
  receiptRecords: ReceiptRecord[];
  savedCareProviderIds: string[];
  visitPrepNotes: CareVisitPrepNote[];
  stayPlanInput: StayPlanInput | null;
  stayDocuments: StayDocument[];
  savedStayResourceIds: string[];
  calendarEvents: CalendarEvent[];
  customStampGoals: StampGoal[];
  completedStampGoalIds: string[];
  interestedPromotionIds: string[];
  savedPromotionIds: string[];
  bookedPromotionIds: string[];
  savedPartnerOfferIds: string[];
  requestedPartnerOfferIds: string[];
  acknowledgedPartnerDisclosureIds: string[];
  departureDate?: string;
  companions: CompanionProfile[];
  completedArrival72TaskIds: string[];
  completedStayMissionIds: string[];
  completedBetaMissionIds: BetaMissionId[];
  betaFeedbackRecords: BetaFeedbackRecord[];
  translationFeedbackRecords: TranslationFeedbackRecord[];
  userFeedbackRecords: UserFeedbackRecord[];
  completedPilotQaCheckIds: string[];
  manualReminderItems: ReminderItem[];
  completedReminderIds: string[];
  isBetaTester: boolean;
  hasHydrated: boolean;
  snackbar: SnackbarState | null;
  setHasHydrated: (value: boolean) => void;
  showSnackbar: (message: string, tone?: SnackbarState["tone"]) => void;
  hideSnackbar: () => void;
  setUser: (user: UserProfile) => void;
  setMode: (mode: AppMode) => void;
  setLanguage: (language: Language) => void;
  setCity: (city: string) => void;
  setDepartureDate: (value?: string) => void;
  setBetaTester: (value: boolean) => void;
  completeOnboarding: () => void;
  toggleSavedPlace: (placeId: string) => void;
  toggleSavedPhrase: (phraseId: string) => void;
  toggleChecklistItem: (itemId: string) => void;
  savePassPlan: (plan: PassPlan) => void;
  removePassPlan: (planId: string) => void;
  toggleSavedShopStore: (storeId: string) => void;
  toggleSavedCareProvider: (providerId: string) => void;
  addReceiptRecord: (record: ReceiptRecord) => void;
  updateReceiptStatus: (id: string, status: ReceiptRecord["refundStatus"]) => void;
  updateReceiptRecord: (id: string, patch: Partial<ReceiptRecord>) => void;
  removeReceiptRecord: (id: string) => void;
  saveVisitPrepNote: (note: CareVisitPrepNote) => void;
  removeVisitPrepNote: (id: string) => void;
  saveStayPlanInput: (input: StayPlanInput) => void;
  addStayDocument: (document: StayDocument) => void;
  removeStayDocument: (id: string) => void;
  toggleSavedStayResource: (resourceId: string) => void;
  addCalendarEvent: (event: CalendarEvent) => void;
  removeCalendarEvent: (id: string) => void;
  addCustomStampGoal: (goal: Omit<StampGoal, "id" | "source" | "points"> & { points?: number }) => void;
  removeCustomStampGoal: (id: string) => void;
  toggleStampGoalCompleted: (id: string) => void;
  togglePromotionInterest: (id: string) => void;
  toggleSavedPromotion: (id: string) => void;
  toggleBookedPromotion: (id: string) => void;
  toggleSavedPartnerOffer: (id: string) => void;
  toggleRequestedPartnerOffer: (id: string) => void;
  acknowledgePartnerDisclosure: (id: string) => void;
  saveCompanion: (companion: CompanionProfile) => void;
  removeCompanion: (id: string) => void;
  toggleArrival72Task: (id: string) => void;
  toggleStayMission: (id: string) => void;
  toggleBetaMissionCompleted: (id: BetaMissionId) => void;
  addBetaFeedbackRecord: (record: BetaFeedbackRecord) => void;
  removeBetaFeedbackRecord: (id: string) => void;
  addTranslationFeedbackRecord: (record: TranslationFeedbackRecord) => void;
  removeTranslationFeedbackRecord: (id: string) => void;
  addUserFeedbackRecord: (record: UserFeedbackRecord) => void;
  removeUserFeedbackRecord: (id: string) => void;
  togglePilotQaCheck: (id: string) => void;
  addManualReminder: (item: ReminderItem) => void;
  removeManualReminder: (id: string) => void;
  toggleReminderDone: (id: string) => void;
  importBackupSnapshot: (snapshot: Record<string, unknown>) => string[];
}

type PersistedAppState = Pick<
  AppState,
  | "user"
  | "savedPassPlans"
  | "savedShopStoreIds"
  | "receiptRecords"
  | "savedCareProviderIds"
  | "visitPrepNotes"
  | "stayPlanInput"
  | "stayDocuments"
  | "savedStayResourceIds"
  | "calendarEvents"
  | "customStampGoals"
  | "completedStampGoalIds"
  | "interestedPromotionIds"
  | "savedPromotionIds"
  | "bookedPromotionIds"
  | "savedPartnerOfferIds"
  | "requestedPartnerOfferIds"
  | "acknowledgedPartnerDisclosureIds"
  | "departureDate"
  | "companions"
  | "completedArrival72TaskIds"
  | "completedStayMissionIds"
  | "completedBetaMissionIds"
  | "betaFeedbackRecords"
  | "translationFeedbackRecords"
  | "userFeedbackRecords"
  | "completedPilotQaCheckIds"
  | "manualReminderItems"
  | "completedReminderIds"
  | "isBetaTester"
>;

const RESTORABLE_BACKUP_KEYS: Array<keyof PersistedAppState> = [
  "user",
  "savedPassPlans",
  "savedShopStoreIds",
  "receiptRecords",
  "savedCareProviderIds",
  "visitPrepNotes",
  "stayPlanInput",
  "stayDocuments",
  "savedStayResourceIds",
  "calendarEvents",
  "customStampGoals",
  "completedStampGoalIds",
  "interestedPromotionIds",
  "savedPromotionIds",
  "bookedPromotionIds",
  "savedPartnerOfferIds",
  "requestedPartnerOfferIds",
  "acknowledgedPartnerDisclosureIds",
  "departureDate",
  "companions",
  "completedArrival72TaskIds",
  "completedStayMissionIds",
  "completedBetaMissionIds",
  "betaFeedbackRecords",
  "translationFeedbackRecords",
  "userFeedbackRecords",
  "completedPilotQaCheckIds",
  "manualReminderItems",
  "completedReminderIds",
  "isBetaTester",
];

function pickRestorableBackupPatch(snapshot: Record<string, unknown>) {
  const patch: Partial<PersistedAppState> = {};

  RESTORABLE_BACKUP_KEYS.forEach((key) => {
    const value = snapshot[key as string];
    if (value !== undefined) {
      (patch as Record<string, unknown>)[key] = value;
    }
  });

  return patch;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: mockUser,
      savedPassPlans: [],
      savedShopStoreIds: [],
      receiptRecords: shopReceipts,
      savedCareProviderIds: [],
      visitPrepNotes: careVisitNotes,
      stayPlanInput: null,
      stayDocuments: initialStayDocuments,
      savedStayResourceIds: [],
      calendarEvents: [],
      customStampGoals: [],
      completedStampGoalIds: [],
      interestedPromotionIds: [],
      savedPromotionIds: [],
      bookedPromotionIds: [],
      savedPartnerOfferIds: [],
      requestedPartnerOfferIds: [],
      acknowledgedPartnerDisclosureIds: [],
      departureDate: undefined,
      companions: [],
      completedArrival72TaskIds: [],
      completedStayMissionIds: [],
      completedBetaMissionIds: [],
      betaFeedbackRecords: [],
      translationFeedbackRecords: [],
      userFeedbackRecords: [],
      completedPilotQaCheckIds: [],
      manualReminderItems: [],
      completedReminderIds: [],
      isBetaTester: false,
      hasHydrated: false,
      snackbar: null,

      setHasHydrated: (value) => set({ hasHydrated: value }),
      showSnackbar: (message, tone = "default") =>
        set({ snackbar: { id: Date.now(), message, tone } }),
      hideSnackbar: () => set({ snackbar: null }),

      setUser: (user) => set({ user }),
      setMode: (mode) => set((state) => ({ user: { ...state.user, mode } })),
      setLanguage: (language) => set((state) => ({ user: { ...state.user, language } })),
      setCity: (city) => set((state) => ({ user: { ...state.user, city } })),
      setDepartureDate: (value) => set({ departureDate: value }),
      setBetaTester: (value) => set({ isBetaTester: value }),

      completeOnboarding: () =>
        set((state) => ({
          user: { ...state.user, onboardingCompleted: true },
        })),

      toggleSavedPlace: (placeId) =>
        set((state) => {
          const saved = state.user.savedPlaceIds;
          const updated = saved.includes(placeId)
            ? saved.filter((id) => id !== placeId)
            : [...saved, placeId];
          return { user: { ...state.user, savedPlaceIds: updated } };
        }),

      toggleSavedPhrase: (phraseId) =>
        set((state) => {
          const saved = state.user.savedPhraseIds;
          const updated = saved.includes(phraseId)
            ? saved.filter((id) => id !== phraseId)
            : [...saved, phraseId];
          return { user: { ...state.user, savedPhraseIds: updated } };
        }),

      toggleChecklistItem: (itemId) =>
        set((state) => {
          const completed = state.user.completedChecklistIds;
          const updated = completed.includes(itemId)
            ? completed.filter((id) => id !== itemId)
            : [...completed, itemId];
          return { user: { ...state.user, completedChecklistIds: updated } };
        }),

      savePassPlan: (plan) =>
        set((state) => {
          const rest = state.savedPassPlans.filter((item) => item.id !== plan.id);
          return { savedPassPlans: [plan, ...rest].slice(0, 12) };
        }),

      removePassPlan: (planId) =>
        set((state) => ({
          savedPassPlans: state.savedPassPlans.filter((plan) => plan.id !== planId),
          calendarEvents: state.calendarEvents.filter((event) => event.id !== `calendar_${planId}`),
        })),

      toggleSavedShopStore: (storeId) =>
        set((state) => {
          const saved = state.savedShopStoreIds;
          const updated = saved.includes(storeId)
            ? saved.filter((id) => id !== storeId)
            : [storeId, ...saved].slice(0, 20);
          return { savedShopStoreIds: updated };
        }),

      toggleSavedCareProvider: (providerId) =>
        set((state) => {
          const saved = state.savedCareProviderIds;
          const updated = saved.includes(providerId)
            ? saved.filter((id) => id !== providerId)
            : [providerId, ...saved].slice(0, 20);
          return { savedCareProviderIds: updated };
        }),

      addReceiptRecord: (record) =>
        set((state) => ({ receiptRecords: [record, ...state.receiptRecords] })),

      updateReceiptStatus: (id, status) =>
        set((state) => ({
          receiptRecords: state.receiptRecords.map((record) =>
            record.id === id ? { ...record, refundStatus: status } : record
          ),
        })),

      updateReceiptRecord: (id, patch) =>
        set((state) => ({
          receiptRecords: state.receiptRecords.map((record) =>
            record.id === id ? { ...record, ...patch } : record
          ),
        })),

      removeReceiptRecord: (id) =>
        set((state) => ({
          receiptRecords: state.receiptRecords.filter((record) => record.id !== id),
        })),

      saveVisitPrepNote: (note) =>
        set((state) => ({ visitPrepNotes: [note, ...state.visitPrepNotes].slice(0, 10) })),

      removeVisitPrepNote: (id) =>
        set((state) => ({
          visitPrepNotes: state.visitPrepNotes.filter((note) => note.id !== id),
        })),

      saveStayPlanInput: (input) => set({ stayPlanInput: input }),

      addStayDocument: (document) =>
        set((state) => ({ stayDocuments: [document, ...state.stayDocuments] })),

      removeStayDocument: (id) =>
        set((state) => ({
          stayDocuments: state.stayDocuments.filter((document) => document.id !== id),
        })),

      toggleSavedStayResource: (resourceId) =>
        set((state) => {
          const saved = state.savedStayResourceIds;
          const updated = saved.includes(resourceId)
            ? saved.filter((id) => id !== resourceId)
            : [resourceId, ...saved].slice(0, 20);
          return { savedStayResourceIds: updated };
        }),

      addCalendarEvent: (event) =>
        set((state) => {
          const rest = state.calendarEvents.filter((item) => item.id !== event.id);
          return { calendarEvents: [event, ...rest].sort((a, b) => a.date.localeCompare(b.date)) };
        }),

      removeCalendarEvent: (id) =>
        set((state) => ({
          calendarEvents: state.calendarEvents.filter((event) => event.id !== id),
        })),

      addCustomStampGoal: (goal) =>
        set((state) => ({
          customStampGoals: [
            {
              ...goal,
              id: `stamp_custom_${Date.now()}`,
              source: "custom" as const,
              points: goal.points ?? 1,
            },
            ...state.customStampGoals,
          ].slice(0, 50),
        })),

      removeCustomStampGoal: (id) =>
        set((state) => ({
          customStampGoals: state.customStampGoals.filter((goal) => goal.id !== id),
          completedStampGoalIds: state.completedStampGoalIds.filter((goalId) => goalId !== id),
        })),

      toggleStampGoalCompleted: (id) =>
        set((state) => ({
          completedStampGoalIds: state.completedStampGoalIds.includes(id)
            ? state.completedStampGoalIds.filter((goalId) => goalId !== id)
            : [id, ...state.completedStampGoalIds],
        })),

      togglePromotionInterest: (id) =>
        set((state) => ({
          interestedPromotionIds: state.interestedPromotionIds.includes(id)
            ? state.interestedPromotionIds.filter((item) => item !== id)
            : [id, ...state.interestedPromotionIds],
        })),

      toggleSavedPromotion: (id) =>
        set((state) => ({
          savedPromotionIds: state.savedPromotionIds.includes(id)
            ? state.savedPromotionIds.filter((item) => item !== id)
            : [id, ...state.savedPromotionIds],
        })),

      toggleBookedPromotion: (id) =>
        set((state) => ({
          bookedPromotionIds: state.bookedPromotionIds.includes(id)
            ? state.bookedPromotionIds.filter((item) => item !== id)
            : [id, ...state.bookedPromotionIds],
        })),

      toggleSavedPartnerOffer: (id) =>
        set((state) => ({
          savedPartnerOfferIds: state.savedPartnerOfferIds.includes(id)
            ? state.savedPartnerOfferIds.filter((item) => item !== id)
            : [id, ...state.savedPartnerOfferIds],
        })),

      toggleRequestedPartnerOffer: (id) =>
        set((state) => ({
          requestedPartnerOfferIds: state.requestedPartnerOfferIds.includes(id)
            ? state.requestedPartnerOfferIds.filter((item) => item !== id)
            : [id, ...state.requestedPartnerOfferIds],
        })),

      acknowledgePartnerDisclosure: (id) =>
        set((state) => ({
          acknowledgedPartnerDisclosureIds: state.acknowledgedPartnerDisclosureIds.includes(id)
            ? state.acknowledgedPartnerDisclosureIds
            : [id, ...state.acknowledgedPartnerDisclosureIds],
        })),

      saveCompanion: (companion) =>
        set((state) => {
          const rest = state.companions.filter((item) => item.id !== companion.id);
          return { companions: [companion, ...rest].slice(0, 12) };
        }),

      removeCompanion: (id) =>
        set((state) => ({ companions: state.companions.filter((item) => item.id !== id) })),

      toggleArrival72Task: (id) =>
        set((state) => ({
          completedArrival72TaskIds: state.completedArrival72TaskIds.includes(id)
            ? state.completedArrival72TaskIds.filter((item) => item !== id)
            : [id, ...state.completedArrival72TaskIds],
        })),

      toggleStayMission: (id) =>
        set((state) => ({
          completedStayMissionIds: state.completedStayMissionIds.includes(id)
            ? state.completedStayMissionIds.filter((item) => item !== id)
            : [id, ...state.completedStayMissionIds],
        })),

      toggleBetaMissionCompleted: (id) =>
        set((state) => ({
          completedBetaMissionIds: state.completedBetaMissionIds.includes(id)
            ? state.completedBetaMissionIds.filter((item) => item !== id)
            : [id, ...state.completedBetaMissionIds],
        })),

      addBetaFeedbackRecord: (record) =>
        set((state) => ({ betaFeedbackRecords: [record, ...state.betaFeedbackRecords].slice(0, 80) })),

      removeBetaFeedbackRecord: (id) =>
        set((state) => ({ betaFeedbackRecords: state.betaFeedbackRecords.filter((record) => record.id !== id) })),

      addTranslationFeedbackRecord: (record) =>
        set((state) => ({ translationFeedbackRecords: [record, ...state.translationFeedbackRecords].slice(0, 120) })),

      removeTranslationFeedbackRecord: (id) =>
        set((state) => ({ translationFeedbackRecords: state.translationFeedbackRecords.filter((record) => record.id !== id) })),

      addUserFeedbackRecord: (record) =>
        set((state) => ({ userFeedbackRecords: [record, ...state.userFeedbackRecords].slice(0, 160) })),

      removeUserFeedbackRecord: (id) =>
        set((state) => ({ userFeedbackRecords: state.userFeedbackRecords.filter((record) => record.id !== id) })),

      togglePilotQaCheck: (id) =>
        set((state) => ({
          completedPilotQaCheckIds: state.completedPilotQaCheckIds.includes(id)
            ? state.completedPilotQaCheckIds.filter((item) => item !== id)
            : [id, ...state.completedPilotQaCheckIds],
        })),

      addManualReminder: (item) =>
        set((state) => ({ manualReminderItems: [item, ...state.manualReminderItems].slice(0, 50) })),

      removeManualReminder: (id) =>
        set((state) => ({
          manualReminderItems: state.manualReminderItems.filter((item) => item.id !== id),
          completedReminderIds: state.completedReminderIds.filter((itemId) => itemId !== id),
        })),

      toggleReminderDone: (id) =>
        set((state) => ({
          completedReminderIds: state.completedReminderIds.includes(id)
            ? state.completedReminderIds.filter((item) => item !== id)
            : [id, ...state.completedReminderIds],
        })),

      importBackupSnapshot: (snapshot) => {
        const patch = pickRestorableBackupPatch(snapshot);
        const appliedKeys = Object.keys(patch);

        if (appliedKeys.length > 0) {
          set(patch as Partial<AppState>);
        }

        return appliedKeys;
      },
    }),
    {
      name: "landly-app-store",
      partialize: (state): PersistedAppState => ({
        user: state.user,
        savedPassPlans: state.savedPassPlans,
        savedShopStoreIds: state.savedShopStoreIds,
        receiptRecords: state.receiptRecords,
        savedCareProviderIds: state.savedCareProviderIds,
        visitPrepNotes: state.visitPrepNotes,
        stayPlanInput: state.stayPlanInput,
        stayDocuments: state.stayDocuments,
        savedStayResourceIds: state.savedStayResourceIds,
        calendarEvents: state.calendarEvents,
        customStampGoals: state.customStampGoals,
        completedStampGoalIds: state.completedStampGoalIds,
        interestedPromotionIds: state.interestedPromotionIds,
        savedPromotionIds: state.savedPromotionIds,
        bookedPromotionIds: state.bookedPromotionIds,
        savedPartnerOfferIds: state.savedPartnerOfferIds,
        requestedPartnerOfferIds: state.requestedPartnerOfferIds,
        acknowledgedPartnerDisclosureIds: state.acknowledgedPartnerDisclosureIds,
        departureDate: state.departureDate,
        companions: state.companions,
        completedArrival72TaskIds: state.completedArrival72TaskIds,
        completedStayMissionIds: state.completedStayMissionIds,
        completedBetaMissionIds: state.completedBetaMissionIds,
        betaFeedbackRecords: state.betaFeedbackRecords,
        translationFeedbackRecords: state.translationFeedbackRecords,
        userFeedbackRecords: state.userFeedbackRecords,
        completedPilotQaCheckIds: state.completedPilotQaCheckIds,
        manualReminderItems: state.manualReminderItems,
        completedReminderIds: state.completedReminderIds,
        isBetaTester: state.isBetaTester,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
