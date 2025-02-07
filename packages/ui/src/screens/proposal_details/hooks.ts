import { ProposalDetailsQuery, useProposalDetailsQuery } from '@/graphql/types/general_types';
import type { ProposalState } from '@/screens/proposal_details/types';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import { useCallback, useState } from 'react';

export const useProposalDetails = () => {
  const router = useRouter();
  const [state, setState] = useState<ProposalState>({
    loading: true,
    exists: true,
    overview: {
      proposer: '',
      content: '',
      title: '',
      id: 0,
      description: '',
      status: '',
      submitTime: '',
      depositEndTime: '',
      votingStartTime: '',
      votingEndTime: '',
    },
  });

  const handleSetState = useCallback((stateChange: Partial<ProposalState>) => {
    setState((prevState) => {
      const newState = { ...prevState, ...stateChange };
      return R.equals(prevState, newState) ? prevState : newState;
    });
  }, []);

  // ==========================
  // fetch data
  // ==========================
  useProposalDetailsQuery({
    variables: {
      proposalId: parseFloat((router?.query?.id as string) ?? '0'),
    },
    onCompleted: (data) => {
      handleSetState(formatProposalQuery(data));
    },
  });

  // ==========================
  // parsers
  // ==========================

  const formatProposalQuery = (data: ProposalDetailsQuery) => {
    const stateChange: Partial<ProposalState> = {
      loading: false,
    };

    if (!data.proposal.length) {
      stateChange.exists = false;
      return stateChange;
    }

    // =========================
    // overview
    // =========================
    const formatOverview = () => {
      const DEFAULT_TIME = '0001-01-01T00:00:00';
      let votingStartTime = data?.proposal?.[0]?.votingStartTime ?? DEFAULT_TIME;
      votingStartTime = votingStartTime === DEFAULT_TIME ? '' : votingStartTime;
      let votingEndTime = data?.proposal?.[0]?.votingEndTime ?? DEFAULT_TIME;
      votingEndTime = votingEndTime === DEFAULT_TIME ? '' : votingEndTime;

      const overview = {
        proposer: data?.proposal?.[0]?.proposer ?? '',
        content: data?.proposal?.[0]?.content ?? '',
        title: data?.proposal?.[0]?.title ?? '',
        id: data?.proposal?.[0]?.proposalId ?? '',
        description: data?.proposal?.[0]?.description ?? '',
        status: data?.proposal?.[0]?.status ?? '',
        submitTime: data?.proposal?.[0]?.submitTime ?? '',
        depositEndTime: data?.proposal?.[0]?.depositEndTime ?? '',
        votingStartTime,
        votingEndTime,
      };

      return overview;
    };

    stateChange.overview = formatOverview();

    return stateChange;
  };

  return {
    state,
  };
};
