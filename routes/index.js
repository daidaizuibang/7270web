var express = require('express');
var router = express.Router();
const { generateToken } = require('../utils/auth');
const { connectToDB, ObjectId } = require('../utils/db');
/* GET home page. */
router.get('/',function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* Handle the Form */
/* Handle the Form */
/* Display all Bookings */
/* Handle the Form */
/* Display all Bookings */

/* Handle the Form */
router.post('/booking', async function (req, res) {
  const db = await connectToDB();
  try {
    req.body.numTickets = parseInt(req.body.numTickets);
    req.body.terms = req.body.terms? true : false;
    req.body.created_at = new Date();
    req.body.modified_at = new Date();

    let result = await db.collection("bookings").insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// router.get('/bookings', async function (req, res) {
//   const db = await connectToDB();
//   try {
//       let results = await db.collection("bookings").find().toArray();
//       res.render('b2', { bookings: results });
//   } catch (err) {
//     console.log(4)
//       res.status(400).json({ message: err.message });
//   } finally {
//     console.log(1)
//       await db.client.close();
//   }
// });

// });
router.get('/booking/read/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("bookings").findOne({ _id: new ObjectId(req.params.id) });
    if (result) {
      res.render('update', { booking: result });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// Delete a single Booking
router.post('/booking/delete/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("bookings").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Booking deleted" });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// Search Bookings
router.get('/booking/search', async function (req, res) {
  const db = await connectToDB();
  try {
    let query = {};
    if (req.query.email) {
       query.email = req.query.email;
      //query.email = { $regex: req.query.email };
    }
    if (req.query.numTickets) {
      query.numTickets = parseInt(req.query.numTickets);
    }
    let result = await db.collection("bookings").find(query).toArray();
    res.render('bookings', { bookings: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});
// Pagination based on query parameters page and limit, also returns total number of documents
router.get('/booking/paginate', async function (req, res) {
  const db = await connectToDB();
  try {
    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 10;
    let skip = (page - 1) * perPage;

    let result = await db.collection("bookings").find().skip(skip).limit(perPage).toArray();
    let total = await db.collection("bookings").countDocuments();
    console.log(result)
    res.render('paginate', { bookings: result, total: total, page: page, perPage: perPage });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
  finally {
    await db.client.close();
  }
});
// Update a single Booking
router.post('/booking/update/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    req.body.numTickets = parseInt(req.body.numTickets);
    req.body.terms = req.body.terms? true : false;
    req.body.superhero = req.body.superhero || "";
    req.body.modified_at = new Date();

    let result = await db.collection("bookings").updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Booking updated" });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});
router.post('/login', async function (req, res, next) {
  const db = await connectToDB();
  try {
    // check if the user exists
    var user = await db.collection("users").findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // res.json(user);
    // res.json(user);

    delete user.password;
    delete user.ip_address;

    // generate a JWT token
    const token = generateToken(user);

    // return the token
    res.json({ token: token });
    
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});
module.exports = router;
