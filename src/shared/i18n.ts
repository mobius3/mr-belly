import CurrencyList from 'currency-list'

const currenciesByLocale = CurrencyList.getAll()
const availableLocales = Object.keys(currenciesByLocale).map((k) => k.replace('_', '-'))

class I18n {
  constructor(private localeId: string) {}

  currency(currencyCode: string): Currency {
    return new Currency(this.localeId, currencyCode)
  }
}

class Currency {
  constructor(private localeId: string, private currencyCode: string) {}
}
