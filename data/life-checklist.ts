import { LifeChecklistItem } from "@/types";

export const lifeChecklist: LifeChecklistItem[] = [
  // Registration
  {
    id: "checklist_001",
    category: "registration",
    title: "Alien Registration Card (ARC)",
    description: "Required for foreigners staying over 90 days. Must apply within 90 days of arrival.",
    difficulty: "medium",
    estimatedTime: "2–3 hours + 2 weeks processing",
    requiredDocuments: [
      "Passport",
      "Visa",
      "Completed application form",
      "Passport photo (3.5×4.5cm)",
      "Proof of address",
    ],
    tips: [
      "Book an appointment online in advance at HiKorea.",
      "Bring original documents, not copies.",
      "Fees: KRW 30,000 for first issuance.",
    ],
    links: [
      { label: "HiKorea Appointment", url: "https://www.hikorea.go.kr" },
    ],
    order: 1,
  },
  // Telecom
  {
    id: "checklist_002",
    category: "telecom",
    title: "Korean SIM / Phone Plan",
    description: "Set up a local number for banking, apps, and everyday use.",
    difficulty: "easy",
    estimatedTime: "30–60 minutes",
    requiredDocuments: ["Passport", "ARC (for long-term plans)"],
    tips: [
      "Short-term visitors can get a tourist SIM at the airport.",
      "Long-term residents should compare SKT, KT, and LG U+.",
      "MVNO plans (e.g., HelloMobile) are cheaper for data-only needs.",
    ],
    links: [
      { label: "HelloMobile", url: "https://www.hellomobile.co.kr" },
    ],
    order: 2,
  },
  // Transport
  {
    id: "checklist_003",
    category: "transport",
    title: "T-money / Cashbee Card",
    description: "Rechargeable transit card for subway, bus, and some taxis.",
    difficulty: "easy",
    estimatedTime: "10 minutes",
    requiredDocuments: [],
    tips: [
      "Available at all convenience stores and subway stations.",
      "Costs KRW 2,500–4,000 to purchase.",
      "Can be used across Seoul, Busan, and other major cities.",
    ],
    links: [],
    order: 3,
  },
  // Banking
  {
    id: "checklist_004",
    category: "banking",
    title: "Open a Korean Bank Account",
    description: "Needed for salary deposits, bill payments, and Korean apps.",
    difficulty: "hard",
    estimatedTime: "1–2 hours",
    requiredDocuments: [
      "Passport",
      "ARC",
      "Employment contract or enrollment certificate (varies by bank)",
    ],
    tips: [
      "Kakao Bank is the most foreigner-friendly — English app available.",
      "KEB Hana Bank has an English branch in Itaewon.",
      "Some banks require a Korean guarantor for certain account types.",
    ],
    links: [
      { label: "KakaoBank", url: "https://www.kakaobank.com" },
    ],
    order: 4,
  },
  // Healthcare
  {
    id: "checklist_005",
    category: "healthcare",
    title: "Enroll in National Health Insurance (NHIS)",
    description: "Foreigners staying over 6 months must enroll. Covers most medical costs.",
    difficulty: "medium",
    estimatedTime: "1 hour",
    requiredDocuments: ["ARC", "Passport", "Bank account details"],
    tips: [
      "Enrollment is automatic for company employees.",
      "Self-employed or students must apply manually at NHIS office.",
      "Monthly premiums vary based on income.",
    ],
    links: [
      { label: "NHIS Foreign Language Support", url: "https://www.nhis.or.kr" },
    ],
    order: 5,
  },
  // Housing
  {
    id: "checklist_006",
    category: "housing",
    title: "Register Your Address (Resident Registration)",
    description: "Required for banking, insurance, and official communications.",
    difficulty: "easy",
    estimatedTime: "30 minutes",
    requiredDocuments: ["ARC", "Lease contract"],
    tips: [
      "Done at your local Gu (district) office.",
      "Must be completed within 14 days of moving in.",
    ],
    links: [],
    order: 6,
  },
  // Work / School
  {
    id: "checklist_007",
    category: "work_school",
    title: "Register for Korean Language Classes",
    description: "TOPIK preparation and general Korean language courses.",
    difficulty: "easy",
    estimatedTime: "1 hour (registration)",
    requiredDocuments: ["ARC or Passport"],
    tips: [
      "King Sejong Institute offers free Korean classes worldwide.",
      "Seoul Global Center offers free in-person classes.",
      "Online: KIIP (Korea Immigration and Integration Program) is required for some visa types.",
    ],
    links: [
      { label: "Seoul Global Center", url: "https://global.seoul.go.kr" },
      { label: "King Sejong Institute", url: "https://www.sejonghakdang.org" },
    ],
    order: 7,
  },
  // Tax
  {
    id: "checklist_009",
    category: "tax",
    title: "Learn your basic tax timeline",
    description: "Understand when year-end tax adjustment or local tax reminders may matter for your stay.",
    difficulty: "medium",
    estimatedTime: "25 min",
    requiredDocuments: ["Employment or student status", "Income note if available"],
    tips: [
      "Use official guides first and ask for help when unsure.",
      "Keep employment or school documents easy to find.",
    ],
    links: [
      { label: "Seoul global portal", url: "https://global.seoul.go.kr/web/main.do?lang=en" },
    ],
    order: 9,
  },
  // Support
  {
    id: "checklist_010",
    category: "support",
    title: "Save your support contacts",
    description: "Bookmark immigration, insurance, and local foreign resident support channels before you need them.",
    difficulty: "easy",
    estimatedTime: "10 min",
    requiredDocuments: ["None"],
    tips: [
      "Store at least one immigration and one local support contact.",
      "Check whether your district has a dedicated foreign resident center.",
    ],
    links: [
      { label: "Hi Korea", url: "https://www.hikorea.go.kr/Main.pt?locale=en" },
      { label: "Seoul global portal", url: "https://global.seoul.go.kr/web/main.do?lang=en" },
    ],
    order: 10,
  },
];
