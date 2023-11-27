// ** React Imports
import { useState, useEffect, MouseEvent, useCallback, FormEvent } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // Icono de PDF
//mport PdfIcon from 'mdi-material-ui/FilePdfOutline' // Asegúrate de instalar mdi-material-ui si aún no lo has hecho

// ** Store Imports

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'


// ** Third Party Components
import axios from 'axios'

// ** Types Imports

import { CardStatsType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Table Components Imports
import TableHeader from 'src/components/EntregaDeActivos/TableHeader'
import AddUserDrawer from 'src/components/EntregaDeActivos/AddEntrega'
import SidebarEditProvider  from 'src/components/GruposContables/editContable'
import { Button, ButtonGroup, Tooltip } from '@mui/material'
import SidebarEditAsset from 'src/components/activos/editAsset'
import SidebarAddQR from 'src/components/EntregaDeActivos/qr'
import Obtenerinformacion from 'src/components/EntregaDeActivos/obtenerinformacion'
import SidebarEditEntrega from 'src/components/EntregaDeActivos/editentrega'
interface UserRoleType {
  [key: string]: { icon: string; color: string }
}

interface UserStatusType {
  [key: string]: ThemeColor
}

// ** Vars
const userRoleObj: UserRoleType = {
  admin: { icon: 'mdi:laptop', color: 'error.main' },
  author: { icon: 'mdi:cog-outline', color: 'warning.main' },
  editor: { icon: 'mdi:pencil-outline', color: 'info.main' },
  maintainer: { icon: 'mdi:chart-donut', color: 'success.main' },
  subscriber: { icon: 'mdi:account-outline', color: 'primary.main' }
}
interface UsersType {
  _id: string,
  receiver:string,
  transmitter: string,
  location: string,
  asset: asset[]
  qrCode:string
  pdf:string


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

interface CellType {
  row: UsersType
}



// const StyledLink = styled(Link)(({ theme }) => ({
//   fontWeight: 600,
//   fontSize: '1rem',
//   cursor: 'pointer',
//   textDecoration: 'none',
//   color: theme.palette.text.secondary,
//   '&:hover': {
//     color: theme.palette.primary.main
//   }
// }))

// ** renders client column

const RowOptions = ({ id }: { id:  string }) => {
  // ** Hooks
  // const dispatch = useDispatch<AppDispatch>()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const rowOptionsOpen = Boolean(anchorEl)



  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }


  const handleDelete = (id: string) => { // Cambia _id por id
    console.log("handleDelete called");
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este elemento?");

    if (confirmDelete) {
      axios
        .delete(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/${id}`)
        .then(response => {
          console.log("Se eliminó con éxito", response.data);
        })
        .catch(error => {
          console.error("Error al eliminar:", error);
        });

    }else((error: any)=> {
      console.error(error)
    })
  }





}


const columns = [

  {
    flex: 0.1,
    minWidth: 120,
    field: 'actions',
    headerName: 'Acciones',

    renderCell: ({ row }: CellType) => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NGU1MjJlMGZhYTBiZTE1ZjgyNzQxYjciLCJBcHAiOnsiMCI6eyJ1dWlkIjoiY2FiODM2MzUtM2ZlMC00OGQxLTkzMTYtOTEzYWRjOTgxYThjIiwibmFtZSI6ImNlbnRyYWwiLCJ1cmwiOiJodHRwOi8vMTAuMTAuMjE0LjIxOTozMDA1L2hvbWUifX0sInJvbGVzIjpbIjY0ZTUyMTA2ZTNhYjFmYmFkYzEwZWRmMiJdLCJpYXQiOjE2OTQ0MzY1NDIsImV4cCI6MTY5NDQ1ODE0Mn0.iXg91-Y45vHmyba6pKWcMvDpQn5amgqQeQikAuuRTE8'

      function handleDelete(_id: string): void {

          console.log("handleDelete called");
          const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este elemento?");

          if (confirmDelete) {
            axios
              .delete(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/${_id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              })
              .then(response => {
                console.log("Se eliminó con éxito", response.data);
              })
              .catch(error => {
                console.error("Error al eliminar:", error);
              });

          }else((error: any)=> {
            console.error(error)
          })

      }

      return (
       <ButtonGroup size='small' aria-label='small outlined button group'>
          <SidebarEditEntrega ></SidebarEditEntrega>

      <Button
             style={{ color: '#e53935'}}
           component="a"
           onClick={() =>  handleDelete(row._id)} // Utiliza el valor directamente
           sx={{ '& svg': { mr: 2 } }}
         >
           <Icon icon='mdi:delete-outline' fontSize={20} />
      </Button>
       </ButtonGroup>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 150,
    minHeight: 60,
    headerName: '  ',
    renderCell: ({ row }: CellType) => {

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

      const generatePdf =async (id: string) => {

        try {
          const res = await axios.get<codigoQR>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/get-asset-document-pdf/${id}`);
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


      return (
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
                            onClick={() => generatePdf(asset._id)}
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
                              width: '140px',
                              height: '24px', // Ajusta la altura
                              fontSize: '12px', // Cambia el tamaño del texto

                            }}
                            onClick={() => generateQR(row._id)}
                          >
                            Generar Codigo
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
                                <Button size='small' type='submit' variant='contained' onClick={handleCloseQR}>
                                  Aceptar
                                </Button>
                              </DialogContent>
                            </Dialog>

                        </li>




                    </ul>
            )
    }
  },
  {
    flex: 0.2,
    minWidth: 150,
    minHeight: 60,
    field: 'transmitter',
    headerName: 'Usuario que envia el activo',
    renderCell: ({ row }: CellType) => {

      return (
        <Tooltip title={row.transmitter} placement="bottom" >
        <Typography noWrap variant='body2'>
          {row.transmitter}
        </Typography>
        </Tooltip>
      )
    }
  },

  {
    flex: 0.2,
    minWidth: 150,
    field: 'receiver',
    headerName: 'Usuario que recibe el activo',

    renderCell: ({ row }: CellType) => {

      return (
        <Typography noWrap variant='body2'>
          {row.receiver}
        </Typography>
      )
    }
  },

  {
    flex: 0.2,
    minWidth: 150,
    minHeight: 60,
    field: 'location',
    headerName: 'Ubicacion',
    renderCell: ({ row }: CellType) => {

      return (
        <Tooltip title={row.location} placement="bottom" >
        <Typography noWrap variant='body2'>
          {row.location}
        </Typography>
        </Tooltip>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    headerName: 'activos',
    field: 'customField',

    renderCell: ({ row }: CellType) => {
      const assets = row.asset.map((index) => `${index.name} ${index.code}`).join('\n');
      const numLines = row.asset.length; // Contar la cantidad de líneas

      const cellStyle = {
        display: 'flex',
        flexDirection: 'column' as const,
      };

      const assetStyle = {
        whiteSpace: 'pre-line' as const, // Usar 'as const' para especificar el tipo
      };

      return (
        <div style={cellStyle}>
          <Typography noWrap variant='body2' title={assets} style={assetStyle}>
            {assets}
          </Typography>
        </div>
      );
    }
  },



  {
    flex: 0.2,
    minWidth: 150,
    field: 'proceedings',
    headerName: 'actas',
    renderCell: ({ row }: CellType) => {

      return (
        <Typography noWrap variant='body2'>
            {row.pdf ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => {
                    const pdfWindow = window.open('', '_blank');
                    pdfWindow?.document.write(`<embed width="100%" height="100%" margin="0" src="data:application/pdf;base64,${row?.pdf}"/>`);
                  }}
                  style={{ textDecoration: 'none', color: '#1976d2', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  Documento
                </button>
                <IconButton
                  onClick={() => {
                    // Acción para abrir el PDF, similar a la del botón
                    const pdfWindow = window.open('', '_blank');
                    pdfWindow?.document.write(`<embed width="100%" height="100%" margin="0" src="data:application/pdf;base64,${row?.pdf}"/>`);
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

      )
    }
  }


]

const UserList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** State
  const [value, setValue] = useState<string>('')

  // const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)

  const store = apiData || [];




  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])


  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6}>

      <Grid item xs={12}>
        <Card>

          <Divider />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <DataGrid
            rowHeight={100}
            getRowId={row => row._id}
            autoHeight
            rows={store}
            columns={columns}

            // pageSize={pageSize}
            //disableSelectionOnClick
             rowsPerPageOptions={[10, 25, 80]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            // onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
                     />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} selectedAsignar={[]} />
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery`)
  const apiData: CardStatsType = res.data

  return {
    props: {
      apiData
    }
  }
}

export default UserList


function openQRCodeModal(qrCode: string) {
  throw new Error('Function not implemented.')
}


// import React, { useState, useEffect, ChangeEvent, CSSProperties } from 'react';
// import axios from 'axios';
// import {
//   Button,
//   TableCell,
//   TableRow,
//   TableBody,
//   TableContainer,
//   Table,
//   TableHead,
//   ButtonGroup,
//   Paper,
//   Grid,
//   IconButton,
//   TextField,
// } from '@mui/material';
// import SidebarAddSupplier from '../../components/proveedores/addprovider';
// import SidebarEditProvider from '../../components/proveedores/editprovider';
// import Icon from 'src/@core/components/icon';
// import { useSettings } from 'src/@core/hooks/useSettings';
// import SearchIcon from '@mui/icons-material/Search';

// interface informationAsset {
//   asset: string;
//   description: string;
//   image: string;
// }
// interface Provider {
//   _id: string,
//   receiver:string,
//   transmitter: string,
//   location: string,
//   asset: asset[]
//   qrCode:string
//   pdf:string
// }
// interface asset {
//       name: string,
//       code: string,
//       date: Date,
//       file: string

//   }

// const EntregaList: React.FC = () => {
//   const [provider, setProvider] = useState<Provider[]>([]);
//   const [addproviderOpen, setAddproviderOpen] = useState<boolean>(false);
//   const toggleAddproviderDrawer = () => setAddproviderOpen(!addproviderOpen);
//   const { settings } = useSettings();
//   const { mode } = settings;
//   const [value, setValue] = useState<string>('');
// // paginacion
// const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;

//   const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NGU1MjJlMGZhYTBiZTE1ZjgyNzQxYjciLCJBcHAiOnsiMCI6eyJ1dWlkIjoiY2FiODM2MzUtM2ZlMC00OGQxLTkzMTYtOTEzYWRjOTgxYThjIiwibmFtZSI6ImNlbnRyYWwiLCJ1cmwiOiJodHRwOi8vMTAuMTAuMjE0LjIxOTozMDA1L2hvbWUifX0sInJvbGVzIjpbIjY0ZTUyMTA2ZTNhYjFmYmFkYzEwZWRmMiJdLCJpYXQiOjE2OTQ0MzY1NDIsImV4cCI6MTY5NDQ1ODE0Mn0.iXg91-Y45vHmyba6pKWcMvDpQn5amgqQeQikAuuRTE8';

//   useEffect(() => {
//     (async () => {
//       fetchData()
//     })();
//   }, [value, currentPage]);

//   const fetchData = async () => {
//     try {
//       let res;
//       if (value) {
//         res = await axios.get<Provider[]>(
//           `${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery=${value}`);

//       } else {
//         res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery`);
//       }

//       setProvider(res.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await axios.delete(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       fetchData();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const headerStyle = {
//     backgroundColor: mode === 'light' ? '#8c90f0' : '#5a5c75',
//     color: mode === 'light' ? 'black' : 'white',
//     fontFamily: 'Roboto, Arial, sans-serif',
//   };

//   const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setValue(e.target.value);
//   };
//   const bodystyle: CSSProperties = {
//     width: '50px',
//     textAlign: 'center',
//     // color: mode === 'light' ? 'black' : 'white',
//     fontFamily: 'Roboto, Arial, sans-serif',
//     boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'

//   }


//   return (
//     <>
//     <Grid container>
//     <Grid item xs={8}>
//       <Button
//         sx={{ width: '190px', // Ancho personalizado
//         top:'1px',
//         height: '55px',  }}
//         style={{borderRadius:'1.2rem',animation:'alternate'}}
//         variant="contained"
//         onClick={toggleAddproviderDrawer}
//       >
//         NUEVO Proveedor
//       </Button>
//       <SidebarAddSupplier open={addproviderOpen} toggle={toggleAddproviderDrawer} />
//       </Grid>
//       <Grid item xs={4}> {/* Buscador */}
//           <Grid container alignItems="center" spacing={2}>
//             <Grid item>
//               <IconButton aria-label="Buscar">
//                 <SearchIcon />
//               </IconButton>
//             </Grid>
//             <Grid item xs={8}>
//               <TextField
//                 fullWidth
//                 onChange={handleFilterChange}
//                 label="Buscar Proveedor"
//                 variant="outlined"
//                 style={{ marginBottom: '10px' }}
//                 autoComplete="off"
//               />
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>

//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//           <TableHead style={headerStyle}>
//             <TableRow sx={{ '& .MuiTableCell-root': { py: (theme) => `${theme.spacing(2)} !important` } }}>
//               <TableCell style={{ fontSize: '13px', fontWeight: 'bold', width: '50px', color: 'white', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} sx={{ textAlign: 'center' }}>
//                 Acciones
//               </TableCell>
//               <TableCell style={{ fontSize: '13px', fontWeight: 'bold', width: '50px', color: 'white', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} sx={{ textAlign: 'center' }}>

//               </TableCell>
//               <TableCell style={{ fontSize: '13px', fontWeight: 'bold', width: '50px', color: 'white', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} sx={{ textAlign: 'center' }}>
//               Usuario que envia
//               </TableCell>
//               <TableCell style={{ fontSize: '13px', fontWeight: 'bold', width: '50px', color: 'white', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} sx={{ textAlign: 'center' }}>
//               Usuario que recibe
//               </TableCell>
//               <TableCell style={{ fontSize: '13px', fontWeight: 'bold', width: '50px', color: 'white', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} sx={{ textAlign: 'center' }}>
//               Ubicacion
//               </TableCell>
//               <TableCell style={{ fontSize: '13px', fontWeight: 'bold', width: '50px', color: 'white', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} sx={{ textAlign: 'center' }}>
//               activos
//               </TableCell>
//               <TableCell style={{ fontSize: '13px', fontWeight: 'bold', width: '50px', color: 'white', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} sx={{ textAlign: 'center' }}>
//               actas
//               </TableCell>
//               <TableCell style={{ fontSize: '13px', fontWeight: 'bold', width: '50px', color: 'white', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} sx={{ textAlign: 'center' }}>
//               Código QR
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {provider.map((provider) => (
//               <TableRow key={provider._id}>
//                 <TableCell  style={bodystyle}>
//                   <ButtonGroup size="small" aria-label="small outlined button group">
//                     <SidebarEditProvider providerId={provider._id}></SidebarEditProvider>
//                     <Button
//                       size="small"
//                       style={{ color: '#e53935', borderRadius: '10px' }}
//                       variant="outlined"
//                       onClick={() => handleDelete(provider._id)}
//                     >
//                       <Icon icon="mdi:delete-outline" fontSize={20} />
//                     </Button>
//                   </ButtonGroup>
//                 </TableCell>
//                 <TableCell style={bodystyle}>

//                 </TableCell>
//                 <TableCell style={bodystyle}>
//                   {provider.transmitter}
//                 </TableCell>
//                 <TableCell style={bodystyle}>
//                   {provider.receiver}
//                 </TableCell>
//                 <TableCell  style={bodystyle}>
//                   {provider.location}
//                 </TableCell>
//                 <TableCell  style={bodystyle}>
//                   {provider.asset}
//                 </TableCell>
//                 <TableCell style={bodystyle}>
//                   {provider.qrCode}
//                 </TableCell>



//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </>
//   );
// };

// export default EntregaList;
