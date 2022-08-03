<p align="center"><img  width=100%  src="https://imgur.com/Sv4A6cq.png"  alt="687474703a2f2f6936332e74696e797069632e636f6d2f333031336c67342e706e67"  border="0" /></p>

## Serverless Functions

The following folder is hosting a set of serverless functions used by the swapper. Vercel allows using multiple runtime environments hence:

1. `swaps` - contains `python` functions that execute `pyteal` code and compile stateless contracts against required `algod` instance.
2. `storage` - a simple function that works with `POST` calls and stores `SwapperConfiguration` objects on ipfs.

### Further notes

Dependencies for `storage` functions are not listed in subfolder because they are inherited from root `package.json` file.
Dependencies for `swaps` are listed in `requirements.txt` and simply fetch latest `algoworld-contracts` version via release tag.
