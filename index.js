const express=require('express')
const cors=require('cors')
const dotenv=require('dotenv')
const db=require('./config/database')
const XLSX = require('xlsx');
const fs = require('fs');
//middleware
const app=express()

// Get the first sheet
// const worksheet = workbook.Sheets[workbook.SheetNames[0]];

// // Convert the sheet to JSON
// const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });

// // Write the JSON data to a file
// fs.writeFileSync('./file.json', JSON.stringify(jsonData, null, 2));

// console.log('Excel file converted to JSON.');


console.log(__dirname)
dotenv.config();
app.use(cors())
app.use(express.json())
//database
db.authenticate().then(()=>{
//     db.sync({alter:true})
//   .then(() => {
//     console.log('Table created successfully');
//   })
//   .catch((error) => {
//     console.error('Error creating table:', error);
//   });
    console.log("Database connected")
  }).catch(err=>{
    console.log(err)
  })
  

  app.use('/seat',require('./routes/seatbooking.route'))

const PORT=process.env.PORT || 3006
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
},)
