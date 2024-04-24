processor.computeFrame = function () {
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
    const frame = this.ctx1.getImageData(0, 0, this.width, this.height);
    const data = frame.data;

    for (let i = 0; i < data.length; i += 4) {
      const red = data[i + 0];
      const green = data[i + 1];
      const blue = data[i + 2];
      if (green > 100 && red > 100 && blue < 43) {
        data[i + 3] = 0;
      }
    }
    this.ctx2.putImageData(frame, 0, 0);
  };
