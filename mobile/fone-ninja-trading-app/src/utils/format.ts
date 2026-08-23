const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

/** "10622.5" | 10622.5 -> "R$ 10.622,50" */
export function formatCurrencyBRL(value: string | number): string {
  return currencyFormatter.format(Number(value));
}

/** "0.00250000" | 0.0025 -> "0,00250000 BTC" */
export function formatBtc(value: string | number): string {
  return `${Number(value).toFixed(8).replace('.', ',')} BTC`;
}

/** ISO date -> "Hoje, 10:42" | "Ontem, 16:20" | "22 ago, 14:30" */
export function formatTransactionDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();

  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, now)) {
    return `Hoje, ${time}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, yesterday)) {
    return `Ontem, ${time}`;
  }

  const day = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  return `${day}, ${time}`;
}

/**
 * Mascara de moeda estilo "calculadora": recebe so os digitos ja acumulados
 * (cada digito novo entra pela direita, como centavos) e devolve o texto
 * formatado pra exibir no input. Ex: digitando "1", "2", "3" -> "0,01" -> "0,12" -> "1,23".
 */
export function formatCentsToDecimalDisplay(digitsOnly: string): string {
  const cents = digitsOnly.replace(/\D/g, '');
  const value = Number(cents || '0') / 100;
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Filtra um texto digitado para no maximo digitos + uma virgula, com ate 8 casas decimais (BTC). */
export function sanitizeDecimalInput(text: string): string {
  const cleaned = text.replace(/[^\d,]/g, '');
  const [intPart, ...rest] = cleaned.split(',');

  if (rest.length === 0) {
    return intPart;
  }

  return `${intPart},${rest.join('').slice(0, 8)}`;
}
