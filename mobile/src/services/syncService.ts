import api from './api';
import {
  getQueue,
  clearQueue,
  saveCachedWorkouts,
  type OfflineOperation,
} from './offlineStorage';

/**
 * Process all queued offline operations, then refresh cache from server.
 * Returns true if sync was successful, false otherwise.
 */
export async function processQueue(): Promise<boolean> {
  const queue = await getQueue();

  if (queue.length === 0) {
    // No pending operations — just refresh cache from server
    return refreshCacheFromServer();
  }

  // Sort by timestamp to process in order
  const sorted = [...queue].sort((a, b) => a.timestamp - b.timestamp);

  let allSuccess = true;

  for (const op of sorted) {
    try {
      await processOperation(op);
    } catch (error) {
      console.warn(`Sync failed for operation ${op.id}:`, error);
      allSuccess = false;
      // Continue processing other operations
    }
  }

  // Clear queue after processing (even partial success)
  await clearQueue();

  // Refresh local cache with fresh data from server
  await refreshCacheFromServer();

  return allSuccess;
}

async function processOperation(op: OfflineOperation): Promise<void> {
  switch (op.type) {
    case 'CREATE':
      await api.post('/workouts', op.data);
      break;

    case 'UPDATE':
      if (op.data.workoutId && !op.data.workoutId.startsWith('offline_')) {
        await api.patch(`/workouts/${op.data.workoutId}`, op.data.updates);
      }
      break;

    case 'DELETE':
      if (op.data.workoutId && !op.data.workoutId.startsWith('offline_')) {
        await api.delete(`/workouts/${op.data.workoutId}`);
      }
      break;
  }
}

/**
 * Fetch fresh workouts from server and update local cache.
 */
export async function refreshCacheFromServer(): Promise<boolean> {
  try {
    const response = await api.get('/workouts');
    await saveCachedWorkouts(response.data || []);
    return true;
  } catch (error) {
    console.warn('Failed to refresh cache from server:', error);
    return false;
  }
}
