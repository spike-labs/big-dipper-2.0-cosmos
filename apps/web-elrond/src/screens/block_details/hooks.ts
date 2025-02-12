import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import * as R from 'ramda';
import { useRouter } from 'next/router';
import { BLOCK_DETAILS } from '@/api';
import type { BlockDetailsState } from '@/screens/block_details/types';

export const useBlockDetails = () => {
  const router = useRouter();
  const [state, setState] = useState<BlockDetailsState>({
    loading: true,
    exists: true,
    overview: {
      block: 0,
      hash: '',
      proposer: '',
      timestamp: 0,
      txs: 0,
      gasPenalized: 0,
      gasProvided: 0,
      gasRefunded: 0,
      gasUsed: 0,
      size: 0,
      shard: 0,
    },
    miniBlocks: [],
    consensus: [],
  });

  const handleSetState = useCallback((stateChange: Partial<BlockDetailsState>) => {
    setState((prevState) => {
      const newState = { ...prevState, ...stateChange };
      return R.equals(prevState, newState) ? prevState : newState;
    });
  }, []);

  useEffect(() => {
    const getBlockDetails = async () => {
      try {
        const { data: blockData } = await axios.get<{
          size: number | undefined;
          round: BlockDetailsState['overview']['block'];
          hash: BlockDetailsState['overview']['hash'];
          proposer: BlockDetailsState['overview']['proposer'];
          timestamp: BlockDetailsState['overview']['timestamp'];
          txCount: BlockDetailsState['overview']['txs'];
          sizeTxs: BlockDetailsState['overview']['size'];
          shard: BlockDetailsState['overview']['shard'];
          gasConsumed: BlockDetailsState['overview']['gasUsed'];
          maxGasLimit: BlockDetailsState['overview']['gasProvided'];
          gasRefunded: BlockDetailsState['overview']['gasRefunded'];
          gasPenalized: BlockDetailsState['overview']['gasPenalized'];
          miniBlocksHashes: BlockDetailsState['miniBlocks'];
          validators: BlockDetailsState['consensus'];
        }>(BLOCK_DETAILS(router.query.hash as string));
        const size = blockData?.size ?? 0;
        const sizeTxs = blockData?.sizeTxs ?? 0;
        handleSetState({
          loading: false,
          overview: {
            block: blockData.round,
            hash: blockData.hash,
            proposer: blockData.proposer,
            timestamp: blockData.timestamp,
            txs: blockData.txCount,
            size: size + sizeTxs,
            shard: blockData.shard,
            gasUsed: blockData.gasConsumed,
            gasProvided: blockData.maxGasLimit,
            gasRefunded: blockData.gasRefunded,
            gasPenalized: blockData.gasPenalized,
          },
          miniBlocks: blockData?.miniBlocksHashes,
          consensus: blockData.validators,
        });
      } catch (error) {
        handleSetState({
          loading: false,
          exists: false,
        });
        console.error((error as Error).message);
      }
    };

    getBlockDetails();
  }, [handleSetState, router.query.hash]);

  return {
    state,
  };
};
