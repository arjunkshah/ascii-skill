/**
 * ascii-skill — theme-aware, mouse-reactive ASCII fields for the web.
 * License: MIT (same as repository)
 */
(function (global) {
  "use strict";

  var DEFAULT_CHARSET = " .·-:+*=%@#";

  function hash2(ix, iy, seed) {
    var n =
      (Math.sin(ix * 12.9898 + iy * 78.233 + seed * 0.001) * 43758.5453) % 1;
    return n < 0 ? n + 1 : n;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function readCssVar(el, name, fallback) {
    var s = getComputedStyle(el);
    var v = s.getPropertyValue(name).trim();
    return v || fallback;
  }

  /**
   * @typedef {Object} AsciiSkillOptions
   * @property {'hero'|'feature'|'ambient'} [role='feature']
   * @property {string} [charset]
   * @property {number} [cellSize]
   * @property {boolean} [followMouse=true]
   * @property {boolean} [perspective3d=true] — hero/feature only
   * @property {boolean} [autoStart=true]
   */

  function AsciiSkill(root, options) {
    if (!(root instanceof HTMLElement)) throw new TypeError("AsciiSkill: root must be an HTMLElement");
    this.root = root;
    this.options = Object.assign(
      {
        role: "feature",
        charset: DEFAULT_CHARSET,
        cellSize: null,
        followMouse: true,
        perspective3d: true,
        autoStart: true,
      },
      options || {}
    );

    this._canvas = document.createElement("canvas");
    this._canvas.setAttribute("aria-hidden", "true");
    this._canvas.className = "ascii-skill-canvas";
    Object.assign(this._canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
      pointerEvents: "none",
    });

    var cs = getComputedStyle(root);
    if (cs.position === "static") root.style.position = "relative";
    if (cs.overflow === "visible") root.style.overflow = "hidden";

    root.insertBefore(this._canvas, root.firstChild);

    this._ctx = this._canvas.getContext("2d", { alpha: true });
    this._running = false;
    this._raf = 0;
    this._cols = 0;
    this._rows = 0;
    this._cell = 12;
    this._mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    this._time = 0;
    this._reducedMotion = false;
    this._resizeObserver = null;
    this._onMove = this._onMove.bind(this);
    this._onLeave = this._onLeave.bind(this);
    this._tick = this._tick.bind(this);

    this._applyRoleDefaults();

    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      this.options.perspective3d = false;
      this._reducedMotion = true;
    }

    if (this.options.autoStart) this.start();
  }

  AsciiSkill.prototype._applyRoleDefaults = function () {
    var r = this.options.role;
    if (r === "hero") {
      this.options.cellSize = this.options.cellSize || 11;
      this.options.followMouse = this.options.followMouse !== false;
      this.options.perspective3d = this.options.perspective3d !== false;
    } else if (r === "ambient") {
      this.options.cellSize = this.options.cellSize || 7;
      this.options.perspective3d = false;
    } else {
      this.options.cellSize = this.options.cellSize || 9;
    }
    this._cell = this.options.cellSize;
  };

  AsciiSkill.prototype._onMove = function (e) {
    if (!this.options.followMouse) return;
    var rect = this.root.getBoundingClientRect();
    var x = (e.clientX - rect.left) / Math.max(rect.width, 1);
    var y = (e.clientY - rect.top) / Math.max(rect.height, 1);
    this._mouse.tx = Math.min(1, Math.max(0, x));
    this._mouse.ty = Math.min(1, Math.max(0, y));
  };

  AsciiSkill.prototype._onLeave = function () {
    this._mouse.tx = 0.5;
    this._mouse.ty = 0.5;
  };

  AsciiSkill.prototype._layout = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = this.root.clientWidth;
    var h = this.root.clientHeight;
    if (w < 2 || h < 2) return;
    this._canvas.width = Math.floor(w * dpr);
    this._canvas.height = Math.floor(h * dpr);
    this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this._cell = this.options.cellSize;
    this._cols = Math.max(1, Math.floor(w / this._cell));
    this._rows = Math.max(1, Math.floor(h / this._cell));
  };

  AsciiSkill.prototype._palette = function () {
    var fg = readCssVar(this.root, "--ascii-fg", "");
    var bg = readCssVar(this.root, "--ascii-bg", "");
    var accent = readCssVar(this.root, "--ascii-accent", "");
    var opacity = parseFloat(readCssVar(this.root, "--ascii-opacity", "0.85")) || 0.85;
    if (this.options.role === "ambient") {
      opacity = parseFloat(readCssVar(this.root, "--ascii-opacity", "0.22")) || 0.22;
    }
    var s = getComputedStyle(this.root);
    if (!fg) fg = s.color || "#e8e4dc";
    if (!bg) bg = s.backgroundColor || "transparent";
    if (!accent) accent = fg;
    return { fg: fg, bg: bg, accent: accent, opacity: opacity };
  };

  AsciiSkill.prototype._tick = function () {
    if (!this._running) return;
    var ctx = this._ctx;
    var w = this.root.clientWidth;
    var h = this.root.clientHeight;
    if (w < 2 || h < 2) {
      this._raf = requestAnimationFrame(this._tick);
      return;
    }

    var role = this.options.role;
    var smooth = role === "ambient" ? 0.04 : role === "hero" ? 0.12 : 0.08;
    this._mouse.x = lerp(this._mouse.x, this._mouse.tx, smooth);
    this._mouse.y = lerp(this._mouse.y, this._mouse.ty, smooth);

    var pal = this._palette();
    var ch = this.options.charset;
    var mx = this._mouse.x;
    var my = this._mouse.y;

    var pace = this._reducedMotion ? 0.12 : 1;
    this._time +=
      (role === "ambient" ? 0.35 : role === "hero" ? 1.15 : 0.75) * pace;
    var t = this._time * 0.001;

    ctx.clearRect(0, 0, w, h);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font =
      Math.max(8, this._cell - 1) +
      "px " +
      (readCssVar(this.root, "--ascii-font", "ui-monospace, monospace") || "ui-monospace, monospace");

    var mouseWeight = role === "ambient" ? 0.35 : role === "hero" ? 1.25 : 0.85;

    for (var iy = 0; iy < this._rows; iy++) {
      for (var ix = 0; ix < this._cols; ix++) {
        var nx = ix / this._cols;
        var ny = iy / this._rows;
        var dx = nx - mx;
        var dy = ny - my;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var glow = Math.exp(-dist * (5.5 - mouseWeight * 1.5)) * mouseWeight;

        var n1 = hash2(ix, iy, Math.floor(this._time * 0.02));
        var wave =
          Math.sin(t * 3 + nx * 6 + ny * 5) * 0.5 +
          Math.sin(t * 2.1 + nx * 12) * 0.25;
        var base = n1 * 0.55 + 0.25 + wave * 0.2 + glow * (role === "hero" ? 0.55 : 0.35);

        if (role === "hero") {
          var tilt = (mx - 0.5) * 0.4 * (1 - dist);
          base += tilt * 0.15;
        }

        var idx = Math.floor(Math.min(ch.length - 1, Math.max(0, base * ch.length)));
        var char = ch[idx];

        var ox = ix * this._cell + this._cell * 0.5;
        var oy = iy * this._cell + this._cell * 0.5;

        if (role === "hero" && glow > 0.35) {
          ctx.fillStyle = pal.accent;
          ctx.globalAlpha = pal.opacity * lerp(0.35, 1, glow);
        } else {
          ctx.fillStyle = pal.fg;
          ctx.globalAlpha = pal.opacity * lerp(0.2, 0.95, base);
        }
        ctx.fillText(char, ox, oy);
      }
    }

    if (this.options.perspective3d && (role === "hero" || role === "feature")) {
      var rx = (my - 0.5) * (role === "hero" ? -6 : -3.5);
      var ry = (mx - 0.5) * (role === "hero" ? 8 : 4.5);
      this._canvas.style.transform =
        "perspective(900px) rotateX(" + rx.toFixed(3) + "deg) rotateY(" + ry.toFixed(3) + "deg)";
    } else {
      this._canvas.style.transform = "none";
    }

    this._raf = requestAnimationFrame(this._tick);
  };

  AsciiSkill.prototype.start = function () {
    if (this._running) return;
    this._running = true;
    this._layout();
    if (!this._resizeObserver && typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver(this._layout.bind(this));
      this._resizeObserver.observe(this.root);
    } else if (!this._resizeObserver) {
      window.addEventListener("resize", this._layout.bind(this));
    }
    if (this.options.followMouse) {
      this.root.addEventListener("mousemove", this._onMove);
      this.root.addEventListener("mouseleave", this._onLeave);
    }
    this._raf = requestAnimationFrame(this._tick);
  };

  AsciiSkill.prototype.stop = function () {
    this._running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = 0;
    this.root.removeEventListener("mousemove", this._onMove);
    this.root.removeEventListener("mouseleave", this._onLeave);
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  };

  AsciiSkill.prototype.destroy = function () {
    this.stop();
    if (this._canvas && this._canvas.parentNode) {
      this._canvas.parentNode.removeChild(this._canvas);
    }
  };

  AsciiSkill.initAll = function (selector) {
    var sel = selector || "[data-ascii-skill]";
    var nodes = document.querySelectorAll(sel);
    var out = [];
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el._asciiSkillInstance) continue;
      var role = el.getAttribute("data-ascii-role") || "feature";
      var cell = el.getAttribute("data-ascii-cell-size");
      var inst = new AsciiSkill(el, {
        role: role,
        cellSize: cell ? parseInt(cell, 10) : null,
        followMouse: el.getAttribute("data-ascii-follow") !== "false",
        perspective3d: el.getAttribute("data-ascii-3d") !== "false",
      });
      el._asciiSkillInstance = inst;
      out.push(inst);
    }
    return out;
  };

  global.AsciiSkill = AsciiSkill;
})(typeof window !== "undefined" ? window : this);
