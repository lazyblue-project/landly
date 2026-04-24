import { RefundEligibilityInput, RefundEligibilityResult } from "@/types";

export function getRefundEligibility(
  input: RefundEligibilityInput
): RefundEligibilityResult {
  const reasons: string[] = [];
  const nextActions: RefundEligibilityResult["nextActions"] = ["find-stores"];

  if (input.purchaseAmount < 15000) {
    reasons.push("Purchases under ₩15,000 are usually not eligible for tax refund.");
    return { status: "not-eligible", reasons, nextActions: ["find-stores"] };
  }

  if (input.itemOpened) {
    reasons.push("Used or opened products are generally not refundable for tax refund purposes.");
    return { status: "not-eligible", reasons, nextActions: ["save-receipt", "view-guide"] };
  }

  if (!input.departureWithin3Months) {
    reasons.push("The product normally needs to leave Korea within 3 months of purchase.");
    return { status: "not-eligible", reasons, nextActions: ["view-guide"] };
  }

  if (input.stayLengthCategory === "over-6-months" || input.residentStatus === "resident") {
    reasons.push("Long-term residents are often outside the standard tourist tax refund scope.");
    return { status: "check-in-store", reasons, nextActions: ["find-stores", "view-guide"] };
  }

  if (input.itemCategory === "grocery") {
    reasons.push("Some grocery or immediately consumed items can be restricted by store policy.");
    return { status: "check-in-store", reasons, nextActions: ["find-stores", "save-receipt"] };
  }

  reasons.push("This purchase looks broadly aligned with common tourist tax refund conditions.");
  nextActions.push("save-receipt", "view-guide");

  return { status: "eligible", reasons, nextActions };
}
