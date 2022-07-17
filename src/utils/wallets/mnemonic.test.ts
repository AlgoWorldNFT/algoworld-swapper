import MnemonicClient from '@/utils/wallets/mnemonic';
import { generateAccount, secretKeyToMnemonic } from 'algosdk';

describe(`MnemonicClient`, () => {
  it(`Initializes and disconnects correctly`, async () => {
    const dummyAccount = generateAccount();
    const johnyMnemonicsPhrase = secretKeyToMnemonic(dummyAccount.sk);
    const johnyMnemonic = new MnemonicClient(johnyMnemonicsPhrase);

    expect(johnyMnemonic.connected()).toBe(false);

    await johnyMnemonic.connect();
    expect(johnyMnemonic.connected()).toBe(true);

    expect(johnyMnemonic.address()).toEqual(dummyAccount.addr);

    await johnyMnemonic.disconnect();
    expect(johnyMnemonic.connected()).toBe(false);
  });
});
