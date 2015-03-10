var work = require('webworkify');
var w = work(require('./work.js'));

module.exports = {
  encodeWAV: encodeWAV,
  getDownloadLink: getDownloadLink
};

function onComplete(cb) {
  w.addEventListener('message', function(ev) {
      cb(ev.data);
  });
}

function encodeWAV(input, sampleRate, cb) {
  var inputType = Object.prototype.toString.call( input );
  var leftBuffer;
  var rightBuffer;
  if(inputType === '[object AudioBuffer]'){
    leftBuffer = input.getChannelData(0);
    rightBuffer = input.numberOfChannels > 1 ? input.getChannelData(1) : undefined;
  }else if (inputType === '[object Array]'){
    leftBuffer = channelBufferArray[0];
    rightBuffer = channelBufferArray[1];
  }
  w.postMessage({
    leftBuf: leftBuffer,
    rightBuf: rightBuffer,
    sampleRate: sampleRate
  });
  onComplete(cb);
}

function getDownloadLink(cb) {
  onComplete(function(blob) {
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    cb(url);
  })
}
