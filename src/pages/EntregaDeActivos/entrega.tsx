import React, { useState, useEffect, ChangeEvent, CSSProperties, Fragment, forwardRef, ReactElement, Ref } from 'react';
import axios from 'axios';
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
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import SidebarAddSupplier from '../../components/proveedores/addprovider';
import SidebarEditEntrega from '../../components/EntregaDeActivos/editentrega';
import Icon from 'src/@core/components/icon';
import { useSettings } from 'src/@core/hooks/useSettings';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // Icono de PDF
import Slide, { SlideProps } from '@mui/material/Slide'

interface informationAsset {
  asset: string;
  description: string;
}
interface Provider {
  _id: string,
  receiver: string,
  chargeReceiver: string,
  transmitter: string,
  chargeTransmitter: string,
  location: string,
  pdf:string
  asset: asset[]
}

interface asset {
  name: string,
  code: string,
  date: Date,
  file: string

}

interface codigoQR{
  _id: string,
  qrCodeDataUrl: string
}
interface pdf{
  _id: string,
  documentPdf: string
}

const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})


const ProviderList: React.FC = () => {
  const [provider, setProvider] = useState<Provider[]>([]);
  const [pdfGenerated, setPdfGenerated] = useState<{ [key: string]: string }>({});

  //dialog active
  const [open, setOpen] = useState<boolean>(false)

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)


  const { settings } = useSettings();
  const { mode } = settings;
  const [value, setValue] = useState<string>('');

  //ACTIVOS
  const[asset,setAsset]=useState<any>({
    name: '',
    code: '',
    date: '',
    file: ''
  });

// paginacion
const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
 const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NGU1MjJlMGZhYTBiZTE1ZjgyNzQxYjciLCJBcHAiOnsiMCI6eyJ1dWlkIjoiY2FiODM2MzUtM2ZlMC00OGQxLTkzMTYtOTEzYWRjOTgxYThjIiwibmFtZSI6ImNlbnRyYWwiLCJ1cmwiOiJodHRwOi8vMTAuMTAuMjE0LjIxOTozMDA1L2hvbWUifX0sInJvbGVzIjpbIjY0ZTUyMTA2ZTNhYjFmYmFkYzEwZWRmMiJdLCJpYXQiOjE2OTQ0MzY1NDIsImV4cCI6MTY5NDQ1ODE0Mn0.iXg91-Y45vHmyba6pKWcMvDpQn5amgqQeQikAuuRTE8';

  useEffect(() => {
   // dispatch(fetchProvider());
    (async () => {
      fetchData()
    })();
  }, [value, currentPage,
    //dispatch
  ]);

        //abir QR


        const[res,setRes]=useState<string>("");
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
            console.log(res.data,'aaaaaaaaaaaaaaaaaaaaaa')
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

        // const generatePdf = async (id:string)=>{
        //   generatenewPdf(id)

        // }
        const generatePdf = async (id: string) => {
          try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/get-asset-document-pdf/${id}`);
            console.log(res.data,'aaaaaaaaaaaaaaaaaaaaaa')
            const updatedAssets = asset.map(() => {
              if (asset._id == res.data._id) {
                return {
                  ...asset,
                  asets: {
                    ...asset.asset,
                    file: res.data.documentPdf,
                  },
                };
              } else {
                return asset;
              }
            });

            console.log(updatedAssets, 'Updated Assets');
            setAsset(updatedAssets);
          } catch (error:any) {
            alert(error.response?.data.message);
          }
        };


  const fetchData = async () => {
    try {
      let res;
      if (value) {
        res = await axios.get<Provider[]>(
          `${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier?nameSupplier=${value}`);

      } else {
        res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery`);
      }

      setProvider(res.data.dataArray);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const headerStyle = {
    backgroundColor: mode === 'light' ? '#8c90f0' : '#5a5c75',
    color: mode === 'light' ? 'black' : 'white',
    fontFamily: 'Roboto, Arial, sans-serif',
    width: '50px',
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const bodystyle: CSSProperties = {
    width: '50px',
    textAlign: 'center',
    fontSize:'13.8px',
    // color: mode === 'light' ? 'black' : 'white',
    fontFamily: 'Roboto, Arial, sans-serif',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'

  }
  const headeresti: CSSProperties = {
    fontSize: '13.9px',

    color:'white',
    textAlign: 'center',
    fontFamily: 'Roboto, Arial, sans-serif',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0)', borderRight: '1px solid rgba(224, 224, 224, 1)'
  }


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
            ${provider.map((provider, index) => ( // Iterate over providers
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
    <Grid container >
    <Grid item xs={8}></Grid>
      <Grid item xs={4}> {/* Buscador */}
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <IconButton aria-label="Buscar">
                <SearchIcon />
              </IconButton>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                onChange={handleFilterChange}
                label="Buscar Entrega"
                variant="outlined"
                style={{ marginBottom: '10px',width:'350px' }}
                autoComplete="off"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={headerStyle}>
            <TableRow sx={{ '& .MuiTableCell-root': { py: (theme) => `${theme.spacing(2)} !important` } }}>
              <TableCell style={{fontSize: '13.9px',
                  width: '190px',
                  color:'white',
                  textAlign: 'end',
                  fontFamily: 'Roboto, Arial, sans-serif'
              }}>
                Acciones
              </TableCell>
              <TableCell style={headeresti}>

              </TableCell>
              <TableCell style={headeresti}sx={{width:'190px'}} >
              Usuario que envia el activo
              </TableCell>
              <TableCell style={headeresti}sx={{width:'190px'}}>
              Usuario que recibe el activo
              </TableCell>
              <TableCell style={headeresti}>
                Ubicacion
              </TableCell>
              <TableCell style={headeresti} sx={{width:'200px'}}>
                Activos
              </TableCell>
              <TableCell style={headeresti}>
                Actas
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {provider.map((provider) => (
              <TableRow key={provider._id}>
                <TableCell  style={{width: '150px',
                      textAlign: 'center',
                      boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.3)',
                      // color: mode === 'light' ? 'black' : 'white',
                      fontFamily: 'Roboto, Arial, sans-serif'
                  }}>

                    <SidebarEditEntrega providerId={provider._id}></SidebarEditEntrega>
                    <Button
                     sx={{ mb: 1 }}
                     fullWidth
                     size='small'
                     style={{ color: '#e53935', borderRadius: '10px',width: '40px',marginBottom:'2px' }}
                     variant='outlined'

                      onClick={() => handleDelete(provider._id)}
                    >
                      <Icon icon="mdi:delete-outline" fontSize={20} />
                    </Button>
                </TableCell>
                <TableCell style={{width: '50px',boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.3)',}}>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  <li style={{ marginTop: '10px' }}>
                      <Button
                        size='small'
                        variant='contained'
                        style={{
                          color: '#fff', // Cambia el color del texto
                          borderRadius: '8px', // Agrega bordes redondeados
                          width: '119px',
                          height: '24px', // Ajusta la altura
                          fontSize: '12px', // Cambia el tamaño del texto

                        }}
                        onClick={() => generatePdf(provider._id)}
                      >
                        Generar PDF
                      </Button>
                    </li>
                    <li style={{ marginTop: '10px' }}>
                      <Button
                        size='small'
                        variant='contained'
                        style={{
                          color: '#fff', // Cambia el color del texto
                          borderRadius: '8px', // Agrega bordes redondeados
                          width: '119px',
                          height: '24px', // Ajusta la altura
                          fontSize: '12px', // Cambia el tamaño del texto

                        }}
                        onClick={() => generateQR(provider._id)}
                      >
                        Generar QR
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

                          {provider.asset.map((asset, index) => (
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
                <TableCell style={bodystyle}>
                  {provider.receiver}
                </TableCell>
                <TableCell style={bodystyle}>
                  {provider.transmitter}
                </TableCell>
                <TableCell  style={bodystyle}>
                  {provider.location}
                </TableCell>
                <TableCell style={bodystyle}>
                  <Fragment>
                    <Button style={{color:'black',fontFamily: 'Roboto, Arial, sans-serif',fontSize:'13.8px',}} onClick={handleClickOpen}>
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
                      <DialogTitle id='alert-dialog-slide-title'>Informacion de la entrega de activo</DialogTitle>
                      <DialogContent>
                        <DialogContentText id='alert-dialog-slide-description'>
                          {provider.asset.map((asset, index) => (
                            <div key={index}>
                              {asset.name}{asset.code}
                            </div>
                          ))}
                        </DialogContentText>
                      </DialogContent>
                      {/* <DialogActions className='dialog-actions-dense'>
                        <Button onClick={handleClose}>Disagree</Button>
                        <Button onClick={handleClose}>Agree</Button>
                      </DialogActions> */}
                    </Dialog>
                  </Fragment>
                </TableCell>
                {/* <TableCell style={bodystyle}>

                  {provider.asset.map((asset, index) => (
                    <div key={index}>
                      {asset.name} {asset.code}
                    </div>
                  ))}
                </TableCell> */}
                <TableCell style={bodystyle}>
                <Typography noWrap variant='body2'>
              {provider.pdf ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      const pdfWindow = window.open('', '_blank');
                      pdfWindow?.document.write(`<embed width="100%" height="100%" margin="0" src="data:application/pdf;base64,${provider?.pdf}"/>`);
                    }}
                    style={{ textDecoration: 'none', color: '#1976d2', cursor: 'pointer', background: 'none', border: 'none' }}
                  >
                    DOCUMENTO
                  </button>
                  <IconButton
                    onClick={() => {
                      // Acción para abrir el PDF, similar a la del botón
                      const pdfWindow = window.open('', '_blank');
                      pdfWindow?.document.write(`<embed width="100%" height="100%" margin="0" src="data:application/pdf;base64,${provider?.pdf}"/>`);
                    }}
                    style={{ color: '#1976d2', cursor: 'pointer' }}
                  >
                    <PictureAsPdfIcon />
                  </IconButton>
                </div>
              ) : (
                <span>No hay documento</span>
              )}
          </Typography>
                </TableCell>


              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProviderList;
