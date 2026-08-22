import { View as RNView, type ViewProps } from 'react-native';
import styled from 'styled-components/native';

import type { ColorTokens } from '@/theme';

export type ThemedSurface = Extract<
  keyof ColorTokens,
  'background' | 'backgroundElement' | 'backgroundSelected'
>;

export type ThemedViewProps = ViewProps & {
  surface?: ThemedSurface;
};

const StyledView = styled(RNView)<{ $surface: ThemedSurface }>`
  background-color: ${({ $surface, theme }) => theme.colors[$surface]};
`;

export function ThemedView({
  surface = 'background',
  style,
  ...rest
}: ThemedViewProps) {
  return <StyledView $surface={surface} style={style} {...rest} />;
}
