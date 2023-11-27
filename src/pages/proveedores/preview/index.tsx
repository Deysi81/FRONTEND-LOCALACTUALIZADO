// ** React Imports
import { ChangeEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { Drawer, IconButton } from '@mui/material'
import axios from 'axios'

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
  informationAsset:informationAsset
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

const UserViewLeft = (props: { providerId: string }) => {
  // ** States
  const [state, setState] = useState<boolean>(false)
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
    informationAsset: {
      asset: '',
      description: ''
  }
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

  useEffect(() => {
    getData()
  }, [])
  const getData = async () => {
    await axios
      .get<UserData>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier/${providerId}`)
      .then(response => {
        console.log(response.data)
        setAsset(response.data)
      })
      .catch(error => {
        console.error(error)
      })
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAsset({ ...asset, [e.target.name]: e.target.value })
  }

  return (
    <>


        <Header>
          <Typography variant='h6'>Editar Proveedor</Typography>

        </Header>
        <Box sx={{ p: 5 }}>

            <FormControl fullWidth sx={{ mb: 6 }}>
            <Typography variant='body2' gutterBottom>
                Nombre de Proveedor
                </Typography>
              <Controller
                name='managerName'
                control={control}
                render={({ field }) => (
                  <>

                    <TextField
                      {...field}
                      value={asset.managerName}
                      id='managerName'
                      error={Boolean(errors.managerName)}
                      onChange={handleChange}
                      autoComplete='off'
                    />
                  </>
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
            <Typography variant='body2' gutterBottom>
                Cedula de Identidad
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
            <FormControl fullWidth sx={{ mb: 6 }}>
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
            <FormControl fullWidth sx={{ mb: 6 }}>
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
            <FormControl fullWidth sx={{ mb: 6 }}>
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
            <FormControl fullWidth sx={{ mb: 6 }}>
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
        <FormControl fullWidth sx={{ mb: 6 }}>
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
            <FormControl fullWidth sx={{ mb: 6 }}>
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
                      value={asset.informationAsset.asset}
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
            <FormControl fullWidth sx={{ mb: 6 }}>
            <Typography variant='body2' gutterBottom>
            Descripción
                </Typography>
              <Controller
                name='informationAsset'
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      value={asset.informationAsset.description}
                      id='informationAsset'
                      error={Boolean(errors.informationAsset?.description)}
                      onChange={handleChange}
                      autoComplete='off'
                    />
                  </>
                )}
              />
            </FormControl>


        </Box>
    </>
  )
}
export default UserViewLeft
