  import axios from "axios";
  import { createContext, useContext, useEffect, useState } from "react";
  import { useAuthContext } from "./AuthContext";

  interface AssetContextProps {
    deleteAsset: (id: string) => Promise<void>;
    createAsset: (assetData: UserData) => Promise<void>;
    getAsset: (id: string) => Promise<Asset>;
    updateAsset: (newFields: any) => Promise<void>;
    setassetCategory:any
    assets: Asset[];
    setLimit: any
    limit:any
    setPage:any
    page:any
    totalAssets:any

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

    const [assets, setAsset] = useState<Asset[]>([]);

    const [assetCategory,setassetCategory]=useState<string>("")
    const [typeCategoryAsset,settypeCategoryAsset]=useState<string>("")
    const [managerCi,setmanagerCi]=useState<string>("")
    const [NIT,setNIT]=useState<string>("")
    const [managerPhone,setmanagerPhone]=useState<string>("")
    const [page, setPage] = useState<number>(0);
   //const [page, setPage] = useState(0);

    const [totalAssets,settotalAssets]=useState<number>()

  const[limit,setLimit]=useState<number>(10)


    useEffect(() => {
      (async () => {
        getAssets()
      })();
    }, [assetCategory,limit,managerPhone,managerCi,NIT,page])


    const getAssets=async()=>{
      let params = {};
      if (assetCategory) {
        params = { ...params, assetCategory };
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

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list`
      , {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
      );
      await setAsset(res.data);
      await settotalAssets(res.data.totalAssets)
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
      } catch (error:any) {
        alert(error.response?.data.message)
      }

    };

    const createAsset = async (assetData:UserData) => {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list/`, assetData
        ,{
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        await setAsset([res.data.reverse(),...assets].flat());

      } catch (error:any) {
        console.log('errorrrrr',error)
        alert(error.response?.data.message)
      }
    };

    const getAsset = async (id: string) => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list//${id}`,{
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
  console.log([newFields.assetIds])
        const res = await axios.put(`${process.env.NEXT_PUBLIC_API_ACTIVOS}depreciation-asset-list/   `, newFields,{
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

          setAsset(updatedAssets);
        }
        console.log('updateddddddddd', res.data);

      } catch (error:any) {
        alert(error.response?.data.message);
      }
    };

    return (
      <assetContext.Provider
        value={{
          setassetCategory,
          totalAssets,
        assets,
        setLimit,
        limit,
        setPage,
        page,
          deleteAsset,
          createAsset,
          getAsset,
          updateAsset,
        }}>
        {children}
      </assetContext.Provider>
    )
  }

  export default AssetContables
