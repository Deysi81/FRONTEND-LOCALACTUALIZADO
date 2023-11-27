import { Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Define una interfaz para la estructura de datos esperada
interface DataObject {
  entrego: string;
  recibio: string;
  ubicacion: string;
  // Agrega otras propiedades si es necesario
}

const Obtenerinformacion: React.FC = () => {
  const [savedData, setSavedData] = useState<DataObject | null>(null); // Estado para almacenar la información guardada
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    QrData();
  }, []);

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NGYyMzY4Y2ZiNjAwNjZiNjlhOTBiOWUiLCJBcHAiOnsiMCI6eyJ1dWlkIjoiNjc0MTMyOGQtZjkzZi00ZTg2LTg1OGMtNmI2MDk4Zjk1YzQ2IiwibmFtZSI6ImNlbnRyYWwiLCJ1cmwiOiJodHRwOi8vMTkyLjE2OC4yMzQuMTg6MzAwNS9ob21lIn19LCJyb2xlcyI6WyI2NGY4ZjA4ODFiNjZhZWRhNWVhM3Q2MjUiXSwiaWF0IjoxNjk0MjAwOTkzLCJleHAiOjE2OTQyMjI1OTN9.VQiKx7a-n6BfSUmXnlgUt-ituC8WvCtlUj07mA0lvzc';

  const QrData = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/get-data-qr`,
        savedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(res.data);
      setSavedData(res.data);
    } catch (error) {
      console.error('Error al obtener la información del QR:', error);
      setError('Error al obtener la información del QR');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  const headerStyle = {
    fontFamily: 'Roboto, Arial, sans-serif'
  };

  return (
    <>
      <Card
        sx={{
          color: 'common.white',
          backgroundColor: '#D4D5D5',
          position: 'absolute',
          top: 100,
          right: 50
        }}
      >
        {savedData ? (
          <CardContent sx={{ p: (theme) => `${theme.spacing(4, 11, 5)} !important` }}>
            <div>
              <Typography variant="h5" sx={{ color: 'common.black', display: 'inline' }}>
                {'Informacion de Qr '}
              </Typography>
              <Typography variant="h5" sx={{ color: 'common.black', display: 'inline' }}>
                {savedData?.entrego}
              </Typography>
              <Typography variant="h5" sx={{ color: 'common.black', display: 'inline' }}>
                {savedData?.recibio}
              </Typography>
              <Typography variant="h5" sx={{ color: 'common.black', display: 'inline' }}>
                {savedData?.ubicacion}
              </Typography>
            </div>
          </CardContent>
        ) : (
          <div>Cargando datos...</div>
        )}
      </Card>
    </>
  );
};

export default Obtenerinformacion;


//import { Card, CardContent, Typography } from '@mui/material';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { format, formatISO, parseISO } from 'date-fns';
// import { es } from 'date-fns/locale';
// import { useSettings } from 'src/@core/hooks/useSettings';

// interface datosQr{
//   entrego: string
//   recibio: string
//   ubicacion: string

// }
// const Obtenerinformacion: React.FC = () => {
//   const [savedData, setSavedData] = useState<datosQr | null>(null); // Estado para almacenar la información guardada
//   const [error, setError] = useState<string | null>(null);
//   const { settings } = useSettings()
//   const { mode } = settings

//   useEffect(() => {
//     QrData();
//   }, []);




//   const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NGYyMzY4Y2ZiNjAwNjZiNjlhOTBiOWUiLCJBcHAiOnsiMCI6eyJ1dWlkIjoiNjc0MTMyOGQtZjkzZi00ZTg2LTg1OGMtNmI2MDk4Zjk1YzQ2IiwibmFtZSI6ImNlbnRyYWwiLCJ1cmwiOiJodHRwOi8vMTkyLjE2OC4yMzQuMTg6MzAwNS9ob21lIn19LCJyb2xlcyI6WyI2NGY4ZjA4ODFiNjZhZWRhNWVhM2Q2MjUiXSwiaWF0IjoxNjk0MjAwOTkzLCJleHAiOjE2OTQyMjI1OTN9.VQiKx7a-n6BfSUmXnlgUt-ituC8WvCtlUj07mA0lvzc'

//   const QrData = async () => {
//     try {
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/get-data-qr`,
//         savedData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       console.log(res.data);
//       setSavedData(res.data);

//       // Establecer showInfo en true para mostrar los datos en la pantalla

//     } catch (error) {
//       console.error('Error al obtener la información del QR:', error);
//     }
//   };


//   if (error) {
//     return <div>{error}</div>;
//   }
//   const headerStyle = {

//     //color: mode === 'light' ? 'black' : 'white',

//     fontFamily: 'Roboto, Arial, sans-serif'
//   }
//   return (
//     <>
//       <Typography variant="body2"sx={{ //color: 'black',
//       fontSize:'17px',marginLeft: '1060px',marginTop: '-102px' }} style={headerStyle}
//       >UNIDAD DE FOMENTO A LA VIVIENDA
//       </Typography>
//       <Card
//         sx={{
//           color: 'common.white',
//           backgroundColor: '#D4D5D5',
//           position: 'absolute',
//           top: 100,
//           right: 50,
//         }}
//       >
//         {savedData ? (
//   <CardContent sx={{ p: (theme) => `${theme.spacing(4, 11, 5)} !important` }}>
//     <div>
//       <Typography variant="h5" sx={{ color: 'common.black', display: 'inline' }}>
//         {'Informacion de Qr '}
//       </Typography>
//       <Typography variant="h5" sx={{ color: 'common.black', display: 'inline' }}>
//         {savedData?.entrego}
//       </Typography>
//       <Typography variant="h5" sx={{ color: 'common.black', display: 'inline' }}>
//         {savedData?.recibio}
//       </Typography>
//       <Typography variant="h5" sx={{ color: 'common.black', display: 'inline' }}>
//         {savedData?.ubicacion}
//       </Typography>
//     </div>
//   </CardContent>
// ) : (
//   <div>Cargando datos...</div>
// )}

//       </Card>
//     </>
//   );
// };

// export default Obtenerinformacion;

