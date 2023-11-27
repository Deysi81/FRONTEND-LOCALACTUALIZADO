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

// ** Types Imports

import axios from 'axios'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}




interface UserData {
  code: string
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
  code: ''
}
const SidebarAddQR = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle } = props
  const [asset, setAsset] = useState<UserData>({
    code: ''
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
    handleSave(asset)
  }, [])
  console.log(asset)

 const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NGU1MjJlMGZhYTBiZTE1ZjgyNzQxYjciLCJBcHAiOnsiMCI6eyJ1dWlkIjoiY2FiODM2MzUtM2ZlMC00OGQxLTkzMTYtOTEzYWRjOTgxYThjIiwibmFtZSI6ImNlbnRyYWwiLCJ1cmwiOiJodHRwOi8vMTAuMTAuMjE0LjIxOTozMDA1L2hvbWUifX0sInJvbGVzIjpbIjY0ZTUyMTA2ZTNhYjFmYmFkYzEwZWRmMiJdLCJpYXQiOjE2OTUwNDE0NTYsImV4cCI6MTY5NTA2MzA1Nn0.z8SbQLYwc9XZhm8xc1rsjm_EZWRMOaajPKGIsIYKwis'
  const handleSave = async (asset: UserData) => {

    await axios

      .post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/get-data-qr`, asset, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }

      })
      .then(response => {
        console.log(response.data)
        toggle()
        reset()
      })
      .catch(error => {
        console.error(error)
      })
  }

  const handleClose = () => {
    toggle()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAsset({ ...asset, [e.target.name]: e.target.value })
  }


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/get-data-qr/`, asset, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }

      })
      console.log(asset)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const UploadButton = styled('label')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#626262'
    }
  }))

  return (

      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='code'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.code}
                  label='Codigo'
                  error={Boolean(errors.code)}
                  helperText={errors.code?.message}
                  onChange={handleChange}
                  autoComplete='off'
                />
              )}
            />
          </FormControl>



          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={handleSubmit}>
              Aceptar
            </Button>
            {/* <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancelar
            </Button> */}
          </Box>
        </form>
      </Box>

  )
}

export default SidebarAddQR
