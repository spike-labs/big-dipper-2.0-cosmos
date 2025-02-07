import { BLOCKS, LATEST_BLOCK_HEIGHT, POLLING_INTERVAL } from '@/api';
import { useInterval } from '@/hooks';
import type { BlockState } from '@/screens/blocks/components/list/types';
import axios from 'axios';
import * as R from 'ramda';
import { useCallback, useEffect, useState } from 'react';

export const PAGE_SIZE = 25;

export const useBlocks = () => {
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

  useEffect(() => {
    const getLatestBlockHeight = async () => {
      try {
        const { data: total } = await axios.get(LATEST_BLOCK_HEIGHT);
        handleSetState({
          total,
        });
      } catch (error) {
        console.error((error as Error).message);
      }
    };

    getLatestBlockHeight();
  }, [handleSetState]);

  const getBlocksByPage = useCallback(
    async (page: number) => {
      try {
        const { data: blocksData } = await axios.get<
          Array<{
            round: BlockState['items'][number]['block'];
            timestamp: BlockState['items'][number]['timestamp'];
            hash: BlockState['items'][number]['hash'];
            txCount: BlockState['items'][number]['txs'];
            shard: BlockState['items'][number]['shard'];
            sizeTxs: BlockState['items'][number]['size'];
          }>
        >(BLOCKS, {
          params: {
            from: page * PAGE_SIZE,
            size: PAGE_SIZE,
          },
        });

        const items = blocksData.map((x) => ({
          block: x.round,
          timestamp: x.timestamp,
          hash: x.hash,
          txs: x.txCount,
          shard: x.shard,
          size: x.sizeTxs,
        }));

        handleSetState({
          loading: false,
          items,
        });
      } catch (error) {
        console.error((error as Error).message);
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
      await getBlocksByPage(page);
    },
    [getBlocksByPage, handleSetState]
  );

  const getBlocksInterval = useCallback(async () => {
    if (state.page === 0) {
      await getBlocksByPage(0);
    }
  }, [getBlocksByPage, state.page]);

  useInterval(getBlocksInterval, POLLING_INTERVAL);

  return {
    state,
    handlePageChangeCallback,
  };
};
