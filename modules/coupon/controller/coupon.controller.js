const { couponModel } = require("../../../DB/model/coupon.model");
const cloudinary = require("../../../services/cloudinary.js");
var slugify = require('slugify');
var moment = require('moment'); // require
moment().format();
const { pagination } = require("../../../services/pagination");
const { categoryModel } = require("../../../DB/model/category.model");
const { json } = require("express");

const createCoupon = async (req, res, next) => {
  const { name, amount, expireDate } = req.body;

  const findCoupon = await couponModel.findOne({ name });
  if (findCoupon) {
    next(new Error('already exist', { cause: 409 }))
  } else {

    const coupon = await couponModel.create({
      createdBy: req.userId,
      name,
      amount,
      expireDate
    });
    if (!coupon) {
      next(new Error('fail', { cause: 400 }))
    } else {
      res.status(201).json({ message: 'success', coupon })
    }
  }
}

const updateCoupon = async (req, res, next) => {
  const { id } = req.params;
  const { amount, name } = req.body;
  let data = {}
  if (amount) {
    data.amount = amount
  }
  if (name) {
    data.name = name
  }
  let findCoupon = await couponModel.findOneAndUpdate({ _id: id }, { ...data }, { new: true });

  if (findCoupon) {
    return res.status(200).json({ message: 'success', findCoupon });
  } else {
    return next(new Error('cant find coupon', { cause: 400 }))
  }
}


const deleteCoupon = async (req, res, next) => {
  const { id } = req.params;

  let findCoupon = await couponModel.findOneAndDelete({ _id: id });

  if (findCoupon) {
    return res.status(200).json({ message: 'success', findCoupon });
  } else {
    return next(new Error('cant find coupon', { cause: 400 }))
  }
}



const ValidCoupons = async (req, res, next) => {
  const { page } = req.query;
  const { skip, limit } = pagination(page);
  let now = moment();
  let coupons = await couponModel.find({});

  let data = [];

  for (const coupon of coupons) {
    let exp = coupon.expireDate;
    let diff = now.diff(exp, "days");

    if (diff < 0) {
      data.push(coupon);
    }
  }
  return res.status(200).json({ message: 'success', data });
}



// const getcoupon = async (req, res, next) => {
//   const { id } = req.params;
//   const coupon = await couponModel.findOne({ _id: id }).populate({
//     path: 'createdBy',
//     select: 'userName'
//   });
//   if (!coupon) {
//     next(new Error('fail to get coupon', { cause: 400 }))
//   } else {
//     res.status(200).json({ message: 'success', coupon });
//   }
// }



module.exports = { createCoupon, updateCoupon, deleteCoupon, ValidCoupons/*, getcoupon */ };