const sql=require('mssql')
const SqlString = require("tsqlstring")
require('dotenv').config();




//koble til sql database
const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    trustServerCertificate: true,
  },
};

async function oppdaterParti(id){
    try {
    await sql.connect(sqlConfig);
    const string = SqlString.format("update parti set stemmer = stemmer + 1 where bid = ?", [id])
    const res = await sql.query(string);
    return res
  } catch (error) {
    throw error;
  } finally {
    sql.close();
  }
}

async function hentParti() {
  try {
    await sql.connect(sqlConfig);
    const string2 = SqlString.format('SELECT * FROM parti')
    const res = await sql.query(string2);
    return res.recordset;
  } catch (error) {
    throw error;
  } finally {
    sql.close();
  }
}

async function hentBruker() {
  let pool;
  try {
    pool = await sql.connect(sqlConfig);
    const string3 = SqlString.format('SELECT * FROM bruker')
    const res = await pool.request().query(string3);
    return res.recordset;
  } catch (error) {
    throw error;
  } finally {
    if (pool) {
      pool.close();
    }
  }
}

  async function hentBrukerEtterId(id) {
    let pool;
    try {
      pool = await sql.connect(sqlConfig);
      const string4 = SqlString.format('SELECT * FROM bruker WHERE bid = ?', [id]);
      const res = await pool.request().query(string4);

      if (res.recordset.length > 0) {
        return res.recordset[0];
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    } finally {
      if (pool) {
        pool.close();
      }
    }
  }

async function leggTilBruker(id) {
  let pool;
  try {
    pool = await sql.connect(sqlConfig);
    const string5 = SqlString.format('INSERT INTO bruker (bid, stemt) VALUES (?, 1)', [id]); // Angi stemt = 1
    await pool.request().query(string5);
    console.log(id + " lagt til")
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    if (pool) {
      pool.close();
    }
  }
}

  async function harStemt(id) {
  let pool;
  try {
    pool = await sql.connect(sqlConfig);
    const string6 = SqlString.format(`SELECT stemt FROM bruker WHERE bid = ${id}`);
    const res = await pool.request().query(string6);
    console.log(id + " harStemt")
    return res.recordset.length > 0 && res.recordset[0].stemt === true; // Sjekk om stemt = 1
  } catch (error) {
    throw error;
  } finally {
    if (pool) {
      pool.close();
    }
  }
}



module.exports = {
  hentParti,
  oppdaterParti,
  hentBruker,
  hentBrukerEtterId,
  leggTilBruker,
  harStemt,
}