import { getConnection } from "./connection";

export const m_create = async (prm = []) => {
  return await callSP(prm);
}

export const m_load = async (prm = []) => {
  return await callSP(prm);
}

const callSP = async (prm) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
    .input('operation', prm.operation)
    .input('newsID', prm.newsID)
    .input('newsTitle', prm.title)
    .input('newsContent', prm.content)
    .input('newsDescription', prm.description)
    .input('newsAuthor', prm.author)
    .input('newsPublishedAt', prm.publishedAt)
    .input('newsImage', prm.urlToImage)
    .input('newsUrl', prm.url)
    .execute('newsSP');
    return result.recordset[0];
  } catch (error) {
    console.log(error);
    return error
  }
    
}

