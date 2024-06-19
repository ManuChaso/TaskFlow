
export default async function FetchApi(method, endpoint, body){
    try{
        const url = import.meta.env.VITE_API_URL;
        const API_KEY = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem('token');

        const response = await fetch(`${url}${endpoint}`, {
            method: method,
            headers:{
                'Content-Type': 'application/json',
                'API_KEY': `${encodeURIComponent(API_KEY)}`,
                'authorization': token
            },
            body: body && JSON.stringify(body)
        });

        const res = await response.json();

        return res
    } catch (err) {
        console.error('Error fetching resources: ', err);
    }
}