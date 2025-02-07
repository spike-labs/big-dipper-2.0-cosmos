import React from 'react';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import Layout from '@/components/layout';
import LoadAndExist from '@/components/load_and_exist';
import Profile from '@/screens/token_details/components/profile';
import Overview from '@/screens/token_details/components/overview';
import Stats from '@/screens/token_details/components/stats';
import Transactions from '@/screens/token_details/components/transactions';
import { useStyles } from '@/screens/token_details/styles';
import { useTokenDetails } from '@/screens/token_details/hooks';

const TokenDetails = () => {
  const classes = useStyles();
  const { t } = useTranslation('tokens');
  const { state } = useTokenDetails();
  // console.log(state, 'stat');
  return (
    <>
      <NextSeo
        title={t('tokenDetails')}
        openGraph={{
          title: t('tokenDetails'),
        }}
      />
      <Layout navTitle={t('tokenDetails')} className={classes.root}>
        <LoadAndExist loading={state.loading} exists={state.exists}>
          <Profile className={classes.profile} profile={state.profile} />
          <Stats className={classes.stats} stats={state.stats} />
          <Overview className={classes.overview} overview={state.overview} />
          <Transactions className={classes.transaction} />
        </LoadAndExist>
      </Layout>
    </>
  );
};

export default TokenDetails;
