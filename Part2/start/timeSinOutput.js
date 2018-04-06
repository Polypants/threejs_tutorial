var time = 0;

setInterval(function() {
  var output = Math.sin(time) * 0.5 + 0.5;
  time += 0.05;
  console.log(output);
}, 50);