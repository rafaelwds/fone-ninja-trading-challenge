import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';

import * as S from './styles';

export type TabBarItemProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  focused: boolean;
};

export function TabBarItem({ label, icon, focused }: TabBarItemProps) {
  const theme = useTheme();

  return (
    <S.Container $focused={focused}>
      <Ionicons
        name={icon}
        size={22}
        color={focused ? theme.colors.primary : theme.colors.textSecondary}
      />
      <S.Label $focused={focused}>{label}</S.Label>
    </S.Container>
  );
}
