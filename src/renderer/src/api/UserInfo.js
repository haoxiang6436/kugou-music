import request from '@/utils/request'

export function getLoginQRCode() {
  return request({
    url: '/login/qr/key?timer=' + new Date().getTime(),
    method: 'get'
  })
}
export function getLoginQRCodeStatus(id) {
  return request({
    url: '/login/qr/check?key=' + id + '&timer=' + new Date().getTime(),
    method: 'get'
  })
}

export function getUserInfo() {
  return request({
    url: '/user/detail',
    method: 'get'
  })
}

export function getUserVipInfo() {
  return request({
    url: '/user/vip/detail',
    method: 'get'
  })
}
export function getDfid() {
  return request({
    url: '/register/dev',
    method: 'get'
  })
}
