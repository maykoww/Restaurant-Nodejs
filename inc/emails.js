let conn = require('./db');

module.exports = {

    getEmails() {

        return new Promise((resolve, reject) => {

            conn.query(`SELECT * FROM tb_emails ORDER BY id`, (err, results) => {

                if(err) {
                    reject(err);
                } else {

                    resolve(results);

                }

            });

        });

    },
    save({email}) {

        return new Promise((resolve, reject)=>{

            conn.query('INSERT INTO tb_emails (email) VALUES(?)', [ 
                email
            ], (err, results) => {

                if (err) {
                    reject(err.message);
                } else {
                    resolve(results);
                }

            });

        });

    },
    delete(id) {
        return new Promise((resolve, reject) => {

            conn.query(`DELETE FROM tb_emails WHERE id = ?`, [
                id
              ], (err, results)=>{
        
                if(err) {
                  reject(err);
                } else {
                  resolve(results);
                }
        
            });

        });
    }

}