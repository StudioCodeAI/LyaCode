export type LyaThemeId = 'lya-deep-dark' | 'lya-glass-dev' | 'lya-classic-terminal';

export interface LyaThemeOption {
  id: LyaThemeId;
  name: string;
  description: string;
}

export const LYA_THEMES: LyaThemeOption[] = [
  {
    id: 'lya-deep-dark',
    name: 'Lya Deep Dark',
    description: 'Padrão elegante, moderno e técnico.',
  },
  {
    id: 'lya-glass-dev',
    name: 'Lya Glass Dev',
    description: 'Premium glass, blur e profundidade visual.',
  },
  {
    id: 'lya-classic-terminal',
    name: 'Lya Classic Terminal',
    description: 'Preto, simples, direto e raiz.',
  },
];

const STORAGE_KEY = 'lyacode.theme';
const DEFAULT_THEME: LyaThemeId = 'lya-deep-dark';

export function getStoredTheme(): LyaThemeId {
  const stored = localStorage.getItem(STORAGE_KEY) as LyaThemeId | null;
  return LYA_THEMES.some((theme) => theme.id === stored) ? stored! : DEFAULT_THEME;
}

export function applyTheme(themeId: LyaThemeId) {
  document.documentElement.setAttribute('data-theme', themeId);
  localStorage.setItem(STORAGE_KEY, themeId);
}

export function initializeTheme(): LyaThemeId {
  const theme = getStoredTheme();
  applyTheme(theme);
  return theme;
}
