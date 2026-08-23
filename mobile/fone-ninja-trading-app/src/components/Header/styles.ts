import styled from 'styled-components/native';

type ItemVariant = {
  variant?: 'negotiate' | 'history';
};

export const Container = styled.View`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

export const ViewContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  `;

  export const ViewLeft = styled.View`
  align-items: start;
  justify-content: space-between;
  `;

export const ViewRight = styled.View<ItemVariant>`
  flex-direction: ${({ variant }) =>
    variant === 'negotiate' ? 'column' : 'row'};
  align-items:   flex-end;
`;

export const Name = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 700;
`;

export const TitleScreen = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 32px;
  font-weight: 700;
`;

export const TextPrice = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 700;
`;

export const TextPorcentage = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 700;
`;

export const ViewOperations = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: 20px;
  background-color: ${({ theme,  }) => theme.colors.backgroundSelected };
  bottom: 20px;
`;

export const TextOperations = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 700;
`;
