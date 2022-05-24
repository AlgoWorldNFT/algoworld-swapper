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
class SwapProxyConfig:
    swap_creator: str


def compile_swapper_proxy(cfg: SwapProxyConfig):
    swapper = contracts.get_swapper_proxy_teal(swap_creator=cfg.swap_creator)
    response = algod.compile(swapper)
    return response


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        s = self.path
        dic = SwapProxyConfig(**dict(parse.parse_qsl(parse.urlsplit(s).query)))
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()

        response = json.dumps(compile_swapper_proxy(dic))

        self.wfile.write(response.encode())
        return
