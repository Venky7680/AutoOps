export const mockJobs = [
  { id: '1', name: 'Database Backup', group: 'Infrastructure', project: 'prod', status: 'succeeded', lastRun: '2024-01-15T10:30:00Z', avgDuration: '4m 22s', successRate: 98 },
  { id: '2', name: 'Deploy Frontend', group: 'Deployments', project: 'prod', status: 'running', lastRun: '2024-01-15T11:00:00Z', avgDuration: '2m 15s', successRate: 95 },
  { id: '3', name: 'Cache Invalidation', group: 'Maintenance', project: 'prod', status: 'failed', lastRun: '2024-01-15T09:45:00Z', avgDuration: '1m 05s', successRate: 82 },
  { id: '4', name: 'Health Check Sweep', group: 'Monitoring', project: 'prod', status: 'succeeded', lastRun: '2024-01-15T10:00:00Z', avgDuration: '30s', successRate: 100 },
  { id: '5', name: 'Log Rotation', group: 'Maintenance', project: 'prod', status: 'succeeded', lastRun: '2024-01-15T08:00:00Z', avgDuration: '1m 48s', successRate: 99 },
  { id: '6', name: 'SSL Certificate Renewal', group: 'Security', project: 'prod', status: 'scheduled', lastRun: '2024-01-14T22:00:00Z', avgDuration: '45s', successRate: 100 },
  { id: '7', name: 'Data Pipeline ETL', group: 'Data', project: 'analytics', status: 'succeeded', lastRun: '2024-01-15T06:00:00Z', avgDuration: '18m 33s', successRate: 91 },
  { id: '8', name: 'Kubernetes Node Drain', group: 'Infrastructure', project: 'prod', status: 'aborted', lastRun: '2024-01-14T18:30:00Z', avgDuration: '3m 10s', successRate: 88 },
]

export const mockExecutions = [
  { id: 'e1', jobId: '1', jobName: 'Database Backup', status: 'succeeded', startedAt: '2024-01-15T10:30:00Z', duration: '4m 22s', user: 'admin' },
  { id: 'e2', jobId: '2', jobName: 'Deploy Frontend', status: 'running', startedAt: '2024-01-15T11:00:00Z', duration: '—', user: 'ci-bot' },
  { id: 'e3', jobId: '3', jobName: 'Cache Invalidation', status: 'failed', startedAt: '2024-01-15T09:45:00Z', duration: '1m 05s', user: 'admin' },
  { id: 'e4', jobId: '4', jobName: 'Health Check Sweep', status: 'succeeded', startedAt: '2024-01-15T10:00:00Z', duration: '30s', user: 'scheduler' },
  { id: 'e5', jobId: '5', jobName: 'Log Rotation', status: 'succeeded', startedAt: '2024-01-15T08:00:00Z', duration: '1m 48s', user: 'scheduler' },
  { id: 'e6', jobId: '7', jobName: 'Data Pipeline ETL', status: 'succeeded', startedAt: '2024-01-15T06:00:00Z', duration: '18m 33s', user: 'ci-bot' },
  { id: 'e7', jobId: '1', jobName: 'Database Backup', status: 'succeeded', startedAt: '2024-01-14T22:30:00Z', duration: '4m 11s', user: 'admin' },
  { id: 'e8', jobId: '8', jobName: 'Kubernetes Node Drain', status: 'aborted', startedAt: '2024-01-14T18:30:00Z', duration: '3m 10s', user: 'admin' },
]

export const mockActivityData = [
  { time: '00:00', succeeded: 3, failed: 0, running: 1 },
  { time: '02:00', succeeded: 5, failed: 1, running: 0 },
  { time: '04:00', succeeded: 2, failed: 0, running: 0 },
  { time: '06:00', succeeded: 8, failed: 0, running: 2 },
  { time: '08:00', succeeded: 12, failed: 2, running: 1 },
  { time: '10:00', succeeded: 9, failed: 1, running: 3 },
  { time: '12:00', succeeded: 14, failed: 0, running: 0 },
  { time: '14:00', succeeded: 11, failed: 3, running: 2 },
  { time: '16:00', succeeded: 7, failed: 1, running: 1 },
  { time: '18:00', succeeded: 6, failed: 0, running: 0 },
  { time: '20:00', succeeded: 4, failed: 2, running: 1 },
  { time: '22:00', succeeded: 9, failed: 0, running: 2 },
]

export const mockLogs = `[2024-01-15 10:30:01] INFO  Starting job execution: Database Backup
[2024-01-15 10:30:02] INFO  Connecting to database host: db-prod-01.internal
[2024-01-15 10:30:03] INFO  Authentication successful
[2024-01-15 10:30:04] INFO  Initiating full database dump...
[2024-01-15 10:31:22] INFO  Dump completed: 2.4 GB written to /backups/db-2024-01-15.tar.gz
[2024-01-15 10:31:23] INFO  Uploading to S3: s3://backups/prod/db-2024-01-15.tar.gz
[2024-01-15 10:33:45] SUCCESS Upload complete — 2.4 GB transferred in 142s
[2024-01-15 10:33:46] INFO  Verifying checksum...
[2024-01-15 10:33:47] SUCCESS Checksum verified: sha256:a3f4b1c2...
[2024-01-15 10:33:48] INFO  Cleaning up temporary files
[2024-01-15 10:33:49] INFO  Sending notification to #ops-alerts
[2024-01-15 10:33:50] SUCCESS Job completed successfully in 4m 22s`

export const mockStats = {
  totalJobs: 47,
  totalExecutions: 1284,
  successRate: 94.2,
  failureCount: 74,
  runningNow: 3,
  avgDuration: '3m 41s',
}
