import type { RefundAirportCounter, RefundOperator } from "@/types";

export const incheonRefundCounters: RefundAirportCounter[] = [
  {
    airport: "Incheon",
    terminal: "Terminal 1",
    floor: "3F",
    area: "Duty Free Zone",
    location: "Near Gate 28",
    operatingHours: "07:00–22:00 service desk / 24h kiosk",
    contact: "+82-32-743-1009",
    counterType: "service-desk",
  },
  {
    airport: "Incheon",
    terminal: "Terminal 1",
    floor: "3F",
    area: "Duty Free Zone",
    location: "Near Gate 28, next to the central pharmacy / Concourse kiosk area",
    operatingHours: "24 hours",
    contact: "+82-32-743-1009",
    counterType: "kiosk",
  },
  {
    airport: "Incheon",
    terminal: "Terminal 2",
    floor: "3F",
    area: "Duty Free Zone",
    location: "Near Gate 253, across from Gate 250",
    operatingHours: "07:00–21:30 service desk / 24h kiosk",
    contact: "+82-32-743-0647",
    counterType: "service-desk",
  },
  {
    airport: "Incheon",
    terminal: "Terminal 2",
    floor: "3F",
    area: "Duty Free Zone",
    location: "Near Gates 250 and 253",
    operatingHours: "24 hours",
    contact: "+82-32-743-0647",
    counterType: "kiosk",
  },
];

const sharedChecklist = [
  "Keep the tax refund receipt and purchase receipt together.",
  "Carry your passport and boarding pass when you process the refund.",
  "Keep eligible goods unopened and unused until customs or kiosk clearance is complete.",
  "Arrive early because kiosk checks or customs inspection can add time before departure.",
];

export const refundOperators: RefundOperator[] = [
  {
    id: "refund_global_blue",
    name: "Global Blue",
    summary: "Large global tax-free operator with mobile and web refund tracking options.",
    bestFor: "Travelers who want international card refund tracking after departure.",
    webUrl: "https://www.globalblue.com/en/shoppers/how-to-shop-tax-free/destinations/south-korea",
    minAmount: 15000,
    maxAmountPerReceipt: 6000000,
    supportedLanguages: ["en", "ko", "zh", "ja", "es", "fr"],
    channels: ["mobile", "web", "airport-counter", "kiosk", "downtown-counter"],
    airportCounters: incheonRefundCounters,
    checklist: sharedChecklist,
    trustLevel: "curated",
    sourceLabel: "Global Blue Korea tax-free guide",
    sourceUrl: "https://www.globalblue.com/en/shoppers/how-to-shop-tax-free/destinations/south-korea",
    lastCheckedAt: "2026-04-30",
    needsConfirmation: true,
  },
  {
    id: "refund_global_tax_free",
    name: "Global Tax Free",
    summary: "Korea-focused refund operator commonly shown on tax-free store signs and receipts.",
    bestFor: "Receipts that show a Global Tax Free logo or QR code.",
    webUrl: "https://web.gtfetrs.com",
    minAmount: 15000,
    maxAmountPerReceipt: 6000000,
    supportedLanguages: ["en", "ko", "zh"],
    channels: ["web", "airport-counter", "kiosk", "downtown-counter"],
    airportCounters: incheonRefundCounters,
    checklist: sharedChecklist,
    trustLevel: "curated",
    sourceLabel: "VISITKOREA refund operator list",
    sourceUrl: "https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=140736",
    lastCheckedAt: "2026-04-30",
    needsConfirmation: true,
  },
  {
    id: "refund_easy_tax",
    name: "Easy Tax Refund",
    summary: "Tax refund operator with multilingual support and store receipt handoff.",
    bestFor: "Receipts that show Easy Tax Refund or Easy Tax Free branding.",
    webUrl: "https://www.easytaxrefund.co.kr",
    minAmount: 15000,
    maxAmountPerReceipt: 6000000,
    supportedLanguages: ["en", "ko", "zh", "ja"],
    channels: ["web", "airport-counter", "kiosk", "downtown-counter"],
    airportCounters: incheonRefundCounters,
    checklist: sharedChecklist,
    trustLevel: "curated",
    sourceLabel: "VISITKOREA refund operator list",
    sourceUrl: "https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=140736",
    lastCheckedAt: "2026-04-30",
    needsConfirmation: true,
  },
  {
    id: "refund_cube",
    name: "CubeRefund",
    summary: "Refund operator listed by VISITKOREA for supported tax refund receipts.",
    bestFor: "Receipts that show CubeRefund branding.",
    webUrl: "https://www.cuberefund.com",
    minAmount: 15000,
    maxAmountPerReceipt: 6000000,
    supportedLanguages: ["en", "ko", "zh", "ja"],
    channels: ["web", "airport-counter", "kiosk"],
    airportCounters: incheonRefundCounters,
    checklist: sharedChecklist,
    trustLevel: "curated",
    sourceLabel: "VISITKOREA refund operator list",
    sourceUrl: "https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=140736",
    lastCheckedAt: "2026-04-30",
    needsConfirmation: true,
  },
];

export function getRefundOperatorsForAmount(amount: number) {
  return refundOperators.filter((operator) => {
    const aboveMin = amount >= operator.minAmount;
    const belowMax = operator.maxAmountPerReceipt ? amount <= operator.maxAmountPerReceipt : true;
    return aboveMin && belowMax;
  });
}
