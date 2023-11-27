// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'
import Tooltip from '@mui/material/Tooltip';
// ** MUI Imports

import Card from '@mui/material/Card'

import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid, GridPagination, GridToolbar } from '@mui/x-data-grid'

import Typography from '@mui/material/Typography'


// ** Third Party Components
import axios from 'axios'

// ** Types Imports

import { CardStatsType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Table Components Imports
import TableHeader from 'src/components/Bitacora/TableHeader'


interface UserStatusType {
  [key: string]: ThemeColor
}

// ** Vars

interface UsersType {
  _id: string,
  userId: string,
  userEmail: string,
  action: string,
  description: string,
  path: string
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date


}
interface CellType {
  row: UsersType
}

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}


const columns = [


  {
    flex: 0.2,
    minWidth: 220,
    field: 'userEmail',
    headerName: 'Correo de usuario',
    renderCell: ({ row }: CellType) => {
      return (

        <Typography noWrap variant='body2'>
          {row.userEmail}
        </Typography>

      )
    }
  },
  {
    flex: 0.2,
    minWidth: 150,
    field: 'action',
    headerName: 'Accion',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap variant='body2'>
          {row.action}
        </Typography>

      )
    }
  },
  {
    flex: 0.2,
    minWidth: 709,
    field: 'description',
    headerName: 'Descripcion',
    renderCell: ({ row }: CellType) => {

      return (
        <Tooltip title={row.description} arrow>
          <Typography noWrap variant='body2'>
            {row.description}
          </Typography>
        </Tooltip>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'path',
    headerName: 'Ruta',
    renderCell: ({ row }: CellType) => {

      return (
        <Typography noWrap variant='body2'>
          {/* {lastSegment} */}
          {row.path}
        </Typography>
      );
    }
  },

  {
    flex: 0.2,
    minWidth: 200,
    field: 'createdAt',
    headerName: 'fecha de creacion',
    renderCell: ({ row }: CellType) => {
      const formattedCreatedAt = new Date(row.createdAt).toLocaleString();
      return (
        <Typography noWrap variant='body2'>
          {formattedCreatedAt}
        </Typography>
      );
    }
  },


]

const UserList = () => {
  // ** State
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [store, setStore] = useState<CellType>() ;

  useEffect(()=>{
    getStore()
  })
  const getStore = async() => {
    try {
      const token = localStorage.getItem('token')

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}bitacora/bitacora`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setStore(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])




  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Divider />
          {store ? (
            <DataGrid
              rowHeight={60}
              getRowId={(row) => row._id}
              autoHeight
              rows={store as unknown as UsersType[]} // Aseguramos que store sea de tipo UsersType[]
              columns={columns}
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
              components={{
                Pagination: (props) => (
                  <GridPagination
                    {...props}
                    rowsPerPageText="Filas por " // Cambia el texto "Rows per page" a "Filas por columna"
                  />
                ),
              }}
              localeText={{
                // Cambia los textos de ordenamiento
                // Puedes modificar estas cadenas según tus necesidades
                toolbarDensity: 'Densidad',
                toolbarDensityLabel: 'Densidad',
                toolbarDensityCompact: 'Compacta',
                toolbarDensityStandard: 'Estándar',
                toolbarDensityComfortable: 'Cómoda',
                // sortAscending: 'Ordenar ascendente',
                // sortDescending: 'Ordenar descendente',
                columnMenuShowColumns: 'Mostrar columnas',
                columnMenuFilter: 'Filtrar',
                columnMenuHideColumn: 'Ocultar columna',
                columnMenuUnsort: 'Quitar orden',
                columnMenuSortAsc: 'Orden ascendente',
                columnMenuSortDesc: 'Orden descendente'
              }}
            />
          ) : (
            <Typography variant="body2">Cargando datos...</Typography>
          )}
        </Card>
      </Grid>
    </Grid>
  );
}


export default UserList

