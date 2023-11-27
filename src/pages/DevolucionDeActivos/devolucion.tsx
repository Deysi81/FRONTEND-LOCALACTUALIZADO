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
  CircularProgress,
} from '@mui/material'

import SidebarEditEntrega from '../../components/EntregaDeActivos/editentrega';
import Icon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAsset } from 'src/context/DevolutionContext'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // Icono de PDF
import SidebarEditDevolution from 'src/components/DevolucionDeActivos/editDevolution';

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

interface Devolucion {
  _id: string,
  receiver: string,
  chargeReceiver: string,
  transmitter: string,
  chargeTransmitter: string,
  location: string,
  asset: asets[]
  pdf:string
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
  const [delivery, setDelivery] = useState<Devolucion[]>([])
  const [open, setOpen] = React.useState(false);
  const { settings } = useSettings()
  const { mode } = settings
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  //abir QR
  const[res,setRes]=useState<string>("")
  const [openQR, setOpenQR] = useState(false);
      const handleClickOpenQR = () => {
        setOpenQR(true);
      };

      const handleCloseQR = () => {
        setOpenQR(false);
      };

    //   const generateQR = async (id:string)=>{
    //     GenerateQR(id)
    //   }

    //   const GenerateQR =async (id: string) => {

    //     try {
    //       const res = await axios.get<codigoQR>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/get-asset-generate-QR/${id}`);
    //       console.log(res.data.qrCodeDataUrl,'aaaaaaaaaaaaaaaaaaaaaa')
    //       setRes(res.data.qrCodeDataUrl)
    //       handleClickOpenQR()
    //       // Otra opción es mostrar un indicador de carga mientras se procesa

    // // 3. Mostrar la imagen en una etiqueta <img>

    //     } catch (error:any) {
    //       alert(error.response?.data.message);
    //       setRes("no Qr")
    //       handleClickOpenQR()

    //     }
    //   };
//LLAMANDO AL CONTEXTO

  let { assets,setlocation //,setValue
  ,setLimit,limit,deleteAsset,generatenewPdf,totalAssets,page,setPage
  } = useAsset();

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<boolean>(false)
  const [userIdToDelete, setUserIdToDelete] = useState<string>('')
  const [isSidebarEditOpen, setIsSidebarEditOpen] = useState(false);
  const handleDelete = async (id: string) => {
    // const assetIds = [...new Set([id, ...selectedRows])].flat();
    setUserIdToDelete(id)
  }
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
    // borderRight: '1px solid rgba(224, 224, 224, 1)',
    //  borderBottom: '1px solid rgba(224, 224, 224, 1)',
     boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'

  }
  const bodystyle: CSSProperties = {
    textAlign: 'center',
    fontSize:'13.8px',
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
                <TableCell style={headeresti}sx={{width:'200px'}}>Usuario que envia</TableCell>
                <TableCell style={headeresti}sx={{width:'200px'}}>Usuario que recibe </TableCell>
                <TableCell style={headeresti}sx={{width:'200px'}}>Ubicacion </TableCell>
                <TableCell style={headeresti} sx={{width:'150px'}}>Activos </TableCell>
                <TableCell style={{fontFamily: 'Roboto, Arial, sans-serif', fontSize: '13px',color:'white'}}>Actas </TableCell>
            </TableRow>
          </TableHead>
           { Array.isArray(assets) && assets.length > 0 ? (
            assets.map(asset => (
          <TableBody key={asset._id}>
            <TableRow sx={{ '& .MuiTableCell-root': { py: (theme: { spacing: (arg0: number) => any; }) => `${theme.spacing(2.5)} !important` } }}>
                <TableCell  style={{width: '150px',textAlign: 'center',fontFamily: 'Roboto, Arial, sans-serif' }}>
                    <SidebarEditDevolution providerId={asset._id}></SidebarEditDevolution>
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
                              width: '120px',
                              height: '24px', // Ajusta la altura
                              fontSize: '12px', // Cambia el tamaño del texto
                            }}
                            onClick={() => generatePdf(asset._id)}
                          >Generar PDF
                          </Button>
                      </li>
                      {/* <li style={{ marginTop: '10px' }}>
                          <Button size='small' variant='contained'
                            style={{
                              color: '#fff', // Cambia el color del texto
                              borderRadius: '8px', // Agrega bordes redondeados
                              width: '140px',
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
                            <Typography>INFORMACION DEL ACTIVO</Typography>
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
                    </li> */}
                  </ul>

                </TableCell>
                <TableCell style={bodystyle}>{asset.transmitter}</TableCell>
                <TableCell style={bodystyle}>{asset.receiver} </TableCell>
                <TableCell style={bodystyle}>{asset.location} </TableCell>
                <TableCell style={bodystyle}>
                   <Fragment>
                    <Button style={{fontFamily: 'Roboto, Arial, sans-serif',fontSize:'13.4px',}} onClick={handleClickOpen}>
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
                      <DialogTitle id='alert-dialog-slide-title'>INFORMACION DE LA DEVOLUCION DEL ACTIVO</DialogTitle>
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


                <TableCell style={{  textAlign: 'center' }}>

                      {asset?.proceedings? (
                        <button
                          onClick={() => {
                            const pdfWindow = window.open('', '_blank');
                            pdfWindow?.document.write(`<embed width="100%" height="100%" margin="0" src="data:application/pdf;base64,${asset?.proceedings}"/>`);
                          }}
                          style={{ textDecoration: 'none', color: '#1976d2', cursor: 'pointer', background: 'none', border: 'none' }}
                        >
                  <PictureAsPdfIcon />
                            Abrir documento
                          </button>

                        ) : (
                          <span>No hay documento</span>
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
          )

          }
        </Table>
      </TableContainer>
      {/* <TablePagination
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
        /> */}
    </>
  )
 }
 export default AssetList


