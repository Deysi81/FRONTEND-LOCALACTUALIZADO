import React, { useState, ChangeEvent, CSSProperties, Fragment, Ref, forwardRef, ReactElement } from 'react'
import axios from 'axios'
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
  IconButton,
  Grid,
  TextField,
  SlideProps,
  Slide,
  tableCellClasses,
  ListItemText,
  InputAdornment,
  Link,
  TablePagination,
} from '@mui/material'

//ICONOS
import FilterListIcon from '@mui/icons-material/FilterList';
import Icon from 'src/@core/components/icon'

import { useSettings } from 'src/@core/hooks/useSettings'
import { useAsset } from 'src/context/ProviderContext'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [dates] = useState<string[]>([])

  const [addAssetOpen, setAddAssetOpen] = useState<boolean>(false)
  const toggleAddAssetDrawer = () => setAddAssetOpen(!addAssetOpen)
  const { settings } = useSettings()
  const { mode } = settings
  const [expandedRows, setExpandedRows] = useState<string[]>([]);


//LLAMANDO AL CONTEXTO

let { assets,setnameSupplier,setLimit, deleteAsset,handleDeleteConfirmed,//generatenewPdf
  stateDB,setmanagerPhone,page,setPage, limit,
  setmanagerCi,setNIT,totalAssets} = useAsset();

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<boolean>(false)
  const [userIdToDelete, setUserIdToDelete] = useState<string>('')
  const [isSidebarEditOpen, setIsSidebarEditOpen] = useState(false);


  const handleDeleteCancelled = () => {
    setIsDeleteConfirmationOpen(false)
  }
 const handleDeleteConfirme =()=>{
  handleDeleteConfirmed
 }

  const handleDelete = async (id: string) => {
    // const assetIds = [...new Set([id, ...selectedRows])].flat();
    setUserIdToDelete(id)
    setIsDeleteConfirmationOpen(true)
    if(isDeleteConfirmationOpen){
      deleteAsset(selectedRows)
     }
  }





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

const [rowsPerPage, setRowsPerPage] = useState(10); // Asume que quieres mostrar 10 filas por página

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
      // const limit = parseFloat(e.target.value)
      setLimit(e.target.value);

      // console.log("v",value)

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
      // color: mode === 'light' ? 'black' : 'white',
      fontFamily: 'Roboto, Arial, sans-serif',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
      height:'2px',

    }

//IMPRIMIR EL QR

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
              <TableCell style={headeresti} sx={{

        headerClassName: 'super-app-theme--header',
      }}>
                Acciones
              </TableCell>
              <TableCell style={headeresti}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span >Nombre</span>
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

                    <MenuItem >
                      <ListItemText >
                      <TextField

                       variant="standard"
                        onChange={Filter}
                        label="Buscar Proveedor"

                        sx={{ flex: 1, borderRadius: '10px' }}
                        autoComplete='off'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon icon='mdi:magnify' />
                            </InputAdornment>
                          ),
                        }}
                      />
                      </ListItemText>
                    </MenuItem>

              </Menu>
            </TableCell>
            <TableCell style={headeresti}>
            {/* <Grid style={{ display: 'flex', alignItems: 'center' }}> */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span >CI</span>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={anchorCIl ? 'long-menu' : undefined}
              aria-expanded={anchorCIl ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClickCi}
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
                anchorEl={anchorCIl}
                open={Boolean(anchorCIl)}
                onClose={handleCloseOptionCi}
                PaperProps={{
                  style: {

                    width: '20ch',
                  },
                }}
              >

                    <MenuItem >
                      <ListItemText >
                      <TextField

                       variant="standard"
                        onChange={FilterCi}
                        label="Buscar Cedula de Identidad"

                        sx={{ flex: 1, borderRadius: '10px' }}
                        autoComplete='off'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon icon='mdi:magnify' />
                            </InputAdornment>
                          ),
                        }}
                      />
                      </ListItemText>
                    </MenuItem>

              </Menu>
            </TableCell>
            <TableCell style={headeresti}>
            {/* <Grid style={{ display: 'flex', alignItems: 'center' }}> */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span >celular</span>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={anchorTl ? 'long-menu' : undefined}
                  aria-expanded={anchorTl ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClickPhone}
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
                anchorEl={anchorTl}
                open={Boolean(anchorTl)}
                onClose={handleCloseOptionPhone}
                PaperProps={{
                  style: {

                    width: '20ch',
                  },
                }}
              >

                    <MenuItem >
                      <ListItemText >
                      <TextField

                       variant="standard"
                        onChange={FilterPhone}
                        label="Buscar numero de Celular"

                        sx={{ flex: 1, borderRadius: '10px' }}
                        autoComplete='off'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon icon='mdi:magnify' />
                            </InputAdornment>
                          ),
                        }}
                      />
                      </ListItemText>
                    </MenuItem>

              </Menu>
            </TableCell>

              <TableCell style={headeresti}>
                Direccion
              </TableCell>

                <TableCell
                  style={headeresti}
                >
                <span title="Correo electrónico ">{"Correo electrónico".substring(0, 9)+ "..."}</span>
                </TableCell>
                <TableCell style={headeresti}>
            {/* <Grid style={{ display: 'flex', alignItems: 'center' }}> */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span >NIT</span>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={anchorNiTl ? 'long-menu' : undefined}
                  aria-expanded={anchorNiTl ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClickNit}
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
                anchorEl={anchorNiTl}
                open={Boolean(anchorNiTl)}
                onClose={handleCloseOptionNit}
                PaperProps={{
                  style: {

                    width: '20ch',
                  },
                }}
              >

                    <MenuItem >
                      <ListItemText >
                      <TextField

                       variant="standard"
                        onChange={FilterNIT}
                        label="Buscar NIT"

                        sx={{ flex: 1, borderRadius: '10px' }}
                        autoComplete='off'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon icon='mdi:magnify' />
                            </InputAdornment>
                          ),
                        }}
                      />
                      </ListItemText>
                    </MenuItem>

              </Menu>
            </TableCell>
            <TableCell
                  style={headeresti}
                >
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
                <TextField
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
                            />
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

                    <SidebarEditProvider providerId={asset._id}></SidebarEditProvider>
                    <Button
                     size="small"
                     style={{ color: '#e53935', borderRadius: '10px',width: '20px',marginBottom:'7px' }}
                     variant="outlined"

                      onClick={() => handleDelete(asset._id)}
                    >
                      <Icon icon="mdi:delete-outline" fontSize={18} />
                    </Button>
                    {/* <Tooltip title='View'>
                    <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`src/pages/proveedores/preview/${asset._id}`}>
                      <Icon icon='mdi:eye-outline' />
                    </IconButton>
                  </Tooltip> */}
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



        </Table>

      </TableContainer>
      <TablePagination
              component="div"
              count={5} // Asegúrate de reemplazar esto con el valor real de tu conteo de filas
              page={parseInt(page, 10)} // Asegúrate de que page sea un número
              rowsPerPage={parseInt(limit, 10)}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página"
              rowsPerPageOptions={[2, 5, 50, 100]}
                onPageChange={(event, newPage) => {
                //   setPage(parseInt(newPage, 10)); // Asegúrate de que newPage sea un número
                // }}
                console.log('paramettttt', page)

                // setPage(params + 1)
                setPage(page)
              }}

            />
    </>
  )
 }
 export default AssetList


