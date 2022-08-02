export DEBUG="ZoneServer"
export CLIENT_SIXTEEN="true"
#remove LOGINSERVER if you want to use h1emu community list
export WORLD_ID="21"
export MONGO_URL="mongodb://localhost:27017/"
pm2 kill
pm2 start mongo-gui
pm2 start docker/2016/zoneServer.js --watch
export DEBUG="*"
pm2 startup
echo try pm2 stop/start id when you get an error about mongoDB write
sleep 5
