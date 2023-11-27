

import { Card, CardContent, Grid, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { format, formatISO, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSettings } from 'src/@core/hooks/useSettings';
import { useAuthContext } from "src/context/AuthContext";

interface Reportes {
  _id: string;
  fecha: Date;
  ufv: number;
}

const Obtenerufv: React.FC = () => {
  const [ufvData, setUfvData] = useState<Reportes | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currentDate = new Date(); // Obtiene la fecha actual
  const { settings } = useSettings()
  const { mode } = settings

  useEffect(() => {
    fetchData();
  }, []);


  const formatDateToISO = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Añade ceros a la izquierda si es necesario
    const day = date.getDate().toString().padStart(2, '0'); // Añade ceros a la izquierda si es necesario
    return `${year}-${month}-${day}`;
  };

  const currentDateISO = formatDateToISO(currentDate);


  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NTE2ZTI4MWZjMTI3NjNhOTcxZGE1MTUiLCJBcHAiOnsiMCI6eyJ1dWlkIjoiNjc0MTMyOGQtZjkzZi00ZTg2LTg1OGMtNmI2MDk4Zjk1YzQ2IiwibmFtZSI6ImNlbnRyYWwiLCJ1cmwiOiJodHRwOi8vMTAuMTAuMjE0LjIyNTozMDAwL2hvbWUifX0sInJvbGVzIjpbIjY0ZjhmMDg4MWI2NmFlZGE1ZWEzZDYyNyJdLCJwYXNzd29yZCI6IiQyYiQxMCRqNG9QLjY1UkZxV0t2WW93TEw2bTJPV1pPL1ZjRE5vZ2I5ZTJjSGRseXhwcmVXNDdoV3JqUyIsImlhdCI6MTY5NjM2MTkzNSwiZXhwIjoxNjk2MzgzNTM1fQ.9dsW9HcOoWgEv4OlDSlTi427AKM2WaCvIbMsf9EG_ZU'

  const { accessToken:token } = useAuthContext()

  const fetchData = async () => {
    try {
      console.log("fecha", currentDateISO)
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ACTIVOS}get-ufv/find-ufv-current`,
        {
          dateFromUFV: currentDateISO,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(res.data)
      setUfvData(res.data);
    } catch (error) {
      console.error('Error al obtener la UFV:', error);
      setError('Hubo un error al obtener la UFV. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }
  const headerStyle = {

    //color: mode === 'light' ? 'black' : 'white',
    fontSize: '17px',
    fontFamily: 'Roboto, Arial, sans-serif',
    marginLeft: '40px',marginTop: '-17px',
    marginBottom:'40px'

  }
  return (
    <>


    <Typography sx={{

              position: 'absolute',

              top: 73,
              right: 50,
              mb:'17px',
            }} variant="body2"style={headerStyle}
          >UNIDAD DE FOMENTO A LA VIVIENDA
          </Typography>

      <Card
        sx={{
          color: 'common.white',
          backgroundColor: '#D4D5D5',
          position: 'absolute',
          // width:'300px',
          top: 80,
          right: 75,
        }}
      >

        <CardContent sx={{ p: (theme) => `${theme.spacing(2, 11,1)} !important` }}>
        {/* <Typography variant="body2"style={headerStyle}
      >UNIDAD DE FOMENTO A LA VIVIENDA
      </Typography> */}
          <Typography variant="body2"sx={{ color: 'common.black',fontSize:'17px', display: 'inline' }}>
          {format(currentDate, " dd 'de' MMMM, yyyy")} {/* Formatea la fecha */}
          </Typography>
          <div style={{ textAlign: 'center' }}>

            <Typography variant="h5" sx={{ color: 'common.black', display: 'inline' }}>
              {' Bs '}
            </Typography>
            <Typography variant="h5" sx={{ color: 'common.black', display: 'inline' }}>
              {ufvData?.ufv.toFixed(5)}
            </Typography>
          </div>
        </CardContent>
      </Card>

    </>
  );
};

export default Obtenerufv;


