import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '150px',
    '& .MuiTypography-body1': {
      color: theme.palette.divider,
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.divider,
    },
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
}));

export const useStyles = () => styles();
