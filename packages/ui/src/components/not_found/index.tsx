import { useStyles } from '@/components/not_found/styles';
import { readTheme } from '@/recoil/settings';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { useRecoilValue } from 'recoil';
import NotFoundDark from 'shared-utils/assets/not-found-dark.svg';
import NotFoundLight from 'shared-utils/assets/not-found-light.svg';

const NotFound: React.FC<{
  className?: string;
}> = ({ className }) => {
  const classes = useStyles();
  const { t } = useTranslation('common');
  const theme = useRecoilValue(readTheme);

  return (
    <div className={classnames(className, classes.root)}>
      <div className={classes.content}>
        {theme === 'light' ? <NotFoundLight /> : <NotFoundDark />}
        <Typography variant="body1">{t('notFound')}</Typography>
      </div>
    </div>
  );
};

export default NotFound;
