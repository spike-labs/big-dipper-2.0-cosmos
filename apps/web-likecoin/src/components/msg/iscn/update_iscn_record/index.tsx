import Name from '@/components/name';
import MsgUpdateIscnRecord from '@/models/msg/iscn/msg_update_iscn_record';
import { useProfileRecoil } from '@/recoil/profiles';
import Typography from '@material-ui/core/Typography';
import Trans from 'next-translate/Trans';
import numeral from 'numeral';
import React from 'react';

const UpdateIscnRecord: React.FC<{ message: MsgUpdateIscnRecord }> = (props) => {
  const { message } = props;

  const from = useProfileRecoil(message.from);
  const fromMoniker = from ? from?.name : message.from;

  return (
    <Typography>
      <Trans
        i18nKey="message_contents:txUpdateIscnRecordContent"
        components={[<Name address={message.from} name={fromMoniker} />, <b />]}
        values={{
          iscnId: numeral(message.iscnId).format('0,0'),
        }}
      />
    </Typography>
  );
};

export default UpdateIscnRecord;
