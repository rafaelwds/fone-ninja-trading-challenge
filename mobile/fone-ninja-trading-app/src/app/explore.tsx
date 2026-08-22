import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { WebBadge } from '@/components/web-badge';

export default function TabTwoScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + theme.layout.bottomTabInset + theme.spacing.md,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: theme.spacing.xxxl,
      paddingBottom: theme.spacing.lg,
    },
  });

  return (
    <ScrollBase
      contentInset={insets}
      contentContainerStyle={[
        { flexDirection: 'row', justifyContent: 'center' },
        contentPlatformStyle,
      ]}>
      <Container>
        <TitleContainer>
          <ThemedText variant="subtitle">Explore</ThemedText>
          <CenterText themeColor="textSecondary">
            This starter app includes example{'\n'}code to help you get started.
          </CenterText>

          <ExternalLink href="https://docs.expo.dev" asChild>
            <Pressable style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}>
              <LinkButton surface="backgroundElement">
                <ThemedText variant="link">Expo documentation</ThemedText>
                <SymbolView
                  tintColor={theme.colors.text}
                  name={{ ios: 'arrow.up.right.square', android: 'link', web: 'link' }}
                  size={12}
                />
              </LinkButton>
            </Pressable>
          </ExternalLink>
        </TitleContainer>

        <SectionsWrapper>
          <Collapsible title="File-based routing">
            <ThemedText variant="small">
              This app has two screens:{' '}
              <ThemedText variant="code">src/app/index.tsx</ThemedText> and{' '}
              <ThemedText variant="code">src/app/explore.tsx</ThemedText>
            </ThemedText>
            <ThemedText variant="small">
              The layout file in <ThemedText variant="code">src/app/_layout.tsx</ThemedText> sets up
              the tab navigator.
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/router/introduction">
              <ThemedText variant="linkPrimary">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Android, iOS, and web support">
            <CollapsibleContent surface="backgroundElement">
              <ThemedText variant="small">
                You can open this project on Android, iOS, and the web. To open the web version,
                press <ThemedText variant="smallBold">w</ThemedText> in the terminal running this
                project.
              </ThemedText>
              <ImageTutorial source={require('@/assets/images/tutorial-web.png')} />
            </CollapsibleContent>
          </Collapsible>

          <Collapsible title="Images">
            <ThemedText variant="small">
              For static images, you can use the <ThemedText variant="code">@2x</ThemedText> and{' '}
              <ThemedText variant="code">@3x</ThemedText> suffixes to provide files for different
              screen densities.
            </ThemedText>
            <ImageReact source={require('@/assets/images/react-logo.png')} />
            <ExternalLink href="https://reactnative.dev/docs/images">
              <ThemedText variant="linkPrimary">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Light and dark mode components">
            <ThemedText variant="small">
              This template has light and dark mode support. The{' '}
              <ThemedText variant="code">useColorScheme()</ThemedText> hook lets you inspect what
              the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
              <ThemedText variant="linkPrimary">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Animations">
            <ThemedText variant="small">
              This template includes an example of an animated component. The{' '}
              <ThemedText variant="code">src/components/ui/collapsible.tsx</ThemedText> component
              uses the powerful <ThemedText variant="code">react-native-reanimated</ThemedText>{' '}
              library to animate opening this hint.
            </ThemedText>
          </Collapsible>
        </SectionsWrapper>
        {Platform.OS === 'web' && <WebBadge />}
      </Container>
    </ScrollBase>
  );
}

const ScrollBase = styled(ScrollView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Container = styled(ThemedView)`
  max-width: ${({ theme }) => theme.layout.maxContentWidth}px;
  flex-grow: 1;
`;

const TitleContainer = styled(ThemedView)`
  gap: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.xxxl}px;
`;

const CenterText = styled(ThemedText)`
  text-align: center;
`;

const LinkButton = styled(ThemedView)`
  flex-direction: row;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.spacing.xl}px;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  align-items: center;
`;

const SectionsWrapper = styled(ThemedView)`
  gap: ${({ theme }) => theme.spacing.xl}px;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
`;

const CollapsibleContent = styled(ThemedView)`
  align-items: center;
`;

const ImageTutorial = styled(Image)`
  width: 100%;
  aspect-ratio: ${296 / 171};
  border-radius: ${({ theme }) => theme.spacing.md}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const ImageReact = styled(Image)`
  width: 100px;
  height: 100px;
  align-self: center;
`;
