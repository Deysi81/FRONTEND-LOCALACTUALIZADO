import React, { useState, ChangeEvent, CSSProperties, Fragment } from 'react';
import {
  Button,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  Table,
  TableHead,
  Paper,
  IconButton,
  Grid,
  TextField,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  ListItemText,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

import FilterListIcon from '@mui/icons-material/FilterList';
import Icon from 'src/@core/components/icon';
import { useSettings } from 'src/@core/hooks/useSettings';
import { useAsset } from 'src/context/GruposContabContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import SidebarAddGruposcontable from 'src/components/GruposContables/addcontables';
import SidebarEditContable2 from 'src/components/GruposContables/editContable2';

interface Contables {
  _id: string;
  assetCategory: string;
  usefulLife: number;
  subCategory: string[];
  asset: boolean;
}

const AssetList: React.FC = () => {
  const { settings } = useSettings();
  const { mode } = settings;
  const [open, setOpen] = React.useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<boolean>(false);
  const [addcontablesOpen, setAddcontablesOpen] = useState<boolean>(false);
  const toggleAddcontablesDrawer = () => setAddcontablesOpen(!addcontablesOpen);
  const [isSidebarEditOpen, setIsSidebarEditOpen] = useState(false);
  const [deleteAssetId, setDeleteAssetId] = useState<string | null>(null);

  // LLAMANDO AL CONTEXTO
  const {
    assets,
    setassetCategory,
    setLimit,
    deleteAsset,
    page,
    setPage,
    limit,
    totalGrupo,
  } = useAsset();

  const handleClose = () => {
    setOpen(false);
    setIsDeleteConfirmationOpen(false);
  };

  const handleDeleteCancelled = () => {
    setIsDeleteConfirmationOpen(false);
  };

  // const handleDeleteConfirme = async (assetId: string) => {
  //   await deleteAsset(assetId);
  //   handleClose();
  // };

  const handleDelete = (assetId: string) => {
    setDeleteAssetId(assetId);
    setIsDeleteConfirmationOpen(true);
  };
  const handleDeleteConfirmed = async () => {
    if (deleteAssetId) {
      await deleteAsset(deleteAssetId);
      handleClose();
      setDeleteAssetId(null);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtro para Categorias
  const Filter = (e: ChangeEvent<HTMLInputElement>) => {
    setassetCategory(e.target.value);
  };

  // Menú option filtros para Nombre Categoría
  const [anchorNl, setAnchorNl] = React.useState<null | HTMLElement>(null);

  const handleClickNomb = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorNl(event.currentTarget);
  };

  const handleCloseOptionNomb = () => {
    setAnchorNl(null);
  };

  // Menú option filtros para Nit
  const [anchorNiTl, setAnchorNiTl] = React.useState<null | HTMLElement>(null);

  const handleClickNit = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorNiTl(event.currentTarget);
  };

  const handleCloseOptionNit = () => {
    setAnchorNiTl(null);
  };

  const headerStyle = {
    backgroundColor: mode === 'light' ? '#8c90f0' : '#5a5c75',
    color: mode === 'light' ? 'black' : 'white',
    fontFamily: 'Roboto, Arial, sans-serif',
  };

  const bodystyle: CSSProperties = {
    fontSize: '12.9px',
    height: '50px',
    width: '50px',
    textAlign: 'center',
    fontFamily: 'Roboto, Arial, sans-serif',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
  };

  const headStyle: CSSProperties = {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontSize: '13px',
    height: '50px',
    width: '50px',
    color: 'white',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    textAlign: 'center',
  };

  return (
    <>
      <Grid container>
        <Grid xs={7} ml={4} lg={15}>
          <Button
            style={{ textTransform: 'uppercase', minWidth: '210px', marginLeft: '-14px', float: 'left' }}
            sx={{ mb: 2, margin: '0 15px 8px 0' }}
            variant="contained"
            onClick={toggleAddcontablesDrawer}
          >
            NUEVO GRUPO CONTABLE
          </Button>
          <SidebarAddGruposcontable open={addcontablesOpen} toggle={toggleAddcontablesDrawer} />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={headerStyle}>
            <TableRow sx={{ '& .MuiTableCell-root': { py: (theme) => `${theme.spacing(2)} !important` } }}>
              <TableCell
                style={headStyle}
                sx={{
                  headerClassName: 'super-app-theme--header',
                }}
              >
                Acciones
              </TableCell>
              <TableCell style={headStyle}>Vida Útil</TableCell>

              <TableCell style={headStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Nombre De Categoría</span>
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={anchorNl ? 'long-menu' : undefined}
                    aria-expanded={anchorNl ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClickNomb}
                    style={{ marginLeft: 'auto' }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </div>
                <Menu
                  id="long-menu"
                  MenuListProps={{
                    'aria-labelledby': 'long-button',
                  }}
                  anchorEl={anchorNl}
                  open={Boolean(anchorNl)}
                  onClose={handleCloseOptionNomb}
                  PaperProps={{
                    style: {
                      width: '20ch',
                    },
                  }}
                >
                  <MenuItem>
                    <ListItemText>
                      <TextField
                        variant="standard"
                        onChange={Filter}
                        label="Buscar Nombre de Categoria"
                        sx={{ flex: 1, borderRadius: '10px' }}
                        autoComplete="off"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon icon="mdi:magnify" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </ListItemText>
                  </MenuItem>
                </Menu>
              </TableCell>
              <TableCell style={headStyle}>Subcategoría (descripción)</TableCell>
            </TableRow>
          </TableHead>
          {/* FILTROS */}
          <TableHead style={headStyle}>
            <TableRow sx={{ '& .MuiTableCell-root': { py: (theme: { spacing: (arg0: number) => any }) => `${theme.spacing(2.8)} !important` } }}>
              <TableCell> </TableCell>
              <TableCell> </TableCell>

              <TableCell>
                <TextField
                  variant="standard"
                  onChange={Filter}
                  sx={{ flex: 2, borderRadius: '10px' }}
                  autoComplete="off"
                  InputLabelProps={{
                    style: { fontSize: '12px', color: 'grey' }, // Ajusta el tamaño de la fuente según tus necesidades
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FilterListIcon />
                      </InputAdornment>
                    ),
                    style: { fontSize: '14.5px', color: 'grey' },
                  }}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          {Array.isArray(assets) && assets.length > 0 ? (
            assets.map((asset) => (
              <TableBody key={asset._id}>
                <TableRow sx={{ '& .MuiTableCell-root': { py: (theme) => `${theme.spacing(2.5)} !important` } }}>
                  <TableCell
                    style={{
                      width: '50px',
                      textAlign: 'center',
                      fontFamily: 'Roboto, Arial, sans-serif',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <SidebarEditContable2 ContableId={asset._id} open={isSidebarEditOpen} toggle={() => setIsSidebarEditOpen(!isSidebarEditOpen)} />
                    <Button
                      sx={{ m: '9px  0 0 0' }}
                      fullWidth
                      size="small"
                      style={{ color: '#e53935', borderRadius: '10px', width: '45px', marginBottom: '1px', top: '0.1px', height: '30.1px' }}
                      variant="outlined"
                      onClick={() => handleDelete(asset._id)}
                    >
                      <Icon icon="mdi:delete-outline" fontSize={18} />
                    </Button>
                  </TableCell>
                  <TableCell style={bodystyle}>{asset.usefulLife}</TableCell>

                  <TableCell style={bodystyle}>{asset.assetCategory}</TableCell>
                  <TableCell style={{ fontSize: '12.9px', height: '50px', width: '50px', fontFamily: 'Roboto, Arial, sans-serif', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)' }}>
                    {/* Contenido de la celda */}
                  </TableCell>
                </TableRow>
              </TableBody>
            ))
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={12} align="center">
                  <CircularProgress /> {/* Loading spinner */}
                </TableCell>
              </TableRow>
            </TableBody>
          )}
                <Dialog open={isDeleteConfirmationOpen} onClose={handleClose}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas eliminar este Grupo Contable?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancelled} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirmed} color="primary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalGrupo} // Asegúrate de reemplazar esto con el valor real de tu conteo de filas
        page={parseInt(page, 10)} // Asegúrate de que page sea un número
        rowsPerPage={parseInt(limit, 10)}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
        rowsPerPageOptions={[2, 5, 10, 100]}
        onPageChange={(event, newPage) => {
          setPage(parseInt(newPage, 10)); // Asegúrate de que newPage sea un número
        }}
      />
    </>
  );
};

export default AssetList;

