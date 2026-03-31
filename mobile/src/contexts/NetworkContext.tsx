import React, {createContext, useContext, useState, useEffect, useRef, type ReactNode} from 'react';
import NetInfo, {type NetInfoState} from '@react-native-community/netinfo';
import {useAuth} from './AuthContext';
import {processQueue} from '../services/syncService';
import {hasQueuedOperations} from '../services/offlineStorage';

interface NetworkContextType {
  isOnline: boolean;
  isSyncing: boolean;
  pendingSync: boolean;
}

const NetworkContext = createContext<NetworkContextType>({
  isOnline: true,
  isSyncing: false,
  pendingSync: false,
});

export function NetworkProvider({children}: {children: ReactNode}) {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingSync, setPendingSync] = useState(false);
  const {isAuthenticated} = useAuth();
  const wasOffline = useRef(false);

  // Check for pending operations on mount
  useEffect(() => {
    hasQueuedOperations().then(setPendingSync);
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const online = !!(state.isConnected && state.isInternetReachable !== false);

      setIsOnline(online);

      if (!online) {
        wasOffline.current = true;
        return;
      }

      // Came back online — trigger sync if authenticated and was offline
      if (wasOffline.current && isAuthenticated) {
        wasOffline.current = false;
        triggerSync();
      }
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const triggerSync = async () => {
    const hasPending = await hasQueuedOperations();
    if (!hasPending) {
      setPendingSync(false);
      return;
    }

    setIsSyncing(true);
    setPendingSync(true);

    try {
      await processQueue();
      setPendingSync(false);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <NetworkContext.Provider value={{isOnline, isSyncing, pendingSync}}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork(): NetworkContextType {
  return useContext(NetworkContext);
}
