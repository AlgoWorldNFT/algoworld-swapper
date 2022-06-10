import json
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler
from urllib import parse

from algoworld_contracts import contracts

from .common import get_algod


@dataclass
class SwapProxyConfig:
    swap_creator: str
    version: str
    chain_type: str


def compileSwapProxy(cfg: SwapProxyConfig):
    swapper = contracts.get_swapper_proxy_teal(
        swap_creator=cfg.swap_creator, version=cfg.version
    )
    response = get_algod(cfg.chain_type).compile(swapper)
    return response


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        s = self.path
        raw_params = dict(parse.parse_qsl(parse.urlsplit(s).query))
        dic = SwapProxyConfig(
            **{
                "swap_creator": raw_params["swap_creator"],
                "version": raw_params["version"],
                "chain_type": raw_params["chain_type"],
            }
        )
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()

        response = json.dumps(compileSwapProxy(dic))

        self.wfile.write(response.encode())
        return
