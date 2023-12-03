/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  async function getAssets() {
    return await fetch('/api/assets').then((d) => d.json())
  }
  async function getBTCapi() {
    return await fetch('https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT').then((d) => d.json())
  }

  return {
    assets: getAssets(),
    BTCapi: getBTCapi(),
  }
}
