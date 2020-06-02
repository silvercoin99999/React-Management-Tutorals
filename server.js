const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
  multipleStatements: true,
  typeCast: function (field, next) {
    if (field.type == 'VAR_STRING') {
      return field.string();
    }
    return next();
  }
});
connection.connect();

app.get('/api/customers', (req, res) => {
  connection.query(
    "SELECT * FROM CUSTOMER",
    (err, rows, fields) => {
      console.log(rows);
      res.send(rows);
    }
  );
});
app.listen(port, () => console.log(`Listening on port ${port}`));




// res.send([
  //   {
  //     'id': 1,
  //     'image': 'https://placeimg.com/64/64/1',
  //     'name': '홍길동',
  //     'birthday': '961125',
  //     'gender': '남자',
  //     'job': '대학생'
  //   },
  //   {
  //     'id': 2,
  //     'image': 'https://placeimg.com/64/64/2',
  //     'name': '냥냥이',
  //     'birthday': '961125',
  //     'gender': '남자',
  //     'job': '프로그래머'
  //   },
  //   {
  //     'id': 3,
  //     'image': 'https://placeimg.com/64/64/3',
  //     'name': '멍멍이',
  //     'birthday': '961125',
  //     'gender': '남자',
  //     'job': '대학생'
  //   }
  // ]);