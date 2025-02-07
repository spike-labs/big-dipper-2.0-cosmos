import Name from '@/components/name';
import useTranslation from 'next-translate/useTranslation';

const Signers = (props: { signers: AvatarName[] }) => {
  const { t } = useTranslation('transactions');
  const { signers } = props;
  return (
    <>
      {signers.map((x, i) => {
        const signerMoniker = x?.name || x?.address;
        if (signers.length === 1) {
          return <Name address={x?.address} name={signerMoniker} />;
        }

        if (i === signers.length - 2) {
          return (
            <>
              <Name address={x?.address} name={signerMoniker} /> {t('and')}{' '}
            </>
          );
        }

        return (
          <>
            <Name address={x?.address} name={signerMoniker} />
            {i !== signers.length - 1 && <>, </>}
          </>
        );
      })}
    </>
  );
};

export default Signers;
