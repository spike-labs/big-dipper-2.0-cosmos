import Name from '@/components/name';
import { type MsgConnectionOpenConfirm } from '@/models';
import { useProfileRecoil } from '@/recoil/profiles';
import Typography from '@material-ui/core/Typography';
import Trans from 'next-translate/Trans';
import React from 'react';

const ConnectionOpenConfirm: React.FC<{ message: MsgConnectionOpenConfirm }> = (props) => {
  const { message } = props;

  const signer = useProfileRecoil(message.signer);
  const signerMoniker = signer ? signer?.name : message.signer;

  return (
    <Typography>
      <Trans
        i18nKey="message_contents:txConnectionOpenConfirmContent"
        components={[<Name address={message.signer} name={signerMoniker} />, <b />]}
        values={{
          connectionId: message.connectionId,
        }}
      />
    </Typography>
  );
};

export default ConnectionOpenConfirm;
