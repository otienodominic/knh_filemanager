import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.
// router.get("/", async (req, res) => {
//   let collection = await db.collection("files");
//   let results = await collection.find({}).toArray();
//   res.send(results).status(200);
// });

router.get("/", async (req, res) => {
  const collection = await db.collection("files");

  // Get the page and limit from query parameters with default values
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  // Calculate the starting index of the records to fetch
  const startIndex = (page - 1) * limit;

  // Create a search filter if a search query is provided
  const searchFilter = search
    ? {
        $or: [
          { patientName: { $regex: search, $options: "i" } }, // Case-insensitive regex search for patient name
          { patientNumber: { $regex: new RegExp(`^${search}`, "i") } } // Case-insensitive regex search for patient number as string
        ]
      }
    : {};

  // Fetch the paginated and filtered results
  const results = await collection
    .find(searchFilter)
    .skip(startIndex)
    .limit(limit)
    .toArray();

  res.status(200).send(results);
});





// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("files");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
    patientNumber: req.body.patientNumber,
    patientName: req.body.patientName,
    phoneNumber: req.body.phoneNumber,     
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender, 
    viralLoad: [req.body.viralLoad], 
    visitDate:[req.body.visitDate],  
    createdAt: Date.now ,
    // creator: [{type: String, required: false}],       
    appointmentDate:req.body.appointmentDate,
    isBooked: false,
    };
    let collection = await db.collection("files");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        patientNumber: req.body.patientNumber,
        patientName: req.body.patientName,
        phoneNumber: req.body.phoneNumber,     
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender, 
        viralLoad: req.body.viralLoad, 
        visitDate:req.body.visitDate,  
        appointmentDate:req.body.appointmentDate,
      },
    };

    let collection = await db.collection("files");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("files");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;
