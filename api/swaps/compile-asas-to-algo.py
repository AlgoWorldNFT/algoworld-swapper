# AlgoWorld Swapper
# Copyright (C) 2022 AlgoWorld
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import json
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler

from algoworld_contracts import contracts

from api_utils.utils import INCENTIVE_WALLET, get_algod, get_incentive_fee


@dataclass
class SwapConfig:
    creator_address: str
    offered_asa_amounts: dict
    requested_algo_amount: int
    max_fee: int
    optin_funding_amount: int
    chain_type: str
    version: str


def compileMultiSwap(inputParams: SwapConfig):
    swapper = contracts.get_multi_swapper_teal(
        inputParams.creator_address,
        inputParams.offered_asa_amounts,
        inputParams.requested_algo_amount,
        inputParams.max_fee,
        inputParams.optin_funding_amount,
        INCENTIVE_WALLET,
        get_incentive_fee(inputParams.version),
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
                "version": post_body["version"],
            }
        )

        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()

        response = json.dumps(compileMultiSwap(params))

        self.wfile.write(response.encode())
        return
