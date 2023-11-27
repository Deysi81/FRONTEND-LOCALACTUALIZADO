import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface File{
  mime:string
  base64:string
}


const GetImage:React.FC<{id:string}> = ({ id }) => {
  const[image,setImage]=useState<string>("")



  useEffect(() => {
    if(id!=null)get()
  }, []);
  const  get =async()=>{
      try {
        console.log(id)
        const response =await axios.post<File>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset/get-asset-imagen/${id}`);
        if(response.data.base64!=undefined){
         // console.log(response.data.base64)
          setImage(response.data.base64)
        }
      }catch(error:any){
        console.log(error)
      }
  }
  const convertBase64ToImageUrl = (base64String: string) => {
    return `data:image/png;base64,${base64String}`
  }


  return(
    <img
    src={image!=undefined?convertBase64ToImageUrl(image):"byububyu"}
    alt='Imagen del activo'
    width={50}
    height={50}/>
  )
};

export default GetImage;
