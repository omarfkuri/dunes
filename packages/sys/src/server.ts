
  
import type { Prom } from "@dunes/tools";
import express, { type Express } from "express"
import http, { Server } from 'http';
import { Server as IoServer } from "socket.io";


interface ServerConfig {
  port: number
  host?: string
  assign(app: Express, express: typeof import("express")): Prom<void>
}

interface ServerResult {
  io: IoServer
  server: Server
}

export async function serve({assign, port, host}: ServerConfig): Promise<ServerResult> {
  const app = express();
  await assign(app, express);
  const server = http.createServer(app);
  const io = new IoServer(server);
  await new Promise<void>(res => server.listen(port, host || "localhost", res));

  return { io, server }
}