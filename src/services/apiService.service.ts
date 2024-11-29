// @ts-nocheck
import axios from 'axios';
import { getItem, timeDelay } from './helpers.service';
import { FPTURL, WEB_VALUE } from './constant';

const axiosClient = axios.create( {
	baseURL: WEB_VALUE,
	headers: {
		'Content-Type': 'application/json',
		'Authorization': 'Bearer ' + getItem( 'access_token' )
	},
	body: JSON.stringify(),
} )


// const axiosClientFpt = axios.create( {
// 	baseURL: FPTURL,
// 	headers: {
// 		"X-Custom-Header": "foobar",
//     	"api_key": "PHtrShIss7tPvkNzWo7MoqnHAq52OJxL",
//         // 'Content-Type': 'application/json',
// 		'Content-Type': 'multipart/form-data'
// 	},
// 	body: JSON.stringify(),
// } )

const axiosClientFpt = axios.create({
	baseURL: "https://api.fpt.ai",
	headers: {
	  "api_key": "PHtrShIss7tPvkNzWo7MoqnHAq52OJxL",
	  "Content-Type": "multipart/form-data" // Đảm bảo Content-Type phù hợp
	}
  })




if ( getItem( 'access_token' ) )
{
	axiosClient.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + getItem( 'access_token' );
}
axiosClient.interceptors.response.use(
	( response ) =>
	{
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		let data = response?.data;
		// if ( ( data && data.code === 'LG0401' ) )
		// {
		// 	localStorage.clear();
		// 	window.location.href = `/auth`;
		// } else if ( data.code === 'LG0403' )
		// {
		// 	window.location.href = `/auth`;
		// }


		return response?.data;
	},
	( error ) =>
	{
		console.log( 'error--------> ', error.response?.status );
		if ( error?.response?.status === 401 || error?.response?.status?.statusCode === 401 )
		{
			localStorage.clear();
			window.location.href = `/auth`;
		}

		let dataError = error.response?.data || null;
		if ( ( dataError && dataError.code === 'LG0401' ) )
		{
			localStorage.clear();
			window.location.href = `/auth`;
		} else if ( dataError.code === 'LG0403' )
		{
			window.location.href = `/auth`;
		}
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		return Promise.reject( error.response?.data )
	}
)

export const postMethod = async ( path, data ) =>
{
	return await axiosClient.post( `/${ path }`, data )
		.then( response => response )
		.catch( error =>
		{
			return {
				status: 'error',
				message: error.message || 'Invalid!'
			}
		} );
}

export const postFormMethod = async ( path, data ) =>
	{
		return await axiosClient.postForm( `/${ path }`, data )
			.then( response => response )
			.catch( error =>
			{
				return {
					status: 'error',
					message: error.message || 'Invalid!'
				}
			} );
	}

export const getMethod = async ( path, params ) =>
{
	return await axiosClient.get( `/${ path }`, { params: params } )
		.then( response =>
		{
			return response;
		} )
		.catch( error =>
		{
			return {
				status: 'error',
				message: error.message || 'Invalid!'
			}
		} );
}

export const putMethod = async ( path, data ) =>
{
	return await axiosClient.put( `/${ path }`, data )
		.then( response => response )
		.catch( error =>
		{
			return {
				status: 'error',
				message: error?.message || 'Invalid!'
			}
		} );
}

export const putFormMethod = async ( path, data ) =>
	{
		return await axiosClient.putForm( `/${ path }`, data )
			.then( response => response )
			.catch( error =>
			{
				return {
					status: 'error',
					message: error?.message || 'Invalid!'
				}
			} );
	}

export const deleteMethod = async ( path ) =>
{
	return await axiosClient.delete( `/${ path }` )
		.then( response => response )
		.catch( error =>
		{
			return {
				status: 'error',
				message: error.message || 'Invalid!'
			}
		} );
}


export const postImage = ( path, data ) =>
{

	return axios.post( `/${ path }`, data, { headers: { 'Accept': 'multipart/form-data' } } )
		.then( response => response?.data )
		.catch( error =>
		{
		} );
}
export const uploadFile = async ( file ) =>
{
	let avatar = null;
	const formData = new FormData();
	formData.append( 'file', file );
	const res = await axios.post( `${WEB_VALUE}/upload/file`,
		formData, { headers: { 'Accept': 'multipart/form-data,*' } } );
	let data = res.data;
	if ( data?.status === 'success' )
	{
		avatar = data?.data?.url;
	}
	return avatar;
}


//đọc căn cước công dân
// export const postFormMethodFPT = async ( path, data ) =>
// 	{
// 		return await axiosClientFpt.postForm(path, data )
// 			.then( response => response )
// 			.catch( error =>
// 			{
// 				return {
// 					status: 'error',
// 					message: error.message || 'Invalid!'
// 				}
// 			} );
// 	}
export const postFormMethodFPT = async (path, data) => {
	return await axiosClientFpt.post(path, data)
	  .then(response => response)
	  .catch(error => {
		return {
		  status: 'error',
		  message: error.message || 'Invalid!'
		};
	});
};


  
  
