"@use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GetServerSideProps } from 'next/types';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Typography, Button, CircularProgress } from '@mui/material';
import { useAuthContext } from "src/context/AuthContext";


interface TimeLineItem {
  _id: string;
  userEmail:string
  description: string;
  timestamp: string;
}

interface TimeLineProps {
  data: TimeLineItem[];
}

const TimeLine = () => {
  const [itemsToShow, setItemsToShow] = useState(5); // Cambia el número inicial de elementos a mostrar
  const [data, setData] = useState<TimeLineItem[]>(); // Cambia el número inicial de elementos a mostrar
useEffect(()=>{
  getData()
},[])
  const getData = async() => {
    const token = localStorage.getItem('token')

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}bitacora/bitacora-asset`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setData(response.data)

}
const totalItems = data ? data.length : 0;
const handleLoadMore = () => {
    // Aumenta la cantidad de elementos a mostrar en cada carga
    setItemsToShow(itemsToShow + 7); // Puedes ajustar la cantidad a tu preferencia
  };

  return (
    <div>
      <Typography variant="h3" style={{
              textAlign: 'center',
              textTransform: 'uppercase',
              marginBottom: '20px', // Agregar margen inferior
              fontSize:'30px',
              color:'gray', // Agregar un fondo degradado
              WebkitBackgroundClip: 'text', // Hacer que el fondo se aplique al texto
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            }}>
        Linea de tiempo
      </Typography>
      <Timeline position="alternate">
        {data? data.slice(0, itemsToShow).map((item) => (
          <TimelineItem key={item._id}>

           <TimelineSeparator>
        <TimelineDot color="secondary" style={{ backgroundColor: 'gray', width: '15px', height: '15px',boxShadow: '0 0 5px rgba(0, 0, 255, 0.9)', }} /> {/* Personaliza el estilo del punto */}
        <TimelineConnector style={{ backgroundColor: 'gray', width: '2px',boxShadow: '0 0 5px rgba(0, 0, 255, 0.9)', }} /> {/* Personaliza el estilo de la línea */}
      </TimelineSeparator>
            <TimelineContent>
              <Typography style={{ padding: '7px', borderRadius: '10px', marginBottom: '8px' }}>
                {item.timestamp}
              </Typography>
              <Typography
                style={{
                  backgroundColor: '#777DF2',
                  padding: '10px',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '15px',
                }}
              >
               {item.userEmail}{' '} {item.description}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        )):null}
      </Timeline>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {itemsToShow < totalItems && (
        <CircularProgress onClick={handleLoadMore} />
      )}
    </div>

    </div>
  );
}

export default TimeLine;
