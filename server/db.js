const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_reservation_planner_db"
);
const uuid = require("uuid");

async function createTables() {
  const SQL = `
  DROP TABLE IF EXISTS reservation,
  DROP TABLE IF EXISTS customer,
  DROP TABLE IF EXISTS restaurant
  
  CREATE TABLE customer(
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  );

  CREATE TABLE restaurant(
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  );

  CREATE TABLE reservation(
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES customer(id) NOT NULL,
    restaurant_id UUID REFERENCES restaurant(id) NOT NULL,
    reservation_date DATE NOT NULL,
  );

  `;
  await client.query(SQL);
}

async function createCustomer(name) {
const SQL = `
INSERT INTO customer(id, name) VALUES($1, $2) RETURNING *
`;
const response = await client.query(SQL, [uuid.v4(), name]);
return response.rows[0];
// return response.rows[0];

}

async function createRestaurant(name) {
  const SQL = `
  INSERT INTO restaurant(id, name) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
  
  }

  async function createReservation({ restaurant_id, customer_id, reservation_date }) {
    const SQL = `
    INSERT INTO reservation(id, customer_id, restaurant_id, reservation_date) VALUES($1, $2, $3, $4) RETURNING *
    `;
    const response = await client.query(SQL, [
      uuid.v4(),
      customer_id,
      restaurant_id,
      reservation_date
    ]);
    return response.rows[0];
    
    }

    async function fetchCustomers() {
      const SQL = `
        SELECT * FROM customer;
      `;
      const response = await client.query(SQL);
      return response.rows;
    }

    async function fetchRestaurant() {
      const SQL = `
        SELECT * FROM restaurant;
      `;
      const response = await client.query(SQL);
      return response.rows;
    }

    async function fetchReservation() {
      const SQL = `
        SELECT * FROM reservation;
      `;
      const response = await client.query(SQL);
      return response.rows;
    }

    const destroyReservation = async (id) => {
      const SQL = `
        DELETE FROM reservation
        WHERE id = $1
      `;
      await client.query(SQL, [id]);
    };
    
    module.exports = {
      client,
      createTables,
      createCustomer,
      createRestaurant,
      createReservation,
      fetchCustomers,
      fetchRestaurants,
      fetchReservations,
      destroyReservation,
    };