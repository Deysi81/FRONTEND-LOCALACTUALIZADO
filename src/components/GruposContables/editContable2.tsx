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
import React from 'react'

import toast from 'react-hot-toast'
import { useAsset } from 'src/context/GruposContabContext'

interface SidebarEditAssetProps {
  ContableId:string;
  open: boolean;
  toggle: () => void;
}

interface UserData {
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
  assetCategory: '',
  usefulLife: 0,
  subCategory: {
    subCategory:'',
  }
}

const SidebarEditContable2: React.FC<SidebarEditAssetProps> = (props) => {

  const { getAsset, updateAsset } = useAsset()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { toggle } = props
  const ContableId = props.ContableId
  const [asset, setAsset] = useState<UserData>({
  assetCategory: '',
  usefulLife: 0,
  subCategory: {
    subCategory:'',
  }

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
    useEffect(() => {
      getData()
    }, [])
    const getData = async () => {
      try {
        const res = await getAsset(ContableId)
        console.log(res)
        setAsset({
          ...asset,
          assetCategory: res.assetCategory,
          usefulLife: res.usefulLife,
          subCategory: {
            subCategory: res.subCategory.subCategory

          },

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

      if (name.startsWith('subCategory.')) {
        const infoCountableField = name.split('.')[1];
        setAsset((prevAsset) => ({
          ...prevAsset,
          subCategory: {
            ...prevAsset.subCategory,
            [infoCountableField]: value,
          },
        }));
      } else {
        setAsset((prevAsset) => ({ ...prevAsset, [name]: value }));
      }
    };

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      try {
        const assetIds = [...new Set([props.ContableId])].flat();
        const subCategory = parseFloat(asset.subCategory.subCategory.toString()); // el precio lleva en string convertir a numeric
       const newData = {
          assetIds,
          assetCategory: asset.assetCategory,
          usefulLife: asset.usefulLife,
          subCategory:{
            subCategory: subCategory,
          }
        }
        await updateAsset(ContableId,newData);
        toggleDrawer();
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
            <Button
          variant="outlined" size="small" style={{  color:  '#94bb68', borderRadius: '10px',marginRight:'2px' ,marginBottom:'-8px'}}
            onClick={toggleDrawer}
          >
          <Icon icon='mdi:pencil-outline' fontSize={20} />
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
            <Header>
          <Typography variant='h6' style={{textTransform: 'uppercase'}}>Editar Grupo Contable</Typography>
          <IconButton size='small' onClick={toggleDrawer} sx={{ color: 'text.primary' }}>
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
                      helperText={errors.assetCategory?.message}
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
                      helperText={errors.usefulLife?.message}
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

export default SidebarEditContable2
