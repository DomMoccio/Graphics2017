/*
 * Computer Graphics - Lab #2
 * Surface Shading
 *
 */
var lightPos = [ 200, 100 ];
var eyePos = [ 725, 200 ];

function createVector(point1, point2) {
  var vec = [point2[0] - point1[0], point2[1] - point1[1]];
  return vec;
}

function dotProduct(normalVec, lightVec) {
  var product = (normalVec[0]  * lightVec[0]) + (normalVec[1] * lightVec[1]);
  return product;
}

function getAngle(product) {
  var angle = Math.acos(product);
  return angle;
}

function componentToHex(c) {
    var cc = Math.floor(c * 255);
    var hex = cc.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
    return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [ parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255 ] : null;
}

function init() {
  var canvas = document.getElementById("viewport-main");
  canvas.addEventListener('click', function(e) {
    if (document.getElementById("eyePos").checked)
      eyePos = [ e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop ];
    else if (document.getElementById("lightPos").checked)
      lightPos = [ e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop ];
    render();
  });
  render();
}

function lineToAngle(ctx, p, length, angle) {
    ctx.beginPath();

    angle *= Math.PI / 180;

    var x2 = p[0] + length * Math.cos(angle),
        y2 = p[1] + length * Math.sin(angle);

    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(x2, y2);

    ctx.lineWidth = 10;
    ctx.stroke();

    return {x: x2, y: y2};
}

function normalize(vec) {
  var vector_length = Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1]);
  var vectorX = vec[0] / vector_length;
  var vectorY = vec[1] / vector_length;
  var normalVec = [vectorX, vectorY];
  return(normalVec)
}

function render() {
  console.log("Render");
  var canvas = document.getElementById("viewport-main");
  var ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var refPos = [ 400, 480 ];
  var normalVec = [ 0, -1 ];
  var lightVec = normalize(createVector(refPos, lightPos));
  var reflectVec = [ -lightVec[0], lightVec[1] ];
  var eyeVec = normalize(createVector(refPos, eyePos));

  var param = document.querySelector("input[name='params']:checked").value;

  var theta = 180 / Math.PI * Math.acos(dotProduct(normalVec, lightVec));
  var phi = 180 / Math.PI * Math.acos(dotProduct(normalVec, eyeVec));
  if (lightPos[0] > refPos[0]) { theta = -theta; }
  if (eyePos[0] > refPos[0]) { phi = -phi; }


  var color = hexToRgb(document.getElementById("reflectance").value);
  var lightColor = hexToRgb(document.getElementById("light").value);
  var ambientColor = hexToRgb(document.getElementById("ambient").value);
  var hardness = document.getElementById("hardness").value;

  // TODO implement Phong illumination model to compute shaded color
  var diffuseColor = calcDiffuseColors(normalVec, lightVec, color, lightColor);
  var specularColor = computeSpeculars(lightColor, eyeVec, reflectVec, hardness);
  var totalColor = [
      Math.min(1.0, ambientColor[0] + diffuseColor[0] + specularColor[0]),
      Math.min(1.0, ambientColor[1] + diffuseColor[1] + specularColor[1]),
      Math.min(1.0, ambientColor[2] + diffuseColor[2] + specularColor[2]),
  ];
  console.log(diffuseColor, specularColor, totalColor);

  ctx.fillStyle = rgbToHex(color);
  ctx.fillRect(80, 480, 640, 40);

  ctx.beginPath();
  ctx.rect(1024, 120, 120, 120);
  ctx.fillStyle = rgbToHex(totalColor);
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 5;
  ctx.stroke();

  lineToAngle(ctx, refPos, 150, -90);
  lineToAngle(ctx, refPos, 150, -90 - theta);
  lineToAngle(ctx, refPos, 150, -90 - phi);

}

// Compute specularColor
function calcDiffuseColors(n, l, surfColor, lightColor) {
  return [
    calcDiffuseColor(n, l, surfColor[0], lightColor[0]),
    calcDiffuseColor(n, l, surfColor[1], lightColor[1]),
    calcDiffuseColor(n, l, surfColor[2], lightColor[2])
  ];
}

function computeSpeculars(color, e, r, hardness) {
  return [
    computeSpecular(color[0], e, r, hardness),
    computeSpecular(color[1], e, r, hardness),
    computeSpecular(color[2], e, r, hardness)
  ];
}

function computeSpecular(lightColor,e, r, hardness) {
  var dotProd = dotProduct(e, r);
  if (dotProd < 0) {
    dotProd = 0;
  }
  var specColor = 1 * lightColor * Math.pow(dotProd, hardness);
  return specColor;
}

function calcDiffuseColor(n, l, surfaceColor, lightColor) {
  var dProduct = dotProduct(n, l);
  if (dProduct < 0)
    dProduct = 0;

  var diffuseColor = surfaceColor * lightColor * dProduct;
  if (diffuseColor > 1)
  diffuseColor = 1;

  return diffuseColor;
}

window.onload = init;

