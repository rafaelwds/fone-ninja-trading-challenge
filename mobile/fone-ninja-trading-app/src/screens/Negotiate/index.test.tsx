import { fireEvent } from '@testing-library/react-native';

import { ApiError } from '@/services/api';
import { renderWithTheme } from '@/test-utils/render-with-theme';

import { Negotiate } from './index';

const buyMutate = jest.fn();
const sellMutate = jest.fn();
const buyReset = jest.fn();
const sellReset = jest.fn();

jest.mock('@/hooks/use-wallet', () => ({ useWallet: jest.fn() }));
jest.mock('@/hooks/use-market-price', () => ({ useMarketPrice: jest.fn() }));
jest.mock('@/hooks/use-trade', () => ({
  useBuyBitcoin: jest.fn(),
  useSellBitcoin: jest.fn(),
}));

import { useMarketPrice } from '@/hooks/use-market-price';
import { useBuyBitcoin, useSellBitcoin } from '@/hooks/use-trade';
import { useWallet } from '@/hooks/use-wallet';

const mockedUseWallet = useWallet as jest.Mock;
const mockedUseMarketPrice = useMarketPrice as jest.Mock;
const mockedUseBuyBitcoin = useBuyBitcoin as jest.Mock;
const mockedUseSellBitcoin = useSellBitcoin as jest.Mock;

function mockHappyPath() {
  mockedUseWallet.mockReturnValue({
    data: { data: { brl_balance: '9607.28', btc_balance: '0.00183023' } },
  });
  mockedUseMarketPrice.mockReturnValue({ data: { data: { price: '250000.00' } } });
  mockedUseBuyBitcoin.mockReturnValue({
    mutate: buyMutate,
    reset: buyReset,
    isPending: false,
    isSuccess: false,
    error: null,
  });
  mockedUseSellBitcoin.mockReturnValue({
    mutate: sellMutate,
    reset: sellReset,
    isPending: false,
    isSuccess: false,
    error: null,
  });
}

describe('Negotiate', () => {
  beforeEach(() => {
    buyMutate.mockClear();
    sellMutate.mockClear();
    buyReset.mockClear();
    sellReset.mockClear();
    mockHappyPath();
  });

  it('mostra o saldo disponivel em reais no modo compra', async () => {
    const { getByText } = await renderWithTheme(<Negotiate />);

    expect(getByText(/Dispon.vel:.*9\.607,28/)).toBeTruthy();
  });

  it('digitar um valor calcula a quantidade estimada de BTC ao preco atual', async () => {
    const { getByDisplayValue, getByText } = await renderWithTheme(<Negotiate />);

    // Input mascarado: "100000" (digitos) vira "R$ 1.000,00"
    await fireEvent.changeText(getByDisplayValue('0,00'), '100000');

    // 1000 / 250000 = 0.004 BTC
    expect(getByText('0,00400000 BTC')).toBeTruthy();
  });

  it('mantem o botao desabilitado com valor zerado', async () => {
    const { getByRole } = await renderWithTheme(<Negotiate />);

    expect(
      getByRole('button', { name: 'Confirmar compra' }).props.accessibilityState.disabled
    ).toBe(true);
  });

  it('confirma a compra com o valor em reais formatado com 2 casas decimais', async () => {
    const { getByDisplayValue, getByText } = await renderWithTheme(<Negotiate />);

    await fireEvent.changeText(getByDisplayValue('0,00'), '100000');
    await fireEvent.press(getByText('Confirmar compra'));

    expect(buyMutate).toHaveBeenCalledWith('1000.00', expect.anything());
  });

  it('troca para o modo Vender e passa a pedir quantidade em BTC', async () => {
    const { getByText } = await renderWithTheme(<Negotiate />);

    await fireEvent.press(getByText('Vender'));

    expect(getByText('Quantidade a vender')).toBeTruthy();
    expect(getByText('Confirmar venda')).toBeTruthy();
  });

  it('trocar de modo limpa o valor digitado e reseta as mutations', async () => {
    const { getByDisplayValue, getByText } = await renderWithTheme(<Negotiate />);

    await fireEvent.changeText(getByDisplayValue('0,00'), '100000');
    await fireEvent.press(getByText('Vender'));

    expect(buyReset).toHaveBeenCalled();
  });

  it('mostra a mensagem de erro da API quando a compra falha por saldo insuficiente', async () => {
    mockedUseBuyBitcoin.mockReturnValue({
      mutate: buyMutate,
      reset: buyReset,
      isPending: false,
      isSuccess: false,
      error: new ApiError('Saldo em reais insuficiente para realizar a compra.', 422),
    });

    const { getByText } = await renderWithTheme(<Negotiate />);

    expect(getByText('Saldo em reais insuficiente para realizar a compra.')).toBeTruthy();
  });
});
