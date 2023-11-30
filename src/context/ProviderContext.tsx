import { TextField } from "@mui/material";
import axios from "axios";
import { promises } from "dns";
import React, { ChangeEvent, createContext, useContext, useEffect, useState } from "react"
import { Interface } from "readline";
import { useAuthContext } from "./AuthContext";
import toast from "react-hot-toast";

interface AssetContextProps {
  deleteAsset: (id: string) => Promise<void>;
  handleDeleteConfirmed: (assetIds: string) => Promise<void>;
  createAsset: (itemId: UserData) => Promise<void>;
  getAsset: (id: string) => Promise<Asset>;
  updateAsset: (item: string,Newfield:any) => Promise<void>;
  setnameSupplier: any
  setmanagerCi:any
  setNIT:any
  setLimit: any
  limit:any
  setmanagerPhone:any
  setPage:any
  page:any
  totalAssets:any

  assets: Asset[],
  stateDB:any;

}

const assetContext = createContext<AssetContextProps>({} as AssetContextProps);

export const useAsset = () => {
  const context = useContext(assetContext);
  if (!context) throw new Error("Asset Provider is missing");
  return context;
}

interface AssetProviderProps {
  children: JSX.Element | JSX.Element[];
}

interface Asset {
  _id: string;
  managerName: string;
  managerCi: string;
  managerPhone: number;
  businessAddress: string;
  email: string;
  businessName: string;
  NIT: string;
  informationAsset: informationAsset[];
  asset: boolean;
}

interface informationAsset {
  asset: string;
  description: string;
}

interface State {
  _id: string
  name: string
  isDeleted: boolean
}

interface informationAsset{
  asset: string,
  description: string
}

interface UserData {
  managerName: string
  managerCi: string
  managerPhone: number
  businessAddress: string
  email: string
  businessName: string
  NIT: string
  informationAsset:informationAsset[]
}

interface values{
  nameAsset: string
  offset: string
  limit: string
}

const AssetSupllier = ({ children }: AssetProviderProps) => {

  const { accessToken:token } = useAuthContext()


  let [assets, setAsset] = useState<Asset[]>([]);
  const [nameSupplier,setnameSupplier]=useState<string>("")
  const [managerCi,setmanagerCi]=useState<string>("")
  const [NIT,setNIT]=useState<string>("")
  const [managerPhone,setmanagerPhone]=useState<string>("")
  const [page, setPage] = useState<number>(0);
  const [stateDB,setStateDB]=useState<State[]>([])
  const [totalAssets,settotalAssets]=useState<number>()

const[limit,setLimit]=useState<number>(5)

  useEffect(() => {
    (async () => {
      getAssets()
    })();
  }, [nameSupplier,limit,managerPhone,managerCi,NIT,page])

  const getAssets=async()=>{
    let params = {};
    if (nameSupplier) {
      params = { ...params, nameSupplier };
    }

    if (managerCi) {
      params = { ...params, managerCi };
    }
    if (managerPhone) {
      params = { ...params, managerPhone };
    }
    if (NIT) {
      params = { ...params, NIT };
    }
    if (limit) {
      params = { ...params, limit };
    }
    if (page) {
      params = { ...params, page };
    }

    console.log(params)
    const token = localStorage.getItem('token')

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier/`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    await setAsset(res.data.suppliers);
    await settotalAssets(res.data.totalSupplier)
  }



  const deleteAsset  = async (id: string) => {
    try {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.status === 200) {
          setAsset(assets.filter(asset => asset._id !== id));
        }
        toast.success('GRUPO CONTABLE ELIMINADO')
      } catch (error: any) {
        if (error.response) {
          // Error in the server response
          const errorMessage = error.response.data.message || 'Error en el servidor';
          toast.error(`Hubo un error al eliminar el grupo contable:\n${errorMessage}`);
        } else if (error.request) {
          // Lack of response from the server
          toast.error('No se recibió respuesta del servidor. Verifica tu conexión a Internet.');
        } else {
          // Error in the request
          toast.error('Error al realizar la solicitud. Por favor, inténtalo de nuevo.');
        }
      }
    };

  const handleDeleteConfirmed = async (assetId: string) => {
    try {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier/${assetId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      if (res.status === 200) {
        setAsset(assets.filter(asset => asset._id !== assetId));
      }
    }catch (error: any) {
      alert(error.response?.data.message);
    }
  };



  const createAsset = async (assetData:any) => {
console.log(assetData,'aaaaaaaaaa')
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier/`, assetData
      ,{
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // console.log(res.data,'sto el el datp')
      // await setAsset([res.data.reverse(),...assets].flat());
      assets = Array.isArray(assets) ? assets : [];
      console.log(res.data,'sto el el datp')
      await setAsset([res.data,...assets]);
      toast.success('PROVEEDOR REGISTRADO')
    } catch (error:any) {
      if (error.response) {
        // Error en la respuesta del servidor
        const errorMessage = error.response.data.message || 'Error en el servidor';
        toast.error(`HUBO UN ERROR AL REGISTRAR UN PROVEEDOR:\n${errorMessage}`);

      } else if (error.request) {
        // Falta de respuesta del servidor
        toast.error('No se recibió respuesta del servidor. Verifica tu conexión a Internet.');
      } else {
        // Error en la solicitud
        toast.error('Error al realizar la solicitud. Por favor, inténtalo de nuevo.');
      }
    }
  };

  const getAsset = async (id: string) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return res.data;
    } catch (error:any) {
      console.error(error.response?.data.message);
    }
  };

  const updateAsset = async (id: string, Newfield: any) => {
    try {

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier/update/${id}`,
        Newfield,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (res !== undefined) {
        // Actualiza el estado assets
        setAsset((prevAssets) =>
          prevAssets.map((item) => (item._id === id ? res.data : item))
        );
        toast.success('Proveedor actualizado correctamente');
      }
    } catch (error: any) {
        if (error.response) {
          // Error in the server response
          const errorMessage = error.response.data.message || 'Error en el servidor';
          toast.error(`Hubo un error al editar el grupo contable:\n${errorMessage}`);
        } else if (error.request) {
          // Lack of response from the server
          toast.error('No se recibió respuesta del servidor. Verifica tu conexión a Internet.');
        } else {
          // Error in the request
          toast.error('Error al realizar la solicitud. Por favor, inténtalo de nuevo.');
        }
      }
    };

  return (
    <>
    <assetContext.Provider
      value={{
        totalAssets,
        assets,
        setLimit,
        limit,
        setmanagerPhone,
        setnameSupplier,
        setmanagerCi,
        setNIT,
        setPage,
        page,
        deleteAsset,
        createAsset,
        getAsset,
        updateAsset,
        stateDB,
        handleDeleteConfirmed,
      }}>
      {children}
    </assetContext.Provider>
    </>
  )
}

export default AssetSupllier
