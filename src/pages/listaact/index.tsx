import React, { useState, useEffect, ChangeEvent, CSSProperties } from 'react'
import axios from 'axios'
import {
  Button,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  Table,
  TableHead,
  ButtonGroup,
  Paper,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
  CircularProgress,
  Checkbox,
  Typography,
  Box,
  Collapse,
  IconButton,
  useTheme,
  Grid,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog,
  TablePagination,
  ListItemText,
  InputAdornment,
  Stack,
  Pagination,
  Select
} from '@mui/material'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Theme } from '@mui/material/styles';

import SidebarAddDesignar from 'src/components/DevolucionDeActivos/AddDevolucion'
import SidebarAddProvider from 'src/components/EntregaDeActivos/AddEntrega'

import SidebarEditAsset from '../../components/activos/editAsset'
import Icon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'
import SidebarAddAssetNew from 'src/components/activos/AddAssetNew'

import PDFViewer from 'src/components/activos/visorPdf'
import { useAsset } from 'src/context/AssetContext'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // Icono de PDF
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { jsPDF } from "jspdf";
import GetImage from 'src/components/activos/image';
//ICONOS
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface SidebarDeleteAssetProps {
  providerId: string;

}

interface supplier {
  _id: string
  managerName: string
  managerCi: number
  managerPhone: number
  businessAddress: string
  isDeleted: boolean
  email: string
  businessName: string
  NIT: string
}
interface state {
  _id: string,
  name: string,
  isDeleted: boolean

}
interface typeCategoryAsset {
  _id: string
  assetCategory: string
  usefulLife: number
  isDeleted: boolean
}

interface informationCountable {
  price: number
  dateAcquisition: Date
  warrantyExpirationDate: Date
  lote: number
  code: string
  documentPdf:string
}

interface codigoQR{
  _id: string,
  qrCodeDataUrl: string
  code:string
}


const AssetList: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

//PAGINACION

// const [rowsPerPage, setRowsPerPage] = useState(10); // Asume que quieres mostrar 10 filas por página


// const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number,) => {
//   setPage(newPage);
// };

const handleChangeRowsPerPage = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  setLimit(parseInt(event.target.value, 10))
  setPage(0);
};


  //abir QR
  const[res,setRes]=useState<codigoQR[]>([]);

  const [openQR, setOpenQR] = React.useState(false);
      const handleClickOpenQR = () => {
        setOpenQR(true);
      };

      const handleCloseQR = () => {
        setOpenQR(false);
      };
  const [dates] = useState<string[]>([])

  const [addAsignarOpen, setAddAsignarOpen] = useState<boolean>(false)
  const toggleAddAsignarDrawer = () => {

    setAddAsignarOpen(!addAsignarOpen)

    // if (addAsignarOpen) {
    //   setSelectedRows([]);
    // }
  }
  const [addDesignarOpen, setAddDesignarOpen] = useState<boolean>(false)
  const toggleAddDesignarDrawer = () => setAddDesignarOpen(!addDesignarOpen)

  const [addAssetOpen, setAddAssetOpen] = useState<boolean>(false)
  const toggleAddAssetDrawer = () => setAddAssetOpen(!addAssetOpen)
  const { settings } = useSettings()
  const { mode } = settings
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  //CODIGO QR
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


//LLAMANDO AL CONTEXTO

  let { assets,setnameAsset,setLimit, deleteAsset,handleDeleteConfirmed,generatenewPdf,stateDB,setState,page,setPage,limit,settypeCategoryAsset,setlocation,setcode,totalAssets} = useAsset();


  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
  const handleClosedial = () => {
    // Lógica para cerrar el diálogo
    setIsDeleteConfirmationOpen(false);
  };
  // const [userIdToDelete, setUserIdToDelete] = useState<string>('')
  const [isSidebarEditOpen, setIsSidebarEditOpen] = useState(false);

  const [isSidebarAsignartOpen, setIsSidebarAsignartOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulamos una carga de datos durante 5 segundos
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Limpia el timeout cuando el componente se desmonta o cuando isLoading cambia
    return () => clearTimeout(loadingTimeout);
  }, [page]);

  const handleDelete = async (id: any) => {
    // const assetIds = [...new Set([id, ...selectedRows])].flat();

    setIsDeleteConfirmationOpen(id)
    handleClose();
    setIsDeleteConfirmationOpen(true)
    if(isDeleteConfirmationOpen){
      deleteAsset(selectedRows)
      handleClose();
     }

  }
  const handleDeleteCancelled = () => {
    setIsDeleteConfirmationOpen(false)
  }
 const handleDeleteConfirme =()=>{
  handleDeleteConfirmed(selectedRows)
handleClosedial()
 }

  const generatePdf = async (id:string)=>{
    generatenewPdf(id)

  }
  const generateQR = async (id:string)=>{
    if(selectedRows.length <= 0){
      selectedRows.push(id)
    }
    GenerateQR(selectedRows)
  }


  // Agrega esta función en tu componente AssetList
  const convertBase64ToImageUrl = (base64String: string) => {
    return `data:image/png;base64,${base64String}`
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
    textAlign: 'center',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
     borderBottom: '1px solid rgba(224, 224, 224, 1)'

  }
  const headerfilter: CSSProperties = {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontSize: '13px',
    color:'white' ,
    textAlign: 'initial',


  }

  const headersty: CSSProperties = {
    // backgroundColor: mode === 'light' ? '#8c90f0' : '#5a5c75',

    width: '100%',
    height: '1rem',
    fontFamily: 'Roboto, Arial, sans-serif'

  }
  const handleRowSelect = (rowId: string) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter(id => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  const theme = useTheme();

    const handleExpand = (assetId: string) => {
      if (expandedRows.includes(assetId)) {
        setExpandedRows(expandedRows.filter((id) => id !== assetId));
      } else {
        setExpandedRows([...expandedRows, assetId]);
      }
    };
//filtro para nombres
    const Filter=((e:ChangeEvent<HTMLInputElement>)=>{
      setnameAsset(e.target.value);

    })
//FILTRO PARA TYPECATEGORY
const FilterCategory=((e:ChangeEvent<HTMLInputElement>)=>{
  settypeCategoryAsset(e.target.value);

})

//FILTRO PARA UBICACION
const FilterUbicacion=((e:ChangeEvent<HTMLInputElement>)=>{
  setlocation(e.target.value);

})

//FILTRO PARA UBICACION
const FilterCode=((e:ChangeEvent<HTMLInputElement>)=>{
  setcode(e.target.value);

})

    const limits=((e:ChangeEvent<HTMLInputElement>)=>{
      setLimit(e.target.value);

    })
    const GenerateQR =async (codes_qr: string[]) => {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset/get-asset-generate-QR`,{QR:codes_qr},
          );
        setRes(res.data)

        handleClickOpenQR()


      } catch (error:any) {
        alert(error.response?.data.message);
        handleClickOpenQR()

      }
    };

      const handlePrint = () => {
        // Crear un nuevo documento PDF
        const doc = new jsPDF({
          orientation: 'portrait', // Cambiar la orientación a portrait
          unit: 'cm',
          format: [4, 4],
        });

        // Tamaño de página inicial (4x4 cm)
        const pageSize = { width: 4, height: 4 };
        let firstPage = true;

        // Iterar a través de los elementos res y agregar códigos QR al PDF
        res.forEach((item, index) => {
          if (firstPage) {
            firstPage = false;
          } else {
            // Agregar una nueva página para cada código QR, excepto la primera
            doc.addPage([pageSize.width, pageSize.height]);
          }

          // Calcular el tamaño del código QR en función del espacio disponible en la página
          const qrWidth = pageSize.width - 0; // Deja un margen de 1 cm
          const qrHeight = pageSize.height - 1; // Deja un margen de 1 cm
          const textPositionX = 1; // Posición X del texto
          const textPositionY = 0.5; // Posición Y del texto

          // Centrar el código QR en la página
          const qrX = (pageSize.width - qrWidth) / 2;
          const qrY = (pageSize.height - qrHeight) / 2;

          // Añadir el código QR centrado en la página
          doc.addImage(item.qrCodeDataUrl, 'PNG', qrX, qrY, qrWidth, qrHeight);

          const fontSize = 8; // Tamaño de fuente pequeño
          doc.setFontSize(fontSize);
          // Añadir el texto encima del código QR
          doc.text(textPositionX, textPositionY, item.code);

          // Ajustar el tamaño de página para la siguiente página
          if (index < res.length - 1) {
            pageSize.width = 4; // Mantener el ancho
            pageSize.height = 4; // Mantener la altura
          }
        });

        // Guardar o abrir el PDF
        doc.save('codigos_qr.pdf');
      };

    // const handlePrint = () => {
    //   const printWindow = window.open('', '', 'width=600,height=600');
    //   if (printWindow) {
    //     printWindow.document.open();
    //     printWindow.document.write(`
    //       <html>
    //       <head>
    //         <title>Imprimir Códigos QR</title>
    //         <style>
    //           @media print {
    //             body {
    //               margin: 0;
    //               padding: 0;
    //               max-width: 100%;
    //               max-height: 100%;
    //               page-break-after: always;
    //             }
    //             img {
    //               max-width: 100%;
    //               max-height: 100%;
    //               width: auto;
    //               height: auto;
    //             }
    //           }
    //         </style>
    //       </head>
    //       <body>
    //     `);

    //     // Map over 'res' to print multiple QR codes and their codes
    //     res.forEach((item) => {
    //       printWindow.document.write(`
    //         <div style="text-align: center;">
    //           <p>${item.code}</p>
    //           <img src="${item.qrCodeDataUrl}" alt="Código QR" />
    //         </div>
    //       `);
    //     });

    //     printWindow.document.write(`
    //       <script>
    //         window.onload = function() {
    //           setTimeout(function() {
    //             window.print();
    //             window.onafterprint = function() {
    //               window.close();
    //             };
    //           }, 1000); // Add a 1-second delay (adjust as needed)
    //         }
    //       </script>
    //       </body>
    //       </html>
    //     `);

    //     printWindow.document.close();
    //   } else {
    //     console.error("No se pudo abrir la ventana de impresión.");
    //   }
    // };

///MENU OPTION FILTROS PARA NOMBRE
const [anchorNl, setAnchorNl] = React.useState<null | HTMLElement>(null);

const handleClickNomb = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorNl(event.currentTarget);
};
const handleCloseOptionNomb = () => {
  setAnchorNl(null);
};
///MENU OPTION FILTROS PARA CATEGORIA
const [anchorTl, setAnchorTl] = React.useState<null | HTMLElement>(null);

const handleClickType = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorTl(event.currentTarget);
};
const handleCloseOptionType = () => {
  setAnchorTl(null);
};

///MENU OPCTION FILTROS PARA STATE
const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
const ITEM_HEIGHT = 48;
const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorEl(event.currentTarget);
};
const handleCloseOption = () => {
  setAnchorEl(null);
};
///MENU OPTION FILTROS PARA NOMBRE
const [anchorUl, setAnchorUl] = React.useState<null | HTMLElement>(null);

const handleClickUbi = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorUl(event.currentTarget);
};
const handleCloseOptionUbi = () => {
  setAnchorUl(null);
};

///MENU OPTION FILTROS PARA CODIGO
const [anchorCodl, setAnchorCodl] = React.useState<null | HTMLElement>(null);

const handleClickCod = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorCodl(event.currentTarget);
};
const handleCloseOptionCod = () => {
  setAnchorCodl(null);
};


//FILTRADO ESTADO
const FilterState=(value: string) => {
  setState(value);

  handleClose();

}


  return (
    <>
    <Dialog  onClose={handleCloseQR} aria-labelledby='customized-dialog-title' open={openQR} maxWidth="md" >
        <DialogTitle id='customized-dialog-title' sx={{ p: 2 }} style={{textAlign: 'center'}}>
            <Typography variant='h5' component='span'>
            Codigo QR
            <Typography>
            INFORMACION DEL ACTIVO
            </Typography>
            </Typography>
            <IconButton
              aria-label='close'
              onClick={handleCloseQR}
              sx={{ top: -1, right: -1, position: 'absolute', color: 'grey.500' }}
            >
              <Icon icon='mdi:close' />
              </IconButton>
        </DialogTitle>
          <DialogContent dividers sx={{ p: 3, textAlign: 'center' }}>
              {Array.isArray(res) ? (
        res.map((item) => (
          <div key={item.code} style={{ float:'left' }}>
          <p>{item.code}</p>
            <img
      src={`${item.qrCodeDataUrl}`}
      alt="Código QR"
              style={{
                cursor: 'pointer',
                maxWidth: '4cm',
                maxHeight: '4cm',
                textAlign: 'center',
                marginBottom: '7px'
              }}
              onClick={handleClickOpen}
            />
          </div>
        ))
      ) : (
        <p>No se puedo cargar el codigo qr.</p>
      )}
          <br />
        <Grid container spacing={1}>
            <Grid item xs={6}>
            <Button style={{ width: '8rem' }} size='small' type='submit' variant='contained' onClick={()=>handleCloseQR()}>Aceptar</Button>
            </Grid>
            <Grid item xs={6}>
            <Button style={{ width: '8rem' }} size='small' variant='contained' onClick={handlePrint}>Imprimir</Button>
            </Grid>
          </Grid>

      </DialogContent>
    </Dialog>
    <Grid container spacing={2} mb={0}>
      <Grid xs={7} ml={4} lg={15}>
          <Button
            style={{ textTransform: 'uppercase', minWidth: '210px', marginLeft: '-8px', float: 'left' }}
            sx={{ mb: 2, margin: '0 15px 8px 0' }}
            variant='contained'
            onClick={toggleAddAssetDrawer}
          >NUEVO Activo</Button>
          <SidebarAddAssetNew open={addAssetOpen} toggle={toggleAddAssetDrawer} />

          <Button
            style={{ minWidth: '210px', marginLeft: '-8px', float: 'left' }}
            sx={{ mb: 1, margin: '0 15px 8px 0' }}
            variant='contained'
            onClick={toggleAddAsignarDrawer}
            disabled={selectedRows.length <= 1} // Bloquea el botón si selectedRows es menor o igual a 0
          > Asignar En Bloque</Button>

          <Button
            style={{ minWidth: '210px', marginLeft: '-8px', float: 'left' }}
            sx={{ mb: 1, margin: '0 250px 8px 0' }}
            variant='contained'
            onClick={toggleAddDesignarDrawer}
            disabled={selectedRows.length <= 1} // Bloquea el botón si selectedRows es menor o igual a 0
          > Designar En Bloque </Button>
        </Grid>
    </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead style={headerStyle}>
            <TableRow sx={{ '& .MuiTableCell-root': { py: (theme: { spacing: (arg0: number) => any; }) => `${theme.spacing(2.5)} !important` } }}>
                <TableCell style={{ width: '10px' , borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)'}} sx={{ textAlign: 'center' }}>
                  {/* Columna de selección */}
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < assets.length}
                    checked={selectedRows.length === assets.length}
                    onChange={() => {
                      if (selectedRows.length === assets.length) {
                        setSelectedRows([]);
                      } else {
                        setSelectedRows(assets.map(row => row._id));
                      }}} /></TableCell>
                <TableCell style={{fontSize: '13px',width: '100px',color:'white',borderBottom: '1px solid rgba(224, 224, 224, 1)'}} > ACCIONES</TableCell>
                <TableCell style={{fontSize: '13px',width: '30px',color:'white' ,textAlign: 'center',borderBottom: '1px solid rgba(224, 224, 224, 1)'}}></TableCell>
                <TableCell style={headeresti}> </TableCell>
                <TableCell style={headeresti}> Estado</TableCell>
                <TableCell style={headeresti}> Imagen</TableCell>
                <TableCell style={headeresti}> Documento</TableCell>
                <TableCell style={headeresti}> Nombre</TableCell>
                <TableCell style={headeresti}> Ubicación</TableCell>
                <TableCell style={headeresti}> Precio </TableCell>
                <TableCell style={headeresti}> Categoria</TableCell>
           </TableRow>
          </TableHead>
{/* FILTROS */}
          <TableHead style={headersty}>
           <TableRow sx={{ '& .MuiTableCell-root': { py: (theme: { spacing: (arg0: number) => any; }) => `${theme.spacing(2.8)} !important` } }}>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
            <TableCell>  </TableCell>
            <TableCell style={headerfilter}>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={anchorEl ? 'long-menu' : undefined}
                  aria-expanded={anchorEl ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                     >
                      <TextField
                       variant="standard"
                        autoComplete='off'
                        InputProps=
                        {{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ArrowDropDownIcon />
                            </InputAdornment>
                          ),
                          style: { fontSize: '14.5px', color: 'grey'  }
                        }}
                      />
                </IconButton>
              <Menu
                id="long-menu"
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseOption}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 5.5,
                    width: '14ch',
                  },
                }}
              >
                <MenuItem onClick={() => FilterState("")}>TODOS</MenuItem>
                 {stateDB?.map((state:any) => (
                    <MenuItem key={state.name} onClick={() => FilterState(state.name)}>
                      <ListItemText >{state.name}</ListItemText>
                    </MenuItem>
                  ))}
              </Menu>
            </TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
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
            <TableCell >
                      <TextField
                       variant="standard"
                        onChange={FilterUbicacion}
                        sx={{ flex: 2, borderRadius: '10px' }}
                        autoComplete='off'

                        InputProps={{
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
            <TableCell >
                      <TextField
                       variant="standard"
                        onChange={FilterCategory}
                        sx={{ flex: 2, borderRadius: '10px' }}
                        autoComplete='off'
                        InputLabelProps={{

                          style: { fontSize: '12px', color: 'grey' } // Ajusta el tamaño de la fuente según tus necesidades
                        }}

                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FilterListIcon />
                            </InputAdornment>
                          ),
                          style: { fontSize: '14.5px', color: 'grey'  }
                        }}
                      />
            </TableCell>
          </TableRow>
        </TableHead>
          { Array.isArray(assets) && assets.length > 0 ? (
           assets.map(asset => (
       <TableBody key={asset._id}>
           <TableRow sx={{ '& .MuiTableCell-root': { py: (theme: { spacing: (arg0: number) => any; }) => `${theme.spacing(2.5)} !important` } }}>
             <TableCell >
                  {/* Checkbox para cada fila */}
                  <Checkbox
                    checked={selectedRows.includes(asset._id)}
                    onChange={() => handleRowSelect(asset._id)}
                  /></TableCell >
             <TableCell style={{ width: '100px' }}>
                        <div>

                      <SidebarEditAsset providerId={asset._id} selectedEdit={selectedRows} open={isSidebarEditOpen} setSelectedRows={setSelectedRows} toggle={()=>setIsSidebarEditOpen(!isSidebarEditOpen)}/>

                          <Button
                          sx={{ mb: 1 }}
                            fullWidth
                            size='small'
                            style={{ color: '#e53935', borderRadius: '10px',width: '65px',marginBottom:'13px' }}
                            variant='outlined'
                            onClick={() => {
                              if (selectedRows.length === 0) {
                              // Si no hay elementos seleccionados, selecciona el activo automáticamente
                              setSelectedRows([asset._id]);
                              }
                              handleDelete(asset._id);
                              }}
                            //onClick={() => handleDelete(asset._id) }
                          >
                            <Icon icon='mdi:delete-outline' fontSize={19} />
                          </Button>
                          </div>
                      {/* <Dialog  onClose={handleCloseQR} aria-labelledby='customized-dialog-title' open={openQR} maxWidth="md" > */}
                            <Dialog open={isDeleteConfirmationOpen} onClose={handleClosedial}>
                              <DialogTitle>Confirmar eliminación</DialogTitle>
                              <DialogContent>
                                <DialogContentText>
                                  ¿Estás seguro que deseas eliminar este Activo?
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={handleDeleteCancelled} color="primary">
                                  Cancelar
                                </Button>
                                <Button onClick={() => handleDeleteConfirme()} color="primary">
                                  Eliminar
                                </Button>
                              </DialogActions>
                            </Dialog>
             </TableCell>
             <TableCell style={{ width: '30px' }} sx={{ textAlign: 'center' }}>
                <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '-1px' }}>
                    <div>
                        {asset.assigned ? (
                          <li>
                          <Button size='small'
                              style={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '-1px', width: '120px', height: '30px',marginTop:'-20px' }}
                              onClick={() => {
                              if (selectedRows.length === 0) {
                              // Si no hay elementos seleccionados, selecciona el activo automáticamente
                              setSelectedRows([asset._id]);
                              }
                              toggleAddDesignarDrawer();
                              }}> Devolución</Button>
                             <SidebarAddDesignar selectedDevolution={selectedRows} open={addDesignarOpen} setSelectedRows={setSelectedRows} toggle={toggleAddDesignarDrawer} />
                         </li>
                           ) : (
                         <li> <Button  size='small'
                              style={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '-1px', width: '120px', height: '30px',marginTop:'-20px' }}
                              onClick={() => {
                              if (selectedRows.length === 0) {
                              // Si no hay elementos seleccionados, selecciona el activo automáticamente
                              setSelectedRows([asset._id]);
                              }
                              toggleAddAsignarDrawer();
                              }} > Asignar</Button>
                              <SidebarAddProvider assetId={asset._id}   selectedAsignar={selectedRows} setSelectedRows={setSelectedRows} open={addAsignarOpen} toggle={toggleAddAsignarDrawer} />
                         </li> )}
                    </div>

                         <li style={{ marginTop: '10px' }}>
                              <Button size='small' variant='contained'
                                style={{
                                  color: '#fff', // Cambia el color del texto
                                  borderRadius: '8px', // Agrega bordes redondeados
                                  width: '120px',
                                  height: '24px', // Ajusta la altura
                                  fontSize: '12px',
                                  marginTop:'-17px' // Cambia el tamaño del texto

                                }}
                            onClick={() => generatePdf(asset._id)}
                          >Generar PDF</Button>
                        </li>
                        <li style={{ marginTop: '10px' }}>
                              <Button size='small' variant='contained'
                                style={{
                                  color: '#fff', // Cambia el color del texto
                                  borderRadius: '8px', // Agrega bordes redondeados
                                  width: '120px',
                                  height: '24px', // Ajusta la altura
                                  fontSize: '12px', // Cambia el tamaño del texto
                                  marginTop:'-20px'
                                }}
                                onClick={() => generateQR(asset._id)}
                              > Generar Qr </Button>
                        </li>
                </ul>
             </TableCell>
             <TableCell style={{fontSize: '13px',fontWeight: 'bold', width: '10px', color:'white'  }} sx={{ textAlign: 'center' }}>
                      <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleExpand(asset._id)}
                        >
                          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
            </TableCell>
            <TableCell style={{ width: '50px', textAlign: 'center' }}>
                {asset?.state?.name === "DISPONIBLE" ? (
                  <Typography
                    style={{
                      color: asset.state.name === "DISPONIBLE" ? (theme.palette.mode === "dark" ? "white" : "green") : (theme.palette.mode === "dark" ? "white" : "red"),
                      backgroundColor: asset.state.name === "DISPONIBLE" ? (theme.palette.mode === "dark" ? "rgba(0, 255, 0, 0.5)" : "rgba(0, 255, 0, 0.25)") : (theme.palette.mode === "dark" ? "rgba(255, 0, 0, 0.5)" : "rgba(255, 0, 0, 0.25)"),
                      borderRadius: 15,
                      padding: 6,
                    }}
                  >
                    Disponible
                  </Typography>
                ) : asset?.state?.name === "ASIGNADO" ? (
                  <Typography
                  style={{
                    color: asset.state.name === "ASIGNADO" ? (theme.palette.mode === "dark" ? "white" : "red") : (theme.palette.mode === "dark" ? "white" : "green"),
                    backgroundColor: asset.state.name === "ASIGNADO" ? (theme.palette.mode === "dark" ? "rgba(255, 0, 0, 0.5)" : "rgba(255, 0, 0, 0.25)") : (theme.palette.mode === "dark" ? "rgba(0, 255, 0, 0.5)" : "rgba(0, 255, 0, 0.25)"),
                    borderRadius: 15,
                    padding: 6,
                  }}
                >
                  Asignado
                </Typography>

                ) : asset?.state?.name === "MANTENIMIENTO" ? (
                  <Typography
                  style={{
                    color: asset.state.name === "MANTENIMIENTO" ? (theme.palette.mode === "dark" ? "white" : "#b32900") : (theme.palette.mode === "dark" ? "white" : "yellow"),
                    backgroundColor: asset.state.name === "MANTENIMIENTO" ? (theme.palette.mode === "dark" ? "rgba(255, 165, 0, 0.5)" : "rgba(255, 165, 0, 0.25)") : (theme.palette.mode === "dark" ? "rgba(255, 255, 0, 0.5)" : "rgba(255, 255, 0, 0.25)"),
                    borderRadius: 15,
                    padding: 6,
                  }}
                >
                  Mantenimiento
                </Typography>
                ) : null}
              </TableCell>
            <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}><GetImage id={asset.file}/>  </TableCell>
            <TableCell style={{ width: '50px', textAlign: 'center' }}>
                     {asset?.informationCountable?.documentPdf? (
                        <button
                          onClick={() => {
                            const pdfWindow = window.open('', '_blank');
                            pdfWindow?.document.write(`<embed width="100%" height="100%" margin="0" src="data:application/pdf;base64,${asset?.informationCountable?.documentPdf}"/>`);
                          }}
                          style={{ textDecoration: 'none', color: '#1976d2', cursor: 'pointer', background: 'none', border: 'none' }}
                        > <PictureAsPdfIcon />
                            Abrir documento
                          </button>

                        ) : (
                          <span>No hay documento</span>
                        )}
            </TableCell>
            <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>{asset.name} </TableCell>
            <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>{asset?.location?.name} </TableCell>
            <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>{asset?.informationCountable?.price} </TableCell>
            <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>{asset?.typeCategoryAsset?.assetCategory} </TableCell>
        </TableRow>
        <TableRow sx={{ '& .MuiTableCell-root': { py: (theme: { spacing: (arg0: number) => any; }) => `${theme.spacing(2.5)} !important` } }}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0}} colSpan={13} >
                <Collapse in={expandedRows.includes(asset._id)} timeout="auto" unmountOnExit>
                   <Box sx={{ margin: 2 }}>
                        <Typography variant="h6" gutterBottom component="div" style={{ fontWeight: 'bold' }}>Mas informacion </Typography>
      <Table size="small" aria-label="purchases">
        <TableHead style={headerStyle}>
          <TableRow sx={{'&:nth-of-type(odd)': {
              backgroundColor: open ? theme.palette.mode === 'dark' ? '#4F6D80' : '#7bb0a8' : theme.palette.mode === 'dark' ? '#4F6D80' : '#7bb0a8'},}}>
                <TableCell style={headeresti}>Codigo </TableCell>
                <TableCell style={{ fontSize: '13px',width: '180px', color:'white'  , borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)'}} sx={{ textAlign: 'center' }}>
                    Descripción </TableCell>
                <TableCell style={headeresti}>Responsable </TableCell>
                <TableCell style={headeresti}>Proveedor </TableCell>
                <TableCell style={headeresti}>Fecha de adquisición </TableCell>
                <TableCell style={headeresti}>Fecha de expiración  </TableCell>
                <TableCell style={headeresti}>Valor Actual </TableCell>
                <TableCell style={headeresti}>mantenimiento de valor(ufv3) </TableCell>
                <TableCell style={headeresti}>monto actualizado(ufv4) </TableCell>
            </TableRow>
        </TableHead>
    <TableBody key={asset._id} >
          <TableRow sx={{ '& .MuiTableCell-root': { py: (theme: { spacing: (arg0: number) => any; }) => `${theme.spacing(2.5)} !important` } }}>
             <TableCell style={{ width: '50px', fontFamily: 'Arial, Helvetica, sans-serif' }}sx={{ textAlign: 'center' }}>{asset?.informationCountable?.code}</TableCell>
            <HtmlTooltip title={<React.Fragment>{asset.description}</React.Fragment>}>
             <TableCell style={{ width: '200px', fontFamily: 'Arial, Helvetica, sans-serif' }}>{asset?.description?.length < 11 ? asset.description : `${asset?.description?.substr(0, 120)}..`}</TableCell>
            </HtmlTooltip>
             <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>{`${asset?.responsible}`} </TableCell>
             <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>{asset?.supplier?.managerName} </TableCell>
            <TableCell>{asset?.informationCountable?.dateAcquisition && new Date(asset?.informationCountable?.dateAcquisition).toLocaleDateString('es-ES')}</TableCell>
            <TableCell>{asset?.informationCountable?.warrantyExpirationDate && new Date(asset?.informationCountable?.warrantyExpirationDate).toLocaleDateString('es-ES')} </TableCell>
            <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>{asset?.depreciatedValue} Bs  </TableCell>
            <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>{asset.ufv3} Bs </TableCell>
            <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>{asset.ufv4} Bs </TableCell>
          </TableRow>
    </TableBody>
 </Table>
   </Box>
    </Collapse>
       </TableCell>
        </TableRow>
    </TableBody>
     ))
      ):(
   <TableBody>
      {isLoading ? (
       <TableRow>
          <TableCell colSpan={12} align="center"><CircularProgress /> </TableCell>
       </TableRow>
     ) : (
       <TableRow>
         <TableCell colSpan={12} align="center"> No hay activos disponibles.</TableCell>
       </TableRow>
     )}
   </TableBody>
     )}
  </Table>
  </TableContainer>
  <Stack spacing={2}>
      <TablePagination
          component="div"
          count={totalAssets}
          page={parseInt(page, 10)} // Asegúrate de que page sea un número
          rowsPerPage={parseInt(limit, 10)} // Asegúrate de que limit sea un número
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          rowsPerPageOptions={[2, 5, 10, 100]}
            onPageChange={(event, newPage) => {
              setPage(parseInt(newPage, 10)); // Asegúrate de que newPage sea un número
            }}
        />
      </Stack>
        {/* <Stack spacing={2}>
          <Pagination count={totalAssets} variant="outlined" color="primary"
          onChange={(event, newPage) => {
            setPage(parseInt(newPage, 10)); // Asegúrate de que newPage sea un número
          }}/>
           <Pagination
              count={totalAssets}
              page={page}
              onChange={(event, newPage) => {
                setPage(newPage);
              }}
              color="primary"
            />

        </Stack> */}


    </>
  )

 }
 export default AssetList


