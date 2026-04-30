# Landly v33 — i18n Clarity & Language Support Patch

## Goal
Make Landly's language support honest and easier to understand. English and Korean are treated as full UI languages. Chinese, Japanese, Spanish, and French remain phrase-support languages with English UI fallback and visible translation-coverage cues.

## Changes

- Added `lib/i18n-support.ts` as the single source of truth for language labels, UI fallback, and support level.
- Updated `lib/ui-copy.ts` and `lib/text-localizer.ts` to use the shared UI-locale resolver.
- Added `components/common/language-support-notice.tsx` for onboarding, Assistant, and My/Profile.
- Updated onboarding language cards to show `Full UI` vs `Phrase support`.
- Updated Profile language selector to show combined native/English labels and the support notice.
- Updated Assistant to display the current support mode and phrase translation fallback state.
- Added `English fallback` badge on phrase cards when the selected language has no specific phrase translation.
- Expanded Explore language filters to all phrase-supported languages (`en`, `ko`, `zh`, `ja`, `es`, `fr`).
- Updated companion planner language labels to use consistent native/English display names.
- Updated `HtmlLangSync` so the document `lang` reflects the actual UI locale (`en` or `ko`) while storing the selected phrase language in `data-landly-language`.
- Added language support copy to `i18n/messages/en.json`, `i18n/messages/ko.json`, and Korean `koTextMap`.

## Manual Checks

1. Open `/onboarding` and select each language. Confirm the support badge changes correctly.
2. Select `Español` or `Français`, then open `/assistant`. Confirm menus remain English and phrase cards show translations when available.
3. In `/assistant`, find phrase cards without selected-language translation and confirm the `English fallback` badge appears.
4. Open `/my`, change language, and confirm the support notice updates.
5. Open `/explore` and confirm language filters include EN, KO, ZH, JA, ES, FR.
