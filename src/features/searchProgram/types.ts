export interface Program {
  id: string;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProgramState {
  selectedProgram: Program | null;
  allPrograms: Program[];
}

