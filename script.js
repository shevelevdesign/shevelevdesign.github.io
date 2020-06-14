$(window).bind('load', function () {
    const raf = function (entry) {
        window.requestAnimationFrame(entry);
    };
    const random = function (min, max) {
        max = max + 1;
        return Math.floor(Math.random() * (max - min) + min);
    }
    var app = {
        init: function () {
            this.cacheDOM();
            this.style();
        },
        cacheDOM: function () {
            this.container = $('#container');
            this.images = $('img');

            this.mouseX = null;
            this.mouseY = null;

            this.ideas = $('#ideas');
        },
        style: function () {
            this.images.imagesLoaded(function () {
                $(window).resize(function initial() {
                    TweenMax.set(app.container, {
                        opacity: 1,
                        userSelect: 'none'
                    });
                    TweenMax.set(app.ideas, {
                        y: (app.container.height() / 2) - (app.ideas.height() / 2),
                        opacity: 1
                    });
                    return initial;
                }());
            });
        },
        cursorEvents: function (e) {
            app.mouseX = e.clientX;
            app.mouseY = e.clientY;
        }
    }

    app.init();

    var cContainer = $('#c-container'),
        c = document.getElementById('c'),
        cx = c.getContext('2d'),
        Particle,
        Line,
        canvas,
        mouseX,
        mouseY;

    c.width = $('#c').outerWidth();
    c.height = $('#c').outerHeight();

    function curveFactory(thisCanvas, thisContext, thisLineName, thisCanvasFunction) {

        var particleIndex = 0,
            particles = {},
            particleNum = 1,
            particlesLoaded = false,
            w = thisCanvas.width,
            h = thisCanvas.height;

        thisParticleName = function () {
            this.randomY = random(0, h);
            this.lwStart = 5;
            this.lw = 30;
            this.lwChange = 0.5;
            this.grayscaleLwStart = 5;
            this.grayscaleLw = 30;
            this.grayscaleLwChange = 0.5;
            this.lwReversed = false;
            this.x;
            this.xInitial = w / 2;
            this.yInitial = random(0, h);
            this.y = random(0, h);
            this.xInterval = 5;
            this.yInterval = 5;
            this.angle = 0;
            this.limit = (Math.PI * 4);
            this.xMultiplier = 50;
            this.yMultiplier = 50;
            this.speed = 0.1;
            this.hue = random(0, 360);
            this.grayscaleColor = random(220, 240);
            this.opacity = 0;
            this.grayscaleOpacity = 0;
            this.opacityChange = 0.05;
            this.grayscaleOpacityChange = 0.01;
            this.opacityLimit = 1;
            this.grayscaleOpacityLimit = 1;
            this.ease = this.limit * 0.00796178344;
            this.opposite = random(1, 2) === 1;
            particles[particleIndex] = this;
            this.id = particleIndex;
            particleIndex++;
        }

        thisParticleName.prototype.addX = function () {

            thisContext.beginPath();
            if (this.opposite) {
                //MOVING RIGHT
                this.angle += this.speed;
                this.ease *= 0.99205;
                this.x = this.xInitial + (this.angle * 10 * (this.xInterval));
                this.y = this.yInitial - (Math.sin(this.angle) * 10 * this.yInterval) / 2;
                if (this.grayscaleLwStart < this.grayscaleLw) {
                    this.grayscaleLwStart += this.grayscaleLwChange;
                }
                if (this.x > w) {
                    delete particles[this.id];
                }
                if (this.grayscaleOpacity < this.grayscaleOpacityLimit) {
                    this.grayscaleOpacity += this.grayscaleOpacityChange;
                }
                thisContext.fillStyle = `rgba(${this.grayscaleColor},${this.grayscaleColor},${this.grayscaleColor},${this.grayscaleOpacity})`;
                thisContext.arc(this.x, this.y, this.grayscaleLwStart, 0, Math.PI * 2);
            } else {
                //MOVING LEFT
                thisContext.moveTo(this.x, this.y);
                this.angle -= this.speed;
                this.ease *= 0.99205;
                this.x = this.xInitial + (this.angle * 10 * (this.xInterval));
                this.y = this.yInitial - (Math.sin(this.angle) * 10 * this.yInterval);
                if (this.lwStart < this.lw) {
                    this.lwStart += this.lwChange;
                }
                if (this.x < 0) {
                    delete particles[this.id];
                }
                if (this.opacity < this.opacityLimit) {
                    this.opacity += this.opacityChange;
                }
                thisContext.fillStyle = `hsla(${this.hue},100%,50%,${this.opacity})`;
                thisContext.arc(this.x, this.y, this.lwStart, 0, Math.PI * 2);
            }
            thisContext.fill();
        }

        thisCanvasFunction = function () {
            $(window).resize(function () {
                c.width = $('#c').outerWidth();
                c.height = $('#c').outerHeight();
                w = thisCanvas.width;
                h = thisCanvas.height;
            });
            thisContext.globalCompositeOperation = 'source-over';
            thisContext.fillStyle = 'rgba(0,0,0,0.07)';
            thisContext.fillRect(0, 0, c.width / 2, c.height);
            cx.fillStyle = 'rgba(255,255,255,0.1)';
            cx.fillRect(c.width / 2, 0, c.width / 2, c.height);
            if (!particlesLoaded) {
                for (var i = 0; i < particleNum; i++) {
                    new thisParticleName();
                }
            }

            // thisContext.globalCompositeOperation = 'lighter';
            for (var i in particles) {
                particles[i].addX();
            }
            window.requestAnimationFrame(thisCanvasFunction);
        }
        window.requestAnimationFrame(thisCanvasFunction);
    }

    function cursorEvents(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    curveFactory(c, cx, Line, canvas);
});