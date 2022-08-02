import * as h1emu from "../../h1z1-server";

new h1emu.LoginServer(1115).start();
new h1emu.ZoneServer2016(
  1117,
  Buffer.from("F70IaxuU8C/w7FPXY1ibXw==", "base64")
).start();

setInterval(() => {
  process.stdout.write("Runtime tested\n");
  process.exit(0);
}, 2000);
