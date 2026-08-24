import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { useMarketPrice } from '@/hooks/use-market-price';
import { useBuyBitcoin, useSellBitcoin } from '@/hooks/use-trade';
import { useWallet } from '@/hooks/use-wallet';
import { ApiError } from '@/services/api';
import {
  formatBtc,
  formatCentsToDecimalDisplay,
  formatCurrencyBRL,
  sanitizeDecimalInput,
} from '@/utils/format';

import * as S from './styles';

type Mode = 'buy' | 'sell';

export function Negotiate() {
  const [mode, setMode] = useState<Mode>('buy');
  const [brlDigits, setBrlDigits] = useState('');
  const [btcInput, setBtcInput] = useState('');

  const wallet = useWallet();
  const market = useMarketPrice();
  const buyMutation = useBuyBitcoin();
  const sellMutation = useSellBitcoin();

  const price = market.data?.data.price;
  const priceLabel = price !== undefined ? formatCurrencyBRL(price) : undefined;

  const brlAmount = Number(brlDigits || '0') / 100;
  const btcAmount = Number(btcInput.replace(',', '.') || '0');

  const estimatedBtc = price && brlAmount > 0 ? brlAmount / Number(price) : 0;
  const estimatedBrl = price && btcAmount > 0 ? btcAmount * Number(price) : 0;

  const activeMutation = mode === 'buy' ? buyMutation : sellMutation;
  const isAmountValid = mode === 'buy' ? brlAmount > 0 : btcAmount > 0;

  function handleChangeMode(nextMode: Mode) {
    setMode(nextMode);
    setBrlDigits('');
    setBtcInput('');
    buyMutation.reset();
    sellMutation.reset();
  }

  function handleConfirm() {
    if (mode === 'buy') {
      if (brlAmount <= 0) return;
      buyMutation.mutate(brlAmount.toFixed(2), { onSuccess: () => setBrlDigits('') });
    } else {
      if (btcAmount <= 0) return;
      sellMutation.mutate(btcAmount.toFixed(8), { onSuccess: () => setBtcInput('') });
    }
  }

  const errorMessage =
    activeMutation.error instanceof ApiError
      ? activeMutation.error.message
      : activeMutation.error
        ? 'Não foi possível conectar à API.'
        : null;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <S.Container keyboardShouldPersistTaps="handled">
          <Header variant="negociar" title="Negociar" priceLabel={priceLabel} />

          <S.TabsContainer>
            <S.TabButton $active={mode === 'buy'} onPress={() => handleChangeMode('buy')}>
              <S.TabButtonText $active={mode === 'buy'}>Comprar</S.TabButtonText>
            </S.TabButton>
            <S.TabButton $active={mode === 'sell'} onPress={() => handleChangeMode('sell')}>
              <S.TabButtonText $active={mode === 'sell'}>Vender</S.TabButtonText>
            </S.TabButton>
          </S.TabsContainer>

          <S.FormCard>
            <S.FormHeaderRow>
              <S.FormLabel>
                {mode === 'buy' ? 'Valor da compra' : 'Quantidade a vender'}
              </S.FormLabel>
              <S.AvailableLabel>
                Disponível:{' '}
                {mode === 'buy'
                  ? wallet.data
                    ? formatCurrencyBRL(wallet.data.data.brl_balance)
                    : '—'
                  : wallet.data
                    ? formatBtc(wallet.data.data.btc_balance)
                    : '—'}
              </S.AvailableLabel>
            </S.FormHeaderRow>

            <S.InputRow>
              <S.InputPrefix>{mode === 'buy' ? 'R$' : 'BTC'}</S.InputPrefix>
              {mode === 'buy' ? (
                <S.AmountInput
                  value={formatCentsToDecimalDisplay(brlDigits)}
                  onChangeText={(text) => setBrlDigits(text.replace(/\D/g, '').slice(0, 10))}
                  keyboardType="number-pad"
                  editable={!buyMutation.isPending}
                />
              ) : (
                <S.AmountInput
                  value={btcInput}
                  onChangeText={(text) => setBtcInput(sanitizeDecimalInput(text))}
                  keyboardType="decimal-pad"
                  placeholder="0,00000000"
                  editable={!sellMutation.isPending}
                />
              )}
            </S.InputRow>

            <S.PreviewRow>
              <S.PreviewLabel>Você recebe aproximadamente</S.PreviewLabel>
              <S.PreviewValue numberOfLines={1}>
                {mode === 'buy' ? formatBtc(estimatedBtc) : formatCurrencyBRL(estimatedBrl)}
              </S.PreviewValue>
            </S.PreviewRow>

            {errorMessage && <S.ErrorText>{errorMessage}</S.ErrorText>}
            {activeMutation.isSuccess && (
              <S.SuccessText>
                {mode === 'buy' ? 'Compra realizada com sucesso!' : 'Venda realizada com sucesso!'}
              </S.SuccessText>
            )}

            <S.ConfirmButtonWrapper>
              <Button
                title={mode === 'buy' ? 'Confirmar compra' : 'Confirmar venda'}
                variant="primary"
                onPress={handleConfirm}
                loading={activeMutation.isPending}
                disabled={!isAmountValid || !price}
              />
            </S.ConfirmButtonWrapper>
          </S.FormCard>

          <S.InfoNote>
            <S.InfoIconCircle>
              <S.InfoIconText>i</S.InfoIconText>
            </S.InfoIconCircle>
            <S.InfoText>
              O preço é simulado e fica disponível por 30 segundos antes de atualizar.
            </S.InfoText>
          </S.InfoNote>
        </S.Container>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
