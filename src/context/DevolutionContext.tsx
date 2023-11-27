import axios from "axios";
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { useAuthContext } from "src/context/AuthContext"

interface DevolutionContextProps {
  deleteAsset: (id: string) => Promise<void>;
  getAsset: (id: string) => Promise<Devolution>;
  updateAsset: (item: any) => Promise<void>;
  generatenewPdf: (id:string)=>Promise<void>;
  totalAssets:any
  setlocation:any
  setLimit: any
  limit:any
  setPage:any
  page:any
  assets: Devolution[]
}

const devolutionContext = createContext<DevolutionContextProps>({} as DevolutionContextProps);

export const useAsset = () => {
  const context = useContext(devolutionContext);
  if (!context) throw new Error("Asset Provider is missing");
  return context;
}

interface AssetProviderProps {
  children: JSX.Element | JSX.Element[];
}

interface Devolution {
  _id: string,
  receiver: string,
  chargeReceiver: string,
  transmitter: string,
  chargeTransmitter: string,
  location: string,
  asset: asets
  proceedings:string
}


interface asets {
  map(arg0: (asets: {
  date: ReactNode; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | Iterable<import("react-i18next").ReactI18NextChild> | null | undefined; code: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | Iterable<import("react-i18next").ReactI18NextChild> | null | undefined;
}, index: React.Key | null | undefined) => JSX.Element): React.ReactNode;
  name: string,
  code: string,
  date: Date,
  file: string

}


interface asets {
    name: string,
    code: string,
    date: Date,
    file: string

  }
interface UserData {
  receiver: string,
  chargeReceiver: string,
  transmitter: string,
  chargeTransmitter: string,
  location: string,
  asset: asets
}
interface values{
    nameAsset: string
    offset: string
    limit: string
  }

const AssetDevolution = ({ children }: AssetProviderProps) => {

  const { accessToken:token } = useAuthContext()

  const [assets, setAsset] = useState<Devolution[]>([]);
  const [value,setValue]=useState<string>("")
  const [location,setlocation]=useState<string>("")
  const [page, setPage] = useState<number>(1);
  const[limit,setLimit]=useState<number>(1)
  const [totalAssets, settotalAssets]=useState<number>()

  useEffect(() => {
    (async () => {
      getAssets()
    })();
  }, [page,limit,page,location])
  console.log(assets,'aaaaaaaaaaaaaaaaa');
  const getAssets =async()=>{

    let params = {};

    if (limit) {
      params = { ...params, limit };
    }
    if (page) {
      params = { ...params, page };
    }
    const token = localStorage.getItem('token')

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}devolution/`
    , {
            params,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          })

          await setAsset(res.data.dataArray);
    // await settotalAssets(res.data.totalAsset)
  }

  const deleteAsset = async (id: any) => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_ACTIVOS}devolution/${id}`,{
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
console.log([newFields.assetIds])
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery`, newFields,{
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

  const generatenewPdf = async (id: string) => {

        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}devolution/get-asset-document-pdf/${id}`);
          const updatedAssets = assets.map((asset) => {
            if (asset._id == res.data._id) {
              return {
                ...asset,
                // asets: {
                //   ...asset.asset,
                proceedings: res.data.documentPdf,
                // },
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
    <devolutionContext.Provider
      value={{
        setLimit,
        limit,
        setlocation,
        setPage,
        page,
        totalAssets,
        assets,
        deleteAsset,
        getAsset,
        updateAsset,
        generatenewPdf,
      }}>
      {children}
    </devolutionContext.Provider>
  )
}

export default AssetDevolution

