// ** React Imports
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from 'react'

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

import axios from 'axios'
import InputLabel from '@mui/material/InputLabel'
import { Autocomplete, Grid, MenuItem, Select, SelectChangeEvent } from '@mui/material'
interface UserData {
  _id: string
  asset:AssetsDelivery[],
  transmitter: {
    _id:string,
    fullName:string
  },
  receiver: {
    _id:string,
    fullName:string
  },
  location: {
    _id:string,
    locationName:string
  },
}
interface AssetsDelivery{
  _id: string,
  name: string,
  State:string,
  date:string,
  code:string,
  file:string,
  observation:string,
}

interface AssetDisponible{
  _id: string,
  name: string,
  informationCountable:{
    code:string
  }
}

interface assetLocation {
  _id: string,
  Name: string
}

interface state {
  _id: string,
  name: string,
  isDeleted: boolean

}
interface asstResponsible {
  _id: string,
  fullName: string,
  email: string
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
  businessAddress: yup.string().required(),
  managerPhone: yup
    .string()
    .typeError('')
    .min(10, obj => showErrors('Celular', obj.value.length, obj.min))
    .required(),
    managerName: yup
    .string()
    .min(3, obj => showErrors('Nombre', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  assetIdNew: '',
  assetIdOld: '',
  observation: '',
  transmitter: '',
  receiver: '',
  location: '',
  State: ''
}

const SidebarEditDevolution = (props: { providerId: string }) => {

  const [state, setState] = useState<boolean>(false)
  const [selectedAssetDisp, setSelectedAssetDisp] = useState<AssetDisponible | null>(null)
  const [groupAssetDisp, setGroupAssetDisp] = useState<AssetDisponible[]>()
  const [groupAssetOcup, setGroupAssetOcup] = useState<any>()

  const [groupLocation, setGroupLocation] = useState<assetLocation[]>([])

  //Estado
  const [groupState, setGroupState] = useState<state[]>([])
  //Responsable
  const [groupResponsible, setGroupResponsible] = useState<asstResponsible[]>([])
  const [groupReceiver, setGroupReceiver] = useState<asstResponsible[]>([])

  const [selectedAssetDispCode, setSelectedAssetDispCode] = useState<string>('');
  const providerId = props.providerId
  const [asset, setAsset] = useState<UserData>({
    _id: '',
    asset:[],
    transmitter: {
      _id:'',
      fullName:'',
    },
    receiver: {
      _id:'',
      fullName:'',
    },
    location: {
      _id:'',
      locationName:'',
    },
  })
  const [updatedDelivery, setUpdatedDelivery] = useState({
    assetIdNew: '',
    assetIdOld: '',
    observation: '',
    transmitterId: '',
    receiverId: '',
    location: '',
    stateId: ''
  })
  const handleClose = () => {
    reset()
  }
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setState(open)
  }

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
    getData()
    getAssetDisponible()
    getResponsible()
    getReceiver()
    getState()
    getLocation()


  }, [])
  console.log('deliveriId',asset)
  const getData = async () => {
    await axios.get<any>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/${providerId}`)
      .then(response => {setAsset(response.data)})
      .catch(error => {
        console.error(error)
      })
  }

  const handleAssetDispCode = (e: ChangeEvent<{ value: unknown }>) => {
    const selectedAssetDispId = e.target.value as string
    const selectedAssetDispObj = groupAssetDisp?.find(AssetDisponible => AssetDisponible.name === selectedAssetDispId) || null
    // asset.transmitter=selectedAssetDispObj?._id || ""
    setSelectedAssetDisp(selectedAssetDispObj)
    setSelectedAssetDispCode(selectedAssetDispObj?.informationCountable.code || '')
  }
  const getAssetDisponible = async () => {
    try {
      const token = localStorage.getItem('token')
      const responseFree = await axios.get<any>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset?state=disponible`,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      } )
      const responseBusy = await axios.post<any>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/get-asset-from-personal/${asset.receiver._id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      } )
      setGroupAssetOcup(responseBusy.data)

      setGroupAssetDisp(responseFree.data.assets)
    } catch (error) {
      console.error(error)
    }
  }


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAsset({ ...asset, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/update/${providerId}`,
        asset,
        config
      )

      handleClose()
    } catch (error) {
      console.error(error)
    }
  }

  const getState = async () => {
    try {
      const response = await axios.get<state[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}state`)
      setGroupState(response.data)
    } catch (error) {
      console.error(error)
    }
  }

const getResponsible = async () => {
  try {
    const response = await axios.get<asstResponsible[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}personal`)
    setGroupResponsible(response.data)
  } catch (error) {
    console.error(error)
  }
}

const getReceiver = async () => {
  try {
    const response = await axios.get<asstResponsible[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}personal`)
    setGroupReceiver(response.data)
  } catch (error) {
    console.error(error)
  }
}


const getLocation = async () => {
  try {
    const response = await axios.get<assetLocation[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}organigrama`)
    setGroupLocation(response.data)

  } catch (error) {
    console.error(error)
  }
}

const [dataTest,setDataTest] = useState<any>()
function handleSupplierChange(event: SelectChangeEvent<string>, child: ReactNode): void {
  const data = asset.asset.find(index => index._id == event.target.value)
  setDataTest(data)

}

console.log(asset)
console.log('updated',updatedDelivery)
console.log('ocupados',groupAssetOcup)

  return (
    <>
      <Button   variant="outlined" size="small"
           style={{ color: '#94bb68', borderRadius: '10px',marginRight:'2px',marginTop: '1px',width: '1%',marginBottom:'2px' }}

 onClick={toggleDrawer(true)}>
        <Icon icon='mdi:pencil-outline' fontSize={18} />
      </Button>
      <Drawer
        open={state}
        anchor='right'
        variant='temporary'
        onClose={toggleDrawer(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 700, md: 800, lg: 800 } } }}
      >

        <Header>
          <Typography variant='h6' style={{textTransform:'uppercase'}}>Editar Devolucion</Typography>
          <IconButton size='small' onClick={toggleDrawer(false)} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={19} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit}>





          <Grid item xs={5} sm={7} lg={7}>
  <Typography variant='body2' gutterBottom>
    Responsable de entrega
  </Typography>
  <Autocomplete
    options={groupResponsible}
    getOptionLabel={option => option.fullName}
    value={groupResponsible.find(option => option._id == asset.transmitter._id) || null}
    onChange={(event, newValue) => {
      if (newValue) {
        setAsset({ ...asset, transmitter: {_id:newValue._id,fullName:newValue.fullName} });
      } else {
        setUpdatedDelivery({ ...updatedDelivery, transmitterId: '' });
      }
    }}
    renderInput={params => <TextField {...params} label='' />}
  />
</Grid>


            <Grid item xs={5} sm={7} lg={7}>
  <Typography variant='body2' gutterBottom>
    Responsable de Recibir
  </Typography>
  <Autocomplete
    options={groupReceiver}
    getOptionLabel={option => option.fullName}
    value={groupReceiver.find(option => option._id == asset?.receiver?._id) || null}
    onChange={(event, newValue) => {
        setAsset({ ...asset, receiver: {_id:newValue?._id, fullName:newValue?.fullName} });
    }}
    renderInput={params => <TextField {...params} label='' />}
  />
</Grid>

            <Grid item xs={5} sm={7} lg={7}>
  <Typography variant='body2' gutterBottom>
    Ubicación
  </Typography>
  <Autocomplete
    options={groupLocation}
    getOptionLabel={option => option.Name}
    value={groupLocation.find(option => option._id === asset?.location?._id) || null}
    onChange={(event, newValue) => {
      setAsset({ ...asset, location: {_id: newValue?._id, locationName: newValue?.Name} });
    }}
    renderInput={params => <TextField {...params} label='' />}
  />
</Grid>


            <Grid container>
              <Grid item xs={5} sm={7} lg={7}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Typography variant='body2' gutterBottom>
                      Activos de {asset.receiver.fullName}
                  </Typography>
                  <Select
                    fullWidth
                    value={asset.asset?.name || ''}
                     autoComplete='off'

                     onChange={handleSupplierChange as (event: SelectChangeEvent<string>, child: React.ReactNode) => void}
                  >
                    {asset.asset?.map((asset:any) => (
                      <MenuItem key={asset._id} value={asset._id}>
                        {asset.name} {asset.code}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>




            <Grid container>
              <Grid item xs={5} sm={7} lg={7}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Typography variant='body2' gutterBottom>
                    Activos Disponibles
                  </Typography>
                  <Select
                    fullWidth
                    value={selectedAssetDisp?.name || ''}
                     autoComplete='off'
                  >
                    {groupAssetDisp?.map(asset => (
                      <MenuItem key={asset._id} value={asset._id}>
                        {asset.name} {asset.informationCountable.code}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>


          <Grid container>
              <Grid item xs={5} sm={7} lg={7}>
              <FormControl fullWidth sx={{ mb: 6 }}>
            <Typography variant='body2' gutterBottom>
                Observacion
                </Typography>
              <Controller
                name='observation'
                control={control}
                render={({ field }) => (
                  <>
                     <TextField
                      {...field}
                      // value={asset.observation}
                      id='observation'
                      error={Boolean(errors.observation)}
                      onChange={handleChange}
                      autoComplete='off'
                    />
                  </>
                )}
              />
            </FormControl>
            </Grid>
            </Grid>

</Grid>


            <Grid item xs={5} sm={7} lg={7}>
            <FormControl fullWidth sx={{ mb: 6 }}>
            <Typography variant='body2' gutterBottom>
                Estado
              </Typography>
               <Select

                 id='state'
                //  value={asset.stateId}
                //  onChange={handleStateChange as (event: SelectChangeEvent<string>, child: React.ReactNode) => void}
                autoComplete='off'
               >
                 {groupState?.map(asset => (
                   <MenuItem key={asset._id} value={asset._id}>
                     {asset.name}
                   </MenuItem>
                 ))}
               </Select>
                 
             </FormControl>
            </Grid>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={handleClose}>
                Aceptar
              </Button>
              <Button size='large' variant='outlined' color='secondary' onClick={()=>handleClose}>
                Cancelar
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
    </>
  )
}

export default SidebarEditDevolution
