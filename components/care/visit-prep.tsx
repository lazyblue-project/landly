"use client";

import { useMemo, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

const checklistItems = [
  "Bring passport or ID",
  "Prepare payment or insurance details",
  "List your current medicines",
  "List allergies or reactions",
  "Note when symptoms started",
  "Write down questions for the doctor",
  "Check if interpretation help is needed",
];

export function VisitPrep() {
  const { visitPrepNotes, saveVisitPrepNote, removeVisitPrepNote } = useAppStore();
  const latest = visitPrepNotes[0];
  const [symptoms, setSymptoms] = useState(latest?.symptoms ?? "");
  const [allergies, setAllergies] = useState(latest?.allergies ?? "");
  const [medications, setMedications] = useState(latest?.medications ?? "");
  const [questions, setQuestions] = useState(latest?.questions ?? "");
  const [insuranceNote, setInsuranceNote] = useState(latest?.insuranceNote ?? "");
  const { lt } = useLocalizedText();

  const summary = useMemo(() => {
    return [
      symptoms ? `${lt("Symptoms")}: ${symptoms}` : null,
      allergies ? `${lt("Allergies")}: ${allergies}` : null,
      medications ? `${lt("Current medicines")}: ${medications}` : null,
      questions ? `${lt("Questions")}: ${questions}` : null,
      insuranceNote ? `${lt("Insurance / payment note")}: ${insuranceNote}` : null,
    ].filter(Boolean).join('\n');
  }, [symptoms, allergies, medications, questions, insuranceNote, lt]);

  const handleSave = () => {
    saveVisitPrepNote({
      id: `visit_note_${Date.now()}`,
      symptoms,
      allergies,
      medications,
      questions,
      insuranceNote,
      createdAt: new Date().toISOString(),
    });
  };

  const fields: Array<[string, string, (v: string) => void]> = [
    ["Symptoms", symptoms, setSymptoms],
    ["Allergies", allergies, setAllergies],
    ["Current medicines", medications, setMedications],
    ["Questions", questions, setQuestions],
    ["Insurance / payment note", insuranceNote, setInsuranceNote],
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-rose-50 p-2 text-rose-600">
            <ClipboardCheck size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{lt("Visit prep")}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt("Keep the most important information in one place before you go.")}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {fields.map(([label, value, setter]) => (
            <label key={label} className="block">
              <span className="mb-1 block text-xs font-medium text-gray-500">{lt(label)}</span>
              <textarea
                value={value}
                onChange={(e) => setter(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800"
              />
            </label>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={handleSave} className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-medium text-white">
            {lt("Save prep note")}
          </button>
          <button type="button" onClick={() => navigator.clipboard.writeText(summary)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700">
            {lt("Copy summary")}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">{lt("Quick checklist")}</p>
        <div className="mt-3 space-y-2 text-sm text-gray-700">
          {checklistItems.map((item) => (
            <div key={item} className="rounded-xl bg-gray-50 px-3 py-2.5">• {lt(item)}</div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{lt("Saved prep notes")}</p>
            <p className="mt-1 text-xs text-gray-500">{lt("Re-open the note you last prepared before a visit.")}</p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {visitPrepNotes.length === 0 ? (
            <p className="text-sm text-gray-500">{lt("No saved notes yet.")}</p>
          ) : (
            visitPrepNotes.slice(0, 3).map((note) => (
              <div key={note.id} className="rounded-xl bg-gray-50 px-3 py-3">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">{note.symptoms || lt("Visit prep")}</p>
                <p className="mt-1 text-xs text-gray-500">{lt("Saved")} {new Date(note.createdAt).toLocaleDateString()}</p>
                <button type="button" onClick={() => removeVisitPrepNote(note.id)} className="mt-2 text-xs font-medium text-rose-600">
                  {lt("Remove")}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
