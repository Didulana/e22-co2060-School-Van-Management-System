import { Server } from "socket.io";

let ioInstance: Server | null = null;

export function initSocket(io: Server): void {
  ioInstance = io;
}

export function getSocket(): Server {
  if (!ioInstance) {
    throw new Error("Socket.io has not been initialized.");
  }

  return ioInstance;
}

export function journeyRoom(journeyId: number): string {
  return `journey:${journeyId}`;
}

export function userRoom(userId: number): string {
  return `user:${userId}`;
}

export function emitToRoom<T>(room: string, event: string, payload: T): void {
  getSocket().to(room).emit(event, payload);
}

export function emitToUser<T>(userId: number, event: string, payload: T): void {
  getSocket().to(userRoom(userId)).emit(event, payload);
}