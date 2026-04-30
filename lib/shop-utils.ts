import type { ReceiptRecord, RefundEligibilityInput, RefundEligibilityResult } from "@/types";

export function estimateRefundAmount(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.max(0, Math.round(amount * 0.07));
}

export function getReceiptConfidence(receipt: ReceiptRecord): "high" | "medium" | "low" {
  if (receipt.refundStatus === "not-eligible") return "low";
  if (receipt.refundStatus === "needs-check") return "medium";
  if (receipt.refundConfidence) return receipt.refundConfidence;
  if (receipt.refundType === "immediate") return "high";
  return "medium";
}

export function getReceiptEstimatedRefund(receipt: ReceiptRecord): number {
  if (receipt.refundStatus === "not-eligible") return 0;
  return receipt.estimatedRefundAmount ?? estimateRefundAmount(receipt.amount);
}

export function getReceiptReadiness(receipts: ReceiptRecord[]) {
  const activeReceipts = receipts.filter((receipt) => receipt.refundStatus !== "not-eligible");
  const pendingReceipts = activeReceipts.filter((receipt) => receipt.refundStatus === "pending" || receipt.refundStatus === "needs-check");
  const doneReceipts = activeReceipts.filter((receipt) => receipt.refundStatus === "done");
  const estimatedRefundTotal = pendingReceipts.reduce((total, receipt) => total + getReceiptEstimatedRefund(receipt), 0);
  const needPassportCount = pendingReceipts.filter((receipt) => !receipt.passportReady).length;
  const readinessPercent = activeReceipts.length === 0 ? 0 : Math.round((doneReceipts.length / activeReceipts.length) * 100);

  return {
    activeCount: activeReceipts.length,
    pendingCount: pendingReceipts.length,
    doneCount: doneReceipts.length,
    needPassportCount,
    estimatedRefundTotal,
    readinessPercent,
  };
}

export function getRefundConfidence(input: RefundEligibilityInput, result: RefundEligibilityResult): "high" | "medium" | "low" {
  if (result.status === "not-eligible") return "low";
  if (result.status === "check-in-store") return "medium";
  if (input.purchaseAmount >= 15000 && !input.itemOpened && input.departureWithin3Months) return "high";
  return "medium";
}
