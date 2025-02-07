import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: theme.spacing(6),
    '& svg': {
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      '& svg': {
        width: '300px',
      },
    },
  },
  logo: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '300px',
    },
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
}));

export const useStyles = () => styles();
