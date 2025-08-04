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
        {/* Video Input and Player Section - Full Width */}
        <div className="mb-8">
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
                      className="w-full h-96 object-contain"
                      controls={false}
                    />
                  </div>

                  {/* Video Controls */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={togglePlayPause}
                        className="h-10 px-4"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                        <span className="text-sm font-mono text-gray-700">
                          {formatTime(currentTime)}
                        </span>
                        <span className="text-gray-400">/</span>
                        <span className="text-sm font-mono text-gray-500">
                          {formatTime(duration)}
                        </span>
                      </div>
                    </div>

                    {/* Simplified Timeline & Trim Controls */}
                    <div className="space-y-6">
                      <Label className="text-lg font-semibold text-gray-800">Timeline & Trim Controls</Label>
                      
                      {/* Timeline Container */}
                      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
                        {/* Timeline Progress Bar */}
                        <div className="space-y-4">
                          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                            {/* Full video background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
                            
                            {/* Selected trim region */}
                            <div 
                              className="absolute top-0 bottom-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-md"
                              style={{
                                left: `${(trimStart / duration) * 100}%`,
                                width: `${((trimEnd - trimStart) / duration) * 100}%`
                              }}
                            ></div>
                            
                            {/* Current playhead */}
                            <div 
                              className="absolute top-0 bottom-0 w-1 bg-red-500 shadow-lg z-30 rounded-full"
                              style={{
                                left: `${(currentTime / duration) * 100}%`
                              }}
                            >
                              <div className="absolute -top-2 -left-2 w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                            </div>
                            
                            {/* Clickable area for seeking */}
                            <div 
                              className="absolute inset-0 cursor-pointer"
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const clickPosition = (e.clientX - rect.left) / rect.width;
                                const newTime = clickPosition * duration;
                                handleSeek(newTime);
                              }}
                            ></div>
                          </div>
                          
                          {/* Time markers */}
                          <div className="flex justify-between text-xs text-gray-500 font-mono px-1">
                            <span>0:00</span>
                            <span>{formatTime(duration / 4)}</span>
                            <span>{formatTime(duration / 2)}</span>
                            <span>{formatTime(3 * duration / 4)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>

                        {/* Trim Controls */}
                        <div className="mt-8 space-y-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-4">
                              Use the sliders below to set your clip's start and end times
                            </p>
                          </div>
                          
                          {/* Start Time Slider */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium text-gray-700">Start Time</Label>
                              <span className="text-lg font-mono font-semibold text-blue-600">
                                {formatTime(trimStart)}
                              </span>
                            </div>
                            <div className="relative">
                              <input
                                type="range"
                                min={0}
                                max={duration}
                                step={0.1}
                                value={trimStart}
                                onChange={(e) => setTrimStart(Math.min(Number(e.target.value), trimEnd - 0.1))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue"
                              />
                            </div>
                          </div>
                          
                          {/* End Time Slider */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium text-gray-700">End Time</Label>
                              <span className="text-lg font-mono font-semibold text-cyan-600">
                                {formatTime(trimEnd)}
                              </span>
                            </div>
                            <div className="relative">
                              <input
                                type="range"
                                min={0}
                                max={duration}
                                step={0.1}
                                value={trimEnd}
                                onChange={(e) => setTrimEnd(Math.max(Number(e.target.value), trimStart + 0.1))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-cyan"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 flex justify-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSeek(trimStart)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Preview Start
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSeek(trimEnd)}
                            className="text-cyan-600 border-cyan-200 hover:bg-cyan-50"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Preview End
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setTrimStart(0);
                              setTrimEnd(duration);
                            }}
                            className="text-gray-600 border-gray-200 hover:bg-gray-50"
                          >
                            Reset
                          </Button>
                        </div>
                      </div>

                      {/* Clip Summary Card */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-sm font-medium text-green-700">Your Clip</Label>
                            <div className="flex items-center gap-4">
                              <div className="text-2xl font-mono font-bold text-green-800">
                                {formatTime(trimEnd - trimStart)}
                              </div>
                              <div className="text-sm text-green-600">
                                From {formatTime(trimStart)} to {formatTime(trimEnd)}
                              </div>
                            </div>
                          </div>
                          <Button 
                            onClick={saveClip}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium"
                            disabled={trimStart >= trimEnd}
                          >
                            Save Clip
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Saved Clips Section - Full Width at Bottom */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Clips ({clips.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {clips.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No clips saved yet</p>
                <p className="text-sm">Create clips from your video above</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                  {clips.map((clip, index) => (
                    <div
                      key={clip.id}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 truncate">{clip.name}</h4>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveClip(clip.id, 'up')}
                            disabled={index === 0}
                            className="h-8 w-8 p-0"
                          >
                            <GripVertical className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteClip(clip.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-3 text-sm">
                        <div className="bg-gray-50 rounded p-2">
                          <span className="text-gray-500 text-xs uppercase tracking-wide">Duration</span>
                          <div className="font-mono font-medium text-cyan-600">
                            {formatTime(clip.duration)}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded p-2">
                          <span className="text-gray-500 text-xs uppercase tracking-wide">Source</span>
                          <div className="font-medium text-gray-700">
                            {clip.source === 'youtube' ? 'YouTube' : 'Upload'}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded p-2">
                          <span className="text-gray-500 text-xs uppercase tracking-wide">Time Range</span>
                          <div className="font-mono text-sm text-gray-700">
                            {formatTime(clip.startTime)} → {formatTime(clip.endTime)}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full hover:bg-cyan-50 hover:border-cyan-300"
                      >
                        <Play className="w-3 h-3 mr-2" />
                        Preview Clip
                      </Button>
                    </div>
                  ))}
                </div>
                
                {/* Action Bar at bottom */}
                <div className="border-t pt-6">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Ready to Export</h3>
                        <p className="text-gray-600">
                          {clips.length} clip{clips.length !== 1 ? 's' : ''} will be merged into one video
                        </p>
                      </div>
                      <Button
                        onClick={downloadAllClips}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-3"
                        size="lg"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download All
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoClipEditor;