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
import { useAsset } from 'src/context/ProviderContext'
import { useAuthContext } from 'src/context/AuthContext'


// ** Icon Imports
import Icon from 'src/@core/components/icon'

import axios from 'axios'
import InputLabel from '@mui/material/InputLabel'
import { Grid } from '@mui/material'


interface SidebarEditSupplierProps {
  providerId: string;
  open: boolean
  toggle: () => void
}

interface informationAsset{
  asset: string,
  description: string
}

interface UserData {
  _id: string
  managerName: string
  managerCi: string
  managerPhone: number
  businessAddress: string
  email: string
  businessName: string
  NIT: string
  informationAsset:informationAsset[]
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
  managerName: '',
  managerCi: '',
  managerPhone: 0,
  businessAddress: '',
  email: '',
  businessName: '',
  NIT: '',
  informationAsset: {
    asset: '',
    description: '',
}
}


 //const SidebarEditProvider = (props: { providerId: string }) => {
const SidebarEditProvider: React.FC<SidebarEditSupplierProps> = (props) => {
  const { getAsset, updateAsset } = useAsset()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { toggle } = props
   const providerId = props.providerId
  const [asset, setAsset] = useState<UserData>({
    _id: '',
    managerName: '',
    managerCi: '',
    managerPhone: 0,
    businessAddress: '',
    email: '',
    businessName: '',
    NIT: '',
    informationAsset:[ {
      asset: '',
      description: ''
  }]
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

  const token = localStorage.getItem('token')

  useEffect(() => {
    getData()
  }, [])
  const getData = async () => {
    try {
      // const response = await axios.get<UserData>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset/${providerId}`)
      const res = await getAsset(providerId)
      // const responseData = response.data;
      console.log(res,'editttt')
      setAsset({
        ...asset,
        _id: res._id,
        managerName: res.managerName,
        managerCi: res.managerCi,
        managerPhone: res.managerPhone,
        businessAddress: res.businessAddress,
        email: res.email,
        businessName:res.businessName,
        NIT: res.NIT,
        informationAsset:[{
          asset: res.informationAsset[0].asset ,
          description: res.informationAsset[0].description,
        }]
      });

    } catch (error) {
      alert(error);
    }
  }


  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);

  };

  const handleClose = () => {
    toggle()
    reset()
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('informationAsset.')) {
      const infoCountableField = name.split('.')[1];
      setAsset((prevAsset) => ({
        ...prevAsset,
        informationAsset: {
          ...prevAsset.informationAsset,
          [infoCountableField]: value,
        },
      }));
    } else {
      setAsset((prevAsset) => ({ ...prevAsset, [name]: value }));

    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {

      setIsLoading(true);
        const newData = {
        managerName: asset.managerName,
        managerCi: asset.managerCi,
        managerPhone: asset.managerPhone,
        businessAddress:asset.businessAddress,
        email: asset.email,
        businessName: asset.businessName,
        NIT: asset.NIT,
        informationAsset:{
          asset: asset.informationAsset[0].asset,
          description:asset.informationAsset[0].description
        },
      }

      await updateAsset(providerId,newData) ;
      toggleDrawer();
      //handleClose()
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <Button variant="outlined" size="small"
           style={{ color: '#94bb68', borderRadius: '10px',marginRight:'1.8px',width: '40px',marginBottom:'7px'  }}
           onClick={toggleDrawer}>
        <Icon icon='mdi:pencil-outline' fontSize={20} />
      </Button>
      <Drawer
        open={isDrawerOpen}
        anchor='right'
        variant='temporary'
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 750 } } }}
      >
        <Header>
          <Typography variant='h6'>Editar Proveedor</Typography>
          <IconButton size='small' onClick={toggleDrawer} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit}
          >
            <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography variant='body2' gutterBottom>
                Nombre de Proveedor
                </Typography>
              <Controller
                name='managerName'
                control={control}
                render={({ field }) => (
                    <TextField
                      {...field}
                      value={asset.managerName}
                      id='managerName'
                      error={Boolean(errors.managerName)}
                      helperText={errors.managerName?.message}
                      onChange={handleChange}
                      autoComplete='off'
                    />

                )}
              />
            </FormControl>
             <FormControl fullWidth sx={{ mb: 2 }}>
                <Typography variant='body2' gutterBottom>
                  Dirección
                </Typography>
              <Controller
                name='businessAddress'
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      value={asset.businessAddress}
                      id='businessAddress'
                      error={Boolean(errors.businessAddress)}
                      onChange={handleChange}
                      autoComplete='off'
                    />
                  </>
                )}
              />
            </FormControl>
            <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography variant='body2' gutterBottom>
                Carnet de Identidad
                </Typography>
              <Controller
                name='managerCi'
                control={control}
                render={({ field }) => (
                  <>

                    <TextField
                      {...field}
                      value={asset.managerCi}
                      id='managerCi'
                      error={Boolean(errors.managerCi)}
                      onChange={handleChange}
                      autoComplete='off'
                    />
                  </>
                )}
              />
            </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography variant='body2' gutterBottom>
                Celular
                </Typography>
              <Controller
                name='managerPhone'
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      value={asset.managerPhone}
                      id='managerPhone'
                      error={Boolean(errors.managerPhone)}
                      onChange={handleChange}
                      autoComplete='off'
                    />
                  </>
                )}
              />
            </FormControl>
            </Grid>
            </Grid>
            <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
              <Typography variant='body2' gutterBottom>
              Correo Electrónico Del Negocio
                  </Typography>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <>

                      <TextField
                        {...field}
                        value={asset.email}
                        id='email'
                        error={Boolean(errors.email)}
                        onChange={handleChange}
                        autoComplete='off'
                      />
                    </>
                  )}
                />
              </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                      <Typography variant='body2' gutterBottom>
                        NIT
                      </Typography>
                    <Controller
                      name='NIT'
                      control={control}
                      render={({ field }) => (
                        <>
                          <TextField
                            {...field}
                            value={asset.NIT}
                            id='NIT'
                            error={Boolean(errors.NIT)}
                            onChange={handleChange}
                            autoComplete='off'
                          />
                        </>
                      )}
                    />
                  </FormControl>
              </Grid>
              </Grid>
            <Typography
                style={{
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  fontSize: '1.2rem', // Puedes ajustar el tamaño de la fuente según tus preferencias
                  marginBottom: '8px'
                }}
              >
                Activos Que le vende a la empresa
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Typography variant='body2' gutterBottom>
                    Nombre del Negocio
                        </Typography>
                      <Controller
                        name='businessName'
                        control={control}
                        render={({ field }) => (
                          <>
                            <TextField
                              {...field}
                              value={asset.businessName}
                              id='businessName'
                              error={Boolean(errors.businessName)}
                              onChange={handleChange}
                              autoComplete='off'
                            />
                          </>
                        )}
                      />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Typography variant='body2' gutterBottom>
                    Activo Que Tiene la Empresa
                        </Typography>
                      <Controller
                        name='informationAsset.asset'
                        control={control}
                        render={({ field }) => (
                          <>
                            <TextField
                              {...field}
                              value={asset.informationAsset[0].asset}
                              fullWidth
                              error={Boolean(errors.informationAsset?.asset)}
                              id='informationAsset.asset'
                              onChange={handleChange}
                              autoComplete='off'
                            />
                          </>
                        )}
                      />
                    </FormControl>
                </Grid>
            </Grid>
            <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography variant='body2' gutterBottom>
            Descripción
                </Typography>
              <Controller
                name='informationAsset.description'
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      value={asset.informationAsset[0].description}
                      id='informationAsset'
                      error={Boolean(errors.informationAsset?.description)}
                      helperText={errors.informationAsset?.description?.message}
                      onChange={handleChange}
                      autoComplete='off'
                    />
                  </>
                )}
              />
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={handleSubmit}>
                Guardar
              </Button>
              <Button size='large' variant='outlined' color='secondary' onClick={toggleDrawer}>
                Cancelar
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
    </>
  )
}

export default SidebarEditProvider

