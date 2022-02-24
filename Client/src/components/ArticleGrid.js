import { useState } from "react";
import { ArticleCard } from "./ArticleCard";
import styles from '../styles/ArticleGrid.module.css'
import { Spinner } from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component"
import { Error } from "./Error";
import ReactFlagsSelect from 'react-flags-select';
import { useNavigate, useParams } from "react-router-dom";
import { useLoadArticles } from "../hooks/useLoadArticles";

export function ArticleGrid({search, pathname, saved}){
    const {country: countryPrm, category: categoryPrm} = useParams();
    const [selected, setSelected] = useState(countryPrm);
    const [category] = useState(categoryPrm);
    const countryList = ["US","AR","IT","FR","GB","AE","AT","AU","BE","BG","BR","CA","CH","CN","CO","CU","CZ","DE","EG","GR","HK","HU","ID","IE","IL","IN","JP","KR","LT","LV","MA","MX","MY","NG","NL","NO","NZ","PH","PL","PT","RO","RS","RU","SA","SE","SG","SI","SK","TH","TW","UA","VE","ZA"];
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    
    // get articles
    const [articles, errorText, totalResults, isLoading] = useLoadArticles(search, pathname, selected, category, page, saved);

    if(errorText){
        return <Error errorText={errorText} errorIcon={"fa-solid fa-circle-exclamation"} />   
    }

    if(articles.length < 1 && !isLoading){
        return <Error errorText={"No news is good news. Try searching for something else."} errorIcon={"fa-solid fa-comment-dots"} />
    }

    if(isLoading){
        return < Spinner />
    }

    return(
        <div className={styles.mainContainer}>
            {/* If user is on his saved list, don't display filters */}
            <div className={`${styles.optionsContainer} ${saved ? "hidden" : ""}`}>
                <h3>Search top </h3>
                <select
                    className={styles.categorySelect}
                    value={category}
                    onChange={(e)=>{
                        navigate( `/top-headlines/${selected}/${e.target.value}`);
                    }}
                >
                    <option value={"business"}>Business</option>
                    <option value={"entertainment"}>Entertainment</option>
                    <option value={"general"}>General</option>
                    <option value={"health"}>Health</option>
                    <option value={"science"}>Science</option>
                    <option value={"sports"}>Sports</option>
                    <option value={"technology"}>Technology</option>
                </select>
                <h3>headlines in</h3>
                <ReactFlagsSelect 
                    selected={selected}
                    onSelect={(code)=>{
                        setSelected(code);
                        navigate( `/top-headlines/${code}${(category) ? `/${category}` : ""}`);
                    }}
                    className={styles.countrySelect}
                    countries={countryList} />
            </div>
            <InfiniteScroll
                dataLength={articles.length}
                hasMore={totalResults > articles.length && page < process.env.REACT_APP_MAX_PAGES}
                next={() => setPage((prevPage) => prevPage+1)}
                loader={< Spinner />}
            >
                <ul className={styles.articleGrid}>
                    {articles.map( (article,index) => <ArticleCard key={index} article={article} country={selected} category={category} /> ) }
                </ul>
            </InfiniteScroll> 

        </div>
    )
}