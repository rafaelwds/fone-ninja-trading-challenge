import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from 'styled-components/native';

import { Button } from '@/components/Button';
import { ApiError } from '@/services/api';
import { useLogin } from '@/hooks/use-login';

import * as S from './styles';

export function Login() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // TanStack Query: cuida do ciclo de vida da requisicao de login em si.
  // Quando ela da certo, o hook salva a sessao na Zustand store; a rota "/"
  // (src/app/index.tsx) esta escutando essa store e redireciona pras tabs.
  const loginMutation = useLogin();

  function handleSubmit() {
    loginMutation.mutate({ email, password });
  }

  const errorMessage =
    loginMutation.error instanceof ApiError
      ? loginMutation.error.message
      : loginMutation.error
        ? 'Não foi possível conectar à API.'
        : null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <S.Screen>
        <S.Card>
          <S.Header>
            <S.Avatar>
              <S.AvatarLabel>FNT</S.AvatarLabel>
            </S.Avatar>
            <S.Brand>Fone Ninja Trade</S.Brand>
            <S.DemoBadge>
              <S.DemoBadgeLabel>Demo</S.DemoBadgeLabel>
            </S.DemoBadge>
          </S.Header>

          <S.Eyebrow>Simulação de trading</S.Eyebrow>
          <S.Title>Boas-vindas</S.Title>
          <S.Subtitle>Entre para acompanhar sua carteira e negociar Bitcoin.</S.Subtitle>

          <S.FormBox>
            <S.Field>
              <S.Label>E-mail</S.Label>
              <S.Input
                value={email}
                onChangeText={setEmail}
                placeholder="rafael@example.com"
                placeholderTextColor={theme.colors.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                autoComplete="email"
                editable={!loginMutation.isPending}
              />
            </S.Field>

            <S.Field>
              <S.Label>Senha</S.Label>
              <S.Input
                value={password}
                onChangeText={setPassword}
                placeholder="********"
                placeholderTextColor={theme.colors.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                autoComplete="password"
                editable={!loginMutation.isPending}
              />
            </S.Field>

            {errorMessage && <S.ErrorText>{errorMessage}</S.ErrorText>}

            <Button title="Entrar" onPress={handleSubmit} loading={loginMutation.isPending} />
          </S.FormBox>
        </S.Card>
      </S.Screen>
    </KeyboardAvoidingView>
  );
}
