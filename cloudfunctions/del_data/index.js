// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 数据库
let db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('booking').where({
      _id: event._id
    }).remove()
  } catch (err) {
    console.log('err=>', err);
  }
}