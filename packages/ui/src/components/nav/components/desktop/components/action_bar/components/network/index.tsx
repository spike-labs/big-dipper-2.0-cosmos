import ChainIcon from '@/components/ChainIcon';
import { useStyles } from '@/components/nav/components/desktop/components/action_bar/components/network/styles';
import { readSelectedNetwork } from '@/recoil/big_dipper_networks';
import Typography from '@material-ui/core/Typography';
import ExpandMore from '@material-ui/icons/ExpandMore';
import classnames from 'classnames';
import React from 'react';
import { useRecoilValue } from 'recoil';

const Network: React.FC<{
  className?: string;
  toggleNetwork: () => void;
}> = ({ className, toggleNetwork }) => {
  const classes = useStyles();
  const selected = useRecoilValue(readSelectedNetwork);

  return (
    <div
      className={classnames(className, classes.root)}
      onClick={toggleNetwork}
      role="button"
      tabIndex={0}
      aria-label={selected}
    >
      <ChainIcon type="icon" className={classes.icon} alt="icon" />
      <Typography variant="body1">{selected}</Typography>
      <ExpandMore />
    </div>
  );
};

export default Network;
