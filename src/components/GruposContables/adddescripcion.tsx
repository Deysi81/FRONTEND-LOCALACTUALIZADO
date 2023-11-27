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

// ** Store Imports

import axios from 'axios'
import { InputLabel } from '@mui/material'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useAuthContext } from 'src/context/AuthContext'

interface UserData {
  _id: string
  subCategory: string[]
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
  subCategory: ['']
}

const SidebarAddDescripcion = (props: { ContableId: string }) => {
  // token
  const { accessToken:token } = useAuthContext()

  // ** State
  const [state, setState] = useState<boolean>(false)
  const ContableId = props.ContableId
  const [asset, setAsset] = useState<UserData>({
    _id: '',
    subCategory: ['']

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
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleClose = () => {

    reset()
  }

  useEffect(() => {

      getData()

  }, [])


  const getData = async () => {
    await axios
      .get<UserData>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list/${ContableId}`
      , {
        headers: {
          Authorization: `Bearer ${token}`,
          ',Content-Type': 'application/json',
        }
      })
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
    try {
      const data = {
        subCategory: asset.subCategory // Supongo que asset.subCategory contiene la subcategoría que deseas agregar
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list/get-subcategory/${ContableId}`,data
        , {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })
      console.log(asset)
      console.log(response.data)
      handleClose()
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>

    <Button
      // variant='contained'
        color="secondary"

        fullWidth
        size='small'
        sx={{m:'1%  0 0 40%'}}
        style={{ border: '1px solid #ccc',fontSize:'1.4rem', borderRadius: '20px', marginBottom: '1px', width: '10px', height: '25px' }}
        onClick={toggleDrawer(true)}>+</Button>

      <Drawer
        open={state}
        anchor='right'
        variant='temporary'
        onClose={toggleDrawer(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 750 } } }}
      >
        <Header>
          <Typography variant='h6'style={{textTransform:'uppercase'}}>Agregar Subcategoría(Descripción)</Typography>
          <IconButton size='small' onClick={toggleDrawer(false)} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 4 }}>
          <Typography variant='body2' gutterBottom>
          Descripción
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
              <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={handleSubmit}>
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

export default SidebarAddDescripcion
