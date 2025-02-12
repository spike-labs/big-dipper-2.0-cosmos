import { ECONOMICS } from '@/api';
import type { StakingState } from '@/screens/home/components/staking/types';
import axios from 'axios';
import * as R from 'ramda';
import { useCallback, useEffect, useState } from 'react';

export const useStaking = () => {
  const [state, setState] = useState<StakingState>({
    staked: 0,
    circulatingSupply: 0,
    percentStaked: 0,
  });

  const handleSetState = useCallback((stateChange: Partial<StakingState>) => {
    setState((prevState) => {
      const newState = { ...prevState, ...stateChange };
      return R.equals(prevState, newState) ? prevState : newState;
    });
  }, []);

  useEffect(() => {
    const getEconomics = async () => {
      try {
        const { data: economicsData } = await axios.get(ECONOMICS);

        handleSetState({
          staked: economicsData.staked,
          circulatingSupply: economicsData.circulatingSupply,
          percentStaked: parseFloat(
            ((economicsData.staked * 100) / economicsData.circulatingSupply).toFixed(2)
          ),
        });
      } catch (error) {
        console.error((error as Error).message);
      }
    };

    getEconomics();
  }, [handleSetState]);

  return {
    state,
  };
};
