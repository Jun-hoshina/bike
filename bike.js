var t = 0;
var size = 10;
var speed = 0;
var playing = true;
var grounded = 0;
var k = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };

// canvas 生成
var c = document.createElement("canvas");
var ctx = c.getContext("2d");
var parentDiv = document.getElementById("parent-div");
var title = document.getElementById("title");
parentDiv.insertBefore(c, title.nextSibling);
c.classList.add('display-none');

// 画面生成のパラメータ生成
var perm = [];
while (perm.length < 255) {
    while (perm.includes(val = Math.floor(Math.random() * 255)));
    perm.push(val);
}

var lerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2;

var noise = x => {
    x = Math.abs(x * 0.01 % 255);
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}

// player生成
var player = new function () {
    this.x = c.width / 2;
    this.y = 0;
    this.ySpeed = 0;
    this.rSpeed = 0;
    this.rot = 0;
    this.width = 30;
    this.height = 30;
    this.img = new Image();
    this.img.src = "moto.png";

    this.draw = function () {
        // 乱数生成
        var p1 = c.height - noise(t - 3 + this.x) * 0.25;
        var p2 = c.height - noise(t + 3 + this.x) * 0.25;
        var p3 = c.height - noise(t + this.x) * 0.25;

        // 縦移動のスピードの更新
        if (p3 - size > this.y&&playing) {
            this.ySpeed += 0.2;
            grounded = 0;
            // this.y += this.ySpeed;
        } else if(playing) {
            this.rSpeed = 0;
            // this.ySpeed=0;
            this.ySpeed -= this.y - (p3 - size);
            this.y = p3 - size;
            grounded = 1;
        }
        console.log(grounded);
        this.y += this.ySpeed;

        //回転の範囲を-πからπにする
        this.rot=this.rot - 2 * Math.PI * Math.round(this.rot / (2 * Math.PI)) 
        
        // gameover判定
        if (!playing || grounded && Math.abs(this.rot)> Math.PI / 2) {
            playing = false;
            this.rSpeed = 0;
            this.y = p3 - size;
        }

        // 回転回転のスピードの更新
        var angle = Math.atan2(p2 - p1, 6);
        if (grounded && playing) {
            this.rot -= (this.rot - angle) * 0.1;
            this.rSpeed = this.rSpeed + (angle - this.rot) * 0.5;
            this.rot += (k.ArrowDown - k.ArrowUp) * 0.1;
        } else if (playing) {
            // this.rSpeed = this.rSpeed - (angle - this.rot)*0.01;
            this.rot += this.rSpeed * 0.3;
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}

function loop() {
    if (playing) {
        speed -= (speed - (k.ArrowRight - k.ArrowLeft)) * 0.1;
        t += 10 * speed;
    } else {
        // t+=1;
    }

    ctx.fillStyle = "#19f";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0, c.height);
    for (var i = 0; i < c.width; i++) {
        ctx.lineTo(i, c.height - noise(t + i) * 0.25);
    }
    ctx.lineTo(c.width, c.height);
    ctx.fill();

    player.draw();

    requestAnimationFrame(loop);
}

// 押されたkey判定
onkeydown = d => k[d.key] = 1;
onkeyup = d => k[d.key] = 0;

loop();
