window.Cell = Backbone.Model.extend(
  {
    initialize: function (opt) {
      // console.log('Cell init');
      // console.log(arguments);
      this.index = opt.index;
      this.x = opt.x;
      this.y = opt.y;
      this.isLiving = (Math.floor(Math.random() * 2) == true);
      _.bindAll(this);
    },
    flipstate: function () {
      console.log('cell::flipstate');
      console.log(arguments);
      this.isLiving = !this.isLiving;
    }
  }
);

window.GameBoard = Backbone.Model.extend(
  {
    initialize: function (opt) {
      // console.log('gameboard init:');
      // console.log(this);
      // console.log(arguments);

      this.row = Math.floor(opt.row);
      this.col = Math.floor(opt.col);
      this.collection = new Backbone.Collection();
      this.matrix = [];
      var i = 0;
      var c;
      var arg;
      for (var ic = 0; ic < this.col; ++ic) {
        this.matrix[ic] = [];
        for (var ir = 0; ir < this.row; ++ir) {
          arg = {
            index: i,
            x: ir,
            y: ic
          };
          c = new Cell(arg);
          this.matrix[ic][ir] = c;
          this.collection.add(c);
          ++i;
        }
      }
      _.bindAll(this);
    },
    getIntX: function (x) {
      var result;
      var mod = x % this.col;
      if (mod > -1) {
        result = mod
      }
      else {
        result = this.col + x;
      }
      return result;
    },
    getIntY: function (y) {
      var result;
      var mod = y % this.row;
      if (mod > -1) {
        result = mod
      }
      else {
        result = this.row + y;
      }
      return result;
    },
    getByCoordinate: function (x, y) {
      // console.log('getByCoordinate');
      // console.log(x, y);
      var _x = this.getIntX(x);
      var _y = this.getIntY(y);
      return this.matrix[_x][_y];
    },
    getNeighborCountsByCell: function (cell) {
      var x = cell.x;
      var y = cell.y;
      var neighbor;
      var neighbor_count = 0;
      for (var _y = -1; _y < 2; ++_y) {
        for (var _x = -1; _x < 2; ++_x) {
          neighbor = this.getByCoordinate((x + _x), (y + _y));
          if (neighbor.isLiving) {
            ++neighbor_count;
          }
        }
      }
      return neighbor_count;
    }
  }
);

window.Player = Backbone.Model.extend(
  {
  }
);

window.GameBoardView = Backbone.View.extend(
  {
    // tag: 'div',
    // className: 'game-board',
    el: $('#container')[0],
    template: $('#game-board-template').html(),

    events: {
      'click .board-cell' : 'flipstate'
    },

    flipstate : function (ev) {
      console.log('view::flipstate');
      var cid = $(ev.target).data('cid');
      this.model.collection.getByCid(cid).flipstate();
    },

    initialize: function () {    
      _.bindAll(this);
    },

    render: function () {
      var trs = [], tds, cell;
      for (var y = 0; y < this.model.row; ++y) {
        tds = [];
        for (var x = 0; x < this.model.col; ++x) {
          cell = this.model.matrix[x][y];
          tds[tds.length] = cell;
        }
        trs[trs.length] = {tds: tds};
      }
      var view = {
        numCells: this.model.collection.length,
        trs: trs
      };
      $(this.el).html(
        Mustache.render(
          this.template,
          view
        )
      );
      return this;
    }
  }
);

window.Game = Backbone.Router.extend(
  {
    routes: {
      '': 'home'
    },
    initialize: function () {
      this.boardView = new GameBoardView(
        {
          model: window.board,
          player: window.player,
        }
      );
    },
    home: function () {
      // $('#container')
      //   .empty()
      //   .append(this.boardView.render().el);
      this.boardView.render();
    }
  }
);