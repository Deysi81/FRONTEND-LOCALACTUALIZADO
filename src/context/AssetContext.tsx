
import axios from "axios";
import React, {  createContext, useContext, useEffect, useState } from "react"
import { useAuthContext } from "./AuthContext";
import toast from "react-hot-toast";

interface AssetContextProps {
  deleteAsset: (assetIds: string[]) => Promise<void>;
  handleDeleteConfirmed: (assetIds: string[]) => Promise<void>;
  createAsset: (itemId: UserData) => Promise<void>;
  getAsset: (id: string) => Promise<Asset>;
  updateAsset: (item: any) => Promise<void>;
  deliveryAsset:(item:any) => Promise<void>;
  devolutionAsset:(item:any) => Promise<void>;
  setnameAsset: any
  settypeCategoryAsset:any
  setlocation:any
  setcode:any
  setLimit: any
  limit:any
  setState:any
  setPage:any
  page:any
  totalAssets:any
  generatenewPdf: (id:string)=>Promise<void>;
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
  _id: string
  name: string
  description: string
  responsible: null
  supplier: supplier
  file: string
  isDeleted: boolean
  ufv3: number
  ufv4: number
  depreciatedValue: number
  typeCategoryAsset: typeCategoryAsset
  state: State
  informationCountable: informationCountable
  location: Location
  createdAt: Date
  assigned: boolean
}

interface codigoQR{
  _id: string,
  qrCodeDataUrl: string
}
interface Location {
  _id: string
  name: string
}
interface State {
  _id: string
  name: string
  isDeleted: boolean
}
interface responsible {
  _id: string
  name: string
  lastName: string
  ci: string
  email: string
  phone: string
  direction: string
  nationality: string
}
interface supplier {
  _id: string
  managerName: string
  managerCi: number
  managerPhone: number
  businessAddress: string
  isDeleted: boolean
  email: string
  businessName: string
  NIT: string
}
interface typeCategoryAsset {
  _id: string
  assetCategory: string
  usefulLife: number
  isDeleted: boolean
}

interface informationCountable {
  price: number
  dateAcquisition: Date
  warrantyExpirationDate: Date
  lote: number
  code: string
  documentPdf:string
}



interface InformationCountable {
  price: number
  dateAcquisition: string
  warrantyExpirationDate: Date
  lote: number
  // code?:string
}
interface UserData {
  name: string
  description: string
  // responsible: string
  supplier: string
  file: string
  typeCategoryAsset: string
  informationCountable: InformationCountable
  location: string
}


interface values{
  nameAsset: string
  offset: string
  limit: string
}
const AssetProvider = ({ children }: AssetProviderProps) => {

  const { accessToken:token } = useAuthContext()


  const [assets, setAsset] = useState<Asset[]>([]);
  const [nameAsset,setnameAsset]=useState<string>("")
  const [typeCategoryAsset,settypeCategoryAsset]=useState<string>("")
  const [location,setlocation]=useState<string>("")
  const [code,setcode]=useState<string>("")
  const [state,setState]=useState<string>("")

  const [page, setPage] = useState<number>(1);
  const [stateDB,setStateDB]=useState<State[]>([])
  const [totalAssets,settotalAssets]=useState<number>()
  const[limit,setLimit]=useState<number>(5)

  useEffect(() => {
    (async () => {
      getAssets()
      getStates()
    })();
  }, [nameAsset,limit,state,typeCategoryAsset,location,page])

  const getAssets=async()=>{
    let params = {};
    if (nameAsset) {
      params = { ...params, nameAsset };
    }
    if (typeCategoryAsset) {
      params = { ...params, typeCategoryAsset };
    }
    if (location) {
      params = { ...params, location };
    }
    if (state) {
      params = { ...params, state };
    }
    if (code) {
      params = { ...params, code };
    }
    if (limit) {
      params = { ...params, limit };
    }
    if (page) {
      params = { ...params, page };
    }
    if (page) {
      params = { ...params, page };
    }
    // console.log(params)
    const token = localStorage.getItem('token')

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    await setAsset(res.data.assets);
    await settotalAssets(res.data.totalAsset)
  }

  const getStates=async () => {
    const token = localStorage.getItem('token')
   try {
    const res =  await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}state`,{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    setStateDB(res.data)
   } catch (error) {
    console.log(error)
   }
  }


  const deleteAsset = async (assetIds: string[]) => {

    try {
      const deleteRequests = assetIds.map(async (assetId) => {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset/${assetId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        return res;
      });

      const responses = await Promise.all(deleteRequests);

      if (responses.every((res) => res.status === 200)) {
        const updatedAssets = assets.filter((asset) => !assetIds.includes(asset._id));
        setAsset(updatedAssets);
      }
    } catch (error: any) {
      alert(error.response?.data.message);
    }
  };

  const handleDeleteConfirmed = async (assetIds: string[]) => {
    try {
      const deleteRequests = assetIds.map(async (assetId) => {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset/${assetId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        return res;
      });
      const responses = await Promise.all(deleteRequests);
      if (responses.every((res) => res.status === 200)) {
        const updatedAssets = assets.filter((asset) => !assetIds.includes(asset._id));
        setAsset(updatedAssets);
      }
      toast.success('Activo Borrado')

    }catch (error) {
      console.error(error);
    }
  };



  const createAsset = async (assetData:UserData) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset/`, assetData
      ,{
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      await setAsset([res.data.reverse(),...assets].flat());
      toast.success('Activo Creado')
    } catch (error:any) {
      if (error.response) {
        // Error en la respuesta del servidor
        const errorMessage = error.response.data.message || 'Error en el servidor';
        toast.error(`HUBO UN ERROR AL CREAR UN ACTIVO:\n${errorMessage}`);

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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset/${id}`,{
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

  const updateAsset = async (newFields: any) => {

    try {

      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset/batch-update`, newFields,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res !== undefined) {
        const updatedAssets = assets.map(item => {
          const updatedAsset = res.data.find((updatedItem: any) => updatedItem._id === item._id);
          return updatedAsset || item;
        });
        toast.success('Activo Editado Correctamente')
        setAsset(updatedAssets);
      }


    } catch (error:any) {
    //   alert(error.response?.data.message);
    //   toast.error(`HUBO UN ERROR AL CREAR UN ACTIVO:\n${errorMessage}`);
    // }
    if (error.response) {
      // Error en la respuesta del servidor
      const errorMessage = error.response.data.message || 'Error en el servidor';
      toast.error(`HUBO UN ERROR AL EDITAR UN ACTIVO:\n${errorMessage}`);

    } else if (error.request) {
      // Falta de respuesta del servidor
      toast.error('No se recibió respuesta del servidor. Verifica tu conexión a Internet.');
    } else {
      // Error en la solicitud
      toast.error('Error al realizar la solicitud. Por favor, inténtalo de nuevo.');
    }
  }
  };

  const deliveryAsset = async (Ids: any) => {
    try {

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery`, Ids,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res !== undefined) {
        getAssets()
      }
      const successStyle = {
        background: 'rgba(0, 128, 0, 0.6)', // Color de fondo para éxito
        color: 'white', // Color del texto para éxito
      };

      toast.success('Activo Entregado Correctamente', {
        style: successStyle, // Aplica el estilo personalizado
        });


    } catch (error:any) {
      // alert(error.response?.data.message);
      if (error.response) {
        // Error en la respuesta del servidor
        const errorMessage = error.response.data.message || 'Error en el servidor';
        toast.error(`HUBO UN ERROR AL ENTREGAR UN ACTIVO:\n${errorMessage}`);

      } else if (error.request) {
        // Falta de respuesta del servidor
        toast.error('No se recibió respuesta del servidor. Verifica tu conexión a Internet.');
      } else {
        // Error en la solicitud
        toast.error('Error al realizar la solicitud. Por favor, inténtalo de nuevo.');
      }
    }
  };

  const devolutionAsset = async (newFields: any) => {
    try {

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}devolution`, newFields,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res !== undefined) {
        getAssets()
      }
      const successStyle = {
        background: 'rgba(0, 128, 0, 0.6)', // Color de fondo para éxito
        color: 'white', // Color del texto para éxito
      };

      toast.success('Activo Devuelto Correctamente', {
        style: successStyle, // Aplica el estilo personalizado
        });

    } catch (error:any) {
      // alert(error.response?.data.message);
      if (error.response) {
        // Error en la respuesta del servidor
        const errorMessage = error.response.data.message || 'Error en el servidor';
        toast.error(`HUBO UN ERROR AL DOLVER UN ACTIVO:\n${errorMessage}`);

      } else if (error.request) {
        // Falta de respuesta del servidor
        toast.error('No se recibió respuesta del servidor. Verifica tu conexión a Internet.');
      } else {
        // Error en la solicitud
        toast.error('Error al realizar la solicitud. Por favor, inténtalo de nuevo.');
      }
    }
  };

  const generatenewPdf = async (id: string) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset/get-asset-document-pdf/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const updatedAssets = assets.map((asset) => {
        if (asset._id == res.data._id) {
          return {
            ...asset,
            informationCountable: {
              ...asset.informationCountable,
              documentPdf: res.data.documentPdf,
            },
          };
        } else {
          return asset;
        }
      });

      setAsset(updatedAssets);
    } catch (error:any) {
      alert(error.response?.data.message);
    }
  };


  return (
    <>
    <assetContext.Provider
      value={{

        assets,
        setLimit,
        limit,
        setState,
        setnameAsset,
        settypeCategoryAsset,
        setlocation,
        setcode,
        setPage,
        page,
        deleteAsset,
        deliveryAsset,
        devolutionAsset,
        createAsset,
        getAsset,
        updateAsset,
        generatenewPdf,
        stateDB,
        handleDeleteConfirmed,
        totalAssets,
      }}>
      {children}
    </assetContext.Provider>
    </>
  )
}

export default AssetProvider
