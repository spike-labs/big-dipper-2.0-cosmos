import { BlockDetailsQuery, useBlockDetailsQuery } from '@/graphql/types/general_types';
import type { BlockDetailState, OverviewType } from '@/screens/block_details/types';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import * as R from 'ramda';
import { useCallback, useEffect, useState } from 'react';

export const useBlockDetails = () => {
  const router = useRouter();
  const [state, setState] = useState<BlockDetailState>({
    loading: true,
    exists: true,
    overview: {
      height: 0,
      hash: '',
      txs: 0,
      timestamp: '',
      proposer: '',
    },
    signatures: [],
    transactions: [],
  });
  const handleSetState = useCallback((stateChange: Partial<BlockDetailState>) => {
    setState((prevState) => {
      const newState = { ...prevState, ...stateChange };
      return R.equals(prevState, newState) ? prevState : newState;
    });
  }, []);

  useEffect(() => {
    // reset every call
    handleSetState({
      loading: true,
      exists: true,
    });
  }, [handleSetState]);

  // ==========================
  // Fetch Data
  // ==========================
  useBlockDetailsQuery({
    variables: {
      height: numeral(router.query.height).value(),
      signatureHeight: (numeral(router.query.height).value() ?? 0) + 1,
    },
    onCompleted: (data) => {
      handleSetState(formatRaws(data));
    },
  });

  return {
    state,
  };
};

function formatRaws(data: BlockDetailsQuery) {
  const stateChange: Partial<BlockDetailState> = {
    loading: false,
  };

  if (!data.block.length) {
    stateChange.exists = false;
    return stateChange;
  }

  // ==========================
  // Overview
  // ==========================
  const formatOverview = () => {
    const proposerAddress = data?.block?.[0]?.operatorAddress ?? '';
    const overview: OverviewType = {
      height: data.block[0].height,
      hash: data.block[0].hash,
      txs: data.block[0].txs ?? 0,
      timestamp: data.block[0].timestamp,
      proposer: proposerAddress,
    };
    return overview;
  };

  stateChange.overview = formatOverview();

  // ==========================
  // Signatures
  // ==========================
  const formatSignatures = () => {
    const signatures = data.preCommits
      .filter((x) => x?.operatorAddress)
      .map((x) => x.operatorAddress);
    return signatures;
  };
  stateChange.signatures = formatSignatures();

  // ==========================
  // Transactions
  // ==========================
  const formatTransactions = () => {
    const transactions = data.transaction.map((x) => ({
      height: x.height,
      hash: x.hash,
      timestamp: stateChange.overview?.timestamp ?? '',
    }));

    return transactions;
  };
  stateChange.transactions = formatTransactions();

  return stateChange;
}
