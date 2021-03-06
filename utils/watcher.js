(function (exports) {

  var watchr = require('watchr');
  var child_process = require('child_process');

  function spawn(command, args, callback) {
    var child;
    child = child_process.spawn(command, args);
    child.stdout.on('data', function(data) {
      return console.log("stdout from '" + command + "': " + data);
    });
    child.stderr.on('data', function(data) {
      return console.error("stderr from '" + command + "': " + data);
    });
    return child.on('exit', function(code) {
      console.log("'" + command + "' exited with code " + code);
      return typeof callback === "function" ? callback(code) : void 0;
    });
  };

  exports.watch = function() {
    var watcher = this;
    watchr.watch({
      paths: ['models/','controllers/','client-utils/', 'views/', 'backbone/'],
      listeners: {
        error: function(err){
            console.log('an error occured:', err);
        },
        watching: function(err,watcherInstance,isWatching){
            if (err) {
                console.log("watching the path " + watcherInstance.path + " failed with error", err);
            } else {
                console.log("watching the path " + watcherInstance.path + " completed");
            }
        },
        change: function(changeType,filePath,fileCurrentStat,filePreviousStat){
          watcher.packageFiles();
        }
      }
    });
  };

  exports.packageFiles = function() {
    console.log('Packaging files using jammit');
    return spawn('jammit', ['-c', 'config/jammit.yaml', '-o', 'public/javascripts']);
  };

}(exports));