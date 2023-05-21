import express from 'express'
import cors from 'cors'

// Routes
import productsRoutes from './routes/products.routes.js'
import categoriesRoutes from './routes/categories.routes.js'

const app = express()

const PORT = 3000;

app.use(express.json())
app.use(cors())

app.use('/api', productsRoutes)
app.use('/api', categoriesRoutes)

app.listen(PORT)

console.log('Server on port', PORT)