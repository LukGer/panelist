import { Context, Next } from "hono";
import { JobService } from "../services/job-service";

export type JobContext = {
  jobId: string | null;
  jobName: string | null;
};

export interface JobMiddlewareOptions {
  jobName: string;
  preventDuplicate?: boolean;
}

export const withJob = (options: JobMiddlewareOptions) => {
  return async (c: Context, next: Next) => {
    const { jobName, preventDuplicate = true } = options;
    let jobId: string | null = null;

    try {
      // Check if job is already running (if preventDuplicate is enabled)
      if (preventDuplicate) {
        const isRunning = await JobService.isJobRunning(jobName);
        if (isRunning) {
          return c.json(
            {
              error: `${jobName} job is already running`,
              message: "Please wait for the current job to complete",
            },
            409
          );
        }
      }

      jobId = await JobService.startJob(jobName);

      c.set("jobId", jobId);
      c.set("jobName", jobName);

      await next();

      const response = c.res;
      const status = response.status;

      // Read the response body once to avoid "Body has already been used" error
      const responseBody = await response
        .json()
        .catch(() => ({}) as Record<string, unknown>);

      if (response.ok) {
        const message =
          (responseBody as { message?: string })?.message ??
          `${jobName} completed successfully`;

        await JobService.completeJob(jobId, message);
      } else {
        const errorMessage =
          (responseBody as { error?: string; message?: string })?.error ??
          (responseBody as { error?: string; message?: string })?.message ??
          `${jobName} failed with status ${status}`;

        await JobService.failJob(jobId, errorMessage);
      }
    } catch (error) {
      if (jobId) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        await JobService.failJob(jobId, errorMessage);
      }

      throw error;
    }
  };
};

export const getJobId = (c: Context): string | null => {
  return c.get("jobId");
};

export const getJobName = (c: Context): string | null => {
  return c.get("jobName");
};
