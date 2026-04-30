import type { RefundEligibilityInput, RefundEligibilityResult } from "@/types";
import { estimateRefundAmount } from "@/lib/shop-utils";

function buildResult(
  status: RefundEligibilityResult["status"],
  purchaseAmount: number,
  reasons: string[],
  checklist: string[],
  nextActions: RefundEligibilityResult["nextActions"]
): RefundEligibilityResult {
  const confidence = status === "eligible" ? "high" : status === "check-in-store" ? "medium" : "low";
  const estimatedRefundAmount = status === "not-eligible" ? 0 : estimateRefundAmount(purchaseAmount);

  return {
    status,
    confidence,
    estimatedRefundAmount,
    reasons,
    checklist,
    nextActions,
  };
}

export function getRefundEligibility(
  input: RefundEligibilityInput
): RefundEligibilityResult {
  if (input.purchaseAmount < 15000) {
    return buildResult(
      "not-eligible",
      input.purchaseAmount,
      ["Purchases under ₩15,000 are usually not eligible for tax refund."],
      ["Ask the store before checkout if you are near the minimum amount."],
      ["find-stores"]
    );
  }

  if (input.itemOpened) {
    return buildResult(
      "not-eligible",
      input.purchaseAmount,
      ["Used or opened products are generally not refundable for tax refund purposes."],
      ["Keep eligible goods unopened until you complete the departure refund process."],
      ["save-receipt", "view-guide"]
    );
  }

  if (!input.departureWithin3Months) {
    return buildResult(
      "not-eligible",
      input.purchaseAmount,
      ["The product normally needs to leave Korea within 3 months of purchase."],
      ["Review the departure checklist before buying more refund-targeted items."],
      ["view-guide"]
    );
  }

  if (input.stayLengthCategory === "over-6-months" || input.residentStatus === "resident") {
    return buildResult(
      "check-in-store",
      input.purchaseAmount,
      ["Long-term residents are often outside the standard tourist tax refund scope."],
      ["Show your passport or residence status at the store and ask before paying.", "Save the receipt if staff says airport confirmation is needed."],
      ["find-stores", "view-guide"]
    );
  }

  if (input.itemCategory === "grocery") {
    return buildResult(
      "check-in-store",
      input.purchaseAmount,
      ["Some grocery or immediately consumed items can be restricted by store policy."],
      ["Ask whether the item must stay unopened.", "Save the receipt and keep the product packaging if refund is pending."],
      ["find-stores", "save-receipt"]
    );
  }

  return buildResult(
    "eligible",
    input.purchaseAmount,
    ["This purchase looks broadly aligned with common tourist tax refund conditions."],
    ["Keep your passport ready.", "Save the receipt in Landly.", "Check whether refund is immediate or handled later at departure."],
    ["find-stores", "save-receipt", "view-guide"]
  );
}
