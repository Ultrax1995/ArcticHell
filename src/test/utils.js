"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDamageDistFallOff = exports.getRandomKeyFromAnObject = exports.validateVersion = exports.getRandomFromArray = exports.bigIntToHexString = exports.wrappedUint16 = exports.Scheduler = exports.clearFolderCache = exports.getPacketTypeBytes = exports.initMongo = exports.lz4_decompress = exports.LZ4 = exports.generateCommandList = exports.removeCacheFullDir = exports.generateTransientId = exports.generateRandomGuid = exports.Int64String = exports.toInt = exports.createPositionUpdate = exports.getDistance = exports.isPosInRadius = exports.isInside = exports.objectIsEmpty = exports.setupAppDataFolder = exports.getAppDataFolderPath = exports.randomIntFromInterval = exports.zoneShutdown = exports.eul2quatLegacy = exports.quat2matrix = exports.eul2quat = exports._ = exports.customLodash = void 0;
const h1emu_core_1 = require("h1emu-core");
const v8_1 = __importDefault(require("v8"));
const lz4_1 = require("./lz4/lz4");
const fs_1 = __importStar(require("fs"));
const path_1 = require("path");
const promises_1 = require("timers/promises");
const constants_1 = require("./constants");
class customLodash {
    sum(pings) {
        return pings.reduce((a, b) => a + b, 0);
    }
    cloneDeep(value) {
        return v8_1.default.deserialize(v8_1.default.serialize(value));
    }
    find(array, filter) {
        return array.find(filter);
    }
    isEqual(array1, array2) {
        return (Array.isArray(array1) &&
            Array.isArray(array2) &&
            array1.length === array2.length &&
            array1.every((val, index) => val === array2[index]));
    }
    forEach(object, callback) {
        const objectLength = Object.keys(object).length;
        const objectValues = Object.values(object);
        for (let index = 0; index < objectLength; index++) {
            callback(objectValues[index]);
        }
    }
    size(object) {
        return Object.keys(object).length;
    }
    fill(array, object) {
        for (let index = 0; index < array.length; index++) {
            array[index] = object;
        }
        return array;
    }
    delete(array, entry) {
        const index = array.indexOf(entry);
        if (index > -1) {
            array.splice(index, 1);
        }
    }
}
exports.customLodash = customLodash;
exports._ = new customLodash();
// Original code from GuinnessRules
function eul2quat(angle) {
    // Assuming the angles are in radians.
    const heading = angle[0], attitude = angle[1], bank = -angle[2];
    const c1 = Math.cos(heading / 2);
    const s1 = Math.sin(heading / 2);
    const c2 = Math.cos(attitude / 2);
    const s2 = Math.sin(attitude / 2);
    const c3 = Math.cos(bank / 2);
    const s3 = Math.sin(bank / 2);
    const c1c2 = c1 * c2;
    const s1s2 = s1 * s2;
    const qw = c1c2 * c3 - s1s2 * s3;
    const qy = s1 * c2 * c3 + c1 * s2 * s3;
    const qz = c1c2 * s3 + s1s2 * c3;
    const qx = c1 * s2 * c3 - s1 * c2 * s3;
    return new Float32Array([qx, qy, -qz, qw]);
}
exports.eul2quat = eul2quat;
function quat2matrix(angle) {
    // a little modified for my needs, may not work for other things than construction
    const x = angle[0];
    const y = angle[1];
    const z = angle[2];
    const w = 0;
    const n = w * w + x * x + y * y + z * z;
    const s = n === 0 ? 0 : 2 / n;
    const wx = s * w * x, wy = s * w * y, wz = s * w * z;
    const xx = s * x * x, xy = s * x * y, xz = s * x * z;
    const yy = s * y * y, yz = s * y * z, zz = s * z * z;
    return [
        1 - (yy + zz), xy - wz, xz + wy,
        xy + wz, 1 - (xx + zz), yz - wx,
        xz - wy, yz + wx, 1 - (xx + yy)
    ];
}
exports.quat2matrix = quat2matrix;
function eul2quatLegacy(angle) {
    // Assuming the angles are in radians.
    const heading = angle[0], attitude = angle[1], bank = -angle[2];
    const c1 = Math.cos(heading / 2);
    const s1 = Math.sin(heading / 2);
    const c2 = Math.cos(attitude / 2);
    const s2 = Math.sin(attitude / 2);
    const c3 = Math.cos(bank / 2);
    const s3 = Math.sin(bank / 2);
    const c1c2 = c1 * c2;
    const s1s2 = s1 * s2;
    const qw = c1c2 * c3 - s1s2 * s3;
    const qy = s1 * c2 * c3 + c1 * s2 * s3;
    const qz = c1c2 * s3 + s1s2 * c3;
    const qx = c1 * s2 * c3 - s1 * c2 * s3;
    return [qx, qy, -qz, qw];
}
exports.eul2quatLegacy = eul2quatLegacy;
async function zoneShutdown(server, startedTime, timeLeft, message) {
    const timeLeftMs = timeLeft * 1000;
    const currentTimeLeft = timeLeftMs - (Date.now() - startedTime);
    if (currentTimeLeft < 0) {
        server.sendDataToAll("WorldShutdownNotice", {
            timeLeft: 0,
            message: message,
        });
        server.sendDataToAll("CharacterSelectSessionResponse", {
            status: 1,
            sessionId: "0", // TODO: get sessionId from client object
        });
        setTimeout(() => {
            process.exit(0);
        }, 5000);
    }
    else {
        server.sendDataToAll("WorldShutdownNotice", {
            timeLeft: currentTimeLeft / 1000,
            message: message,
        });
        setTimeout(() => zoneShutdown(server, startedTime, timeLeft, message), timeLeftMs / 5);
    }
}
exports.zoneShutdown = zoneShutdown;
const randomIntFromInterval = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};
exports.randomIntFromInterval = randomIntFromInterval;
const getAppDataFolderPath = () => {
    const folderName = "h1emu";
    return `${process.env.APPDATA || process.env.HOME}/${folderName}`;
};
exports.getAppDataFolderPath = getAppDataFolderPath;
const setupAppDataFolder = () => {
    const AppDataFolderPath = (0, exports.getAppDataFolderPath)();
    if (!fs_1.default.existsSync(AppDataFolderPath)) {
        fs_1.default.mkdirSync(AppDataFolderPath);
    }
    if (!fs_1.default.existsSync(`${AppDataFolderPath}/single_player_characters.json`)) {
        fs_1.default.writeFileSync(`${AppDataFolderPath}/single_player_characters.json`, JSON.stringify([]));
    }
    if (!fs_1.default.existsSync(`${AppDataFolderPath}/single_player_characters2016.json`)) {
        fs_1.default.writeFileSync(`${AppDataFolderPath}/single_player_characters2016.json`, JSON.stringify([]));
    }
};
exports.setupAppDataFolder = setupAppDataFolder;
const objectIsEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};
exports.objectIsEmpty = objectIsEmpty;
const isBetween = (radius, value1, value2) => {
    return value1 <= value2 + radius && value1 >= value2 - radius;
};
const isInside = (point, vs) => {
    var x = point[0], y = point[1];
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect)
            inside = !inside;
    }
    return inside;
};
exports.isInside = isInside;
const isPosInRadius = (radius, player_position, enemi_position) => {
    return (isBetween(radius, player_position[0], enemi_position[0]) &&
        isBetween(radius, player_position[2], enemi_position[2]));
};
exports.isPosInRadius = isPosInRadius;
function getDistance(p1, p2) {
    const a = p1[0] - p2[0];
    const b = p1[1] - p2[1];
    const c = p1[2] - p2[2];
    return Math.sqrt(a * a + b * b + c * c);
}
exports.getDistance = getDistance;
function createPositionUpdate(position, rotation, gameTime) {
    const obj = {
        flags: 4095,
        sequenceTime: gameTime,
        position: [...position],
    };
    if (rotation) {
        obj.rotation = rotation;
    }
    return obj;
}
exports.createPositionUpdate = createPositionUpdate;
const toInt = (value) => {
    return Number(value.toFixed(0));
};
exports.toInt = toInt;
const Int64String = function (value) {
    return "0x" + ("0000000000000000" + value.toString(16)).substr(-16);
};
exports.Int64String = Int64String;
const generateRandomGuid = function () {
    return "0x" + (0, h1emu_core_1.generate_random_guid)();
};
exports.generateRandomGuid = generateRandomGuid;
function* generateTransientId() {
    let id = 0;
    for (let index = 0; index < constants_1.MAX_TRANSIENT_ID; index++) {
        yield id++;
    }
}
exports.generateTransientId = generateTransientId;
const removeCacheFullDir = function (directoryPath) {
    const files = (0, fs_1.readdirSync)(directoryPath); // need to be sync
    for (const file of files) {
        if (!file.includes(".")) {
            // if it's a folder ( this feature isn't tested but should work well )
            (0, exports.removeCacheFullDir)(`${directoryPath}/${file}`);
        }
        if (file.substring(file.length - 3) === ".js") {
            delete require.cache[(0, path_1.normalize)(`${directoryPath}/${file}`)];
        }
    }
};
exports.removeCacheFullDir = removeCacheFullDir;
const generateCommandList = (commandObject, commandNamespace) => {
    const commandList = [];
    Object.keys(commandObject).forEach((key) => {
        commandList.push(`/${commandNamespace} ${key}`);
    });
    return commandList;
};
exports.generateCommandList = generateCommandList;
class LZ4 {
}
exports.LZ4 = LZ4;
LZ4.encodeBlock = lz4_1.compress;
LZ4.encodeBound = lz4_1.compressBound;
const lz4_decompress = function (
// from original implementation
data, inSize, outSize) {
    const outdata = new Buffer.alloc(outSize);
    let offsetIn = 0, offsetOut = 0;
    // eslint-disable-next-line no-constant-condition
    while (1) {
        const token = data[offsetIn];
        let literalLength = token >> 4;
        let matchLength = token & 0xf;
        offsetIn++;
        if (literalLength) {
            if (literalLength == 0xf) {
                while (data[offsetIn] == 0xff) {
                    literalLength += 0xff;
                    offsetIn++;
                }
                literalLength += data[offsetIn];
                offsetIn++;
            }
            data.copy(outdata, offsetOut, offsetIn, offsetIn + literalLength);
            offsetIn += literalLength;
            offsetOut += literalLength;
        }
        if (offsetIn < data.length - 2) {
            const matchOffset = data.readUInt16LE(offsetIn);
            offsetIn += 2;
            if (matchLength == 0xf) {
                while (data[offsetIn] == 0xff) {
                    matchLength += 0xff;
                    offsetIn++;
                }
                matchLength += data[offsetIn];
                offsetIn++;
            }
            matchLength += 4;
            const matchStart = offsetOut - matchOffset;
            const matchEnd = offsetOut - matchOffset + matchLength;
            for (let i = matchStart; i < matchEnd; i++) {
                outdata[offsetOut] = outdata[i];
                offsetOut++;
            }
        }
        else {
            break;
        }
    }
    return outdata;
};
exports.lz4_decompress = lz4_decompress;
const initMongo = async function (mongoClient, serverName) {
    const debug = require("debug")(serverName);
    const dbName = "h1server";
    await mongoClient.db(dbName).createCollection("servers");
    const servers = require("../../data/defaultDatabase/shared/servers.json");
    await mongoClient.db(dbName).collection("servers").insertMany(servers);
    await mongoClient.db(dbName).createCollection("zone-whitelist");
    const zoneWhitelist = require("../../data/defaultDatabase/shared/zone-whitelist.json");
    await mongoClient
        .db(dbName)
        .collection("zone-whitelist")
        .insertMany(zoneWhitelist);
    debug("h1server database was missing... created one with samples.");
};
exports.initMongo = initMongo;
const getPacketTypeBytes = function (packetType) {
    const packetTypeBytes = [];
    for (let i = 0; i < 4; i++) {
        packetTypeBytes.unshift(packetType & 0xff);
        packetType = packetType >>> 8;
        if (packetType <= 0) {
            break;
        }
    }
    return packetTypeBytes;
};
exports.getPacketTypeBytes = getPacketTypeBytes;
const clearFolderCache = (currentFolderDirname, folderPath) => {
    const resolvedPath = (0, path_1.resolve)(currentFolderDirname, folderPath);
    Object.keys(require.cache).forEach((key) => {
        if (key.includes(resolvedPath)) {
            delete require.cache[key];
        }
    });
};
exports.clearFolderCache = clearFolderCache;
// experimental custom implementation of the scheduler API
class Scheduler {
    static async yield() {
        return await (0, promises_1.setImmediate)();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async wait(delay, options) {
        return await (0, promises_1.setTimeout)(delay, undefined, {
            signal: options?.signal,
        });
    }
}
exports.Scheduler = Scheduler;
class wrappedUint16 {
    constructor(initValue) {
        if (initValue > constants_1.MAX_UINT16) {
            throw new Error("wrappedUint16 can only hold values up to 65535");
        }
        this.value = initValue;
    }
    static wrap(value) {
        let uint16 = value;
        if (uint16 > constants_1.MAX_UINT16) {
            uint16 -= constants_1.MAX_UINT16 + 1; // subtract the overflow value;
        }
        return uint16;
    }
    add(value) {
        this.value = wrappedUint16.wrap(this.value + value);
    }
    set(value) {
        this.value = wrappedUint16.wrap(value);
    }
    get() {
        return this.value;
    }
    increment() {
        this.add(1);
    }
}
exports.wrappedUint16 = wrappedUint16;
const bigIntToHexString = (bigInt) => {
    return `0x${bigInt.toString(16)}`;
};
exports.bigIntToHexString = bigIntToHexString;
const getRandomFromArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};
exports.getRandomFromArray = getRandomFromArray;
function validateVersion(loginVersion, zoneVersion) {
    const [loginMajor, loginMinor, loginPatch] = loginVersion.split(".");
    const [zoneMajor, zoneMinor, zonePatch] = zoneVersion.split(".");
    if (loginMajor > zoneMajor) {
        return false;
    }
    if (loginMinor > zoneMinor) {
        return false;
    }
    if (loginPatch > zonePatch) {
        return false;
    }
    return true;
}
exports.validateVersion = validateVersion;
const getRandomKeyFromAnObject = (object) => {
    const keys = Object.keys(object);
    return keys[Math.floor(Math.random() * keys.length)];
};
exports.getRandomKeyFromAnObject = getRandomKeyFromAnObject;
function calculateDamageDistFallOff(distance, damage, range) {
    //return damage / (distance * range);
    return damage * Math.pow(range, distance / 10);
}
exports.calculateDamageDistFallOff = calculateDamageDistFallOff;
//# sourceMappingURL=utils.js.map