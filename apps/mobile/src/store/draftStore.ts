import { create } from 'zustand';

export interface LeadDraft {
  id: string;
  companyName: string;
  companyWebsite?: string;
  contactName: string;
  contactRole?: string;
  contactEmail?: string;
  contactPhone?: string;
  businessUnitId: string;
  serviceInterest: string;
  needSummary: string;
  consentBasis: string;
  savedAt: string;
  isSynced: boolean;
}

interface DraftState {
  currentDraft: Partial<LeadDraft> | null;
  savedDrafts: LeadDraft[];
  setField: (field: keyof LeadDraft, value: any) => void;
  saveDraft: () => void;
  loadDraft: (id: string) => void;
  clearCurrentDraft: () => void;
  deleteDraft: (id: string) => void;
}

export const useDraftStore = create<DraftState>((set, get) => ({
  currentDraft: null,
  savedDrafts: [],
  setField: (field, value) => {
    const current = get().currentDraft || {};
    set({
      currentDraft: {
        ...current,
        [field]: value,
        savedAt: new Date().toISOString()
      }
    });
  },
  saveDraft: () => {
    const current = get().currentDraft;
    if (!current || !current.companyName) return;

    const draftId = current.id || `draft-${Date.now()}`;
    const newDraft: LeadDraft = {
      id: draftId,
      companyName: current.companyName || '',
      companyWebsite: current.companyWebsite || '',
      contactName: current.contactName || '',
      contactRole: current.contactRole || '',
      contactEmail: current.contactEmail || '',
      contactPhone: current.contactPhone || '',
      businessUnitId: current.businessUnitId || 'bu-lumora-growth',
      serviceInterest: current.serviceInterest || 'Business Growth Diagnostic',
      needSummary: current.needSummary || '',
      consentBasis: current.consentBasis || 'Direct discussion',
      savedAt: new Date().toISOString(),
      isSynced: false
    };

    const existingDrafts = get().savedDrafts.filter((d) => d.id !== draftId);
    set({
      savedDrafts: [newDraft, ...existingDrafts]
    });
  },
  loadDraft: (id) => {
    const draft = get().savedDrafts.find((d) => d.id === id);
    if (draft) {
      set({ currentDraft: { ...draft } });
    }
  },
  clearCurrentDraft: () => set({ currentDraft: null }),
  deleteDraft: (id) =>
    set((state) => ({
      savedDrafts: state.savedDrafts.filter((d) => d.id !== id)
    }))
}));
