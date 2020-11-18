"use strict";

var BodyStatic = 1; var BodyDynamic = 2; var ShapeCircle = 3; var ShapeRectangle = 4; var ShapeLine = 5;

function Vec(x, y){ this.x = x; this.y = y;}

//Simple Vector Operations
Vec.prototype.add = function (v) {return new Vec(this.x + v.x, this.y + v.y);}
Vec.prototype.mul = function (x,y) {var y = y||x;return new Vec(this.x*x, this.y*y);}
Vec.prototype.dot = function (v) {return this.x* v.x + this.y*v.y;}
Vec.prototype.cross = function (v) {return this.x*v.y - v.x*this.y;}

// self translation
Vec.prototype.move = function (dx, dy) {this.x += dx; this.y += dy;}
//===========================================================================
//Rectangle
function ReactangleEntity(x, y, width, height){
  this.shape = ShapeRectangle; this.type = BodyStatic;
  this.x = x; this.y = y;
  this.w = width; this.h = height; this.deceleration = 1.0; // ???

  this.isHit = function(i, j){
    return (this.xx <= i && i<= this.x + this.w && this.y <= j && this.y + this.h)
  }
}
//Line
function LineEntity(x0,y0,x1,y1, restitution){
  this.shape = ShapeLine; this.type = BodyStatic;
  this.x = (x0 + x1)/2; this.y = (y0 + y1)/2;
  this.x0=x0; this.y0=y0; this.x1=x1; this.y1=y1;

  this.restitution = restitution || 0.9; // ???
  this.vec = new Vec(x1 - x0, y1 - y0);
  var length = Math.sqrt(Math.pow(this.vec.x, 2) + Math.pow(this.vec.y, 2));
  this.norm = new Vec(y0 - y1, x1 - x0).mul(1 / length);
}
//===========================================================================
//Circle
function CircleEntity(x, y, radius, type, restitution, deceleration) {
  this.shape = ShapeCirle;
  this.type = type  || BodyDynamic;
  this.x = x; this.y = y; this.radius = radius;
  this.restitution = restitution || 0.9; this.deceleration = deceleration || 1.0; 
  this.accel = new Vec(0,0); this.velocity = new Vec(0,0);

  this.move = function (dx, dy){ this.x += dx; this.y += dy; }
  this.isHit = function (x, y){return Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) < Math.pow(this.radius, 2);}

  this.collidedWithRect = function(r) {
    var nx = Math.max(r.x, Math.min(this.x, r.x + r.w)); var ny = Math.max(r.y, Math.min(this.y, r.y + r.h));
    if(!this.isHit(nx,ny)){ return;} // return nothing
//??????????    if(this.onhit(nx,ny)){ return;} // return nothing ?????????????????
    if(this.onhit){ return this.onhit(this.r);} // return nothing ?????????????????

    var d2 = Math.pow(nx - this.x, 2) + Math.pow(ny - this.y, 2);
    var overlap = Math.abs(this.radius - Math.sqrt(d2));
    var mx=0, my=0;

    if(ny==r.y){my=-overlap;}else if(ny==r.y+r.h){my=overlap;}else if(nx==r.x){mx=-overlap}else if(nx==r.x+r.w){mx=overlap}
        else{mx=-this.velocity.x; my=-this.velocity.y;}

    this.move(mx,my);
    if(mx){this.velocity = this.velocity.mul(-1*this.restitution, 1);}
    if(my){this.velocity = this.velocity.mul(1,-1*this.restitution);}
  }

  this.collidedWithLine = function (line){ //Circle vs Line
    var v0 = new Vec(line.x0 - this.x + this.velocity.x, line.y0 - this.y + this.velocity.y);
    var v1 = this.velocity; var v2 = new Vec(line.x1 - linex0, line.y1 - line.y0);
    var cv1v2 = v1.cross(v2);
    var t1 = v0.cross(v1)/cv1v2; var t2 = v0.cross(v2)/cv1v2;
    var crossed = (0 <= t1 && t1 <= 1) && (0 <=t2 && t2 <= 1);

    if(crossed){
      this.move(-this.velocity.x, -this.velocity.y);
      var dot0 = this.velocity.dot(line.norm); //inner product of norm and velocity
      var vec0 = line.norm.mul(-2*dot0);
      this.velocity = vec0.add(this.velocity);
      this.velocity = this.velocity.mul(line.restitution * this.restitution);
    }
  }





}
