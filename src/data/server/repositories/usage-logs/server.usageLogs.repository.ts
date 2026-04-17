import { getFirebaseServerRepositoryCreator, serializeEntity } from '@/data/server/repositories/server.repository.utils';
import { UsageLogQueryOptions, UsageLogsServerRepository } from '@/data/server/repositories/usage-logs/server.usageLogs.repository.types';
import { UsageLogEntity } from '@/openai/tracking';
import { Timestamp } from 'firebase-admin/firestore';

export const usageLogsServerRepository = getFirebaseServerRepositoryCreator('usage-logs')<UsageLogsServerRepository>(({
  db,
  collectionName,
}) => {
  const buildQuery = (query: FirebaseFirestore.Query, options?: UsageLogQueryOptions) => {
    let builtQuery = query;

    if (options?.startDate) {
      builtQuery = builtQuery.where('createdAt', '>=', Timestamp.fromDate(options.startDate));
    }

    if (options?.endDate) {
      builtQuery = builtQuery.where('createdAt', '<=', Timestamp.fromDate(options.endDate));
    }

    builtQuery = builtQuery.orderBy('createdAt', options?.orderBy === 'asc' ? 'asc' : 'desc');

    if (options?.limit) {
      builtQuery = builtQuery.limit(options.limit);
    }

    return builtQuery;
  };

  return {
    createUsageLog: async (data) => {
      const now = Timestamp.now().toDate();

      const usageLogEntity: Omit<UsageLogEntity, 'id'> = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection(collectionName).add(usageLogEntity);
      const doc = await docRef.get();

      return serializeEntity<UsageLogEntity>({ id: doc.id, ...doc.data()! });
    },

    getUsageLogsByUserId: async (userId, options) => {
      let query = db.collection(collectionName).where('userId', '==', userId);
      query = buildQuery(query, options);

      const snapshot = await query.get();
      return snapshot.docs.map((doc) => serializeEntity<UsageLogEntity>({ id: doc.id, ...doc.data() }));
    },

    getUsageLogsByFeature: async (feature, options) => {
      let query = db.collection(collectionName).where('feature', '==', feature);
      query = buildQuery(query, options);

      const snapshot = await query.get();
      return snapshot.docs.map((doc) => serializeEntity<UsageLogEntity>({ id: doc.id, ...doc.data() }));
    },

    getUsageLogsByUserIdAndFeature: async (userId, feature, options) => {
      let query = db.collection(collectionName).where('userId', '==', userId).where('feature', '==', feature);
      query = buildQuery(query, options);

      const snapshot = await query.get();
      return snapshot.docs.map((doc) => serializeEntity<UsageLogEntity>({ id: doc.id, ...doc.data() }));
    },
  };
});
