var express = require("express"),
mongoose    = require("mongoose"),
bodyParser  = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
app         = express();


//setup mongoose db
mongoose.connect("mongodb://localhost/restful_blog_app");


//APP CONFIG
app.set("view engine", "ejs");  //setup to read ejs file
app.use(express.static ("public"));  //setup to use external css file
app.use(bodyParser.urlencoded({extended: true})); //setup to get data from forms
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//BLOG CONFIG --create database Schema & Model
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

Blog.create({
    title: "My Makeup Blog",
    image: "https://lh3.googleusercontent.com/ZZHFbJevlIrjg8ZASH3h9RkAkQUbTQOT2e4xANpa6iDbb8j7SOvX8UT5QtAseWjyQP8_=w300",
    body: "Sugar plum danish bonbon icing jelly beans tootsie roll dessert jelly-o wafer. Donut icing liquorice dessert topping dragée marzipan chupa chups jelly-o. Tootsie roll cheesecake gingerbread pudding. Topping bear claw chocolate bar gingerbread icing macaroon liquorice. Donut oat cake lollipop candy canes sweet gingerbread lollipop toffee. Dragée pastry candy canes ice cream sweet chupa chups macaroon gummi bears gummies. Fruitcake jelly beans apple pie sesame snaps liquorice halvah carrot cake tootsie roll tiramisu."
});

//RESTful ROUTES CONFIG

//Index ROUTE
app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Oh No. ERROR!!!");
        } else{
            res.render("index", {blogs: blogs});
        }
    });
    
});

//RESTFUL NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//RESTFUL CREATE ROUTE
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitizer(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else{
            res.redirect("/blogs");
        }
    });
});

//RESTFUL SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show", {blog: foundBlog});
            //res.json(blogs);
        }
    });
});


//RESTFUL EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    //req.body.blog.body = req.sanitizer(req.body.blog.body);
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
             res.render("edit", {blog: foundBlog});
            
        }
    }); 
});

//RESTFUL UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    //req.body.blog.body = req.sanitizer(req.body.blog.body);   
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }       
    });
    // res.send("Route Updated");
});

//RESTFUL DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    });
});



//Setup app to listen to changes
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The RESTful Blog App is Running!!!");
});