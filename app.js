
var express  = require("express"),
    app  = express(),
    ejs = require('ejs'),

    http = require("http").Server(app);

var bodyParser = require('body-parser'); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use("/css", express.static("./css"))
app.use("/js", express.static("./js"))
app.use("/images", express.static("./images"))
app.use("/js", express.static(__dirname + '/js'));
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' })


var cloudinary = require('cloudinary');
cloudinary.config({ 
    cloud_name: 'negus-multimedia', 
    api_key: '637251865825622', 
    api_secret: 'kAH4rstb_Jequha77g30DsKlfNc' 
  });



const mongoose = require('mongoose');
mongoose.connect('mongodb://jodi:negus1234@ds163905.mlab.com:63905/heroku_40lf7bqf', {useNewUrlParser: true});
var mondb = mongoose.connection;
mondb.on('error', console.error.bind(console, 'connection error:'));
mondb.once('open', function() {
// we're connected!
console.log('We are connected');
});
  
var attachmentSchema  = new mongoose.Schema({

    title:  String,
    client:   String,
    description: String,
    datetaken: {type: Date},
    date: { type: Date, default: Date.now },
    category: String,
    file: String,
    image:  { data: Buffer, contentType: String }

  });
var Attachment = mongoose.model('Attachment', attachmentSchema);


user = {};
username= "negus";
password = "admin1234";
loggedin = false;
//const adsRoutes  = require('./api/routes/ads');
//app.use('/ads', adsRoutes)

//const authRoutes  = require('./api/routes/auth');
//app.use('/auth', authRoutes)

// set the view engine to ejs

app.set('view engine', 'ejs');


// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    res.render('pages/landing-page');
});
// index page 
app.get('/home', function(req, res) {
    res.render('pages/index');
});

// work page 
app.get('/work', function(req, res) {
    res.render('pages/work');
});
console.log("Server started");

app.get("/contact", function(req, res) {
    res.sendFile(__dirname + "/contact.html")
   })



//graphics page
app.get('/graphics', function(req, res){
    res.render('pages/graphics');
})

//photography page
app.get('/photography', function(req, res){
    res.render('pages/photography');
})


//photography pages

app.get('/photography/corporate', function(req, res){
    Attachment.find({category: 'corporate' },  function (err, posts) {
        if (err) return console.error(err);
        res.render('pages/photography/corporate', {
            posts : posts,
          });

      });
})
app.get('/photography/weddingsandengagements', function(req, res){
    Attachment.find({category: 'weddings' },  function (err, posts) {
        if (err) return console.error(err);
        res.render('pages/photography/weddings', {
            posts : posts,
          });

      });
})
app.get('/photography/events', function(req, res){
    Attachment.find({category: 'events' },  function (err, posts) {
        if (err) return console.error(err);
        res.render('pages/photography/events', {
            posts : posts,
          });

      });
})
app.get('/photography/portraits', function(req, res){
    Attachment.find({category: 'portraits' },  function (err, posts) {
        if (err) return console.error(err);
        res.render('pages/photography/portraits', {
            posts : posts,
          });

    });
})

app.get('/photography/promotional', function(req, res){
    Attachment.find({category: 'promotional' },  function (err, posts) {
        if (err) return console.error(err);
        res.render('pages/photography/promotional', {
            posts : posts,
          });

    });
})
app.get('/photography/other', function(req, res){
    Attachment.find({category: 'other' },  function (err, posts) {
        if (err) return console.error(err);
        res.render('pages/photography/other', {
            posts : posts,
          });

    });
})


// graphics pages

app.get('/graphics/logos', function(req, res){
    Attachment.find({category: 'logos' },  function (err, posts) {
        if (err) return console.error(err);
        res.render('pages/graphics/logos', {
            posts : posts,
          });

      });
   // res.render('pages/graphics/logos');
})
app.get('/graphics/flyers', function(req, res){
    Attachment.find({category: 'flyers' },  function (err, posts) {
        if (err) return console.error(err);
        res.render('pages/graphics/flyers', {
            posts : posts,
          });

      });
})
app.get('/graphics/business-cards', function(req, res){
    Attachment.find({category: 'business-cards' },  function (err, posts) {
        if (err) return console.error(err);
        res.render('pages/graphics/business-cards', {
            posts : posts,
          });
    })
})
app.get('/graphics/prints', function(req, res){
    Attachment.find({category: 'print' },  function (err, posts) {
        console.log('prints',posts )
        if (err) return console.error(err);
        res.render('pages/graphics/prints', {
            posts : posts,
          });
    })
})
app.get('/graphics/ads', function(req, res){
    Attachment.find({category: 'ads' },  function (err, posts) {
        if (err) return console.error(err);
        res.render('pages/graphics/ads', {
            posts : posts,
          });
    })
})
app.get('/graphics/other', function(req, res){
    Attachment.find({category: 'other-design' },  function (err, posts) {
        if (err) return console.error(err);
        res.render('pages/graphics/other', {
            posts : posts,
          });
    })
})


//cinemography

app.get('/videography', function(req, res){
    res.render('pages/cinemography');
})


//admin


app.get('/admin/login', function(req, res){
    res.render('pages/admin/login');

})

app.post('/admin/signin', function(req, res) {
    console.log("usernmae", req.body );
    console.log("pass", req.body.password)
    if (username == req.body.username && password == req.body.password){
        loggedin = true;
        res.redirect('/admin/post/create');

    } else{
        res.redirect('/admin/login');
    }
 });

 app.get('/admin/post/create', function(req, res){
    res.render('pages/admin/createpost');

})


app.post('/admin/post/manage', function(req, res) {
    console.log("req.body.category", req.body)
    if (req.body.category == "all") {
        Attachment.find( function (err, posts) {
            if (err) return console.error(err);
            res.render('pages/admin/managepost', {
                posts : posts,
                category: req.body.category
              });
    
          });
    } else{
        Attachment.find({category: req.body.category },  function (err, posts) {
            if (err) return console.error(err);
            res.render('pages/admin/managepost', {
                posts : posts,
                category: req.body.category
              });
    
          });
    }
 
 });


 app.get('/admin/post/create', function(req, res){
    if (loggedin){
        res.render('pages/admin/createpost');
    } else {
        res.redirect('/admin/login');
    }
  

})

app.get('/admin/post/delete/:id', function(req, res){
   
    if (loggedin){
        var id = req.params.id
        console.log("ID," , id)
        Attachment.deleteOne({ _id:  id }, function (err) {
            if (err) return handleError(err);
            // deleted at most one tank document
            console.log("deleted!")
          });
          res.redirect('/admin/post/manage');
    } else {
        res.redirect('/admin/login');
    }
  

})


app.post('/admin/uplaod ', function(req, res) {
  
    Attachment.find({category: req.body.category },  function (err, posts) {
        if (err) return console.error(err);
        
        res.render('pages/admin/managepost', {
            posts : posts,
          
          });

      });
})
app.post('/admin/upload', upload.single('file'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    } else{
        console.log("Got file")
    }

    //upload image to cloudinary 
    cloudinary.v2.uploader.upload(file.path, 
    function(error, result) {
        console.log(result, error)
        var secure_url = result.secure_url
        // upload to db form data and secure url
        console.log('secure_url', secure_url);
        var post = new Attachment({ title: req.body.title , client: req.body.client, datetaken: req.body.date, description: req.body.description, category: req.body.category, file: secure_url});
        post.save(function (err, fluffy) {
            if (err) return console.error("We didnt save", err);
            console.log("We saved!");
          });

    });
    res.redirect('/admin/post/manage');


})

app.get('/admin/post/manage', function(req, res){
   
      if (loggedin){
        Attachment.find( function (err, posts) {
            if (err) return console.error(err);
            res.render('pages/admin/managepost', {
                posts : posts,
                category: ""
              });
    
          });
    } else {
        res.redirect('/admin/login');
    }
    
})

app.get('/admin/logout', function(req, res) {

    loggedin=false;
    res.redirect('/admin/login');
})

app.get('/blog', function(req, res) {

    res.render('pages/blog');
})
app.get('/albums', function(req, res) {

    res.render('pages/albums');
})
app.get('/aboutus', function(req, res) {
    res.render('pages/about');
   
})
app.get('/contactus', function(req, res) {
    res.render('pages/contact');

   

})
app.get('/landing', function(req, res) {
    res.render('pages/home-landing-fades');

})
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ${port}'));