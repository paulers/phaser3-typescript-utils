namespace Utils {

  export interface IAlignGrid {
    placeAtIndex(index: number, obj: any): void;
    showNumbers(): void;
  }

  export class AlignGridConfig {
    scene: any = null;
    rows?: number = 5;
    columns?: number = 5;
    height?: number = null;
    width?: number = null;
  }

  export class AlignGrid implements IAlignGrid {
    private config: AlignGridConfig;
    private scene: any;
    private cellWidth: number;
    private cellHeight: number;
    private graphics: any;

    constructor(cfg: AlignGridConfig) {

      if (!cfg.scene) throw Error(`You must pass in the scene.`);
      if (!cfg.rows) cfg.rows = 5;
      if (!cfg.columns) cfg.columns = 5;
      if (!cfg.height) cfg.height = cfg.scene.sys.game.config.height;
      if (!cfg.width) cfg.width = cfg.scene.sys.game.config.width;

      this.config = cfg;
      this.scene = cfg.scene;
      this.cellWidth = cfg.width / cfg.columns;
      this.cellHeight = cfg.height / cfg.rows;
    }

    public placeAtIndex(index, obj): void {
      var yy = Math.floor(index / this.config.columns);
      var xx = index - (yy * this.config.columns);

      this.placeAt(xx, yy, obj);
    }
    public showNumbers() {
      this.show();
      var count = 0;
      for (var i = 0; i < this.config.rows; i++) {
        for (var j = 0; j < this.config.columns; j++) {

          var numText = this.scene.add.text(0, 0, count, { color: '#ff0000' });
          numText.setOrigin(0.5, 0.5);
          this.placeAtIndex(count, numText);

          count++;
        }
      }
    }

    private show(): void {
      this.graphics = this.scene.add.graphics();
      this.graphics.lineStyle(2, 0xff0000);

      for (var i = 0; i < this.config.width; i += this.cellWidth) {
        this.graphics.moveTo(i, 0);
        this.graphics.lineTo(i, this.config.height);
      }

      for (var i = 0; i < this.config.height; i += this.cellHeight) {
        this.graphics.moveTo(0, i);
        this.graphics.lineTo(this.config.width, i);
      }

      this.graphics.strokePath();
    }
    private placeAt(xx, yy, obj): void {
      var x2 = this.cellWidth * xx + this.cellWidth / 2;
      var y2 = this.cellHeight * yy + this.cellHeight / 2;
      obj.x = x2;
      obj.y = y2;
    }
    
  }
}