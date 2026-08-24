import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { useTheme } from 'styled-components/native';

import * as S from './styles';

// Precisa bater com o numero de <Tabs.Screen> em src/app/(tabs)/_layout.tsx.
const TAB_COUNT = 3;

export type TabBarItemProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  focused: boolean;
};

export function TabBarItem({ label, icon, focused }: TabBarItemProps) {
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  // Cada aba ocupa exatamente 1/N da largura da tela, calculado em tempo real -
  // garante que o rotulo sempre tem a largura real disponivel pra caber sem
  // quebrar linha, em qualquer resolucao de smartphone (e tambem ao girar a tela).
  const tabWidth = windowWidth / TAB_COUNT;

  return (
    <S.Container $focused={focused} $width={tabWidth}>
      <Ionicons
        name={icon}
        size={22}
        color={focused ? theme.colors.primary : theme.colors.textSecondary}
      />
      <S.Label $focused={focused} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
        {label}
      </S.Label>
    </S.Container>
  );
}
