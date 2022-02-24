import { getConnection } from "./connection";

export const m_create = async (prm = []) => {
  const recordset = await callSP(prm);
  return recordset[0];
}

export const m_load = async (prm = []) => {
  const recordset = await callSP(prm);
  return recordset[0];
}

export const m_delete = async (prm = []) => {
  const recordset = await callSP(prm);
  return recordset[0];
}

export const m_getList = async (prm = []) => {
  const recordset = await callSP(prm);
  return recordset;
}

const callSP = async (prm) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
    .input('operation', prm.operation)
    .input('savedNewsID', prm.savedNewsID)
    .input('userID', prm.userID)
    .input('username', prm.username)
    .input('newsID', prm.newsID)
    .input('filter', prm.filter)
    .execute('savedNewsSP');
    return result.recordset;
  } catch (error) {
    console.log(error);
    return error
  }
    
}

