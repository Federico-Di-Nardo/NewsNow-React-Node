import {m_create, m_load, m_delete} from '../model/user.model.js';

/*
function that returns if user is logged or not
  possible outputs:
    errtyp: 'S', errcod: 0
    errtyp: 'E', errcod: -1, errtxt: 'Invalid user/password'
*/
export const isLogged = async (req, res) => {
  if(req.session.user != null){
    res.send(req.session.user);
  }else{
    res.send(false)
  }
}

export const index = async (req, res) => {
  const prm = {}
  const session = req.session
  let data = "";
  prm.operation = req.body.operation;

  switch (prm.operation) {
    // CREATE
    case '01':
      prm.name = req.body.name;
      prm.password = req.body.password;
      data = await m_create(prm);
      
      break;


    // LOAD
    case '03':
      prm.name = req.body.name;
      prm.password = req.body.password;
      if(prm.name == null || prm.password == null){
        data = {errtyp:"E", errcod:"-3", errtxt:"User or password not informed."}
      }else{
        data = await m_load(prm);
        if(data.errtyp == "S"){
          req.session.user = prm.name;
        }
      }
      break;


    // DELETE
    case '04':
      data = await m_delete();
  
      break;


    // LOG OUT
    case '05':
      req.session.destroy();
      data = {errtyp:"S", errcod:0}
      break;
  

    default:
      data = {errtyp:"E", errcod:"-2", errtxt:"Invalid operation."}
      break;
  }

  res.json(data);
}