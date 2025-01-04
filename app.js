
import express from 'express';
import bodyParser from 'body-parser';
import mongoose, { Schema } from 'mongoose';
import ejs from 'ejs'
import _ from 'lodash';
// const date = require(__dirname + "/date.js");

const app = express();

// var items = [];
// let workItems = []; local temp save point

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

await mongoose.connect('mongodb+srv://admin-chuks:Test123@cluster0.uxz3u.mongodb.net/todolistDB');

const todolistSchema = new mongoose.Schema({
    name: String
});
const Todolist = mongoose.model("item",todolistSchema);

const item1 =  new Todolist({
    name: "Welcome to your TodoList"
})
const item2 =  new Todolist({
    name: "Hit the + button to add new items"
})
const item3 =  new Todolist({
    name: "<-- hit this to delete item"
})
const defaultItems = [item1,item2,item3];


const listSchema = new mongoose.Schema({
    name: String,
    items: [todolistSchema]
})

const List = new mongoose.model("list", listSchema );



// const docs = await Todolist.insertMany(defaultItems)
// USED TO INSET IN TO DB



app.get("/" , async function (req , res){
   
//    let day = date.getDay(); 

    const foundItems = await Todolist.find({});
    // console.log(foundItems);

    if(foundItems.length === 0){
        await Todolist.insertMany(defaultItems)
        res.redirect("/")
    }else{
        res.render("list", //all rendering must be places at the same variable object name.
            {   listTitle: "Today",
                newListItems: foundItems // without global will cuz the value to be replace per entry
            
            });
    }
  
});

app.post("/", async function(req , res){
    
    
    const itemName = req.body.newItem; // input
    const listName = req.body.list; //click of button
    //  collecting value from the form
console.log(listName)
    const item = new Todolist({
            name: itemName 
            //use to append  founditems into the todolist checkbox
    })
    
    if (listName === "Today"){
        await item.save();
        res.redirect("/");
    }else{
        const foundList = await List.findOne({name: listName}); // if you have alrady rendered acreated a custom params
        console.log(foundList);
        foundList.items.push(item); //push to list document
        await foundList.save();
        res.redirect("/" + listName);
    };

    
   
});


app.get("/:customList", async function(req , res){
    
    const customList = _.capitalize(req.params.customList);

    

   const foundList = await List.findOne({name:  customList})
    if (!foundList){
         const list1 = new List ({
        name: customList,
        items:  defaultItems
        });
        list1.save()
        res.redirect("/" + customList)
    }else{
        res.render("list", //all rendering must be places at the same variable object name.
            {   listTitle: foundList.name,
                newListItems: foundList.items // without global will cuz the value to be replace per entry
            
            });
    }

   
});

app.post("/delete", async function(req , res){
    
    const deleteItem = req.body.delete;
    const  listName= req.body.listName;

    if (listName === "Today"){
        await Todolist.findByIdAndDelete(deleteItem)
        res.redirect("/");
    }else{
    const foundList = await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: deleteItem}}})

    res.redirect("/" + listName);
    }


    
})
// app.post("/:customList", async function(req , res){
    
//     const deleteItem = req.body.listTitle;
//     await Todolist.findByIdAndDelete(deleteItem)

//     res.redirect("/:customList");
// })






app.listen(3000 , function(){
    console.log("you are currently listening to port 3000");
});   