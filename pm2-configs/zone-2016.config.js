// Only use this for h1emu community servers that can't use docker
module.exports = {
    apps : [
        {
          name: "zoneserver2016",
          script: "./docker/2016/zoneServer.js",
          output: './out.log',
          error: './error.log',
          merge_logs: true,
          watch: true,
          env: {
            "NODE_ENV": "production",
            "WORLD_ID": "FILLTHIS",
            "MONGO_URL": "mongodb://localhost:27017/",
          }
        }
    ]
  }