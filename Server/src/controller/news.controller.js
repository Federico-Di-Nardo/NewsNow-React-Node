import {m_create, m_load} from '../model/news.model.js';

export const index = async (req, res) => {
  const prm = {};

  let data = "";
  prm.operation = req.body.operation;

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
      let loadedNews = await m_load(prmNews);
      if(loadedNews && loadedNews.newsID){
        data = loadedNews
      }else{
        prmNews.operation = "01"
        data = await m_create(prmNews);
      }

      break;

    // LOAD
    case '03':
      prm.newsID = req.body.newsID;
      if(prm.newsID == null){
        data = {errtyp:"E", errcod:"-3", errtxt:"Article not informed."}
      }else{
        data = await m_load(prm);
      }
      break;

    default:
      data = {errtyp:"E", errcod:"-2", errtxt:"Invalid operation."}
      break;
  }

  res.json(data);
}