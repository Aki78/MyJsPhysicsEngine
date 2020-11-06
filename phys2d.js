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

//Rectangle
function ReactangleEntity(x, y, width, height){
  this.shape = ShapeRectangle; this.type = BodyStatic;
  this.x = x; this.y = y;
  this.w = width; this.h = height; this.deceleration = 1.0; // ???

  this.isHit = function(i, j){
    return (this.xx <= i && i<= this.x + this.w && this.y <= j && this.y + this.h)
  }
}
