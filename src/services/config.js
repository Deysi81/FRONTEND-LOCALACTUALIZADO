import axios from 'axios'

export const apiCall = async function (getOptions) {
  const options = getOptions
  const api = process.env.NEXT_PUBLIC_API_ACTIVOS
  const config = {
    method: options.method,
    url: `${api}${options.url}`,
    headers: {
      Authorization: `Bearer`,
      'Content-Type': 'application/json; charset=utf-8',
      ...options.headers
    },
    data: options.data
  }

  return await axios(config)
    .then(async function (response) {
      const responseObject = await response.data

      return responseObject
    })
    .catch(async function (error) {
      const responseError = await error.response.data
      console.log(responseError)
      if (responseError.statusCode == 401) {
        localStorage.clear()
        window.location.href = process.env.NEXT_PUBLIC_URL_CENTRAL
      } else {
        throw responseError
      }
    })
}
