from algosdk.v2client.algod import AlgodClient

INCENTIVE_WALLET = "RJVRGSPGSPOG7W3V7IMZZ2BAYCABW3YC5MWGKEOPAEEI5ZK5J2GSF6Y26A"
INCENTIVE_FEE = 500_000

ALGOD_URL = "https://node.algoexplorerapi.io"
TESTNET_ALGOD_URL = "https://node.testnet.algoexplorerapi.io"

algod = AlgodClient("", ALGOD_URL, headers={"User-Agent": "algosdk"})
testnet_algod = AlgodClient("", TESTNET_ALGOD_URL, headers={"User-Agent": "algosdk"})


def get_algod(chain_type: str):
    return testnet_algod if chain_type.lower() == "testnet" else algod
