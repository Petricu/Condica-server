import express, { Request } from 'express';
import * as mysql from 'mysql';
import bodyParser from 'body-parser';
import * as shell from 'shelljs';

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'alex',
  password: 'laura',
  database: 'condica',
});

connection.connect((error: Error) => {
  if (error) throw error;
  else {
    console.log('Connected!');
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/worker', (request, result) => {
  connection.query(
    'SELECT * FROM Angajati WHERE id=' + mysql.escape(request.body.login),
    (error, data) => {
      if (error) throw error;
      if (data[0] === null) {
        return result.send(null);
      }
      if (data[0].password !== request.body.password) {
        return result.send(null);
      }
      return result.send(JSON.stringify(data));
    }
  );
});

app.post('/signup', (request, result) => {
  console.log(request.body.login);
  connection.query(
    'SELECT * FROM Angajati WHERE id=' + mysql.escape(request.body.login),
    (error, data) => {
      if (error) throw error;
      if (data[0] != null) {
        console.log(data[0]);
        console.log('Exists.');
        return result.send(null);
      }
      shell.exec('./src/db.sh');
      connection.query(
        'INSERT INTO Angajati VALUES ( ?, ?, ? )',
        [request.body.login, request.body.password, request.body.nrOfHours],
        (error, data) => {
          if (error) throw error;

          return result.send(JSON.stringify(request.body));
        }
      );
      return;
    }
  );
});

app.listen(3000, (error: Error) => {
  if (error) throw error;
  else console.log('Listening on port 3000.');
});
