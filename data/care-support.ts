import { CareSupportResource } from "@/types";

export const careSupportResources: CareSupportResource[] = [
  {
    id: "support_119",
    title: "Emergency 119",
    description: "Emergency ambulance / rescue for urgent situations.",
    type: "phone",
    href: "tel:119",
    tag: "Emergency",
  },
  {
    id: "support_1339",
    title: "Medical hotline 1339",
    description: "Medical and infectious disease guidance line.",
    type: "phone",
    href: "tel:1339",
    tag: "Hotline",
  },
  {
    id: "support_1330",
    title: "Tourist helpline 1330",
    description: "Travel interpretation and multilingual support.",
    type: "phone",
    href: "tel:1330",
    tag: "Travel help",
  },
  {
    id: "support_medical_korea",
    title: "Medical Korea Support Center",
    description: "Official support for foreign patients and interpretation guidance.",
    type: "web",
    href: "https://www.medicalkorea.or.kr/en/",
    tag: "Official",
  },
  {
    id: "support_seoul_medical",
    title: "Seoul Medical Tourism Center",
    description: "Interpretation and medical tourism support in Seoul.",
    type: "web",
    href: "https://medical.visitseoul.net/",
    tag: "Seoul",
  },
  {
    id: "support_global_seoul",
    title: "Seoul Global Center",
    description: "Foreign resident support including everyday life guidance.",
    type: "web",
    href: "https://global.seoul.go.kr/",
    tag: "Resident help",
  },
];
