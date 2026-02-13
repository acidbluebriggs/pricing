// this is for things that have no variable costs
// or when things are above the max variable cost (the default)
const DEFAULT_PRICE_HOLDER = 1000000

// incoming attributes to bind to handlers
const BEER_KEGS = 'beerKegs'
const BEER_CANS = 'beerCans'
const WINE_BOTTLES = 'wineBottles'
const WINE_KEGS = 'wineKegs'

const ERROR = 'error'

//
// "Components"
//

function Calculation(pricing, units) {
  return `<div class="formula">
            <table>
            <tr>
              <td>Retail:</td>
              <td>($${pricing.invoicePrice} / ${pricing.divisor} ${units}) / ${pricing.markup} = $${pricing.price}</td>
            </tr>
            <tr>
              <td>Cost:</td>
              <td>$${pricing.invoicePrice} / ${pricing.divisor} ${units} = $${pricing.costPerUnitPrice}</td>
            </tr>
            </table>
          </div>`
}

function BeerKegCalculation(pour, draft) {
  return `8 oz: $${pour.adjusted}
    ${Calculation(pour, "pours")}
    <hr />
    32 oz: $${draft.adjusted}
    ${Calculation(draft, "drafts")}`
}

function BeerCanCalculation(pricing) {
  return `Can: $${pricing.adjusted}
         ${Calculation(pricing, "cans")}`
}

function WinBottleCalculation(pricing) {
  return `Bottle: $${pricing.adjusted} ${Calculation(pricing, "bottles")}`
}

function WineKegCalculation(pour, draft) {
  return `6 oz: $${pour.adjusted}
    ${Calculation(pour, "pours")}
    <hr />
    32 oz: $${draft.adjusted}
    ${Calculation(draft, "drafts")}`
}

function ErrorMessage(message) {
  return `<span class="error">${message}</span>`
}

//
// View Handlers
//

function handleBeerKegs(invoicePrice) {
  if (!invoicePrice) return ''
  const kegSize = document.querySelector('input[name="kegSize"]:checked')?.value
  const pour = buildPricing(formulas["pour_" + kegSize], invoicePrice)
  const draft = buildPricing(formulas["draft_" + kegSize], invoicePrice)

  return BeerKegCalculation(pour, draft);
}

function handleBeerCans(invoicePrice) {
  let canCount = document.querySelector('input[name="canCount"]:checked')?.value
  if (canCount === "other") {
    canCount = parseInt(document.getElementById("customCanCount").value)
  } else {
    canCount = parseInt(canCount)
  }

  if (!canCount || isNaN(canCount)) {
    return ErrorMessage("Please enter a valid number of cans");
  }

  //cheating because we're modifying the divisor
  formulas["can"].divisor = canCount
  const pricing = buildPricing(formulas["can"], invoicePrice)

  return BeerCanCalculation(pricing);
}

function toggleCanCountInput(element) {
  document.getElementById("customCanCount").style.display = element.value === "other" ? "block" : "none"
  document.getElementById("beerCanResetButton").style.display = element.value === "other" ? "block" : "none"
}

function handleWineBottles(invoicePrice) {
  const bottleCount = parseInt(document.getElementById("wineBottleCount").value)
  if (!bottleCount || isNaN(bottleCount)) {
    return "Enter a valid number of wine bottles."
  }
  //cheating because we're modifying the divisor
  formulas["wine_bottle"].divisor = bottleCount
  const pricing = buildPricing(formulas["wine_bottle"], invoicePrice)

  return WinBottleCalculation(pricing);
}

function handleWineKegs(invoicePrice) {
  const draft = buildPricing(formulas["draft_wine"], invoicePrice)
  const pour = buildPricing(formulas["pour_wine"], invoicePrice)
  return WineKegCalculation(pour, draft);
}

function handleError(msg) {
  return ErrorMessage(msg)
}

function resetInvoicePrice() {
  priceInput().value = ''
  clearResult()
}

function resetWineBottleCount() {
  document.getElementById('wineBottleCount').value = ''
  clearResult()
}

function resetBeerCanCount() {
  document.getElementById('customCanCount').value = ''
  clearResult()
}

function clearResult() {
  document.getElementById('result').textContent = ''
}

const handlers = {
  [BEER_KEGS]: handleBeerKegs,
  [BEER_CANS]: handleBeerCans,
  [WINE_BOTTLES]: handleWineBottles,
  [WINE_KEGS]: handleWineKegs,
  [ERROR]: handleError,
};

function showOptions() {
  const sourceType = document.querySelector('input[name="sourceType"]:checked')?.value
  document.getElementById("beerKegOptions").style.display = sourceType === BEER_KEGS ? "block" : "none"
  document.getElementById("beerCanOptions").style.display = sourceType === BEER_CANS ? "block" : "none"
  document.getElementById("wineBottleOptions").style.display = sourceType === WINE_BOTTLES ? "block" : "none"
  update()
}

function displayPrice() {
  const invoicePrice = parseFloat(document.getElementById("priceInput").value).toFixed(2)
  const sourceType = document.querySelector('input[name="sourceType"]:checked')?.value
  const resultDiv = document.getElementById("result")
  const handler = handlers[sourceType]

  resultDiv.innerHTML = handler ? handlers[sourceType](invoicePrice) : resultDiv.innerText = '';
}


function resetForm() {
  document.getElementById('priceInput').value = ''
  const radios = document.querySelectorAll('input[type="radio"]')
  radios.forEach(radio => radio.checked = false)
  document.getElementById('beerKegOptions').style.display = 'none'
  document.getElementById('beerCanOptions').style.display = 'none'
  document.getElementById('wineBottleOptions').style.display = 'none'
  document.getElementById('customCanCount').style.display = 'none'
  document.getElementById('beerCanResetButton').style.display = 'none'
  document.getElementById('customCanCount').value = 1
  document.getElementById('wineBottleCount').value = 1
  document.getElementById('result').textContent = ''
  canCalculate()
}

function priceInput() {
  return document.getElementById("priceInput")
}

function canCalculate() {
  const price = parseFloat(document.getElementById("priceInput").value)
  const sourceType = document.querySelector('input[name="sourceType"]:checked')?.value
  let isValid = price && sourceType

  if (sourceType === BEER_KEGS) {
    const kegSize = document.querySelector('input[name="kegSize"]:checked')?.value
    isValid = isValid && kegSize
  } else if (sourceType === BEER_CANS) {
    const canCount = document.querySelector('input[name="canCount"]:checked')?.value
    if (canCount === "other") {
      const customCount = parseInt(document.getElementById("customCanCount").value)
      isValid = isValid && customCount && !isNaN(customCount)
    } else {
      isValid = isValid && canCount
    }
  } else if (sourceType === WINE_BOTTLES) {
    const bottleCount = parseInt(document.getElementById("wineBottleCount").value)
    isValid = isValid && bottleCount && !isNaN(bottleCount)
  }

  return isValid
}


function buildPricing(formula, invoicePrice) {
  const calc = formula.ranges.find(i => i.price > invoicePrice)
  const divisor = formula.divisor
  const markup = calc.markup
  const price = ((invoicePrice / formula.divisor) / markup).toFixed(2)
  const adjusted = formula.adjusted(price)
  const costPerUnitPrice = (invoicePrice / divisor).toFixed(2)
  return ({
    divisor,
    markup,
    price,
    adjusted,
    invoicePrice,
    costPerUnitPrice,
  })
}

function update() {
  if (canCalculate()) {
    displayPrice()
    return
  }

  document.getElementById("result").textContent = ''
}

function formatPriceInput(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length > 6) {
    value = value.slice(0, 6);
  }

  if (value.length === 0) {
    input.value = '';
    return;
  }

  value = value.padStart(3, '0');
  const dollars = value.slice(0, -2);
  const cents = value.slice(-2);
  input.value = `${parseInt(dollars)}.${cents}`;
}

function debugSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      console.log('SW Registrations:', regs.length);
      regs.forEach(reg => console.log('SW:', reg.scope, reg.active?.state));
    });
    caches.keys().then(names => {
      console.log('Caches:', names);
      names.forEach(name => {
        caches.open(name).then(cache => {
          cache.keys().then(keys => {
            console.log(`"${name}" has ${keys.length} items`);
          });
        });
      });
    });
  }
}

function settings() {
  let table = '<table id="settingsTable"><tr><th>Container</th><th>Units</th><th>Ranges</th></tr>'

  let section = ''

  for (const [_, entry] of Object.entries(formulas)) {
    const ranges = entry.ranges.map((r, i) => {
      if (r.price === DEFAULT_PRICE_HOLDER) {
        if (i > 0 && i === entry.ranges.length - 1) {
          return `>= $${entry.ranges[i - 1].price}: ${r.markup.toFixed(2)}`
        } else {
          return `${r.markup.toFixed(2)}`
        }
      } else {
        return `&nbsp< $${r.price}: ${r.markup.toFixed(2)}`
      }
    }).join('<br>')

    if (section !== `${entry.category} - ${entry.system}`) {
      section = `${entry.category} - ${entry.system}`
      table += `<tr class="section-header"><td colspan="3">${section}</td></tr>`
    }

    table += `<tr><td>${entry.description}</td><td>${entry.divisor}</td><td>${ranges}</td></tr>`
  }

  table += '</table>'
  return table
}

function showPricingSchedule() {
  document.getElementById('settingsTable').innerHTML = settings()
  document.getElementById('settingsModal').style.display = 'block'
}

function hidePricingSchedule() {
  document.getElementById('settingsModal').style.display = 'none'
}

window.addEventListener('load', resetForm)
