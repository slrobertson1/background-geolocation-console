// const contentType = require('content-type');
import { Router } from 'express';

// const express = require('express');
// const { writeFile } = require('fs');
// const getRawBody = require('raw-body');
// const uuidv4 = require('uuid/v4');
const multer = require('multer');
const fs = require('fs');
// const path = require('path');
const moment = require('moment');

// const upload = multer({ dest: 'tmp/multipart/' })

const router = new Router();

// const app = express();

// app.use(express.json());

// const helloMessage = 'Hi! The server is listening on port 8080. Use the React Native app to start an upload.'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const body = req.body;
      console.log(req.body);
      // const dir = 'tmp/blips/foo';
      const memoryLapse = JSON.parse(body.memoryLapse);
      const dir = `blips/${memoryLapse.participantId}`;

      console.log(`participantId = ${memoryLapse.participantId}`);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null, dir);
    } catch (error) {
      console.log(`Error in multer.diskStorage.destination: ${error.message}`);
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    console.log(`filename = ${file.originalname}`);
    cb(null , file.originalname);
  }
});
const upload = multer({ storage: storage });

const createDir = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

const storeJson = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err);
    next(err);
  }
}

// app.get('/', function (req, res) {
//   res.send(helloMessage)
// })

// app.post('/blip', upload.array('blip', 2), function (req, res) {
//   const memoryLapse = JSON.parse(req.body.memoryLapse);
//   // const memoryLapse = {
//   //   participantId: '123'
//   // };
//   const memoryLapsePath = `blips/${memoryLapse.participantId}/${path.basename(req.files[0].originalname, '.mp4')}.json`;
//
//   console.log('/blip');
//   // console.log(`Received headers: ${JSON.stringify(req.headers)}`);
//   // console.log(req.file);
//   // console.log(`participantId = ${memoryLapse.participantId}`);
//   // console.log(`Wrote to: ${req.file.path}`)
//   // res.status = 202
//   //res.end()
//   try {
//     if(!req.files) {
//       console.log(`No files!!! ${req.body}`);
//       res.send({
//         status: false,
//         message: 'No file uploaded',
//         body: req.body
//       });
//     } else {
//       //Use the name of the input field (i.e. "blip") to retrieve the uploaded file
//       const blips = req.files;
//       const blipFilename = blips.length > 0 ? blips[0].filename : null;
//       const blipDetailsFilename = blips.lenth > 1 ? blips[1].filename : null;
//
//       //Use the mv() method to place the file in upload directory (i.e. "uploads")
//       // blip.mv('./uploads/' + blip.name);
//
//       storeJson(memoryLapse, memoryLapsePath);
//
//       //send response
//       res.json({
//         status: true,
//         message: 'File is uploaded',
//         // data: req.file,
//         data: {
//           id: memoryLapse.id,
//           blipFilename: blipFilename,
//           blipDetailsFilename: blipDetailsFilename,
//           mimetype: blips.mimetype,
//           size: blips.size
//         }
//       });
//     }
//   } catch (err) {
//     console.log(`Error: ${err.message}`);
//     res.status(500).send(err);
//   }
// })

router.post('/survey', (req, res) => {
  console.log(`body = ${JSON.stringify(req.body)}`);
  const randomSurveyResponse = req.body;
  const timestamp = moment(randomSurveyResponse.timestamp).format(
    'YYYY-MM-DDTHH-mm-ss.SSS',
  );
  const surveyPath = `surveys/${randomSurveyResponse.participantId}`;
  const surveyJsonFilename = `${randomSurveyResponse.participantId}_${timestamp}.json`;

  try {
    createDir(surveyPath);
    storeJson(randomSurveyResponse, surveyPath + '/' + surveyJsonFilename);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    res.status(500).send(err);
  }

  res.json(req.body);
});


// app.use(function (req, res, next) {
//   res.status(404).send("Sorry can't find that!")
// });

// app.use(function(err, req, res, next) {
//   // 'SyntaxError: Unexpected token n in JSON at position 0'
//   err.message;
//   next(err);
// });

// app.listen(8080, function () {
//   console.log(helloMessage)
// })

export default router;
