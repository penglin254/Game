/**
 * Copyright © 2016 CheYouYuan. All rights reserved.
 * Author: Lin
 * Email: 139193411@qq.com
 */

;(function (window) {
    'use strict';
    var GoBang = function () {
        var img_b = new Image(), img_w = new Image();
        img_b.src = "img/playB.png", img_w.src = "img/playA.png";
        this.options = {
            flag: true, //true代表白棋下的棋子，false代表黑棋下的棋子
            isWin: false, //判断是否结束，true结束，false没有结束
            lattice: 40, //设置每个格子的宽高都是40
            txt: document.getElementById("txt"), //提示
            btn: document.getElementById("btn"), //重新开始
            cas: document.getElementById("cas"), // 获取画布对象
            step: document.getElementById("step"), //悔棋
            revoke: document.getElementById("revoke"), //撤销悔棋
            ctx: cas.getContext("2d"), //画布上下文
            piece_b: img_b, //白棋
            piece_w: img_w, //黑棋
            boardArr: new Array(15), // 用二维数组来保存棋盘，0代表没有走过，1为白棋走过，2为黑棋走过
        };
    };

    GoBang.prototype = {
        //构建二维数组
        board: function () {
            for (var i = 0; i < 15; i++) {
                this.options.boardArr[i] = new Array(15);
                for (var j = 0; j < 15; j++) {
                    this.options.boardArr[i][j] = 0;
                }
            }
        },


        //绘制棋盘
        drawLine: function () {
            for (var i = 0; i < this.options.cas.width / this.options.lattice; i++) {
                // 画竖线
                this.options.ctx.moveTo((i + 1) * this.options.lattice, 0);
                this.options.ctx.lineTo((i + 1) * this.options.lattice, this.options.cas.height);
                // 画横线
                this.options.ctx.moveTo(0, (i + 1) * this.options.lattice);
                this.options.ctx.lineTo(this.options.cas.width, (i + 1) * this.options.lattice);
                this.options.ctx.stroke();
            }
        },

        //获取鼠标点击位置
        clickFn: function () {
            var options = this.options, that = this;
            options.cas.onclick = function (e) {
                // 先判断游戏是否结束
                if (options.isWin) {
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
                if (options.boardArr[x][y] != 0) {
                    alert("你不能在这个位置下棋");
                    return;
                }
                // 判断是显示黑子还是白子
                if (options.flag) { //白子
                    options.flag = false; //将标志置为false,表示下次为黑子
                    that.drawChess(1, x, y); //调用函数来画棋子
                } else { //黑子
                    options.flag = true; //将标志置为true,表示下次为白子
                    that.drawChess(2, x, y); //调用函数来画棋子
                }
            }
        },

        //画棋子
        drawChess: function (num, x, y) {
            //根据x和y确定图片显示位置,让图片显示在十字线中间，因为一个格子为40，图片大小为30，所以40-30/2等于25，所以需要加上25
            var x0 = x * this.options.lattice + 25;
            var y0 = y * this.options.lattice + 25;
            if (num == 1) {
                //绘制白棋
                this.options.ctx.drawImage(this.options.piece_w, x0, y0);
                this.options.boardArr[x][y] = 1; //白子
            } else if (num == 2) {
                // 绘制黑棋
                this.options.ctx.drawImage(this.options.piece_b, x0, y0);
                this.options.boardArr[x][y] = 2; //黑子
            }
            //调用函数判断输赢
            this.judge(num, x, y);
        },

        //判断输赢
        judge: function (num, x, y) {
            var options = this.options, n1 = 0, n2 = 0, n3 = 0, n4 = 0, str;//左右，上下，左上右下，右上左下

            //左右方向
            //先从点击的位置向左寻找，相同颜色的棋子n1自加，直到不是相同颜色的棋子，则跳出循环
            for (var i = x; i >= 0; i--) {
                if (options.boardArr[i][y] != num) {
                    break;
                }
                n1++;
            }

            //然后从点击的位置向右下一个位置寻找，相同颜色的棋子n1自加，直到不是相同颜色的棋子，则跳出循环
            for (var i = x + 1; i < 15; i++) {
                if (options.boardArr[i][y] != num) {
                    break;
                }
                n1++;
            }

            //上下方向
            for (var i = y; i >= 0; i--) {
                if (options.boardArr[x][i] != num) {
                    break;
                }
                n2++;
            }
            for (var i = y + 1; i < 15; i++) {
                if (options.boardArr[x][i] != num) {
                    break;
                }
                n2++;
            }

            //左上到右下斜方向
            for (var i = x,
                     j = y; i >= 0, j >= 0; i--, j--) {
                if (i < 0 || j < 0 || options.boardArr[i][j] != num) {
                    break;
                }
                n3++;
            }
            for (var i = x + 1,
                     j = y + 1; i < 15, j < 15; i++, j++) {
                if (i >= 15 || j >= 15 || options.boardArr[i][j] != num) {
                    break;
                }
                n3++;
            }
            //右上到左下斜方向
            for (var i = x,
                     j = y; i >= 0, j < 15; i--, j++) {
                if (i < 0 || j >= 15 || options.boardArr[i][j] != num) {
                    break;
                }
                n4++;
            }
            for (var i = x + 1,
                     j = y - 1; i < 15, j >= 0; i++, j--) {
                if (i >= 15 || j < 0 || options.boardArr[i][j] != num) {
                    break;
                }
                n4++;
            }
            //用一个定时器来延时，否则会先弹出对话框，然后才显示棋子
            if (n1 >= 5 || n2 >= 5 || n3 >= 5 || n4 >= 5) {
                if (num == 1) { //白棋
                    str = "白棋赢了，游戏结束！"
                } else if (num == 2) { //黑棋
                    str = "黑棋赢了，游戏结束！"
                }
                options.txt.innerHTML = str;
                options.isWin = true;
            }
        },

        //重新开始
        clickBtn: function () {
            var options = this.options, that = this;
            options.btn.onclick = function () {
                options.flag = true;
                options.isWin = false;

                for (var i = 0; i < 15; i++) {
                    for (var j = 0; j < 15; j++) {
                        options.boardArr[i][j] = 0;
                    }
                }
                options.ctx.clearRect(0, 0, 640, 640);
                options.txt.innerHTML = "";
                that.drawLine();
            }
        },

        //初始化方法
        init: function () {
            this.drawLine(), this.board(), this.clickFn(), this.judge(), this.clickBtn();
        }


    };

    var goBang = new GoBang();
    return goBang.init();


})(window);

