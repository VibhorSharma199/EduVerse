import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import YouTube from "react-youtube";

const VideoPlayer = ({ youtubeUrl, title, description }) => {
  // Extract video ID from YouTube URL
  const getVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(youtubeUrl);

  if (!videoId) {
    return (
      <Box>
        <Typography color="error">Invalid YouTube URL</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ position: "relative", paddingTop: "56.25%", mb: 2 }}>
        <YouTube
          videoId={videoId}
          opts={{
            height: "100%",
            width: "100%",
            playerVars: {
              autoplay: 0,
            },
          }}
          className="absolute top-0 left-0 w-full h-full"
        />
      </Box>
      {description && (
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      )}
    </Paper>
  );
};

export default VideoPlayer;
