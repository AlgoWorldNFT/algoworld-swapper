import { LogicSigAccount } from 'algosdk';

export const getLogicSign = (compiledContract: string) => {
  const program = new Uint8Array(Buffer.from(compiledContract, `base64`));
  return new LogicSigAccount(program, []);
};
