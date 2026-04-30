"use client";

import { FileCheck2, Plus } from "lucide-react";
import { StayPlanInput } from "@/types";
import { getRecommendedDocumentTemplates } from "@/lib/stay-utils";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

interface StayDocumentStarterProps {
  input: StayPlanInput;
}

export function StayDocumentStarter({ input }: StayDocumentStarterProps) {
  const { stayDocuments, addStayDocument, showSnackbar } = useAppStore();
  const { lt } = useLocalizedText();
  const templates = getRecommendedDocumentTemplates(input.stayType);

  const addTemplate = (templateId: string) => {
    const template = templates.find((item) => item.id === templateId);
    if (!template) return;

    addStayDocument({
      id: `${template.id}_${Date.now()}`,
      title: template.title,
      category: template.category,
      tags: template.tags,
      note: template.note,
    });
    showSnackbar(lt("Document note added"), "success");
  };

  const addAll = () => {
    const existingTitles = new Set(stayDocuments.map((document) => document.title));
    const missing = templates.filter((template) => !existingTitles.has(template.title));
    missing.forEach((template, index) => {
      addStayDocument({
        id: `${template.id}_${Date.now()}_${index}`,
        title: template.title,
        category: template.category,
        tags: template.tags,
        note: template.note,
      });
    });

    if (missing.length > 0) {
      showSnackbar(lt("Starter documents added"), "success");
    } else {
      showSnackbar(lt("All starter documents are already in your vault"), "default");
    }
  };

  return (
    <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{lt("Document starter pack")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            {lt("Start with the documents most long-stay users need to track. Landly saves notes only, not sensitive files.")}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-2 text-emerald-700 shadow-sm">
          <FileCheck2 size={18} />
        </div>
      </div>

      <button
        type="button"
        onClick={addAll}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
      >
        <Plus size={16} />
        {lt("Add recommended documents")}
      </button>

      <div className="mt-4 space-y-2">
        {templates.map((template) => {
          const isAdded = stayDocuments.some((document) => document.title === template.title);

          return (
            <div key={template.id} className="rounded-2xl bg-white p-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{lt(template.title)}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(template.note)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => addTemplate(template.id)}
                  disabled={isAdded}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 disabled:border-emerald-100 disabled:bg-emerald-50 disabled:text-emerald-700"
                >
                  {isAdded ? lt("Added") : lt("Add")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
