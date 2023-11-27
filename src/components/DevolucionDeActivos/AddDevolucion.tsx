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

import axios from 'axios'
import { Grid, Select, SelectChangeEvent, MenuItem, Autocomplete, TextareaAutosize, InputAdornment } from '@mui/material'
import { useAsset } from 'src/context/AssetContext'
import { useAuthContext } from 'src/context/AuthContext'

interface SidebarDevolutionAssetProps {
   // providerId: string;
  selectedDevolution: string[];
  setSelectedRows: (newSelectedRows: string[]) => void;
  open: boolean;
  toggle: () => void;
}

interface UserData {
  _id: string
  assetId: string
  description: string
  transmitterId: string,
  receiverId: string,
  location: string,
  stateId: string,
  observation:string
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
  description: '',
  transmitterId: '',
  receiverId: '',
  location:'',
  stateId: '',
  observation:''
}

const SidebarAddDesignar = (props: SidebarDevolutionAssetProps) => {
  // ** Props

  const {devolutionAsset} = useAsset()

  // const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [groupAsset, setGroupAsset] = useState<Asset[]>()
  const [selectedResponsible, setSelectedResponsible] = useState<responsible | null>(null)
  const [groupResponsible, setGroupResponsible] = useState<responsible[]>([])
  const [selectedResponsibleReceptor, setSelectedResponsibleReceptor] = useState<responsible | null>(null)
  const [groupResponsibleReceptor, setGroupResponsibleReceptor] = useState<responsible[]>([])
  const [selectedResponsibleCharge, setSelectedResponsibleCharge] = useState<string>('');
  const [selectedResponsibleReceptorCharge, setSelectedResponsibleReceptorCharge] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<location | null>(null)
  const [groupLocation, setGroupLocation] = useState<location[]>([])
  const [selectedState, setSelectedState] = useState<state | null>(null)
  const [groupState, setGroupState] = useState<state[]>()
  const { open, toggle } = props
  const [asset, setAsset] = useState<UserData>({
    _id:'',
    assetId: '',
    description:'',
    transmitterId: '',
    receiverId: '',
    location: '',
    stateId: '',
    observation:''
  })

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
  //AUTENTICACAION
  const { accessToken:token } = useAuthContext()

  useEffect(() => {
    getAssetss()
    getResponsible()
    getResponsibleReceptor()
    getLocation()
    getState()

  }, [])

  const handleClose = () => {
    // window.location.reload()
    toggle()
    reset()
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAsset({ ...asset, [e.target.name]: e.target.value });
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true);
      const assetIds =  props.selectedDevolution;
      console.log(assetIds)
      const newData = {
        assetIds,
        description: asset.description,
        transmitterId: asset.transmitterId,
        receiverId: asset.receiverId,
        location: asset.location,
        stateId: asset.stateId

      }
      await devolutionAsset(newData)
      props.setSelectedRows([])

    } catch (error) {
      console.error(error)
    }
  }
  const getAssetss = async () => {

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
    const selectedResponsibleReceptorObj = groupResponsible?.find(responsible => responsible.fullName === selectedResponsibleReceptorId) || null
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
      })
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

  const handleStateChange = (e: ChangeEvent<{ value: unknown }>) => {
    const selectedStateId = e.target.value as string
    const selectedStateObj = groupState?.find(state => state.name === selectedStateId) || null
    asset.stateId=selectedStateObj?._id || ""
    setSelectedState(selectedStateObj)
  }
  const getState = async () => {

    try {
      const response = await axios.get<state[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}state`,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
       setGroupState(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 550, lg: 700  } } }}
    >
      <Header>
        <Typography variant='h6'>AGREGAR DEVOLUCION </Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 6 }}>
          <Typography variant='body2' gutterBottom>
              Descripción
          </Typography>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.description}
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message}
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
            <Grid container mb={2}>
              <Grid item xs={5} sm={7} lg={7}>
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

              <Grid item xs={10} sm={6} lg={5} >
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
           <FormControl fullWidth sx={{ mb: 6 }}>
           <Grid item xs={12} sm={12}>
              <Typography variant='body2' gutterBottom>
                Ubicacion
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

           <FormControl fullWidth sx={{ mb: 6 }}>
            <Grid item xs={8} sm={8} lg={12}>
                <Typography variant='body2' gutterBottom>
                  Estado
                </Typography>
                <Select
                  fullWidth
                  value={selectedState?.name || ''}
                  onChange={handleStateChange as (event: SelectChangeEvent<string>, child: React.ReactNode) => void}
                  autoComplete='off'
                >
                  {groupState?.map(asset => (
                    <MenuItem key={asset._id} value={asset.name}>
                      {asset.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
           </FormControl>
           <FormControl fullWidth sx={{ mb: 6 }}>
           <Typography variant='body2' gutterBottom>
                  Observacion
            </Typography>
            <Controller
              name='observation'
              control={control}
              render={({ field }) => (
                <TextareaAutosize
                  {...field}
                    minRows={1} // Número mínimo de filas visibles
                    maxRows={4} // Número máximo de filas visibles antes de mostrar barras de desplazamiento
                    value={asset.observation}
                    onChange={handleChange}
                    style={{
                      fontFamily: 'Arial, sans-serif', // Familia de fuentes
                      color: '#666', // Color del texto
                      fontSize: '16px', // Tamaño de fuente
                      width: '100%', // Ancho completo
                      minHeight: '100px', // Altura mínima (ajusta según tus necesidades)
                      resize: 'both', // Permitir redimensionar
                      border: '1px solid #ccc', // Estilo del borde
                      padding: '8px', // Relleno
                    }}
                    autoComplete='off'
                  />

              )}
            />
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={handleClose}>
              Aceptar
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancelar
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddDesignar
