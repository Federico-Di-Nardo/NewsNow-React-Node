import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import errorImg from '../images/error-loading.png'
import { serverPost } from '../utils/httpClient';
import styles from '../styles/ArticleCard.module.css'

export function ArticleCard({ article, country, category }){
    const [savedNewsID, setSavedNewsID] = useState(null);
    const [hasError, setHasError] = useState(false);
    const [errorText, setErrorText] = useState(false);
    const navigate = useNavigate();

    const handleOpenArticle = () => {
        // if there is a newsID (user is in saved news tab), open with that ID
        if(article.newsID){
            navigate(`/saved/article/${article.newsID}`);
        // else, check if news is in the db, insert it or select its ID
        }else{
            serverPost("news", {
                operation:"01", 
                title:article.title, 
                description:article.description, 
                content:article.content,
                image: article.urlToImage,
                author: article.author,
                url: article.url,
                publishedAt: article.publishedAt
            }).then((data) => {
                navigate( `../article/${(country ? `${country}/` : "")}${category ? `${category}/` : ""}${data.newsID}`);
            })
        }
    }

    const saveArticle = () => {
        serverPost("savedNews", {
            operation:"01", 
            title:article.title, 
            description:article.description, 
            content:article.content,
            image: article.urlToImage,
            author: article.author,
            url: article.url,
            publishedAt: article.publishedAt
        }).then((data) => {
            if(data.errtyp === "E"){
                setErrorText(data.errtxt);
                setHasError(true);
                return
            }
            if(data.savedNewsID){
                setSavedNewsID(data.savedNewsID);
            }
        });
    }

    const unsaveArticle = () => {
        if(savedNewsID){
            serverPost("savedNews", {
                operation:"04", 
                savedNewsID: savedNewsID, 
            })
            .then((data) => {
                if(data.savedNewsID){
                    setSavedNewsID(null)
                }
            });

        }
    }

    useEffect(() => {
        // check if the user saved this article
        if(article.savedNewsID){
            setSavedNewsID(article.savedNewsID)
        }
    }, []);
    
    return(
        <li className={styles.cardLi}>
            <div className={styles.card}>
                <div>
                    <h3 className={`${styles.errorMessage} ${styles.cardImg} ${(hasError ? "alert-shown" : "alert-hidden")}`}
                        onTransitionEnd={() => setHasError(false)}
                        >{errorText}</h3>
                    <img className={styles.cardImg}
                        onClick={handleOpenArticle}
                        width={300}
                        height={200}
                        src={ (article.urlToImage ? article.urlToImage : errorImg) }
                        alt={article.title}
                        onError={e => { e.currentTarget.src = errorImg; }}
                    />
                    <i 
                        className={`${savedNewsID ? "fa-solid" : "fa-regular"} fa-bookmark ${styles.saveButton}`} 
                        onClick={(e) => {
                                e.preventDefault(); 
                                if(savedNewsID){
                                    unsaveArticle();
                                }else{
                                    saveArticle();
                                }
                            } }></i>
                </div>
                <div className={styles.cardBody}>
                    <h5 className={`${styles.cardTitle} ${styles.cardText}`}>{article.title}</h5>
                    <p className={`${styles.cardAuthor} ${styles.cardText}`}>{article.author}</p>
                    <p className={`${styles.cardDescription} ${styles.cardText}`}>{article.description}</p>
                </div>
            </div>
        </li>
    )
}