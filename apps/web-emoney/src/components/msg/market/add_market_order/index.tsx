import Name from '@/components/name';
import MsgAddMarketOrder from '@/models/msg/market/msg_add_market_order';
import { useProfileRecoil } from '@/recoil/profiles';
import { formatNumber, formatToken } from '@/utils/format_token';
import Typography from '@material-ui/core/Typography';
import Trans from 'next-translate/Trans';
import React from 'react';

const AddMarketOrder: React.FC<{ message: MsgAddMarketOrder }> = (props) => {
  const { message } = props;
  const owner = useProfileRecoil(message.owner);
  const ownerMoniker = owner ? owner?.name : message.owner;
  const destination = formatToken(message.destination.amount, message.destination.denom);

  return (
    <Typography>
      <Trans
        i18nKey="message_contents:txAddMarketOrderContent"
        components={[<Name address={message.owner} name={ownerMoniker} />, <b />, <b />, <b />]}
        values={{
          clientOrderId: message.clientOrderId,
          source: message.source,
          destination: `${formatNumber(
            destination.value,
            destination.exponent
          )} ${destination.displayDenom.toUpperCase()}`,
        }}
      />
    </Typography>
  );
};

export default AddMarketOrder;
