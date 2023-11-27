// ** React Imports
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'

import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports

import Icon from 'src/@core/components/icon'
import RecentActorsIcon from '@mui/icons-material/RecentActors';

// ** Types Imports
import { useAuthContext } from "src/context/AuthContext";


import axios from 'axios'
import { Grid, Select, Autocomplete,InputAdornment } from '@mui/material'
import { useAsset } from 'src/context/AssetContext'

interface SidebarAsignarAssetProps {
  assetId: string;
  selectedAsignar: string[];
  setSelectedRows: (newSelectedRows: string[]) => void;
  open: boolean;
  toggle: () => void;
}

interface UserData {
  _id: string
  assetId: string
  observation: string
  transmitterId: string,
  receiverId: string,
  location: string,
  // stateId: string
}

interface Asset {
  _id: string
  name: string
}

interface responsible {
  _id: string,
  fullName: string,
  charge: string
}

interface location {
  _id: string,
  Name: string
}

interface state {
  _id: string,
  name: string
}
const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  direction: yup.string().required(),
  phone: yup
    .string()
    .typeError('')
    .min(10, obj => showErrors('Celular', obj.value.length, obj.min))
    .required(),
  name: yup
    .string()
    .min(3, obj => showErrors('Nombre', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  assetId: '',
  observation: '',
  transmitterId: '',
  receiverId: '',
  location:'',
  stateId: ''
}
//const SidebarAddProvider: React.FC<SidebarAsignarAssetProps> = (props) => {
const SidebarAddProvider = (props: SidebarAsignarAssetProps) => {
  // ** Props

  const {deliveryAsset } = useAsset()

  // const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [groupAsset, setGroupAsset] = useState<Asset[]>()
  const [selectedResponsible, setSelectedResponsible] = useState<responsible | null>(null)

  const [selectedResponsibleReceptor, setSelectedResponsibleReceptor] = useState<responsible | null>(null)

  const [selectedResponsibleCharge, setSelectedResponsibleCharge] = useState<string>('');
  const [selectedResponsibleReceptorCharge, setSelectedResponsibleReceptorCharge] = useState<string>('');


  const [filteredResponsibleOptions, setFilteredResponsibleOptions] = useState<responsible[]>([]);
  const [searchValue, setSearchValue] = useState('');
//buscador por nombres
  const [groupResponsible, setGroupResponsible] = useState<responsible[]>([])
  const [groupResponsibleReceptor, setGroupResponsibleReceptor] = useState<responsible[]>([])

  const [selectedLocation, setSelectedLocation] = useState<location | null>(null)
  const [groupLocation, setGroupLocation] = useState<location[]>([])

  const [selectedState, setSelectedState] = useState<state | null>(null)
  const [groupState, setGroupState] = useState<state[]>()

  const { open, toggle } = props
  const [asset, setAsset] = useState<UserData>({

    _id:'',
    assetId: '',
    observation:'',
    transmitterId: '',
    receiverId: '',
    location: '',
    // stateId: ''
  })
  const { accessToken:token } = useAuthContext()
  // ** Hooks
  const {
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    getAssets()
    // getData()
    getResponsible()
    getResponsibleReceptor()
    getLocation()
    // getState()

  }, [])

  const handleClose = () => {
    // window.location.reload()
    toggle()
    reset()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAsset({ ...asset, [e.target.name]: e.target.value })
  }
  const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true);
      console.log(props.assetId,'testttt')

      const assetIds =  props.selectedAsignar;
      if(assetIds.length <= 0){
        assetIds.push(props.assetId)
      }
      console.log(assetIds,'issdddddddddd')

      const newData = {
        assetIds,
        observation: asset.observation,
        transmitterId: asset.transmitterId,
        receiverId: asset.receiverId,
        location: asset.location,
        // stateId: asset.stateId

      }
      await deliveryAsset(newData)

      props.setSelectedRows([])
    } catch (error) {
      console.error(error)
    }finally {
      setIsLoading(false); // Establece isLoading en false después de que se complete la operación

    }

  }


  const getAssets = async () => {
    try {
      const response = await axios.get<Asset[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset`,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      setGroupAsset(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleResponsibleInputChange = (inputValue: string) => {
    // Filtra las opciones de responsables basadas en el texto de búsqueda
    const filteredOptions = groupResponsible?.filter(
      (responsible) =>
        responsible.fullName.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredResponsibleOptions(filteredOptions || []);
  };

  const handleResponsibleChange = (e: ChangeEvent<{ value: unknown }>) => {
    const selectedResponsibleId = e.target.value as string
    const selectedResponsibleObj = groupResponsible?.find(responsible => responsible.fullName === selectedResponsibleId) || null
    asset.transmitterId=selectedResponsibleObj?._id || ""
    setSelectedResponsible(selectedResponsibleObj)
    setSelectedResponsibleCharge(selectedResponsibleObj?.charge || '')
  }

  const getResponsible = async () => {
    try {
      const response = await axios.get<responsible[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}personal`,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      setGroupResponsible(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  const handleResponsibleReceptorChange = (e: ChangeEvent<{ value: unknown }>) => {
    const selectedResponsibleReceptorId = e.target.value as string
    const selectedResponsibleReceptorObj = groupResponsibleReceptor?.find(responsible => responsible.fullName === selectedResponsibleReceptorId) || null
    asset.receiverId=selectedResponsibleReceptorObj?._id || ""
    setSelectedResponsibleReceptor(selectedResponsibleReceptorObj)
    setSelectedResponsibleReceptorCharge(selectedResponsibleReceptorObj?.charge || ''); // Actualiza el cargo
  }
  const getResponsibleReceptor = async () => {
    try {
      const response = await axios.get<responsible[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}personal`,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      } )
      setGroupResponsibleReceptor(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLocationChange = (e: ChangeEvent<{ value: unknown }>) => {
    const selectedLocationId = e.target.value as string
    const selectedLocationObj = groupLocation?.find(location => location.Name === selectedLocationId) || null
    asset.location=selectedLocationObj?._id || ""
    setSelectedLocation(selectedLocationObj)
  }
  const getLocation = async () => {

    try {
      const response = await axios.get<location[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}organigrama`,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      //const response = await axios.get<location[]>( 'http://localhost:3000/api/departments/departments')
      setGroupLocation(response.data)
    } catch (error) {
      console.error(error)
    }
  }



  ///USQUEDA PERSNAL
  const [users, setUsers] = useState<responsible[]>([]);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchBy, setSearchBy] = useState('name');



  const handleSearch = async () => {
    if (searchValue) {
      try {
        //const url = `http://10.10.214.124:3000/api/personal/filtered?${searchBy}=${searchValue}`;
        const url = `http://localhost:3300/api/personal${searchBy}=${searchValue}`;
        const response = await axios.get(url);
        setFilteredUsers(response.data.data); if (response.data && response.data.data) {
          setFilteredUsers(response.data.data);
        }
      } catch (error) {
        console.error("Error buscando usuarios:", error);
      }
    } else {
      setFilteredUsers(users);
    }
  };


  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width:  { xs: 400, sm: 550, lg: 700 }} }}
    >

      <Header>
        <Typography variant='h6'>Agregar Asignacion</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 6 }}>
             <Typography variant='body2' gutterBottom>
                   Observacion
              </Typography>
            <Controller
              name='observation'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.observation}
                  error={Boolean(errors.observation)}
                  helperText={errors.observation?.message}
                  onChange={handleChange}
                  autoComplete='off'
                />
              )}
            />
          </FormControl>

          <Grid container>
              <Grid item xs={5} sm={7} lg={7}>
                {/* <FormControl fullWidth sx={{ mb: 6 }}>
                  <Typography variant='body2' gutterBottom>
                    Responsable de entrega
                  </Typography>
                  <Select
                    fullWidth
                    value={selectedResponsible?.fullName || ''}
                    onChange={handleResponsibleChange as (event: SelectChangeEvent<string>, child: React.ReactNode) => void}
                    autoComplete='off'
                  >
                    {groupResponsible?.map(asset => (
                      <MenuItem key={asset._id} value={asset.fullName}>
                        {asset.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
                <Typography variant='body2' gutterBottom>
                    Responsable de entrega
                  </Typography>
                  <Autocomplete
                    options={groupResponsible}
                    getOptionLabel={option => option.fullName}
                    value={groupResponsible.find(option => option._id === asset.transmitterId) || null}
                    onChange={(event, newValue) => {
                      setAsset({ ...asset, transmitterId: newValue?._id || '' });
                      const selectedCharge = newValue ? newValue.charge : '';
                      setSelectedResponsibleCharge(selectedCharge);
                    }}
                    filterOptions={(options, state) => {
                      if (state.inputValue.length < 4) {
                        // Si se ingresan menos de 4 caracteres, no muestra opciones
                        return [];
                      }
                      return options.filter(option =>
                        option.fullName.toLowerCase().includes(state.inputValue.toLowerCase())
                      );
                    }}
                    renderInput={params => <TextField {...params} label='' />}
                    noOptionsText="No hay opciones disponibles" // Cambia el texto aquí
                  />
                {/* <Box mb={2}>
                                  <FormControl component="fieldset">
                                    <FormLabel component="legend">Seleccionar usuarios</FormLabel>
                                    <br />
                                    <Box display="flex" alignItems="center" mb={2}>
                                      <Box mb={2}>
                                        <TextField
                                          variant="outlined"
                                          placeholder="Buscar usuario"
                                          value={searchValue}
                                          onChange={(e) => setSearchValue(e.target.value)}
                                          fullWidth
                                          InputProps={{
                                            endAdornment: (
                                              <InputAdornment position="end">
                                                <Button onClick={handleSearch} color="primary">
                                                  Buscar
                                                </Button>
                                              </InputAdornment>
                                            ),
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                    {searchValue && (
                                      <Box style={{
                                        maxHeight: '300px',
                                        overflowY: 'auto',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',

                                      }}>
                                        <List dense>
                                          {filteredUsers.map((user) => (
                                            <ListItem key={user._id}>
                                              <ListItemText primary={`${user.fullName}`} />
                                            </ListItem>
                                          ))}
                                        </List>
                                      </Box>
                                    )}
                                  </FormControl>
                                </Box> */}
              </Grid>

              <Grid item xs={10} sm={6} lg={5} >
                <Typography variant='body2' style={{ marginLeft: '20px', marginBottom: '5px'}}>
                  Cargo Responsable:
                </Typography>
                <div style={{ marginLeft: '20px', padding: '15px', color: 'white', borderRadius: '10px', border: '2px solid', backgroundColor: '#65727a', display: 'flex', alignItems: 'center' }}>
                  <InputAdornment position="start">
                    <RecentActorsIcon style={{ color: 'white' }}/>
                  </InputAdornment>
                  {selectedResponsibleCharge}
                </div>

              </Grid>
            </Grid>

            <Grid container>
                <Grid item xs={5} sm={7} lg={7}>
                  <Typography variant='body2' gutterBottom>
                    Responsable de recibir
                  </Typography>
                  <Autocomplete
                    options={groupResponsibleReceptor}
                    getOptionLabel={option => option.fullName}
                    value={groupResponsibleReceptor.find(option => option._id === asset.receiverId) || null}
                    onChange={(event, newValue) => {
                      setAsset({ ...asset, receiverId: newValue?._id || '' });
                      const selectedCharge = newValue ? newValue.charge : '';
                      setSelectedResponsibleReceptorCharge(selectedCharge);
                    }}
                    filterOptions={(options, state) => {
                      if (state.inputValue.length < 4) {
                        // Si se ingresan menos de 4 caracteres, no muestra opciones
                        return [];
                      }
                      return options.filter(option =>
                        option.fullName.toLowerCase().includes(state.inputValue.toLowerCase())
                      );
                    }}
                    renderInput={params => <TextField {...params} label='' />}
                    noOptionsText="No hay opciones disponibles" // Cambia el texto aquí
                  />
                </Grid>

                <Grid item xs={10} sm={6} lg={5}>
                  <Typography variant='body2' style={{ marginLeft: '20px', marginBottom: '5px'}}>
                    Cargo Responsable:
                  </Typography>
                  <div style={{ marginLeft: '20px', padding: '15px', color: 'white', borderRadius: '10px', border: '2px solid', backgroundColor: '#65727a', display: 'flex', alignItems: 'center' }}>
                    <InputAdornment position="start">
                      <RecentActorsIcon style={{ color: 'white' }}/>
                    </InputAdornment>
                    {selectedResponsibleReceptorCharge}
                  </div>
                </Grid>
              </Grid>



            {/* <FormControl fullWidth sx={{ mb: 6 }}>
                  <Typography variant='body2' gutterBottom>
                  Responsable de recibir
                  </Typography>
                    <Select
                    fullWidth
                    value={selectedResponsibleReceptor?.fullName || ''}
                    onChange={handleResponsibleReceptorChange as (event: SelectChangeEvent<string>, child: React.ReactNode) => void}
                    autoComplete='off'
                    >
                    {groupResponsibleReceptor?.map(asset => (
                    <MenuItem key={asset._id} value={asset.fullName}>
                      {asset.fullName}
                    </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}

           <FormControl fullWidth sx={{ mb: 6 }}>
           <Grid item xs={12} sm={12}>
              <Typography variant='body2' gutterBottom>
                Ubicación
              </Typography>
              <Autocomplete
                options={groupLocation}
                getOptionLabel={option => option.Name}
                value={groupLocation.find(option => option._id === asset.location) || null}
                onChange={(event, newValue) => {
                  setAsset({ ...asset, location: newValue?._id || '' });
                }}
                renderInput={params => <TextField {...params} label='' />}
              />
            </Grid>
           </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={handleClose}
            disabled={isLoading}
            >
              Aceptar
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancelar
            </Button>
          </Box>
          {/* {isLoading && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
              width: '1vw', // Ancho relativo al viewport
              height: '1vh',
            }}>
              <CircularProgress size={50} style={{ minWidth: '50px', minHeight: '50px' }} />
            </div>
          )} */}
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddProvider
