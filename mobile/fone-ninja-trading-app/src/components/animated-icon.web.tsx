import { Image } from 'expo-image';
import { View } from 'react-native';
import Animated, { Keyframe, Easing } from 'react-native-reanimated';
import styled from 'styled-components/native';

const DURATION = 300;

export function AnimatedSplashOverlay() {
  return null;
}

const keyframe = new Keyframe({
  0: { transform: [{ scale: 0 }] },
  60: { transform: [{ scale: 1.2 }], easing: Easing.elastic(1.2) },
  100: { transform: [{ scale: 1 }], easing: Easing.elastic(1.2) },
});

const logoKeyframe = new Keyframe({
  0: { opacity: 0 },
  60: { transform: [{ scale: 1.2 }], opacity: 0, easing: Easing.elastic(1.2) },
  100: { transform: [{ scale: 1 }], opacity: 1, easing: Easing.elastic(1.2) },
});

const glowKeyframe = new Keyframe({
  0: { transform: [{ rotateZ: '-180deg' }, { scale: 0.8 }], opacity: 0 },
  [DURATION / 1000]: {
    transform: [{ rotateZ: '0deg' }, { scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(0.7),
  },
  100: { transform: [{ rotateZ: '7200deg' }] },
});

export function AnimatedIcon() {
  return (
    <IconContainer>
      <GlowView entering={glowKeyframe.duration(60 * 1000 * 4)}>
        <GlowImage source={require('@/assets/images/logo-glow.png')} />
      </GlowView>

      <BackgroundView entering={keyframe.duration(DURATION)}>
        <BackgroundGradient />
      </BackgroundView>

      <ImageContainer entering={logoKeyframe.duration(DURATION)}>
        <LogoImage source={require('@/assets/images/expo-logo.png')} />
      </ImageContainer>
    </IconContainer>
  );
}

const ImageContainer = styled(Animated.View)`
  justify-content: center;
  align-items: center;
`;

const GlowView = styled(Animated.View)`
  width: 201px;
  height: 201px;
  position: absolute;
`;

const GlowImage = styled(Image)`
  width: 201px;
  height: 201px;
  position: absolute;
`;

const IconContainer = styled(View)`
  justify-content: center;
  align-items: center;
  width: 128px;
  height: 128px;
`;

const LogoImage = styled(Image)`
  position: absolute;
  width: 76px;
  height: 71px;
`;

const BackgroundView = styled(Animated.View)`
  width: 128px;
  height: 128px;
  position: absolute;
`;

const BackgroundGradient = styled(View).attrs({
  style: {
    experimental_backgroundImage: 'linear-gradient(180deg, #3C9FFE, #0274DF)',
  },
})`
  border-radius: 40px;
  width: 128px;
  height: 128px;
`;
