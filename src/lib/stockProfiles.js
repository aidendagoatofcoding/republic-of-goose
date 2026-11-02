// Company dossiers for the Honkton Exchange. Static lore, prices come from the market.

export const STOCK_PROFILES = {
  BRD: {
    sector: 'Consumer Staples',
    founded: 1804,
    hq: 'Old Bank',
    ceo: 'Margery Crumb',
    employees: 4200,
    dividend: '2.4%',
    risk: 'Low',
    sharesOutstanding: 1800000,
    summary:
      'The oldest bakery house in the Republic, Bread Holdings supplies the national loaf and every crumb of the citizen wage. Its river mills turn night and day, and no government has ever dared tax it twice.',
    highlights: [
      'Operates 41 state bakeries and the Bread Vault reserve',
      'Contractually paid first from every citizen wage',
      'Legendary for never missing a morning delivery',
    ],
  },
  HONK: {
    sector: 'Communications',
    founded: 1891,
    hq: 'The Shallows',
    ceo: 'Percy Loudhail',
    employees: 9100,
    dividend: '1.1%',
    risk: 'Medium',
    sharesOutstanding: 2400000,
    summary:
      'Honkish Telecom runs the national horn network — every HONK that crosses a district passes through its towers. Subscriptions rise each winter when the geese have more to say.',
    highlights: [
      'Owns the trans-meadow horn relay chain',
      'Bundles HONKISH translation minutes with every plan',
      'Faces periodic regulatory noise complaints from the pond',
    ],
  },
  FTHR: {
    sector: 'Textiles & Luxury',
    founded: 1932,
    hq: 'North Nest',
    ceo: 'Ilse Down',
    employees: 1800,
    dividend: '0.0%',
    risk: 'High',
    sharesOutstanding: 900000,
    summary:
      'Feather & Wing makes the ceremonial capes, scarves and crowns worn by citizens of standing. Small, volatile and fashionable: a single season of bad taste can sink the share price.',
    highlights: [
      'Official outfitter to the Master Goose',
      'Limited-edition winter collections sell out in hours',
      'Profits swing with ceremonial season',
    ],
  },
  POND: {
    sector: 'Real Estate',
    founded: 1848,
    hq: 'The Shallows',
    ceo: 'Oda Bankwater',
    employees: 2600,
    dividend: '3.6%',
    risk: 'Low',
    sharesOutstanding: 1200000,
    summary:
      'Pond Realty leases the waterfront plots where the finest villas stand. Land in the Shallows is finite, so the trust simply collects rent and waits for the water to do the rest.',
    highlights: [
      'Holds the freehold on 68% of pond frontage',
      'Steady rent rolls, dull by design',
      'Recently expanded into reed bungalow developments',
    ],
  },
  DUCK: {
    sector: 'Defence',
    founded: 1966,
    hq: 'Old Bank',
    ceo: 'Colonel Drake Mallard',
    employees: 5400,
    dividend: '0.8%',
    risk: 'Very high',
    sharesOutstanding: 700000,
    summary:
      'Duck Defence Systems guards the northern border, the southern border, and occasionally the border it invented last Tuesday. A single procurement rumour moves the price by double digits.',
    highlights: [
      'Sole supplier of the National Alarm Horn',
      'Contract renewals decided by the Assembly each spring',
      'Highest volatility listing on the exchange',
    ],
  },
  MIGR: {
    sector: 'Transport',
    founded: 1954,
    hq: 'The Shallows',
    ceo: 'Wren Farflight',
    employees: 7300,
    dividend: '1.9%',
    risk: 'Medium',
    sharesOutstanding: 1600000,
    summary:
      'Migration Airways flies the seasonal routes south each autumn, carrying citizens who prefer warmer ponds. Revenue is famously seasonal and famously punctual.',
    highlights: [
      'Holds the national autumn corridor licence',
      'Fleet of 90 long-wing carriers',
      'Quietly profitable eleven months a year',
    ],
  },
  NEST: {
    sector: 'Construction',
    founded: 1907,
    hq: 'North Nest',
    ceo: 'Bramble Twigg',
    employees: 3900,
    dividend: '2.1%',
    risk: 'Medium',
    sharesOutstanding: 1100000,
    summary:
      'Nest & Twig builds homes for every citizen who saves enough bread — cottages, manors and the occasional sky nest. Order books rise whenever the shop launches a new roof colour.',
    highlights: [
      'Built 12,000 nests since nationalisation',
      'Supplies timber to the Commons rebuilding fund',
      'Earnings track e-shop home sales',
    ],
  },
};

export function profileFor(symbol) {
  return (
    STOCK_PROFILES[symbol] || {
      sector: 'Unlisted',
      founded: 2000,
      hq: 'Honkton',
      ceo: 'The Assembly',
      employees: 0,
      dividend: '0.0%',
      risk: 'Unknown',
      sharesOutstanding: 1000000,
      summary: 'No dossier has been filed for this listing with the exchange registry.',
      highlights: [],
    }
  );
}