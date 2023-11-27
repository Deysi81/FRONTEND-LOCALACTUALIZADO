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

import axios from 'axios'
import InputLabel from '@mui/material/InputLabel'

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

const SidebarEditProvider = (props: { providerId: string }) => {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NTE2ZTI4MWZjMTI3NjNhOTcxZGE1MTUiLCJBcHAiOnsiMCI6eyJ1dWlkIjoiNjc0MTMyOGQtZjkzZi00ZTg2LTg1OGMtNmI2MDk4Zjk1YzQ2IiwibmFtZSI6ImNlbnRyYWwiLCJ1cmwiOiJodHRwOi8vMTAuMTAuMjE0LjIyNTozMDAwL2hvbWUifX0sInJvbGVzIjpbIjY0ZjhmMDg4MWI2NmFlZGE1ZWEzZDYyNyJdLCJwYXNzd29yZCI6IiQyYiQxMCRqNG9QLjY1UkZxV0t2WW93TEw2bTJPV1pPL1ZjRE5vZ2I5ZTJjSGRseXhwcmVXNDdoV3JqUyIsImlhdCI6MTY5NjM2MTkzNSwiZXhwIjoxNjk2MzgzNTM1fQ.9dsW9HcOoWgEv4OlDSlTi427AKM2WaCvIbMsf9EG_ZU'
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier/update/${providerId}`,
        asset,
        config
      )
      console.log(asset)
      console.log(response.data)
      handleClose()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Button variant="outlined" size="small"
           style={{ color: '#94bb68', borderRadius: '10px',marginRight:'1.8px',width: '40px',marginBottom:'7px'  }}
           onClick={toggleDrawer(true)}>
        <Icon icon='mdi:pencil-outline' fontSize={20} />
      </Button>
      <Drawer
        open={state}
        anchor='right'
        variant='temporary'
        onClose={toggleDrawer(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 750 } } }}
      >
        <Header>
          <Typography variant='h6'>Editar Proveedor</Typography>
          <IconButton size='small' onClick={toggleDrawer(false)} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit}>
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
    </>
  )
}

export default SidebarEditProvider
