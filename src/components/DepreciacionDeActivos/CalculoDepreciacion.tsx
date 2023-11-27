import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios' // Importa Axios
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import toast from 'react-hot-toast'

interface reports {
  nameAsset?: string
  dateAcquisition?: string
  ufvInitial?: number
  ufvFinal?: number
  depreciatedValue?: number
}
interface State {
  dateInitial: string
  dateCurrent: string
}

const defaultValues: State = {
  dateInitial: '2023-08-10',
  dateCurrent: '2023-08-10'
}

const schema = yup.object().shape({
  dateInitial: yup.string().required(),
  dateCurrent: yup.string().required()
})

const FormLayoutsBasic = () => {
  const [filter, setFilter] = useState<reports[]>([])
  const [values, setValues] = useState<State>(defaultValues)
  const [dateInitial, setDateInitial] = useState<string>('')
  const [dateCurrent, setDateCurrent] = useState<string>('')

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
    setFilter([])
  }, [])

  const handleChange = (name: keyof State) => (value: string) => {
    setValues(prevValues => ({ ...prevValues, [name]: value }))
    console.log(values)
  }

  const handleFilterAndPost = async (data: State) => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NTE2ZTI4MWZjMTI3NjNhOTcxZGE1MTUiLCJBcHAiOnsiMCI6eyJ1dWlkIjoiNjc0MTMyOGQtZjkzZi00ZTg2LTg1OGMtNmI2MDk4Zjk1YzQ2IiwibmFtZSI6ImNlbnRyYWwiLCJ1cmwiOiJodHRwOi8vMTAuMTAuMjE0LjIyNTozMDAwL2hvbWUifX0sInJvbGVzIjpbIjY0ZjhmMDg4MWI2NmFlZGE1ZWEzZDYyNyJdLCJwYXNzd29yZCI6IiQyYiQxMCRqNG9QLjY1UkZxV0t2WW93TEw2bTJPV1pPL1ZjRE5vZ2I5ZTJjSGRseXhwcmVXNDdoV3JqUyIsImlhdCI6MTY5NjM2MTkzNSwiZXhwIjoxNjk2MzgzNTM1fQ.9dsW9HcOoWgEv4OlDSlTi427AKM2WaCvIbMsf9EG_ZU'
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }

    try {
      // Hacer la solicitud POST usando Axios
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}reports`, {
        dateInitial: values.dateInitial.toString(),
        dateCurrent: values.dateCurrent.toString()
      })

      if (response.data != null) setFilter(response.data)
      else setFilter([])

    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        toast.error(error.response.data.message)
        setTimeout(() => {
          toast.dismiss()
        }, 5000)
      } else {
        toast.error('Ocurrio un error al procesar la solicitud.')
      }
    }
  }

  return (
    <>
      <Card>
        <CardHeader title=' ' />
        <CardContent>
          <form onSubmit={handleSubmit(handleFilterAndPost)}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={3}>
                <Typography variant='body2' gutterBottom>
                  Fecha Inicial
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
                <Typography variant='body2' gutterBottom>
                  Fecha Actual
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
                  <Button type='submit' variant='contained' size='large'>
                    Obtener UFV
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      {filter != null ? (
        <>
          <TableContainer component={Paper} style={{ marginTop: '10px' }}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow sx={{ '& .MuiTableCell-root': { py: theme => `${theme.spacing(2.5)} !important` } }}>
                  <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                    N
                  </TableCell>
                  <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                    NOMBRE DEL ACTIVOS
                  </TableCell>
                  <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                    FECHA DE ADQUISICION
                  </TableCell>
                  <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                    UFV INICIAL
                  </TableCell>

                  <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                    DEPRECIACION
                  </TableCell>
                </TableRow>
              </TableHead>
              {filter.map((filter, index: number) => (
                <TableBody key={index}>
                  <TableRow sx={{ '& .MuiTableCell-root': { py: theme => `${theme.spacing(2.5)} !important` } }}>
                    <TableCell
                      style={{ width: '50px', fontFamily: 'Arial, Helvetica, sans-serif' }}
                      sx={{ textAlign: 'center' }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      style={{ width: '60px', fontFamily: 'Arial, Helvetica, sans-serif' }}
                      sx={{ textAlign: 'center' }}
                    >
                      {filter.nameAsset}
                    </TableCell>
                    <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                      {filter.dateAcquisition && new Date(filter.dateAcquisition).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                      {filter.ufvInitial}
                    </TableCell>

                    <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                      {filter.ufvFinal}
                    </TableCell>
                    <TableCell style={{ width: '50px' }} sx={{ textAlign: 'center' }}>
                      {filter.depreciatedValue}
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>
          </TableContainer>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
export default FormLayoutsBasic
