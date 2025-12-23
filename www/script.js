let scaleFactor = 5;
const svgWidth = 150.0;
const svgHeight = 150.0;
const amrColors = [
  "red",
  "green",
  "blue",
  "orange",
  "purple",
  "turquoise"
]

const testing = 0;
let IP = ''

if(testing === 1){
  console.log("Testing: " + testing)
  IP = 'https://192.168.1.2'
}

async function getToken(u, p) {
  const token = await fetch(IP + '/identity-manager/api/v2/auth/token?dryrun=false', {
  //const token = await fetch('/identity-manager/api/v2/auth/token?dryrun=false', {
      method: "POST",
      headers: {
          "Content-Type" : "application/json",
          "accept": "application/json"
      },
      body: JSON.stringify({
          "password": p,
          "name": u
      })
  }).then(response => response.json())
  .then(response => {
      t = response.access_token
      getCoords(t);
      setInterval(() => {
          readPosition(t);
      }, 1000);
  }) 
}

function genHeaders(token) {
  return headers = {
    "Authorization" : "Bearer " + token,
    "Content-Type" : "application/json"
  }
}

async function getCoords(token) {
  const points = await fetch(IP + '/solutions/files/DefaultSolution/configurations/appdata/amr-map%2FHMI_Map.txt', {
  //const points = await fetch('/solutions/files/DefaultSolution/configurations/appdata/amr-map%2FHMI_Map.txt', {
    method: "GET",
    headers : genHeaders(token)
  })
  .then(response => response.text())
  .then(data => {
    let lines = data.split('\n')
    let coords = [];
    lines.forEach(el => {
      coords.push(el.split(" ")); 
    });

    console.log(coords)

    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    ctx.translate(-22840, 9620);
    ctx.rotate(-90*(Math.PI / 180));

    coords.forEach(el => {
      ctx.beginPath();
      ctx.arc(el[0], el[1], 10, 0, 2*Math.PI);
      ctx.fillStyle = "black";
      ctx.fill(); 
      ctx.stroke();
    });

    // Visualize min/max data points
    // ctx.fillStyle = 'red';
    // ctx.fillRect(-860, 22840, 100, 100);
    // ctx.fillRect(-860, 40620, 100, 100);
    // ctx.fillRect(9520, 40620, 100, 100);
    // ctx.fillRect(9520, 22840, 100, 100);
    
  })
}

// function animate(x, y) {
//     ctx2.clearRect(-860, 22840, 10380, 17780);

//     let p = new Path2D("M 75.000073 5.3846842 A 62.147687 47.279731 0 0 0 25.384497 24.211442 L 25.384497 25.173657 L 25.173657 25.173657 L 25.173657 124.82649 L 25.50387 124.82649 L 25.50387 126.11737 A 62.147687 47.279731 0 0 0 75.119446 144.94464 A 62.147687 47.279731 0 0 0 124.73502 126.11737 L 124.73502 124.82649 L 124.82649 124.82649 L 124.82649 25.173657 L 124.61513 25.173657 L 124.61513 24.195939 A 62.147687 47.279731 0 0 0 75.000073 5.3846842 z");
//     ctx2.save();
//     ctx2.translate(x, y);
//     ctx2.scale(scaleFactor, scaleFactor);
//     ctx2.fillStyle = "red";
//     ctx2.fill(p);
//     ctx2.restore();
// }

function animate(positions) {
    let adjW = svgWidth*scaleFactor;
    let adjH = svgHeight*scaleFactor;
    ctx2.clearRect(-860, 22840, 10380, 17780);
    let i = 0;

    let p = new Path2D("M 75.000073 5.3846842 A 62.147687 47.279731 0 0 0 25.384497 24.211442 L 25.384497 25.173657 L 25.173657 25.173657 L 25.173657 124.82649 L 25.50387 124.82649 L 25.50387 126.11737 A 62.147687 47.279731 0 0 0 75.119446 144.94464 A 62.147687 47.279731 0 0 0 124.73502 126.11737 L 124.73502 124.82649 L 124.82649 124.82649 L 124.82649 25.173657 L 124.61513 25.173657 L 124.61513 24.195939 A 62.147687 47.279731 0 0 0 75.000073 5.3846842 z");
    positions.forEach(pos => {
        ctx2.save();
        // Adjust origin so SVG is centered
        ctx2.translate(pos.x - (0.5*adjW), pos.y - (0.5*adjH));

        thetaRad = pos.theta*(Math.PI/180);
        let hyp = Math.sqrt((0.5*adjW)**2 + (0.5*adjH)**2);
        let initialAngle = Math.atan2(adjH, adjW);

        // Find new origin for rotation and add to initial centering adjustment
        let originX = 0.5*adjW - hyp*Math.cos(initialAngle + thetaRad);
        let originY = 0.5*adjH - hyp*Math.sin(initialAngle + thetaRad);
        ctx2.translate(originX, originY)

        ctx2.rotate(pos.theta * Math.PI / 180);
        ctx2.scale(scaleFactor, scaleFactor);
        ctx2.fillStyle = (i < amrColors.length) ? amrColors[i] : "red";
        ctx2.fill(p);
        ctx2.restore();
        i++;
    });
}

function applyValue() {
    console.log("in the applyValue function")
    const xInput = document.getElementById("X");
    const xVal = xInput.value;

    const yInput = document.getElementById("Y");
    const yVal = yInput.value;

    console.log("xVal: " + xVal + " and yVal: " + yVal)

    animate(xVal, yVal);
}

function applyScaleFactor() {
    const el = document.getElementById("ScaleFactor");
    scaleFactor = el.value;
}

async function readPosition(token) {
    const readPos = await fetch(IP + '/automation/api/v2/nodes/amr-map%2Fpositions', {
      method: "GET",
      headers: genHeaders(token)
    })
    .then(response => response.json())
    console.log(readPos.value);
    let positions = JSON.parse(readPos.value);
    animate(positions);
}

// Adjust object canvas
const canvas2 = document.getElementById("myCanvas2");
const ctx2 = canvas2.getContext("2d");
ctx2.translate(-22840, 9620);
ctx2.rotate(-90*(Math.PI / 180));

getToken("boschrexroth", "boschrexroth");