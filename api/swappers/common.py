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
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

from algosdk.v2client.algod import AlgodClient

INCENTIVE_WALLET = "RJVRGSPGSPOG7W3V7IMZZ2BAYCABW3YC5MWGKEOPAEEI5ZK5J2GSF6Y26A"
INCENTIVE_FEE = 500_000

ALGOD_URL = "https://node.algoexplorerapi.io"
TESTNET_ALGOD_URL = "https://node.testnet.algoexplorerapi.io"

algod = AlgodClient("", ALGOD_URL, headers={"User-Agent": "algosdk"})
testnet_algod = AlgodClient("", TESTNET_ALGOD_URL, headers={"User-Agent": "algosdk"})


def get_algod(chain_type: str):
    return testnet_algod if chain_type.lower() == "testnet" else algod
