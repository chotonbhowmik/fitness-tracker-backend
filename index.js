const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yfa2q3o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db("fitnessTracker").collection("users");
    const trainerCollection = client
      .db("fitnessTracker")
      .collection("trainers");
    const newsletterCollection = client
      .db("fitnessTracker")
      .collection("newsletter");
    const classCollection = client.db("fitnessTracker").collection("classes");
    const forumCollection = client.db("fitnessTracker").collection("forums");
    const paymentCollection = client.db("fitnessTracker").collection("payment");
    const slotCollection = client.db("fitnessTracker").collection("slot");

    // user api start from here
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("Received user data:", user);
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.get("/alluser", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.patch("/users/alluser/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: "trainer",
        },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.res.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
     app.patch("/users/alltrainer/:id", async (req, res) => {
       const id = req.params.id;
       const filter = { _id: new ObjectId(id) };
       const updatedDoc = {
         $set: {
           role: "trainer",
           status: "complete",
         },
       };
       const result = await trainerCollection.updateOne(filter, updatedDoc);
       res.send(result);
     });
     app.patch("/users/delete/:id", async (req, res) => {
       const id = req.params.id;
       const filter = { _id: new ObjectId(id) };
       const updatedDoc = {
         $set: {
           role: "user",
           status: "pending",
         },
       };
       const result = await trainerCollection.updateOne(filter, updatedDoc);
       res.send(result);
     });


    // user api start end here

    app.post("/addtrainer", async (req, res) => {
      const addTrainer = req.body;
      const result = await trainerCollection.insertOne(addTrainer);
      res.send(result);
    });

    app.get("/alltrainer", async (req, res) => {
      const query = { status: "complete" };
      const cursor = trainerCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/alltrainer/pending", async (req, res) => {
      //  const pendingStatus = "pending";
      const query = { status: "pending" };
      const cursor = trainerCollection.find(query);
      const trainers = await cursor.toArray();
      res.send(trainers);
    });

    app.get("/alltrainer/complete", async (req, res) => {
      const query = { status: "complete" };
      const cursor = trainerCollection.find(query);
      const allTrainer = await cursor.toArray();
      res.send(allTrainer);
    });

   
    app.get("/alltrainer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await trainerCollection.findOne(query);
      res.send(result);
    });

    app.post("/newsletter", async (req, res) => {
      const addTrainer = req.body;
      const result = await newsletterCollection.insertOne(addTrainer);
      res.send(result);
    });
    app.get("/allnewsletter", async (req, res) => {
      const cursor = newsletterCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/addclass", async (req, res) => {
      const addTrainer = req.body;
      const result = await classCollection.insertOne(addTrainer);
      res.send(result);
    });

   

    app.post("/addforum", async (req, res) => {
      const addForum = req.body;
      const result = await forumCollection.insertOne(addForum);
      res.send(result);
    });
     app.get("/allclass", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const skip = (page - 1) * limit;
      try {
        const cursor = classCollection.find().skip(skip).limit(limit);
        const total = await classCollection.countDocuments();
        const response = await cursor.toArray();
        res.json({
          response,
          total,
          page,
          pages: Math.ceil(total / limit),
        });
      } catch (error) {
        res.status(500).json({ error: "Server error" });
      }
     });

    app.get("/allforum", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const skip = (page - 1) * limit;
      try {
        const cursor = forumCollection.find().skip(skip).limit(limit);
        const total = await forumCollection.countDocuments();
        const forums = await cursor.toArray();
        res.json({
          forums,
          total,
          page,
          pages: Math.ceil(total / limit),
        });
      } catch (error) {
        res.status(500).json({ error: "Server error" });
      }
    });

// payment api
app.post("/payment", async (req, res) => {
  const paymentData = req.body;
  const result = await paymentCollection.insertOne(paymentData);
  res.send(result);
});

 

 app.get("/getpaymentdata", async(req,res) => {
  const cursor = paymentCollection.find();
  const response = await cursor.toArray();
  res.send(response);
 })
// slot api
  app.post("/addslot", async (req, res) => {
    const addSlotData = req.body;
    const result = await slotCollection.insertOne(addSlotData);
    res.send(result);
  });
  
 app.get("/allslot", async (req, res) => {
   const cursor = slotCollection.find();
   const response = await cursor.toArray();
   res.send(response);
 });
 app.delete("/slot/:id", async (req, res) => {
   const id = req.params.id; // Corrected
   const query = { _id: new ObjectId(id) };
   const result = await slotCollection.deleteOne(query);
   res.send(result);
 });














    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("app is running fine");
});
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
