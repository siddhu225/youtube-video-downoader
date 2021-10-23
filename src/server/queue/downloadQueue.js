const Bull = require('bull');
const ytdl = require('ytdl-core');
const fs = require('fs');
const video = require('../models/video');
const { v4: uuidv4 } = require('uuid');


const downloadQueue = new Bull("download queue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: 6379,
  },
});

downloadQueue.process(async (job, done) => {
  try {
    const data = job.data;
    const info = await ytdl.getBasicInfo(data.url);
    const thumbnail = info.videoDetails.thumbnails[0].url;
    const title =
      info.videoDetails.title +
      " by " +
      info.videoDetails.author.name +
      "-" +
      new Date().getTime().toString();
    job.progress(0);
    global.io.emit('progress', { progress: 0, jobId: data._id });
    const uuid = uuidv4();
    const fileLocation = `./files/${uuid}.mp4`;
    await new Promise((resolve) => {
      ytdl(data.url)
      .on('progress', (length, downloaded, totallength) => {
        const progress = (downloaded / totallength) * 100;
        global.io.emit('progress', { progress, jobId: data._id });
        if (progress >= 100) {
          global.io.emit('videoDone', { fileLocation: `${uuid}.mp4`, jobId: data._id });
          global.io.emit('progress', { progress: 100, jobId: data._id });
        }
      })
      .pipe(fs.createWriteStream(fileLocation))
      .on('finish', () => {
        resolve();
      })
    })
    await video.updateOne(
      { _id: job._id},
      { $set: { 
        status: 'done',
        thumbnail,
        title
      }}
    )
    done();
  } catch (e) {
    console.log('error', e);
  }
})

module.exports = downloadQueue;
