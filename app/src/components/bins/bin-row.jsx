import React, { useState } from 'react';
import {
  Checkbox,
  Typography,
  makeStyles,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
} from '@material-ui/core';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  DeleteForeverRounded,
} from '@material-ui/icons';
import every from 'lodash/every';
import { formatDate } from '../../utils';
import Loading from '../common/loading';
import { BinStatus } from './bin-status';
import { BinItems } from './bin-items';
import { useAPI } from '../../hooks/api';

const useStyles = makeStyles((theme) => ({
  binRow: {
    '& > *': {
      borderBottom: 'unset',
    },
    '& .MuiTableCell-root': {
      padding: theme.spacing(1),
    },
  },
}));

export const BinRow = ({ bin }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState({});
  const [binStatus, setBinStatus] = useState(bin.status);
  const [items, setItems] = useState([]);
  const [expand, setExpand] = useState(false);
  const [selected, setSelected] = useState(false);
  const { clearBin, getBinnedItems } = useAPI();

  const handleExpand = async () => {
    setExpand(!expand);

    if (!expand && !items.length) {
      setLoading({ ...loading, items: true });
      const items = await getBinnedItems(bin._id);
      items && setItems(items);
      setLoading({ ...loading, items: false });
    }
  };

  const handleClearBin = async () => {
    if(await clearBin(bin._id)) {
      setBinStatus('EMPTY');
    }
  }

  return (
    <React.Fragment>
      <TableRow
        className={classes.binRow}
        hover
        role="checkbox"
        aria-checked={selected}
        tabIndex={-1}
        selected={selected || expand}
      >
        <TableCell padding="checkbox">
          {binStatus !== 'EMPTY' && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => handleExpand()}
            >
              {expand ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          )}
        </TableCell>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={() => setSelected(!selected)}
            inputProps={{ 'aria-labelledby': bin._id }}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant="subtitle2" component="span">
            {bin.name}
          </Typography>
        </TableCell>
        <TableCell>{bin.orderNumber ?? '----'}</TableCell>
        <TableCell>
          <BinStatus status={binStatus} />
        </TableCell>
        <TableCell>{formatDate(bin.orderDate)}</TableCell>
        <TableCell>{formatDate(bin.binnedDate)}</TableCell>
        <TableCell>
          {binStatus !== 'EMPTY' && (
            <Tooltip title="Clear Bin">
              <IconButton size="small" onClick={handleClearBin}>
                <DeleteForeverRounded />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
        <TableCell />
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={expand} timeout="auto" unmountOnExit>
            {!loading.items ? (
              <BinItems
                updateBinStatus={(status) => {
                  if(status === 'PARTIAL' && every(items, (item) => !item.flagged)) {
                    setBinStatus('PARTIAL');
                  } else {
                    setBinStatus('FLAGGED');
                  }
                }}
                items={items}
              />
            ) : (
              <Loading size={25} />
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
