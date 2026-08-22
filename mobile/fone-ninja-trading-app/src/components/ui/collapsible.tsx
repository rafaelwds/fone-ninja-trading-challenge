import { SymbolView } from 'expo-symbols';
import { PropsWithChildren, useState } from 'react';
import { Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import styled, { useTheme } from 'styled-components/native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <ThemedView>
      <Pressable
        onPress={() => setIsOpen((value) => !value)}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
        <Heading>
          <IconButton surface="backgroundElement">
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              size={14}
              weight="bold"
              tintColor={theme.colors.text}
              style={{ transform: [{ rotate: isOpen ? '-90deg' : '90deg' }] }}
            />
          </IconButton>

          <ThemedText variant="small">{title}</ThemedText>
        </Heading>
      </Pressable>
      {isOpen && (
        <Animated.View entering={FadeIn.duration(200)}>
          <Content surface="backgroundElement">{children}</Content>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const Heading = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const IconButton = styled(ThemedView)`
  width: ${({ theme }) => theme.spacing.lg}px;
  height: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  justify-content: center;
  align-items: center;
`;

const Content = styled(ThemedView)`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.spacing.md}px;
  margin-left: ${({ theme }) => theme.spacing.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;
