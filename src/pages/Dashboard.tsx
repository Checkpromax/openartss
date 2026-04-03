import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCredits } from '../context/CreditContext';
import {
  Sparkles,
  Send,
  ImagePlus,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Film,
  Zap,
  Wand2,
} from 'lucide-react';

interface VideoJob {
  id: string;
  prompt: string;
  imageUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  createdAt: Date;
  enhancedPrompt?: string;
}

const SAMPLE_VIDEOS = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://www.w3schools.com/html/movie.mp4',
];

export default function Dashboard() {
  const { credits, deductCredits } = useCredits();
  const [prompt, setPrompt] = useState('');
  const [_imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const enhancePrompt = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    // Simulate OpenAI enhancement
    await new Promise(r => setTimeout(r, 1500));
    const enhancements = [
      `${prompt}, cinematic lighting, 4k resolution, dramatic atmosphere, smooth camera movement, professional color grading`,
      `${prompt}, ultra detailed, photorealistic, volumetric lighting, shallow depth of field, film grain`,
      `${prompt}, epic composition, golden hour lighting, anamorphic lens flare, cinematic bokeh, high production value`,
    ];
    const enhanced = enhancements[Math.floor(Math.random() * enhancements.length)];
    setPrompt(enhanced);
    setIsEnhancing(false);
  }, [prompt]);

  const generateVideo = useCallback(async () => {
    if (!prompt.trim()) return;
    if (credits < 1) return;

    if (!deductCredits(1)) {
      return;
    }

    setIsGenerating(true);

    const jobId = 'job_' + Math.random().toString(36).slice(2);
    const newJob: VideoJob = {
      id: jobId,
      prompt,
      imageUrl: imagePreview || undefined,
      status: 'pending',
      createdAt: new Date(),
    };

    setJobs(prev => [newJob, ...prev]);
    setPrompt('');
    setImageFile(null);
    setImagePreview(null);

    // Simulate pending -> processing
    await new Promise(r => setTimeout(r, 2000));
    setJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, status: 'processing' } : j))
    );

    // Simulate processing -> completed
    await new Promise(r => setTimeout(r, 5000 + Math.random() * 3000));
    const sampleVideo = SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
    setJobs(prev =>
      prev.map(j =>
        j.id === jobId
          ? {
              ...j,
              status: 'completed',
              videoUrl: sampleVideo,
              enhancedPrompt: prompt,
            }
          : j
      )
    );

    // Small chance of failure
    if (Math.random() < 0.1) {
      setJobs(prev =>
        prev.map(j =>
          j.id === jobId ? { ...j, status: 'failed' } : j
        )
      );
      // Refund credit on failure
      // In real app, this would call addCredits
    }

    setIsGenerating(false);
  }, [prompt, credits, deductCredits, imagePreview]);

  const deleteJob = useCallback((jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
  }, []);

  const activeJobs = jobs.filter(j => j.status === 'pending' || j.status === 'processing');
  const completedJobs = jobs.filter(j => j.status === 'completed');
  const failedJobs = jobs.filter(j => j.status === 'failed');

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-600/10 rounded-full blur-3xl top-20 left-0" />
        <div className="absolute w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl bottom-0 right-0" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-gray-400 mt-1">Create amazing AI videos</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="font-medium">{credits} credits</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Film className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">{completedJobs.length} videos</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'generate'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Generate
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            History
            {jobs.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">{jobs.length}</span>
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'generate' ? (
            <motion.div
              key="generate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Generation Panel */}
              <div className="lg:col-span-2 space-y-6">
                {/* Prompt Input */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-purple-400" />
                      Describe your video
                    </h2>
                    <button
                      onClick={enhancePrompt}
                      disabled={isEnhancing || !prompt.trim()}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm hover:bg-purple-500/20 transition-colors disabled:opacity-50"
                    >
                      {isEnhancing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      Enhance Prompt
                    </button>
                  </div>

                  <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="A majestic eagle soaring through golden clouds at sunset, cinematic slow motion..."
                    className="w-full h-36 p-4 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors text-white placeholder-gray-500 resize-none"
                  />

                  {/* Image Upload */}
                  <div className="mt-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Upload preview"
                          className="w-32 h-32 object-cover rounded-xl border border-white/10"
                        />
                        <button
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-xs">
                          Image-to-Video
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-dashed border-white/20 hover:border-purple-500/50 hover:bg-white/10 transition-colors text-sm text-gray-400"
                      >
                        <ImagePlus className="w-4 h-4" />
                        Upload Image (optional)
                      </button>
                    )}
                  </div>

                  {/* Generate Button */}
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      1 credit per video • {credits} remaining
                    </p>
                    <button
                      onClick={generateVideo}
                      disabled={isGenerating || !prompt.trim() || credits < 1}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Generate Video
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Active Jobs */}
                {activeJobs.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-400">In Progress</h3>
                    {activeJobs.map(job => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          {job.status === 'pending' ? (
                            <Clock className="w-5 h-5 text-yellow-400" />
                          ) : (
                            <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{job.prompt}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {job.status === 'pending' ? 'Queued...' : 'Generating video...'}
                            </p>
                          </div>
                          <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                              initial={{ width: '0%' }}
                              animate={{ width: job.status === 'processing' ? '70%' : '20%' }}
                              transition={{ duration: 2 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Recent Completed */}
                {completedJobs.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-400">Recent Videos</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {completedJobs.slice(0, 4).map(job => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="rounded-xl overflow-hidden bg-white/[0.02] border border-white/10 group"
                        >
                          <div className="relative aspect-video bg-gray-900">
                            {job.videoUrl && (
                              <video
                                src={job.videoUrl}
                                className="w-full h-full object-cover"
                                controls
                                preload="metadata"
                              />
                            )}
                          </div>
                          <div className="p-3">
                            <p className="text-sm truncate text-gray-300">{job.prompt}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {job.createdAt.toLocaleTimeString()}
                              </span>
                              <a
                                href={job.videoUrl}
                                download
                                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs"
                              >
                                <Download className="w-3 h-3" />
                                Download
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Failed Jobs */}
                {failedJobs.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-red-400">Failed</h3>
                    {failedJobs.map(job => (
                      <div
                        key={job.id}
                        className="flex items-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10"
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{job.prompt}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Generation failed. Credit refunded.
                          </p>
                        </div>
                        <button
                          onClick={() => deleteJob(job.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                  <h3 className="font-semibold mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Credits Remaining</span>
                      <span className="font-semibold text-yellow-400">{credits}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Videos Generated</span>
                      <span className="font-semibold text-purple-400">{completedJobs.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Failed</span>
                      <span className="font-semibold text-red-400">{failedJobs.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">In Queue</span>
                      <span className="font-semibold text-cyan-400">{activeJobs.length}</span>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-500/5 to-cyan-500/5 border border-white/10">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Prompt Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">•</span>
                      Be specific about the scene, mood, and style
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">•</span>
                      Use cinematic terms: "slow motion", "close-up", "panning"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">•</span>
                      Mention lighting: "golden hour", "neon lights", "dramatic"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">•</span>
                      Try the AI prompt enhancer for better results
                    </li>
                  </ul>
                </div>

                {/* Upgrade CTA */}
                {credits <= 2 && (
                  <div className="p-6 rounded-2xl bg-gradient-to-b from-yellow-500/5 to-orange-500/5 border border-yellow-500/20">
                    <h3 className="font-semibold mb-2">Running Low on Credits?</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Upgrade to get more video generations
                    </p>
                    <a
                      href="/pricing"
                      className="block w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-center font-semibold text-sm hover:shadow-lg hover:shadow-yellow-500/25 transition-all"
                    >
                      View Plans
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* History Tab */}
              {jobs.length === 0 ? (
                <div className="text-center py-20">
                  <Film className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No videos yet</h3>
                  <p className="text-gray-500 mb-6">
                    Generate your first AI video to see it here
                  </p>
                  <button
                    onClick={() => setActiveTab('generate')}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 font-semibold"
                  >
                    Start Creating
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobs.map(job => (
                    <motion.div
                      key={job.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`rounded-xl overflow-hidden border ${
                        job.status === 'completed'
                          ? 'border-white/10 bg-white/[0.02]'
                          : job.status === 'failed'
                          ? 'border-red-500/20 bg-red-500/5'
                          : 'border-white/10 bg-white/[0.02]'
                      }`}
                    >
                      <div className="relative aspect-video bg-gray-900">
                        {job.status === 'completed' && job.videoUrl ? (
                          <video
                            src={job.videoUrl}
                            className="w-full h-full object-cover"
                            controls
                            preload="metadata"
                          />
                        ) : job.status === 'failed' ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <AlertCircle className="w-12 h-12 text-red-400" />
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              job.status === 'completed'
                                ? 'bg-green-500/20 text-green-400'
                                : job.status === 'failed'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {job.status === 'completed' ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Done
                              </span>
                            ) : job.status === 'failed' ? (
                              <span className="flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Failed
                              </span>
                            ) : job.status === 'processing' ? (
                              <span className="flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" /> Processing
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Queued
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-300 line-clamp-2">{job.prompt}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500">
                            {job.createdAt.toLocaleString()}
                          </span>
                          <div className="flex items-center gap-2">
                            {job.status === 'completed' && job.videoUrl && (
                              <a
                                href={job.videoUrl}
                                download
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs"
                              >
                                <Download className="w-3 h-3" />
                                Download
                              </a>
                            )}
                            <button
                              onClick={() => deleteJob(job.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
