import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { STORAGE_KEYS } from "../data/seed";
import { Member } from "../models";

interface MembersContextType {
  members: Member[];
  isLoading: boolean;
  addMember: (member: Omit<Member, "id">) => Member;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
}

const MembersContext = createContext<MembersContextType | null>(null);

export function useMembersCtx() {
  const context = useContext(MembersContext);
  if (!context) throw new Error("useMembersCtx must be used within MembersProvider");
  return context;
}

export function MembersProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    setMembers(stored ? JSON.parse(stored) : []);
    setIsLoading(false);
  }, []);

  const addMember = useCallback((member: Omit<Member, "id">) => {
    const newMember: Member = {
      ...member,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
    };
    setMembers((prev) => {
      const updated = [...prev, newMember];
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updated));
      return updated;
    });
    return newMember;
  }, []);

  const updateMember = useCallback((id: string, updates: Partial<Member>) => {
    setMembers((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, ...updates } : m));
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteMember = useCallback((id: string) => {
    setMembers((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <MembersContext.Provider value={{ members, isLoading, addMember, updateMember, deleteMember }}>
      {children}
    </MembersContext.Provider>
  );
}