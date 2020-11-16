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

const multer = require('multer');
const upload = multer({ dest: './upload' });

app.get('/api/customers', (req, res) => {
	connection.query(
		"SELECT * FROM CUSTOMER WHERE isDeleted = 0",
		(err, rows, fields) => {
			res.send(rows);
		}
	);
});

app.use('/image', express.static('./upload'));

app.post('/api/customers', upload.single('image'), (req, res) => {
  let sql = 'INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?, now(), 0)';
  
	let image = 'http://localhost:5000/image/' + req.file.filename;
	let name = req.body.name;
	let birthday = req.body.birthday;
	let gender = req.body.gender;
	let job = req.body.job;
	let params = [image, name, birthday, gender, job];
	connection.query(sql, params,
		(err, rows, fields) => {
			res.send(rows);
		}
	);
});

app.delete('/api/customers/:id', (req, res) => {
	let sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?';
	let params = [req.params.id];
	connection.query(sql, params,
		(err, rows, fields) => {
			res.send(rows);
		}
	)
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
