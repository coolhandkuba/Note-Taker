const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const http = require("http");

function writeToDB(notes){
    notes = JSON.stringify(notes);
    console.log (notes);
    fs.writeFileSync("./db/db.json", notes, function(err){
        if (err) {
            return console.log(err);
        }
    });
}

const PORT = process.env.PORT || 8000;

let notesData = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});

app.get("/notes", (req, res) => {

    res.sendFile(path.join(__dirname, "public/notes.html"));
    console.log("Your Notes!");
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
    console.log("Your index!");
})

app.get("/api/notes", (req, res) => {
    return res.json(notesData);
  })

app.post("/api/notes", (req, res) => {

    if (notesData.length == 0){
        req.body.id = "0";
    } else{
        req.body.id = JSON.stringify(JSON.parse(notesData[notesData.length - 1].id) + 1);
    } 
    console.log("req.body.id: " + req.body.id);
    notesData.push(req.body);
    writeToDB(notesData);
    console.log(notesData);
    res.json(req.body);
});

app.delete("/api/notes/:id", (req, res) => {    
    let id = req.params.id.toString();
    console.log(id);
    for (i=0; i < notesData.length; i++){
       
        if (notesData[i].id == id){
            console.log("match!");
            res.send(notesData[i]);
            notesData.splice(i,1);
            break;
        }
    }
    writeToDB(notesData);
});

