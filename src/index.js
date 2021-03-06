const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const request = require("request");
const app = express();
const port = process.env.PORT || 8000;

console.log(path.join(__dirname, "../puclic"));
const static_path = path.join(__dirname, "../puclic");
app.use(express.static(static_path));
const temp_path = path.join(__dirname, "../templates/views");
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", temp_path);

app.get("/", (req, res) => {
    res.render("index");
    // res.end();
    // res.send("DASAADS")
});

app.post('/', (req, res) => {
    const city = req.body.send;
    request(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=e500e16c6e7a46f7da2ce99ac36b9ac6`, (err, resp) => {
        if (err) {
            res.status(404).render('404', {
                err: "Server Error"
            });
        } else {

            let B = JSON.parse(resp.body);
            if (B.cod == '404') {
                // console.log("error");
                res.status(404).render('404', {
                    err: "Invalid City Name"
                });
            } else {
                let weather = `http://openweathermap.org/img/w/${B.weather[0].icon}.png`;
                let DW = "Night";
                // let weather = "Pictures/clouds.png";
                let DN = weather.includes("d");
                if (B.weather[0].main == "Smoke") {
                    weather = "Pictures/wind.png";
                } else if (B.weather[0].main == "Rain") {
                    weather = "Pictures/rainy.png";
                } else if (B.weather[0].icon == "01d") {
                    weather = "Pictures/sunny.png";
                } else if (B.weather[0].icon == "01n") {
                    weather = "Pictures/night.png";
                } else if (B.weather[0].main == "Clouds") {
                    weather = "Pictures/clouds.png";
                } else if (B.weather[0].main == "Haze") {
                    weather = "Pictures/haze.png";
                } else if (B.weather[0].main == "Drizzle") {
                    weather = "Pictures/drizzle.png";
                } else if (B.weather[0].main == "Thunderstorm") {
                    weather = "Pictures/thunderstorm.png";
                }

                if (DN == true) {
                    DW = "Day";
                }
                res.render('weather', {
                    a1: B,
                    a2: weather,
                    a3: DW,
                    a4: B.weather[0].main
                });
            }
        }
    });

});

app.listen(port, () => {
    console.log(`RUN ${port}`)
});