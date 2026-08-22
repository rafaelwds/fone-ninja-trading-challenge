import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { Dimensions, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import styled from 'styled-components/native';

const INITIAL_SCALE_FACTOR = Dimensions.get('screen').height / 90;
const DURATION = 600;

export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: { transform: [{ scale: 1 }], opacity: 1 },
    20: { opacity: 1 },
    70: { opacity: 0, easing: Easing.elastic(0.7) },
    100: { opacity: 0, transform: [{ scale: 1 }], easing: Easing.elastic(0.7) },
  });

  const image = <LogoImage source={require('@/assets/images/expo-logo.png')} />;

  return animate ? (
    <AnimatedSplashOverlayView
      entering={splashKeyframe.duration(DURATION).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}>
      {image}
    </AnimatedSplashOverlayView>
  ) : (
    <SplashOverlayView
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => {
          setAnimate(true);
        });
      }}>
      {image}
    </SplashOverlayView>
  );
}

const keyframe = new Keyframe({
  0: { transform: [{ scale: INITIAL_SCALE_FACTOR }] },
  100: { transform: [{ scale: 1 }], easing: Easing.elastic(0.7) },
});

const logoKeyframe = new Keyframe({
  0: { transform: [{ scale: 1.3 }], opacity: 0 },
  40: { transform: [{ scale: 1.3 }], opacity: 0, easing: Easing.elastic(0.7) },
  100: { opacity: 1, transform: [{ scale: 1 }], easing: Easing.elastic(0.7) },
});

const glowKeyframe = new Keyframe({
  0: { transform: [{ rotateZ: '0deg' }] },
  100: { transform: [{ rotateZ: '7200deg' }] },
});

export function AnimatedIcon() {
  return (
    <IconContainer>
      <GlowView entering={glowKeyframe.duration(60 * 1000 * 4)}>
        <GlowImage source={require('@/assets/images/logo-glow.png')} />
      </GlowView>

      <BackgroundView entering={keyframe.duration(DURATION)} />
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
  z-index: 100;
`;

const LogoImage = styled(Image)`
  width: 76px;
  height: 71px;
`;

const BackgroundView = styled(Animated.View).attrs({
  style: {
    experimental_backgroundImage: 'linear-gradient(180deg, #3C9FFE, #0274DF)',
  },
})`
  border-radius: 40px;
  width: 128px;
  height: 128px;
  position: absolute;
`;

const SplashOverlayView = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.splash};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const AnimatedSplashOverlayView = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.splash};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
