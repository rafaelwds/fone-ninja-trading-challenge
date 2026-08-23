import { Header } from '@/components/Header';
import * as S from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Negotiate() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <S.Container>
        <Header variant="negociar" title="Negociar" />
      </S.Container>
    </SafeAreaView>
  );
}
