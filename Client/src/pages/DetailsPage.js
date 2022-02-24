import errorImg from "../images/error-loading.png"
import styles from "../styles/DetailsPage.module.css"
import { Spinner } from "../components/Spinner";
import { Error } from "../components/Error";
import { useGetSingleArticle } from "../hooks/useGetSingleArticle.js"

export function DetailsPage(){
    // get the article
    const [article, isLoading, errorText] = useGetSingleArticle();

    //on error, show error component with text and icon
    if(errorText){
        return <Error errorText={errorText} errorIcon={"fa-solid fa-xmark"} />
    }

    if(isLoading){
        return < Spinner />;
    }

    if(!isLoading && !article){
        return <Error errorText={"There was an error loading this article. Please, try again later"} errorIcon={"fa-solid fa-xmark"} />
    }

    return (
    <div className={styles.mainContainer}>
        <div className={styles.leftDiv}>
            <div className={styles.publishedAt}>{article.publishedAt.substring(0,10)}</div>
            <div className={styles.author}>{article.author}</div>
            <div className={styles.buttonsDiv}>
                Share
                <ul className={styles.buttonsList}>
                    {/* Share buttons. LinkedIn and Facebook don't work on dev environment because they need a valid url, not localhost:3000 */}
                    <li><button className={`fa-brands fa-facebook-f ${styles.button}`} onClick={() => {window.open("https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(window.location.href), "socialshare", "width=550,height=450");}}></button></li>
                    <li><button className={`fa-brands fa-twitter ${styles.button}`} onClick={() => {window.open("https://twitter.com/intent/tweet?url=&text=Take a look at this article: \n"+encodeURIComponent(window.location.href),"socialshare", "width=550,height=450");}}></button></li>
                    <li><button className={`fa-brands fa-linkedin-in ${styles.button}`} onClick={() => {window.open("https://www.linkedin.com/shareArticle?mini=true&url="+encodeURIComponent(window.location.href)+"title=An interesting article I found.","socialshare", "width=550,height=450")}}></button></li>
                    <li><button className={`fa-brands fa-whatsapp ${styles.button}`} onClick={() => {window.open("https://api.whatsapp.com/send?text=Take a look at this article: \n"+encodeURIComponent(window.location.href),"socialshare", "width=900,height=900");}}></button></li>
                </ul>
            </div>
        </div>
        <div className={styles.mainDiv}>
            <h2 className={styles.title}>{article.title}</h2>
            <img className={styles.img}
                width={600}
                height={400}
                src={ (article.urlToImage ? article.urlToImage : errorImg) }
                alt={article.title}
                onError={e => { e.currentTarget.src = errorImg; }}
            ></img>
            <p className={styles.content}>{article.content}</p>
            <a className={"link"} target="_blank" rel="noopener noreferrer" href={article.url}>Read full article
                <i className={`fa-solid fa-arrow-up-right-from-square ${styles.linkIcon}`}></i>
            </a>
        </div>
    </div>);
}