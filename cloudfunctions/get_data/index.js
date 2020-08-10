// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 获取数据库
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 查询数据库集合iconsData所有数据
    return await db.collection('booking').where({
      userInfo: event.userInfo
    }).get();
  } catch (err) {
    console.log('err=>', err);
  }
}