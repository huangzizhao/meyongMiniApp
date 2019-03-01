const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//获取字符串字节长度
const getByteLength = val => {
  var realLength = 0,
    len = val.length,
    charCode = -1;
  for (var i = 0; i < len; i++) {
    charCode = val.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128)
      realLength += 1;
    else
      realLength += 2;
  }
  return realLength;
}

//获取用户信息 授权

module.exports = {
  formatTime: formatTime,
  getByteLength
}