import axios from "axios"

const API_URL = "https://newsapi.org/v2/";
const API_KEY = process.env.REACT_APP_API_TOKEN_2;
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

/* ******************
get data from the API.
----------------------
Input:
    endpoint: "everything" or "top-headlines". API url to retrieve data. Default: top-headlines
    query: Query string to search specific articles: Default: null
    page: News are divided into 20 article pages. Page 1 will fetch articles 1-20, page 2 will fetch articles 21-40. Default: null
    country: Country code to search news by country. Default: us (United States)
    category: News category (technology, sports, etc.)
Output:
    array [ Articles array, TotalResults int, Status String ]
********************* */
export function getAPI(endpoint = 'top-headlines', query = '', page='1', country = 'us', category = ''){
    let hasParams = false
    if(query){ 
        query = "?q="+query; 
        hasParams = true;
    }

    if(page){ 
        page = (hasParams ? "&" : "?") + "page="+page;
        hasParams = true;
    }

    if(country){ 
        if(endpoint === 'top-headlines'){
            country = (hasParams ? "&" : "?") + "country="+country;
            hasParams = true;
        }else{
            country = '';
        }
    }

    if(category){ 
        category = (hasParams ? "&" : "?") + "category="+category;
        hasParams = true;
    }

    axios.defaults.withCredentials = false;
    return(
        axios.get(API_URL + endpoint + query + page + country + category, {
            headers:{
                Authorization: API_KEY
            }
        })
        .then((result) => {
            if (result.status !== 200) throw Error(result.status);
            return result.data
        })
    )
}


/* ******************
Execute an action in a server controller.
----------------------
Input:
    controller: "user", "news", "savedNews"
    body: Request body. Always takes an operation that indicates what to do and can take other parameters
        Operation codes:
        01: create
        03: view
        04: delete
        08: get list
    
Output:
    array [ results ]
********************* */
export function serverPost(controller, body){
    axios.defaults.withCredentials = true;
    const fixedPromise = axios.post(`${SERVER_URL}/${controller}`, body, {withCredentials: true})
    .then((response) => {
        if (response.status !== 200) throw Error(response.status);
        return response.data;
    });
    return fixedPromise

}

/* ******************
Check if user is logged (session is active)
----------------------
Input:
    -
Output:
    errtyp: E (error) - S (success)
    errcod: error code
    errtxt: error description
********************* */
export function serverCheckLogin(){
    axios.defaults.withCredentials = true;
    const fixedPromise = axios.get(`${SERVER_URL}/user`,{withCredentials: true})
    .then((response) => {
        if (response.status !== 200) throw Error(response.status);
        return response.data;
    });
    return fixedPromise;
}