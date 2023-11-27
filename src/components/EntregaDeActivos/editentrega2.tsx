//** React Imports
import { ChangeEvent, FormEvent, Fragment, ReactNode, useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'

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

import axios from 'axios'
import {
  Select,
  SelectChangeEvent,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Grid
} from '@mui/material'
import React from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import StepperWrapper from 'src/@core/styles/mui/stepper'
import StepperCustomDot from 'src/views/forms/form-wizard/StepperCustomDot'
import { useAsset } from 'src/context/AssetContext'

interface SidebarEditAssetProps {
  providerId: string;
  selectedEdit: string[];
  open: boolean;
  toggle: () => void;
}


interface InformationCountable {
  price: number
  dateAcquisition: Date
  warrantyExpirationDate: Date
  // lote: number
}

interface UserData {
  _id: string
  name: string
  description: string
  // responsible: string
  supplier: string
  state: string,
  file: string
  typeCategoryAsset: string
  informationCountable: InformationCountable
  location: string

}
interface assetCategory {
  _id: string
  assetCategory: string
}
// interface asstResponsible {
//   _id: string,
//   fullName: string,
//   email: string
// }
interface assetSupplier {
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
interface assetLocation {
  _id: string,
  Name: string
}

interface state {
  _id: string,
  name: string,
  isDeleted: boolean

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
  // responsible: yup.string().required(),
  supplier: yup.string().required(),
  location: yup.string().required(),
  typeCategoryAsset: yup.string().required(),
  dateAcquisition: yup.string().required(),
  warrantyExpirationDate: yup.string().required(),
  name: yup
    .string()
    .min(3, obj => showErrors('Nombre', obj.value.length, obj.min))
    .matches(/^[A-Za-z ]*$/, 'El nombre solo puede contener letras')
    .required(),
  price: yup.number().moreThan(0, 'El valor debe ser mayor que cero').required()
})


const defaultValues = {
  _id: '',
  name: '',
  description: '',
  // responsible: '',
  supplier: '',
  state: '',
  informationCountable: {
    price: 0,
    dateAcquisition: new Date('2023-08-08'),
    warrantyExpirationDate: new Date('2023-08-08'),
    lote: 0
  },
  location: '',
  file: '',
  typeCategoryAsset: ''
}

const steps = [
  {
    title: 'Informacion General'
  },
  {
    title: 'Informacion Contable'
  },
  {
    title: 'Ubicacion'
  }
]



//const SidebarEditAsset: React.FC<SidebarEditAssetProps> = (props) => {

const SidebarEditAsset: React.FC<SidebarEditAssetProps> = (props) => {

  const { getAsset, updateAsset } = useAsset()

  const [state, setState] = useState<boolean>(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  const { open, toggle } = props
  const [previewfile, setPreviewfile] = useState<string | null>(null)
  const [groupContable, setGroupContable] = useState<assetCategory[]>([])
  // const [groupResponsible, setGroupResponsible] = useState<asstResponsible[]>([])
  const [groupSupplier, setGroupSupplier] = useState<assetSupplier[]>([])
  const [groupState, setGroupState] = useState<state[]>([])
  const [groupLocation, setGroupLocation] = useState<assetLocation[]>([])

  const [activeStep, setActiveStep] = useState<number>(0)

 const providerId = props.providerId
  const [asset, setAsset] = useState<UserData>({
    _id: '',
    name: '',
    description: '',
    // responsible: '',
    supplier: '',
    state: '',
    file: '',
    typeCategoryAsset: '',
    informationCountable: {
      price: 0,
      dateAcquisition: new Date('2023-08-08'),
      warrantyExpirationDate: new Date('2023-08-08'),
      // lote: 0
    },
    location: ''
  })

  // ** Hooks
  const {
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange'
  })

  const handleClose = () => {
    toggle()
    reset()
  }

  const getData = async () => {
    try {
      // const response = await axios.get<UserData>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset/${providerId}`)
      const res = await getAsset(providerId)
      // const responseData = response.data;
      console.log(res)
      setAsset({
        ...asset,
        _id: res._id,
        name: res.name,
        description: res.description,
        supplier: res.supplier._id,
        file: res.file,
        typeCategoryAsset: res.typeCategoryAsset.assetCategory,
        state:res.state._id,
        informationCountable: {
          price: res.informationCountable.price,
          dateAcquisition: res.informationCountable.dateAcquisition,
          warrantyExpirationDate: res.informationCountable.warrantyExpirationDate
        },
        location: res.location._id
      });
    } catch (error) {
      alert(error);
    }
  }


  useEffect(() => {
    getData()
    getAssets()
    getState()
    getsupplier()
    getLocation()
  }, [])
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('informationCountable.')) {
      const infoCountableField = name.split('.')[1];
      setAsset((prevAsset) => ({
        ...prevAsset,
        informationCountable: {
          ...prevAsset.informationCountable,
          [infoCountableField]: value,
        },
      }));
    } else if (name.startsWith('location')) {
      setAsset((prevAsset) => ({
        ...prevAsset,
        location: value,
      }));
    } else {
      setAsset((prevAsset) => ({ ...prevAsset, [name]: value }));
    }
  };
  //VIZUALIZAR IMAGENES
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

  const handleSubmit = async () => {
    try {

      const assetIds = [...new Set([props.providerId, ...props.selectedEdit])].flat();


      const dateAdquisition = asset.informationCountable.dateAcquisition.toString().slice(0,10)
      const dateExpiration = asset.informationCountable.warrantyExpirationDate.toString().slice(0,10)
      const numericPrice = parseFloat(asset.informationCountable.price.toString()); // el precio lleva en string convertir a numeric
      const newData = {
        assetIds,
        name: asset.name,
        description: asset.description,
        // responsible: asset.responsible,
        supplier: asset.supplier,
        state:asset.state,
        file: asset.file,
        typeCategoryAsset: asset.typeCategoryAsset,
        informationCountable:{
          price: numericPrice,
          dateAcquisition: dateAdquisition,
          warrantyExpirationDate: dateExpiration,
        },
        location: asset.location,

      }
      updateAsset(newData)
      toggleDrawer();

    } catch (error) {
      console.error(error)
    }
  }

  function handleCategoryChange(event: SelectChangeEvent<string>, child: ReactNode): void {
    console.log(event.target.value as string)
    setAsset({ ...asset, typeCategoryAsset: event.target.value as string})
  }
  function handleSupplierChange(event: SelectChangeEvent<string>, child: ReactNode): void {
    setAsset({ ...asset, supplier: event.target.value as string })
  }
  function handleLocationChange(event: SelectChangeEvent<string>, child: ReactNode): void {
    console.log(event.target.value as string)
    setAsset({ ...asset, location: event.target.value as string })
  }
  function handleStateChange(event: SelectChangeEvent<string>, child: ReactNode): void {
    console.log('state', event.target.value as string)
    setAsset({ ...asset, state: event.target.value as string })
  }

  const convertBase64ToImageUrl = (base64String: string) => {
    return `data:image/png;base64,${base64String}`
  }

  const getAssets = async () => {
    try {
      const response = await axios.get<assetCategory[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list`)
      setGroupContable(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const getsupplier = async () => {
    try {
      const response = await axios.get<assetSupplier[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier`)
      setGroupSupplier(response.data)
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

  const getLocation = async () => {
    try {
      //const response = await axios.get<assetLocation[]>('http://localhost:3000/api/departments/departments')
      const response = await axios.get<assetLocation[]>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}organigrama`)
      setGroupLocation(response.data)

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


  const getStepContent = (step: number) => {
    switch (step) {

      case 0:
        return (

          <Fragment>
            <Grid item xs={8} sm={7} lg={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Controller
                name='file'
                control={control}
                render={({ field }) => (
                  <div style={{ textAlign: 'center', marginTop: '16px'  }}>
                    <img
                      src={convertBase64ToImageUrl(asset.file)}
                      alt='Imagen actual del activo'
                      width={300}
                      height={300}
                      style={{ maxWidth: '100%', maxHeight: '200px'}}
                    />
                  </div>
                )}
              />
            </Grid>


            <Grid item xs={12} sm={20}>
            <Button
                variant="contained"
                fullWidth
                color="primary"// Cambiado a "outlined"
                size="large"
                startIcon={<CloudUploadIcon style={{fontSize: '40px'}}/>}
                component="label"
                style={{height: '80px'}}
              >
               <Typography style={{ color: 'white' }}>Seleccionar Imagen</Typography>
                <input
                  id='file'
                  type="file"
                  accept="image/*"
                  name="file"
                  onChange={handlefileChange}
                  style={{ display: 'none' }}
                />
              </Button>
              {previewfile && (
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <img
                    src={previewfile}
                    alt='Preview' style={{ maxWidth: '100%', maxHeight: '300px' }}
                  />
                </div>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: 6 }}>
            <Typography variant='body2' gutterBottom>
                Nombre
              </Typography>
               <Controller
                 name='name'
                 control={control}
                 render={({ field }) => (
                   <TextField
                     {...field}
                     fullWidth
                     value={asset.name}

                     error={Boolean(errors.name)}
                     helperText={errors.name?.message}
                     onChange={handleChange}
                     autoComplete='off'
                   />
                 )}
               />
             </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 6 }}>
              <Typography variant='body2' gutterBottom>
                Proveedor
              </Typography>
                <Select
                  id='supplier'
                  value={asset.supplier}
                  onChange={handleSupplierChange as (event: SelectChangeEvent<string>, child: React.ReactNode) => void}
                  autoComplete='off'
                >
                  {groupSupplier?.map(supplier => (
                    <MenuItem key={supplier._id} value={supplier._id}>
                      {supplier.managerName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth sx={{ mb: 6 }}>
              <Typography variant='body2' gutterBottom>
                Descripcion
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
            </Grid>
            <Grid item xs={12} sm={12}>
            <FormControl fullWidth sx={{ mb: 6}}>
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
              </FormControl>
            </Grid>
          </Fragment>
        )
      case 1:
        return (
          <Fragment key={step} >
            <Grid item xs={8} sm={7} lg={6}>
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

                    error={Boolean(errors.informationCountable?.price)}
                    helperText={errors.informationCountable?.price?.message}
                    onChange={handleChange}
                    autoComplete='off'
                  />
                )}
              />
            </Grid>
            <Grid item xs={8} sm={7} lg={6}>
            <FormControl fullWidth sx={{ mb: 6 }}>
            <Typography variant='body2' gutterBottom>
                Estado
              </Typography>
               <Select

                 id='state'
                 value={asset.state}
                 onChange={handleStateChange as (event: SelectChangeEvent<string>, child: React.ReactNode) => void}
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



            <Grid item xs={8} sm={7} lg={6}>
              <Typography variant='body2' gutterBottom>
                Fecha de Adquisicion
              </Typography>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='informationCountable.dateAcquisition'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type='datetime-local'
                      value={new Date(asset.informationCountable.dateAcquisition).toISOString().slice(0, 16)}
                      placeholder=' '
                      error={Boolean(errors.informationCountable?.dateAcquisition)}
                      helperText={errors.informationCountable?.dateAcquisition?.message}
                      onChange={handleChange}
                      autoComplete='off'
                    />
                  )}
                />
              </FormControl>
            </Grid>




            <Grid item xs={8} sm={7} lg={6}>
              <Typography variant='body2' gutterBottom>
              Fecha de expiración de la garantía
              </Typography>
              <FormControl fullWidth sx={{ mb: 6 }}>
               <Controller
                 name='informationCountable.warrantyExpirationDate'
                 control={control}
                 render={({ field }) => (
                   <TextField
                     {...field}
                     type='datetime-local'
                    value={new Date(asset.informationCountable.warrantyExpirationDate).toISOString().slice(0, 16)}
                     placeholder=' '

                     helperText={errors.informationCountable?.warrantyExpirationDate?.message}
                     onChange={handleChange}
                     autoComplete='off'
                  />
                 )}
               />
             </FormControl>
            </Grid>

          </Fragment>
        )
      case 2:
        return (
          <Fragment key={step}>
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

              <Button onClick={(e)=> handleNext() } size='large' variant='contained'>
                Siguiente
              </Button>

              <Button onClick={(e) => { handleSubmit() }} size='large' variant='contained'>
              Guardar
              </Button>

            </Grid>
          </Grid>
        </form>
      )
    }
  }
  return (
    <>
        <Button

          variant="outlined" size="small"
           style={{ color: '#94bb68', borderRadius: '10px',marginRight:'2px',marginTop: '-4px',width: '1px',marginBottom:'10px' }}
            onClick={toggleDrawer}
        >
          <Icon icon='mdi:pencil-outline' fontSize={19} />
        </Button>
     <Drawer
        anchor="right"
        variant='temporary'
        open={isDrawerOpen}
        //onClose={handleClose}
         onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 500, md: 800, lg: 800 } } }}
      >
      <div style={{ height: '100%', width:'100%', overflowY: 'scroll' }}>
        <Header>
          <Typography variant='h6' style={{textTransform: 'uppercase'}}>Editar Activo</Typography>
          <IconButton size='small' onClick={toggleDrawer} sx={{ color: 'text.primary' }}>
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

    </>
      )
}

export default SidebarEditAsset
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

