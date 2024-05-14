const express = require('express');
const multer = require('multer');
const path =require("path"); // using this path we can get path for our present working directory
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();

const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("app is running");
})

// const storage = multer.diskStorage({
//     destination: './upload/images',
//     filename: (req,file,cb)=>{
//         return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// });
  
// const upload = multer({storage:storage});
// app.use('/images',express.static("upload/images"));

// // end point for uploading images of employees
// app.post("/upload",upload.single('employee'),(req,res)=>{
//     res.json({
//         success:1,
//         image_url: `http://localhost:${port}/images/${req.file.filename}`
//     })
// });

// schema for employe username: gillolahemavardhanreddy@gmail.com password: Bala143
//mongoose.connect("mongodb+srv://gillolahemavardhanreddy:Bala143@cluster0.7bvjctw.mongodb.net/"); // connection to atlas compas
mongoose.connect(process.env.MONGO_URL) //connection to mongoose atlas driver
const Employee = mongoose.model("Employee",{
    id: {
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    profile_picture:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
    },
    opinion:{
        type: String,
        required : true,
    },
    gender:{
        type: String,
        required: true,
    },
    date:{
        type:Date,
        default: Date.now(),
    },
}); // we use this schema to add employee to our database

// endpoint for adding an employee
app.post('/addemployee',async (req,res)=>{
    const employees = await Employee.find({});
    let id;
    if(employees.length>0){
        let last_employee_array = employees.slice(-1);// getting last product and making it array
        let last_employee = last_employee_array[0]; // as last_product_array have only one ele we access it using 0
        id = last_employee.id+1;
    }
    else{
        id = 1;
    }
    const employee = new Employee({
        id: id,
        name: req.body.name,
        profile_picture: req.body.image,
        role: req.body.role,
        opinion: req.body.opinion,
        gender: req.body.gender,
        email: req.body.email,
    });
    console.log(employee);
    await employee.save(); // we need to save every product we uploaded to database using .save()
    console.log("saved");
    res.json({
        success: true,
        name:req.body.name,
    })
});

// endpoint for deleting employee from database
app.post("/removeemployee",async (req,res)=>{
    await Employee.findOneAndDelete({id:req.body.id});
    console.log("removed selected employee");
    res.json({
        success: true,
        name: req.body.name,
    })
});

//end point to get all employees details 
app.get("/allemployee",async (req,res)=>{
    let employees = await Employee.find({});
    console.log("all employee details fetched");
    res.send(employees);
});

app.listen(port,()=>console.log(`running server on port ${port}`));