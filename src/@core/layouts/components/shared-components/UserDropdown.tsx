// ** React Imports
import { useState, SyntheticEvent, Fragment, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'
import axios from 'axios'
import { useAuthContext } from 'src/context/AuthContext'

interface Props {
  settings: Settings
}


const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = (props: Props) => {

  const { users } = useAuthContext()

  const { settings } = props

  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  const router = useRouter()
  const { logout } = useAuth()

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2,
      fontSize: '1.375rem',
      color: 'text.primary'
    }
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  return (
    <Fragment>
     <Box marginBottom={-2}>
    <Box marginBottom={5}>
    <Typography> {'  '}</Typography>
    </Box>
    <Box>
<Typography
  variant='body2'
  sx={{
    textAlign: 'center',
    fontFamily: 'NuevaFuente, sans-serif',
    fontWeight: 'bold',
    textTransform: 'capitalize'
  }}>
  {users?.name} {users?.lastName}
  {/* {user?.name} */}
</Typography>
<Typography variant='body2' sx={{ textAlign: 'center', fontFamily: 'NuevaFuente, sans-serif' }}>
  {users?.ci}
</Typography>
      </Box>

      </Box>


      {/* <Typography style={{  color: 'gray',fontSize:'15px',fontWeight: 'bold'}}>
        NOMBRE: {''}
      </Typography>
<Typography style={{  color: 'gray',fontSize:'15px'}}>
         {users?.name} {users?.lastName}
      </Typography> */}

      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar
          alt='JohNNn Doe'
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={users?.file}
        />
      </Badge>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar alt='John Doe' src={users?.file} sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}> {users?.name} {users?.lastName} </Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
              CI: {users?.ci}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: '0 !important' }} />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon='mdi:account-outline' />
            Profile
          </Box>
        </MenuItem>
        {/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon='mdi:email-outline' />
            Inbox
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon='mdi:message-outline' />
            Chat
          </Box>
        </MenuItem> */}
        <Divider />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon='mdi:cog-outline' />
            Settings
          </Box>
        </MenuItem>
        {/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon='mdi:currency-usd' />
            Pricing
          </Box>
        </MenuItem> */}
        {/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon='mdi:help-circle-outline' />
            FAQ
          </Box>
        </MenuItem> */}
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
        >
          <Icon icon='mdi:logout-variant' />
          Cerrar sesion
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown

// // ** React Imports
// import { useState, SyntheticEvent, Fragment, useEffect } from 'react'

// // ** Next Import
// import { useRouter } from 'next/router'

// // ** MUI Imports
// import Box from '@mui/material/Box'
// import Menu from '@mui/material/Menu'
// import Badge from '@mui/material/Badge'
// import Avatar from '@mui/material/Avatar'
// import Divider from '@mui/material/Divider'
// import MenuItem from '@mui/material/MenuItem'
// import { styled } from '@mui/material/styles'
// import Typography from '@mui/material/Typography'

// // ** Icon Imports
// import Icon from 'src/@core/components/icon'

// // ** Context
// import { useAuth } from 'src/hooks/useAuth'

// // ** Type Imports
// import { Settings } from 'src/@core/context/settingsContext'
// import axios from 'axios'

// interface Props {
//   settings: Settings
// }

// interface user {
//   _id: string
//   fullName: string
//   email: string
//   charge: string
//   file: string
// }

// // ** Styled Components
// const BadgeContentSpan = styled('span')(({ theme }) => ({
//   width: 8,
//   height: 8,
//   borderRadius: '50%',
//   backgroundColor: theme.palette.success.main,
//   boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
// }))

// const UserDropdown = (props: Props) => {
//   const id = window.localStorage.getItem('id')
//   const [image, setImage] = useState<string>('')
//   const { settings } = props
//   const [anchorEl, setAnchorEl] = useState<Element | null>(null)
//   const router = useRouter()
//   const { logout } = useAuth()
//   const { direction } = settings
//   const [user, setUser] = useState<user>()
//   useEffect(() => {
//     get()
//   }, [])
//   const get = async () => {
//     try {
//       const response = await axios.get<user>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}personal/`)
//       setUser(response.data)
//       const aux = 'data:image/png;base64,' + user?.file
//       setImage(aux)
//       console.log(response.data)
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   const handleDropdownOpen = (event: SyntheticEvent) => {
//     setAnchorEl(event.currentTarget)
//   }
//   const handleDropdownClose = (url?: string) => {
//     if (url) {
//       router.push(url)
//     }
//     setAnchorEl(null)
//   }
//   const styles = {
//     py: 2,
//     px: 4,
//     width: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     color: 'text.primary',
//     textDecoration: 'none',
//     '& svg': {
//       mr: 2,
//       fontSize: '1.375rem',
//       color: 'text.primary'
//     }
//   }
//   const handleLogout = () => {
//     logout()
//     handleDropdownClose()
//   }

//   return (
//     <Fragment>
//       {user?.fullName}

//       {/* {user?.fullName} */}
//       <Badge
//         overlap='circular'
//         onClick={handleDropdownOpen}
//         sx={{ ml: 2, cursor: 'pointer' }}
//         badgeContent={<BadgeContentSpan />}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'right'
//         }}
//       >
//         <Avatar alt='John Doe' onClick={handleDropdownOpen} sx={{ width: 40, height: 40 }} src={image} />
//       </Badge>
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={() => handleDropdownClose()}
//         sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
//         anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
//         transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
//       >
//         <Box sx={{ pt: 2, pb: 3, px: 4 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <Badge
//               overlap='circular'
//               badgeContent={<BadgeContentSpan />}
//               anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'right'
//               }}
//             >
//               <Avatar alt='John Doe' src={image} sx={{ width: '2.5rem', height: '2.5rem' }} />
//             </Badge>
//             <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
//               <Typography sx={{ fontWeight: 600 }}>
//                 {user?.fullName}
//                 {/* {user?.lastName} */}
//               </Typography>
//               <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
//                 Admin
//               </Typography>
//             </Box>
//           </Box>
//         </Box>
//         <Divider sx={{ mt: '0 !important' }} />
//         <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
//           <Box sx={styles}>
//             <Icon icon='mdi:account-outline' />
//             Perfil
//           </Box>
//         </MenuItem>
//         <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
//           <Box sx={styles}>
//             <Icon icon='mdi:email-outline' />
//             Inbox
//           </Box>
//         </MenuItem>
//         <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
//           <Box sx={styles}>
//             <Icon icon='mdi:message-outline' />
//             Chat
//           </Box>
//         </MenuItem>
//         <Divider />
//         <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
//           <Box sx={styles}>
//             <Icon icon='mdi:cog-outline' />
//             Configuracion
//           </Box>
//         </MenuItem>
//         <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
//           <Box sx={styles}>
//             <Icon icon='mdi:currency-usd' />
//             Pricing
//           </Box>
//         </MenuItem>
//         <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
//           <Box sx={styles}>
//             <Icon icon='mdi:help-circle-outline' />
//             FAQ
//           </Box>
//         </MenuItem>
//         <Divider />
//         <MenuItem
//           onClick={handleLogout}
//           sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
//         >
//           <Icon icon='mdi:logout-variant' />
//           Salir
//         </MenuItem>
//       </Menu>
//     </Fragment>
//   )
// }

// export default UserDropdown
