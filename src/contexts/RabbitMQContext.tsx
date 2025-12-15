import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { rabbitMQService } from '../services/rabbitMQService';
import type { RealTimeUpdate } from '../types';

interface RabbitMQContextType {
  isConnected: boolean;
  subscribe: (destination: string, callback: (message: RealTimeUpdate) => void) => string;
  unsubscribe: (destination: string) => void;
  latestUpdate: RealTimeUpdate | null;
}

const RabbitMQContext = createContext<RabbitMQContextType | undefined>(undefined);

interface RabbitMQProviderProps {
  children: ReactNode;
}

export const RabbitMQProvider: React.FC<RabbitMQProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [latestUpdate, setLatestUpdate] = useState<RealTimeUpdate | null>(null);

  useEffect(() => {
    // Connect to RabbitMQ when component mounts
    const handleConnected = () => {
      console.log('RabbitMQ connected');
      setIsConnected(true);
    };

    const handleError = (error: any) => {
      console.error('RabbitMQ connection error:', error);
      setIsConnected(false);
    };

    rabbitMQService.connect(handleConnected, handleError);

    // Cleanup on unmount
    return () => {
      rabbitMQService.disconnect();
    };
  }, []);

  const subscribe = (destination: string, callback: (message: RealTimeUpdate) => void) => {
    return rabbitMQService.subscribe(destination, (message) => {
      setLatestUpdate(message);
      callback(message);
    });
  };

  const unsubscribe = (destination: string) => {
    rabbitMQService.unsubscribe(destination);
  };

  const value: RabbitMQContextType = {
    isConnected,
    subscribe,
    unsubscribe,
    latestUpdate,
  };

  return <RabbitMQContext.Provider value={value}>{children}</RabbitMQContext.Provider>;
};

export const useRabbitMQ = (): RabbitMQContextType => {
  const context = useContext(RabbitMQContext);
  if (context === undefined) {
    throw new Error('useRabbitMQ must be used within a RabbitMQProvider');
  }
  return context;
};
