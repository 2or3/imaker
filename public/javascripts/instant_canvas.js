const HALF     = 2;
const X_SCALE  = 1;
const Y_SCALE  = 6;
const OPC_DIFF = 1 / 100;
const RTT_DIFF = Math.PI * 1.5 / 1000;
const SZ_DIFF  = 5 /10;
const LCT_DIFF = 1 / 1000;
const OFFSET   = $(window).width() / 4;
const TITLE    = 'for takehiko & takehiko';

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
        $('#start').remove();
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
    $('#start').remove();
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
  frm: 3000,
  diff: 6000,
  socket: [],
  w: $(window).width(),
  h: $(window).height(),
  obj_size_x: $(window).width()/X_SCALE,
  obj_size_y: $(window).height()/Y_SCALE,
  text_size: 0,
  symbol: 1,
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
      fill: 'black',
      stroke: 'black',
      strokeWidth: 4
    });
    this.text = new Kinetic.Text({
      x: this.w/HALF-this.obj_size_x/HALF,
      text: TITLE,
      fontFamily: 'Calibri',
      fontStyle: 'italic',
      fill: 'white',
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
  imgUpdate: function(layer, frame) {
    var shapes  = layer.getChildren();
    var shape = shapes[0];

    // init params for animation
    var diff_cx = (IM.w / 2 - shape.attrs.x > 0) ? (IM.w / 2 - shape.attrs.x + OFFSET) * LCT_DIFF : (IM.w / 2 - shape.attrs.x - OFFSET) * LCT_DIFF;
    var diff_cy = (IM.h / 2 - shape.attrs.y) * LCT_DIFF;

    // do animation
    if (frame.time <= IM.frm) {
      if (shape.attrs.opacity >= 0.1) {
        shape.attrs.opacity += OPC_DIFF;
        shape.rotate(RTT_DIFF * IM.symbol);
        shape.attrs.x += diff_cx;
        shape.attrs.y += diff_cy;
        shape.attrs.width += SZ_DIFF;
        shape.attrs.height += SZ_DIFF;
      }
    } else if (frame.time <= IM.frm + IM.diff / 2) {
      shape.rotate(RTT_DIFF * IM.symbol);
      shape.attrs.x += diff_cx;
      shape.attrs.y += diff_cy;
      shape.attrs.width += SZ_DIFF;
      shape.attrs.height += SZ_DIFF;
    } else if (frame.time <= IM.frm + IM.diff) {
      if (shape.attrs.opacity >= 0.1) {
        shape.attrs.opacity -= OPC_DIFF;
        shape.rotate(RTT_DIFF * IM.symbol);
        shape.attrs.x += diff_cx;
        shape.attrs.y += diff_cy;
        shape.attrs.width += SZ_DIFF;
        shape.attrs.height += SZ_DIFF;
      }
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
      console.log(e);
    }
  },
  addImgCanvas: function() {
    var img_w = IM.imageObj.width;
    var img_h = IM.imageObj.height;
    if (IM.imageObj.width > IM.w || IM.imageObj.height > IM.h) {
      var ratio = IM.imageObj.height / IM.imageObj.width;
      if (ratio > 1) {
        img_w = (IM.h / ratio) / 2;
        img_h = IM.h / 2;
      } else {
        img_w = IM.w / 2;
        img_h = (IM.w * ratio) / 2;
      }
      var rt = Math.random() + 1;
      img_w = img_w / rt;
      img_h = img_h / rt;
    } else if (IM.imageObj.width > IM.w / 2 || IM.imageObj.height > IM.h / 2) {
      img_w = IM.imageObj.width / 2;
      img_h = IM.imageObj.height / 2;
      var rt = Math.random() + 1;
      img_w = img_w / rt;
      img_h = img_h / rt;
    }

    var rd_w = Math.floor( Math.random() * IM.w / 2);
    var rd_h = Math.floor( Math.random() * IM.h / 3);
    var w = rd_w + (IM.w / 2) - (img_w / 2);
    var h = rd_h + (IM.h / 2) - (img_h / 2);

    var r = 0;
    if (w < IM.w / 2 && h < IM.h / 2) {
      r = Math.floor( Math.random() * 45);
    } else if(w < IM.w / 2 && h > IM.h / 2) {
      r = Math.floor( Math.random() * 90) + 270;
    } else if(w > IM.w / 2 && h < IM.h / 2) {
      r = Math.floor( Math.random() * 180);
    } else {
      r = Math.floor( Math.random() * 90) + 180;
    }

    IM.img = new Kinetic.Image({
      image: IM.imageObj,
      width: img_w,
      height: img_h,
      rotationDeg: r,
      x: w,
      y: h,
      offset: {
        x: img_w / 2,
        y: img_h / 2,
      },
      opacity: 0.1
    });

    IM.imgLayer.add(IM.img);
    IM.canvas.add(IM.imgLayer);
  },
  generateAnim: function(layer, update, postProcess, state, id) {
    state = (state !== undefined) ? state : 1;
    id = (id !== undefined) ? id : 1;
    IM.symbol = (Math.random() > 0.5) ? -1 : 1;

    return new Kinetic.Animation(function(frame) {
      if (frame.time <= IM.frm + IM.diff) {
        update(layer, frame);
      } else {
        if (state == 0) {
          state = 1;
          postProcess(id);
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

    IM.txtAnim[id] = IM.generateAnim(IM.txtLayer[id], IM.txtUpdate, IM.txtReset, state, id);

    IM.txtAnim[id].start();
  },
  addTextCanvas: function(msg, id) {
    var o_w = IM.w * 2 / 3;
    var fs = o_w / 10;
    var w = Math.floor( Math.random() * o_w);
    var h = Math.floor( Math.random() * IM.h);
    w = (w > IM.w - o_w) ? IM.w - o_w : w;

    IM.remark[id] = new Kinetic.Text({
      x: w,
      text: msg,
      fontSize: fs,
      fontFamily: 'Calibri',
      fontStyle: 'italic',
      fill: '#FFF',
      width: o_w,
      padding: 20,
      align: 'center',
      opacity: 0.1
    });
    // adjust text height
    var o_h = IM.remark[id].getHeight();
    h = (h > IM.h - o_h) ? IM.h - o_h : h;
    IM.remark[id].setY(h);

    // adjust text font size
    var fsa = IM.remark[id].getFontSize();
    fsa = (IM.h * 2 / 3 < o_h) ? fsa * 2 / 3 : fsa;
    IM.remark[id].setFontSize(fsa);

    IM.remarkRect[id] = new Kinetic.Rect({
      x: w,
      y: h,
      stroke: '#000',
      strokeWidth: 5,
      fill: '#000',
      width: o_w,
      height: IM.remark[id].getHeight(),
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffset: [10, 10],
      shadowOpacity: 0.2,
      cornerRadius: 10,
      opacity: 1
    });
    IM.txtLayer[id].add(IM.remarkRect[id]);
    IM.txtLayer[id].add(IM.remark[id]);
    IM.canvas.add(IM.txtLayer[id]);
  },
  txtUpdate: function(layer, frame) {
    var shapes  = layer.getChildren();
    var rectShape = shapes[0];
    var txtShape  = shapes[1];

    if (frame.time <= IM.frm) {
      if (rectShape.attrs.opacity >= 0.1) {
        rectShape.attrs.opacity += OPC_DIFF;
      }
      if (txtShape.attrs.opacity >= 0.1) {
        txtShape.attrs.opacity += OPC_DIFF;
      }
    } else if (frame.time <= IM.frm + IM.diff / 2) {
    } else if (frame.time <= IM.frm + IM.diff) {
      if (rectShape.attrs.opacity >= 0.1) {
        rectShape.attrs.opacity -= OPC_DIFF;
      }
      if (txtShape.attrs.opacity >= 0.1) {
        txtShape.attrs.opacity -= OPC_DIFF;
      }
    }
  },
  txtReset: function(id) {
    try {
      var obj = {"rect": IM.remarkRect[id], "text": IM.remark[id]};
      IM.animStop(IM.txtAnim[id], IM.txtLayer[id], obj);
      delete IM.txtAnim[id];
      return this;
    } catch (e) {
      console.log(e);
      return this;
    }
  }
};
