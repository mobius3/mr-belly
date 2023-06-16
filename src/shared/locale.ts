const defaultLocaleId = navigator.languages ? navigator.languages[0] : navigator.language

class Formatter {
  readonly info: { thousandsSeparator: string; decimalSeparator: string; maximumFractionDigits: number }
  private formatter: Intl.NumberFormat

  constructor(private localeId: string) {
    const formatter = Intl.NumberFormat(localeId)
    const parts = formatter.formatToParts(1000.5)
    const options = formatter.resolvedOptions()
    this.info = {
      thousandsSeparator: parts.find((part) => part.type == 'group')!.value,
      decimalSeparator: parts.find((part) => part.type == 'decimal')!.value,
      maximumFractionDigits: options.maximumFractionDigits,
    }
    this.formatter = formatter
  }

  number(value: number) {
    return
  }

  currency(value: number, currency: string) {}
}

export { defaultLocaleId as localeId }
