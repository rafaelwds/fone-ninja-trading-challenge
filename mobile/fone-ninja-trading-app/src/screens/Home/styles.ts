import styled from 'styled-components/native';

type ItemBalance = {
  typeBalance?: 'BRL' | 'BTC';
};

export const Container = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    flexGrow: 1,
  },
}))`
  padding: 0 ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Name = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 700;
`;

export const TitleScreen = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const CardBalanceBRL = styled.View`
  width: 48%;
  background-color: ${({ theme }) => theme.colors.onTint};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const CardBalanceBTC = styled.View`
  width: 48%;
  background-color: ${({ theme }) => theme.colors.onTint};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const TitleCard = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 16px;
  font-weight: 400;
`;

export const PriceCard = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  margin: ${({ theme }) => theme.spacing.md}px 0;
  font-size: 32px;
  font-weight: 700;
`;

export const SubtitleCard = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 12px;
  font-weight: 700;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export const ViewBalances = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export const ViewBalanceInternal = styled.View`
flex-direction: row;
  align-items: center;\
`;

export const ViewBalanceInternalData = styled.View``;

export const CircleIcon = styled.View<ItemBalance>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, typeBalance }) =>
    typeBalance === 'BRL' ? theme.colors.primaryPressed : theme.colors.bitcoin};
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

export const TextCircleIcon = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 12px;
  font-weight: 700;
`;

export const TexTitletCircle = styled.Text`
  color: ${({ theme }) => theme.colors.shadow};
  font-size: 12px;
  font-weight: 400;
`;

export const TextDecriptionCircle = styled.Text`
  color: ${({ theme }) => theme.colors.shadow};
  font-size: 12px;
  font-weight: 700;
  margin-top: 6px;
`;

export const CardPainelBTC = styled.View`
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.onTint};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  margin: ${({ theme }) => theme.spacing.md}px 0;
`;

export const TitleCardPainel = styled.Text`
  color: ${({ theme }) => theme.colors.shadow};
  font-size: 16px;
  font-weight: 400;
`;

export const BalancesData = styled.View`
  align-items: flex-end;
  justify-content: center;
`;

export const PriceCardPainel = styled.Text`
  color: ${({ theme }) => theme.colors.shadow};
  font-size: 14px;
  font-weight: 700;
`;

export const SubtitleCardPainel = styled.Text`
  color: ${({ theme }) => theme.colors.success};
  font-size: 14px;
  font-weight: 700;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export const SectionHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const SectionTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 700;
`;

export const SeeAllLink = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 700;
`;

export const ItemSeparator = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
`;
