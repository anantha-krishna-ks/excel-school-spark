import React, { useState, useRef } from 'react';
import { ArrowLeft, Home, Video, Upload, Plus, Play, Pause, Download, Trash2, GripVertical, Link, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActiveTab, setModalActiveTab] = useState<'youtube' | 'upload'>('youtube');
  const [modalYoutubeUrl, setModalYoutubeUrl] = useState('');
  const [modalUploadedFile, setModalUploadedFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleModalYouTubeLoad = () => {
    if (!modalYoutubeUrl) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }
    
    // Extract video ID from YouTube URL
    const videoId = extractYouTubeVideoId(modalYoutubeUrl);
    if (!videoId) {
      toast.error('Invalid YouTube URL');
      return;
    }
    
    setCurrentVideo(modalYoutubeUrl);
    setYoutubeUrl(modalYoutubeUrl);
    setActiveTab('youtube');
    setIsModalOpen(false);
    setModalYoutubeUrl('');
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

  const handleModalFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setModalUploadedFile(file);
      setUploadedFile(file);
      const videoUrl = URL.createObjectURL(file);
      setCurrentVideo(videoUrl);
      setActiveTab('upload');
      setIsModalOpen(false);
      setModalUploadedFile(null);
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
          {/* Video Editor Section */}
          <div className="lg:col-span-2">

            {/* Video Player */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Video Editor
                  </span>
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-cyan-600 border-cyan-200 hover:bg-cyan-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add clip from new video
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900">
                          Clip from a New Video
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        <div>
                          <Label className="text-base font-medium text-gray-700 mb-4 block">
                            Video Source
                          </Label>
                          
                          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                            <Button
                              variant={modalActiveTab === 'youtube' ? 'default' : 'ghost'}
                              onClick={() => setModalActiveTab('youtube')}
                              className={`h-10 ${modalActiveTab === 'youtube' 
                                ? 'bg-white shadow-sm text-gray-900 hover:bg-white' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                              }`}
                            >
                              YouTube URL
                            </Button>
                            <Button
                              variant={modalActiveTab === 'upload' ? 'default' : 'ghost'}
                              onClick={() => setModalActiveTab('upload')}
                              className={`h-10 ${modalActiveTab === 'upload' 
                                ? 'bg-white shadow-sm text-gray-900 hover:bg-white' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                              }`}
                            >
                              Upload File
                            </Button>
                          </div>
                        </div>

                        {modalActiveTab === 'youtube' && (
                          <div className="space-y-4">
                            <Input
                              placeholder="https://www.youtube.com/watch?v=..."
                              value={modalYoutubeUrl}
                              onChange={(e) => setModalYoutubeUrl(e.target.value)}
                              className="h-12"
                            />
                            <div className="flex gap-3">
                              <Button 
                                onClick={handleModalYouTubeLoad}
                                className="flex-1 h-11 bg-gray-600 hover:bg-gray-700"
                              >
                                Load Video
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 h-11"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}

                        {modalActiveTab === 'upload' && (
                          <div className="space-y-4">
                            <div 
                              className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-gray-300 transition-colors cursor-pointer"
                              onClick={() => modalFileInputRef.current?.click()}
                            >
                              <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                              <p className="text-gray-600 font-medium">Choose video file</p>
                              <p className="text-sm text-gray-400 mt-1">MP4, MOV, AVI supported</p>
                            </div>
                            <input
                              ref={modalFileInputRef}
                              type="file"
                              accept="video/*"
                              onChange={handleModalFileUpload}
                              className="hidden"
                            />
                            {modalUploadedFile && (
                              <p className="text-sm text-green-600 bg-green-50 p-2 rounded">
                                Selected: {modalUploadedFile.name}
                              </p>
                            )}
                            <div className="flex gap-3">
                              <Button 
                                disabled={!modalUploadedFile}
                                className="flex-1 h-11 bg-gray-600 hover:bg-gray-700 disabled:opacity-50"
                              >
                                Load Video
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 h-11"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!currentVideo ? (
                  <div className="text-center py-12 text-gray-500">
                    <Video className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No video loaded</p>
                    <p className="text-sm">Click "Add clip from new video" to get started</p>
                  </div>
                ) : (
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

                      {/* Enhanced Timeline */}
                      <div className="space-y-4">
                        <Label className="text-base font-medium">Timeline & Trim Controls</Label>
                        
                        {/* Main Timeline Container */}
                        <div className="relative bg-gray-100 rounded-lg p-4">
                          {/* Timeline Track */}
                          <div className="relative h-12 bg-gray-200 rounded-md overflow-hidden">
                            {/* Full timeline background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                            
                            {/* Selected region highlight */}
                            <div 
                              className="absolute top-0 bottom-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-80"
                              style={{
                                left: `${(trimStart / duration) * 100}%`,
                                width: `${((trimEnd - trimStart) / duration) * 100}%`
                              }}
                            ></div>
                            
                            {/* Current playhead */}
                            <div 
                              className="absolute top-0 bottom-0 w-0.5 bg-red-500 shadow-lg z-20"
                              style={{
                                left: `${(currentTime / duration) * 100}%`
                              }}
                            >
                              <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md"></div>
                            </div>
                            
                            {/* Start handle */}
                            <div 
                              className="absolute top-0 bottom-0 w-1 bg-cyan-600 cursor-ew-resize hover:bg-cyan-700 transition-colors z-10 group"
                              style={{
                                left: `${(trimStart / duration) * 100}%`
                              }}
                              onMouseDown={(e) => {
                                const startX = e.clientX;
                                const startValue = trimStart;
                                const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                                
                                const handleMouseMove = (e: MouseEvent) => {
                                  if (!rect) return;
                                  const newValue = Math.max(0, Math.min(trimEnd - 0.1, startValue + ((e.clientX - startX) / rect.width) * duration));
                                  setTrimStart(newValue);
                                };
                                
                                const handleMouseUp = () => {
                                  document.removeEventListener('mousemove', handleMouseMove);
                                  document.removeEventListener('mouseup', handleMouseUp);
                                };
                                
                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', handleMouseUp);
                              }}
                            >
                              <div className="absolute -top-1 -left-1 w-3 h-14 bg-cyan-600 rounded border border-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded"></div>
                              </div>
                            </div>
                            
                            {/* End handle */}
                            <div 
                              className="absolute top-0 bottom-0 w-1 bg-cyan-600 cursor-ew-resize hover:bg-cyan-700 transition-colors z-10 group"
                              style={{
                                left: `${(trimEnd / duration) * 100}%`
                              }}
                              onMouseDown={(e) => {
                                const startX = e.clientX;
                                const startValue = trimEnd;
                                const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                                
                                const handleMouseMove = (e: MouseEvent) => {
                                  if (!rect) return;
                                  const newValue = Math.min(duration, Math.max(trimStart + 0.1, startValue + ((e.clientX - startX) / rect.width) * duration));
                                  setTrimEnd(newValue);
                                };
                                
                                const handleMouseUp = () => {
                                  document.removeEventListener('mousemove', handleMouseMove);
                                  document.removeEventListener('mouseup', handleMouseUp);
                                };
                                
                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', handleMouseUp);
                              }}
                            >
                              <div className="absolute -top-1 -left-1 w-3 h-14 bg-cyan-600 rounded border border-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded"></div>
                              </div>
                            </div>
                            
                            {/* Clickable timeline for seeking */}
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
                          <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
                            <span>0:00</span>
                            <span>{formatTime(duration / 4)}</span>
                            <span>{formatTime(duration / 2)}</span>
                            <span>{formatTime(3 * duration / 4)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>

                        {/* Trim Values Display */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white rounded-lg border p-3">
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">Start Time</Label>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-lg font-mono font-medium text-cyan-600">
                                {formatTime(trimStart)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSeek(trimStart)}
                                className="text-xs"
                              >
                                Jump to
                              </Button>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg border p-3">
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">End Time</Label>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-lg font-mono font-medium text-cyan-600">
                                {formatTime(trimEnd)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSeek(trimEnd)}
                                className="text-xs"
                              >
                                Jump to
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Clip Duration & Save */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-xs text-green-600 uppercase tracking-wide">Clip Duration</Label>
                              <div className="text-xl font-mono font-bold text-green-700 mt-1">
                                {formatTime(trimEnd - trimStart)}
                              </div>
                            </div>
                            <Button 
                              onClick={saveClip}
                              className="bg-green-500 hover:bg-green-600 px-6"
                              disabled={trimStart >= trimEnd}
                            >
                              Save Clip
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Clips List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Saved Clips ({clips.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {clips.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No clips saved yet</p>
                    <p className="text-sm">Create clips from your video above</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      {clips.map((clip, index) => (
                        <div
                          key={clip.id}
                          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">{clip.name}</h4>
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
                          
                          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
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
                          </div>
                          
                          <div className="bg-gray-50 rounded p-2 mb-3">
                            <span className="text-gray-500 text-xs uppercase tracking-wide">Time Range</span>
                            <div className="font-mono text-sm text-gray-700">
                              {formatTime(clip.startTime)} → {formatTime(clip.endTime)}
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
                    <div className="border-t pt-4">
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Ready to Export</h3>
                            <p className="text-sm text-gray-600">
                              {clips.length} clip{clips.length !== 1 ? 's' : ''} will be merged into one video
                            </p>
                          </div>
                          <Button
                            onClick={downloadAllClips}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-6"
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
      </div>
    </div>
  );
};

export default VideoClipEditor;