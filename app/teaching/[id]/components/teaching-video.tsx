"use client";

import { useEffect, useRef, useState } from "react";
import {
	getVideoProgress,
	getYouTubeEmbedUrl,
	isYouTubeUrl,
	saveVideoProgress,
} from "@/lib/teachings";

interface TeachingVideoProps {
	teachingId: string;
	title: string;
	videoUrl: string;
}

/**
 * The 16:9 player. YouTube links load in an iframe; anything else plays in a native
 * <video> whose position is saved to localStorage and restored on the next visit.
 */
export function TeachingVideo({ teachingId, title, videoUrl }: TeachingVideoProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [videoError, setVideoError] = useState(false);
	const isYouTube = isYouTubeUrl(videoUrl);

	// Restore saved progress (non-YouTube only)
	useEffect(() => {
		if (isYouTube || !videoRef.current) return;

		const progress = getVideoProgress(teachingId);
		if (progress?.currentTime) {
			videoRef.current.currentTime = progress.currentTime;
		}
	}, [teachingId, isYouTube]);

	// Save progress periodically and on pause, seek, unload (non-YouTube only)
	useEffect(() => {
		if (isYouTube || !videoRef.current) return;

		const video = videoRef.current;
		const saveProgress = () => {
			saveVideoProgress(teachingId, video.currentTime);
		};

		const interval = setInterval(() => {
			if (!video.paused) {
				saveProgress();
			}
		}, 5000);

		video.addEventListener("pause", saveProgress);
		video.addEventListener("seeked", saveProgress);
		window.addEventListener("beforeunload", saveProgress);

		return () => {
			clearInterval(interval);
			video.removeEventListener("pause", saveProgress);
			video.removeEventListener("seeked", saveProgress);
			window.removeEventListener("beforeunload", saveProgress);
			saveProgress();
		};
	}, [teachingId, isYouTube]);

	return (
		<div className="aspect-video w-full bg-black">
			{videoError ? (
				<div
					role="alert"
					className="flex h-full w-full items-center justify-center px-6 text-center text-[15px] text-[#b9b3a9]"
				>
					This video couldn’t be loaded. Please try again later.
				</div>
			) : isYouTube ? (
				<iframe
					className="h-full w-full"
					src={getYouTubeEmbedUrl(videoUrl) ?? undefined}
					title={title}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
					onError={() => setVideoError(true)}
				/>
			) : (
				<video
					ref={videoRef}
					className="h-full w-full"
					controls
					preload="metadata"
					src={videoUrl}
					onError={() => setVideoError(true)}
				>
					<track kind="captions" />
					Your browser does not support the video tag.
				</video>
			)}
		</div>
	);
}
