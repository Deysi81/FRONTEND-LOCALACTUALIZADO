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
import { useAuthContext } from "src/context/AuthContext";


// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports

import axios from 'axios'
import { InputLabel } from '@mui/material'

interface UserData {
  _id: string
  assetCategory: string
  usefulLife: number
  subCategory: subCategory
}

interface subCategory {
  subCategory:string
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
  usefulLife: yup
    .string()
    .typeError('')
    .min(10, obj => showErrors('Celular', obj.value.length, obj.min))
    .required(),
    assetCategory: yup
    .string()
    .min(3, obj => showErrors('Nombre', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  assetCategory: '',
  usefulLife: 0,
  subCategory: {
    subCategory:'',
  }
}

const SidebarEditContable = (props: { ContableId: string }) => {
  // ** Props
  // ** State
  const [state, setState] = useState<boolean>(false)
  const ContableId = props.ContableId
  const [asset, setAsset] = useState<UserData>({
    _id: '',
  assetCategory: '',
  usefulLife: 0,
  subCategory: {
    subCategory:'',
  }

  })

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
    control,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleClose = () => {
  }

  useEffect(() => {
      getData()

  }, [])


  const getData = async () => {
    await axios
      .get<UserData>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list/${ContableId}`)
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
    e.preventDefault(); // Evita la recarga de la página al enviar el formulario

  // const handleSubmit = async (
  //   // e: FormEvent
  //   ) => {
  //   // e.preventDefault()
    const { accessToken:token } = useAuthContext()
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list/${ContableId}`
       , {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }}

        )
      // console.log(asset)
      // console.log(response.data)
      // handleClose()
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <Button variant="outlined" size="small" style={{  color:  '#94bb68', borderRadius: '10px',marginRight:'2px' ,marginBottom:'-8px'}} onClick={toggleDrawer(true)}>
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
          <Typography variant='h6' style={{textTransform: 'uppercase'}}>Editar Grupo Contable</Typography>
          <IconButton size='small' onClick={toggleDrawer(false)} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
          <Typography variant='body2' gutterBottom>
                Nombre De Categoría
              </Typography>
              <Controller
                name='assetCategory'
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      value={asset.assetCategory}
                      id='assetCategory'
                      error={Boolean(errors.assetCategory)}
                      onChange={handleChange}
                      autoComplete='off'
                    />
                  </>
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
            <Typography variant='body2' gutterBottom>
            Vida Útil
              </Typography>
              <Controller
                name='usefulLife'
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      value={asset.usefulLife}
                      id='usefulLife'
                      error={Boolean(errors.usefulLife)}
                      onChange={handleChange}
                      autoComplete='off'
                    />
                  </>
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 3 }}>
          <Typography variant='body2' gutterBottom>
                subcategoria
              </Typography>
              <Controller
                name='subCategory'
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      value={asset.subCategory}
                      id='assetCategory'
                      error={Boolean(errors.subCategory)}
                      onChange={handleChange}
                      autoComplete='off'
                    />
                  </>
                )}
              />
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={ handleSubmit }>
                Guardar
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

export default SidebarEditContable
