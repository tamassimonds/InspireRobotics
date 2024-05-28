"use client"
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/joy/Box';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Tooltip from '@mui/joy/Tooltip';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { visuallyHidden } from '@mui/utils';
import Button from '@mui/joy/Button';
import Avatar from '@mui/joy/Avatar';

var tableName = ""


function labelDisplayedRows({ from, to, count }) {
  return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <thead>
    <tr>
      {headCells.map((headCell) => {
        const active = orderBy === headCell.id;
        if (!headCell.hidden) {
        
        return (
          <th
            key={headCell.id}
            aria-sort={active ? { asc: 'ascending', desc: 'descending' }[order] : undefined}
          >
            <Link
              underline="none"
              color="neutral"
              textColor={active ? 'primary.plainColor' : undefined}
              component="button"
              onClick={createSortHandler(headCell.id)}
              fontWeight="lg"
              startDecorator={headCell.numeric ? (
                <ArrowDownwardIcon sx={{ opacity: active ? 1 : 0 }} />
              ) : null}
              endDecorator={!headCell.numeric ? (
                <ArrowDownwardIcon sx={{ opacity: active ? 1 : 0 }} />
              ) : null}
              sx={{
                '& svg': {
                  transition: '0.2s',
                  transform: active && order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                },
                '&:hover': { '& svg': { opacity: 1 } },
              }}
            >
              {headCell.label}
              {active ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </Link>
          </th>
        );
      }
      })}
      
    </tr>
  </thead>
);
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const numSelected = 0

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 1,
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: 'background.level1',
        }),
        borderTopLeftRadius: 'var(--unstable_actionRadius)',
        borderTopRightRadius: 'var(--unstable_actionRadius)',
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          level="body-lg"
          sx={{ flex: '1 1 100%' }}
          id="tableTitle"
          component="div"
        >
          {tableName}
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton size="sm" color="danger" variant="solid">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton size="sm" variant="outlined" color="neutral">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};


function handleEditButtonClick(rowData) {
  console.log("Edit button clicked for row:", rowData);
  // Emit the row data or do whatever you need with it here
  // For example, you could set state, open a modal, etc.
}

var headCells  = [];
var rows = [];

export default function TableSortAndSelection({fields = [], data = [], name = "", handleRowSelected,handleDelete}) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  rows = data;
  headCells  = fields;
  tableName = name;
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };



  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
   
    if(handleRowSelected != undefined){
      handleRowSelected(newSelected[0])
    }

  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event, newValue) => {
    setRowsPerPage(parseInt(newValue.toString(), 10));
    setPage(0);
  };

  const getLabelDisplayedRowsTo = () => {
    if (rows.length === -1) {
      return (page + 1) * rowsPerPage;
    }
    return rowsPerPage === -1
      ? rows.length
      : Math.min(rows.length, (page + 1) * rowsPerPage);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Sheet
      variant="outlined"
      sx={{ width: '100%', boxShadow: 'sm', borderRadius: 'sm' }}
    >
      <EnhancedTableToolbar numSelected={selected.length} />
      <Table aria-labelledby="tableTitle" hoverRow sx={{
        '--TableCell-headBackground': 'transparent',
        '--TableCell-selectedBackground': (theme) => theme.vars.palette.success.softBg,
        '& thead th': {
          '&:nth-of-type(1)': {
            width: '10%',
            minWidth: '100px',
          },
          '&:nth-of-type(n+2)': {
            width: '20%',
            minWidth: '100px',
          },
        },
      }}>
        <EnhancedTableHead
          numSelected={selected.length}
          order={order}
          orderBy={orderBy}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={rows.length}
        />
       <tbody>
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row);
                const labelId = `enhanced-table-checkbox-${index}`;
               

                return (
                  <tr
                    onClick={(event) => handleClick(event, row)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    style={
                      isItemSelected
                        ? {
                            '--TableCell-dataBackground':
                              'var(--TableCell-selectedBackground)',
                            '--TableCell-headBackground':
                              'var(--TableCell-selectedBackground)',
                          }
                        : {}
                    }
                  >
                   {headCells.map((cell) => {
                        if (!cell.hidden) {
                            if (cell.id === 'imageUrl' && row[cell.id]) {
                                return (
                                    <td key={cell.id}>
                                        <Avatar src={row[cell.id]} alt={row.name} />
                                    </td>
                                );
                            } else if (cell.id === "delete") {
                                return (
                                    <td key={cell.id}>
                                        <Button color='danger' onClick={() => handleDelete(row.id)}>Delete</Button>
                                    </td>
                                );
                            } else {
                                return <td key={cell.id}>{row[cell.id]}</td>;
                            }
                        }
                        return null;
                    })}
                     
                  </tr>
                );
              })}
          {emptyRows > 0 && (
            <tr
              style={{
                height: `calc(${emptyRows} * 40px)`,
                '--TableRow-hoverBackground': 'transparent',
              }}
            >
              <td colSpan={6} aria-hidden />
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  justifyContent: 'flex-end',
                }}
              >
                <FormControl orientation="horizontal" size="sm">
                  <FormLabel>Rows per page:</FormLabel>
                  <Select onChange={handleChangeRowsPerPage} value={rowsPerPage}>
                    <Option value={5}>5</Option>
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                  </Select>
                </FormControl>
                <Typography textAlign="center" sx={{ minWidth: 80 }}>
                  {labelDisplayedRows({
                    from: rows.length === 0 ? 0 : page * rowsPerPage + 1,
                    to: getLabelDisplayedRowsTo(),
                    count: rows.length === -1 ? -1 : rows.length,
                  })}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={page === 0}
                    onClick={() => handleChangePage(page - 1)}
                    sx={{ bgcolor: 'background.surface' }}
                  >
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={
                      rows.length !== -1
                        ? page >= Math.ceil(rows.length / rowsPerPage) - 1
                        : false
                    }
                    onClick={() => handleChangePage(page + 1)}
                    sx={{ bgcolor: 'background.surface' }}
                  >
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </Box>
              </Box>
            </td>
          </tr>
        </tfoot>
      </Table>
    </Sheet>
  );
}

TableSortAndSelection.propTypes = {
  data: PropTypes.array.isRequired, // Ensure that data is an array
  fields: PropTypes.array.isRequired // Ensure that headCells is an array
};
