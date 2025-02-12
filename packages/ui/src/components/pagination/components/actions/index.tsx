import { useTablePaginationActions } from '@/components/pagination/components/actions/hooks';
import { useStyles } from '@/components/pagination/components/actions/styles';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import React from 'react';
import NextFastIcon from 'shared-utils/assets/icon-next-fast.svg';
import NextIcon from 'shared-utils/assets/icon-next.svg';

type Props = Parameters<typeof useTablePaginationActions>[0] & {
  rowsPerPageOptions?: number[];
};

/**
 * custom pagination buttons
 * @param props
 */
const Actions: React.FC<Props> = (props) => {
  const classes = useStyles();

  const { count, page, rowsPerPage, onChangePage, className, rowsPerPageOptions } = props;

  const {
    handleFirstPage,
    handleNextPage,
    handlePreviousPage,
    handleLastPage,
    availablePages,
    handleRowOptionChange,
  } = useTablePaginationActions(props);

  const disablePrevious = page === 0;
  const disableNext = page >= Math.ceil(count / rowsPerPage) - 1;

  return (
    <ul className={classnames(className, classes.root)}>
      <li className="first">
        <IconButton
          className={classes.button}
          disableRipple
          onClick={handleFirstPage}
          disabled={disablePrevious}
          aria-label="first page"
        >
          <NextFastIcon className={classes.prev} />
        </IconButton>
      </li>
      <li>
        <IconButton
          disableRipple
          className={classes.button}
          onClick={handlePreviousPage}
          disabled={disablePrevious}
          aria-label="previous page"
        >
          <NextIcon className={classes.prev} />
        </IconButton>
      </li>
      {availablePages.map((x) => (
        <Typography
          component="li"
          variant="body2"
          key={x}
          onClick={() => onChangePage(null, x)}
          className={classnames(classes.button, classes.pageButton, {
            selected: page === x,
          })}
        >
          {x + 1}
        </Typography>
      ))}
      <li>
        <IconButton
          disableRipple
          className={classes.button}
          onClick={handleNextPage}
          disabled={disableNext}
          aria-label="next page"
        >
          <NextIcon />
        </IconButton>
      </li>
      <li className="last">
        <IconButton
          disableRipple
          className={classes.button}
          onClick={handleLastPage}
          disabled={disableNext}
          aria-label="last page"
        >
          <NextFastIcon />
        </IconButton>
      </li>
      {!!rowsPerPageOptions && (
        <li className={classes.tablet}>
          <FormControl>
            <Select
              className={classes.rowSelection}
              value={rowsPerPage}
              onChange={handleRowOptionChange}
              input={<InputBase />}
            >
              {rowsPerPageOptions.map((x) => (
                <MenuItem value={x} key={x} className={classes.menuItem}>
                  <Typography variant="body2">{x}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </li>
      )}
    </ul>
  );
};

export default Actions;
