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
from time import sleep
from urllib import parse

import requests
from algoworld_contracts import contracts
from requests.adapters import HTTPAdapter, Retry

import api_utils.utils as common

retry_strategy = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504],
    method_whitelist=["HEAD", "GET", "OPTIONS"],
)
adapter = HTTPAdapter(max_retries=retry_strategy)
http_client = requests.Session()
http_client.mount("https://", adapter)
http_client.mount("http://", adapter)


def compileSwapProxy(cfg: common.SwapProxyConfig):
    swapper = contracts.get_swapper_proxy_teal(
        swap_creator=cfg.swap_creator, version=cfg.version
    )
    response = common.get_algod(cfg.chain_type).compile(swapper)
    return response


def retry(fun, max_tries=10):
    for i in range(max_tries):
        try:
            sleep(0.3)
            fun()
            break
        except Exception:
            continue


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        s = self.path
        raw_params = dict(parse.parse_qsl(parse.urlsplit(s).query))
        dic = common.SwapProxyConfig(
            **{
                "swap_creator": raw_params["swap_creator"],
                "version": raw_params["version"],
                "chain_type": raw_params["chain_type"],
            }
        )
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()

        logic_sig = common.get_logic_signature(compileSwapProxy(dic))

        if not common.account_exists(raw_params["chain_type"], logic_sig.address()):
            self.wfile.write("[]".encode())
            return

        payment_txns = common.get_account_txns(
            raw_params["chain_type"], logic_sig.address()
        )
        if len(payment_txns) == 0:
            self.wfile.write("[]".encode())
            return

        swap_config_txn = payment_txns[0]
        config_file_url = common.get_decoded_note_from_txn(swap_config_txn)

        if "ipfs" in config_file_url:
            gateway = (
                raw_params["gateway"]
                if "gateway" in raw_params
                else "ipfs.algonode.xyz"
            )
            config_file_url = f'https://{gateway}/ipfs/{config_file_url.split("ipfs://")[1]}/aw_swaps.json'

            try:
                configFileResponse = http_client.get(config_file_url).json()
                configFile = json.dumps(
                    [
                        config
                        for config in configFileResponse
                        if "isPublic" in config and config["isPublic"]
                    ]
                )

                self.wfile.write(configFile.encode())
                return
            except Exception:
                self.wfile.write("[]".encode())
                return

        self.wfile.write("[]".encode())
        return
