
import { Shift, WorkCenter } from './types';

export const SHIFTS: Shift[] = ['A', 'B', 'C', 'D'];

export const TECHNICIANS_BY_SHIFT: Record<Shift, string[]> = {
  'A': ['Ilton', 'Hannyel', 'Misael', 'Arilson', 'Pedro', 'Diran', 'Alcino', 'Assuero'],
  'B': ['Luiz Gustavo', 'Rafael', 'Lucas', 'Jeferson', 'Eduardo', 'Luiz Neto', 'victor', 'geovane'],
  'C': ['Marcos', 'Wanderson', 'Wilian', 'Gustavo', 'Joao leno', 'Patrick', 'Jhon Dultra', 'Fabricio', 'Daniel Alves', 'Victor'],
  'D': ['Doclenio', 'Geraldo', 'Darlan', 'Cícero', 'fredson', 'Thiago', 'Rodrigo', 'Hitalo']
};

export const WORK_CENTERS: WorkCenter[] = [
  'SC108HH',
  'SC118HH',
  'SC103HH',
  'SC105HH',
  'SC117HH'
];

export const APP_THEME = {
  primary: 'blue-600',
  secondary: 'slate-600',
  accent: 'indigo-500',
  background: 'slate-50'
};
