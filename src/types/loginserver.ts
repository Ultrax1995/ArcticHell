// ======================================================================
//
//   GNU GENERAL PUBLIC LICENSE
//   Version 3, 29 June 2007
//   copyright (C) 2020 - 2021 Quentin Gruber
//   copyright (C) 2021 - 2022 H1emu community
//
//   https://github.com/QuentinGruber/h1z1-server
//   https://www.npmjs.com/package/h1z1-server
//
//   Based on https://github.com/psemu/soe-network
// ======================================================================

export interface Client {
  sessionId: number;
  loginSessionId: string;
  address: string;
  port: number;
  crcSeed: number;
  crcLength: number;
  waitingQueue: any[];
  waitQueueTimer: NodeJS.Timeout;
  clientUdpLength: number;
  serverUdpLength: number;
  sequences: any;
  compression: number;
  useEncryption: boolean;
  protocolName: string;
  outQueue: any;
  outOfOrderPackets: any;
  nextAck: number;
  lastAck: number;
  cryptoKey: Uint8Array;
  serverUpdateTimer: ReturnType<typeof setTimeout>;
  waitingQueueCurrentByteLength: number;
  inputStream: () => void;
  outputStream: () => void;
  outQueueTimer: () => void;
  ackTimer: () => void;
  outOfOrderTimer: () => void;
  clearTimers: () => void;
}

export interface SoeServer {
  on: (arg0: string, arg1: any) => void;
  start: (
    compression: any,
    crcSeed: any,
    crcLength: any,
    udpLength: any
  ) => void;
  stop: () => void;
  _sendPacket: (
    client: Client,
    packetName: string,
    packet: any,
    prioritize?: boolean | undefined
  ) => void;
  sendAppData: (arg0: Client, arg1: any, arg2: undefined | any) => void;
  toggleEncryption: (arg0: Client) => void;
  setEncryption: (client: Client, value: boolean) => void;
  deleteClient: (client: Client) => void;
}

export interface GameServer {
  serverId: number;
  serverState: number;
  locked: boolean;
  name: string;
  nameId: number;
  description: string;
  descriptionId: number;
  reqFeatureId: number;
  serverInfo: string;
  populationLevel: number;
  populationData: string;
  allowedAccess: boolean;
}
