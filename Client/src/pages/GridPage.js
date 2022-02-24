import { ArticleGrid } from '../components/ArticleGrid.js';
import { useQuery } from "../hooks/useQuery.js";
import { useLocation } from "react-router-dom";

export function GridPage({saved}){
    const search = useQuery().get("search");
    const pathname = useLocation().pathname;

    return(
        <div>
            {/* the key is pathname + search, so that whenever any of these are changed, the component is rerendered */}
            <ArticleGrid key={`${pathname}_${search}`} search={search} pathname={pathname} saved={saved} />
        </div>
    )
}