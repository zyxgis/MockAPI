//--------------------------------------------------------
// npm install express mockjs supervisor glob --save-dev
// npm run Server
//--------------------------------------------------------

const express = require('express');
const os = require('os');
const fs = require('fs');
const path = require('path');
const glob = require("glob");
const URL = require('url');
// 自定义模块用来回去本机的ip地址
const getIPAdress = require('./Utils/getIPAdress.js');
const app = express();

const applicationRoot = __dirname.replace(/\\/g, "/");
const ipAddress = process.env.OPENSHIFT_NODEJS_IP || getIPAdress();
const port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

console.log(applicationRoot + "   " + ipAddress + "   " + port);

//
/* app.configure(function() {
  app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}); */

//
app.use('/lottery', require('./model/lottery'));


//允许客户端进行跨域访问
app.all('/api/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//获取mock 数据源
const commentData = require('./detail/comment.js');
app.get('/api/:star', function (req, res) {
  res.send(commentData.data.filter(item => {
    return item.star === parseInt(req.params['star']);
  }));
});

//404
app.get('/404', function (req, res) {
  // res.render('404.html', {
  //   title: 'No Found'
  // })
  res.status(404);
  res.redirect('/404.html');
});

// 不满足url进行重定向
app.get('*', function (req, res) {
  var urlObj = URL.parse(req.url);
  console.log(urlObj.path);
  var urlPath = urlObj.path;
  var index = urlPath.indexOf('?');
  if (index > -1) {
    urlPath = urlPath.substring(0, urlPath.indexOf('?'));
  }
  var filePath = path.join(applicationRoot, urlPath);
  if (fs.existsSync(filePath)) {
    var contentText = fs.readFileSync(filePath, 'utf-8');
    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err) throw err;
      res.send(data);
      // var data = JSON.parse(data)
      // if (data[req.params.apiName]) {
      //   res.json(data[req.params.apiName])
      // } else {
      //   res.send(data)
      // }
    });
  } else {
    res.status(404);
    res.redirect('/404.html')
    //
    /* var data = fs.readFileSync(fileName, 'utf8');
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.write(data);
    res.end(); */
    //
  }
});

//监听服务端口 输出配置信息
const server = app.listen(port, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Mork Server address http://' + ipAddress + ':' + port + '/api');
});