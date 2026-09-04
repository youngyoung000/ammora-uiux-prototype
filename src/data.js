export const pools = [
  { pair: 'ETH / USDC', first: ['◆', '#6670dd'], second: ['U', '#2775ca'], type: 'ALMM', fee: '0.05%', tvl: '$12.84M', volume: '$28.43M', fees: '$14.2K', apr: '18.42%', trend: [22, 26, 24, 32, 29, 38, 41, 46, 44, 53] },
  { pair: 'WBTC / ETH', first: ['₿', '#f7931a'], second: ['◆', '#6670dd'], type: 'ALMM', fee: '0.30%', tvl: '$9.42M', volume: '$18.72M', fees: '$56.2K', apr: '24.18%', trend: [18, 20, 24, 22, 28, 31, 29, 35, 39, 42] },
  { pair: 'GIWA / USDC', first: ['G', '#171923'], second: ['U', '#2775ca'], type: 'ARL', fee: '0.05%', tvl: '$7.16M', volume: '$11.24M', fees: '$5.6K', apr: '31.06%', trend: [12, 16, 15, 22, 28, 26, 35, 42, 47, 55] },
  { pair: 'USDT / USDC', first: ['U', '#26a17b'], second: ['U', '#2775ca'], type: 'ALMM', fee: '0.01%', tvl: '$5.62M', volume: '$7.45M', fees: '$0.7K', apr: '6.92%', trend: [33, 32, 31, 32, 30, 29, 30, 28, 27, 28] },
  { pair: 'ARB / USDC', first: ['A', '#38445a'], second: ['U', '#2775ca'], type: 'ALMM', fee: '0.30%', tvl: '$3.25M', volume: '$4.86M', fees: '$14.6K', apr: '12.82%', trend: [46, 43, 45, 39, 36, 38, 33, 31, 28, 29] },
  { pair: 'LINK / ETH', first: ['L', '#2a5ada'], second: ['◆', '#6670dd'], type: 'ARL', fee: '0.30%', tvl: '$2.81M', volume: '$3.74M', fees: '$11.2K', apr: '15.64%', trend: [20, 24, 21, 29, 31, 30, 36, 38, 43, 48] },
]

export const currencies = [
  { symbol: 'USDT', name: 'Tether', chain: 'GIWA', price: '$0.9998', change: '+0.02%', volume: '$53.93B', cap: '$183.31B', liquidity: '$81.31M', holders: '3.02M', color: '#26a17b' },
  { symbol: 'USDC', name: 'USD Coin', chain: 'GIWA', price: '$1.0001', change: '+0.01%', volume: '$16.02B', cap: '$73.63B', liquidity: '$321.92M', holders: '8.45M', color: '#2775ca' },
  { symbol: 'ETH', name: 'Ether', chain: 'GIWA', price: '$4,284.22', change: '+3.21%', volume: '$24.81B', cap: '$517.28B', liquidity: '$842.60M', holders: '12.4M', color: '#6670dd' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', chain: 'GIWA', price: '$108,402', change: '+1.84%', volume: '$1.35B', cap: '$14.19B', liquidity: '$125.25M', holders: '270K', color: '#f7931a' },
  { symbol: 'DAI', name: 'Dai', chain: 'GIWA', price: '$0.9999', change: '-0.01%', volume: '$240.88M', cap: '$4.55B', liquidity: '$62.80M', holders: '689K', color: '#f4b731' },
  { symbol: 'LINK', name: 'Chainlink', chain: 'GIWA', price: '$24.36', change: '+2.09%', volume: '$112.84M', cap: '$15.36B', liquidity: '$38.53M', holders: '412K', color: '#2a5ada' },
]
