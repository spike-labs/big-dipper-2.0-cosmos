import React from 'react';
import renderer from 'react-test-renderer';
import { MockTheme, wait } from '@/tests/utils';
import Blocks from '@/screens/nfts';

// ==================================
// unit tests
// ==================================
jest.mock('@/components/layout', () => (props: JSX.IntrinsicElements['div']) => (
  <div id="Layout" {...props} />
));

jest.mock('@/screens/nfts/components/list', () => (props: JSX.IntrinsicElements['div']) => (
  <div id="List" {...props} />
));

// ==================================
// unit tests
// ==================================
describe('screen: Blocks', () => {
  it('matches snapshot', async () => {
    let component: renderer.ReactTestRenderer | undefined;

    renderer.act(() => {
      component = renderer.create(
        <MockTheme>
          <Blocks />
        </MockTheme>
      );
    });
    await wait(renderer.act);

    const tree = component?.toJSON();
    expect(tree).toMatchSnapshot();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
