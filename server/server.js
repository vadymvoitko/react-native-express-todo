var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var app = express();
var cors = require('cors');

var port = 3000;

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

mongoose.connect(
	"mongodb+srv://vadym:vadym@cluster0-4uqci.mongodb.net/common?retryWrites=true&w=majority",
	{ useNewUrlParser: true }
);
var todoSchema = new Schema({
  name: String,
  description: String,
  status: String
});
var MyModel = mongoose.model("cars", todoSchema);


app.get("/todos", async function(req, res, next){
	MyModel.find((error, result) => {
		res.json(result);
	});
});

app.post("/todos", async function(req, res, next) {
	console.log('asfda')
	var upd = req.body.data;
	if (!upd) {
		res.status(400);
		res.json({
			error: "Bad data"
		});
	} else {
        var newTodo = new MyModel(upd);
        newTodo.save((err, todo) => {
          if (!err) res.send(todo).status(204);
        });
	}
});

app.delete("/todos/:id", (req, res) => {
  // console.log(req.params.id);
  MyModel.deleteOne({
    _id: req.params.id
  }, (err, resp) => {
    if (err) console.log(err);
    else if (resp.ok) res.send(req.params.id).status(201);
  })
})
app.put("/todos/:id", function(req, res){
    console.log(req.body.data);
    const { description } = req.body.data;
	if (!description){
		res.status(400);
		res.json({
			"error":"Bad Data"
		});
	} else {
        MyModel.updateOne({ _id: req.params.id }, { $set: { description } }, function(err, updatedTodo){
			if (err){
				res.send(err).status(400);
			}
			if (updatedTodo){
                MyModel.findOne({
                    _id: req.params.id
                }, (err, todo) => {
                    if (err){
                        res.send(err).status(400);
                    }
                    res.json(todo).status(204);
                })
			}
		});
	}
});

app.listen(port, function(){
	console.log("Server running on port", port);
});
