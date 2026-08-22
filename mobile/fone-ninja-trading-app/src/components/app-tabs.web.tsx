import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { ExternalLink } from './external-link';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlotFull />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Explore</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

const TabSlotFull = styled(TabSlot)`
  height: 100%;
`;

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <PressableTab {...props}>
      <TabButtonView surface={isFocused ? 'backgroundSelected' : 'backgroundElement'}>
        <ThemedText variant="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </TabButtonView>
    </PressableTab>
  );
}

export function CustomTabList(props: TabListProps) {
  const theme = useTheme();

  return (
    <TabListContainer {...props}>
      <InnerContainer surface="backgroundElement">
        <BrandText variant="smallBold">Expo Starter</BrandText>

        {props.children}

        <ExternalLink href="https://docs.expo.dev" asChild>
          <ExternalPressable>
            <ThemedText variant="link">Docs</ThemedText>
            <SymbolView
              tintColor={theme.colors.text}
              name={{ ios: 'arrow.up.right.square', web: 'link' }}
              size={12}
            />
          </ExternalPressable>
        </ExternalLink>
      </InnerContainer>
    </TabListContainer>
  );
}

const PressableTab = styled(Pressable)`
  opacity: 1;
`;

const TabListContainer = styled(View)`
  position: absolute;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md}px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const InnerContainer = styled(ThemedView)`
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
  border-radius: ${({ theme }) => theme.spacing.xl}px;
  flex-direction: row;
  align-items: center;
  flex-grow: 1;
  gap: ${({ theme }) => theme.spacing.sm}px;
  max-width: ${({ theme }) => theme.layout.maxContentWidth}px;
`;

const BrandText = styled(ThemedText)`
  margin-right: auto;
`;

const TabButtonView = styled(ThemedView)`
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.spacing.md}px;
`;

const ExternalPressable = styled(Pressable)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-left: ${({ theme }) => theme.spacing.md}px;
`;
