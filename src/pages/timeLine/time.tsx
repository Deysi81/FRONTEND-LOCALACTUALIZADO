import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { GetServerSideProps } from 'next/types';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Typography, CircularProgress } from '@mui/material';

interface TimeLineItem {
  _id: string;
  description: string;
  timestamp: string;
}

interface TimeLineProps {
  data: TimeLineItem[];
}

function TimeLine({ data }: TimeLineProps) {
  const [itemsToShow, setItemsToShow] = useState(5);
  const totalItems = data.length;

  const handleLoadMore = () => {
    setItemsToShow(itemsToShow + 5);
  };

  const listContainerRef = useRef<HTMLDivElement | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null); // Ref para el último elemento de la lista

  useEffect(() => {
    const container = listContainerRef.current;
    const lastItem = lastItemRef.current;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // El último elemento es visible, carga más elementos automáticamente
        handleLoadMore();
      }
    });

    if (lastItem) {
      observer.observe(lastItem);
    }

    return () => {
      if (lastItem) {
        observer.unobserve(lastItem);
      }
    };
  }, [lastItemRef]);

  return (
    <div>
      <Typography
        variant="h3"
        style={{
          textAlign: 'center',
          textTransform: 'uppercase',
          marginBottom: '20px',
          color: '#777DF2',
          WebkitBackgroundClip: 'text',
        }}
      >
        Linea de tiempo
      </Typography>
      <div ref={listContainerRef} style={{ overflowY: 'auto', height: '400px' }}>
        <Timeline position="alternate">
          {data.slice(0, itemsToShow).map((item, index) => (
            <TimelineItem key={item._id} ref={index === data.length - 1 ? lastItemRef : null}>
              <TimelineSeparator>
                <TimelineDot color="secondary" />
                <TimelineConnector />
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
                  {item.description}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
      {itemsToShow < totalItems && <CircularProgress />}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<TimeLineProps> = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}bitacora`, {
      headers: {
        accept: '*/*',
      },
    });

    const data: TimeLineItem[] = response.data;

    return {
      props: {
        data,
      },
    };
  } catch (error:any) {
    console.error('Error fetching data:', error.message);
    return {
      props: {
        data: [],
      },
    };
  }
};

export default TimeLine;
