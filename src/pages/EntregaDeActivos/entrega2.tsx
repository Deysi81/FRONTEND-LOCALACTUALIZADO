import React, { useState, CSSProperties, Fragment, Ref, forwardRef, ReactElement, ChangeEvent } from 'react'
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
  Typography,
  IconButton,
  useTheme,
  Grid,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog,
  SlideProps,
  Slide,
  tableCellClasses,
  TablePagination,
  TextField,
  InputAdornment,
  DialogActions
} from '@mui/material'

import SidebarEditEntrega from '../../components/EntregaDeActivos/editentrega';
import Icon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAsset } from 'src/context/entregacontext'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // Icono de PDF
import { Theme } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import { jsPDF } from "jspdf";
// import { findPermission } from 'src/components/findPermission';

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

interface Delivery {
  _id: string,
  receiver: string,
  chargeReceiver: string,
  transmitter: string,
  chargeTransmitter: string,
  location: string,
  asset: asets[]
  pdf:string
  isDeleted:boolean
  // asset: asets[]
}
interface asets {
  name: string,
  code: string,
  date: Date,
  file: string

}
interface state {
  _id: string,
  name: string,
  isDeleted: boolean

}

interface codigoQR{
  _id: string,
  qrCodeDataUrl: string
}


const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})
const AssetList: React.FC = () => {
  const [delivery, setDelivery] = useState<Delivery[]>([])
  const [open, setOpen] = React.useState(false);
  const { settings } = useSettings()
  const { mode } = settings
  const handleClickOpen = () => setOpen(true)
  //const handleClose = () => setOpen(false)
  const [deleteAssetId, setDeleteAssetId] = useState<string | null>(null);

  const theme = useTheme();


  //abir QR
  const[res,setRes]=useState<string>("")
  const [openQR, setOpenQR] = useState(false);
      const handleClickOpenQR = () => {
        setOpenQR(true);
      };

      const handleCloseQR = () => {
        setOpenQR(false);
      };

      const generateQR = async (id:string)=>{
        GenerateQR(id)
      }

      const GenerateQR =async (id: string) => {

        try {
          const res = await axios.get<codigoQR>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/get-asset-generate-QR/${id}`);
          console.log(res.data.qrCodeDataUrl,'aaaaaaaaaaaaaaaaaaaaaa')
          setRes(res.data.qrCodeDataUrl)
          handleClickOpenQR()
          // Otra opción es mostrar un indicador de carga mientras se procesa

    // 3. Mostrar la imagen en una etiqueta <img>

        } catch (error:any) {
          alert(error.response?.data.message);
          setRes("no Qr")
          handleClickOpenQR()

        }
      };
//LLAMANDO AL CONTEXTO

  let { assets,setlocation //,setValue
  ,settransmitterId,setreceiverId,setLimit,limit,deleteAsset,generatenewPdf,totalAssets,page,setPage
  } = useAsset();

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<boolean>(false)
  const [isSidebarEditOpen, setIsSidebarEditOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setIsDeleteConfirmationOpen(false);
  };

  const handleDeleteCancelled = () => {
    setIsDeleteConfirmationOpen(false);
  };

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
 const generatePdf = async (id:string)=>{
    generatenewPdf(id)

  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setLimit(parseInt(event.target.value, 10))
    setPage(0);
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
    color:'white' ,
    borderRight: ' 2px solid rgba(224, 224, 224, 9)',
    //  borderBottom: '1px solid rgba(224, 224, 224, 1)',
     boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'

  }
  const bodystyle: CSSProperties = {
    textAlign: 'center',
    fontSize:'12.7px',
    // color: mode === 'light' ? 'black' : 'white',
    fontFamily: 'Roboto, Arial, sans-serif',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'
  }
  const headersty: CSSProperties = {
    // backgroundColor: mode === 'light' ? '#8c90f0' : '#5a5c75',

    width: '100%',
    height: '1rem',
    fontFamily: 'Roboto, Arial, sans-serif'

  }

 //FILTRO PARA UBICACION
const FilterUbicacion=((e:ChangeEvent<HTMLInputElement>)=>{
  setlocation(e.target.value);

})
 //FILTRO PARA PERSONAL QUE ENTREGO
 const FilterPeronalEntrega=((e:ChangeEvent<HTMLInputElement>)=>{
  settransmitterId(e.target.value);

})
//FILTRO PARA PERSONAL QUE RECIBIO
const FilterPersonalRecibido=((e:ChangeEvent<HTMLInputElement>)=>{
  setreceiverId(e.target.value);

})
//  const handlePrint = () => {
//         // Crear un nuevo documento PDF
//         const doc = new jsPDF({
//           orientation: 'portrait', // Cambiar la orientación a portrait
//           unit: 'cm',
//           format: [4, 4],
//         });

//         // Tamaño de página inicial (4x4 cm)
//         const pageSize = { width: 4, height: 4 };
//         let firstPage = true;

//         // Iterar a través de los elementos res y agregar códigos QR al PDF
//         delivery.map((provider, index) => ( // Iterate over providers
//                     `<div key="${index}">${provider.asset.map((asset) => asset.code).join(', ')}</div>` // Access asset property for each provider
//                   )).join('')

//           // Calcular el tamaño del código QR en función del espacio disponible en la página
//           const qrWidth = pageSize.width - 0; // Deja un margen de 1 cm
//           const qrHeight = pageSize.height - 1; // Deja un margen de 1 cm
//           const textPositionX = 1; // Posición X del texto
//           const textPositionY = 0.5; // Posición Y del texto

//           // Centrar el código QR en la página
//           const qrX = (pageSize.width - qrWidth) / 2;
//           const qrY = (pageSize.height - qrHeight) / 2;

//           // Añadir el código QR centrado en la página
//           doc.addImage(res , 'PNG', qrX, qrY, qrWidth, qrHeight);

//           const fontSize = 8; // Tamaño de fuente pequeño
//           doc.setFontSize(fontSize);
//           // Añadir el texto encima del código QR
//           doc.text(textPositionX, textPositionY, item.code);

//           // Ajustar el tamaño de página para la siguiente página
//           if (index < res.length - 1) {
//             pageSize.width = 4; // Mantener el ancho
//             pageSize.height = 4; // Mantener la altura
//           }
//         });

//         // Guardar o abrir el PDF
//         doc.save('codigos_qr.pdf');
//       };


//IMPRIMIR EL QR

const handlePrint = () => {
  const printWindow = window.open('', '', 'width=600,height=600');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(`
      <html>
      <head>
        <title>Imprimir Código QR</title>
        <style>
        @media print {
          body {
            margin: 0;
            padding: 0;
            max-width: 100%;
            max-height: 100%;
            page-break-after: auto;
          }
          img {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
          }
        }
      </style>
      </head>
      <body>
        <div style="text-align: center;">
          ${delivery.map((provider, index) => ( // Iterate over providers
            `<div key="${index}">${provider.asset.map((asset) => asset.code).join(', ')}</div>` // Access asset property for each provider
          )).join('')} <!-- Close provider.map and join the HTML strings -->
        </div>
        <div style="text-align: center;">
        <img src="${res}" alt="Código QR" />
        </div>
        <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          }, 1000); // Agrega un retraso de 1 segundo (ajusta según sea necesario)
        }
      </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  } else {
    console.error("No se pudo abrir la ventana de impresión.");
  }
};
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead style={headerStyle}>
            <TableRow sx={{ '& .MuiTableCell-root': { py: (theme: { spacing: (arg0: number) => any; }) => `${theme.spacing(3.9)} !important` } }}>
                <TableCell style={{fontFamily: 'Roboto, Arial, sans-serif',fontSize: '13px', width: '190px',color:'white' }}>Acciones </TableCell>
                <TableCell style={headeresti}> </TableCell>
                <TableCell style={headeresti}sx={{width:'200px'}}>Estado</TableCell>
                <TableCell style={headeresti}sx={{width:'200px'}}>Usuario que entrega</TableCell>
                <TableCell style={headeresti}sx={{width:'200px'}}>Usuario que recibe </TableCell>
                <TableCell style={headeresti}sx={{width:'200px'}}>Ubicacion </TableCell>
                <TableCell style={headeresti} sx={{width:'150px'}}>Activos </TableCell>
                <TableCell style={{fontFamily: 'Roboto, Arial, sans-serif', fontSize: '13px',color:'white'}}>Actas </TableCell>
            </TableRow>
          </TableHead>

{/* //FILTROS */}
          <TableHead  style={headersty}>
            <TableRow sx={{ '& .MuiTableCell-root': { py: (theme: { spacing: (arg0: number) => any; }) => `${theme.spacing(2.9)} !important` } }}>
                <TableCell> </TableCell>
                <TableCell > </TableCell>
                <TableCell > </TableCell>
                <TableCell >
                <TextField
                       variant="standard"
                        onChange={FilterPeronalEntrega}
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
                <TableCell >
                <TextField
                       variant="standard"
                        onChange={FilterPersonalRecibido}
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
                      /> </TableCell>
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
                <TableCell > </TableCell>
            </TableRow>
          </TableHead>
           { Array.isArray(assets) && assets.length > 0 ? (
            assets.map(asset => (
          <TableBody key={asset._id}>
            <TableRow sx={{ '& .MuiTableCell-root': { py: (theme: { spacing: (arg0: number) => any; }) => `${theme.spacing(2.5)} !important` } }}>
                <TableCell  style={{width: '150px',textAlign: 'center',fontFamily: 'Roboto, Arial, sans-serif' }}>
                    <SidebarEditEntrega providerId={asset._id}></SidebarEditEntrega>

                          <Button sx={{ mb: 1 }} fullWidth size='small'  variant='outlined'
                          style={{ color: '#e53935', borderRadius: '10px',width: '30px',marginBottom:'2px' }}
                          onClick={() => handleDelete(asset._id)}>
                            <Icon icon="mdi:delete-outline" fontSize={20} />
                        </Button>


                </TableCell>
                <TableCell style={{textAlign: 'center',fontSize:'13.8px',fontFamily: 'Roboto, Arial, sans-serif',boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.3)',width:'150px' }} sx={{ textAlign: 'center' }}>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                      <li style={{ marginTop: '10px' }}>


                        <Button size='small' variant='contained'
                        style={{
                          color: '#fff', // Cambia el color del texto
                          borderRadius: '8px', // Agrega bordes redondeados
                          width: '115px',
                          height: '24px', // Ajusta la altura
                          fontSize: '12px', // Cambia el tamaño del texto
                        }}
                        onClick={() => generatePdf(asset._id)}
                      >Generar PDF
                      </Button>


                      </li>
                      <li style={{ marginTop: '10px' }}>

                          <Button size='small' variant='contained'
                          style={{
                            color: '#fff', // Cambia el color del texto
                            borderRadius: '8px', // Agrega bordes redondeados
                            width: '115px',
                            height: '24px', // Ajusta la altura
                            fontSize: '12px', // Cambia el tamaño del texto
                          }}
                          onClick={() => generateQR(asset._id)}
                        > Generar QR
                        </Button>


                      <Dialog onClose={handleCloseQR} aria-labelledby='customized-dialog-title' open={openQR}>
                          <DialogTitle id='customized-dialog-title' sx={{ p: 4 }} style={{ textAlign: 'center' }}>
                            <Typography variant='h6' component='span'>
                              Codigo QR
                            </Typography>
                            <Typography>INFORMACION DE LA ENTREGA</Typography>
                            <IconButton
                              aria-label='close'
                              onClick={() => setOpenQR(false)}
                              sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
                            >
                              <Icon icon='mdi:close' />
                            </IconButton>
                          </DialogTitle>
                          <DialogContent dividers sx={{ p: 4, textAlign: 'center' }}>

                          {asset.asset.map((asset, index) => (
                            <div key={index}>
                              {asset.code}
                            </div>
                          ))}

                            <img
                              src={res}
                              alt="Código QR"
                              style={{
                                cursor: 'pointer',
                                maxWidth: '500px',
                                maxHeight: '500px',
                                textAlign: 'center',
                                marginBottom: '9px',
                              }}
                              onClick={handleClickOpenQR}
                            />
                            <br />
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                              <Button style={{ width: '9rem' }} size='small' type='submit' variant='contained' onClick={()=>handleCloseQR()}>Aceptar</Button>
                              </Grid>
                              <Grid item xs={6}>
                              <Button style={{ width: '9rem' }} size='small' variant='contained' onClick={handlePrint}>Imprimir</Button>
                              </Grid>
                            </Grid>
                          </DialogContent>
                        </Dialog>
                    </li>
                  </ul>

                </TableCell>
                <TableCell style={bodystyle}>{asset.isDeleted}</TableCell>
                <TableCell style={bodystyle}>{asset.transmitter}</TableCell>
                <TableCell style={bodystyle}>{asset.receiver} </TableCell>
                <TableCell style={bodystyle}>{asset.location} </TableCell>
                <TableCell style={bodystyle}>
                   <Fragment>
                    <Button style={{fontFamily: 'Roboto, Arial, sans-serif',fontSize:'12.4px',}} onClick={handleClickOpen}>
                      Ver Informacion
                    </Button>
                    <Dialog
                      open={open}
                      keepMounted
                      onClose={handleClose}
                      TransitionComponent={Transition}
                      aria-labelledby='alert-dialog-slide-title'
                      aria-describedby='alert-dialog-slide-description'
                    >
                      <DialogTitle id='alert-dialog-slide-title'>INFORMACION DE LA ENTREGA DEL ACTIVO</DialogTitle>
                      <DialogContent>
                      <DialogContentText id='alert-dialog-slide-description'>
                        <TableContainer sx={{ maxHeight: 440 }}>
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead  >
                              <TableRow>
                                <StyledTableCell style={{backgroundColor: mode === 'light' ? '#8c90f0' : '#5a5c75'}}>ACTIVOS</StyledTableCell>
                                <StyledTableCell style={{backgroundColor: mode === 'light' ? '#8c90f0' : '#5a5c75'}} >CODIGO</StyledTableCell>
                                <StyledTableCell style={{backgroundColor: mode === 'light' ? '#8c90f0' : '#5a5c75'}}>FECHA ASIGNADA</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {asset.asset.map((asets, index) => (
                                <TableRow key={index}>
                                  <StyledTableCell>{asets.name}</StyledTableCell>
                                  <StyledTableCell >{asets.code}</StyledTableCell>
                                  <StyledTableCell >{asets.date}</StyledTableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </DialogContentText>

                      </DialogContent>
                    </Dialog>
                  </Fragment>
                </TableCell>


                <TableCell style={{fontFamily: 'Roboto, Arial, sans-serif',fontSize:'12.4px'}} sx={{  textAlign: 'center' }}>

                      {asset?.pdf? (
                        <button
                          onClick={() => {
                            const pdfWindow = window.open('', '_blank');
                            pdfWindow?.document.write(`<embed width="100%" height="100%" margin="0" src="data:application/pdf;base64,${asset?.pdf}"/>`);
                          }}
                          style={{ textDecoration: 'none', color: '#1976d2', cursor: 'pointer', background: 'none', border: 'none' }}
                        >
                  <PictureAsPdfIcon />
                            Abrir documento
                          </button>

                        ) : (
                          <span>NO HAY DOCUMENTO</span>
                        )}
                  </TableCell>
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
          )}
                <Dialog open={isDeleteConfirmationOpen} onClose={handleClose}>
                  <DialogTitle>Confirmar eliminación</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      ¿Estás seguro que deseas eliminar esta Entrega
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
          count={totalAssets}
          page={parseInt(page)} // Asegúrate de que page sea un número
          rowsPerPage={parseInt(limit)} // Asegúrate de que limit sea un número
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          rowsPerPageOptions={[1, 5, 10, 100]}

            onPageChange={(event: any, newPage: string) => {
              setPage(parseInt(newPage)); // Asegúrate de que newPage sea un número
            }}
        />
    </>
  )
 }
 export default AssetList


