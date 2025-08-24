import { env } from "cloudflare:workers";
import { and, count, desc, eq, gte } from "drizzle-orm";
import { getDb } from "../../database/config";
import { jobLog, JobLog, NewJobLog } from "../../database/schema";

export type JobStatus = "running" | "completed" | "failed" | "cancelled";

export interface JobResult {
  feedsProcessed: number;
  entriesFetched: number;
  errors?: string[];
  warnings?: string[];
}

export class JobService {
  private static getDb() {
    return getDb(env);
  }

  /**
   * Start a new job and log it
   */
  static async startJob(jobName: string): Promise<string> {
    const db = this.getDb();
    const newJob: NewJobLog = {
      jobName,
      status: "running",
    };

    const [result] = await db
      .insert(jobLog)
      .values(newJob)
      .returning()
      .execute();

    if (!result) throw new Error("Failed to start job");

    return result.id;
  }

  /**
   * Complete a job successfully
   */
  static async completeJob(jobId: string, message?: string): Promise<void> {
    const db = this.getDb();
    const startTime = await this.getJobStartTime(jobId);
    const duration = startTime ? this.calculateDuration(startTime) : null;

    await db
      .update(jobLog)
      .set({
        status: "completed",
        completedAt: new Date(),
        duration,
        message: message || "Job completed successfully",
      })
      .where(eq(jobLog.id, jobId));
  }

  /**
   * Mark a job as failed
   */
  static async failJob(jobId: string, errorMessage: string): Promise<void> {
    const db = this.getDb();
    const startTime = await this.getJobStartTime(jobId);
    const duration = startTime ? this.calculateDuration(startTime) : null;

    await db
      .update(jobLog)
      .set({
        status: "failed",
        completedAt: new Date(),
        duration,
        message: errorMessage,
      })
      .where(eq(jobLog.id, jobId));
  }

  /**
   * Cancel a running job
   */
  static async cancelJob(jobId: string, reason?: string): Promise<void> {
    const db = this.getDb();
    const startTime = await this.getJobStartTime(jobId);
    const duration = startTime ? this.calculateDuration(startTime) : null;

    await db
      .update(jobLog)
      .set({
        status: "cancelled",
        completedAt: new Date(),
        duration,
        message: reason || "Job cancelled",
      })
      .where(eq(jobLog.id, jobId));
  }

  /**
   * Get job details by ID
   */
  static async getJob(jobId: string): Promise<JobLog | null> {
    const db = this.getDb();
    const [result] = await db
      .select()
      .from(jobLog)
      .where(eq(jobLog.id, jobId))
      .limit(1);

    return result || null;
  }

  /**
   * Get recent jobs for a specific job name
   */
  static async getRecentJobs(
    jobName: string,
    limit: number = 10
  ): Promise<JobLog[]> {
    const db = this.getDb();
    return await db
      .select()
      .from(jobLog)
      .where(eq(jobLog.jobName, jobName))
      .orderBy(desc(jobLog.startedAt))
      .limit(limit);
  }

  /**
   * Get all running jobs
   */
  static async getRunningJobs(): Promise<JobLog[]> {
    const db = this.getDb();
    return await db
      .select()
      .from(jobLog)
      .where(eq(jobLog.status, "running"))
      .orderBy(desc(jobLog.startedAt));
  }

  /**
   * Get jobs from the last N days
   */
  static async getJobsFromLastDays(
    days: number = 7,
    jobName?: string
  ): Promise<JobLog[]> {
    const db = this.getDb();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    if (jobName) {
      return await db
        .select()
        .from(jobLog)
        .where(
          and(eq(jobLog.jobName, jobName), gte(jobLog.startedAt, startDate))
        )
        .orderBy(desc(jobLog.startedAt));
    } else {
      return await db
        .select()
        .from(jobLog)
        .where(gte(jobLog.startedAt, startDate))
        .orderBy(desc(jobLog.startedAt));
    }
  }

  /**
   * Get job statistics
   */
  static async getJobStats(jobName?: string): Promise<{
    total: number;
    running: number;
    completed: number;
    failed: number;
    cancelled: number;
  }> {
    const db = this.getDb();
    const baseQuery = jobName ? eq(jobLog.jobName, jobName) : undefined;

    const [total, running, completed, failed, cancelled] = await Promise.all([
      db.select({ count: count() }).from(jobLog).where(baseQuery),
      db
        .select({ count: count() })
        .from(jobLog)
        .where(and(baseQuery, eq(jobLog.status, "running"))),
      db
        .select({ count: count() })
        .from(jobLog)
        .where(and(baseQuery, eq(jobLog.status, "completed"))),
      db
        .select({ count: count() })
        .from(jobLog)
        .where(and(baseQuery, eq(jobLog.status, "failed"))),
      db
        .select({ count: count() })
        .from(jobLog)
        .where(and(baseQuery, eq(jobLog.status, "cancelled"))),
    ]);

    return {
      total: total[0]?.count || 0,
      running: running[0]?.count || 0,
      completed: completed[0]?.count || 0,
      failed: failed[0]?.count || 0,
      cancelled: cancelled[0]?.count || 0,
    };
  }

  /**
   * Clean up old job logs (older than N days)
   */
  static async cleanupOldJobs(daysToKeep: number = 30): Promise<number> {
    const db = this.getDb();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await db
      .delete(jobLog)
      .where(gte(jobLog.startedAt, cutoffDate))
      .returning();

    return result.length;
  }

  /**
   * Check if a job is currently running
   */
  static async isJobRunning(jobName: string): Promise<boolean> {
    const db = this.getDb();
    const [result] = await db
      .select({ count: count() })
      .from(jobLog)
      .where(and(eq(jobLog.jobName, jobName), eq(jobLog.status, "running")));

    return (result?.count || 0) > 0;
  }

  /**
   * Get the start time of a job
   */
  private static async getJobStartTime(jobId: string): Promise<Date | null> {
    const db = this.getDb();
    const [result] = await db
      .select({ startedAt: jobLog.startedAt })
      .from(jobLog)
      .where(eq(jobLog.id, jobId))
      .limit(1);

    return result?.startedAt || null;
  }

  /**
   * Calculate duration between start time and now
   */
  private static calculateDuration(startTime: Date): string {
    const duration = Date.now() - startTime.getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}
