import { useRouter } from 'next/router';
import { useEffect } from 'react';

const AccountDetailsPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/accounts/${router.query.address}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default AccountDetailsPage;
