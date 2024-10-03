import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Button, Grid, Box } from "@mui/material";

import { format } from "date-fns";

const Videos = () => {
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    try {
      const response = await axios.get("https://streamingapp-livid.vercel.app/videos");
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await axios.delete(`https://streamingapp-livid.vercel.app/videos/${id}`);
        fetchVideos();
      } catch (error) {
        console.error("Error deleting video:", error);
      }
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ marginBottom: 3 }}>
        Uploaded Videos
      </Typography>
      <Grid container spacing={4}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video._id}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                  {video.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                
                  Uploaded on: {format(new Date(video.createdAt), "dd MMM yyyy, HH:mm")}
                </Typography>
                <Box sx={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", marginBottom: 2 }}>
                  <video
                    controls
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(video._id)}
                  sx={{ marginTop: 2, width: "100%" }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Videos;
