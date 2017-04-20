/**
 * Copyright © 2016 CheYouYuan. All rights reserved.
 * Author: Lin
 * Email: 139193411@qq.com
 */

var flag = true; //true代表白棋下的棋子，false代表黑棋下的棋子
var isWin = false; //判断是否结束，true结束，false没有结束
var step = 40; //设置每个格子的宽高都是40
var txt = document.getElementById("txt");
var btn = document.getElementById("btn");
var cas = document.getElementById("cas"); // 获取画布对象
var ctx = cas.getContext("2d"); //画布上下文
//    创建图片对象
var img_b = new Image();
img_b.src = "img/playB.png"; //设置黑棋图片路径
var img_w = new Image();
img_w.src = "img/playA.png"; //设置白棋图片路径
//    用二维数组来保存棋盘，0代表没有走过，1为白棋走过，2为黑棋走过
var arr = new Array(15); //声明一个一维数组
for (var i = 0; i < 15; i++) {
    arr[i] = new Array(15); //每个值再声明一个一维数组，这样就组成了一个二维数组
    for (var j = 0; j < 15; j++) {
        arr[i][j] = 0;
    }
}

//绘制棋盘
function drawLine() {
    for (var i = 0; i < cas.width / step; i++) {
        // 画竖线
        ctx.moveTo((i + 1) * step, 0);
        ctx.lineTo((i + 1) * step, cas.height);
        // 画横线
        ctx.moveTo(0, (i + 1) * step);
        ctx.lineTo(cas.width, (i + 1) * step);
        ctx.stroke();
    }
}

//获取鼠标点击的位置
cas.onclick = function (e) {
    // 先判断游戏是否结束
    if (isWin) {
        alert("游戏已经结束，请刷新重新开始！");
        return 0;
    }
    //判断棋子显示的地方，四条边上不显示棋子，
    //鼠标点击的位置减去边框距离页面的上和左的距离（10），减去一个格子宽高的一半（20）
    var x = (e.clientX - 10 - 20) / 40;
    var y = (e.clientY - 10 - 20) / 40;

    //进行取整来确定棋子最终显示的区域
    x = parseInt(x);
    y = parseInt(y);
    //如果超出棋盘或者在棋盘边界直接返回，边界上不能画棋子
    if (x < 0 || x >= 15 || y < 0 || y >= 15) {
        return;
    }
    //进行判断该位置是否已经显示过棋子
    if (arr[x][y] != 0) {
        alert("你不能在这个位置下棋");
        return;
    }
    // 判断是显示黑子还是白子
    if (flag) { //白子
        flag = false; //将标志置为false,表示下次为黑子
        drawChess(1, x, y); //调用函数来画棋子
    } else { //黑子
        flag = true; //将标志置为true,表示下次为白子
        drawChess(2, x, y); //调用函数来画棋子
    }
}
//画棋子
function drawChess(num, x, y) {
    //根据x和y确定图片显示位置,让图片显示在十字线中间，因为一个格子为40，图片大小为30，所以40-30/2等于25，所以需要加上25
    var x0 = x * step + 25;
    var y0 = y * step + 25;
    if (num == 1) {
        //绘制白棋
        ctx.drawImage(img_w, x0, y0);
        arr[x][y] = 1; //白子
    } else if (num == 2) {
        // 绘制黑棋
        ctx.drawImage(img_b, x0, y0);
        arr[x][y] = 2; //黑子
    }
    //调用函数判断输赢
    judge(num, x, y);
}

//判断输赢
function judge(num, x, y) {
    var n1 = 0,
        //左右方向
        n2 = 0,
        //上下方向
        n3 = 0,
        //左上到右下方向
        n4 = 0; // 右上到左下方向
    //***************左右方向**********************************
    //先从点击的位置向左寻找，相同颜色的棋子n1自加，直到不是相同颜色的棋子，则跳出循环
    for (var i = x; i >= 0; i--) {
        if (arr[i][y] != num) {
            break;
        }
        n1++;
    }
    //然后从点击的位置向右下一个位置寻找，相同颜色的棋子n1自加，直到不是相同颜色的棋子，则跳出循环
    for (var i = x + 1; i < 15; i++) {
        if (arr[i][y] != num) {
            break;
        }
        n1++;
    }
    //****************上下方向******************************
    for (var i = y; i >= 0; i--) {
        if (arr[x][i] != num) {
            break;
        }
        n2++;
    }
    for (var i = y + 1; i < 15; i++) {
        if (arr[x][i] != num) {
            break;
        }
        n2++;
    }
    //****************左上到右下斜方向******************************
    for (var i = x,
             j = y; i >= 0, j >= 0; i--, j--) {
        if (i < 0 || j < 0 || arr[i][j] != num) {
            break;
        }
        n3++;
    }
    for (var i = x + 1,
             j = y + 1; i < 15, j < 15; i++, j++) {
        if (i >= 15 || j >= 15 || arr[i][j] != num) {
            break;
        }
        n3++;
    }
    //****************右上到左下斜方向******************************
    for (var i = x,
             j = y; i >= 0, j < 15; i--, j++) {
        if (i < 0 || j >= 15 || arr[i][j] != num) {
            break;
        }
        n4++;
    }
    for (var i = x + 1,
             j = y - 1; i < 15, j >= 0; i++, j--) {
        if (i >= 15 || j < 0 || arr[i][j] != num) {
            break;
        }
        n4++;
    }
    //用一个定时器来延时，否则会先弹出对话框，然后才显示棋子
    var str;
    if (n1 >= 5 || n2 >= 5 || n3 >= 5 || n4 >= 5) {
        if (num == 1) { //白棋
            str = "白棋赢了，游戏结束！"
        } else if (num == 2) { //黑棋
            str = "黑棋赢了，游戏结束！"
        }
        txt.innerHTML = str;
        isWin = true;
    }
}

//重新开始
btn.onclick = function () {
    flag = true;
    isWin = false;

    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            arr[i][j] = 0;
        }
    }
    ctx.clearRect(0, 0, 640, 640);
    txt.innerHTML = "";
    drawLine();
}
    drawLine();