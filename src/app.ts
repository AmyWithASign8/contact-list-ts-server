import express, {Request} from 'express';
import 'reflect-metadata';
import {AppDataSource} from "./data-source";
import router from "./routes";
import cors from 'cors'

const app = express()
app.use(cors<Request>());
app.use(express.json());
app.use('/api', router)


const port = 3000;

app.get('/', function (req, res){
    res.send('Hello From Express');
})

AppDataSource.initialize().then(() => {
    console.log('Success to Data')
    app.listen(port, () => {
        console.log(`Server worked on port ${port}.`)
    })
}).catch((error) => console.log('error to connect'))

