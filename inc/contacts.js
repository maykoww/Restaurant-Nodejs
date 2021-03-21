const conn = require('./db');

module.exports = {

    render(req, res, error, success) {
        res.render('contact',  {
          title: 'Contato',
            background: 'images/img_bg_3.jpg',
            h1: 'Diga Oi!',
            body: req.body,
            error,
            success
        })
    },

    save({name, email, message}) {

        return new Promise((resolve, reject)=>{

            conn.query('INSERT INTO tb_contacts (name, email, message) VALUES(?, ?, ?)', [
                name,
                email,
                message
            ], (err, results) => {

                if (err) {
                    reject(err.message);
                } else {
                    resolve(results);
                }

            });

        });

    },
    getContacts() {

        return new Promise((resolve, reject) => {

            conn.query(`SELECT * FROM tb_contacts ORDER BY id`, (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })

        });

    },
    delete(id) {
        return new Promise((resolve, reject) => {

            conn.query(`DELETE FROM tb_contacts WHERE id = ?`, [
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
