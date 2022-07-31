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
from http.server import BaseHTTPRequestHandler
from urllib import parse

from algoworld_contracts import contracts
from api.swappers.common import SwapProxyConfig, get_algod


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
