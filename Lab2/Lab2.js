/*
 * Computer Graphics - Lab #2
 * Surface Shading
 *
 */
 
 function createVector(point1, point2)
 {
	 var vec = [point2[0] - point1[0], point2[1] - point1[1]];
	 return vec;
 }
 
 function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return [r, g, b];
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

function render() {
  var canvas = document.getElementById("viewport-main");
  var ctx = canvas.getContext('2d');

  var color = document.getElementById("reflectance").value;
  var ambientColor = document.getElementById("ambient").value;
  // TODO implement Phong illumination model to compute shaded color
  var diffuseColor = color;
  var specularColor = computerSpecular(lightColor,normalVec,eyeVec);
  var totalColor = color;
  

  var refPos = [ 400, 480 ];
  var lightPos = [ 0, 0 ];
  var eyePos = [ 0, 0 ];

  var normalVec = [ 0, 1 ];
  var lightVec = [ 0, 0 ];
  var eyeVec = [ 0, 0 ];
  
  function dotProduct(normalVec, lightVec) {
	  var product = (normalVec[0]  * lightVec[0]) + (normalVec[1] * lightVec[1]);
	  return product;
  }
  
  function getAngle(product) {
	  var angle = Math.acos(product);
	  return angle;
  }

  var param = document.querySelector("input[name='params']:checked").value;
  /*
   * Use conditional to change either light or eye position.

  switch (param) {
  case "e":
  case "l":
  default: break;
  }
  */

  var theta = 30;
  var phi = -45;

  ctx.fillStyle = color;
  ctx.fillRect(80, 480, 640, 40);
  
  diffuseColor = calcDiffuseColor(normalVec, lightVec, color, lightColor);

  ctx.fillStyle = diffuseColor;
  ctx.fillRect(1024, 120, 120, 120);
  ctx.fillStyle = specularColor;
  ctx.fillRect(1024, 120, 120, 120);

  lineToAngle(ctx, refPos, 150, -90);
  lineToAngle(ctx, refPos, 150, -90 - theta);
  lineToAngle(ctx, refPos, 150, -90 - phi);

}
// Compute specularColor
function computerSpecular(lightColor,e, r){
  var dotProd =dotProduct(e,r)
  if(dotProd<0){
    dotProd=0
  }
  var specColor= 1*lightColor*dotProd
  return specColor

function calcDiffuseColor(n, l, surfaceColor, lightColor){
  var dProduct = dotProduct(n,l);
  if(dProduct < 0)
    dProduct = 0;
  
  var diffuseColor = surfaceColor * lightColor * dProduct;
  if(diffuseColor > 1)
	diffuseColor = 1;
  
  return diffuseColor;
}

window.onload = init;

