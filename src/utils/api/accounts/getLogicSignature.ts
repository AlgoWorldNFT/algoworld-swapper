import { LogicSigAccount } from 'algosdk';

export default function getLogicSign(compiledContract: string) {
  const program = new Uint8Array(Buffer.from(compiledContract, `base64`));
  return new LogicSigAccount(program, []);
}
