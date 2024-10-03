import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, LinearProgress } from "@mui/material";

const VideoUpload = () => {
  const [videoData, setVideoData] = useState({ title: "", videoUrl: "" });
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const allowedFormats = [
    "video/mp4",
    "video/x-msvideo",
    "video/quicktime",
    "video/x-ms-wmv",
    "video/x-matroska",
    "video/x-flv",
    "video/webm",
  ];
  
  const maxFileSize = 800 * 1024 * 1024; // 800 MB

  const handleChange = (e) => {
    setVideoData({ ...videoData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!allowedFormats.includes(file.type)) {
        setError("Invalid file format.");
        setVideoFile(null);
        return;
      }
      if (file.size > maxFileSize) {
        setError("File size exceeds 800 MB.");
        setVideoFile(null);
        return;
      }
      setError("");
      setVideoFile(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "upload");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dobtzmaui/video/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percent = Math.floor((loaded * 100) / total);
            setUploadProgress(percent);
          },
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading video:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert("Please select a valid video file.");
      return;
    }
    const videoUrl = await uploadToCloudinary(videoFile);
    if (videoUrl) {
      try {
        await axios.post("https://streamingapp-livid.vercel.app/videos", {
          title: videoData.title,
          videoUrl,
        });
        alert("Video uploaded successfully");
      } catch (error) {
        console.error("Error uploading video metadata:", error);
      }
    } else {
      alert("Video upload failed");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "150px auto",
   
         padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#F7FBFC",
      }}
    >
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Upload Video
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          variant="outlined"
          value={videoData.title}
          onChange={handleChange}
          margin="normal"
        />
        <Box display="flex" alignItems="center" sx={{ marginBottom: 2 }}>
          <Button
            variant="contained"
            component="label"
            sx={{
              bgcolor: '#7469B6',
              '&:hover': { bgcolor: "#303f9f" },
              marginRight: 2,
            }}
          >
            Select Video
            <input type="file" accept="video/*" hidden onChange={handleFileChange} />
          </Button>
      
          <Typography variant="body1">
            {videoFile ? videoFile.name : "No file selected"}
          </Typography>
        </Box>
        {error && <Typography color="error">{error}</Typography>}
        <LinearProgress variant="determinate" value={uploadProgress} sx={{ marginY: 2 }} />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: 2,
            bgcolor: '#7469B6',
            '&:hover': { bgcolor: '#AD88C6' },
          }}
        >
          Upload
        </Button>
      </form>
    </Box>
  );
};

export default VideoUpload;
