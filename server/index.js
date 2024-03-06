const express = require('express');
const app = express();

app.use(express.json());

const { client, createTables, createCustomer, createRestaurant, createReservation, fetchCustomers, fetchRestaurants, fetchReservations, destroyReservation } = require('./db.js');



app.get('/api/customers', async (req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/restaurants', async (req, res, next) => {
  try {
    res.send(await fetchRestaurants());
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/reservations', async (req, res, next) => {
  try {
    res.send(await fetchReservations());
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/customers/:customer_id/reservations/:id', async (req, res, next) => {
  try {
    await destroyReservation(req.params.id);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.post('/api/customers/:id/reservations', async (req, res, next) => {
  try {
    res.status(201).send(await createReservation({customer_id:req.params.id, ...req.body}));
  } catch (ex) {
    next(ex);
  }
});

const init = async () => {
  await client.connect();
  console.log('Connected database');
  await createTables();
  console.log('Tables created');

  const [Tom, Timmy, Tamantha, Rallys, Norms, KFC, Tams] = await Promise.all([
    createCustomer('Tom'),
    createCustomer('Timmy'),
    createCustomer('Tamantha'),
    createRestaurant('Rallys'),
    createRestaurant('Norms'),
    createRestaurant('KFC'),
    createRestaurant('Tams')
  ]);

  console.log(`Tamantha has an id of ${Tamantha.id}`);
  console.log(`Rallys has an id of ${Rallys.id}`);


  await Promise.all([
    createReservation({ customer_id: Timmy.id, restaurant_id: Rallys.id, reservation_date: '01/02/2023' }),
    createReservation({ customer_id: Tom.id, restaurant_id: Norms.id, reservation_date: '02/03/2024' }),
    createReservation({ customer_id: Timmy.id, restaurant_id: KFC.id, reservation_date: '03/04/2024' }),
    createReservation({ customer_id: Tamantha.id, restaurant_id: Tams.id, reservation_date: '04/05/2024' }),
  ]);

  const reservations = await fetchReservations();
  console.log(reservations);

  await destroyReservation(reservations[0].id);
  console.log(await fetchReservations());

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`App listening in port ${PORT}`));
  };

init();