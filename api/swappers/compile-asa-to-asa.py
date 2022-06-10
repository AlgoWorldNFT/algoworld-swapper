import json
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler
from urllib import parse

from algoworld_contracts import contracts

from .common import INCENTIVE_FEE, INCENTIVE_WALLET, get_algod


@dataclass
class SwapQueryParams:
    creator_address: str
    offered_asa_id: int
    offered_asa_amount: int
    requested_asa_id: int
    requested_asa_amount: int
    chain_type: str


def compileSwap(input_params: SwapQueryParams):

    swapper = contracts.get_swapper_teal(
        input_params.creator_address,
        input_params.offered_asa_id,
        input_params.offered_asa_amount,
        input_params.requested_asa_id,
        input_params.requested_asa_amount,
        INCENTIVE_WALLET,
        INCENTIVE_FEE,
    )

    response = get_algod(input_params.chain_type).compile(swapper)
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
                "chain_type": raw_params["chain_type"],
            }
        )

        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()

        response = json.dumps(compileSwap(params))
        self.wfile.write(response.encode())
        return
