const express = require("express");
const Person = require("./person/person");
const app = express();

const mongoose = require("mongoose");
const { countDocuments } = require("./person/person");

const dbConnect = async (req, res) => {
  try {
    await mongoose.connect(
      "mongodb+srv://ghassen:23671567@projetfinale.zghrtfp.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("successfully connected");
  } catch (error) {
    console.log("error connecting");
  }
};
dbConnect();
app.use(express.json());

app.post("/person", (req, res) => {
  const person = new Person(req.body);
  person.save(() => {
    console.log("person saved");
  });
  res.send({ person: person, msg: "added" });
});

const arrayOfPeople = [
  {
    name: "talel",
    age: 29,
    favoriteFoods: ["shawarma", "loubia"],
  },
  {
    name: "iheb",
    age: 29,
    favoriteFoods: ["shawarma", "loubia"],
  },
  {
    name: "omar",
    age: 29,
    favoriteFoods: ["shawarma", "loubia"],
  },
  {
    name: "ahmed",
    age: 29,
    favoriteFoods: ["shawarma", "loubia"],
  },
];

app.post("/persons", (req, res) => {
  var createManyPeople = function (arrayOfPeople, done) {
    Person.create(arrayOfPeople, (error, createdPeople) => {
      if (error) {
        done(error);
      } else {
        done(null, createdPeople);
      }
    });
  };
  createManyPeople(arrayOfPeople, (err, data) => res.send(data));
});

app.get("/all", async (req, res) => {
  try {
    await Person.find({}).then((result) => {
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/person/:food", async (req, res) => {
  try {
    await Person.findOne({ favoriteFoods: req.params.food }).then((result) => {
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/persons/:personid", async (req, res) => {
  try {
    console.log(req.params);
    const result = await Person.findById({ _id: req.params.personid });

    console.log(result);
    res.send(result);
  } catch (error) {}
});
const foodToAdd = "burritos";

app.get("/addfood/:personid", async (req, res) => {
  try {
    await Person.findById({ _id: req.params.personid }, (err, result) => {
      console.log(result);
      if (err) {
        console.log(err);
      } else {
        result.favoriteFoods.push(foodToAdd);
        result.save();
      }
    });
  } catch (error) {}
});

const newAge = 20;
app.get("/personName/:name", async (req, res) => {
  try {
    await Person.findOneAndUpdate(
      { name: req.params.name },
      { age: newAge },
      { new: true },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          result.save();
          res.send(result);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/remove/:personid", async (req, res) => {
  try {
    await Person.findByIdAndRemove(
      { _id: req.params.personid },
      (err, person) => {
        if (err) {
          console.log(err);
        } else {
          person.save();
          res.send(person);
        }
      }
    );
  } catch (error) {}
});
app.get("/removeMany/:name", async (req, res) => {
  try {
    await Person.remove({ name: req.params.name }, (err, personRemoved) => {
      if (err) {
        console.log(err);
      } else {
        person.save();
        res.send(personRemoved);
      }
    });
  } catch (error) {}
});

app.get("/search/:food", (req, res) => {
  Person.find({ favoriteFoods: req.params.food })
    .sort({ name: 1 })
    .limit(2)
    .select({ age: 0 })
    .exec((err, data) => {
      err ? console.log(err) : res.send(data);
    });
});

app.listen(5000, (err) => {
  err ? console.log(err) : console.log("listening on port 5000...");
});
