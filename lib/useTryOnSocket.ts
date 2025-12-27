"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

export interface TryOnJobUpdate {
  jobId: string;
  userId: string;
  status:
    | "pending"
    | "processing_upper"
    | "processing_lower"
    | "completed"
    | "failed";
  progress: number;
  resultImageUrl?: string;
  upperResultUrl?: string;
  processingTime?: number;
  errorMessage?: string;
  historyId?: string;
  completedAt?: string;
  metadata?: {
    creditsUsed?: number;
  };
}

export interface TryOnJob {
  jobId: string;
  status: string;
  progress: number;
  resultImageUrl?: string;
  upperResultUrl?: string;
  historyId?: string;
  errorMessage?: string;
  processingTime?: number;
  // Store outfit info for display
  outfitInfo?: {
    // New format: array of items
    items?: Array<{
      name: string;
      price?: number;
      imageUrl: string;
    }>;
    // Legacy format (for backward compatibility)
    upperName?: string;
    upperPrice?: number;
    lowerName?: string;
    lowerPrice?: number;
    upperImageUrl?: string;
    lowerImageUrl?: string;
  };
}

interface UseTryOnSocketOptions {
  onJobCompleted?: (job: TryOnJobUpdate) => void;
  onJobFailed?: (job: TryOnJobUpdate) => void;
  onJobUpdate?: (job: TryOnJobUpdate) => void;
}

export function useTryOnSocket(options: UseTryOnSocketOptions = {}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeJobs, setActiveJobs] = useState<Map<string, TryOnJob>>(
    new Map()
  );
  const [completedJobs, setCompletedJobs] = useState<TryOnJob[]>([]);
  const optionsRef = useRef(options);

  // Keep options ref updated
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Load pending jobs from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("pendingTryOnJobs");
    if (stored) {
      try {
        const jobs = JSON.parse(stored);
        const jobMap = new Map<string, TryOnJob>();
        jobs.forEach((job: TryOnJob) => {
          if (job.status !== "completed" && job.status !== "failed") {
            jobMap.set(job.jobId, job);
          }
        });
        setActiveJobs(jobMap);
      } catch (error) {
        console.error("Error loading pending jobs:", error);
      }
    }
  }, []);

  // Save active jobs to localStorage
  useEffect(() => {
    const jobs = Array.from(activeJobs.values());
    localStorage.setItem("pendingTryOnJobs", JSON.stringify(jobs));
  }, [activeJobs]);

  // Connect to WebSocket
  useEffect(() => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const newSocket = io(`${apiUrl}/fashn-jobs`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("🔌 Connected to try-on WebSocket");
      setIsConnected(true);

      // Subscribe with user ID from localStorage
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData.id) {
            newSocket.emit("subscribe", userData.id);
            console.log("📡 Subscribed to job updates for user:", userData.id);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    });

    newSocket.on("disconnect", () => {
      console.log("🔌 Disconnected from try-on WebSocket");
      setIsConnected(false);
    });

    newSocket.on("subscribed", (data) => {
      console.log("✅ Subscription confirmed:", data.message);
    });

    newSocket.on("job-update", (data: TryOnJobUpdate) => {
      console.log("📦 Job update:", data);

      setActiveJobs((prev) => {
        const newMap = new Map(prev);
        const existingJob = newMap.get(data.jobId);
        newMap.set(data.jobId, {
          ...existingJob,
          jobId: data.jobId,
          status: data.status,
          progress: data.progress,
          resultImageUrl: data.resultImageUrl,
          upperResultUrl: data.upperResultUrl,
          historyId: data.historyId,
          errorMessage: data.errorMessage,
          processingTime: data.processingTime,
        });
        return newMap;
      });

      optionsRef.current.onJobUpdate?.(data);
    });

    newSocket.on("job-processing", (data) => {
      console.log(`⏳ Processing ${data.step}: ${data.message}`);
    });

    newSocket.on("job-completed", (data: TryOnJobUpdate) => {
      console.log("✅ Job completed:", data);

      setActiveJobs((prev) => {
        const newMap = new Map(prev);
        const existingJob = newMap.get(data.jobId);

        // Move to completed jobs
        const completedJob: TryOnJob = {
          ...existingJob,
          jobId: data.jobId,
          status: data.status,
          progress: 100,
          resultImageUrl: data.resultImageUrl,
          upperResultUrl: data.upperResultUrl,
          historyId: data.historyId,
          processingTime: data.processingTime,
        };

        setCompletedJobs((prev) => [completedJob, ...prev]);

        // Remove from active jobs
        newMap.delete(data.jobId);
        return newMap;
      });

      optionsRef.current.onJobCompleted?.(data);
    });

    newSocket.on("job-failed", (data: TryOnJobUpdate) => {
      console.error("❌ Job failed:", data);

      setActiveJobs((prev) => {
        const newMap = new Map(prev);
        newMap.delete(data.jobId);
        return newMap;
      });

      optionsRef.current.onJobFailed?.(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Add a new job to track
  const addJob = useCallback(
    (
      jobId: string,
      outfitInfo?: TryOnJob["outfitInfo"]
    ) => {
      setActiveJobs((prev) => {
        const newMap = new Map(prev);
        newMap.set(jobId, {
          jobId,
          status: "pending",
          progress: 0,
          outfitInfo,
        });
        return newMap;
      });
    },
    []
  );

  // Clear a completed job notification
  const clearCompletedJob = useCallback((jobId: string) => {
    setCompletedJobs((prev) => prev.filter((job) => job.jobId !== jobId));
  }, []);

  // Get active job count
  const activeJobCount = activeJobs.size;
  const hasActiveJobs = activeJobCount > 0;

  return {
    socket,
    isConnected,
    activeJobs,
    completedJobs,
    activeJobCount,
    hasActiveJobs,
    addJob,
    clearCompletedJob,
  };
}

