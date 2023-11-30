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
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
// ** Types Imports
import axios from 'axios'
import { Grid } from '@mui/material'
import { useAsset } from 'src/context/ProviderContext'
import { useAuthContext } from 'src/context/AuthContext'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface informationAsset{
  asset: string,
  description: string
}

interface UserData {
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
  isDeleted: false,
  email: '',
  businessName: '',
  NIT: '',
  informationAsset: {
    asset: '',
    description: ''
}
}
const SidebarAddSupplier = (props: SidebarAddUserType) => {

  const { createAsset } = useAsset()
  // ** Props
  const { open, toggle } = props
  const [asset, setAsset] = useState<UserData>({

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

  }, [])


  const { accessToken:token } = useAuthContext()
  const handleClose = () => {
    toggle()
    reset()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if(name.startsWith('informationAsset.')){
      const infoCountableField = name.split('.')[1];
    setAsset(prevAsset => ({
      ...prevAsset,
      informationAsset: {
        ...prevAsset.informationAsset,
        [infoCountableField]: value
      }
    }));
    }else{
      setAsset(prevAsset => ({ ...prevAsset, [name]: value }))
    }
  }
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
      try {
        setIsLoading(true);

        const token = localStorage.getItem('token')
        const activos = (asset.informationAsset.asset);
        asset.informationAsset.asset=activos
        const description = (asset.informationAsset.description);
        asset.informationAsset.description=description

        await createAsset(asset)
        handleClose()

      } catch (error:any) {
        console.error(error)
        error(`${error.response.data.message}`);
        toast.error('Hubo un error al crear el proveedor');
      } finally {
        setIsLoading(false); // Ocultar el spinner, ya sea que la solicitud tenga éxito o falle
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
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 550, lg: 700 } } }}
    >
      <Header>
        <Typography variant='h6'>Agregar Proveedor</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form //onSubmit={handleSubmit}
        >
          <FormControl fullWidth sx={{ mb: 2 }}>
          <Typography variant='body2' gutterBottom>
                Nombre
              </Typography>
            <Controller
              name='managerName'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.managerName}
                  placeholder='Juan'
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
                <TextField
                  {...field}
                  value={asset.businessAddress}
                  placeholder='Calle La Paz n°415'
                  error={Boolean(errors.businessAddress)}
                  helperText={errors.businessAddress?.message}
                  onChange={handleChange}
                  autoComplete='off'
                />
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
                    <TextField
                      {...field}
                      value={asset.managerCi}
                      placeholder='CI'
                      error={Boolean(errors.managerCi)}
                      helperText={errors.managerCi?.message}
                      onChange={handleChange}
                      autoComplete='off'
                    />
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
                    <TextField
                      {...field}
                      value={asset.managerPhone}
                      placeholder='78906547'
                      error={Boolean(errors.managerPhone)}
                      helperText={errors.managerPhone?.message}
                      onChange={handleChange}
                      autoComplete='off'
                    />
                  )}
                />
              </FormControl>
            </Grid>
            </Grid>
            <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                  <Typography variant='body2' gutterBottom>
                  Correo Electrónico
                  </Typography>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={asset.email}
                      placeholder='perez@gmail.com'
                      error={Boolean(errors.email)}
                      helperText={errors.email?.message}
                      onChange={handleChange}
                      autoComplete='off'
                    />
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
                <TextField
                  {...field}
                  value={asset.NIT}
                  placeholder=''
                  error={Boolean(errors.NIT)}
                  helperText={errors.NIT?.message}
                  onChange={handleChange}
                  autoComplete='off'
                />
              )}
            />
          </FormControl>
            </Grid>
            </Grid>


          <Typography
            style={{
              textAlign: 'center',
              marginBottom:'8px',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              fontSize: '1.2rem', // Puedes ajustar el tamaño de la fuente según tus preferencias
            }}
          >
            Activos Que le vende a la empresa
          </Typography>
         <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
          <FormControl fullWidth sx={{ mb: 2}}>
              <Typography variant='body2' gutterBottom>
              Nombre del Negocio
              </Typography>
            <Controller
              name='businessName'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.businessName}
                  placeholder=''
                  error={Boolean(errors.businessName)}
                  helperText={errors.businessName?.message}
                  onChange={handleChange}
                  autoComplete='off'
                />
              )}
            />
          </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
          <Typography variant='body2' gutterBottom>
          Activo Que vende
              </Typography>
            <Controller
              name='informationAsset.asset'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.informationAsset.asset}
                  placeholder=''
                  error={Boolean(errors.informationAsset?.asset)}
                  helperText={errors.informationAsset?.asset?.message}
                  onChange={handleChange}
                  autoComplete='off'
                  InputLabelProps={{
                    shrink: true, // Mantiene el etiquetado en su lugar
                    style: {
                      marginBottom: '-8px', // Ajusta el margen inferior según sea necesario
                    },
                  }}
                />
              )}
            />
          </FormControl>
          </Grid>
          </Grid>
          <FormControl fullWidth sx={{ mb: 3 }}>
          <Typography variant='body2' gutterBottom>
          Descripción
              </Typography>
            <Controller
              name='informationAsset.description'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={asset.informationAsset.description}
                  placeholder='Descripcion de lo que vende su empresa'
                  error={Boolean(errors.informationAsset?.description)}
                  helperText={errors.informationAsset?.description?.message}
                  onChange={handleChange}
                  autoComplete='off'
                  InputLabelProps={{
                    shrink: true, // Mantiene el etiquetado en su lugar
                    style: {
                      marginBottom: '-8px', // Ajusta el margen inferior según sea necesario
                    },
                  }}
                />
              )}
            />
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <Button
            variant='contained'
            size='large'
             type='submit'
             //variant='contained'
             disabled={isLoading}
             sx={{ mr: 3 }}
             onClick={(e)=>handleSubmit(e)}
             >
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

export default SidebarAddSupplier


// // ** React Imports
// import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

// // ** MUI Imports
// import Drawer from '@mui/material/Drawer'
// import Button from '@mui/material/Button'
// import { styled } from '@mui/material/styles'
// import TextField from '@mui/material/TextField'
// import IconButton from '@mui/material/IconButton'
// import Typography from '@mui/material/Typography'
// import Box, { BoxProps } from '@mui/material/Box'
// import FormControl from '@mui/material/FormControl'
// import CloudUploadIcon from '@mui/icons-material/CloudUpload'

// // ** Third Party Imports
// import * as yup from 'yup'
// import { yupResolver } from '@hookform/resolvers/yup'
// import { useForm, Controller } from 'react-hook-form'

// // ** Icon Imports
// import Icon from 'src/@core/components/icon'
// import { useAuthContext } from "src/context/AuthContext";


// // ** Types Imports

// import axios from 'axios'
// import { Grid } from '@mui/material'
// import toast from 'react-hot-toast'
// import { useAsset } from 'src/context/ProviderContext'

// interface SidebarAddUserType {
//   open: boolean
//   toggle: () => void
// }


// interface informationAsset{
//   asset: string,
//   description: string
// }

// interface UserData {
//   managerName: string
//   managerCi: string
//   managerPhone: 0
//   businessAddress: string
//   isDeleted: boolean
//   email: string
//   businessName: string
//   NIT: string
//   informationAsset:informationAsset
// }

// const showErrors = (field: string, valueLen: number, min: number) => {
//   if (valueLen === 0) {
//     return `${field} field is required`
//   } else if (valueLen > 0 && valueLen < min) {
//     return `${field} must be at least ${min} characters`
//   } else {
//     return ''
//   }
// }

// const Header = styled(Box)<BoxProps>(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   padding: theme.spacing(3, 4),
//   justifyContent: 'space-between',
//   backgroundColor: theme.palette.background.default
// }))

// const schema = yup.object().shape({
//   businessAddress: yup.string().required(),
//   managerPhone: yup
//     .string()
//     .typeError('')
//     .min(10, obj => showErrors('Celular', obj.value.length, obj.min))
//     .required(),
//   managerName: yup
//     .string()
//     .min(3, obj => showErrors('Nombre', obj.value.length, obj.min))
//     .required()
// })

// const defaultValues = {
//   managerName: '',
//   managerCi: '',
//   managerPhone: 0,
//   businessAddress: '',
//   isDeleted: false,
//   email: '',
//   businessName: '',
//   NIT: '',
//   informationAsset: {
//     asset: '',
//     description: '',
//     image: ''
// }
// }
// const SidebarAddSupplier = (props: SidebarAddUserType) => {

//   const { createAsset } = useAsset()
//   // ** Props
//   const { open, toggle } = props
//   const [previewfile, setPreviewfile] = useState<string | null>(null)
//   const [asset, setAsset] = useState<UserData>({
//     managerName: '',
//     managerCi: '',
//     managerPhone: 0,
//     businessAddress: '',
//     isDeleted: false,
//     email: '',
//     businessName: '',
//     NIT: '',
//     informationAsset: {
//       asset: '',
//       description: ''
// },
//   })

//   // ** Hooks
//   const {
//     reset,
//     control,
//     formState: { errors }
//   } = useForm({
//     defaultValues,
//     mode: 'onChange',
//     resolver: yupResolver(schema)
//   })
//   useEffect(() => {
//     handleSave(asset)
//   }, [])
//   console.log(asset)
//   const { accessToken:token } = useAuthContext()
//   const handleSave = async (asset: UserData) => {

//     await axios

//       .post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier`,  {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }

//       })
//       .then(response => {
//         console.log(response.data)
//         toggle()
//         reset()
//       })
//       .catch(error => {
//         console.error(error)
//       })
//   }

//   const handleClose = () => {
//     toggle()
//     reset()
//   }

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setAsset({ ...asset, [e.tar  .name]: e.target.value })
//   }

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault()

//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier/`, asset, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }

//       })
//       // await createAsset(asset)
//       toast.success('Proveedor Creado');
//       handleClose()
//       console.log(asset)
//       console.log(response.data)
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const UploadButton = styled('label')(({ theme }) => ({
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     border: '1px solid #ccc',
//     borderRadius: theme.spacing(1),
//     padding: theme.spacing(2),
//     cursor: 'pointer',
//     '&:hover': {
//       backgroundColor: '#626262'
//     }
//   }))

//   return (
//     <Drawer
//       open={open}
//       anchor='right'
//       variant='temporary'
//       onClose={handleClose}
//       ModalProps={{ keepMounted: true }}
//       sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 550, lg: 700 } } }}
//     >
//       <Header>
//         <Typography variant='h6'>Agregar Proveedor</Typography>
//         <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
//           <Icon icon='mdi:close' fontSize={20} />
//         </IconButton>
//       </Header>
//       <Box sx={{ p: 5 }}>
//         <form onSubmit={handleSubmit}>
//           <FormControl fullWidth sx={{ mb: 2 }}>
//           <Typography variant='body2' gutterBottom>
//                 Nombre
//               </Typography>
//             <Controller
//               name='managerName'
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   value={asset.managerName}
//                   placeholder='Juan'
//                   error={Boolean(errors.managerName)}
//                   helperText={errors.managerName?.message}
//                   onChange={handleChange}
//                   autoComplete='off'
//                 />
//               )}
//             />
//           </FormControl>
//           <FormControl fullWidth sx={{ mb: 2 }}>
//           <Typography variant='body2' gutterBottom>
//           Dirección
//               </Typography>
//             <Controller
//               name='businessAddress'
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   value={asset.businessAddress}
//                   placeholder='Calle La Paz n°415'
//                   error={Boolean(errors.businessAddress)}
//                   helperText={errors.businessAddress?.message}
//                   onChange={handleChange}
//                   autoComplete='off'
//                 />
//               )}
//             />
//           </FormControl>
//           <Grid container spacing={3}>
//           <Grid item xs={12} sm={6}>
//               <FormControl fullWidth sx={{ mb: 2 }}>
//                   <Typography variant='body2' gutterBottom>
//                     Carnet de Identidad
//                   </Typography>
//                 <Controller
//                   name='managerCi'
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       value={asset.managerCi}
//                       placeholder='CI'
//                       error={Boolean(errors.managerCi)}
//                       helperText={errors.managerCi?.message}
//                       onChange={handleChange}
//                       autoComplete='off'
//                     />
//                   )}
//                 />
//                 </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth sx={{ mb: 2 }}>
//                   <Typography variant='body2' gutterBottom>
//                   Celular
//                   </Typography>
//                 <Controller
//                   name='managerPhone'
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       value={asset.managerPhone}
//                       placeholder='78906547'
//                       error={Boolean(errors.managerPhone)}
//                       helperText={errors.managerPhone?.message}
//                       onChange={handleChange}
//                       autoComplete='off'
//                     />
//                   )}
//                 />
//               </FormControl>
//             </Grid>
//             </Grid>
//             <Grid container spacing={3}>
//             <Grid item xs={12} sm={6}>
//             <FormControl fullWidth sx={{ mb: 2 }}>
//                   <Typography variant='body2' gutterBottom>
//                   Correo Electrónico
//                   </Typography>
//                 <Controller
//                   name='email'
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       value={asset.email}
//                       placeholder='perez@gmail.com'
//                       error={Boolean(errors.email)}
//                       helperText={errors.email?.message}
//                       onChange={handleChange}
//                       autoComplete='off'
//                     />
//                   )}
//                 />
//               </FormControl>

//             </Grid>
//             <Grid item xs={12} sm={6}>
//             <FormControl fullWidth sx={{ mb: 2 }}>
//               <Typography variant='body2' gutterBottom>
//               NIT
//               </Typography>
//             <Controller
//               name='NIT'
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   value={asset.NIT}
//                   placeholder=''
//                   error={Boolean(errors.NIT)}
//                   helperText={errors.NIT?.message}
//                   onChange={handleChange}
//                   autoComplete='off'
//                 />
//               )}
//             />
//           </FormControl>
//             </Grid>
//             </Grid>


//           <Typography
//             style={{
//               textAlign: 'center',
//               marginBottom:'8px',
//               textTransform: 'uppercase',
//               fontWeight: 'bold',
//               fontSize: '1.2rem', // Puedes ajustar el tamaño de la fuente según tus preferencias
//             }}
//           >
//             Activos Que le vende a la empresa
//           </Typography>
//          <Grid container spacing={3}>
//           <Grid item xs={12} sm={6}>
//           <FormControl fullWidth sx={{ mb: 2}}>
//               <Typography variant='body2' gutterBottom>
//               Nombre del Negocio
//               </Typography>
//             <Controller
//               name='businessName'
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   value={asset.businessName}
//                   placeholder=''
//                   error={Boolean(errors.businessName)}
//                   helperText={errors.businessName?.message}
//                   onChange={handleChange}
//                   autoComplete='off'
//                 />
//               )}
//             />
//           </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//           <FormControl fullWidth sx={{ mb: 2 }}>
//           <Typography variant='body2' gutterBottom>
//           Activo Que vende
//               </Typography>
//             <Controller
//               name='informationAsset'
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   value={asset.informationAsset.asset}
//                   placeholder=''
//                   error={Boolean(errors.informationAsset?.asset)}
//                   helperText={errors.informationAsset?.asset?.message}
//                   onChange={handleChange}
//                   autoComplete='off'
//                   InputLabelProps={{
//                     shrink: true, // Mantiene el etiquetado en su lugar
//                     style: {
//                       marginBottom: '-8px', // Ajusta el margen inferior según sea necesario
//                     },
//                   }}
//                 />
//               )}
//             />
//           </FormControl>
//           </Grid>
//           </Grid>
//           <FormControl fullWidth sx={{ mb: 3 }}>
//           <Typography variant='body2' gutterBottom>
//           Descripción
//               </Typography>
//             <Controller
//               name='informationAsset'
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   value={asset.informationAsset.description}
//                   placeholder='Descripcion de lo que vende su empresa'
//                   error={Boolean(errors.informationAsset?.description)}
//                   helperText={errors.informationAsset?.description?.message}
//                   onChange={handleChange}
//                   autoComplete='off'
//                   InputLabelProps={{
//                     shrink: true, // Mantiene el etiquetado en su lugar
//                     style: {
//                       marginBottom: '-8px', // Ajusta el margen inferior según sea necesario
//                     },
//                   }}
//                 />
//               )}
//             />
//           </FormControl>

//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={handleSubmit}>
//               Aceptar
//             </Button>
//             <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
//               Cancelar
//             </Button>
//           </Box>
//         </form>
//       </Box>
//     </Drawer>
//   )
// }

// export default SidebarAddSupplier
