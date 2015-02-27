/**
 * フレームスキップを適用
 */
function implementFrameSkip(){

  if (!createjs) {
    return;
  }

  createjs.Stage.prototype.update = function() {
    if (!this.canvas) { return; }
    if (this.tickOnUpdate) {

      //
      // フレームスキップの処理
      //
      if (!this._data) {
        this._data = {
          startTime: createjs.Ticker._getTime(),
          prevFrame: 0
        };
      }
      var time = createjs.Ticker._getTime();
      var interval = createjs.Ticker.getInterval();
      var frame = (time - this._data.startTime) / interval | 0;
      var count = frame - this._data.prevFrame;
      count = count < 1 ? 1 : count;
      this._data.prevFrame += count;
      this.dispatchEvent("tickstart");  // TODO: make cancellable?
      while (count--) {
        this._tick((arguments.length ? arguments : null));
      }
      this.dispatchEvent("tickend");

    }
    if (this.dispatchEvent("drawstart", false, true) === false) { return; }
    createjs.DisplayObject._snapToPixelEnabled = this.snapToPixelEnabled;
    var r = this.drawRect, ctx = this.canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (this.autoClear) {
      if (r) { ctx.clearRect(r.x, r.y, r.width, r.height); }
      else { ctx.clearRect(0, 0, this.canvas.width+1, this.canvas.height+1); }
    }
    ctx.save();
    if (this.drawRect) {
      ctx.beginPath();
      ctx.rect(r.x, r.y, r.width, r.height);
      ctx.clip();
    }
    this.updateContext(ctx);
    this.draw(ctx, false);
    ctx.restore();
    this.dispatchEvent("drawend");
  }
}

implementFrameSkip();
