import {
  formatBtc,
  formatCentsToDecimalDisplay,
  formatCurrencyBRL,
  formatTransactionDate,
  sanitizeDecimalInput,
} from './format';

describe('formatCurrencyBRL', () => {
  it('formata numero em reais no padrao pt-BR', () => {
    expect(formatCurrencyBRL(10622.5)).toBe('R$ 10.622,50');
  });

  it('aceita string numerica (como vem da API)', () => {
    expect(formatCurrencyBRL('9607.28')).toBe('R$ 9.607,28');
  });

  it('formata zero corretamente', () => {
    expect(formatCurrencyBRL(0)).toBe('R$ 0,00');
  });
});

describe('formatBtc', () => {
  it('formata com 8 casas decimais e sufixo BTC', () => {
    expect(formatBtc('0.0025')).toBe('0,00250000 BTC');
  });

  it('aceita numero', () => {
    expect(formatBtc(0.002330229)).toBe('0,00233023 BTC');
  });

  it('trunca/arredonda para 8 casas sem sobrar digitos', () => {
    expect(formatBtc(0)).toBe('0,00000000 BTC');
  });
});

describe('formatCentsToDecimalDisplay', () => {
  it('trata string vazia como zero', () => {
    expect(formatCentsToDecimalDisplay('')).toBe('0,00');
  });

  it('interpreta os digitos como centavos, estilo calculadora', () => {
    expect(formatCentsToDecimalDisplay('1')).toBe('0,01');
    expect(formatCentsToDecimalDisplay('12')).toBe('0,12');
    expect(formatCentsToDecimalDisplay('123')).toBe('1,23');
  });

  it('aplica separador de milhar', () => {
    expect(formatCentsToDecimalDisplay('100000')).toBe('1.000,00');
  });

  it('ignora caracteres nao numericos', () => {
    expect(formatCentsToDecimalDisplay('1a2b3')).toBe('1,23');
  });
});

describe('sanitizeDecimalInput', () => {
  it('mantem digitos e uma virgula', () => {
    expect(sanitizeDecimalInput('0,0025')).toBe('0,0025');
  });

  it('remove letras e simbolos', () => {
    expect(sanitizeDecimalInput('R$0,0025abc')).toBe('0,0025');
  });

  it('limita a 8 casas decimais depois da virgula', () => {
    expect(sanitizeDecimalInput('0,123456789999')).toBe('0,12345678');
  });

  it('sem virgula, devolve so os digitos', () => {
    expect(sanitizeDecimalInput('123')).toBe('123');
  });

  it('limita a parte inteira a 6 digitos, pra nao estourar o layout do input', () => {
    expect(sanitizeDecimalInput('8558886588588')).toBe('855888');
  });

  it('limita a parte inteira mesmo com casas decimais digitadas', () => {
    expect(sanitizeDecimalInput('12345678,9')).toBe('123456,9');
  });
});

describe('formatTransactionDate', () => {
  const REAL_DATE = Date;

  function mockNow(isoNow: string) {
    const fixedNow = new REAL_DATE(isoNow);
    class MockDate extends REAL_DATE {
      constructor(...args: unknown[]) {
        super();
        if (args.length === 0) {
          this.setTime(fixedNow.getTime());
        } else {
          this.setTime(
            new REAL_DATE(...(args as ConstructorParameters<typeof REAL_DATE>)).getTime()
          );
        }
      }
    }
    global.Date = MockDate as unknown as DateConstructor;
  }

  afterEach(() => {
    global.Date = REAL_DATE;
  });

  it('mostra "Hoje" quando a data e do mesmo dia', () => {
    mockNow('2026-08-23T15:00:00Z');
    expect(formatTransactionDate('2026-08-23T10:42:00Z')).toMatch(/^Hoje, \d{2}:\d{2}$/);
  });

  it('mostra "Ontem" quando a data e do dia anterior', () => {
    mockNow('2026-08-23T15:00:00Z');
    expect(formatTransactionDate('2026-08-22T16:20:00Z')).toMatch(/^Ontem, \d{2}:\d{2}$/);
  });

  it('mostra dia e mes quando a data e mais antiga', () => {
    mockNow('2026-08-23T15:00:00Z');
    const result = formatTransactionDate('2026-08-19T09:15:00Z');
    expect(result).not.toMatch(/^Hoje/);
    expect(result).not.toMatch(/^Ontem/);
    expect(result).toMatch(/\d{2}:\d{2}$/);
  });
});
