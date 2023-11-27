import React, { useState, useEffect, CSSProperties } from 'react'
import axios from 'axios'
import {
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  Table,
  TableHead,
  Paper,
  CircularProgress,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
  Grid,
  Box,
  Button,
  TextField,
  Typography
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useSettings } from 'src/@core/hooks/useSettings'
import * as yup from 'yup'
// import CalculoDepreciacion from 'src/components/DepreciacionDeActivos/CalculoDepreciacion'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Obtenerufv from 'src/components/DepreciacionDeActivos/Obtenerufv'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-hot-toast'
import { useAuthContext } from "src/context/AuthContext";


interface Reportes {
  _id: string
  nameAsset: string
  dateAcquisition: Date
  ufvInitial: number
  ufvFinal: number
  depreciatedValue: number
  price: number
  difference:number
  depreciation?: number
}
// interface reports {
//   nameAsset?: string
//   dateAcquisition?: string
//   ufvInitial?: number
//   ufvFinal?: number
//   depreciation?: number
// }
interface State {
  dateInitial: string
  dateCurrent: string
}

const defaultValues: State = {
  dateInitial: '',
  dateCurrent: ''
}
const schema = yup.object().shape({
  dateInitial: yup.string().required(),
  dateCurrent: yup.string().required()
})
const AssetList: React.FC = () => {
  const [assets, setAssets] = useState<Reportes[]>([])
  const [values, setValues] = useState<State>(defaultValues)

  const { settings } = useSettings()
  const { mode } = settings
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<State>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    fetchData()
  }, [])
  console.log(assets)

  const handleChange = (name: keyof State) => (value: string) => {
    setValues(prevValues => ({ ...prevValues, [name]: value }))
  }

  const { accessToken:token } = useAuthContext()
  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      setAssets(res.data)
    } catch (error: any) {
      console.log(error)
    }
  }

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9'
    }
  }))
  //estilo para dia y noche


  // const handleFilterAndPost = async ( //data: State
  //   ) => {

  //   try {
  //     // Hacer la solicitud POST usando Axios
  //     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}reports`, {
  //       dateInitial: values.dateInitial.toString(),
  //       dateCurrent: values.dateCurrent.toString()
  //     })
  //     setAssets(response.data)
  //   } catch (error: any) {
  //     console.log(error)
  //     if (error.response && error.response.status === 404) {
  //       toast.error(error.response.data.message)
  //       setTimeout(() => {
  //         toast.dismiss()
  //       }, 5000)
  //     } else {
  //       toast.error('Ocurrió un error al procesar la solicitud.')
  //     }
  //   }
  // }
  const handleFilterAndPost = async () => {
    try {
      // Define los encabezados personalizados
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Define los datos que se enviarán en el cuerpo de la solicitud
      const requestData = {
        dateInitial: values.dateInitial.toString(),
        dateCurrent: values.dateCurrent.toString()
      };

      // Realiza la solicitud POST utilizando Axios con los encabezados personalizados
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}reports`, requestData, {
        headers: headers
      });

      setAssets(response.data);
    } catch (error:any) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        toast.error(error.response.data.message);
        setTimeout(() => {
          toast.dismiss();
        }, 5000);
      } else {
        toast.error('Ocurrió un error al procesar la solicitud.');
      }
    }
  };


  const headerStyle = {
    backgroundColor: mode === 'light' ? '#8c90f0' : '#5a5c75',
    color: mode === 'light' ? 'black' : 'white',

    fontFamily: 'Roboto, Arial, sans-serif'
  }

  const bodystyle: CSSProperties = {
    width: '50px',
    textAlign: 'center',
    // color: mode === 'light' ? 'black' : 'white',
    fontFamily: 'Roboto, Arial, sans-serif',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'

  }

  const headeresti: CSSProperties = {
    fontSize: '13.9px',

    color:'white',
    textAlign: 'center',
    fontFamily: 'Roboto, Arial, sans-serif',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0)', borderRight: '1px solid rgba(224, 224, 224, 1)'
  }
  return (
    <>
{/* <Grid item xs={12} sm={3}>
<Obtenerufv />
<br /> <br /><br />
</Grid> */}
<Grid container spacing={2} >
  <Grid item xs={1} sm={10} >
    <Obtenerufv />
<br /><br />
  </Grid>
  <Grid item xs={12} sm={3}>
            <Typography variant='body2' gutterBottom
            style={{ textAlign: 'center',
            //color: mode === 'light' ? 'black' : 'white'
          } }
            >
              FECHA INICIAL
            </Typography>
            <Controller
              name='dateInitial'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type='date' // Cambiar a 'date'
                  fullWidth
                  value={values.dateInitial}
                  onChange={e => handleChange('dateInitial')(e.target.value)}
                  autoComplete='off'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
          <Typography variant='body2' gutterBottom style={{ textAlign: 'center',
          //color: mode === 'light' ? 'black' : 'white'
           } }>
              FECHA ACTUAL
            </Typography>
            <Controller
              name='dateCurrent'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type='date' // Cambiar a 'date'
                  value={values.dateCurrent}
                  fullWidth
                  onChange={e => handleChange('dateCurrent')(e.target.value)}
                  autoComplete='off'
                />
              )}
            />
          </Grid>


<Grid container spacing={3}></Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                gap: 5,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6} sm={5} md={3.1}>
                  <Button onClick={()=>handleFilterAndPost()} sx={{ mb: 2 ,width:'201px'}}
                   variant='contained'>
                    Calcular UFV
                  </Button>
                </Grid>
                <Grid item xs={6} sm={5} md={3.1}>
                  <Button onClick={()=>fetchData()} sx={{ mb: 2 ,width:'201px'}}
                   variant='contained'>
                    Restaurar valores
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          </Grid>

      <DatePickerWrapper>

      </DatePickerWrapper>
      <TableContainer component={Paper} style={{ marginTop: '10px' }}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead style={headerStyle}>
            <TableRow sx={{ '& .MuiTableCell-root': { py: theme => `${theme.spacing(2.5)} !important` } }}>
              <TableCell style={headeresti}  sx={{width:'8.5rem'}}>
                NOMBRE DEL ACTIVO
              </TableCell>
              <TableCell style={headeresti} sx={{width:'8.5rem'}}>
                FECHA DE ADQUISICIÓN
              </TableCell>
              <TableCell style={headeresti}>
                UFV INICIAL
              </TableCell>
              <TableCell style={headeresti}>
                UFV FINAL
              </TableCell>
              <TableCell style={headeresti}>
                DEPRECIACIÓN
              </TableCell>
              <TableCell style={headeresti}>
                PRECIO
              </TableCell>
              <TableCell style={headeresti}>
                DIFERENCIA
              </TableCell>

            </TableRow>
          </TableHead>
          {Array.isArray(assets) && assets.length > 0 ? (
            assets.map(asset => (
              <TableBody key={asset._id}>
                <TableRow sx={{ '& .MuiTableCell-root': { py: theme => `${theme.spacing(2.5)} !important` } }}>
                  <TableCell
                    style={bodystyle}
                    //style={{ width: '50px', fontFamily: 'Arial, Helvetica, sans-serif', textAlign: 'center', color: mode === 'light' ? 'black' : 'white' }}
                    sx={{ textAlign: 'center' }}
                  >
                    {asset.nameAsset}
                  </TableCell>
                  <TableCell style={bodystyle} >
                    {asset.dateAcquisition && new Date(asset.dateAcquisition).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell style={bodystyle} >
                    {asset.ufvInitial}
                  </TableCell>

                  <TableCell style={bodystyle} >
                    {asset.ufvFinal}
                  </TableCell>
                  <TableCell style={bodystyle} >
                    {asset.depreciatedValue ? asset.depreciatedValue : asset.depreciation}
                  </TableCell>
                  <TableCell style={bodystyle} >
                    {asset.price} Bs
                  </TableCell>
                  <TableCell style={bodystyle} >
                    {asset.difference}
                  </TableCell>
                </TableRow>
              </TableBody>
            ))
            ):(
              <TableBody>
              <TableRow>
                <TableCell colSpan={12} align="center">
                  <CircularProgress /> {/* Loading spinner */}
                </TableCell>
              </TableRow>
            </TableBody>
            )
            }
        </Table>
      </TableContainer>
    </>
  )
}

export default AssetList
