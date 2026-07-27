import db from "./db.mjs";
import crypto from 'crypto';


const getUser = (username,password) => {
 // console.log("getUser chiamata", username);
  return new Promise ((res,rej)=> {
    const sql='SELECT * FROM User WHERE username=?'

    db.get(sql, [username],(err,row)=> {
      if(err)
        rej(err);
      else
        if (row==undefined) {
          //console.log('Utente non trovato');
          res(false);//caso no utente
        }
        else{
          const user= {id:row.id,username:row.username}
          //console.log('Utente trovato:', row);
          crypto.scrypt(password,row.salt,32,function(err,hashedPassword){//il risultato si chiama hashed Password
            if(err)
              rej(err);
            //console.log('Password nel DB:', row.password);
            //console.log('Password calcolata:', hashedPassword.toString('hex'));
            if(!crypto.timingSafeEqual(Buffer.from (row.password,'hex'),hashedPassword))//dovrebbe impedire a qualcuno di scoprire la password al confronto
              
              res(false);
              
            else
              res(user);//return utente senza passsword
          
        })
      }

    })
  })
}

export default getUser;