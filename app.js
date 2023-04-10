const express = require("express");
const bodyParser = require("body-parser");
const https = require('https');

const client = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});


app.post("/",function(req,res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;


  client.setConfig({
    apiKey: "8ded5a1344bc00cae0df5b546d03820d-us12",
    server: "us12",
  });
  
  const run = async () => {
    const response = await client.lists.batchListMembers("413121375b", {
      members: [{
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }],
    });
    if(response.error_count == 0){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+ "/failure.html");
    }
  };
  
  run();
});

app.post("/failure",function (req,res){
  res.redirect("/");
});



app.listen(process.env.PORT || 3000,function(){
  console.log("server started at 3000");
});

