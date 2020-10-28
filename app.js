var express = require("express");
var app = express();
var mongoose=require('mongoose');
var passport=require("passport");
var flash=require("connect-flash");
var methodOverride=require("method-override");
var LocalStrategy=require("passport-local");
var user=require("./models/user");
var bodyparser=require("body-parser");
var campground=require("./models/campgrounds.js");
var Comment=require("./models/comment");
var seedDB=require("./seed");
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
const PORT=process.env.PORT || 3000;

mongoose.connect("mongodb+srv://rajat456bansal:*******@cluster0-w5iyn.mongodb.net/", {dbName: 'yelp_camp', useNewUrlParser: true, useUnifiedTopology: true});
// seedDB();

app.use(require("express-session")({
	secret: "This is another dog",
	resave: false,
	saveUninitialized: false
}));
app.use(flash());
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(function(req, res, next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

app.get("/", function(req, res){
	res.render("landing");
})
app.get("/campgrounds", isLoggedIn, function(req, res){
	campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds",{campgrounds:allCampgrounds, currentUser: req.user});
		}
	})
	
});
app.post("/campgrounds", isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var price=req.body.price;
	var description=req.body.description;
	var author={
		id: req.user._id,
		username: req.user.username
	};
	var newCamp = {name:name, image:image, description:description, price: price, author: author};
	
	campground.create(newCamp, function(err, newCamp){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
		}
	})
	
});
app.get("/campgrounds/new", isLoggedIn, function(req, res){
	res.render("news");
});
app.get("/campgrounds/:id",  isLoggedIn, function(req, res){
	// var author={
	// 	id: req.user._id,
	// 	username: req.user.username
	// }
	campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			res.render("show", {campgrounding: foundCampground});
		}
	});
});
app.get("/campgrounds/:id/comments/new",  isLoggedIn, function(req, res){
	campground.findById(req.params.id,function(err, campground){
		if(err){
			console.log("/campgrounds/:id/comments");
		}
		else{
			res.render("newComment", {campground: campground});
		}
	})
});
app.post("/campgrounds/:id/comments", function(req, res){
	campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
					res.redirect("/campgrounds");
				}
				else{
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					campground.comments.push(comment);
					comment.save();
					campground.save();
					res.redirect("/campgrounds/"+campground._id);
				}
			})
		}
	})
});
app.get("/register", function(req, res){
	res.render("register");
});
app.post("/register", function(req, res){
	var newUser=new user({username: req.body.username});
	user.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});
app.get("/login", function(req, res){
	res.render("login");
});
app.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res){

});
app.get("/logout", function(req, res){
	req.logOut();
	req.flash("success","Logged you out!");
	res.redirect("/");
})
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login First");
	res.redirect("/login");
};
app.get("/campgrounds/:id/edit", checkAuthorization, function(req, res){
		campground.findById(req.params.id, function(err, foundCampground){
				res.render("edit", {campground: foundCampground});
			});	
});
app.put("/campgrounds/:id", checkAuthorization, function(req, res){
	campground.findByIdAndUpdate(req.params.id , req.body.campground , function(err, updatedCamp){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	})
});
app.delete("/campgrounds/:id", checkAuthorization,function(req, res){
	campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounnds");
		}
		else{
			res.redirect("/campgrounds");
		}
	})
});
app.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentAuthorization, function(req, res){
	Comment.findById(req.params.comment_id, function(err, comment){
		if(err){
			console.log(err);
		}
		else{
	res.render("edit_comment", {campground_id: req.params.id, comment:comment});
		}
	});
});
app.put("/campgrounds/:id/comments/:comment_id", checkCommentAuthorization, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
				if(err){
					console.log(err);
					res.redirect("back");
				}
				else{
					res.redirect("/campgrounds/"+req.params.id);
				}
			})
	});
app.delete("/campgrounds/:id/comments/:comment_id", checkCommentAuthorization, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.log(err);
			res.redirect("/campgrounds/"+req.params.id);
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});
function checkAuthorization(req, res, next){
	if(req.isAuthenticated()){
		campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				res.redirect("back")
				}
			else{
				if(foundCampground.author.id.equals(req.user._id)){
				next();
			}
				else{
						res.redirect("back");
					}
			}
		})
	}
	else{
		res.redirect("back");
	}	
}
function checkCommentAuthorization(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back")
				}
			else{
				if(foundComment.author.id.equals(req.user._id)){
				next();
			}
				else{
						res.redirect("back");
					}
			}
		})
	}
	else{
		res.redirect("back");
	}	
}
app.listen(PORT, ()=>{
	console.log("The Yelp Camp Server has started");
});
