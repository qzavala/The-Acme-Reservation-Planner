const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_reservation_planner_db"
);
const uuid = require("uuid");

