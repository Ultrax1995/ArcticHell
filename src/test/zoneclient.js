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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoneClient2016 = void 0;
const character_1 = require("./character");
class ZoneClient2016 {
    constructor(sessionId, soeClientId, loginSessionId, characterId, transientId) {
        this.firstLoading = false;
        this.isLoading = true;
        this.isInteracting = false;
        this.isAdmin = false;
        this.posAtLastRoutine = new Float32Array();
        this.posAtLogoutStart = new Float32Array();
        this.spawnedDTOs = [];
        this.spawnedEntities = [];
        this.managedObjects = [];
        this.vehicle = {};
        this.lastKeepAliveTime = 0;
        this.pings = [];
        this.avgPing = 0;
        this.sessionId = sessionId;
        this.soeClientId = soeClientId;
        this.isLoading = true;
        this.firstLoading = true;
        this.loginSessionId = loginSessionId;
        this.spawnedEntities = [];
        this.managedObjects = [];
        this.clearTimers = () => {
            clearTimeout(this.npcsToSpawnTimer);
        };
        this.clearHudTimer = () => {
            if (this.hudTimer) {
                clearTimeout(this.hudTimer);
            }
            this.hudTimer = null;
            this.isInteracting = false;
        };
        this.character = new character_1.Character2016(characterId, transientId);
    }
}
exports.ZoneClient2016 = ZoneClient2016;
//# sourceMappingURL=zoneclient.js.map