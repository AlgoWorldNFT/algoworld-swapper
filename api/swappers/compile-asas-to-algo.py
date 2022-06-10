import json
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler

from algoworld_contracts import contracts

from .common import INCENTIVE_FEE, INCENTIVE_WALLET, get_algod


@dataclass
class SwapConfig:
    creator_address: str
    offered_asa_amounts: dict
    requested_algo_amount: int
    max_fee: int
    optin_funding_amount: int
    chain_type: str


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

    response = get_algod(inputParams.chain_type).compile(swapper)
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
                "chain_type": post_body["chain_type"],
            }
        )

        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()

        response = json.dumps(compileMultiSwap(params))

        self.wfile.write(response.encode())
        return
