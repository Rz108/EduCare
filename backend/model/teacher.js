const db = require('./databaseConfig');

const teach = {
    verifyTeach : (email, password, callback) => {
        var conn = db.getConnection();
        conn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected!");
                var SQLstatement = "SELECT * FROM teacher WHERE email=? and password=?"; // SQL Statement
                conn.query(SQLstatement, [email, password], (error, result) => {
                    console.log("Success"); //Test
                    conn.end();
                    if (error) {
                        console.log(error);
                        return callback(error, null);

                    } else if (result.length == 0) {
                        return callback(null, null)

                    }else {
                        console.log(result);
                        var cher = result[0]
                        return callback(null, cher);
                    }
                });
            }
        });
    },

    // getStoreAdd : (callback) => {
    //     var conn = db.getConnection();
    //     conn.connect(function(err) {
    //         if (err) {
    //             console.log(err);
    //             return callback(err, null);
    //         } else {
    //             console.log("Connected!");
    //             var SQLstatement = "SELECT s.store_id, a.address_id, a.address, a.district, ci.city, co.country FROM address a, store s, city ci, country co WHERE a.address_id = s.address_id AND a.city_id = ci.city_id AND ci.country_id=co.country_id;"; // SQL Statement
    //             conn.query(SQLstatement, (error, result) => {
    //                 console.log("Success"); //Test
    //                 conn.end();
    //                 if (error) {
    //                     console.log(error);
    //                     return callback(error, null);
    //                 }else {
    //                     console.log(result);
    //                     return callback(null, result);
    //                 }
    //             });
    //         }
    //     });
    // },
};

module.exports = teach;