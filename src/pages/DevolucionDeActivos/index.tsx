// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports

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


// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import { GridColDef } from '@mui/x-data-grid';


// ** Third Party Components
import axios from 'axios'

// ** Types Imports

import { CardStatsType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Table Components Imports
import TableHeader from 'src/components/DevolucionDeActivos/TableHeader'
// import AddUserDrawer from 'src/components/DevolucionDeActivos/AddDevolucion'
// import SidebarEditProvider  from 'src/components/GruposContables/editContable'
import { ButtonGroup, Button } from '@mui/material'

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
  proceedings:string


}

interface asset {
    name: string,
    code: string,
    date: Date,
    file: string

}
interface CellType {
  row: UsersType
}

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

const StyledLink = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

// ** renders client column


const columns: GridColDef[] = [
  {
    flex: 0.1,
    minWidth: 140,
    field: 'actions',
    headerName: 'Acciones',

    renderCell: ({ row }: CellType) => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NGU1MjJlMGZhYTBiZTE1ZjgyNzQxYjciLCJBcHAiOnsiMCI6eyJ1dWlkIjoiY2FiODM2MzUtM2ZlMC00OGQxLTkzMTYtOTEzYWRjOTgxYThjIiwibmFtZSI6ImNlbnRyYWwiLCJ1cmwiOiJodHRwOi8vMTAuMTAuMjE0LjIxOTozMDA1L2hvbWUifX0sInJvbGVzIjpbIjY0ZTUyMTA2ZTNhYjFmYmFkYzEwZWRmMiJdLCJpYXQiOjE2OTQ2MjkwNTksImV4cCI6MTY5NDY1MDY1OX0.UOAbkdg0lPeCsYDV7Nbnq7nRDcaARvj1_3Yqld0fG6g'

      function handleDelete(_id: string): void {

          console.log("handleDelete called");
          const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este elemento?");

          if (confirmDelete) {
            axios
              .delete(`${process.env.NEXT_PUBLIC_API_ACTIVOS}devolution/${_id}`, {
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

        <Button
             style={{ color: '#4CAF50'}}
             component="a"
            >
               <Icon icon='mdi:pencil-outline' fontSize={20} />
      </Button>
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
    field: 'receiver',
    headerName: 'Receptor',
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
    field: 'transmitter',
    headerName: 'Transmisor',
    renderCell: ({ row }: CellType) => {

      return (
        <Typography noWrap variant='body2'>
          {row.transmitter}
        </Typography>
      )
    }
  },

  {
    flex: 0.2,
    minWidth: 150,
    field: 'location',
    headerName: 'Ubicacion',
    renderCell: ({ row }: CellType) => {

      return (
        <Typography noWrap variant='body2'>
          {row.location}
        </Typography>
      )
    }
  },

  {
    flex: 0.2,
    minWidth: 150,
    headerName: 'activos',
    field: 'customField',
    renderCell: ({ row }: CellType) => {

      const content = row.asset.map(index => `${index.name} ${index.code}`).join('\n');

      return (
         <Typography noWrap variant='body2' title={content}>
          {content}
        </Typography>

      )
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
            {row.proceedings ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => {
                    const pdfWindow = window.open('', '_blank');
                    pdfWindow?.document.write(`<embed width="100%" height="100%" margin="0" src="data:application/pdf;base64,${row?.proceedings}"/>`);
                  }}
                  style={{ textDecoration: 'none', color: '#1976d2', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  Documento
                </button>
                <IconButton
                  onClick={() => {
                    // Acción para abrir el PDF, similar a la del botón
                    const pdfWindow = window.open('', '_blank');
                    pdfWindow?.document.write(`<embed width="100%" height="100%" margin="0" src="data:application/pdf;base64,${row?.proceedings}"/>`);
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
  },

  {
    flex: 0.1,
    minWidth: 150,
    field: 'asset',
    headerName: 'Estado',
    renderCell: ({ row }: CellType) => {
      const statusColor = row.asset ? 'success' : 'error';
      const statusLabel = row.asset ? 'Active' : 'Inactive';

      return (
        <CustomChip
          skin='light'
          size='small'
          label={statusLabel}
          color={statusColor}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
        />
      );
    }
  }


]

const UserList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
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
            getRowId={row => row._id}
            rowHeight={70}
            autoHeight
            rows={store}
            columns={columns}
            // checkboxSelection
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
                     />
        </Card>
      </Grid>

      {/* <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} /> */}
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}devolution`)

  const apiData: CardStatsType = res.data
  console.log('Datos de respuesta:', apiData);
  return {
    props: {
      apiData
    }
  }
}

export default UserList

// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
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
//   Tooltip,
//   TooltipProps,
//   styled,
//   tooltipClasses,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle
// } from '@mui/material'

// import Icon from 'src/@core/components/icon'
// import { useSettings } from 'src/@core/hooks/useSettings'

// interface Entrega {
//   _id: string
//   person: string
//   createdDate: Date
//   updateDate: Date
//   proceedings: string
// }
// const Entrega: React.FC = () => {
//   const [assets, setAssets] = useState<Entrega[]>([])
//   const { settings } = useSettings()
//   const { mode } = settings

//   useEffect(() => {
//     fetchData()
//   }, [])
//   //console.log(assets)
//   const fetchData = async () => {
//     try {
//       const res = await axios.get(`http://10.10.214.125:4000/delivery`, {
//         headers: {
//           Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NGI1YWEzOThhMTY4Mzc1NDE3YjdmOTgiLCJBcHAiOnsiMCI6eyJ1dWlkIjoiNDVhZmFjNzEtYjczMy00ZjIwLWEzYWEtYzEyMzQ3MWUxY2JiIiwibmFtZSI6ImNlbnRyYWwiLCJ1cmwiOiJodHRwOi8vMTAuMTAuMjE0LjIxOTozMDA1L2hvbWUifX0sInJvbGVzIjpbIjY0YjY4ZTRhZTUzOTFiNzQyYzU2MjVkMCJdLCJpYXQiOjE2OTE2MDcwNDMsImV4cCI6MTY5MTYyODY0M30.5wEBZ-l6suTivcjDesLT1_cW9qDuRjYLAi_XdQB_LxE`
//         }
//       })

//       setAssets(res.data)
//     } catch (error: any) {
//       console.log(error)
//     }
//   }
//   const headerStyle = {
//     backgroundColor: mode === 'light' ? '#8c90f0' : '#5a5c75',
//     color: mode === 'light' ? 'black' : 'white',

//     fontFamily: 'Roboto, Arial, sans-serif'
//   }
//   const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
//     <Tooltip {...props} classes={{ popper: className }} />
//   ))(({ theme }) => ({
//     [`& .${tooltipClasses.tooltip}`]: {
//       backgroundColor: '#f5f5f9',
//       color: 'rgba(0, 0, 0, 0.87)',
//       maxWidth: 220,
//       fontSize: theme.typography.pxToRem(12),
//       border: '1px solid #dadde9'
//     }
//   }))
//   return (
//     <>
//       {/* <Button onClick={toggleAddAssetDrawer}>NUEVO Activo</Button>
//       <SidebarAddAssetNew open={addAssetOpen} toggle={toggleAddAssetDrawer} /> */}

//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label='simple table'>
//           <TableHead style={headerStyle}>
//             <TableRow sx={{ '& .MuiTableCell-root': { py: theme => `${theme.spacing(2.5)} !important` } }}>
//               {/* <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
//                 Imagen
//               </TableCell> */}
//               <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
//                 Nombre
//               </TableCell>
//               <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
//                 Creacion De Activo
//               </TableCell>
//               <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
//                 Actas
//               </TableCell>
//               <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
//                 Activo
//               </TableCell>

//               <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
//                 ACCIONES
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           {Array.isArray(assets) &&
//             assets.map(asset => (
//               <TableBody key={asset._id}>
//                 <TableRow sx={{ '& .MuiTableCell-root': { py: theme => `${theme.spacing(2.5)} !important` } }}>
//                   <TableCell
//                     style={{ width: '50px', fontFamily: 'Arial, Helvetica, sans-serif' }}
//                     sx={{ textAlign: 'center' }}
//                   >
//                     {asset.person}
//                   </TableCell>

//                   <TableCell>{asset.createdDate && new Date(asset.createdDate).toLocaleDateString('es-ES')}</TableCell>
//                   <TableCell>{asset.updateDate && new Date(asset.updateDate).toLocaleDateString('es-ES')}</TableCell>
//                   <HtmlTooltip title={<React.Fragment>{asset.proceedings}</React.Fragment>}>
//                     <TableCell>{asset.proceedings.substr(0, 15)}</TableCell>
//                   </HtmlTooltip>

//                   {/* <TableCell sx={{ textAlign: 'center' }}>
//                     <ButtonGroup size='small' aria-label='small outlined button group'>
//                       <SidebarEditAsset providerId={asset._id} />
//                       <Button
//                         size='small'
//                         style={{ color: '#e53935', borderRadius: '5px' }}
//                         variant='outlined'
//                         onClick={() => handleDelete(asset._id)}
//                       >
//                         <Icon icon='mdi:delete-outline' fontSize={20} />
//                       </Button>
//                     </ButtonGroup>
//                   </TableCell>
//                   <Dialog open={isDeleteConfirmationOpen} onClose={handleDeleteCancelled}>
//                     <DialogTitle>Confirmar eliminación</DialogTitle>
//                     <DialogContent>
//                       <DialogContentText>¿Estás seguro que deseas eliminar este usuario?</DialogContentText>
//                     </DialogContent>
//                     <DialogActions>
//                       <Button onClick={handleDeleteCancelled} color='primary'>
//                         Cancelar
//                       </Button>
//                       <Button onClick={handleDeleteConfirmed} color='primary'>
//                         Eliminar
//                       </Button>
//                     </DialogActions>
//                   </Dialog> */}
//                 </TableRow>
//               </TableBody>
//             ))}
//         </Table>
//       </TableContainer>
//     </>
//   )
// }
// export default Entrega
