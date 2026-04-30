# Landly — Developer Context for AI-Assisted Development (v30)

> This document provides full context for continuing development of the Landly project in any AI coding assistant (ChatGPT, Claude, etc.). Read this before writing any code.
> Current version: **v39** (2026-04-29)

---

## 1. Project Overview

**Landly** is a mobile-first PWA (Progressive Web App) that helps foreigners navigate life in Korea — both short-term tourists and long-term residents.

- **Target audience**: Non-Korean speakers visiting or living in Korea
- **UI language**: English (default) + Korean; full multi-language support (en, ko, zh, ja, es, fr)
- **Design**: Mobile-only layout (`max-w-md mx-auto`), no desktop breakpoints
- **Data layer**: 100% mock/static data — no backend API, no database
- **Deployment**: Vercel (configured via `vercel.json`)
- **Dev port**: 3001 (`npm run dev` → `next dev --port 3001`)

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 + `tw-animate-css` |
| Components | shadcn/ui (`@base-ui/react`) + custom components |
| State | Zustand 5 with `persist` middleware |
| Icons | `lucide-react` |
| Class utils | `clsx` + `tailwind-merge` (via `cn()`) |
| PWA | `manifest.ts` + `appleWebApp` metadata |

**Key utility imports:**
```ts
import { cn } from "@/lib/utils";
import { useLocalizedText } from "@/lib/text-localizer"; // { lt } hook
import { useUiCopy } from "@/lib/ui-copy";               // { t } hook (JSON-based i18n)
import { useAppStore } from "@/store/app-store";
```

---

## 3. Directory Structure

```
landly/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                # Home (situation-first dashboard)
│   ├── onboarding/page.tsx     # 5-step first-run wizard
│   ├── pass/page.tsx           # Transit pass + arrival assistant
│   ├── explore/page.tsx        # Place discovery
│   ├── shop/
│   │   ├── page.tsx            # Shopping hub + refund wallet
│   │   ├── receipts/page.tsx
│   │   ├── checker/page.tsx
│   │   └── guide/page.tsx
│   ├── care/page.tsx           # Medical triage + safety command center
│   ├── stay/page.tsx           # Long-stay settlement planner
│   ├── life/page.tsx           # Life checklist
│   ├── calendar/page.tsx
│   ├── stamps/page.tsx
│   ├── promotions/page.tsx
│   ├── sos/page.tsx            # Emergency scenarios + number hub
│   ├── assistant/page.tsx      # Phrase tool + language readiness
│   ├── my/page.tsx             # Profile + saved items + personalization
│   ├── more/page.tsx
│   ├── test/page.tsx           # Beta tester missions
│   ├── partners/page.tsx       # Partner offers (v25)
│   ├── trust/page.tsx          # Trust & freshness center (v26)
│   ├── offline/page.tsx        # Offline kit (v29)
│   ├── navigate/page.tsx       # Map handoff center (v30)
│   ├── manifest.ts
│   ├── globals.css
│   └── favicon.ico
│
├── components/
│   ├── layout/
│   │   ├── app-shell.tsx
│   │   ├── bottom-nav.tsx
│   │   ├── top-bar.tsx
│   │   ├── floating-action-hub.tsx
│   │   ├── snackbar-host.tsx
│   │   ├── pwa-cache-provider.tsx       # v32
│   │   └── html-lang-sync.tsx
│   ├── common/
│   │   ├── action-card.tsx, bottom-sheet.tsx, checklist-item.tsx
│   │   ├── empty-state.tsx, feedback-prompt.tsx, filter-chip.tsx
│   │   ├── page-skeleton.tsx, phrase-card.tsx, place-card.tsx
│   │   ├── section-header.tsx, snackbar.tsx, source-disclosure.tsx
│   │   ├── swipe-action-row.tsx, trust-badge-row.tsx, trust-layer-panel.tsx
│   ├── onboarding/
│   │   └── onboarding-launch-preview.tsx  # v38
│   ├── ui/                     # badge, button, card, tabs, separator
│   ├── home/
│   │   ├── home-hero.tsx, home-service-hub.tsx, recommended-actions.tsx
│   │   ├── retention-loop-strip.tsx, situation-action-dashboard.tsx
│   │   ├── smart-action-brief.tsx        # v27
│   │   ├── home-now-panel.tsx          # v34
│   │   ├── home-ready-panel.tsx        # v34
│   │   ├── home-explore-panel.tsx      # v34
│   │   ├── home-pilot-panel.tsx        # v38
│   │   ├── offline-safety-strip.tsx      # v29
│   │   ├── today-dashboard.tsx
│   │   └── (care/pass/shop/sos/stay quick-start components)
│   ├── pass/
│   │   ├── arrival-assistant-dashboard.tsx  # v21
│   │   └── (arrival-72h, companion-planner, pass-hero, etc.)
│   ├── shop/
│   │   ├── refund-wallet-dashboard.tsx   # v22
│   │   └── (receipt-locker, receipt-card, shop-discovery, etc.)
│   ├── care/
│   │   ├── care-safety-command-center.tsx  # v23
│   │   ├── care-visit-brief-card.tsx       # v23
│   │   └── (triage, providers, visit-prep, etc.)
│   ├── stay/
│   │   ├── stay-settlement-command-center.tsx  # v24
│   │   ├── stay-checklist-priority-lanes.tsx   # v24
│   │   └── (90-day missions, document vault, plan builder, etc.)
│   ├── life/
│   ├── calendar/
│   ├── stamps/
│   │   └── stamp-retention-loop.tsx
│   ├── promotions/
│   │   └── promotion-persona-lanes.tsx
│   ├── sos/
│   │   ├── emergency-number-hub.tsx    # v23
│   │   ├── emergency-script-panel.tsx  # v23
│   │   └── (sos-hero, sos-scenario-list)
│   ├── assistant/
│   │   ├── language-readiness-panel.tsx  # v28
│   │   ├── phrase-grid.tsx
│   │   └── situation-quick-actions.tsx
│   ├── profile/
│   │   ├── my-retention-snapshot.tsx
│   │   ├── personalization-insights-panel.tsx  # v27
│   │   ├── profile-summary.tsx, reminder-center.tsx, saved-items-hub.tsx
│   │   └── (saved-phrases/places/stay-resources sections)
│   ├── partners/
│   │   ├── partner-offer-card.tsx
│   │   ├── partner-offer-command-center.tsx
│   │   └── partner-monetization-disclosure.tsx
│   │   ├── partner-commercial-disclosure-card.tsx  # v37
│   │   ├── partner-commercial-policy-panel.tsx      # v37
│   ├── trust/
│   │   ├── info-trust-command-center.tsx
│   │   └── trust-checklist-board.tsx
│   ├── offline/
│   │   ├── offline-kit-command-center.tsx
│   │   ├── offline-pwa-status-card.tsx  # v32
│   │   └── offline-prep-checklist.tsx
│   ├── navigation/
│   │   └── navigation-handoff-center.tsx  # v30
│   └── test/
│       ├── beta-feedback-kit.tsx
│       └── beta-mission-card.tsx
│
├── store/
│   └── app-store.ts
│
├── data/
│   ├── action-cards.ts           → actionCards
│   ├── onboarding-launch-actions.ts → first-run handoff map  # v38
│   ├── arrival-72-flow.ts        → arrival72Tasks
│   ├── assistant-situations.ts   → assistantSituations
│   ├── care-providers.ts         → careProviders
│   ├── care-support.ts           → careSupportResources
│   ├── care-visit-notes.ts       → careVisitNotes
│   ├── emergency-support-routes.ts → emergencySupportRoutes
│   ├── info-trust-actions.ts     → infoTrustActions
│   ├── official-sources.ts       → officialSources
│   ├── language-readiness.ts     → languageKits, essentialPhraseIds
│   ├── life-checklist.ts         → lifeChecklist    ⚠️ NOT lifeChecklistItems
│   ├── mock-user.ts              → mockUser
│   ├── more-menu.ts              → moreMenuSections
│   ├── navigation-handoff.ts     → navigationHandoffs
│   ├── offline-safety-kit.ts     → offlineKitItems, offlinePrepSteps
│   ├── partner-offers.ts         → partnerOffers
│   ├── pass-data.ts              → (transit/pass exports)
│   ├── personal-action-rules.ts  → personalActionRules
│   ├── phrases.ts                → phrases
│   ├── places.ts                 → places
│   ├── promo-events.ts           → promotionEvents
│   ├── shop-promotions.ts        → shopPromotions
│   ├── shop-receipts.ts          → shopReceipts
│   ├── shop-routes.ts            → shoppingRoutes
│   ├── shop-stores.ts            → shopStores
│   ├── sos-scenarios.ts          → sosScenarios
│   ├── stamp-catalog.ts          → officialStampGoals  ⚠️ NOT stampCatalog
│   ├── stay-90-missions.ts       → stay90Missions
│   ├── stay-documents.ts         → stayDocuments
│   └── stay-resources.ts         → stayResources
│
├── data/
│   ├── pilot-qa-checks.ts       → pilotQaChecks  # v39
│   └── (other mock data files)
├── hooks/
│   ├── use-care-providers.ts, use-care-triage.ts
│   ├── use-filtered-places.ts, use-recommended-actions.ts
│   ├── use-refund-eligibility.ts, use-reminder-engine.ts
│   ├── use-shop-reminder.ts, use-shop-stores.ts
│   ├── use-smart-action-engine.ts   # v27
│   ├── use-pwa-status.ts             # v32
│   └── use-stay-plan.ts
│
├── lib/
│   ├── utils.ts            # cn() helper
│   ├── text-localizer.ts   # lt() hook — inline koTextMap
│   ├── ui-copy.ts          # t() hook — JSON-based i18n
│   ├── haptics.ts, pass-utils.ts, shop-utils.ts, stay-utils.ts, trust-badges.ts, partner-disclosure.ts, trust-freshness.ts
│
├── types/index.ts
├── i18n/config.ts
├── i18n/messages/en.json
├── i18n/messages/ko.json
├── docs/FEEDBACK_TEMPLATE.md, TESTER_GUIDE.md, TEST_DEPLOYMENT_GUIDE.md
├── public/
├── .env.example
├── next.config.ts, tsconfig.json, vercel.json, package.json
```

---

## 4. State Management (Zustand)

**Store key**: `"landly-app-store"` (localStorage via `persist`)

### State Shape

```ts
user: UserProfile
savedPassPlans: PassPlan[]
savedShopStoreIds: string[]
receiptRecords: ReceiptRecord[]
savedCareProviderIds: string[]
visitPrepNotes: CareVisitPrepNote[]
stayPlanInput: StayPlanInput | null
stayDocuments: StayDocument[]
savedStayResourceIds: string[]
calendarEvents: CalendarEvent[]
customStampGoals: StampGoal[]
completedStampGoalIds: string[]
interestedPromotionIds: string[]
savedPromotionIds: string[]
bookedPromotionIds: string[]
savedPartnerOfferIds: string[]       // v25
requestedPartnerOfferIds: string[]   // v25
departureDate?: string
companions: CompanionProfile[]
completedArrival72TaskIds: string[]
completedStayMissionIds: string[]
completedBetaMissionIds: BetaMissionId[]
betaFeedbackRecords: BetaFeedbackRecord[]
manualReminderItems: ReminderItem[]
completedReminderIds: string[]
hasHydrated: boolean
snackbar: SnackbarState | null
```

### Key Actions

```ts
setUser(user), setMode(mode), setLanguage(lang), setCity(city)
setDepartureDate(value?), completeOnboarding()
showSnackbar(message, tone?)
toggleSavedPlace(id), toggleSavedPhrase(id), toggleSavedShopStore(id)
toggleSavedCareProvider(id), toggleSavedStayResource(id)
toggleSavedPartnerOffer(id), toggleRequestedPartnerOffer(id)
addReceiptRecord(record), updateReceiptRecord(id, patch)  // v22
addCalendarEvent(event), addStayDocument(doc)
```

### Pattern

```tsx
const { user, hasHydrated } = useAppStore();
if (!hasHydrated) return <PageSkeleton />;
```

---

## 5. User Profile & App Modes

```ts
interface UserProfile {
  language: Language;         // "en" | "ko" | "zh" | "ja" | "es" | "fr"
  visitPurpose: VisitPurpose; // "tourism" | "business" | "study" | "work" | "residence"
  stayDuration: StayDuration; // "under_1week" | "1_4weeks" | "1_3months" | "over_3months"
  city: string;
  mode: AppMode;              // "travel" | "life"
  firstNeed?: OnboardingNeed;
  savedPlaceIds: string[]; savedPhraseIds: string[]
  completedChecklistIds: string[]; onboardingCompleted: boolean
}
```

**Mode inference**: `study | work | residence` or `over_3months` → `"life"`, else `"travel"`

---

## 6. Localization System

### `lt()` — text-localizer.ts (primary for components)

```tsx
import { useLocalizedText } from "@/lib/text-localizer";
const { lt } = useLocalizedText();
lt("Save")                                       // → "저장" in Korean
lt("Hello, {name}!", { name: user.name })
lt("Includes {count} ready phrases", { count: String(n) })
```

### `t()` — ui-copy.ts (JSON-based, dot-notation)

```tsx
import { useUiCopy } from "@/lib/ui-copy";
const { t } = useUiCopy();
t("nav.home")
t("onboarding.step_language")
t("some.key", undefined, "Fallback")
```

### Adding new strings: add to `en.json`, `ko.json`, AND `koTextMap` in `text-localizer.ts`

---

## 7. Standard Page Pattern

```tsx
"use client";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

export default function ExamplePage() {
  const { hasHydrated } = useAppStore();
  const { lt } = useLocalizedText();
  if (!hasHydrated) return <PageSkeleton />;
  return (
    <AppShell>
      <TopBar title={lt("Page Title")} showBack />
      {/* content */}
    </AppShell>
  );
}
```

---

## 8. Key Types (types/index.ts)

```ts
// Stamps (v19)
type StampCategory = "food"|"location"|"culture"|"transport"|"life"|"shopping"|"care"
interface StampGoal { ...; href?: string; nudge?: string; }

// Promotions (v19)
type PromotionAudience = "first_timer"|"shopper"|"student"|"resident"|"wellness"
interface PromotionEvent { ...; audience: PromotionAudience[]; benefit: string; checklist: string[]; }

// Partners (v25)
type PartnerOfferCategory = "shopping"|"care"|"stay"|"experience"|"transport"
interface PartnerOffer extends TrustMetadata { ... }

// Offline (v29)
type OfflineKitCategory = "emergency"|"language"|"route"|"refund"|"care"|"stay"
interface OfflineKitItem { id: string; title: string; description: string; category: OfflineKitCategory; ... }

// Navigation (v30)
type NavigationHandoffCategory = "arrival"|"place"|"shopping"|"care"|"stay"|"emergency"
interface NavigationHandoff { id: string; title: string; category: NavigationHandoffCategory; ... }

// Reminders (v27 extended)
interface ReminderItem {
  source: "manual"|"document"|"arrival-plan"|"calendar"|"stay-checkpoint"|"shop-refund"|"departure";
}
```

---

## 9. Routes

| Route | Description |
|---|---|
| `/` | Home |
| `/onboarding` | 5-step wizard |
| `/pass` | Transit pass + arrival assistant |
| `/explore` | Place discovery |
| `/shop` | Shopping + refund wallet |
| `/shop/receipts` | Receipt tracker |
| `/shop/checker` | Refund eligibility |
| `/shop/guide` | Shopping guide |
| `/care` | Medical triage + safety center |
| `/stay` | Long-stay settlement |
| `/life` | Life checklist |
| `/calendar` | Calendar |
| `/stamps` | Stamp goals |
| `/promotions` | Promotions + persona lanes |
| `/sos` | Emergency |
| `/assistant` | Phrases + language readiness |
| `/my` | Profile + saved items + insights |
| `/more` | Nav hub |
| `/test` | Beta missions |
| `/partners` | Partner offers |
| `/trust` | Trust center |
| `/offline` | Offline kit |
| `/navigate` | Map handoff |

**Bottom nav**: Home / Pass / Explore / Assistant / More

---

## 10. Known Recurring Fix — Apply After Every Patch

`promotion-persona-lanes.tsx` ships broken every patch. Apply immediately after copying files:

```tsx
// WRONG (always shipped this way):
events.filter((event) => event.audience.includes(lane.id))

// CORRECT:
events.filter((event) => event.audience.includes(lane.id as PromotionAudience))
```

Run after every patch: `npx tsc --noEmit`

---

## 11. Coding Rules

1. No `any`, no `console.log`
2. `"use client"` on all feature pages
3. Always hydration-guard: `if (!hasHydrated) return <PageSkeleton />`
4. `lt()` for all UI strings — no hardcoded English without `lt()`
5. Tailwind only — no CSS modules, no inline styles
6. `cn()` for conditional classes
7. Named exports for components, default exports for pages
8. No new dependencies without justification
9. Mock data only — all new data goes in `data/`

---

## 12. Dev Commands

```bash
npm run dev          # http://localhost:3001
npm run build
npx tsc --noEmit     # Run after every patch
```

---

## 13. Version History

| Patch | Theme |
|---|---|
| v11 | Korean localization, OnboardingNeed |
| v12 | Trust layer (TrustBadge, TrustMetadata) |
| v13 | Care module (triage, providers, visit prep) |
| v14 | Stay module (90-day missions, document vault) |
| v15 | Calendar + Stamps + Promotions |
| v16 | Shop (receipt locker, refund checker, routes) |
| v17 | My page: RetentionSnapshot + SavedItemsHub |
| v18 | Beta testing: missions dashboard, FeedbackPrompt |
| v19 | Retention loop: StampRetentionLoop, PromotionPersonaLanes |
| v20 | Situation-first Home: SituationActionDashboard |
| v21 | Pass: ArrivalAssistantDashboard |
| v22 | Shop: RefundWalletDashboard, updateReceiptRecord |
| v23 | Care/SOS: SafetyCommandCenter, EmergencyNumberHub |
| v24 | Stay/Life: StaySettlementCommandCenter, PriorityLanes |
| v25 | Partner monetization: PartnerOffer, /partners |
| v26 | Trust & Freshness Center: /trust |
| v27 | Smart Action Engine, PersonalizationInsightsPanel |
| v28 | Language Readiness: kits, panel, new phrases |
| v29 | Offline Kit: /offline, OfflineKitCommandCenter |
| v30 | Map Handoff: /navigate, NavigationHandoffCenter |
| v31 | Stability: accessibility, hydration, date parsing, Stay route cleanup |
| v32 | Offline PWA Core: service worker, cached core pages, offline status UI |
| v33 | i18n clarity: full UI vs phrase-support languages, fallback badges, language notices |
| v34 | Home UX: Now / Ready / Explore dashboard simplification |
| v35 | Trust and official-source hardening: freshness utility, official source cards, SOS/refund source disclosure |
| v36 | Beta feedback UX: mission completion tracking, local feedback notebook, pilot readiness dashboard |
| v37 | Partner disclosure: commercial policy panel, per-offer disclosure acknowledgment, safer lead-interest gating |
| v38 | Onboarding handoff: launch preview, Home pilot loop, beta/partner deep-linking |
| v39 | Beta QA handoff: pre-share QA checklist, local report export, JSON/CSV downloads |
