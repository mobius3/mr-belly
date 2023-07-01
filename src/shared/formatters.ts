abstract class Formatter {
  readonly info: { thousandsSeparator: string; decimalSeparator: string; maximumFractionDigits: number }
  protected constructor(private formatter: Intl.NumberFormat) {
    const parts = formatter.formatToParts(1000.5)
    const options = formatter.resolvedOptions()
    this.info = {
      thousandsSeparator: parts.find((part) => part.type == 'group')!.value,
      decimalSeparator: parts.find((part) => part.type == 'decimal')!.value,
      maximumFractionDigits: options.maximumFractionDigits,
    }
  }

  static number(localeId: string): Formatter {
    return new NumberFormatter(localeId)
  }

  static currency(localeId: string, currency: string): Formatter {
    return new CurrencyFormatter(localeId, currency)
  }

  public format(value: number): string {
    return this.formatter.format(value)
  }
}

class NumberFormatter extends Formatter {
  constructor(private localeId: string) {
    const formatter = Intl.NumberFormat(localeId)
    super(formatter)
  }
}

class CurrencyFormatter extends Formatter {
  constructor(private localeId: string, private currency: string) {
    const formatter = Intl.NumberFormat(localeId, { style: 'currency', currency })
    super(formatter)
  }
}

export { Formatter }
