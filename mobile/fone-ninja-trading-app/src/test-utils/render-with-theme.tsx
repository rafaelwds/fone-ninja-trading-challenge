import { render, type RenderOptions } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { ThemeProvider } from 'styled-components/native';

import { lightTheme } from '@/theme';

/**
 * A maioria dos componentes usa `styled-components` e `useTheme()`, entao precisa
 * de um `ThemeProvider` real por cima para renderizar sem erro nos testes -
 * este helper faz isso, usando sempre o tema claro (suficiente para os testes,
 * que checam comportamento/dados, nao a paleta de cores exata).
 *
 * Na v14 do @testing-library/react-native o `render()` e assincrono (retorna
 * Promise), entao este helper tambem e - use `await renderWithTheme(...)`.
 */
export function renderWithTheme(ui: ReactElement, options?: RenderOptions) {
  return render(<ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>, options);
}
