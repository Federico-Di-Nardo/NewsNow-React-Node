import { useEffect, useState } from "react";
import { serverPost } from "../utils/httpClient";
import { useParams } from "react-router-dom";

// hook to load an article
export function useGetSingleArticle(){
  let { newsID } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [errorText, setErrorText] = useState(null);

  useEffect(() => {
    setIsLoading(true)

    if(newsID){
      serverPost("news", {operation:"03", newsID: newsID})
      .then((article) => {
        setArticle(article);
        setIsLoading(false);
      }).catch((error)=>{
        if(error.response.status === 429){
          setErrorText("You made too many request. Wait and try again later.");
        }else{
          setErrorText("There was an error retrieving the article. Try again later.");
        }
      })
    }else{
      setErrorText("Invalid news code");
    }

  }, []);
  return [article, isLoading, errorText]
}