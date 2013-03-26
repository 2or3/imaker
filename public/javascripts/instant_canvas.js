const HALF    = 2;
const X_SCALE = 3;
const Y_SCALE = 6;

$(document).ready(function() {
  IM.init();
  IM.draw();
  IM.socket = io.connect();
  IM.socket.emit('init');
  IM.socket.on('isMaster', function(is_master) {
    if (!IM.is_master) {
      IM.is_master = is_master;
      if (!is_master) {
        $('#start').unbind();
      }
    }
  });
  IM.socket.on('roadImg', function(src) {
    if (!IM.is_master) {
      IM.imgReset().viewImgae();
      IM.imageObj.src = src;
    }
  });
  IM.socket.on('res', function(res, msg) {
    var id = parseInt(Math.random() * 10000000000);
    IM.viewText(msg, id);
  });
});

$(window).resize(function() {
  IM.calibrate();
});

$(function() {
  $('#start').click(function() {
    $(this).stop().animate({
      'marginLeft' : '-200px'
    }, 'slow');
    $('#start').unbind();
    IM.startView();
  });
  $('#start').mouseover(function() {
    $(this).stop().animate({
      'marginLeft' : '0px'
    }, 'fast');
  });
  $('#start').mouseout(function() {
    $(this).stop().animate({
      'marginLeft' : '-200px'
    }, 'slow');
  });
});

var IM = {
  socket: [],
  w: $(window).width(),
  h: $(window).height(),
  obj_size_x: $(window).width()/X_SCALE,
  obj_size_y: $(window).height()/Y_SCALE,
  text_size: 0,
  canvas: [],
  layer: [],
  rect: [],
  text: [],
  imgAnim: [],
  txtAnim: [],
  img: [],
  is_master: false,
  imgLayer: [],
  imageObj: [],
  txtLayer: [],
  remark: [],
  remarkRect: [],
  init: function() {
    this.canvas = new Kinetic.Stage({
      container: 'instant-canvas',
      width: this.w,
      height: this.h
    });
    this.layer = new Kinetic.Layer();
    this.rect  = new Kinetic.Rect({
      x: this.w/HALF-this.obj_size_x/HALF,
      y: this.h/HALF-this.obj_size_y/HALF,
      width: this.obj_size_x,
      height: this.obj_size_y,
      fill: 'green',
      stroke: 'white',
      strokeWidth: 4
    });
    this.text = new Kinetic.Text({
      x: this.w/HALF-this.obj_size_x/HALF,
      text: 'sample',
      fontFamily: 'Calibri',
      fill: '#5551',
      width: this.obj_size_x,
      height: this.obj_size_y,
      align: 'center'
    });
    IM.text_size = this.text.getText().length;
    var f_size   = Math.floor(this.obj_size_x/IM.text_size);
    var tx_y     = this.h/HALF-f_size/HALF;
    this.text.setFontSize(f_size);
    this.text.setY(tx_y);
  },
  draw: function(obj) {
    this.layer.add(this.rect);
    this.layer.add(this.text);
    this.canvas.add(this.layer);
  },
  calibrate: function() {
    // new window size
    var new_width  = $(window).width();
    var new_height = $(window).height();

    // new object size
    var new_size_w = new_width/X_SCALE;
    var new_size_h = new_height/Y_SCALE;

    // new location
    var move_to_x    = new_width/HALF-new_size_w/HALF;
    var move_to_y    = new_height/HALF-new_size_h/HALF;

    // set new object value
    this.canvas.setWidth(new_width);
    this.canvas.setHeight(new_height);
    this.rect.setWidth(new_size_w);
    this.rect.setHeight(new_size_h);
    this.rect.setX(move_to_x);
    this.rect.setY(move_to_y);

    var new_f_size = Math.floor(new_size_w/IM.text_size);
    var move_to_tx_y = new_height/HALF-new_f_size/HALF;
    this.text.setFontSize(new_f_size);
    this.text.setWidth(new_size_w);
    this.text.setHeight(new_size_h);
    this.text.setX(move_to_x);
    this.text.setY(move_to_tx_y);


    // draw new object
    this.layer.add(this.rect);
    this.layer.add(this.text);
    this.canvas.add(this.layer);
  },
  startView: function() {
    IM.socket.emit('getImg');
    IM.socket.on('roadImg', function(src) {
      IM.drawImgae();
      IM.imageObj.src = src;
    });
  },
  drawImgae: function() {
    var state = 0;
    IM.imageObj = new Image();

    IM.imgLayer = new Kinetic.Layer({
    });

    IM.imageObj.onload = function() {
      IM.addImgCanvas();

      IM.imgAnim = IM.generateAnim(IM.imgLayer, IM.imgUpdate, IM.imgRepeat, state);

      IM.imgAnim.start();
    }
  },
  viewImgae: function() {
    IM.imageObj = new Image();

    IM.imgLayer = new Kinetic.Layer({
    });

    IM.imageObj.onload = function() {
      IM.addImgCanvas();

      IM.imgAnim = IM.generateAnim(IM.imgLayer, IM.imgUpdate, IM.imgRepeat);

      IM.imgAnim.start();
    }
  },
  imgUpdate: function(layer, frame, diff) {
    var shapes  = layer.getChildren();

    var shape = shapes[0];
    if (shape.attrs.opacity >= 0.1) {
      shape.attrs.opacity += diff;
    }
  },
  imgRepeat: function() {
    var obj = {"img" : IM.img};
    IM.animStop(IM.imgAnim, IM.imgLayer, obj);

    IM.socket.emit('getImg');
    IM.socket.on('roadImg', function(src) {
      IM.imageObj.src = src;
    });
  },
  imgReset: function() {
    try {
      var obj = {"img" : IM.img};
      IM.animStop(IM.imgAnim, IM.imgLayer, obj);
      delete IM.imgAnim;
      return this;
    } catch (e) {
      return this;
    }
  },
  animStop: function(anim, layer, obj) {
    try {
      anim.stop();
      for (var value in obj) {
        layer.remove(value);
      }
      IM.canvas.remove(layer);
    } catch (e) {
    }
  },
  addImgCanvas: function() {
    var w = Math.floor( Math.random() * IM.w);
    var h = Math.floor( Math.random() * IM.h);

    IM.img = new Kinetic.Image({
      x: w,
      y: h,
      image: IM.imageObj,
      width: 350,
      height: 350,
      opacity: 0.1
    });
    IM.imgLayer.add(IM.img);
    IM.canvas.add(IM.imgLayer);
  },
  generateAnim: function(layer, update, postProcess, state) {
    state = (state !== undefined) ? state : 1;

    return new Kinetic.Animation(function(frame) {
      if (frame.time <= 3000) {
        update(layer, frame, 0.01);
      } else if (frame.time <= 5000) {
      } else if (frame.time <= 8000) {
        update(layer, frame, -0.01);
      } else {
        if (state == 0) {
          state = 1;
          postProcess();
        }
        return this;
      }
    }, layer);
  },
  viewText: function(msg, id) {
    var state = 0;
    IM.txtLayer[id] = new Kinetic.Layer({
    });

    IM.addTextCanvas(msg, id);

    IM.txtAnim[id] = IM.generateAnim(IM.txtLayer[id], IM.txtUpdate, IM.txtReset, state);

    IM.txtAnim[id].start();
  },
  addTextCanvas: function(msg, id) {
    IM.remark[id] = new Kinetic.Text({
      x: 100,
      y: 60,
      text: msg,
      fontSize: 18,
      fontFamily: 'Calibri',
      fill: '#555',
      width: 380,
      padding: 20,
      align: 'center',
      opacity: 0.1
    });

    IM.remarkRect[id] = new Kinetic.Rect({
      x: 100,
      y: 60,
      stroke: '#555',
      strokeWidth: 5,
      fill: '#ddd',
      width: 380,
      height: IM.remark[id].getHeight(),
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffset: [10, 10],
      shadowOpacity: 0.2,
      cornerRadius: 10,
      opacity: 0.1
    });
    IM.txtLayer[id].add(IM.remarkRect[id]);
    IM.txtLayer[id].add(IM.remark[id]);
    IM.canvas.add(IM.txtLayer[id]);
  },
  txtUpdate: function(layer, frame, diff) {
    var shapes  = layer.getChildren();
    var rectShape = shapes[0];
    var txtShape  = shapes[1];

    if (rectShape.attrs.opacity >= 0.1) {
      rectShape.attrs.opacity += diff;
    }
    if (txtShape.attrs.opacity >= 0.1) {
      txtShape.attrs.opacity += diff;
    }
  },
  txtReset: function() {
    try {
      obj = {"text": IM.remark[id], "rect": IM.remarkRect[id]};
      IM.animStop(IM.txtAnim[id], IM.txtLayer[id], obj);
      delete IM.txtAnim[id];
      return this;
    } catch (e) {
      return this;
    }
  }
};
