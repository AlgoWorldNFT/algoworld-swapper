/**
 * AlgoWorld Swapper
 * Copyright (C) 2022 AlgoWorld
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import PageHeader from '@/components/Headers/PageHeader';
import { setIsWalletPopupOpen } from '@/redux/slices/applicationSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import {
  Box,
  Button,
  Container,
  IconButton,
  InputBase,
  LinearProgress,
  Pagination,
  Paper,
  Stack,
} from '@mui/material';
import { MY_SWAPS_PAGE_HEADER_ID } from '@/common/constants';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import PublicSwapsGrid from '@/components/Grids/PublicSwapsGrid';
import getPublicSwapCreators from '@/utils/api/accounts/getPublicSwapCreators';
import { paginate } from '@/utils/paginate';
import accountExists from '@/utils/api/accounts/accountExists';

export default function PublicSwaps() {
  const dispatch = useAppDispatch();
  const chain = useAppSelector((state) => state.walletConnect.chain);
  const address = useAppSelector((state) => state.walletConnect.address);
  const [nextToken, setNextToken] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState(``);
  const [publicSwapAccounts, setPublicSwapAccounts] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const rowsPerPage = 10;

  useEffect(() => {
    setLoading(true);

    getPublicSwapCreators(100256867, chain, rowsPerPage, undefined).then(
      (response) => {
        setPublicSwapAccounts(response.accounts);
        setNextToken(response.nextToken);
        setLoading(false);
      },
    );
  }, [address, chain]);

  const loadMoreSwaps = async (nextToken: string | undefined) => {
    setLoading(true);
    const newSwapCreatorsResponse = await getPublicSwapCreators(
      100256867,
      chain,
      rowsPerPage,
      nextToken,
    );
    if (
      newSwapCreatorsResponse.accounts.length === 0 ||
      !newSwapCreatorsResponse.nextToken
    ) {
      setNextToken(undefined);
      setLoading(false);
      return;
    } else {
      setPublicSwapAccounts([
        ...publicSwapAccounts,
        ...newSwapCreatorsResponse.accounts,
      ]);
      setNextToken(newSwapCreatorsResponse.nextToken);
      setLoading(false);
    }
  };

  const loadSwapsForSearchInput = async (searchInput: string) => {
    setLoading(true);

    const response = await accountExists(chain, searchInput);

    if (response) {
      setPublicSwapAccounts([searchInput]);
    } else {
      setPublicSwapAccounts([]);
    }

    setNextToken(undefined);
    setLoading(false);
  };

  const resetSearchInput = async () => {
    await loadMoreSwaps(undefined);
    setSearchInput(``);
  };

  return (
    <>
      <PageHeader
        id={MY_SWAPS_PAGE_HEADER_ID}
        title="📣 Public Swaps"
        description="Browse available public swap listings"
      />

      <Container
        maxWidth="xl"
        sx={{ textAlign: `center`, pb: 5 }}
        component="main"
      >
        {!address ? (
          <Button
            onClick={() => {
              dispatch(setIsWalletPopupOpen(true));
            }}
            fullWidth
            variant="contained"
            color="primary"
          >
            Connect Wallet
          </Button>
        ) : isLoading ? (
          <Box sx={{ width: `100%` }}>
            <LinearProgress />
          </Box>
        ) : (
          <>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Stack alignItems="center" justifyContent="center" spacing={2}>
                <Paper
                  component="form"
                  sx={{
                    width: `680px`,
                    display: `flex`,
                    alignItems: `center`,
                  }}
                >
                  <InputBase
                    sx={{ ml: 2, flex: 1 }}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by creator address"
                    inputProps={{ 'aria-label': `search google maps` }}
                  />
                  <IconButton
                    type="submit"
                    sx={{ p: `10px` }}
                    aria-label="search"
                    onClick={() => loadSwapsForSearchInput(searchInput)}
                  >
                    <SearchIcon />
                  </IconButton>
                  {searchInput.length > 0 && (
                    <IconButton
                      type="submit"
                      sx={{ p: `10px` }}
                      aria-label="search"
                      onClick={() => resetSearchInput()}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </Paper>
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  spacing={2}
                  direction="row"
                >
                  {publicSwapAccounts.length > 0 && (
                    <Pagination
                      shape="rounded"
                      variant="outlined"
                      color="primary"
                      count={Math.ceil(publicSwapAccounts.length / rowsPerPage)}
                      page={page + 1}
                      onChange={(_, value) => {
                        setPage(value - 1);
                      }}
                    />
                  )}
                  {Math.ceil(publicSwapAccounts.length / rowsPerPage) ===
                    page + 1 &&
                    nextToken && (
                      <Button
                        variant="outlined"
                        onClick={async () => {
                          await loadMoreSwaps(nextToken);
                        }}
                      >
                        Load more
                      </Button>
                    )}
                </Stack>
              </Stack>
            </Box>
            {publicSwapAccounts.length > 0 ? (
              <PublicSwapsGrid
                publicSwapAccounts={paginate(
                  publicSwapAccounts,
                  rowsPerPage,
                  page + 1,
                )}
                chain={chain}
              />
            ) : (
              <div>Creator address not found...</div>
            )}
          </>
        )}
      </Container>
    </>
  );
}
