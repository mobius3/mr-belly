import { format as dateFnsFormat, Locale as DateFnsLocale, parseISO } from 'date-fns'
import { localeId } from './locale'
import { enUS, ptBR } from 'date-fns/locale'

const dateLocales: { [l: string]: DateFnsLocale } = {
  'en-US': enUS,
  'pt-BR': ptBR,
}

const dateLocale = dateLocales[localeId] || dateLocales['en-US']

const dateFormat = (dateStr: string, format = 'P', locale = dateLocale): string => {
  return dateFnsFormat(parseISO(dateStr), format, { locale })
}

export { dateLocale, dateFormat }
