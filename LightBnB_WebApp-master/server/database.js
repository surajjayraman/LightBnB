const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');
const { query_timeout } = require('pg/lib/defaults');
const pool = new Pool ({
  user: 'lighthouse',
  database: 'lightbnb',
  hostname: 'localhost',
  port: 5432
})


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT * FROM users
  WHERE email = $1
  `, [email])
  .then(res => res.rows[0])
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT * FROM users
  WHERE id = $1;
  `, [id])
  .then(res => res.rows[0]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES($1, $2, $3)
  RETURNING *;
  `, [user.name, user.email, user.password])
  .then(res => res.rows[0])
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
  SELECT reservations.*, properties.*, AVG(property_reviews.rating)
  FROM users
    JOIN reservations ON users.id = guest_id
    JOIN properties ON property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE users.id = $1
  AND reservations.end_date < now()::date
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `, [guest_id, limit])
  .then(res => res.rows)
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  
  const queryParams = [];

  // initial query string
  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // filter helper function
  const addFilter = function() {
    if (queryParams.length > 0) {
      queryString += `
      AND `
    } else {
      queryString += 'WHERE '
    }
  }

  // if city filter added
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length}`;
  }

  // if owner_id added
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    addFilter();
    queryString += `owner_id = $${queryParams.length}`;
  }

  // if min price added
  if (options.minimum_price_per_night) {
    queryParams.push(Number(options.minimum_price_per_night)*100);
    addFilter();
    queryString += `cost_per_night > $${queryParams.length}`;
  }

  // if max price added
  if (options.maximum_price_per_night) {
    queryParams.push(Number(options.maximum_price_per_night)*100);
    addFilter();
    queryString += `cost_per_night < $${queryParams.length}`;
  }
  
  // need the having after the group by
  queryString += `
  GROUP BY properties.id`;
  
  // if min rating added
  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    queryString += `
    HAVING AVG(property_reviews.rating) >= $${queryParams.length}`;
  }

  // end of query string search
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  //checking
  console.log(queryString, queryParams);

  // actual query call
  return pool.query(queryString,queryParams)
  .then(res => res.rows);

}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  
  const propertyValues = Object.values(property);
  // the order of the array
  // [ 1.title , 2.desc, 3.numBed, 4.numBath, 5.parking, 6.cost,
  // 7.thumb, 8.cover, 9.street, 10.country, 11.city, 12.province, 13.post, 14.owner_id]

  return pool.query(`
  INSERT INTO properties (owner_id, title, description,
    thumbnail_photo_url, cover_photo_url, cost_per_night, 
    street, city, province, post_code, country, 
    parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($14, $1, $2, $7, $8, $6, $9, $11, $12, $13, $10, $5, $3, $4)
  RETURNING *;
  `, propertyValues)
  .then(res => res.rows[0]);
}
exports.addProperty = addProperty;