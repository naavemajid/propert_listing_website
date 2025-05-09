import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv'

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))

 
const PORT = process.env.PORT;

const connectDb = mysql.createConnection({
    host: process.env.HOST,
    user:  process.env.USER,
    password:  process.env.PASSWORD,
    database:  process.env.DATABASE
})


connectDb.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});


// Route to get all properties
app.get('/',  (req, res)=>{
    connectDb.query('SELECT * FROM propertyinfo',(err, result)=>{
        if(err){
            res.send({message: err})
        }
        res.status(200).send(result)
    })
})

// Route to get a single property by id
app.get('/singleproperty/:id', (req, res)=>{
    const id = Number(req.params.id)
    const property = 'SELECT * FROM propertyinfo WHERE ID = ?'
    connectDb.query(property,[id], (err, result)=>{
        if(err){
            res.send({message: 'unable to get property'})
        }
        res.send(result[0])
    })
})
 
// Route to create or add a property
app.post('/addproperty',(req, res)=>{
    const Image = req.body.image
    const Title = req.body.title
    const Location = req.body.location
    const Price = req.body.price
    const Description = req.body.description

    const insertSql = "INSERT INTO propertyinfo (Image, Title, Location, Price, Desworcription)  VALUES (?, ?, ?, ?, ?)"
    connectDb.query(insertSql,[Image ,Title, Location, Price, Description],(err, result)=>{
        if(err){
            res.status(404).send({message: 'unble to create data'})
        }
        res.status(201).send(result) 
    })
})

   
// Route to update a property
app.put('/updateproperty/:id', (req, res)=>{
    const ID = Number(req.params.id);

    console.log(ID)
    res.send(`ID yet to update is ${ID}, update functionality is in progress`)
})

// Route to delete a property
app.delete('/deleteproperty/:id', (req, res)=>{
    const id = Number(req.params.id)
    const property = 'DELETE  FROM propertyinfo WHERE ID = ?'
    connectDb.query(property,[id], (err, result)=>{
        if(err){
            res.send({message: 'unable to Ddelet property'})
        }
        res.send({message:'Successfully deleted property'})
    })
})

app.listen(PORT, ()=>{
    console.log(`server started on port http://localhost:${PORT}`)
})