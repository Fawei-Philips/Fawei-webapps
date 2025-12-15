import { Client } from '@stomp/stompjs';
import type { IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { RABBITMQ_WS_URL, STORAGE_KEYS } from '../utils/config';
import type { RealTimeUpdate } from '../types';

export type MessageCallback = (message: RealTimeUpdate) => void;

export class RabbitMQService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageHandlers: Map<string, MessageCallback[]> = new Map();

  connect(onConnected?: () => void, onError?: (error: any) => void): void {
    if (this.client?.connected) {
      console.log('Already connected to RabbitMQ');
      return;
    }

    // Create a SockJS instance
    const socket = new SockJS(RABBITMQ_WS_URL);

    this.client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      onConnect: () => {
        console.log('Connected to RabbitMQ');
        this.reconnectAttempts = 0;
        if (onConnected) onConnected();
        this.resubscribeAll();
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        if (onError) onError(frame);
      },
      onDisconnect: () => {
        console.log('Disconnected from RabbitMQ');
        this.handleReconnect();
      },
    });

    // Add authorization header if token exists
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      this.client.connectHeaders = {
        Authorization: `Bearer ${token}`,
      };
    }

    this.client.activate();
  }

  disconnect(): void {
    if (this.client) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
      this.subscriptions.clear();
      this.client.deactivate();
      this.client = null;
    }
  }

  subscribe(destination: string, callback: MessageCallback): string {
    if (!this.client?.connected) {
      console.warn('Not connected to RabbitMQ. Message handler will be registered for when connection is established.');
    }

    // Store the callback for resubscription
    const handlers = this.messageHandlers.get(destination) || [];
    handlers.push(callback);
    this.messageHandlers.set(destination, handlers);

    if (this.client?.connected) {
      const subscription = this.client.subscribe(destination, (message: IMessage) => {
        try {
          const update: RealTimeUpdate = JSON.parse(message.body);
          callback(update);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      this.subscriptions.set(destination, subscription);
      return destination;
    }

    return destination;
  }

  unsubscribe(destination: string): void {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    }
    this.messageHandlers.delete(destination);
  }

  private resubscribeAll(): void {
    this.messageHandlers.forEach((handlers, destination) => {
      handlers.forEach((callback) => {
        if (this.client?.connected) {
          const subscription = this.client.subscribe(destination, (message: IMessage) => {
            try {
              const update: RealTimeUpdate = JSON.parse(message.body);
              callback(update);
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          });
          this.subscriptions.set(destination, subscription);
        }
      });
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => {
        if (this.client && !this.client.connected) {
          this.client.activate();
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  isConnected(): boolean {
    return this.client?.connected || false;
  }
}

export const rabbitMQService = new RabbitMQService();
