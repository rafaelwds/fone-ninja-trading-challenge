import { fireEvent } from '@testing-library/react-native';

import { ApiError } from '@/services/api';
import { renderWithTheme } from '@/test-utils/render-with-theme';

import { Login } from './index';

const mutate = jest.fn();

// O hook cuida da chamada de rede (TanStack Query) - a tela so precisa reagir ao
// que ele expoe (mutate/isPending/error). Mockamos o hook, nao o `fetch`.
jest.mock('@/hooks/use-login', () => ({
  useLogin: jest.fn(),
}));

import { useLogin } from '@/hooks/use-login';

const mockedUseLogin = useLogin as jest.Mock;

describe('Login', () => {
  beforeEach(() => {
    mutate.mockClear();
    mockedUseLogin.mockReturnValue({ mutate, isPending: false, error: null });
  });

  it('chama mutate com o e-mail e a senha digitados ao apertar Entrar', async () => {
    const { getByPlaceholderText, getByText } = await renderWithTheme(<Login />);

    await fireEvent.changeText(getByPlaceholderText('rafael@example.com'), 'rafael@example.com');
    await fireEvent.changeText(getByPlaceholderText('********'), 'password');
    await fireEvent.press(getByText('Entrar'));

    expect(mutate).toHaveBeenCalledWith({ email: 'rafael@example.com', password: 'password' });
  });

  it('mostra a mensagem de erro da API quando a mutation falha com ApiError', async () => {
    mockedUseLogin.mockReturnValue({
      mutate,
      isPending: false,
      error: new ApiError('Credenciais invalidas.', 401),
    });

    const { getByText } = await renderWithTheme(<Login />);

    expect(getByText('Credenciais invalidas.')).toBeTruthy();
  });

  it('mostra uma mensagem generica quando o erro nao veio da API (ex: sem rede)', async () => {
    mockedUseLogin.mockReturnValue({
      mutate,
      isPending: false,
      error: new Error('Network request failed'),
    });

    const { getByText } = await renderWithTheme(<Login />);

    expect(getByText('Não foi possível conectar à API.')).toBeTruthy();
  });

  it('nao mostra nenhum erro quando a mutation ainda nao foi disparada', async () => {
    const { queryByText } = await renderWithTheme(<Login />);

    expect(queryByText('Não foi possível conectar à API.')).toBeNull();
  });

  it('desabilita os campos de e-mail e senha enquanto a requisicao esta pendente', async () => {
    mockedUseLogin.mockReturnValue({ mutate, isPending: true, error: null });

    const { getByPlaceholderText } = await renderWithTheme(<Login />);

    expect(getByPlaceholderText('rafael@example.com').props.editable).toBe(false);
    expect(getByPlaceholderText('********').props.editable).toBe(false);
  });
});
