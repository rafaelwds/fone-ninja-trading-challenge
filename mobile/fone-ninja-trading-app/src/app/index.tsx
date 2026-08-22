import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText variant="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText variant="small">
        shake device or press <ThemedText variant="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText variant="small">
      press <ThemedText variant="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  return (
    <Container>
      <Safe>
        <HeroSection>
          <AnimatedIcon />
          <Title variant="title">Welcome to&nbsp;Expo</Title>
        </HeroSection>

        <CodeText variant="code">get started</CodeText>

        <StepContainer surface="backgroundElement">
          <HintRow
            title="Try editing"
            hint={<ThemedText variant="code">src/app/index.tsx</ThemedText>}
          />
          <HintRow title="Dev tools" hint={getDevMenuHint()} />
          <HintRow
            title="Fresh start"
            hint={<ThemedText variant="code">npm run reset-project</ThemedText>}
          />
        </StepContainer>

        {Platform.OS === 'web' && <WebBadge />}
      </Safe>
    </Container>
  );
}

const Container = styled(ThemedView)`
  flex: 1;
  justify-content: center;
  flex-direction: row;
`;

const Safe = styled(SafeAreaView)`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.layout.bottomTabInset + theme.spacing.md}px;
  max-width: ${({ theme }) => theme.layout.maxContentWidth}px;
`;

const HeroSection = styled(ThemedView)`
  align-items: center;
  justify-content: center;
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const Title = styled(ThemedText)`
  text-align: center;
`;

const CodeText = styled(ThemedText)`
  text-transform: uppercase;
`;

const StepContainer = styled(ThemedView)`
  gap: ${({ theme }) => theme.spacing.md}px;
  align-self: stretch;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.spacing.lg}px;
`;
