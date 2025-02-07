import Name from '@/components/name';
import MsgCreateIssuer from '@/models/msg/authority/msg_create_issuer';
import { useProfileRecoil } from '@/recoil/profiles';
import Typography from '@material-ui/core/Typography';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

const CreateIssuer: React.FC<{ message: MsgCreateIssuer }> = (props) => {
  const { message } = props;
  const { t } = useTranslation('transactions');

  const authority = useProfileRecoil(message.authority);
  const authorityMoniker = authority ? authority?.name : message.authority;

  const issuer = useProfileRecoil(message.issuer);
  const issuerMoniker = issuer ? issuer?.name : message.issuer;

  const denom = message.denominations;
  const parsedDenom = denom.reduce(
    (text, value, i, array) => text + (i < array.length - 1 ? ', ' : ` ${t(' and ')} `) + value
  );

  return (
    <Typography>
      <Trans
        i18nKey="message_contents:txCreateIssuerContent"
        components={[
          <Name address={message.authority} name={authorityMoniker} />,
          <Name address={message.issuer} name={issuerMoniker} />,
        ]}
        values={{
          denominations: parsedDenom,
        }}
      />
    </Typography>
  );
};

export default CreateIssuer;
