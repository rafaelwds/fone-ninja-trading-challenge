import { SafeAreaView } from 'react-native-safe-area-context';
import * as S from './styles';
import { Header } from '@/components/Header';

export function History() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <S.Container>
        <Header variant="history" title="Histórico" />
      </S.Container>
    </SafeAreaView>
  );
}
