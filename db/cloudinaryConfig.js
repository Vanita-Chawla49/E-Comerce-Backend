const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dy42yxyay', 
    api_key: '191538495473213', 
    api_secret: 'SnLe4WnIII7akcn0njH-t6NOav0'
});

module.exports = cloudinary;
