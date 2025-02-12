import {
  TransactionsListenerSubscription,
  useTransactionsListenerSubscription,
} from '@/graphql/types/general_types';
import type { TransactionsState } from '@/screens/home/components/transactions/types';
import { useState } from 'react';

export const useTransactions = () => {
  const [state, setState] = useState<TransactionsState>({
    items: [],
  });

  // ================================
  // txs subscription
  // ================================
  useTransactionsListenerSubscription({
    onData: (data) => {
      setState({
        items: data.data.data ? formatTransactions(data.data.data) : [],
      });
    },
  });

  const formatTransactions = (data: TransactionsListenerSubscription) =>
    data.transactions.map((x) => ({
      height: x.height,
      hash: x.hash,
      timestamp: x.block.timestamp,
    }));

  return {
    state,
  };
};
