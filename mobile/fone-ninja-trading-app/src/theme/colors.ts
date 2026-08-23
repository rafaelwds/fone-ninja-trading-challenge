export type ColorTokens = {
  // Conteúdo
  text: string;
  textSecondary: string;
  link: string;

  // Superfícies
  background: string;
  backgroundElement: string;
  backgroundSelected: string;
  border: string;

  // Marca
  primary: string;
  primaryPressed: string;
  primarySoft: string;
  onPrimary: string;

  // Estados
  success: string;
  danger: string;

  // Bitcoin
  bitcoin: string;
  bitcoinSoft: string;

  // Outros
  splash: string;
  onTint: string;
  shadow: string;
};

export const lightColors: ColorTokens = {
  // Conteúdo
  text: '#14201C',
  textSecondary: '#68746F',
  link: '#0C7458',

  // Superfícies
  background: '#F3F7F4',
  backgroundElement: '#FFFFFF',
  backgroundSelected: '#DEF1E9',
  border: '#DCE5DF',

  // Marca
  primary: '#0C7458',
  primaryPressed: '#075B45',
  primarySoft: '#DEF1E9',
  onPrimary: '#FFFFFF',

  // Estados
  success: '#087A57',
  danger: '#C54848',

  // Bitcoin
  bitcoin: '#F2A338',
  bitcoinSoft: '#FFF1DC',

  // Outros
  splash: '#0C7458',
  onTint: '#FFFFFF',
  shadow: '#204034',
};

export const darkColors: ColorTokens = {
  // Conteúdo
  text: '#F2F7F4',
  textSecondary: '#A8B6B0',
  link: '#40C99B',

  // Superfícies
  background: '#0C1512',
  backgroundElement: '#14211D',
  backgroundSelected: '#1A382E',
  border: '#2B4038',

  // Marca
  primary: '#2FAF86',
  primaryPressed: '#248D6D',
  primarySoft: '#153B30',
  onPrimary: '#FFFFFF',

  // Estados
  success: '#40C99B',
  danger: '#FF7777',

  // Bitcoin
  bitcoin: '#F2A338',
  bitcoinSoft: '#3A2B17',

  // Outros
  splash: '#0C7458',
  onTint: '#FFFFFF',
  shadow: '#000000',
};
