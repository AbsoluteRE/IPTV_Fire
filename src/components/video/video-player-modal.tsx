
'use client';

import React, { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamUrl: string | null;
  title: string | null;
}

export function VideoPlayerModal({ isOpen, onClose, streamUrl, title }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.load(); // Important to load new source
      videoRef.current.play().catch(error => console.error("Error attempting to play video:", error));
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen, streamUrl]);

  if (!isOpen || !streamUrl || !title) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl p-0 aspect-video bg-black">
        <DialogHeader className="p-4 absolute top-0 left-0 z-10 w-full bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-primary-foreground line-clamp-1">{title}</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20 hover:text-white">
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            controls
            className="w-full h-full object-contain"
            preload="auto"
            onEnded={onClose} // Optionally close modal on video end
          >
            <source src={streamUrl} type={streamUrl.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'} />
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}
