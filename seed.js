var mongoose = require("mongoose");
var campground = require("./models/campgrounds");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        price: "3.0",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        }
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        price: "3.0",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff71",
            username: "Jill"
        }
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        price: "3.0",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff77",
            username: "Jane"
        }
    }
];
var commentData=[{
    text: "This is an Awesome place",
    author:{
        id: "588c2e092403d111454fff77",
        username: "Jack"
    }    },
    {
        text: "This is an Good place",
        author:{
            id: "588c2e092403d111454fff78",
            username: "Jack 2"
        }    }

];
 
function seedDB(){
    data.forEach(function(seed){
        campground.create(seed, function(err, campground){
            if(err){
                console.log(err);
            }
            else{
                console.log("Campground Created!!");
                commentData.forEach(function(comm){
                    Comment.create(comm, function(err, comment){
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log("Comment Created!!");
                        }
                    })
                })
            }
        })
    })

}
   //Remove all campgrounds
//    campground.deleteMany({}, function(err){
        // if (err){
        //     console.log(err);
        // }
        // console.log("removed campgrounds!");
        // Comment.deleteMany({}, function(err) {
        //     if (err){
        //         console.log(err);
        //     }
        //     console.log("removed comments!");
        //     //add a few campgrounds
        //     data.forEach(function(seed){
        //         campground.create(seed, function(err, campground){
        //             if(err){
        //                 console.log(err)
        //             } else {
        //                 console.log("added a campground");
        //                 //create a comment
        //                 Comment.create(
        //                     {
        //                         text: "This place is great, but I wish there was internet",
        //                         author:{
        //                             id : "588c2e092403d111454fff76",
        //                             username: "Jack"
        //                         }
        //                     }, function(err, comment){
        //                         if(err){
        //                             console.log(err);
        //                         } else {
        //                             campground.comments.push(comment);
        //                             campground.save();
        //                             console.log("Created new comment");
        //                         }
        //                     });
        //             }
        //         });
        //     });
        // })
    // }); 
    //add a few comments
// }
 
module.exports = seedDB;