const express = require('express');
const { body, validationResult } = require('express-validator');
const downloadQueue = require('../queue/downloadQueue');
const video = require('../models/video');
const downloadsRouter = express.Router();
const path = require('path');

downloadsRouter.post(
  '/new',
  body("youtubeUrl").isURL(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { youtubeUrl } = req.body;
      const newVideo = await video.create({
        url: youtubeUrl,
        status: 'started',
      })
      await downloadQueue.add({ url: youtubeUrl, _id: newVideo._id });
      res.status(200).send("Downloading");
    } catch (e) {
      next(e);
    }
  }
);

downloadsRouter.get('/file/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const file = path.resolve(__dirname, `../files/${fileName}`);
  if (!file) {
    res.status(400).json({ err: 'no file exists'});
  }
  res.download(file);
})



module.exports = downloadsRouter;