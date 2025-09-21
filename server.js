const expressApp = require("./http/http-server");
// const createWebSocketServer = require("./server/ws/ws-server"); // TODO update import

const PORT = 3000;

expressApp.listen(PORT, () => {
    console.log(`Star Wars Villainous express app running on port ${PORT}`);
});

// createWebSocketServer(4000);
