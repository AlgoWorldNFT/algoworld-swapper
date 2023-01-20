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

import base64
from dataclasses import dataclass

from algosdk.future.transaction import LogicSig
from algosdk.v2client.algod import AlgodClient
from algosdk.v2client.indexer import IndexerClient

INCENTIVE_WALLET = "RJVRGSPGSPOG7W3V7IMZZ2BAYCABW3YC5MWGKEOPAEEI5ZK5J2GSF6Y26A"
INCENTIVE_FEE = 50_000
INCENTIVE_FEES = {
    "0.0.1": 500_000,
    "0.0.2": 500_000,
    "0.0.3": 50_000,
}


ALGOD_URL = "https://node.algoexplorerapi.io"
TESTNET_ALGOD_URL = "https://node.testnet.algoexplorerapi.io"

INDEXER_URL = "https://algoindexer.algoexplorerapi.io"
TESTNET_INDEXER_URL = "https://algoindexer.testnet.algoexplorerapi.io"


def get_incentive_fee(version: str):
    try:
        return INCENTIVE_FEES[version]
    except Exception:
        return INCENTIVE_FEE


def get_algod(chain_type: str):
    return AlgodClient(
        "",
        TESTNET_ALGOD_URL if chain_type == "testnet" else ALGOD_URL,
        headers={"User-Agent": "algosdk"},
    )


def get_indexer(chain_type: str):
    return IndexerClient(
        "",
        TESTNET_INDEXER_URL if chain_type == "testnet" else INDEXER_URL,
        headers={"User-Agent": "algosdk"},
    )


def get_logic_signature(compiled_response: dict):
    """Create and return logic signature for provided `teal_source`."""
    return LogicSig(base64.b64decode(compiled_response["result"]))


def get_account_txns(chain_type: str, account: str):
    indexer = get_indexer(chain_type)
    response = indexer.search_transactions_by_address(account)
    return response["transactions"] if response and "transactions" in response else []


def get_decoded_note_from_txn(txn: dict):
    return base64.b64decode(txn["note"]).decode()


def account_exists(chain_type: str, account: str):
    try:
        indexer = get_indexer(chain_type)
        indexer.account_info(account)
        return True
    except Exception:
        return False


@dataclass
class SwapProxyConfig:
    swap_creator: str
    version: str
    chain_type: str


@dataclass
class SwapConfigUrl:
    escrow: str
    ipfs_url: str
    chain: str
