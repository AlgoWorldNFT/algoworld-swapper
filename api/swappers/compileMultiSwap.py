from cgi import parse_header, parse_multipart
import json
import os
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler
from urllib import parse

from algosdk.v2client.algod import AlgodClient
from algosdk.v2client.indexer import IndexerClient
from algoworld_contracts import contracts

CHAIN_TYPE = os.environ.get("CHAIN_TYPE", "TestNet")
INDEXER_URL = (
    "https://algoindexer.testnet.algoexplorerapi.io"
    if CHAIN_TYPE.lower() == "testnet"
    else "https://algoindexer.algoexplorerapi.io"
)
ALGOD_URL = (
    "https://node.testnet.algoexplorerapi.io"
    if CHAIN_TYPE.lower() == "testnet"
    else "https://node.algoexplorerapi.io"
)
INCENTIVE_WALLET = "RJVRGSPGSPOG7W3V7IMZZ2BAYCABW3YC5MWGKEOPAEEI5ZK5J2GSF6Y26A"
INCENTIVE_FEE = 500_000

algod = AlgodClient("", ALGOD_URL, headers={"User-Agent": "algosdk"})
indexer = IndexerClient("", INDEXER_URL, headers={"User-Agent": "algosdk"})


@dataclass
class SwapConfig:
    creator_address: str
    offered_asa_amounts: dict
    requested_algo_amount: int
    max_fee: int
    optin_funding_amount: int


def compileMultiSwap(inputParams: SwapConfig):

    swapper = contracts.get_multi_swapper_teal(
        inputParams.creator_address,
        inputParams.offered_asa_amounts,
        inputParams.requested_algo_amount,
        inputParams.max_fee,
        inputParams.optin_funding_amount,
        INCENTIVE_WALLET,
        INCENTIVE_FEE,
    )

    response = algod.compile(swapper)
    return response


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_len = int(self.headers["Content-Length"])
        post_body = json.loads(self.rfile.read(content_len))

        params = SwapConfig(
            **{
                "creator_address": post_body["creator_address"],
                "offered_asa_amounts": post_body["offered_asa_amounts"],
                "requested_algo_amount": post_body["requested_algo_amount"],
                "max_fee": post_body["max_fee"],
                "optin_funding_amount": post_body["optin_funding_amount"],
            }
        )

        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()

        print(params)
        response = json.dumps(compileMultiSwap(params))

        self.wfile.write(response.encode())
        return
