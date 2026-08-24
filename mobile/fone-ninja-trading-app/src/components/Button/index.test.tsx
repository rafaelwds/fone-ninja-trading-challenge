import { fireEvent } from '@testing-library/react-native';

import { renderWithTheme } from '@/test-utils/render-with-theme';

import { Button } from './index';

describe('Button', () => {
  it('mostra o titulo recebido', async () => {
    const { getByText } = await renderWithTheme(
      <Button title="Comprar Bitcoin" onPress={() => {}} />
    );

    expect(getByText('Comprar Bitcoin')).toBeTruthy();
  });

  it('chama onPress ao ser tocado', async () => {
    const onPress = jest.fn();
    const { getByRole } = await renderWithTheme(
      <Button title="Confirmar compra" onPress={onPress} />
    );

    fireEvent.press(getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('nao chama onPress quando disabled', async () => {
    const onPress = jest.fn();
    const { getByRole } = await renderWithTheme(
      <Button title="Confirmar compra" onPress={onPress} disabled />
    );

    fireEvent.press(getByRole('button'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('nao chama onPress enquanto loading (mesmo sem disabled explicito)', async () => {
    const onPress = jest.fn();
    const { getByRole } = await renderWithTheme(
      <Button title="Confirmar compra" onPress={onPress} loading />
    );

    fireEvent.press(getByRole('button'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('esconde o texto do titulo enquanto loading (mostra o spinner no lugar)', async () => {
    const { queryByText } = await renderWithTheme(
      <Button title="Confirmar compra" onPress={() => {}} loading />
    );

    expect(queryByText('Confirmar compra')).toBeNull();
  });

  it('expoe accessibilityState.disabled correto para leitores de tela', async () => {
    const { getByRole } = await renderWithTheme(
      <Button title="Comprar" onPress={() => {}} disabled />
    );

    expect(getByRole('button').props.accessibilityState.disabled).toBe(true);
  });
});
