const db = require('./databaseConfig');


const student = {
  verifyStud : (email, password, callback) => {
    var conn = db.getConnection();
    conn.connect(function(err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        console.log("Connected!");
        var SQLstatement = "SELECT * FROM student WHERE email=? and password=?"; // SQL Statement
        conn.query(SQLstatement, [email, password], (error, result) => {
          console.log("Success-studentjs"); //Test
          console.log(result)
          console.log(error)
          conn.end();
          if (error) {
            console.log(error);
            return callback(error, null);

          } else if (result.length == 0) {
            return callback(null, null)

          }else {
            console.log(result);
            var stud = result[0]
            return callback(null, stud);
          }
        });
      }
    });
  },

    // getCities : (callback) => {
    //     var conn = db.getConnection();
    //     conn.connect(function(err) {
    //         if (err) {
    //             console.log(err);
    //             console.log("test")
    //             return callback(err, null);
    //         } else {
    //             console.log("Connected!");

    //             var checkEmail = "SELECT city FROM city;"

    //             conn.query(checkEmail, (error, result) => {
    //                 conn.end();
    //                 return callback(null, result)
    //             });
                
    //         }
    //     });
    // },

    addCus : (userDetails, callback) => {

      var {name, email, password} = userDetails;


      var conn = db.getConnection();
      conn.connect(function(err) {
        if (err) {
          console.log(err);
          console.log("test")
          return callback(err, null);
        } else {
            console.log("Connected!");
            // var SQLstatement = `SELECT f.title, p.amount, p.payment_date
            // FROM payment p, rental r, inventory i, film f WHERE p.rental_id = r.rental_id
            // AND r.inventory_id = i.inventory_id AND i.film_id = f.film_id AND p.customer_id = ?
            // AND DATE(p.payment_date) >= ? AND DATE(p.payment_date) <?;`; // SQL Statement

            var addToAddress = `INSERT INTO address (address, address2, district, city_id, postal_code, phone) VALUES (?,?,?,?,?,?);`; // SQL Statement
            var addToCustomer = `INSERT INTO customer (store_id, first_name, last_name, email, address_id, password) VALUES (?,?,?,?,?,?);`;
            var checkEmail = "SELECT customer_id FROM customer WHERE email = ?;"

            conn.query(checkEmail, email, (error, result) => {
                console.log(error, result);
                if (typeof(result[0]) == 'object') {
                    return callback('duplicate', null);
                }
                else {
                  conn.query(addToAddress, [address, address2, district, city, postalCode, phone], (error1, result1) => {
          
                    console.log(result1)
                    var addressID = result1.insertId;
                    console.log(addressID)
                    conn.query(addToCustomer, [store_id, first_name, last_name, email, addressID, password], (error2, result2) => {
                      conn.end();
                      total = 0;
                      if (error2) {
                          console.log(error2);
                          return callback(error2, null);
                      } else {
                          console.log(result2);
                          return callback(null, result2);
                      }
                    });
                  });
                }
            });
            
        }
      });
    }
};



module.exports = student;