import { NFTS, NFTS_COUNT } from '@/api';
import type { BlockState } from '@/screens/nfts/components/list/types';
import axios from 'axios';
import * as R from 'ramda';
import { useCallback, useEffect, useState } from 'react';

export const PAGE_SIZE = 25;

export const useNFTs = () => {
  const [state, setState] = useState<BlockState>({
    page: 0,
    loading: true,
    items: [],
    total: 0,
  });

  const handleSetState = useCallback((stateChange: Partial<BlockState>) => {
    setState((prevState) => {
      const newState = { ...prevState, ...stateChange };
      return R.equals(prevState, newState) ? prevState : newState;
    });
  }, []);

  const getNFTsByPage = useCallback(
    async (page: number) => {
      try {
        const { data: nftData } = await axios.get<
          Array<{
            identifier?: string;
            name?: string;
            type?: string;
            creator?: string;
            collection?: string;
          }>
        >(NFTS, {
          headers: {
            accept: 'application/json',
          },
          params: {
            from: page * PAGE_SIZE,
            size: PAGE_SIZE,
            type: 'SemiFungibleESDT,NonFungibleESDT',
          },
        });

        const items = nftData.map((x) => ({
          identifier: x?.identifier ?? '',
          name: x?.name ?? '',
          type: x?.type ?? '',
          creator: x?.creator ?? '',
          collection: x?.collection ?? '',
        }));

        handleSetState({
          loading: false,
          items,
        });
      } catch (error) {
        console.error(NFTS, (error as Error).message);
      }
    },
    [handleSetState]
  );

  const handlePageChangeCallback = useCallback(
    async (page: number, _rowsPerPage: number) => {
      handleSetState({
        page,
        loading: true,
      });
      await getNFTsByPage(page);
    },
    [getNFTsByPage, handleSetState]
  );

  useEffect(() => {
    const getCount = async () => {
      try {
        const { data: total } = await axios.get(NFTS_COUNT, {
          headers: {
            accept: 'application/json',
          },
          params: {
            // keeps getting blocked by client
            // type: 'SemiFungibleESDT,NonFungibleESDT',
          },
        });
        const maxSize = 1000;
        handleSetState({
          total: total > maxSize ? maxSize : total,
        });
      } catch (error) {
        console.error(NFTS_COUNT, (error as Error).message);
      }
    };

    getCount();
    getNFTsByPage(0);
  }, [getNFTsByPage, handleSetState]);

  return {
    state,
    handlePageChangeCallback,
  };
};
