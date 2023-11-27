
import MaterialTable from 'material-table';

// function BasicFiltering() {
//   return (
//     <MaterialTable
//       title="Basic Filtering Preview"
//       columns={[
//         { title: 'Name', field: 'name' },
//         { title: 'Surname', field: 'surname' },
//         { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
//         {
//           title: 'Birth Place',
//           field: 'birthCity',
//           lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
//         },
//       ]}
//       data={[
//         { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
//         { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
//       ]}
//       options={{
//         filtering: true
//       }}
//     />
//   )
// }


import React, { useState, useEffect, ChangeEvent, CSSProperties } from 'react';
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
} from '@mui/material';
import SidebarAddSupplier from '../../components/proveedores/addprovider';
import SidebarEditProvider from '../../components/proveedores/editprovider';
import Icon from 'src/@core/components/icon';
import { useSettings } from 'src/@core/hooks/useSettings';
import SearchIcon from '@mui/icons-material/Search';

// import providers, { fetchProvider } from 'src/store/apps/user/index';
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch } from 'src/redux/store';
// import { RootState } from 'src/store';

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

const ProviderList: React.FC = () => {
  const [provider, setProvider] = useState<Provider[]>([]);
  const [addproviderOpen, setAddproviderOpen] = useState<boolean>(false);
  const toggleAddproviderDrawer = () => setAddproviderOpen(!addproviderOpen);
  const { settings } = useSettings();
  const { mode } = settings;
  const [value, setValue] = useState<string>('');
// paginacion
const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

    // const dispatch = useDispatch();
    //const dispatch = useDispatch<AppDispatch>()
    //const providers: Provider[] = useSelector((state: RootState) => state.user.list);


  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NGU1MjJlMGZhYTBiZTE1ZjgyNzQxYjciLCJBcHAiOnsiMCI6eyJ1dWlkIjoiY2FiODM2MzUtM2ZlMC00OGQxLTkzMTYtOTEzYWRjOTgxYThjIiwibmFtZSI6ImNlbnRyYWwiLCJ1cmwiOiJodHRwOi8vMTAuMTAuMjE0LjIxOTozMDA1L2hvbWUifX0sInJvbGVzIjpbIjY0ZTUyMTA2ZTNhYjFmYmFkYzEwZWRmMiJdLCJpYXQiOjE2OTQ0MzY1NDIsImV4cCI6MTY5NDQ1ODE0Mn0.iXg91-Y45vHmyba6pKWcMvDpQn5amgqQeQikAuuRTE8';

  useEffect(() => {
   // dispatch(fetchProvider());
    (async () => {
      fetchData()
    })();
  }, [value, currentPage,
    //dispatch
  ]);

  const fetchData = async () => {
    try {
      let res;
      if (value) {
        res = await axios.get<Provider[]>(
          `${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier?nameSupplier=${value}`);

      } else {
        res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier/`);
      }

      setProvider(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier/${id}`, {
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

  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const bodystyle: CSSProperties = {
    width:'60px',
    textAlign: 'center',
    // color: mode === 'light' ? 'black' : 'white',
    fontFamily: 'Roboto, Arial, sans-serif',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'

  }


  return (


    <>

    <MaterialTable
       title="Basic Filtering Preview"
      columns={[
         { title: 'Name', field: 'name' },
         { title: 'Surname', field: 'surname' },
         { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
         {
           title: 'Birth Place',
           field: 'birthCity',
           lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
         },
      ]}
       data={[
         { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
         { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
       ]}
       options={{
         filtering: true
       }}
     />

    <Grid container>
    <Grid item xs={8}>
      <Button
        sx={{ width: '190px', // Ancho personalizado
        top:'1px',
        height: '55px',  }}
        style={{borderRadius:'1.2rem',animation:'alternate'}}
        variant="contained"
        onClick={toggleAddproviderDrawer}
      >
        NUEVO Proveedor
      </Button>
      <SidebarAddSupplier open={addproviderOpen} toggle={toggleAddproviderDrawer} />
      </Grid>
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
                label="Buscar Proveedor"
                variant="outlined"
                style={{ marginBottom: '10px' }}
                autoComplete="off"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={headerStyle}>
            <TableRow sx={{ '& .MuiTableCell-root': { py: (theme: { spacing: (arg0: number) => any; }) => `${theme.spacing(2)} !important` } }}>
              <TableCell style={{ fontSize: '13px', fontWeight: 'bold', width: '100px', color: 'white', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} sx={{ textAlign: 'center' }}>
                Acciones
              </TableCell>
              <TableCell style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} sx={{ textAlign: 'center' }}>
                Nombre
              </TableCell>
              <TableCell style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} sx={{ textAlign: 'center' }}>
                CI
              </TableCell>
              <TableCell style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} sx={{ textAlign: 'center' }}>
                Celular
              </TableCell>

              <TableCell style={{ fontSize: '13px', fontWeight: 'bold', width: '50px', color: 'white', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} sx={{ textAlign: 'center' }}>
                Direccion
              </TableCell>

                <TableCell
                  style={{
                    fontSize: '13px',
                    fontWeight: 'bold',
                    width:'50px',
                    color: 'white',
                    borderRight: '1px solid rgba(224, 224, 224, 1)',
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  }}
                  sx={{ textAlign: 'center' }}
                >
                  Correo Electrónico
                </TableCell>
              <TableCell style={{ fontSize: '13px', fontWeight: 'bold', width: '50px', color: 'white', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} sx={{ textAlign: 'center' }}>
                NIT
              </TableCell>
              <TableCell style={{ fontSize: '13px', fontWeight: 'bold', width: '50px', color: 'white' , borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} sx={{ textAlign: 'center' }}>
                Nombre del Negocio
              </TableCell>
              {/* <TableCell style={{ fontSize: '13px', fontWeight: 'bold', width: '50px', color: 'white' , borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)' }} sx={{ textAlign: 'center' }}>
              Activos
              </TableCell> */}
              {/* <TableCell style={{ fontSize: '13px', fontWeight: 'bold', width: '50px', color: 'white' , borderBottom: '1px solid rgba(224, 224, 224, 1)' }} sx={{ textAlign: 'center' }}>
              Descripción
              </TableCell> */}

            </TableRow>
          </TableHead>
          <TableBody>
            {provider.map((provider) => (
              <TableRow key={provider._id}>
                <TableCell  style={{width: '200px',
                      textAlign: 'center',
                      // color: mode === 'light' ? 'black' : 'white',
                      fontFamily: 'Roboto, Arial, sans-serif',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'
                  }}>

                    <SidebarEditProvider providerId={provider._id}></SidebarEditProvider>
                    <Button
                      size="small"
                      style={{ color: '#e53935', borderRadius: '10px',width: '40px',marginBottom:'2px' }}
                      variant="outlined"
                      onClick={() => handleDelete(provider._id)}
                    >
                      <Icon icon="mdi:delete-outline" fontSize={20} />
                    </Button>
                </TableCell>
                <TableCell style={bodystyle}>
                  {provider.managerName}
                </TableCell>
                <TableCell style={bodystyle}>
                  {provider.managerCi}
                </TableCell>
                <TableCell  style={bodystyle}>
                  {provider.managerPhone}
                </TableCell>
                <TableCell  style={bodystyle}>
                  {provider.businessAddress}
                </TableCell>
                <TableCell style={bodystyle}>
                  {provider.email}
                </TableCell>
                <TableCell  style={bodystyle}>
                  {provider.NIT}
                </TableCell>
                <TableCell  style={bodystyle}>
                  {provider.businessName}
                </TableCell>
                {/* <TableCell  style={bodystyle}>
                {provider?.informationAsset?.asset}

                </TableCell>
                <TableCell  style={bodystyle}>
                  {provider.informationAsset.description}
                </TableCell> */}

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProviderList;
