import React, { useState, useEffect, CSSProperties, Fragment, ReactElement,forwardRef, Ref } from 'react'
import axios from 'axios'
import { Button, TableCell, TableRow, TableBody, TableContainer, Table, TableHead, Paper, ButtonGroup, Grid,CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, Slide, SlideProps, styled, tableCellClasses } from '@mui/material'
import Icon from 'src/@core/components/icon';
import SidebarAddGruposcontable from 'src/components/GruposContables/addcontables'
import { useSettings } from 'src/@core/hooks/useSettings'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SidebarEditContable from 'src/components/GruposContables/editContable'
import SidebarAddDescripcion from 'src/components/GruposContables/adddescripcion';
import { useAuthContext } from "src/context/AuthContext";


interface Contables {
  _id: string
  assetCategory: string
  usefulLife: number
  subCategory: string[]
  asset: boolean
}

interface subCategory {
  subCategory:string

}

const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const ContablesList: React.FC = () => {
  const [contables, setContables] = useState<Contables[]>([])
  const [contablesvider, setcontablesvider] = useState<Contables | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  type ContablesColumn = 'assetCategory' | 'usefulLife';
  const [sortDirectionCategory, setSortDirectionCategory] = useState<'asc' | 'desc'>('asc');
  const [sortDirectionLife, setSortDirectionLife] = useState<'asc' | 'desc'>('asc');
  const [addAsignarOpen, setAddAsignarOpen] = useState<boolean>(false)
  const toggleAddAsignarDrawer = () => setAddAsignarOpen(!addAsignarOpen)

  const [addcontablesOpen, setAddcontablesOpen] = useState<boolean>(false)
  const toggleAddcontablesDrawer = () => setAddcontablesOpen(!addcontablesOpen)
  const { settings } = useSettings()
  const { mode } = settings


  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false)
  const handleClickOpen = () => setOpen(true)


  const { accessToken:token } = useAuthContext()
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    console.log('fetchData')
    axios
    .get<Contables[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

      // .get<Contables[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list/`)
      .then(response => {
        setContables(response.data)
      })
      .catch(error => {
        console.error(error)
      })
  }
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list/${id}`, {
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

  const handleInputChange = (e: React.ChangeEvent<{ name: string; value: string }>) => {
    if (contablesvider) {
      setcontablesvider({ ...contablesvider, [e.target.name]: e.target.value })
    }
  }

  const handleThemeChange = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }
  const headerStyle = {
    backgroundColor: mode === 'light' ? '#8c90f0' : '#5a5c75',
    color: mode === 'light' ? 'black' : 'white',

    fontFamily: 'Roboto, Arial, sans-serif'
  }
  const handleSort = (column: ContablesColumn) => {
    if (column === 'assetCategory') {
      const newDirection = sortDirectionCategory === 'asc' ? 'desc' : 'asc';
      setSortDirectionCategory(newDirection);

      const sortedContables = [...contables];
      sortedContables.sort((a, b) => {
        if (newDirection === 'asc') {
          return a[column].localeCompare(b[column]);
        } else {
          return b[column].localeCompare(a[column]);
        }
      });

      setContables(sortedContables);
    } else if (column === 'usefulLife') {
      // Hacer lo mismo para la columna 'usefulLife'
    }
  };

  const bodystyle: CSSProperties = {
    fontSize: '12.9px',
    height:'50px',
    width: '50px',
    textAlign: 'center',
    // color: mode === 'light' ? 'black' : 'white',
    fontFamily: 'Roboto, Arial, sans-serif',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'


  }
const headStyle: CSSProperties ={
  fontFamily: 'Roboto, Arial, sans-serif',
      fontSize: '13px',
      height:'50px',
      width: '50px',
      color: 'white',
      borderRight: '1px solid rgba(224, 224, 224, 1)',
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
      textAlign: 'center'
}

  return (
    <>
      <Button sx={{ mb: 2 }}
          variant='contained'
           onClick={toggleAddcontablesDrawer}>
            NUEVO GRUPO CONTABLE</Button>
      <SidebarAddGruposcontable open={addcontablesOpen} toggle={toggleAddcontablesDrawer} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead style={headerStyle}>
          <TableRow sx={{ '& .MuiTableCell-root': { py: theme => `${theme.spacing(2)} !important`, position: 'relative' } }}>
          <TableCell
                style={headStyle}
              >
                Acciones
              </TableCell>
            <TableCell
                style={headStyle}
              >
                Nombre De Categoría

                <ArrowDownwardIcon
                    style={{
                      color: '#f0f0f0',
                      position: 'absolute',
                      top: '25%',
                      right: '25px',
                      cursor: 'pointer',
                      visibility: sortDirectionCategory === 'desc' ? 'visible' : 'hidden'
                    }}
                    onClick={() => handleSort('assetCategory')} // Cambiar la dirección al hacer clic
                  />

                  <ArrowUpwardIcon
                    style={{
                      color: '#f0f0f0',
                      position: 'absolute',
                      top: '25%',
                      right: '25px',
                      cursor: 'pointer',
                      visibility: sortDirectionCategory === 'asc' ? 'visible' : 'hidden'
                    }}
                    onClick={() => handleSort('assetCategory')} // Cambiar la dirección al hacer clic
                  />


              </TableCell>
              <TableCell
               style={headStyle}
              >

                Subcategoría (descripción)


              </TableCell>
              <TableCell
               style={headStyle}
              >
                Vida Útil
              </TableCell>
            </TableRow>
          </TableHead>
          { Array.isArray(contables) && contables.length > 0 ? (
          contables.map(contables => (
            <TableBody  key={contables._id}>
              <TableRow>
              <TableCell style={bodystyle}   >

                       <SidebarEditContable ContableId={contables._id} />

                  <Button
                        sx={{m:'9px  0 0 0'}}
                      fullWidth
                      size='small'
                      style={{ color: '#e53935', borderRadius: '10px',width: '45px',marginBottom:'1px',top:'0.1px',height:'30.1px' }}
                      variant='outlined'
                      onClick={() => handleDelete(contables._id)}
                    >
                      <Icon icon="mdi:delete-outline" fontSize={20} />
                    </Button>


              </TableCell>
                <TableCell style={bodystyle} >
                  {contables.assetCategory}
                </TableCell>
                <TableCell style={{fontSize: '12.9px',
                      height:'50px',
                      width: '50px',
                          // color: mode === 'light' ? 'black' : 'white',
                      fontFamily: 'Roboto, Arial, sans-serif',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'
                  }} >

                        <Grid container spacing={2}>
                        <Grid item xs={10} md={10}>
                        <SidebarAddDescripcion    ContableId={contables._id}   /><br />

                        </Grid>
                        <Grid item xs={6} md={10}>
                        <ul>
                  {contables.subCategory.map((subCategory) => (
                    <li key={subCategory}>{subCategory}</li>
                  ))}
                  </ul>
                        </Grid>
                        </Grid>
                </TableCell>

                <TableCell style={bodystyle}>
                  {contables.usefulLife}
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

    </>
  )
}

export default ContablesList

