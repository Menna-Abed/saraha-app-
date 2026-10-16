import mongoose from 'mongoose'
import {env} from "../config/env.js";


await mongoose.connect(env.db.url)