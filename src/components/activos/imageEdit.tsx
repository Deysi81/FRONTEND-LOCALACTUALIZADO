import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from "src/context/AuthContext";



interface File{
  mime:string
  base64:string
}


const GetImages:React.FC<{id:string}> = ({ id }) => {
  // const[image,setImage]=useState<string>("")
  const { accessToken:token } = useAuthContext()
  const [image, setImage] = useState<string>('/ruta-de-la-imagen-de-marcador-de-posicion.jpg');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id !== null) {
      setIsLoading(true);
      get();
    }
  }, [id]);

  const get = async () => {
    try {
      const response = await axios.post<File>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset/get-asset-imagen/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.base64 !== undefined) {
        setImage(response.data.base64);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };


  const convertBase64ToImageUrl = (base64String: string) => {
    return `data:image/png;base64,${base64String}`
  }


  return (
    <div>
      {isLoading ? (
        // Muestra un indicador de carga o una imagen de marcador de posición mientras se carga la imagen
        <div>Cargando...</div>
      ) : (
        // Muestra la imagen real después de que se haya cargado
        <img
          src={convertBase64ToImageUrl(image)}
          alt='Imagen actual del activo'
          width={300}
          height={300}
          style={{ maxWidth: '100%', maxHeight: '100%'}}
        />
      )}
    </div>
  );
      }

export default GetImages;
