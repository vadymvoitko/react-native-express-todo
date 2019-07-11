var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect(
  "mongodb+srv://vadym:vadym@cluster0-4uqci.mongodb.net/common?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
var MyModel = mongoose.model("cars", new Schema({ opel: String, mers: String }));// in Schema you describe which fileds  you gonna have
// MyModel.update({ mers: "600" });



// const mmodel = new MyModel({name: 'hui'});
// mmodel.save((err) => {

// })

// Works
// console.log(MyModel);

// var db;
// const MongoClient = require("mongodb").MongoClient;
// const uri =
//   "mongodb+srv://vadym:vadym@cluster0-4uqci.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("common").collection("cars");
//   // perform actions on the collection object
//   db = collection;
//   client.close();
// });

// var db = mongojs(
//   "mongodb+srv://vadym:vadym@cluster0-4uqci.mongodb.net/common", ["cars"]
// );

// mongodb://eman:eman@ds163181.mlab.com:63181/taxiapp", ["bookings"]

router.get("/bookings", async function(req, res, next){
  // await MyModel.update({ mers: "600" });
  MyModel.findById('5d0e2799776b997b56428fd4', function(error, result) {
    res.json(result);
  });
	// db.cars.find(function(err, bookings){
	// 	if(err){
	// 		res.send(err);
	// 	}
	// 	res.json(bookings);
  // })
  // console.log(MyModel);
  // res.end('end');
}); 

router.post("/bookings", async function(req, res, next) {
  var upd = req.body.data;
  
  if (!upd) {
    res.status(400);
    res.json({
      error: "Bad data"
    });
  } else {
    await MyModel.updateOne(upd);
    // res.status(204);
    MyModel.findById('5d0e2799776b997b56428fd4', function(error, result) {
      res.json(result);
    });
  }
});

// Driver  Update Booking done on driver side
router.put("/bookings/:id", function(req, res, next){
    var io = req.app.io;
    var booking = req.body;
    if (!booking.status){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    } else {
        db.bookings.update({_id: mongojs.ObjectId(req.params.id)},{ $set: { 
        	driverId: booking.driverId,
        	status: booking.status 
        }}, function(err, updatedBooking){
        if (err){
            res.send(err);
        }
        if (updatedBooking){
            //Get Confirmed booking
            db.bookings.findOne({_id:  mongojs.ObjectId(req.params.id)},function(error, confirmedBooking){
                if (error){
                    res.send(error);
                }
                res.send(confirmedBooking);
                io.emit("action", {
                    type:"BOOKING_CONFIRMED",
                    payload:confirmedBooking
                });
            });
        }
    });
    }
});

module.exports = router;
