var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var app = express();
var cors = require('cors');

var port = 3002;

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

mongoose.connect(
	"mongodb+srv://vadym:vadym@cluster0-4uqci.mongodb.net/common?retryWrites=true&w=majority",
	{ useNewUrlParser: true }
);
var MyModel = mongoose.model("cars", new Schema({}));


app.get("/todos", async function(req, res, next){
	MyModel.findById('5d2892911c9d44000053254a', function(error, result) {
		res.json(result);
	});
});

app.post("/todos", async function(req, res, next) {
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
app.put("/todos/:id", function(req, res, next){
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

app.listen(port, function(){
	console.log("Server running on port", port);
});
