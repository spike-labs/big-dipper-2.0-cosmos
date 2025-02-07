import { useStyles } from '@/components/no_data/styles';
import Typography from '@material-ui/core/Typography';
import { Face } from '@material-ui/icons';
import classnames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

const NoData: React.FC<{
  className?: string;
}> = ({ className }) => {
  const classes = useStyles();
  const { t } = useTranslation('common');
  return (
    <div className={classnames(className, classes.root)}>
      <div className={classes.content}>
        <Face />
        <Typography variant="body1">{t('nothingToShow')}</Typography>
      </div>
    </div>
  );
};

export default NoData;
