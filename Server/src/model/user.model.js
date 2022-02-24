import { getConnection } from "./connection";
import crypto from 'crypto';

export const m_create = async (prm = []) => {
  // store hashed password
  prm.password = crypto.createHash("sha256").update(prm.password, "binary").digest("base64");
  return await callSP(prm);
}

export const m_load = async (prm = []) => {
  // hash password to compare it to hashed db password
  prm.password = crypto.createHash("sha256").update(prm.password, "binary").digest("base64");
  return await callSP(prm);
}

export const m_delete = (prm = []) => {
  //prm['operation'] operation = '04'
  //return callSP(prm)
}

const callSP = async (prm) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
    .input('operation', prm.operation)
    .input('name', prm.name)
    .input('password', prm.password)
    .execute('userSP');
    return result.recordset[0];
  } catch (error) {
    console.log(error);
    return error
  }
    
}

