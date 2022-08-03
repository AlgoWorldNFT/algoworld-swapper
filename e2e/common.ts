export const AW_SWAPPER_BASE_URL =
  process.env.E2E_TESTS_BASE_URL ?? `http://localhost:3000`;

export const BOB_ADDRESS = `YYO24YP3BGCOB2QYZFSU6OOEMLWH6BYP4D5VTMYJFX5TC4UNJV6QBHCYIQ`;
export const ALICE_ADDRESS = `DOGEWXLAK4PEY2B47W45IZIDFOOYDGDE3KQDTHJUHN42KLQGCRAAZEYEKQ`;

export function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
