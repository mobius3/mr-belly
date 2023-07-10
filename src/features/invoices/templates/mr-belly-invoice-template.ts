import { InvoiceData } from '@/features/invoices/InvoiceData'
import { dateFormat } from '@/shared/date'
import { Formatter } from '@/shared/formatters'

const template = (data: InvoiceData): string => {
  const joinAddress = (entity: InvoiceData['sender'] | InvoiceData['receiver']) => {
    return [entity.addressLine1, entity.addressLine2, entity.city, entity.state, entity.country, entity.zip]
      .filter((v) => !!v)
      .join(', ')
  }

  const mapItems = (data: InvoiceData) => {
    const { items } = data

    return items
      .map(
        (item) => `
          <div class="flex py-2 border-b">
            <div class="flex-none w-48 flex flex-col justify-center">${item.name}</div>
            <div class="flex-grow flex flex-col justify-center">${item.description}</div>
            <div class="flex-none w-10 flex flex-col justify-center">${item.quantity}</div>
            <div class="flex-none w-16 flex flex-col justify-center text-right">${asCurrency(item.price)}</div>
            <div class="flex-none w-20 flex flex-col justify-center text-right">${asCurrency(item.quantity * item.price)}</div>
          </div>
  `
      )
      .join('\n')
  }

  const currencyFormatter = Formatter.currency(data.numberLocale, data.currency)
  const numberFormatter = Formatter.number(data.numberLocale)

  const generateSigningFields = () => {
    switch (data.includeSigningFields) {
      case 'signed-by':
        return `
          <div class="pt-10 flex justify-between w-full gap-10">
            <div class="flex-1">
              <h1 class="text-xs text-gray-500">Signed by</h1>
              <div class="mt-3 font-semibold text-sm border-b border-black text-center">
                &nbsp
              </div>
            </div>
      `
      case 'signed-by-with-signature':
        return `
          <div class="pt-10 flex justify-between w-full gap-10">
            <div class="flex-1">
              <h1 class="text-xs text-gray-500">Signed by</h1>
              <div class="mt-3 font-semibold text-sm border-b border-black text-center">
                &nbsp
              </div>
            </div>
      
            <div class="flex-1">
              <h1 class="text-xs text-gray-500">Signature</h1>
              <div class="mt-3 font-semibold text-sm border-b border-black">
                &nbsp;
              </div>
            </div>
          </div>
      `
      default:
        return ''
    }
  }

  const asCurrency = (value: number) => currencyFormatter.format(value)
  let discountDiv = ''
  if (data.discount > 0) {
    discountDiv = `
          <div class="flex py-2 font-bold">
            <div class="flex-none w-48 flex flex-col justify-center">Discount</div>
            <div class="flex-grow flex flex-col justify-center"></div>
            <div class="flex-none w-10 flex flex-col justify-center"></div>
            <div class="flex-none w-16 flex flex-col justify-center"></div>
            <div class="flex-none w-20 flex flex-col justify-center text-right">-${asCurrency(data.discount)}</div>
          </div>
    `
  }

  const calculatedTax = asCurrency((data.tax / 100) * (data.subtotal - data.discount))
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>Invoice ${data.number}</title>
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <script src="https://cdn.tailwindcss.com"></script>
  <!--  <link href='https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css' rel='stylesheet'>-->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.4.1/paper.css" rel="stylesheet">
  <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

      @page {
          size: A4
      }

      body {
          font-family: Inter, sans-serif;
      }
  </style>
</head>

<body class="A4">
<section class="sheet p-[10mm] flex flex-col justify-between">
  <div>
    <div class="my-4 mx-3">
      <h1 class="text-4xl">Invoice ${data.number}</h1>
      <span class="text-xs">${dateFormat(data.due)}</span>
    </div>

    <!-- from/to header -->
    <div class="mx-3 flex content-between w-full">
      <div class="flex-1">
        <h1 class="-mb-1 text-xs text-gray-500">From</h1>
        <div class="font-semibold text-sm">
          ${data.sender.name}
        </div>
      </div>

      <div class="flex-1">
        <h1 class="-mb-1 text-xs text-gray-500">To</h1>
        <div class="font-semibold text-sm">
          ${data.receiver.name}
        </div>
      </div>
    </div>

    <!-- company content -->

    <div class="flex content-between w-full">
      <div class="mx-3 flex-1" id="from">
        <div class="border-t py-3 border-solid border-gray-300 text-xs leading-relaxed" id="from-information">
          <div>
            ${data.sender.legalIdentifier}
          </div>
          <div>
            ${joinAddress(data.sender)}
          </div>
          <div>
            ${data.sender.email}
          </div>
        </div>
      </div>

      <div class="mx-3 flex-1" id="to">
        <div class="border-t py-3 border-solid border-gray-300 text-xs leading-relaxed" id="to-information">
          <div>
            ${data.receiver.legalIdentifier}
          </div>
          <div>
            ${joinAddress(data.receiver)}
          </div>
          <div>
            ${data.receiver.email}
          </div>
        </div>
      </div>
    </div>

    <!-- items -->
    <div class="mx-3 text-sm py-3">
      <div class="w-full">
        <div>
          <div class="font-semibold flex">
            <div class="flex-none w-48">Item</div>
            <div class="flex-grow">Description</div>
            <div class="flex-none w-10">&times;</div>
            <div class="flex-none w-16 text-right">Price</div>
            <div class="flex-none w-20 text-right">Total</div>
          </div>
        </div>
        <div class="text-xs border-t">
          ${mapItems(data)}

          <div class="flex py-2 font-bold">
            <div class="flex-none w-48 flex flex-col justify-center">Subtotal</div>
            <div class="flex-grow flex flex-col justify-center"></div>
            <div class="flex-none w-10 flex flex-col justify-center"></div>
            <div class="flex-none w-16 flex flex-col justify-center"></div>
            <div class="flex-none w-20 flex flex-col justify-center text-right">${asCurrency(data.subtotal)}</div>
          </div>
      
          ${discountDiv}

          <div class="flex py-2 font-bold">
            <div class="flex-none w-48 flex flex-col justify-center">Tax (${numberFormatter.format(data.tax)} %)</div>
            <div class="flex-grow flex flex-col justify-center"></div>
            <div class="flex-none w-10 flex flex-col justify-center"></div>
            <div class="flex-none w-26 flex flex-col justify-center text-right"></div>
            <div class="flex-none w-20 flex flex-col justify-center text-right">${calculatedTax}</div>
          </div>

          <div class="flex py-2 font-bold text-xl">
            <div class="flex-none w-48 flex flex-col justify-center">Total due</div>
            <div class="flex-grow flex flex-col justify-center"></div>
            <div class="flex-none w-10 flex flex-col justify-center"></div>
            <div class="flex-none w-40 flex flex-col justify-center text-right">${asCurrency(data.total)}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="mx-3">
    <div class="min-h-16 text-sm">
    ${data.notes}
    </div>
    
    ${generateSigningFields()}
  </div>
</section>
</body>
</html>
  `
}

export default template
