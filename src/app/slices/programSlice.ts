// ============= store/programSlice.ts =============
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Program {
  id: string;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProgramState {
  selectedProgram: Program | null;
  allPrograms: Program[];
}

const initialState: ProgramState = {
  selectedProgram: null,
  allPrograms: [
    { id: '20045', name: 'AUTO OWNERS INSURANCE COMPANY, CAT' },
    { id: 'P007238090PG', name: 'MACIF, PROPERTY CAT XL 20090101 AIUK' },
    { id: '18433', name: 'NODAK MUTUAL INSURANCE COMPANY, PROPERTY' },
    { id: '21826', name: 'P0A05CR110PG, Auto & General, Cat XL' },
    { id: '11575', name: 'P0A05CR110PG, Auto & General, Cat XL' },
    { id: 'P007256090PG', name: 'EUREKO RE, PROP CAT XL PROGRAMME 2' },
    { id: '107311', name: 'EXAMPLE INSURANCE CO, LIABILITY' },
    { id: 'ARW12345', name: 'GLOBAL RE, MOTOR CAT XL' },
  ],
};

const programSlice = createSlice({
  name: 'program',
  initialState,
  reducers: {
    setSelectedProgram: (state, action: PayloadAction<Program>) => {
      state.selectedProgram = action.payload;
    },
    clearSelectedProgram: (state) => {
      state.selectedProgram = null;
    },
  },
});

export const { setSelectedProgram, clearSelectedProgram } =
  programSlice.actions;
export default programSlice.reducer;
