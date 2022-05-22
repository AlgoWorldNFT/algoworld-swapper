import json
import os
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler
from urllib import parse

from algosdk.v2client.algod import AlgodClient
from algosdk.v2client.indexer import IndexerClient
from algoworld_contracts import contracts

LEDGER_TYPE = os.environ.get("LEDGER_TYPE", "TestNet")
INDEXER_URL = (
    "https://algoindexer.testnet.algoexplorerapi.io"
    if LEDGER_TYPE.lower() == "testnet"
    else "https://algoindexer.algoexplorerapi.io"
)
ALGOD_URL = (
    "https://node.testnet.algoexplorerapi.io"
    if LEDGER_TYPE.lower() == "testnet"
    else "https://node.algoexplorerapi.io"
)

algod = AlgodClient("", ALGOD_URL, headers={"User-Agent": "algosdk"})
indexer = IndexerClient("", INDEXER_URL, headers={"User-Agent": "algosdk"})


@dataclass
class SwapQueryParams:
    creator_address: str
    offered_asa_id: int
    offered_asa_amount: int
    requested_asa_id: str
    requested_asa_amount: str


def compile_swapper(inputParams: SwapQueryParams):

    swapper = contracts.get_swapper_teal(
        inputParams.creator_address,
        inputParams.offered_asa_id,
        inputParams.offered_asa_amount,
        inputParams.requested_asa_id,
        inputParams.requested_asa_amount,
        inputParams.creator_address,
        0,
    )

    response = algod.compile(swapper)
    return response


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        s = self.path
        dic = SwapQueryParams(**dict(parse.parse_qsl(parse.urlsplit(s).query)))
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()

        response = json.dumps(compile_swapper(dic))

        self.wfile.write(response.encode())
        return
