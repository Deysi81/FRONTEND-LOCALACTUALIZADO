
// ** React Imports
import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports

import axios from 'axios'
import {
  Select,
  SelectChangeEvent,
  MenuItem,
  Card,
  CardContent,
  Step,
  StepLabel,
  Stepper,
  CircularProgress,

} from '@mui/material'
import React from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import StepperWrapper from 'src/@core/styles/mui/stepper'
import StepperCustomDot from 'src/views/forms/form-wizard/StepperCustomDot'
import { useAsset } from 'src/context/AssetContext'
import { useAuthContext } from 'src/context/AuthContext'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface InformationCountable {
  price: number
  dateAcquisition: string
  warrantyExpirationDate: Date
  lote: number
}
interface supplier {
  _id: string
  managerName: string
  managerCi: string
  managerPhone: number
  businessAddress: string
  email: string
  businessName: string
  NIT: string
  asset: boolean
}
interface state {
  _id: string,
  name: string,
  isDeleted: boolean

}
interface location {
  _id: string,
  Name: string
}
interface UserData {
  name: string
  description: string
  // responsible: string
  supplier: string
  state:string
  file: string
  typeCategoryAsset: string
  informationCountable: InformationCountable
  location: string
}
interface assetCategory {
  _id: string
  assetCategory: string
}

// interface responsible {
//   _id: string,
//   fullName: string,
//   email: string
// }
const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `El campo ${field} es requerido`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} debe tener al menos ${min} caracteres`;
  } else {
    return '';
  }
};

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  name: yup
  .string()
  .min(3, obj => showErrors('Nombre', obj.value.length, obj.min))
  .required(),
  description: yup
  .string()
  .min(3, obj => showErrors('Descripcion', obj.value.length, obj.min))
  .required(),
  supplier: yup
  .string()
  .min(3, obj => showErrors('Proveeedor', obj.value.length, obj.min))
  .required(),
  state: yup
  .string()
  .min(3, obj => showErrors('Estado', obj.value.length, obj.min))
  .required(),
  typeCategoryAsset: yup
  .string()
  .min(3, obj => showErrors('Tipo De Categoria', obj.value.length, obj.min))
  .required(),
  price: yup
  .string()
  .min(1, obj => showErrors('Precio', obj.value.length, obj.min))
  .required(),
  lote: yup
  .string()
  .min(1, obj => showErrors('Lote', obj.value.length, obj.min))
  .required(),
  dateAcquisition: yup.string().required(),
  warrantyExpirationDate: yup.string().required(),
  location: yup
  .string()
  .min(4, obj => showErrors('Ubicacion', obj.value.length, obj.min))
  .required(),

})

const defaultValues = {
  name: '',
  description: '',
  responsible: '',
  supplier: '',
  state:'',
  informationCountable: {
    price: 0,
    dateAcquisition: '2023-08-08',
    warrantyExpirationDate: new Date('2023-08-08'),
    lote: 0
  },
  location: '',
  file: '',
  typeCategoryAsset: '' //
}
const steps = [
  {
    title: 'Información General'
  },
  {
    title: 'Información Contable'
  },
  {
    title: 'Ubicación'
  }
]

const SidebarAddAssetNew = (props: SidebarAddUserType) => {

  const { createAsset } = useAsset()

  const { open, toggle } = props
  const [previewfile, setPreviewfile] = useState<string | null>(null)
  const [groupContable, setGroupContable] = React.useState<assetCategory[]>([])
  const [groupprovider, setGroupprovider] = useState<supplier[]>([])
  // const [responsible, setResponsible] = useState<responsible[]>()

  const [State, setState] = useState<state[]>()
  // const [grouplocation, setGrouplocation] = useState<location[]>()
  const [groupLocation, setGroupLocation] = React.useState<location[]>([])


  const [selectedState, setSelectedState] = useState<state | null>(null)

  const [selectedSupplier, setSelectedSupplier] = useState<supplier | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<location | null>(null)

  const [activeStep, setActiveStep] = useState<number>(0)
  const [asset, setAsset] = useState<UserData>({
    name: '',
    description: '',
    // responsible: '',
    supplier: '',
    file: '',
    typeCategoryAsset: '',
    state:'',
    informationCountable: {
      price: 0,
      dateAcquisition: '2023-08-08',
      warrantyExpirationDate: new Date('2023-08-08'),
      lote: 0
    },

    location: ''
  })

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
    toggle()
    reset()
  }
  useEffect(() => {
    getAsset()
    getsupplier()
    // getResponsible()
    getLocation()
    getState()
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target
    if(name.startsWith('informationCountable.')){
      const infoCountableField = name.split('.')[1];
    setAsset(prevAsset => ({
      ...prevAsset,
      informationCountable: {
        ...prevAsset.informationCountable,
        [infoCountableField]: value
      }
    }));
    }else if(name.startsWith('location')){
      setAsset(prevAsset => ({
        ...prevAsset,
        location: value
      }));
    }else{
      setAsset(prevAsset => ({ ...prevAsset, [name]: value }))
    }

  }

  const handlefileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    reader.onload = function () {
      if (reader.readyState === 2) {
        const formattedDate = new Date().toISOString()
        setAsset({ ...asset, file: reader.result as string })
        setPreviewfile(reader.result as string)
      }
    }
    if (e.target.files && e.target.files.length > 0) {
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()


    if (activeStep === steps.length - 1) {
      try {
        setIsLoading(true);
        // <CircularProgress />
        const token = localStorage.getItem('token')
        const date = asset.informationCountable.dateAcquisition

        asset.informationCountable.dateAcquisition=date.substr(0, 10)
        asset.informationCountable.price

        const numericPrice = parseFloat(asset.informationCountable.price.toString());
        asset.informationCountable.price=numericPrice


        const numericLote = parseFloat(asset.informationCountable.lote.toString())

        await createAsset(asset)
        handleClose()


      } catch (error:any) {
        console.error(error)
        error(`${error.response.data.message}`);
        toast.error('Hubo un error al crear el activo');
      } finally {
        setIsLoading(false); // Ocultar el spinner, ya sea que la solicitud tenga éxito o falle
      }

    } else {
      handleNext();
    }
  }

  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NGU1MjJlMGZhYTBiZTE1ZjgyNzQxYjciLCJBcHAiOnsiMCI6eyJ1dWlkIjoiY2FiODM2MzUtM2ZlMC00OGQxLTkzMTYtOTEzYWRjOTgxYThjIiwibmFtZSI6ImNlbnRyYWwiLCJ1cmwiOiJodHRwOi8vMTAuMTAuMjE0LjIxOTozMDA1L2hvbWUifX0sInJvbGVzIjpbIjY0ZTUyMTA2ZTNhYjFmYmFkYzEwZWRmMiJdLCJpYXQiOjE2OTgzMjc5OTgsImV4cCI6MTY5ODM0OTU5OH0.sFYMTN-HFSAqE9Al7MncfbhUyJl6_vHY4_1h0MmCMTE'

  const { accessToken:token } = useAuthContext()
  const getAsset = async () => {
    try {
      console.log(asset.informationCountable.warrantyExpirationDate)
      const response = await axios.get<assetCategory[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list`
      , {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }

      })

      setGroupContable(response.data)
      // setGrouplocation(response.data)
      fetchTableData()
      toggle() // Cierra el cuadro de diálogo
      reset()
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
       const response = await axios.get<location[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}organigrama`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
console.log(getLocation,'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
      setGroupLocation(response.data)
      // setGrouplocation(response.data)
      fetchTableData()
      toggle() // Cierra el cuadro de diálogo
      reset()
    } catch (error) {
      console.error(error)
    }
  }

  const handleProviderChange = (e: ChangeEvent<{ value: unknown }>) => {
    const selectedSupplierId = e.target.value as string
    const selectedSupplierObj = groupprovider?.find(supplier => supplier.managerName === selectedSupplierId) || null
    asset.supplier=selectedSupplierObj?._id || ""
    setSelectedSupplier(selectedSupplierObj)
  }



  const getsupplier = async () => {
    const tokens = localStorage.getItem('token')
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier`, {
        headers: {
          Authorization: `Bearer ${tokens}`,
          'Content-Type': 'application/json'
        }
      }
      )
      await setGroupprovider(response.data.suppliers)
    } catch (error) {
      console.error(error)
    }
  }
  const handleStateChange = (e: ChangeEvent<{ value: unknown }>) => {
    const selectedStateId = e.target.value as string
    const selectedStateObj = State?.find(state => state.name === selectedStateId) || null
    asset.state=selectedStateObj?._id || ""
    setSelectedState(selectedStateObj)
  }



  const getState = async () => {
    try {
      const response = await axios.get<state[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}state`
      , {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }

      })
      setState(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }
  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
    if (activeStep === steps.length - 1) {
      toast.success('Form Submitted')
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
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Fragment>
            <Grid item xs={12} md={12}>
              <Button  variant="contained"
                fullWidth
                color="primary"// Cambiado a "outlined"
                size="large"
                startIcon={<CloudUploadIcon style={{fontSize: '40px'}}/>}
                component="label"
                style={{height: '80px'}}
                >

                <Typography style={{color:'white'}}>Seleccionar Imagen</Typography>
                <input id='file' type='file' accept='image/*' style={{ display: 'none'}} onChange={handlefileChange} />
              </Button>
              {previewfile && (
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <img src={previewfile} alt='Preview' style={{ maxWidth: '100%', maxHeight: '300px' }} />
                </div>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
            <Typography variant='body2' gutterBottom>
                Nombre
              </Typography>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={asset.name}
                    fullWidth
                    placeholder='Nombre del Activo'
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                    onChange={handleChange}
                    autoComplete='off'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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

                    fullWidth
                    placeholder='Describir el activo '
                    error={Boolean(errors.description)}
                    helperText={errors.description?.message}
                    onChange={handleChange}
                    autoComplete='off'
                  />
                )}
              />
            </Grid>

            <Grid item xs={15} sm={6} lg={6}>
              <Typography variant='body2' gutterBottom>
                Proveedor
              </Typography>
              {/* <Select
                fullWidth
                value={selectedSupplier?.managerName || ''}
                onChange={handleProviderChange as (event: SelectChangeEvent<string>, child: React.ReactNode) => void}
                autoComplete='off'
              >
                {groupprovider?.map(asset => (
                  <MenuItem key={asset._id} value={asset.managerName}>
                    {asset.managerName}
                  </MenuItem>
                ))}
              </Select> */}
              <Autocomplete
                    options={groupprovider}
                    getOptionLabel={option => option.managerName}
                    value={groupprovider.find(option => option._id === asset.supplier) || null}
                    onChange={(event, newValue) => {
                      setAsset({ ...asset, supplier: newValue?._id || '' });
                    }}
                    filterOptions={(options, state) => {
                      if (state.inputValue.length < 4) {
                        // Si se ingresan menos de 4 caracteres, no muestra opciones
                        return [];
                      }
                      return options.filter(option =>
                        option.managerName.toLowerCase().includes(state.inputValue.toLowerCase())
                      );
                    }}
                    renderInput={params => <TextField {...params} label='' />}
                    noOptionsText="No hay opciones disponibles" // Cambia el texto aquí
                  />
            </Grid>

            <Grid item xs={15} sm={6} lg={6}>
              <Typography variant='body2' gutterBottom>
                Estado
              </Typography>
              <Select
                fullWidth
                value={selectedState?.name || ''}
                onChange={handleStateChange as (event: SelectChangeEvent<string>, child: React.ReactNode) => void}
                autoComplete='off'
              >
                {State?.map(asset => (
                  <MenuItem key={asset._id} value={asset.name}>
                    {asset.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography variant='body2' gutterBottom>
                Categoría
              </Typography>
              <Autocomplete
                options={groupContable}
                getOptionLabel={option => option.assetCategory}
                value={groupContable.find(option => option.assetCategory === asset.typeCategoryAsset) || null}
                onChange={(event, newValue) => {
                  setAsset({ ...asset, typeCategoryAsset: newValue?.assetCategory || '' })
                }}
                renderInput={params => <TextField {...params} label='' />}
              />
            </Grid>
          </Fragment>
        )
      case 1:
        return (
          <Fragment key={step}>
            <Grid item xs={12} sm={6}>
            <Typography variant='body2' gutterBottom>
                Precio
              </Typography>
              <Controller
                name='informationCountable.price'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={asset.informationCountable.price}
                    fullWidth
                    placeholder=' '
                    error={Boolean(errors.informationCountable?.price)}
                    helperText={errors.informationCountable?.price?.message}
                    onChange={handleChange}
                    autoComplete='off'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <Typography variant='body2' gutterBottom>
                Lote
              </Typography>
              <Controller
                name='informationCountable.lote'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={asset.informationCountable.lote}
                    fullWidth
                    placeholder=' '
                    error={Boolean(errors.informationCountable?.lote)}
                    helperText={errors.informationCountable?.lote?.message}
                    onChange={handleChange}
                    autoComplete='off'
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant='body2' gutterBottom>
                Fecha de Adquisición
              </Typography>
              <Controller
                name='informationCountable.dateAcquisition'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type='datetime-local'
                    fullWidth
                    value={asset.informationCountable.dateAcquisition}
                    placeholder=' '
                    error={Boolean(errors.informationCountable?.dateAcquisition)}
                    helperText={errors.informationCountable?.dateAcquisition?.message}
                    onChange={handleChange}
                    autoComplete='off'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' gutterBottom>
                Fecha de expiración de la garantía
              </Typography>
              <Controller
                name='informationCountable.warrantyExpirationDate'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type='datetime-local'
                    value={asset.informationCountable.warrantyExpirationDate}
                    fullWidth
                    placeholder=' '
                    error={Boolean(errors.informationCountable?.warrantyExpirationDate)}
                    helperText={errors.informationCountable?.warrantyExpirationDate?.message}
                    onChange={handleChange}
                    autoComplete='off'
                  />
                )}
              />
            </Grid>
          </Fragment>
        )
      case 2:
        return (
          <Fragment key={step}>
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
          </Fragment>
        )
      default:
        return 'Unknown Step'
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>Registro Exitoso..!</Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size='large' variant='contained' onClick={handleClose}>
              Reset
            </Button>
          </Box>
        </Fragment>
      )
    } else {
      return (
        <form //onSubmit={e => handleSubmit(e)}
        >
          {/* e.preventDefault() */}
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                {steps[activeStep].title}
              </Typography>
            </Grid>
            {getStepContent(activeStep)}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                size='large'
                variant='outlined'
                color='secondary'
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Atras
              </Button>
              <Button
              type='submit'
              onClick={(e)=>handleSubmit(e)}
              size='large'
              disabled={isLoading}
              // variant='contained' //onClick={handleNext}
              variant='contained'
              color='primary'
              >
                <Icon icon='mdi:content-save' fontSize={18} />
                {activeStep === steps.length - 1 ? ' Aceptar' : ' Siguiente'}
              </Button>
            </Grid>

          </Grid>
          {isLoading ? (
              <CircularProgress
                size="1vw" // Ajusta el tamaño según tus preferencias
                style={{ minWidth: '50px', minHeight: '50px' }} // Establece un tamaño mínimo
              />
            ) : ""}

          {/* {isLoading ? (<CircularProgress size={80} />) : ""} */}
        </form>

      )
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 500, md: 800, lg: 800 } } }}
    >
      <div style={{ height: '100%', overflowY: 'scroll' }}>
        <Header >
          <Typography variant='h6' style={{textTransform:'uppercase'}}>Agregar Nuevo Activo</Typography>
          <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Fragment>
          <StepperWrapper>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step, index) => {
                return (
                  <Step key={index}>
                    <StepLabel StepIconComponent={StepperCustomDot}>
                      <div className='step-label'>
                        <div>
                          <Typography className='step-title'>{step.title}</Typography>
                        </div>
                      </div>
                    </StepLabel>
                  </Step>
                )
              })}
            </Stepper>
          </StepperWrapper>
          <Card sx={{ mt: 4 }}>
            <CardContent>{renderContent()}</CardContent>
          </Card>
        </Fragment>
      </div>
    </Drawer>
  )
}

export default SidebarAddAssetNew
export function ComboBox(category: assetCategory[]) {
  return (
    <Autocomplete
      disablePortal
      id='combo-box-demo'
      options={category}
      sx={{ width: 300 }}
      renderInput={params => <TextField {...params} label='Movie' />}
    />
  )
}
function fetchTableData() {
  throw new Error('Function not implemented.')
}
