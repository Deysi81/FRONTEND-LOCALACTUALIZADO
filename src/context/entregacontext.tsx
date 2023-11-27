import axios from "axios";
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { useAuthContext } from "src/context/AuthContext"

interface EntregaContextProps {
  deleteAsset: (id: string) => Promise<void>;
  getAsset: (id: string) => Promise<Entrega>;
  updateAsset: (item: any) => Promise<void>;
  generatenewPdf: (id:string)=>Promise<void>;
  totalAssets:any
  setlocation:any
  settransmitterId:any
  setreceiverId:any
  setLimit: any
  limit:any
  setPage:any
  page:any
  assets: Entrega[]
}

const entregaContext = createContext<EntregaContextProps>({} as EntregaContextProps);

export const useAsset = () => {
  const context = useContext(entregaContext);
  if (!context) throw new Error("Asset Provider is missing");
  return context;
}

interface AssetProviderProps {
  children: JSX.Element | JSX.Element[];
}

interface Entrega {
  _id: string,
  receiver: string,
  chargeReceiver: string,
  transmitter: string,
  chargeTransmitter: string,
  location: string,
  asset: asets
  pdf:string
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

const AssetEntrega = ({ children }: AssetProviderProps) => {

  const { accessToken:token } = useAuthContext()

  const [assets, setAsset] = useState<Entrega[]>([]);
  const [value,setValue]=useState<string>("")
  const [location,setlocation]=useState<string>("")
  const [transmitterId,settransmitterId]=useState<string>("")
  const [receiverId,setreceiverId]=useState<string>("")
  const [page, setPage] = useState<number>(1);
  const[limit,setLimit]=useState<number>(1)
  const [totalAssets, settotalAssets]=useState<number>()

  useEffect(() => {
    (async () => {
      getAssets()
    })();
  }, [page,limit,page,location,transmitterId,receiverId])

  const getAssets =async()=>{

    let params = {};
    if (location) {
      params = { ...params, location };
    }
    if (transmitterId) {
      params = { ...params, transmitterId };
    }
    if (receiverId) {
      params = { ...params, transmitterId };
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
    const token = localStorage.getItem('token')

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/`, {
            params,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          })
          await setAsset(res.data.dataArray);
    await settotalAssets(res.data.totalAsset)
  }

  const deleteAsset = async (id: any) => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/${id}`,{
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
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/get-asset-document-pdf/${id}`);
          const updatedAssets = assets.map((asset) => {
            if (asset._id == res.data._id) {
              return {
                ...asset,
                // asets: {
                //   ...asset.asset,
                 pdf: res.data.documentPdf,
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
    <entregaContext.Provider
      value={{
        setLimit,
        limit,
        setlocation,
        setPage,
        settransmitterId,
        setreceiverId,
        page,
        totalAssets,
        assets,
        deleteAsset,
        getAsset,
        updateAsset,
        generatenewPdf,
      }}>
      {children}
    </entregaContext.Provider>
  )
}

export default AssetEntrega

// import axios from "axios";
// import React, {  ReactNode, createContext, useContext, useEffect, useState } from "react"
// import { useAuthContext } from "src/context/AuthContext"

// interface EntregaContextProps {
//   deleteAsset: (id: string) => Promise<void>;
//   handleDeleteConfirmed: (id: string) => Promise<void>;
//   getAsset: (id: string) => Promise<Asset>;
//   updateAsset: (item: any) => Promise<void>;
//     setValue: any
//     setLimit: any
//     generatenewPdf: (id:string)=>Promise<void>;
//   assets: Asset[]
// }

// const entregaContext = createContext<EntregaContextProps>({} as EntregaContextProps);

// export const useAsset = () => {
//   const context = useContext(entregaContext);
//   if (!context) throw new Error("Asset Provider is missing");
//   return context;
// }

// interface AssetProviderProps {
//   children: JSX.Element | JSX.Element[];
// }


// interface Asset {
//   _id: string,
//   receiver: string,
//   chargeReceiver: string,
//   transmitter: string,
//   chargeTransmitter: string,
//   location: string,
//   asset: asets
// }

// interface asets {
//   map(arg0: (asets: {
//   date: ReactNode; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | Iterable<import("react-i18next").ReactI18NextChild> | null | undefined; code: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | Iterable<import("react-i18next").ReactI18NextChild> | null | undefined;
// }, index: React.Key | null | undefined) => JSX.Element): React.ReactNode;
//   name: string,
//   code: string,
//   date: Date,
//   file: string

// }
// interface codigoQR{
//   _id: string,
//   qrCodeDataUrl: string
// }

// interface UserData {
//   receiver: string,
//   chargeReceiver: string,
//   transmitter: string,
//   chargeTransmitter: string,
//   location: string,
//   asset: asets
// }

// interface asets {
//   name: string,
//   code: string,
//   date: Date,
//   file: string

// }
// interface values{
//   nameAsset: string
//   offset: string
//   limit: string
// }
// const AssetEntrega = ({ children }: AssetProviderProps) => {
//   const { accessToken:token } = useAuthContext()


//   const [assets, setAsset] = useState<Asset[]>();
//   const [value,setValue]=useState<string>("")
//   const [page, setPage] = useState<number>(1);
//   const[limit,setLimit]=useState<string>("")
//   const [totalAssets,settotalAssets]=useState<number>()


//   useEffect(() => {
//     (async () => {
//       getAssets()
//     })();
//   }, [value,limit])

//   const getAssets=async()=>{
//     let params = {};
//     if (limit) {
//       params = { ...params, limit };
//     }
//     if (page) {
//       params = { ...params, page };
//     }
//     if (page) {
//       params = { ...params, page };
//     }
//     // console.log(params)
//     const token = localStorage.getItem('token')

//     const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery`, {
//       params,
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       }
//     });
//    // await setAsset(res.data.assets);
//     await setAsset(res.data);
//     await settotalAssets(res.data.totalAsset)
//   }




//   const deleteAsset = async (id: string[]) => {

//     try {
//       const deleteRequests = id.map(async (id) => {
//         const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/${assetId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         return res;
//       });

//       const responses = await Promise.all(deleteRequests);

//       if (responses.every((res) => res.status === 200)) {
//         // Filtra los activos después de que todas las solicitudes DELETE hayan tenido éxito
//         const updatedAssets = (assets);
//         setAsset(updatedAssets);
//       }
//     } catch (error: any) {
//       alert(error.response?.data.message);
//     }
//   };
//   const getAsset = async (id: string) => {
//     try {
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/${id}`,{
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       return res.data;
//     } catch (error:any) {
//       console.error(error.response?.data.message);
//     }
//   };

//   const updateAsset = async (id: string) => {
//     try {
//       const res = await axios.put(
//         `${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/${id}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (res !== undefined) {
//         const updatedAsset = res.data;
//         setAsset((prevAssets) => {
//           const updatedAssets = prevAssets.map((item) =>
//             item._id === id ? updatedAsset : item
//           );
//           return updatedAssets;
//         });
//       }
//     } catch (error: any) {
//       alert(error.response?.data.message);
//     }
//   };


//   const generatenewPdf = async (id: string) => {
//     try {
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}delivery/get-asset-document-pdf/${id}`);
//       console.log(res.data,'aaaaaaaaaaaaaaaaaaaaaa')
//       const updatedAssets = assets.map((asset) => {
//         if (asset._id == res.data._id) {
//           return {
//             ...asset,
//             asets: {
//               ...asset.asset,
//               file: res.data.documentPdf,
//             },
//           };
//         } else {
//           return asset;
//         }
//       });

//       console.log(updatedAssets, 'Updated Assets');
//       setAsset(updatedAssets);
//     } catch (error:any) {
//       alert(error.response?.data.message);
//     }
//   };


//   return (
//     <>
//     <entregaContext.Provider
//       value={{
//         assets,
//         setLimit,
//         setValue,
//         deleteAsset,
//         getAsset,
//          updateAsset,
//         generatenewPdf,
//       }}>
//       {children}
//     </entregaContext.Provider>
//     </>
//   )
// }

// export default AssetEntrega
