import express from 'express';
import { json } from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import * as process from "process";

dotenv.config();

const app = express();
app.use(json());

const pool = new Pool({

});


