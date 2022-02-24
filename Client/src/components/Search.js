import styles from "../styles/Search.module.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export function Search({className}) {
    const {country: countryPrm, category: categoryPrm} = useParams();
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") ?? "";

    const [searchVal, setSearchVal] = useState("");
    const [writingTimer, setWritingTimer] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setSearchVal(search || "")
    }, [search]);

    // create a timer. When it goes off, the search is triggered
    // each key press restarts the timer, so if the user is done typing 
    //(if he hasn't typed for 0.5 seconds), fetch the articles with the query param
    const searchArticles = (e) =>{
        if (writingTimer) {
           clearTimeout(writingTimer);
        }

        setWritingTimer(
            setTimeout(function () {
                navigate( `../top-headlines/${(countryPrm ? countryPrm : "US")}/${(categoryPrm ? categoryPrm : "general")}?search=${searchVal}`);
            }, 500)
        )
    }

    return (
        <div className={className}>
            <div className={styles.searchContainer}>
                <input 
                    type="text" 
                    className={styles.searchInput} 
                    placeholder="Search for news all around the world."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    onKeyUp={searchArticles} />
            </div>
        </div>
    )
}