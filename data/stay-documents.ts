import { StayDocument } from "@/types";

export const stayDocuments: StayDocument[] = [
  {
    id: "stay_doc_seed_001",
    title: "Passport copy and entry note",
    category: "passport",
    tags: ["passport", "identity", "entry"],
    note: "Save where your passport copy is stored and note your Korea entry date.",
  },
  {
    id: "stay_doc_seed_002",
    title: "Residence Card / ARC application set",
    category: "residence",
    tags: ["residence", "registration", "arc"],
    note: "Track appointment receipt, photo, application form, fee, and address proof.",
  },
  {
    id: "stay_doc_seed_003",
    title: "Housing contract and address proof",
    category: "contract",
    tags: ["housing", "contract", "address"],
    note: "Keep lease, deposit, landlord, and move-in notes together.",
  },
  {
    id: "stay_doc_seed_004",
    title: "Health insurance and clinic note",
    category: "insurance",
    tags: ["insurance", "nhis", "clinic"],
    note: "Track NHIS/private insurance status and your preferred clinic or pharmacy.",
  },
];
