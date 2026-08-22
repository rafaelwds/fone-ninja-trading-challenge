import { version } from 'expo/package.json';
import { Image } from 'expo-image';
import { useColorScheme } from 'react-native';
import styled from 'styled-components/native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export function WebBadge() {
  const scheme = useColorScheme();

  return (
    <Container>
      <VersionText variant="code" themeColor="textSecondary">
        v{version}
      </VersionText>
      <BadgeImage
        source={
          scheme === 'dark'
            ? require('@/assets/images/expo-badge-white.png')
            : require('@/assets/images/expo-badge.png')
        }
      />
    </Container>
  );
}

const Container = styled(ThemedView)`
  padding: ${({ theme }) => theme.spacing.xl}px;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const VersionText = styled(ThemedText)`
  text-align: center;
`;

const BadgeImage = styled(Image)`
  width: 123px;
  aspect-ratio: ${123 / 24};
`;
