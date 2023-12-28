require('dotenv').config({
  path: '.env',
});

const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
}));

// var whitelist = [process.env.FRONTEND_URL]
// var corsOptions = {
//   origin: function (origin, callback) {
//       if (origin === undefined || whitelist.indexOf(origin) !== -1) {
//           callback(null, true)
//       } else {
//           callback(new Error("Not allowed by CORS"))
//       }
//   },
// }
// app.use(cors(corsOptions))

app.use('/uploads', express.static('uploads'));

app.use('/', require('./src/routers/index'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
