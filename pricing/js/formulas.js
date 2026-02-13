const adjusted = (price) => (Math.ceil(price * 4) / 4).toFixed(2);

const formulas = {
  "draft_1/2_barrel": {
    category: "Beer",
    system: "Draft",
    description: "1/2 | 15.5",
    divisor: 56,
    ranges: [
      {price: 150, markup: .32},
      {price: 300, markup: .38},
      {price: DEFAULT_PRICE_HOLDER, markup: .45},
    ],
    adjusted,
  },
  "draft_50L": {
    category: "Beer",
    system: "Draft",
    description: "50 L",
    divisor: 46,
    ranges: [
      {price: DEFAULT_PRICE_HOLDER, markup: .30},
    ],
    adjusted,
  },
  "draft_1/4_barrel": {
    category: "Beer",
    system: "Draft",
    description: '1/4 | 7.75 | 30 L',
    divisor: 28,
    ranges: [
      {price: DEFAULT_PRICE_HOLDER, markup: .32}
    ],
    adjusted,
  },
  "draft_1/6_barrel": {
    category: "Beer",
    system: "Draft",
    description: "1/6 | 5.16 | 20 L",
    divisor: 18,
    ranges: [
      {price: 70, markup: .42},
      {price: 200, markup: .48},
      {price: 250, markup: .51},
      {price: DEFAULT_PRICE_HOLDER, markup: .55},
    ],
    adjusted,
  },
  "pour_1/2_barrel": {
    category: "Beer",
    system: "Pours",
    description: "1/2 | 15.5",
    divisor: 248,
    ranges: [
      {price: 300, markup: .20},
      {price: 400, markup: .22},
      {price: DEFAULT_PRICE_HOLDER, markup: .24},
    ],
    adjusted,
  },
  "pour_50L": {
    category: "Beer",
    system: "Pours",
    description: '50 L',
    divisor: 211,
    ranges: [
      {price: DEFAULT_PRICE_HOLDER, markup: .20},
    ],
    adjusted,
  },
  "pour_1/4_barrel": {
    category: "Beer",
    system: "Pours",
    description: "1/4 | 7.75 | 30 L",
    divisor: 124,
    ranges: [
      {price: DEFAULT_PRICE_HOLDER, markup: .23}
    ],
    adjusted,
  },
  "pour_1/6_barrel": {
    description: "1/6 | 5.16 | 20 L",
    category: "Beer",
    system: "Pours",
    divisor: 82,
    ranges: [
      {price: 100, markup: .26},
      {price: 150, markup: .27},
      {price: 200, markup: .30},
      {price: 250, markup: .32},
      {price: DEFAULT_PRICE_HOLDER, markup: .34},
    ],
    adjusted,
  },
  "can": {
    category: "Beer",
    system: "To Go",
    description: "Can",
    divisor: 1,
    ranges: [
      {price: DEFAULT_PRICE_HOLDER, markup: .70},
    ],
    adjusted: (price) => (Math.round(price * 4) / 4).toFixed(2),
  },
  "draft_wine": {
    category: "Wine",
    system: "Draft",
    description: "32 oz",
    divisor: 18,
    ranges: [
      {price: DEFAULT_PRICE_HOLDER, markup: .45},
    ],
    adjusted,
  },
  "pour_wine": {
    category: "Wine",
    system: "Pour",
    description: "6 oz",
    divisor: 105,
    ranges: [
      {price: DEFAULT_PRICE_HOLDER, markup: .33},
    ],
    adjusted,
  },
  "wine_bottle": {
    category: "Wine",
    system: "To Go",
    description: "Bottle",
    divisor: 1,
    ranges: [
      {price: DEFAULT_PRICE_HOLDER, markup: .73}
    ],
    adjusted,
  }
}
