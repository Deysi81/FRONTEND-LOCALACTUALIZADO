import React, { useState, ChangeEvent, CSSProperties, Fragment, Ref, forwardRef, ReactElement } from 'react'
import {
  Button,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  Table,
  TableHead,
  Paper,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
  CircularProgress,
  Grid,
  TextField,
  SlideProps,
  Slide,
  tableCellClasses,
  InputAdornment,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

//ICONOS
import FilterListIcon from '@mui/icons-material/FilterList';
import Icon from 'src/@core/components/icon'
//CONTEXTOS
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAsset } from 'src/context/ProviderContext'
import SidebarAddSupplier from 'src/components/proveedores/addprovider';
import SidebarEditProvider from 'src/components/proveedores/editprovider';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
interface SidebarDeleteAssetProps {
  providerId: string;

}
interface informationAsset {
  asset: string;
  description: string;
}
interface Provider {
  _id: string;
  managerName: string;
  managerCi: string;
  managerPhone: number;
  businessAddress: string;
  email: string;
  businessName: string;
  NIT: string;
  informationAsset: informationAsset;
  asset: boolean;
}
interface Asset {
  _id: string;
  managerName: string;
  managerCi: string;
  managerPhone: number;
  businessAddress: string;
  email: string;
  businessName: string;
  NIT: string;
  informationAsset: informationAsset;
  asset: boolean;
}

interface state {
  _id: string,
  name: string,
  isDeleted: boolean

}
const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})
const AssetList: React.FC = () => {
  // const [assets, setAssets] = useState<Asset[]>([])
  const [addproviderOpen, setAddproviderOpen] = useState<boolean>(false);
  const toggleAddproviderDrawer = () => setAddproviderOpen(!addproviderOpen);
  const [open, setOpen] = React.useState(false);
  const [addAssetOpen, setAddAssetOpen] = useState<boolean>(false)
  const toggleAddAssetDrawer = () => setAddAssetOpen(!addAssetOpen)
  const { settings } = useSettings()
  const { mode } = settings
  const [deleteAssetId, setDeleteAssetId] = useState<string | null>(null);

//LLAMANDO AL CONTEXTO

let { assets,setnameSupplier,setLimit, deleteAsset,//handleDeleteConfirmed,
  page,setPage,limit,setmanagerPhone,
  setmanagerCi,setNIT,totalAssets} = useAsset();

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<boolean>(false)
  const [isSidebarEditOpen, setIsSidebarEditOpen] = useState(false);
  const handleClosedial = () => {
    // Lógica para cerrar el diálogo
    setIsDeleteConfirmationOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setIsDeleteConfirmationOpen(false);
  };

  const handleDeleteCancelled = () => {
    setIsDeleteConfirmationOpen(false)
  }
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

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9'
    }
  }))
  //estilo para dia y noche

  const headerStyle = {
    backgroundColor: mode === 'light' ? '#8c90f0' : '#5a5c75',
    color: mode === 'light' ? 'black' : 'white',
    width: '100%',
    height: '1rem',
    fontFamily: 'Roboto, Arial, sans-serif'
  }
  const headeresti: CSSProperties = {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontSize: '13px',
    width: '50px',
    color:'white' ,
    borderRight: '1px solid rgba(224, 224, 224, 1)',
     borderBottom: '1px solid rgba(224, 224, 224, 1)'

  }

//PAGINACION
const handleChangeRowsPerPage = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  setLimit(parseInt(event.target.value, 10))
  setPage(0);
};

//filtro para nombres
const Filter=((e:ChangeEvent<HTMLInputElement>)=>{
  setnameSupplier(e.target.value);

})
//FILTRO PARA NIT
const FilterNIT=((e:ChangeEvent<HTMLInputElement>)=>{
  setNIT(e.target.value);

})

//FILTRO PARA TELEFONO
const FilterPhone=((e:ChangeEvent<HTMLInputElement>)=>{
  setmanagerPhone(e.target.value);

})

//FILTRO PARA Ci
const FilterCi=((e:ChangeEvent<HTMLInputElement>)=>{
  setmanagerCi(e.target.value);

})
    const limits=((e:ChangeEvent<HTMLInputElement>)=>{
      setLimit(e.target.value);
    })


///MENU OPTION FILTROS PARA NOMBRE
const [anchorNl, setAnchorNl] = React.useState<null | HTMLElement>(null);

const handleClickNomb = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorNl(event.currentTarget);
};
const handleCloseOptionNomb = () => {
  setAnchorNl(null);
};
///MENU OPTION FILTROS PARA NIT
const [anchorNiTl, setAnchorNiTl] = React.useState<null | HTMLElement>(null);

const handleClickNit = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorNiTl(event.currentTarget);
};
const handleCloseOptionNit = () => {
  setAnchorNiTl(null);
};

///MENU OPCTION FILTROS PARA celular
const [anchorTl, setAnchorTl] = React.useState<null | HTMLElement>(null);
const ITEM_HEIGHT = 48;
const handleClickPhone = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorTl(event.currentTarget);
};
const handleCloseOptionPhone = () => {
  setAnchorTl(null);
};
///MENU OPCTION FILTROS PARA CI
const [anchorCIl, setAnchorCIl] = React.useState<null | HTMLElement>(null);
const handleClickCi = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorCIl(event.currentTarget);
};
const handleCloseOptionCi = () => {
  setAnchorCIl(null);
};
    const bodystyle: CSSProperties = {
      width:'50px',
      fontSize:'13px',
      fontFamily: 'Roboto, Arial, sans-serif',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
      height:'2px',

    }
  return (
    <>
    <Grid container>
    <Grid xs={7} ml={2} lg={15}>
      <Button
        style={{ textTransform: 'uppercase', minWidth: '210px', marginLeft: '-8px', float: 'left' }}
        sx={{ mb: 2, margin: '0 720px 8px 0' }}
        variant='contained'
        onClick={toggleAddproviderDrawer}
      >
        NUEVO Proveedor
      </Button>
      <SidebarAddSupplier open={addproviderOpen} toggle={toggleAddproviderDrawer} />
          <TextField
          onChange={Filter}
          label="Buscar Proveedor"
          variant="standard"
          sx={{ flex: 2, borderRadius: '10px', marginLeft: '-8px', float: 'left',marginBottom:'7px' }}
          autoComplete='off'
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon='mdi:magnify' />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead style={headerStyle}>
            <TableRow sx={{ '& .MuiTableCell-root': { py: (theme) => `${theme.spacing(2)} !important` } }}>
              <TableCell style={headeresti} sx={{headerClassName: 'super-app-theme--header',}}>
                 Acciones
              </TableCell>
              <TableCell style={headeresti}>
                 Nombre
              </TableCell>
              <TableCell style={headeresti}>
                 CI
              </TableCell>
              <TableCell style={headeresti}>
                 celular
              </TableCell>
              <TableCell style={headeresti}>
                Direccion
              </TableCell>
              <TableCell style={headeresti} >
                <span title="Correo electrónico ">{"Correo electrónico".substring(0, 8)+ ".."}</span>
              </TableCell>
              <TableCell style={headeresti}>
                NIT
              </TableCell>
              <TableCell style={headeresti}>
                <span title="NEGOCIO">{"NEGOCIO".substring(0, 7) + ""}</span>
              </TableCell>
              <TableCell style={headeresti}>
                Activos
              </TableCell>
              <TableCell style={headeresti}>
                Descripción
              </TableCell>

            </TableRow>
          </TableHead>

          {/* FILTROS */}
          <TableHead >
           <TableRow sx={{ '& .MuiTableCell-root': { py: (theme: { spacing: (arg0: number) => any; }) => `${theme.spacing(2.8)} !important` } }}>
            <TableCell>  </TableCell>
            <TableCell>
               <TextField
                       variant="standard"
                        onChange={Filter}
                        autoComplete='off'
                        InputProps=
                        {{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FilterListIcon />
                            </InputAdornment>

                          ),
                          style: { fontSize: '14.5px', color: 'grey'  }
                        }}
                      />
            </TableCell>
            <TableCell>
              <TextField
                        variant="standard"
                          onChange={FilterCi}
                          autoComplete='off'
                          InputProps=
                          {{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FilterListIcon />
                              </InputAdornment>
                            ),
                            style: { fontSize: '14.5px', color: 'grey'  }
                          }}
                        />
            </TableCell>
            <TableCell>
                {/* <TextField
                            variant="standard"
                              onChange={FilterPhone}
                              autoComplete='off'
                              InputProps=
                              {{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <FilterListIcon />
                                  </InputAdornment>

                                ),
                                style: { fontSize: '14.5px', color: 'grey'  }
                              }}
                            /> */}
            </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell>
              <TextField
                       variant="standard"
                        onChange={FilterNIT}
                        autoComplete='off'
                        InputProps=
                        {{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FilterListIcon />
                            </InputAdornment>

                          ),
                          style: { fontSize: '14.5px', color: 'grey'  }
                        }}
                      />
            </TableCell>
            <TableCell >  </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
          </TableRow>
        </TableHead>

          { Array.isArray(assets) && assets.length > 0 ? (
            assets.map(asset => (
              <TableBody key={asset._id}>
                <TableRow sx={{ '& .MuiTableCell-root': { py: theme => `${theme.spacing(2.5)} !important` } }}>
                <TableCell  style={{width: '180px',
                      textAlign: 'center',
                      // color: mode === 'light' ? 'black' : 'white',
                      fontFamily: 'Roboto, Arial, sans-serif',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'
                  }}>

                    <SidebarEditProvider providerId={asset._id} open={isSidebarEditOpen}toggle={()=>setIsSidebarEditOpen(!isSidebarEditOpen)}/>

                    <Button
                     size="small"
                     style={{ color: '#e53935', borderRadius: '10px',width: '20px',marginBottom:'7px' }}
                     variant="outlined"

                      onClick={() => handleDelete(asset._id)}
                    >
                      <Icon icon="mdi:delete-outline" fontSize={18} />
                    </Button>

                </TableCell>

                <TableCell style={bodystyle}>
                  {asset.managerName}
                </TableCell>
                <TableCell style={bodystyle}>
                  {asset.managerCi}
                </TableCell>
                   <TableCell
                    style={bodystyle}
                  >
                    {asset.managerPhone}
                  </TableCell>
                  <HtmlTooltip title={<React.Fragment>{asset.businessAddress}</React.Fragment>}>
                  <TableCell style={bodystyle}>
                    {asset.businessAddress.substr(0, 14)}
                  </TableCell>
                </HtmlTooltip>
                <HtmlTooltip title={<React.Fragment>{asset.email}</React.Fragment>}>
                  <TableCell style={bodystyle}>
                    {asset.email.substr(0, 10)}
                  </TableCell>
                </HtmlTooltip>
                <TableCell  style={bodystyle}>
                  {asset.NIT}
                </TableCell>
                <TableCell  style={{width:'150px',
                          textAlign: 'center',
                          fontSize:'13.8px',
                          // color: mode === 'light' ? 'black' : 'white',
                          fontFamily: 'Roboto, Arial, sans-serif',
                          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'
                    }}>
                  {asset.businessName}
                </TableCell>
                <TableCell  style={bodystyle}>
                  {asset?.informationAsset[0]?.asset}
                </TableCell>
                <HtmlTooltip title={<React.Fragment>{asset?.informationAsset[0]?.description}</React.Fragment>}>
                  <TableCell style={bodystyle}>
                    {asset?.informationAsset[0]?.description?.substr(0, 15)}
                  </TableCell>
                </HtmlTooltip>

                </TableRow>
              </TableBody>
            ))
          ):(
            <TableBody>
            <TableRow>
              <TableCell colSpan={12} align="center">
                <CircularProgress /> {/* Loading spinner */}
              </TableCell>
            </TableRow>
          </TableBody>
          )
          }
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
              count={totalAssets} // Asegúrate de reemplazar esto con el valor real de tu conteo de filas
              page={parseInt(page,10)} // Asegúrate de que page sea un número
              rowsPerPage={parseInt(limit,10)}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página"
              rowsPerPageOptions={[2, 5, 10, 100]}
            onPageChange={(event, newPage) => {
              setPage(parseInt(newPage, 10)); // Asegúrate de que newPage sea un número
            }}
        />
    </>
  )
 }
 export default AssetList


