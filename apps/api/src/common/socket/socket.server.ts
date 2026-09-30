import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { verifyAccessToken, AccessTokenPayload } from "@/common/utils/tokens";
import { logger } from "@/config/logger";
import { env } from "@/config/env";

let io: SocketIOServer | null = null;

export function initSocketServer(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    },
    path: "/socket.io",
  });

  // Authentication Middleware for Socket Connection Handshake
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "");

      if (!token) {
        return next(new Error("Authentication token missing"));
      }

      const decoded = verifyAccessToken(token);
      socket.data.user = decoded;
      return next();
    } catch (err) {
      logger.warn({ err }, "Socket connection unauthorized");
      return next(new Error("Unauthorized socket handshake"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user as AccessTokenPayload;

    if (!user) {
      socket.disconnect(true);
      return;
    }

    // Auto-join user-specific and role-based Socket rooms
    const userRoom = `user:${user.sub}`;
    const roleRoom = `role:${user.role}`;

    socket.join(userRoom);
    socket.join(roleRoom);

    logger.info(
      { userId: user.sub, role: user.role, socketId: socket.id },
      `Socket connected and joined rooms [${userRoom}], [${roleRoom}]`,
    );

    socket.on("disconnect", (reason) => {
      logger.info({ userId: user.sub, socketId: socket.id, reason }, "Socket disconnected");
    });
  });

  return io;
}

/** Get active Socket.IO server instance */
export function getIO(): SocketIOServer | null {
  return io;
}

/** Broadcast event to a specific role room (e.g. role:SUPER_ADMIN) */
export function emitToRole(role: string, event: string, data: unknown): void {
  if (io) {
    io.to(`role:${role}`).emit(event, data);
  }
}

/** Emit event to a specific user ID room (e.g. user:usr-1001) */
export function emitToUser(userId: string, event: string, data: unknown): void {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
}
