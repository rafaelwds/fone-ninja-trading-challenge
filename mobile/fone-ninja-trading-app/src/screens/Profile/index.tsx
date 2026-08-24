import { Ionicons } from '@expo/vector-icons';
import UserAvatar from 'react-native-user-avatar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';

import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import type { ThemeMode } from '@/theme';

import * as S from './styles';

export function Profile() {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setThemeOverride = useThemeStore((state) => state.setThemeOverride);

  function handleSelectTheme(mode: ThemeMode) {
    setThemeOverride(mode);
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <S.Container>
        <S.TitleScreen>Perfil</S.TitleScreen>

        <S.UserCard>
          <UserAvatar
            size={56}
            bgColor={theme.colors.backgroundSelected}
            textColor={theme.colors.primary}
            name={user?.name}
          />
          <S.UserInfo>
            <S.UserName numberOfLines={1}>{user?.name}</S.UserName>
            <S.UserEmail numberOfLines={1}>{user?.email}</S.UserEmail>
          </S.UserInfo>
        </S.UserCard>

        <S.SectionLabel>Aparência</S.SectionLabel>
        <S.ThemeToggleContainer>
          <S.ThemeToggleButton
            $active={theme.mode === 'light'}
            onPress={() => handleSelectTheme('light')}
          >
            <Ionicons
              name="sunny-outline"
              size={16}
              color={theme.mode === 'light' ? theme.colors.primary : theme.colors.textSecondary}
            />
            <S.ThemeToggleText $active={theme.mode === 'light'}>Claro</S.ThemeToggleText>
          </S.ThemeToggleButton>
          <S.ThemeToggleButton
            $active={theme.mode === 'dark'}
            onPress={() => handleSelectTheme('dark')}
          >
            <Ionicons
              name="moon-outline"
              size={16}
              color={theme.mode === 'dark' ? theme.colors.primary : theme.colors.textSecondary}
            />
            <S.ThemeToggleText $active={theme.mode === 'dark'}>Escuro</S.ThemeToggleText>
          </S.ThemeToggleButton>
        </S.ThemeToggleContainer>

        <S.LogoutSection>
          <Button title="Sair" variant="danger" onPress={clearSession} />
        </S.LogoutSection>
      </S.Container>
    </SafeAreaView>
  );
}
