# Ammora reference feature inventory

This prototype maps the publicly exposed product surface of the deployed Ammora reference app into an action-led information architecture. The audit was performed against the live site and its public release-policy payload on 2026-09-07.

## Navigation mapping

| Reference surface | Prototype location | User job |
| --- | --- | --- |
| Explore / Pools | Liquidity | Discover and compare pools |
| Swap | Trade | Quote and execute exact-input swaps |
| Create | Liquidity → Create pool | Create immediate or scheduled liquidity |
| Launch | Launch | Discover, create, trade, and graduate markets |
| Portfolio | Portfolio → Liquidity | Manage positions, orders, rewards, and history |
| Revenue | Portfolio → Revenue | Claim creator, referral, and partner revenue |
| Fees | Portfolio → Revenue sharing | Create, fund, and claim fee vaults |
| Currencies | More → Token directory | Inspect tokens, deployments, and markets |

## Implemented public functions

- Pool discovery: strategy, saved, time-window, and sort controls; pool detail navigation.
- Aggregated swap: token selection, exact input, best/direct routing, slippage, deadline, approval separation, quote protection, and session history.
- Pool detail: overview, range editing, add liquidity, activity categories, positions, alerts, save, limit orders, rewards, Zap, fee/operator controls, and protocol-fee claim review.
- Pool creation: independent Quick and Advanced journeys. Quick uses reviewed outcome defaults. Advanced ALMM includes token order, opening price, four price-spacing models, immediate/scheduled activation, fee details, and the explicit pool-deployment → opening-liquidity sequence. Advanced ARL includes dual/single-sided funding, amounts, exact price range, static/scheduled/dynamic fee schedules, fee collection, activation, and atomic pool + opening-position creation.
- Launch discovery and creation: status filters, persistent watched-market collection, image and metadata fields, reviewed presets, first buy, scheduled activation, economics review, and lifecycle.
- Launch market: price chart, buy/sell, holders, onchain market information, graduation, surplus claim, leftover withdrawal, and creator transfer.
- Portfolio: ALMM/ARL positions, limit orders, activity, position performance/cash flow, add/remove/claim, merge, lock, delegate, rewards, saved pools, alerts, and creator workspace.
- Revenue sharing: aggregate claims, immutable 2–5 recipient fee-vault builder, funding sources/history, and recipient claims.
- Token directory: searchable catalog, stablecoin grouping, pagination affordance, token detail, deployment verification, and related markets.

## Release boundaries

Hidden or experimental surfaces in the reference runtime (for example NFT and unreleased extended modules) are not promoted into primary navigation. Contract or SDK presence does not imply a released end-user product. Technical identifiers such as ALMM, ARL, ALC, runtime hashes, dynamic-fee controls, and raw addresses remain supporting information or advanced disclosure.

## Prototype behavior

All wallet and transaction operations are interactive review simulations. No real assets are moved. Every write action ends at a wallet-review state showing network, target context, safety checks, and user-controlled confirmation.

Pool creation, launch creation, swaps, liquidity positions, fee-vault creation, claims, alerts, position tools, and creator actions all expose this normal review path. Shared dropdown and upload controls avoid browser- or operating-system-specific presentation.
