import React, { useState, useRef } from 'react';
import { ArrowLeft, Home, Video, Upload, Plus, Play, Pause, Download, Trash2, GripVertical, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface VideoClip {
  id: string;
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
  source: 'youtube' | 'upload';
  url?: string;
  file?: File;
  blob?: Blob;
}

const VideoClipEditor = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'youtube' | 'upload'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleYouTubeLoad = () => {
    if (!youtubeUrl) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }
    
    // Extract video ID from YouTube URL
    const videoId = extractYouTubeVideoId(youtubeUrl);
    if (!videoId) {
      toast.error('Invalid YouTube URL');
      return;
    }
    
    setCurrentVideo(youtubeUrl);
    toast.success('YouTube video loaded successfully');
  };

  const extractYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setUploadedFile(file);
      const videoUrl = URL.createObjectURL(file);
      setCurrentVideo(videoUrl);
      toast.success('Video file uploaded successfully');
    } else {
      toast.error('Please select a valid video file');
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      setDuration(videoDuration);
      setTrimEnd(videoDuration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const saveClip = () => {
    if (!currentVideo) {
      toast.error('No video loaded');
      return;
    }

    if (trimStart >= trimEnd) {
      toast.error('Invalid trim range');
      return;
    }

    const newClip: VideoClip = {
      id: Date.now().toString(),
      name: `Clip ${clips.length + 1}`,
      duration: trimEnd - trimStart,
      startTime: trimStart,
      endTime: trimEnd,
      source: activeTab,
      url: activeTab === 'youtube' ? youtubeUrl : undefined,
      file: activeTab === 'upload' ? uploadedFile : undefined,
    };

    setClips([...clips, newClip]);
    toast.success('Clip saved successfully');
  };

  const deleteClip = (clipId: string) => {
    setClips(clips.filter(clip => clip.id !== clipId));
    toast.success('Clip deleted');
  };

  const moveClip = (clipId: string, direction: 'up' | 'down') => {
    const currentIndex = clips.findIndex(clip => clip.id === clipId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= clips.length) return;

    const newClips = [...clips];
    [newClips[currentIndex], newClips[newIndex]] = [newClips[newIndex], newClips[currentIndex]];
    setClips(newClips);
  };

  const downloadAllClips = () => {
    if (clips.length === 0) {
      toast.error('No clips to download');
      return;
    }
    
    // In a real implementation, this would use FFmpeg.js or similar to merge clips
    toast.success('Download feature would merge and download all clips');
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Home className="w-4 h-4" />
            <span className="mx-2">/</span>
            <span className="text-gray-700">Teacher Tools</span>
            <span className="mx-2">/</span>
            <span className="text-blue-600 font-medium">Video Clip Editor</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tools')}
                className="text-gray-600 hover:text-gray-900 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-xl flex items-center justify-center">
                  <Video className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Video Clip Editor</h1>
                  <p className="text-sm text-gray-500">Create and edit video clips</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Input Section */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Video Source
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'youtube' | 'upload')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 h-auto bg-gray-100 p-1 rounded-2xl">
                    <TabsTrigger 
                      value="youtube" 
                      className="flex items-center gap-3 h-14 px-6 rounded-xl transition-all font-medium text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800"
                    >
                      <Link className="w-4 h-4" />
                      Paste YouTube URL
                    </TabsTrigger>
                    <TabsTrigger 
                      value="upload" 
                      className="flex items-center gap-3 h-14 px-6 rounded-xl transition-all font-medium text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Video File
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="youtube" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="youtube-url">YouTube URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="youtube-url"
                          placeholder="Paste YouTube URL here..."
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={handleYouTubeLoad} className="bg-cyan-500 hover:bg-cyan-600">
                          Load Video
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="upload" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="video-upload">Upload Video File</Label>
                      <div className="flex flex-col gap-4">
                        <div 
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-sm text-gray-400 mt-1">MP4, MOV, AVI files supported</p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        {uploadedFile && (
                          <p className="text-sm text-green-600">
                            Selected: {uploadedFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add clip from new video
                </Button>
              </CardContent>
            </Card>

            {/* Video Player */}
            {currentVideo && (
              <Card>
                <CardHeader>
                  <CardTitle>Video Editor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        src={currentVideo}
                        onLoadedMetadata={handleVideoLoadedMetadata}
                        onTimeUpdate={handleTimeUpdate}
                        className="w-full h-64 object-contain"
                        controls={false}
                      />
                    </div>

                    {/* Video Controls */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={togglePlayPause}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <span className="text-sm text-gray-600">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      {/* Timeline */}
                      <div className="space-y-2">
                        <Label>Timeline</Label>
                        <input
                          type="range"
                          min="0"
                          max={duration}
                          value={currentTime}
                          onChange={(e) => handleSeek(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      {/* Trim Controls */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Time</Label>
                          <input
                            type="range"
                            min="0"
                            max={duration}
                            value={trimStart}
                            onChange={(e) => setTrimStart(Number(e.target.value))}
                            className="w-full"
                          />
                          <span className="text-sm text-gray-600">{formatTime(trimStart)}</span>
                        </div>
                        <div className="space-y-2">
                          <Label>End Time</Label>
                          <input
                            type="range"
                            min="0"
                            max={duration}
                            value={trimEnd}
                            onChange={(e) => setTrimEnd(Number(e.target.value))}
                            className="w-full"
                          />
                          <span className="text-sm text-gray-600">{formatTime(trimEnd)}</span>
                        </div>
                      </div>

                      <Button 
                        onClick={saveClip}
                        className="w-full bg-green-500 hover:bg-green-600"
                      >
                        Save Clip ({formatTime(trimEnd - trimStart)})
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Clips List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Saved Clips ({clips.length})</span>
                  {clips.length > 0 && (
                    <Button
                      onClick={downloadAllClips}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download All
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {clips.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No clips saved yet</p>
                    <p className="text-sm">Create clips from your video above</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {clips.map((clip, index) => (
                      <div
                        key={clip.id}
                        className="bg-gray-50 rounded-lg p-4 border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{clip.name}</h4>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveClip(clip.id, 'up')}
                              disabled={index === 0}
                            >
                              <GripVertical className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteClip(clip.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Duration: {formatTime(clip.duration)}</p>
                          <p>Range: {formatTime(clip.startTime)} - {formatTime(clip.endTime)}</p>
                          <p>Source: {clip.source === 'youtube' ? 'YouTube' : 'Upload'}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full"
                        >
                          <Play className="w-3 h-3 mr-2" />
                          Preview
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoClipEditor;