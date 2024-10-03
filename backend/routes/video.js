import express from 'express';
import Video from '../models/uploadvideo.js';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
  const { title, videoUrl } = req.body;
  
  try {
   
    if (!title || !videoUrl) {
      return res.status(400).json({ message: 'Title and videoUrl are required' });
    }

    const newVideo = new Video({ title, videoUrl });
    await newVideo.save();
    res.json({ message: 'Video metadata saved', video: newVideo });
  } catch (error) {
    res.status(500).json({ message: 'Error saving video', error });
  }
});


router.get('/', async (req, res) => {
  try {
    const videos = await Video.find(); 
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos', error });
  }
});


router.get('/stream/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const videoUrl = video.videoUrl;
    const range = req.headers.range;

    if (!range) {
      return res.status(416).send("Range header is required");
    }

    
    const CHUNK_SIZE = 30 * 1024 * 1024;

    const headResponse = await axios.head(videoUrl);
    const videoSize = parseInt(headResponse.headers['content-length'], 10);

    
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    };

    const videoStream = await axios({
      url: videoUrl,
      method: 'GET',
      responseType: 'stream',
      headers: {
        Range: `bytes=${start}-${end}`,
      },
    });

   
    res.writeHead(206, headers);
    videoStream.data.pipe(res);

   
    videoStream.data.on('error', (error) => {
      res.status(500).json({ message: 'Error streaming video', error });
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching video', error });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedVideo = await Video.findByIdAndDelete(id);
    if (!deletedVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json({ message: 'Video metadata deleted', video: deletedVideo });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting video', error });
  }
});

export default router;
