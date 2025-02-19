import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.MONGO_DB_URL) { 
  throw new Error( 'Please provide Mongo DB URL in env file' )
}

async function connectDB(){ 
  try { 
    await mongoose.connect(process.env.MONGO_DB_URL)
    console.log('DB connected')
  }
  catch(error) {
    console.log('DB connection error', error)
    process.exit(1)
  }
}

export default connectDB