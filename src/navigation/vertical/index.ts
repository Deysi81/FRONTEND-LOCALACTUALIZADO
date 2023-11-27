// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Inicio',
      path: '/home',
      icon: 'mdi:home-outline'
    },

    {
      title: 'Activos',
      icon: 'mdi:briefcase-account',
      children: [
        {
          title: 'Registrar Activos',
          path: '/listaact',
          icon: 'mdi:currency-usd-circle'
        },
        {
          title: 'Grupos Contables',
          path: '/GruposContables/grupo',
          icon: 'mdi:account-group'
        },
        {
          title: 'Calcular Depreciacion de un activo',
          path: '/DepreciacionesDeActivos',
          icon: 'mdi:account-clock'

        },
        {
          title: 'Entrega De Activos',
          path: '/EntregaDeActivos/entrega2',
          icon: 'mdi:account-box-multiple'
        },
        {
          title: 'Devolución De Activos',
          path: '/DevolucionDeActivos/devolucion',
          icon: 'mdi:account-box-multiple'
        },
        {
          title: 'Bitacora',
          path: '/Bitacora',
          icon: 'mdi:clipboard-list'
        },
        {
          title: 'Linea de Tiempo',
          path: '/timeLine',
          icon: 'mdi:clipboard-list'
        }
      ]
    },
    {
      title: 'Proveedores',
      icon: 'mdi:account-outline',
      children: [
        {
          title: 'Nuevo Proveedor',
          path: '/proveedores/getprovider2',
          icon: 'mdi:account-check'
        }
      ]
    }
  ]
}

export default navigation
