import CryptoJS from 'crypto-js';

module.exports = function sha256(data : string){
    return CryptoJS.HmacSHA1(data,"MyKEY");
}