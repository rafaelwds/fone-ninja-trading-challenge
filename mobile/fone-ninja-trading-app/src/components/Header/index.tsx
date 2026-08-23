import { useAuthStore } from '@/store/auth-store';

import * as S from './styles';
import UserAvatar from 'react-native-user-avatar';
import { themes } from '@/theme';

export type HeaderVariant = 'walet' | 'negociar' | 'history';

export type HeaderProps = {
  variant: HeaderVariant;
  title: string;
  subtitle?: string;
  /** Preco atual do BTC ja formatado (ex: "R$ 214.570,55"), usado na variante "negociar". */
  priceLabel?: string;
};

export function Header({ variant, title, priceLabel }: HeaderProps) {
  const name = useAuthStore((state) => state.user?.name);

  return (
    <S.Container>
      {variant === 'walet' && (
        <S.ViewContainer>
          <S.ViewLeft>
            <S.Name>Olá, {name}</S.Name>
            <S.TitleScreen>{title}</S.TitleScreen>
          </S.ViewLeft>
          <S.ViewRight>
            <UserAvatar
              size={30}
              bgColor={themes.light.colors.backgroundSelected}
              textColor={themes.light.colors.primaryPressed}
              name={name}
              style={{ bottom: 16, left: 16 }}
            />
          </S.ViewRight>
        </S.ViewContainer>
      )}
      {variant === 'negociar' && (
        <S.ViewContainer>
          <S.ViewLeft>
            <S.Name>BTC / BRL</S.Name>
            <S.TitleScreen>{title}</S.TitleScreen>
          </S.ViewLeft>
          <S.ViewRight variant="negotiate">
            <S.TextPrice>{priceLabel ?? '—'}</S.TextPrice>
          </S.ViewRight>
        </S.ViewContainer>
      )}

      {variant === 'history' && (
        <S.ViewContainer>
          <S.ViewLeft>
            <S.Name>Sua atividade</S.Name>
            <S.TitleScreen>{title}</S.TitleScreen>
          </S.ViewLeft>
          <S.ViewRight>
            <S.ViewOperations>
              <S.TextOperations>3 operações</S.TextOperations>
            </S.ViewOperations>
          </S.ViewRight>
        </S.ViewContainer>
      )}
    </S.Container>
  );
}
