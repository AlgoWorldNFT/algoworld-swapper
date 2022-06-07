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
class SwapQueryParams:
    creator_address: str
    offered_asa_id: int
    offered_asa_amount: int
    requested_asa_id: int
    requested_asa_amount: int


def compileSwap(inputParams: SwapQueryParams):

    swapper = contracts.get_swapper_teal(
        inputParams.creator_address,
        inputParams.offered_asa_id,
        inputParams.offered_asa_amount,
        inputParams.requested_asa_id,
        inputParams.requested_asa_amount,
        INCENTIVE_WALLET,
        INCENTIVE_FEE,
    )

    response = algod.compile(swapper)
    return response


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        s = self.path

        raw_params = dict(parse.parse_qsl(parse.urlsplit(s).query))

        params = SwapQueryParams(
            **{
                "creator_address": raw_params["creator_address"],
                "offered_asa_id": int(raw_params["offered_asa_id"]),
                "offered_asa_amount": int(raw_params["offered_asa_amount"]),
                "requested_asa_id": int(raw_params["requested_asa_id"]),
                "requested_asa_amount": int(raw_params["requested_asa_amount"]),
            }
        )

        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()

        response = json.dumps(compileSwap(params))
        print(response)
        self.wfile.write(response.encode())
        return
