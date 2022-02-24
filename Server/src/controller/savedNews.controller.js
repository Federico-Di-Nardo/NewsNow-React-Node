import {m_create, m_load, m_delete, m_getList} from '../model/savedNews.model.js';
import {m_create as m_createNews, m_load as m_loadNews} from '../model/news.model.js';

export const index = async (req, res) => {
  const prm = {};
  // this controller can only be accesed by logged users. Return error message if user isn't logged
  if(req.session.user == null){
    data = {errtyp: "E", errcod:"-50", errtxt: "You must be logged in to perform this action"};
    res.json(data);
    return false;
  }

  let data = "";
  prm.operation = req.body.operation;
  prm.username = req.session.user;

  switch (prm.operation) {
    // CREATE
    case '01':
      prm.title = req.body.title;
      prm.description = req.body.description;
      prm.content = req.body.content;
      prm.urlToImage = req.body.image;
      prm.author = req.body.author;
      prm.publishedAt = req.body.publishedAt;
      prm.url = req.body.url;

      // check if the article already exists on the database
      // if it doesn't, create it
      let prmNews = prm;
      prmNews.operation = "06";
      let loadedNews = await m_loadNews(prmNews);
      if(loadedNews && loadedNews.newsID){
        prm.newsID = loadedNews.newsID;
        prmNews.operation = "01"
        data = await m_create(prm);
      }else{
        prmNews.operation = "01"
        loadedNews = await m_createNews(prmNews);
        if(loadedNews && loadedNews.newsID){
          prm.newsID = loadedNews.newsID;
          data = await m_create(prm);
        }else{
          return loadedNews;
        }
      }

      break;

    // LOAD
    case '03':
      prm.savedNewsID = req.body.savedNewsID;
      if(prm.savedNewsID == null){
        data = {errtyp:"E", errcod:"-3", errtxt:"Article not informed."}
      }else{
        data = await m_load(prm);
      }
      break;

    // DELETE
    case '04':
      prm.savedNewsID = req.body.savedNewsID;
      data = await m_delete(prm);
  
      break;

    // GET LIST
    case '08':
      // if urls are informed, create filter
      if(req.body.urls){
        prm.filter = ' and n.newsUrl IN (' + req.body.urls + ')'
      }
      data = await m_getList(prm);
  
      break;

    default:
      data = {errtyp:"E", errcod:"-2", errtxt:"Invalid operation."}
      break;
  }

  res.json(data);
}