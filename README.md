# Ammora Product UI

Frontend-only redesign of Ammora’s functional product experience. The product is organized around user actions—Trade, Liquidity, Launch, and Portfolio—and presented through a shared, accessibility-minded light/dark design system.

## Preview routes

- `#/swap`
- `#/explore`
- `#/pool/eth-usdc`
- `#/portfolio`
- `#/fees`
- `#/create`
- `#/launch`
- `#/launch/eth` (selected ETH / GIWA launch market detail)
- `#/currencies`

## Design system

Foundations and component usage are documented in [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md). Tokens live in `src/design-system/tokens.css` and shared React primitives live in `src/design-system/index.jsx`.

Frontend-only Ammora protocol interface, built with React and Vite.

## Run locally

```bash
npm install
npm run dev
```

Run `npm run build` to create the production bundle and `node scripts/build_share_preview.mjs` to create the self-contained external preview.
