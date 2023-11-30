  import axios from "axios";
  import { createContext, useContext, useEffect, useState } from "react";
  import { useAuthContext } from "./AuthContext";
import toast from "react-hot-toast";

  interface AssetContextProps {
    deleteAsset: (id: string) => Promise<void>;
    handleDeleteConfirmed: (assetIds: string) => Promise<void>;
    createAsset: (assetData: UserData) => Promise<void>;
    getAsset: (id: string) => Promise<Asset>;
    updateAsset: (item: string,Newfield:any) => Promise<void>;
    setassetCategory:any
    assets: Asset[];
    setLimit: any
    limit:any
    setPage:any
    page:any
    totalGrupo:any

  }

  const assetContext = createContext<AssetContextProps>({} as AssetContextProps);

  export const useAsset = () => {
    const context = useContext(assetContext);
    if (!context) throw new Error("Asset Provider is missing");
    return context;
  };

  interface AssetProviderProps {
    children: JSX.Element | JSX.Element[];
  }

  interface Asset {
    _id: string
    assetCategory: string
    usefulLife: number
    subCategory: subCategory
    asset: boolean
  }

  interface subCategory {
    subCategory: string;
  }

  interface UserData {
    assetCategory: string;
    usefulLife: number;
    subCategory: subCategory;
  }

  const AssetContables = ({ children }: AssetProviderProps) => {

    const { accessToken:token } = useAuthContext()

    let [assets, setAsset] = useState<Asset[]>([]);

    const [assetCategory,setassetCategory]=useState<string>("")
    const [page, setPage] = useState<number>(0);
    const [totalGrupo,settotalGrupo]=useState<number>()
  const[limit,setLimit]=useState<number>(5)

    useEffect(() => {
      (async () => {
        getAssets()
      })();
    }, [assetCategory,limit,page])


    const getAssets=async()=>{
      let params = {};
      if (assetCategory) {
        params = { ...params, assetCategory };
      }
      if (limit) {
        params = { ...params, limit };
      }
      if (page) {
        params = { ...params, page };
      }

      console.log(params)
      const token = localStorage.getItem('token')

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list/`
      , {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
      );
      await setAsset(res.data.depreciationAsset);
      await settotalGrupo(res.data.totalGrupo)
    }


    const deleteAsset = async (id: any) => {
      try {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list/${id}`,{
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
          const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list/${assetId}`, {
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
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list`, assetData
        ,{
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        assets = Array.isArray(assets) ? assets : [];
        console.log(res.data,'sto el el datp')
        await setAsset([res.data,...assets]);
        toast.success('GRUPO CONTABLE CREADO')
      } catch (error: any) {
        if (error.response) {
          // Error in the server response
          const errorMessage = error.response.data.message || 'Error en el servidor';
          toast.error(`Hubo un error al crear el GRUPO CONTABLE:\n${errorMessage}`);
        } else if (error.request) {
          // Lack of response from the server
          toast.error('No se recibió respuesta del servidor. Verifica tu conexión a Internet.');
        } else {
          // Error in the request
          toast.error('Error al realizar la solicitud. Por favor, inténtalo de nuevo.');
        }
      }
    };

    const getAsset = async (id: string) => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list/${id}`,{
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
        console.log(id, Newfield, 'priveheeeeeeeeeeee');
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list/${id}`,
          Newfield,{
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(res.data, 'resssssss');
        if (res !== undefined) {
          // Actualiza el estado assets
          setAsset((prevAssets) =>
            prevAssets.map((item) => (item._id === id ? res.data : item))
          );
          toast.success('Grupo Contable actualizado correctamente');
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
      <assetContext.Provider
        value={{
          setassetCategory,
          totalGrupo,
          assets,
          setLimit,
          limit,
          setPage,
          page,
          deleteAsset,
          handleDeleteConfirmed,
          createAsset,
          getAsset,
          updateAsset,
        }}>
        {children}
      </assetContext.Provider>
    )
  }

  export default AssetContables
