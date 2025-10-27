import Express from 'express'
import DataRouter from './routers/routes.js'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

// Create an Express application
const app = new Express()
app.use(Express.json())
app.use(cors())

// Attach data router, include 'data' before the endpoint name
app.use('/api', DataRouter)

// Static Files
app.use(Express.static('public'))

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
