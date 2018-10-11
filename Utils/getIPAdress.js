const os = require('os');

//
let getIPAdress = function() {
  let interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {        
        return alias.address;

      }
    }
  }
  return '127.0.0.1';
}

//获取hostName
let getHostName = function () {
  return os.hostname();
}

module.exports = getIPAdress;