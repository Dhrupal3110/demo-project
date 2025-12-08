export interface Program {
  id: string;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  subscribeReference?: string;
  arrowId?: string;
  cedantName?: string;
}

export interface ProgramState {
  selectedProgram: Program | null;
  allPrograms: Program[];
}

