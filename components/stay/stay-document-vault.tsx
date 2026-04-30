"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { StayDocument } from "@/types";
import { getDocumentReadinessLabel, getDocumentReadinessTone } from "@/lib/stay-utils";
import { cn } from "@/lib/utils";
import { useLocalizedText } from "@/lib/text-localizer";

const categories: StayDocument["category"][] = ["passport", "residence", "contract", "insurance", "school", "work", "tax", "other"];

export function StayDocumentVault() {
  const { stayDocuments, addStayDocument, removeStayDocument } = useAppStore();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<StayDocument["category"]>("other");
  const [note, setNote] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const { lt } = useLocalizedText();

  const grouped = useMemo(() => categories.map((value) => ({ category: value, items: stayDocuments.filter((doc) => doc.category === value) })), [stayDocuments]);

  const handleAdd = () => {
    if (!title.trim()) return;
    addStayDocument({ id: `stay_doc_${Date.now()}`, title: title.trim(), category, tags: [category], note: note.trim() || undefined, issueDate: issueDate || undefined, expiryDate: expiryDate || undefined });
    setTitle(""); setCategory("other"); setNote(""); setIssueDate(""); setExpiryDate("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">{lt("Add a document note")}</p>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt("Save the file name, purpose, and any important date even if the document itself lives in email, cloud storage, or paper.")}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={lt("e.g. ARC appointment receipt")} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm" />
          <select value={category} onChange={(event) => setCategory(event.target.value as StayDocument["category"])} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm">
            {categories.map((item) => <option key={item} value={item}>{lt(item)}</option>)}
          </select>
          <input type="date" value={issueDate} onChange={(event) => setIssueDate(event.target.value)} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm" />
          <input type="date" value={expiryDate} onChange={(event) => setExpiryDate(event.target.value)} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm" />
        </div>
        <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder={lt("What is this for? When will you need it?")} className="mt-3 min-h-24 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm" />
        <button onClick={handleAdd} className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white">{lt("Save document note")}</button>
      </div>

      {grouped.map(({ category, items }) => (
        <section key={category} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold capitalize text-gray-900">{lt(category)}</p>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">{items.length}</span>
          </div>
          <div className="mt-3 space-y-2">
            {items.length === 0 ? (
              <p className="text-sm text-gray-500">{lt("No document notes yet.")}</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="rounded-xl bg-gray-50 px-3 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">{lt(item.title)}</p>
                        <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", getDocumentReadinessTone(item))}>{lt(getDocumentReadinessLabel(item))}</span>
                      </div>
                      {item.note ? <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(item.note)}</p> : null}
                      {item.tags.length > 0 ? <div className="mt-2 flex flex-wrap gap-1.5">{item.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-gray-500">#{lt(tag)}</span>)}</div> : null}
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-500">
                        {item.issueDate ? <span className="rounded-full bg-white px-2.5 py-1">{lt("Issued")} {item.issueDate}</span> : null}
                        {item.expiryDate ? <span className="rounded-full bg-white px-2.5 py-1">{lt("Expires")} {item.expiryDate}</span> : null}
                      </div>
                    </div>
                    <button onClick={() => removeStayDocument(item.id)} className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-500">{lt("Remove")}</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
