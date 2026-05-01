// ─── User Profile ────────────────────────────────────────────────────────────

export type Language = "en" | "ko" | "zh" | "ja" | "es" | "fr";

export type VisitPurpose =
  | "tourism"
  | "business"
  | "study"
  | "work"
  | "residence";

export type StayDuration =
  | "under_1week"
  | "1_4weeks"
  | "1_3months"
  | "over_3months";

export type AppMode = "travel" | "life";

export type OnboardingNeed =
  | "airport_transport"
  | "shopping_refund"
  | "hospital_pharmacy"
  | "korean_phrases"
  | "long_stay_setup"
  | "emergency_help";

export interface UserProfile {
  id: string;
  name: string;
  language: Language;
  visitPurpose: VisitPurpose;
  stayDuration: StayDuration;
  city: string;
  mode: AppMode;
  firstNeed?: OnboardingNeed;
  savedPlaceIds: string[];
  savedPhraseIds: string[];
  completedChecklistIds: string[];
  onboardingCompleted: boolean;
}

// ─── Action Card ─────────────────────────────────────────────────────────────

export type ActionCardCategory =
  | "arrival"
  | "transport"
  | "food"
  | "accommodation"
  | "emergency"
  | "admin"
  | "lifestyle"
  | "health"
  | "pass";

export interface ActionCard {
  id: string;
  title: string;
  description: string;
  category: ActionCardCategory;
  icon: string;
  href: string;
  tags: string[];
  modes: AppMode[];
  priority: number;
}

// ─── Place ───────────────────────────────────────────────────────────────────

export type PlaceCategory =
  | "food"
  | "cafe"
  | "shopping"
  | "hospital"
  | "pharmacy"
  | "convenience"
  | "exchange"
  | "sightseeing"
  | "transport";

export type OpeningDay = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export interface OpeningHoursRule {
  days: OpeningDay[];
  opensAt: string;
  closesAt: string;
  label?: string;
}

export interface OpeningHoursMetadata {
  openingHours?: string;
  openingHoursRules?: OpeningHoursRule[];
  openingHoursNote?: string;
}

export type TrustBadgeTone = "sky" | "emerald" | "amber" | "violet" | "rose" | "gray";
export type TrustLevel = "official" | "partner" | "curated" | "demo" | "needs-check";

export interface TrustBadge {
  id: string;
  label: string;
  tone: TrustBadgeTone;
}

export interface TrustMetadata {
  trustLevel?: TrustLevel;
  sourceLabel?: string;
  sourceUrl?: string;
  lastCheckedAt?: string;
  needsConfirmation?: boolean;
}

export interface PlaceFilter {
  languages: Language[];
  foreignCardSupported: boolean;
  reservationSupported: boolean;
  lateNight: boolean;
  soloFriendly: boolean;
}

export interface Place extends TrustMetadata, OpeningHoursMetadata {
  id: string;
  name: string;
  category: PlaceCategory;
  address: string;
  city: string;
  description: string;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  supportedLanguages: Language[];
  foreignCardSupported: boolean;
  reservationSupported: boolean;
  lateNight: boolean;
  soloFriendly: boolean;
  tags: string[];
  googleMapsUrl?: string;
  naverMapsUrl?: string;
}

// ─── Phrase Card ─────────────────────────────────────────────────────────────

export type PhraseCategory =
  | "taxi"
  | "transport"
  | "food"
  | "allergy"
  | "accommodation"
  | "hospital"
  | "delivery"
  | "lost_complaint"
  | "shopping"
  | "emergency"
  | "settlement";

export interface PhraseCard {
  id: string;
  category: PhraseCategory;
  situation: string;
  korean: string;
  romanization: string;
  english: string;
  translations: Partial<Record<Language, string>>;
  tags: string[];
}

export type TranslationFeedbackReason = "wrong_translation" | "unnatural" | "missing_language" | "romanization" | "other";

export interface TranslationFeedbackRecord {
  id: string;
  phraseId: string;
  phraseCategory: PhraseCategory;
  language: Language;
  reason: TranslationFeedbackReason;
  note?: string;
  korean: string;
  romanization: string;
  english: string;
  localizedText: string;
  createdAt: string;
}

// ─── Life Checklist Item ─────────────────────────────────────────────────────

export type ChecklistCategory =
  | "registration"
  | "telecom"
  | "transport"
  | "banking"
  | "healthcare"
  | "housing"
  | "work_school"
  | "tax"
  | "support";

export type ChecklistDifficulty = "easy" | "medium" | "hard";

export interface LifeChecklistItem {
  id: string;
  category: ChecklistCategory;
  title: string;
  description: string;
  difficulty: ChecklistDifficulty;
  estimatedTime: string;
  requiredDocuments: string[];
  tips: string[];
  links: { label: string; url: string }[];
  order: number;
}

// ─── Landly Pass ─────────────────────────────────────────────────────────────

export type ArrivalTimeBand = "morning" | "afternoon" | "evening" | "late_night";
export type Arrival72Phase = "before_landing" | "arrival_day" | "first_night" | "day_2" | "day_3";
export type TransitIntensity = "light" | "moderate" | "heavy";
export type TransitType = "airport-rail" | "limousine-bus" | "taxi" | "mixed";
export type PassType = "climate-card" | "tmoney" | "korail-pass" | "single-ride";
export type QuickLauncherType = "taxi" | "rail" | "map" | "help" | "transit";

export interface ArrivalPlanInput {
  airport: string;
  arrivalDate: string;
  arrivalTimeBand: ArrivalTimeBand;
  destinationArea: string;
  groupSize: number;
  hasLuggage: boolean;
  lateNight: boolean;
  intercityPlan: boolean;
  cityCount: number;
  transitIntensity: TransitIntensity;
}

export interface TransitOption {
  id: string;
  type: TransitType;
  title: string;
  summary: string;
  costLevel: "low" | "medium" | "high";
  timeLevel: "fast" | "medium" | "slow";
  luggageFriendly: boolean;
  nightFriendly: boolean;
  reasons: string[];
  ctaLabel: string;
  ctaTarget: string;
}

export interface PassOption {
  id: string;
  type: PassType;
  title: string;
  summary: string;
  suitableFor: string[];
  reasons: string[];
  cautionNotes: string[];
  ctaLabel: string;
  ctaTarget: string;
}

export interface QuickLauncher {
  id: string;
  title: string;
  description: string;
  type: QuickLauncherType;
  href: string;
}

export interface PassPlan {
  id: string;
  name: string;
  summary: string;
  input: ArrivalPlanInput;
  transitOptions: TransitOption[];
  recommendedPass: PassOption | null;
  selectedTransitOptionId?: string;
  savedAt: string;
}

export interface Arrival72Task {
  id: string;
  phase: Arrival72Phase;
  title: string;
  description: string;
  href?: string;
  note?: string;
  idealFor?: ArrivalTimeBand[];
}

export type CompanionRelation = "self" | "partner" | "child" | "parent" | "friend" | "coworker" | "group";
export type MobilityNeed = "none" | "stroller" | "wheelchair" | "slow-walking";

export interface CompanionProfile {
  id: string;
  name: string;
  relation: CompanionRelation;
  language?: Language;
  mobilityNeed: MobilityNeed;
  hasHeavyLuggage: boolean;
  needsLateNightSupport: boolean;
  needsMedicalSupport: boolean;
  note?: string;
}

// ─── Landly Shop ─────────────────────────────────────────────────────────────

export type ShopStoreCategory =
  | "beauty"
  | "pharmacy"
  | "convenience"
  | "department-store"
  | "souvenir"
  | "duty-free";

export type ShopRefundType = "immediate" | "general" | "both" | "unknown";

export interface ShopStore extends TrustMetadata, OpeningHoursMetadata {
  id: string;
  name: string;
  category: ShopStoreCategory;
  district: string;
  refundType: ShopRefundType;
  supportedLanguages: Language[];
  foreignCardSupported: boolean;
  couponAvailable: boolean;
  passportNeededAtCheckout: boolean;
  tags: string[];
  description: string;
  mapLink: string;
  officialLink?: string;
}

export type ReceiptRefundStatus = "pending" | "done" | "needs-check" | "not-eligible";
export type RefundConfidence = "high" | "medium" | "low";

export interface ReceiptRecord {
  id: string;
  storeId?: string;
  storeName?: string;
  imageUrl?: string;
  purchaseDate: string;
  amount: number;
  itemCategory?: RefundEligibilityInput["itemCategory"];
  refundType: Exclude<ShopRefundType, "both">;
  refundStatus: ReceiptRefundStatus;
  refundConfidence?: RefundConfidence;
  estimatedRefundAmount?: number;
  passportReady?: boolean;
  note?: string;
  createdAt?: string;
}

export interface RefundEligibilityInput {
  stayLengthCategory: "under-6-months" | "over-6-months";
  purchaseAmount: number;
  itemOpened: boolean;
  departureWithin3Months: boolean;
  residentStatus: "tourist" | "temporary-stay" | "resident";
  itemCategory: "beauty" | "fashion" | "grocery" | "souvenir" | "other";
}

export interface RefundEligibilityResult {
  status: "eligible" | "not-eligible" | "check-in-store";
  confidence: RefundConfidence;
  estimatedRefundAmount: number;
  reasons: string[];
  checklist: string[];
  nextActions: Array<"find-stores" | "save-receipt" | "view-guide">;
}

export type RefundOperatorChannel = "mobile" | "web" | "airport-counter" | "kiosk" | "downtown-counter";
export type RefundAirportCounterType = "service-desk" | "kiosk";

export interface RefundAirportCounter {
  airport: "Incheon" | "Gimpo" | "Busan" | "Jeju";
  terminal: string;
  floor: string;
  area: string;
  location: string;
  operatingHours: string;
  contact?: string;
  counterType: RefundAirportCounterType;
}

export interface RefundOperator extends TrustMetadata {
  id: string;
  name: string;
  summary: string;
  bestFor: string;
  webUrl: string;
  appUrl?: string;
  minAmount: number;
  maxAmountPerReceipt?: number;
  supportedLanguages: Language[];
  channels: RefundOperatorChannel[];
  airportCounters: RefundAirportCounter[];
  checklist: string[];
}

export interface ShopPromotion {
  id: string;
  title: string;
  category: "beauty" | "shopping-festival" | "duty-free" | "coupon";
  sourceType: "official" | "partner";
  startDate?: string;
  endDate?: string;
  ctaLink: string;
  tags: string[];
}

export interface ShoppingRoute {
  id: string;
  title: string;
  summary: string;
  districts: string[];
  tags: string[];
  stopStoreIds: string[];
  durationLabel?: string;
  bestFor?: string;
  refundTip?: string;
}


// ─── Landly Care ─────────────────────────────────────────────────────────────

export type CareProviderCategory =
  | "pharmacy"
  | "clinic"
  | "hospital"
  | "dermatology"
  | "dentist"
  | "health-checkup"
  | "wellness"
  | "mental-health-support";

export interface CareProvider extends TrustMetadata, OpeningHoursMetadata {
  id: string;
  name: string;
  category: CareProviderCategory;
  district: string;
  supportedLanguages: Language[];
  internationalCare: boolean;
  kahfFriendly: boolean;
  reservationSupported: boolean;
  nightHours: boolean;
  touristFriendly: boolean;
  residentSupportFriendly: boolean;
  description: string;
  specialties: string[];
  mapLink: string;
  officialLink?: string;
  phone?: string;
}

export interface CareTriageInput {
  symptomCategory:
    | "fever-cold"
    | "stomach"
    | "skin"
    | "dental"
    | "injury"
    | "mental-health"
    | "checkup"
    | "other";
  severityLevel: "mild" | "moderate" | "severe";
  isBreathingIssue: boolean;
  isHeavyBleeding: boolean;
  hasChestPain: boolean;
  isNightTime: boolean;
  userType: "traveler" | "resident";
}

export interface CareTriageResult {
  level: "emergency" | "hotline" | "pharmacy" | "clinic" | "specialist";
  title: string;
  summary: string;
  reasons: string[];
  safetyNote?: string;
  nextActions: Array<
    "call-119"
    | "call-1339"
    | "open-1330"
    | "find-pharmacy"
    | "find-clinic"
    | "find-specialist"
    | "open-sos"
    | "open-care-phrases"
    | "prepare-visit-note"
  >;
}

export interface CareVisitPrepNote {
  id: string;
  providerId?: string;
  symptoms: string;
  symptomStart?: string;
  painLevel?: string;
  allergies?: string;
  medications?: string;
  pregnancyStatus?: string;
  preferredLanguage?: string;
  interpreterNeeded?: boolean;
  questions?: string;
  insuranceNote?: string;
  createdAt: string;
}

export interface CareSupportResource extends TrustMetadata {
  id: string;
  title: string;
  description: string;
  type: "phone" | "web" | "info";
  href: string;
  tag: string;
}

// ─── Landly Stay ─────────────────────────────────────────────────────────────

export type StayType = "student" | "worker" | "working-holiday" | "long-stay";

export interface StayPlanInput {
  stayType: StayType;
  entryDate: string;
  hasEmployer: boolean;
  hasSchool: boolean;
  housingStatus: "secured" | "temporary" | "searching";
  region: string;
  withFamily: boolean;
}

export interface StayResource extends TrustMetadata {
  id: string;
  type: "immigration" | "nhis" | "student" | "housing" | "tax" | "labor" | "support-center";
  title: string;
  provider: string;
  contactLabel?: string;
  contactValue?: string;
  link?: string;
  description: string;
}

export interface StayDocument {
  id: string;
  title: string;
  category: "passport" | "residence" | "contract" | "insurance" | "school" | "work" | "tax" | "other";
  fileName?: string;
  issueDate?: string;
  expiryDate?: string;
  tags: string[];
  note?: string;
}

export interface StayPlanSummary {
  stayType: StayType;
  immediateTaskIds: string[];
  thisMonthTaskIds: string[];
  resourceIds: readonly string[];
  reminders: string[];
}

// ─── Landly Calendar & Stamp ───────────────────────────────────────────────

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  category: "arrival" | "route" | "task" | "care" | "stay" | "promo";
  location?: string;
  note?: string;
  sourceHref?: string;
  googleMapsUrl?: string;
  naverMapUrl?: string;
  transportType?: TransitType;
}

export type StampCategory = "food" | "location" | "culture" | "transport" | "life" | "shopping" | "care";

export interface StampGoal {
  id: string;
  title: string;
  description: string;
  category: StampCategory;
  source: "official" | "custom";
  points: number;
  city?: string;
  href?: string;
  nudge?: string;
}

export type PromotionCategory = "festival" | "tour" | "class" | "campaign" | "community";
export type PromotionAudience = "first_timer" | "shopper" | "student" | "resident" | "wellness";

export interface PromotionEvent {
  id: string;
  title: string;
  description: string;
  category: PromotionCategory;
  sourceType: "external" | "internal";
  status: "live" | "upcoming";
  city: string;
  startDate: string;
  endDate?: string;
  location?: string;
  bookingLink?: string;
  tags: string[];
  audience: PromotionAudience[];
  benefit: string;
  checklist: string[];
}

export type PartnerOfferCategory = "shopping" | "care" | "stay" | "experience" | "transport";
export type PartnerOfferStage = "coupon" | "booking" | "inquiry" | "setup";
export type PartnerRevenueModel = "affiliate" | "referral" | "commission" | "sponsored" | "pilot";
export type PartnerDisclosureSeverity = "low" | "medium" | "high";

export interface PartnerCommercialDisclosure {
  severity: PartnerDisclosureSeverity;
  userImpact: string;
  rankingNote?: string;
  priceNote?: string;
}

export interface PartnerOffer extends TrustMetadata {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: PartnerOfferCategory;
  stage: PartnerOfferStage;
  revenueModel: PartnerRevenueModel;
  commercialDisclosure?: PartnerCommercialDisclosure;
  partnerName: string;
  city: string;
  audience: PromotionAudience[];
  recommendedModes: AppMode[];
  benefit: string;
  estimatedValueLabel: string;
  ctaLabel: string;
  href: string;
  checklist: string[];
  tags: string[];
  priority: number;
  validUntil?: string;
}



// ─── Landly Beta Testing ─────────────────────────────────────────────────────

export type BetaMissionId = "arrival" | "shop" | "care" | "sos" | "stay" | "assistant";
export type BetaFeedbackMood = "worked" | "confusing" | "missing" | "idea";

export interface BetaFeedbackRecord {
  id: string;
  missionId: BetaMissionId | "general";
  mood: BetaFeedbackMood;
  rating: 1 | 2 | 3 | 4 | 5;
  note: string;
  createdAt: string;
}

export type UserFeedbackCategory = "useful" | "confusing" | "missing" | "bug" | "idea";

export interface UserFeedbackRecord {
  id: string;
  context: string;
  category: UserFeedbackCategory;
  rating: 1 | 2 | 3 | 4 | 5;
  note: string;
  path?: string;
  language: Language;
  mode: AppMode;
  submittedToApi?: boolean;
  createdAt: string;
}

export type PilotQaCheckCategory = "setup" | "offline" | "journey" | "trust" | "commercial" | "handoff";

export interface PilotQaCheck {
  id: string;
  category: PilotQaCheckCategory;
  title: string;
  description: string;
  required: boolean;
  href?: string;
}

// ─── Landly Navigation & Map Handoff ─────────────────────────────────────────

export type NavigationHandoffCategory = "arrival" | "place" | "shopping" | "care" | "stay" | "emergency";

export interface NavigationHandoff {
  id: string;
  title: string;
  description: string;
  category: NavigationHandoffCategory;
  originLabel: string;
  destinationLabel: string;
  transportType: TransitType;
  priority: number;
  recommendedModes: AppMode[];
  checklist: string[];
  phraseHint: string;
  href: string;
}

// ─── Landly Offline Safety Kit ───────────────────────────────────────────────

export type OfflineKitCategory = "emergency" | "language" | "route" | "refund" | "care" | "stay";

export interface OfflineKitItem {
  id: string;
  title: string;
  description: string;
  category: OfflineKitCategory;
  href: string;
  priority: number;
  recommendedModes: AppMode[];
  offlineValue: string;
  checklist: string[];
  phraseIds?: string[];
  phoneNumber?: string;
}

// ─── Landly Stay Missions & Reminders ─────────────────────────────────────────

export type StayMissionPhase = "days_1_7" | "days_8_30" | "days_31_90";

export interface StayMission {
  id: string;
  phase: StayMissionPhase;
  title: string;
  description: string;
  category: ChecklistCategory;
  difficulty: ChecklistDifficulty;
  recommendedStayTypes?: StayType[];
  href?: string;
  note?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  dueDate?: string;
  source: "manual" | "document" | "arrival-plan" | "calendar" | "stay-checkpoint" | "shop-refund" | "departure";
  description?: string;
  href?: string;
}

export type ReminderStatus = "upcoming" | "due-soon" | "overdue" | "done";
