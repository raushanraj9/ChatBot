const express = require('express');
const openAI = require('openai');

require('dotenv').config();

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
