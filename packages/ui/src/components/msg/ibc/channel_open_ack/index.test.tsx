import ChannelOpenAck from '@/components/msg/ibc/channel_open_ack';
import { MsgChannelOpenAck } from '@/models';
import { MockTheme } from '@/tests/utils';
import renderer from 'react-test-renderer';

// ==================================
// mocks
// ==================================
jest.mock('@/components/name', () => (props: JSX.IntrinsicElements['div']) => (
  <div id="Name" {...props} />
));

// ==================================
// unit tests
// ==================================
describe('screen: TransactionDetails/IBCChannelOpenAck', () => {
  it('matches snapshot', () => {
    const message = MsgChannelOpenAck.fromJson({
      category: 'ibc',
      type: 'MsgChannelOpenAck',
      signer: 'desmos1jrld5g998gqm4yx26l6cvhxz7y5adgxquy94nz',
      channelId: '1',
      portId: '21',
      counterpartyChannelId: '12',
      counterpartyVersion: '1.0',
      json: [
        {
          denom: 'udaric',
          amount: '2000000',
        },
      ],
    });
    const component = renderer.create(
      <MockTheme>
        <ChannelOpenAck message={message} />
      </MockTheme>
    );
    const tree = component?.toJSON();
    expect(tree).toMatchSnapshot();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
