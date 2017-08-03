var mongoose = require('mongoose');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config');
var MongoDB = require('mongodb');


exports.signup_admin = function (req, res, next) {
  const option = req.body.option;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const img = req.body.img;
  const username = req.body.username;
  const password = req.body.password;
  const department = req.body.department;
  const role = 1;
  if (!firstname || !lastname || !email || !username || !password) {
    return res.status(422).json({
      success: false,
      message: 'Gönderilen bilgiler kabul edilmez.'
    });
  }

  User.findOne({
    username: username
  }, function (err, existingUser) {
    if (err) {
      res.status(400).json({
        success: false,
        message: 'İşlem hataya uğradı! Hata: ' + err
      });
    }

    // If user is not unique, return error
    if (existingUser) {
      return res.status(201).json({
        success: false,
        message: 'Kullanıcı adı kullanımda'
      });
    }

    // If no error, create account
    let oUser = new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      username: username,
      password: password,
      img: img,
      department: department,
      role: role
    });

    oUser.save(function (err, oUser) {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'İşlem hataya uğradı! Hata: ' + err
        });
      }

      res.status(201).json({
        success: true,
        message: 'Kaydınız başarı ile tamamlandı giriş bilgileriniz ile giriş yapın.'
      });
    });
  });


}

exports.signup = function (req, res, next) {
  // Check for registration errors
  const option = req.body.option;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const img = req.body.img;
  const username = req.body.username;
  const password = req.body.password;
  const role = 0;

  if (!firstname || !lastname || !email || !username || !password) {
    return res.status(422).json({
      success: false,
      message: 'Gönderilen bilgiler kabul edilmez.'
    });
  }

  User.findOne({
    username: username
  }, function (err, existingUser) {
    if (err) {
      res.status(400).json({
        success: false,
        message: 'İşlem hataya uğradı! Hata: ' + err
      });
    }

    // If user is not unique, return error
    if (existingUser) {
      return res.status(201).json({
        success: false,
        message: 'Kullanıcı adı kullanımda'
      });
    }

    // If no error, create account
    let oUser = new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      username: username,
      password: password,
      img: img,
      intern_ids: [],
      role: role
    });

    oUser.save(function (err, oUser) {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'İşlem hataya uğradı! Hata: ' + err
        });
      }

      res.status(201).json({
        success: true,
        message: 'Kaydınız başarı ile tamamlandı giriş bilgileriniz ile giriş yapın.'
      });
    });
  });
}

exports.login = function (req, res, next) {
  // find the user
  User.findOne({
    username: req.body.username
  }, function (err, user) {
    if (err) {
      res.status(400).json({
        success: false,
        message: 'İşlem hataya uğradı! Hata: ' + err
      });
    }

    if (!user) {
      res.status(201).json({
        success: false,
        message: 'Giriş bilgileri hatalı!'
      });
    } else if (user) {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          var token = jwt.sign(user, config.secret, {
            expiresIn: config.tokenexp
          });

          let last_login = user.lastlogin;

          // login success update last login
          user.lastlogin = new Date();


          user.save(function (err) {
            if (err) {
              res.status(400).json({
                success: false,
                message: 'İşlem hataya uğradı! Hata: ' + err
              });
            }

            res.status(201).json({
              success: true,
              message: {
                'userid': user._id,
                'username': user.username,
                'firstname': user.firstname,
                'role': user.role,
                'lastlogin': last_login
              },
              token: token
            });
          });
        } else {
          res.status(201).json({
            success: false,
            message: 'Giriş bilgileri hatalı!'
          });
        }
      });
    }
  });
}

exports.authenticate = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['authorization'];
  //console.log(token);
  if (token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        return res.status(201).json({
          success: false,
          message: 'Siteme giriş yapılmamış lütfen giriş yapınız.',
          errcode: 'exp-token'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(201).json({
      success: false,
      message: 'Fatal error, Giriş kabul edilemez.',
      errcode: 'no-token'
    });
  }
}

exports.getuserDetails = function (req, res, next) {

  //var id = new MongoDB.ObjectID(req.params.id);

  User.find(function (err, user) {
    if (err) {
      res.status(400).json({
        success: false,
        message: 'İşlem hataya uğradı! Hata: ' + err
      });
    }
    res.status(201).json({
      success: true,
      data: user
    });
  });
}

exports.updateUser = function (req, res, next) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const userid = req.params.id;
  const img = req.body.img;

  if (!firstname || !lastname || !email || !userid) {
    return res.status(422).json({
      success: false,
      message: 'Gönderilen bilgiler kabul edilmez.'
    });
  } else {
    User.findById(userid).exec(function (err, user) {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'İşlem hataya uğradı! Hata: ' + err
        });
      }

      if (user) {
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.img = img;
      }
      user.save(function (err) {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'İşlem hataya uğradı! Hata: ' + err
          });
        }
        res.status(201).json({
          success: true,
          message: 'Kullanıcı bilgileri başarıyla güncellendi.'
        });
      });
    });
  }
}

exports.updatePassword = function (req, res, next) {
  const userid = req.params.id;
  const oldpassword = req.body.oldpassword;
  const password = req.body.password;

  if (!oldpassword || !password || !userid) {
    return res.status(422).json({
      success: false,
      message: 'Gönderilen bilgiler kabul edilmez.'
    });
  } else {

    User.findOne({
      _id: userid
    }, function (err, user) {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'İşlem hataya uğradı! Hata: ' + err
        });
      }
      if (user) {
        user.comparePassword(oldpassword, function (err, isMatch) {
          if (isMatch && !err) {

            user.password = password;

            user.save(function (err) {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: 'İşlem hataya uğradı! Hata: ' + err
                });
              }

              res.status(201).json({
                success: true,
                message: 'Şifreniz başarıyla güncellendi.'
              });
            });
          } else {
            res.status(201).json({
              success: false,
              message: 'Eski parola doğru değil.'
            });
          }
        });
      }
    });
  }
}

exports.academician_add = function (req, res, next) {
  const userid = req.params.id;
  var a = req.body.intern_ids;
  var intern_ids = a.split(',');

  if (!userid || !intern_ids) {
    return res.status(422).json({
      success: false,
      message: 'Gönderilen bilgiler kabul edilmez.'
    });
  } else {

    User.findOne({
      _id: userid
    }, function (err, user) {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'İşlem hataya uğradı! Hata: ' + err
        });
      }
      if (user) {
        user.intern_ids.forEach(function (e) {
          intern_ids.push(e);
        });
        user.intern_ids = intern_ids;
        user.save(function (err) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            });
          }

          res.status(201).json({
            success: true,
            message: 'Şifreniz başarıyla güncellendi.'
          });
        });
      }
    });
  }
}
