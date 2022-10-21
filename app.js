const fs = require("fs");
require("dotenv").config();
const express = require("express");
const https = require("https");
const cheerio = require("cheerio");
const { parse } = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const hisCity = req.body.cityName;
  const query = hisCity.charAt(0).toUpperCase() + hisCity.slice(1);

  const unit = "metric";

  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    process.env.MYKey +
    "&units=" +
    unit;

  https.get(url, function (response) {
    // console.log("this is the status code: ", response.statusCode);

    response.on("data", function (data) {
      try {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";



        res.write(`<!DOCTYPE html>
     <html lang="en">
     <head>
         <meta charset="UTF-8">
         <meta http-equiv="X-UA-Compatible" content="IE=edge">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         

         <title>Weather App</title>
         <link rel="icon" href="cloudy.png">
         <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
     
         <style>


      body{
         background-color: #C8B7ED;
         font-family: Poppins;
     }
     
     #location {
        font-size: 50px;
     }
     
     #degrees {
        font-size: 50px;
        color: #9170DB;
     }
     
     
     .container {
         display: flex;
         justify-content: center;
         align-items: center;
         flex-direction: column;
         margin-top: 5% !important;
         width: 600px;
         height: 550px;
        margin: auto;
         background-color: #EAE2F9;
         border-radius: 3%;
        
     }

     a{ 
      width: 30%;
      }
     

        button {
          background-color: white;
          font-weight: 10px;
          color: black;
          padding: 14px 20px;
          margin: 30px 30px 30px 45px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        
        button:hover {
          background-color: #9170db;
          color: white;
        }

         </style>
         
     </head>
     <body>
         
        
         <div class="container">

         <h1 id="location"> 
         ${query}</h1>

         <img src="${imageURL}" alt="icon" height="130px" width="130px">

             <h4>
             ${description}
             </h4>

             <h1 id="degrees">${temp} °C</h1>

             <a href="/"> <button type="submit">Back</button> </a> 
     
         </div>

         
     
     </body>
     </html>`);
      } catch (error) {
        res.write(`<!DOCTYPE html>
    <html lang="en">
    <head>
    
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="refresh" content="15"; url='/'" />
        <title>Weather App</title>
        <link rel="icon" href="cloudy.png">
        <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
    
        <style>

    body{
      background-color: #3b6175;
      font-family: poppins;
      color: #c4bfa2;
    }
    
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-top: 5%;
    }

    a{ 
      padding: 0 0;
      width: 15%;
      margin-left: 3%;
        }
     

        button {
          
          background-color: white;
          font-weight: 10px;
          color: black;
          padding: 14px 20px;
          margin: 30px 30px 30px 45px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        
        button:hover {
          background-color: #81C6E8;
          color: white;
        }

        </style>
        
    </head>
    <body>
    <div class="container">

    <img src="page-not-found.png" width="200px" />

    <h1 > 
       Uh Oh! </h1> 

        <h1> 
            City not found, you will shortly be redirected to the home page </h1> 

            <a href="/"> <button type="submit">Back</button> </a>    

        </div>
    
    </body>
    </html>`);
      }

      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log("Server is up and running!");
});
