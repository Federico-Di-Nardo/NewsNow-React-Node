import { useEffect, useState } from "react";
import { getAPI, serverPost } from "../utils/httpClient";

// hook to fetch the articles grid
export function useLoadArticles(search, pathname, selected, category, page, saved){
    const [isLoading, setIsLoading] = useState(true);
    const [errorText, setErrorText] = useState(false);
    const [articles, setArticles] = useState([]);
    const [totalResults, setTotalResults] = useState();

    // function that is always called after fetching articles
    // Input: articles array
    // Output: articles array with savedNewsID for logged user if they exist
    const searchSavedNews = async (articles) => {
        var filter = articles.reduce( (prev, curr) => {
            if(prev === ""){
                return `'${curr.url}'`;
            }else{
                return `${prev},'${curr.url}'`
            }
        }, "")

        const serverData = await serverPost("savedNews",{operation: "08", urls: filter})
        if(serverData[0] && serverData[0].errtyp){
            return;
        }

        for(let i = 0; i < articles.length; i++){
            for(let j = 0; j < serverData.length; j++){
                if( articles[i].url === serverData[j].url ){
                    articles[i].savedNewsID = serverData[j].savedNewsID;
                }
            }
        }
        return articles
    }

    useEffect(() => {
        if(!saved){
            if(search){
                // if searching with query string, use the "everything" endpoint
                getAPI("everything", search, page).then((data) => {
                    setTotalResults(data.totalResults);
                    searchSavedNews(data.articles)
                    .then((data) => {
                        setArticles((prevArticles) => prevArticles.concat(data));
                        setIsLoading(false);
                    })
                }).catch((error)=>{
                    // free newsapi.org accounts can do a limited amount of request. If the limit is surpassed, handle error
                    if(error.response.status === 429){
                        setErrorText("You made too many request. Wait and try again later.");
                    }else{
                        setErrorText("There was an error retrieving the article. Try again later.");
                    }
                })
            }else{
                // if user isn't searching with query string, get top-headlines for country/category
                const countryQuery = (selected ? selected.toLowerCase() : 'us');
                const categoryQuery = (category ? category : '');
                getAPI("top-headlines", search ?? "", page, countryQuery, categoryQuery ).then((data) => {
                    setTotalResults(data.totalResults);
                    searchSavedNews(data.articles)
                    .then((data) => {
                        setArticles((prevArticles) => prevArticles.concat(data));
                        setIsLoading(false);
                    })
                }).catch((error)=>{
                    if(error.response.status === 429){
                        setErrorText("You made too many request. Wait and try again later.");
                    }else{
                        setErrorText("There was an error retrieving the article. Try again later.");
                    }
                })
            }
        }else{
            // if user is on "Saved" tab, get only his saved news
            serverPost("savedNews", {operation:"08"})
            .then((data) => {
                if (data.length === 0){
                    setErrorText("You haven't saved any articles yet. Go to the Top Headlines section and start browsing!");
                    return;
                }
                if(data.errtyp === "E"){
                    setErrorText(data.errtxt);
                    return;
                }
                setArticles((prevArticles) => prevArticles.concat(data));
                setTotalResults(data.totalResults);
                setIsLoading(false);
            }).catch((error)=>{
                if(error.response.status === 429){
                    setErrorText("You made too many request. Wait and try again later.");
                }else{
                    setErrorText("There was an error retrieving the article. Try again later.");
                }
            })
        }
    }, [search, pathname, selected, page])
    return [articles, errorText, totalResults, isLoading]
}