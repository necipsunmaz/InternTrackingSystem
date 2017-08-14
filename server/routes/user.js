var mongoose = require('mongoose');
var User = require('../models/user');
var Intern = require('../models/intern');
var jwt = require('jsonwebtoken');
var config = require('../config');
var MongoDB = require('mongodb');


exports.signup = function (req, res, next) {
  // Check for registration errors
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const img = req.body.img;
  const username = req.body.username;
  const password = req.body.password;
  const phone = req.body.phone;
  const department = req.body.department;
  const role = 2;

  if (!firstname || !lastname || !email || !username || !password || !phone || !department) {
    return res.status(422).json({
      success: false,
      message: 'Gönderilen bilgiler kabul edilemez.'
    });
  } else {
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
        phone: phone,
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
          message: 'Kaydınız tamamlandı sistem tarafından onaylandıktan sonra giriş yapabilirisiniz.',
          data: oUser._id
        });
      });
    });
  }
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
        if (isMatch && !err && user.isEnabled === true) {
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
                'lastname': user.lastname,
                'email': user.email,
                'lastlogin': last_login,
                'department': user.department,
                'role': user.role
              },
              token: token
            });
          });
        } else if (isMatch && !err && user.isEnabled === false) {
          res.status(201).json({
            success: false,
            message: 'Hesabınız oluşuturlmuş ancak henüz onaylanmamış!'
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

// Get Only Admin User
exports.getOnlyAdmin = function (req, res, next) {
  User.find({
    role: "Admin"
  }, function (err, user) {
    if (err) {
      res.status(400).json({
        success: false,
        message: 'İşlem hataya uğradı! Hata: ' + err
      });
    }
    res.status(201).json({
      success: true,
      data: {
        '_id': user._id,
        'firstname': user.firstname,
        'lastname': user.lastname,
      }
    });
  });

}

exports.getuserDetails = function (req, res, next) {
  const role = req.decoded._doc.role;
  const opt = req.params.opt;

  if (opt !== null || role !== null) {
    // Return Admin
    if (role == 0 && opt == 1 || opt == 2) {
      User.find({
        role: opt
      }, function (err, user) {
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
    } else if (role == 0 && opt == 0) {
      User.find({
        isEnabled: opt,
        role: 1
      }, function (err, user) {
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
    } else if (role == 1 && opt === 1 || opt === 2) {
      User.find({
        role: opt
      }, function (err, user) {
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
    } else {
      res.status(400).json({
        success: false,
        message: 'Hatalı giriş!'
      });
    }


  } else {
    res.status(400).json({
      success: false,
      message: 'Hatalı girdi!'
    });
  }
}

exports.registerAdmin = function (req, res, next) {
  if (req.decoded._doc.role === 0) {
    const _id = req.body._id;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const photo = req.body.img;
    const username = req.body.username;
    const password = req.body.password;
    const phone = req.body.phone;
    const role = 1;

    if (!firstname || !lastname || !email || !username || !phone) {
      return res.status(422).json({
        success: false,
        message: 'Gönderilen bilgiler kabul edilemez.'
      });
    } else if (!_id) {
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
          phone: phone,
          department: null,
          role: role,
          photo: photo
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
            message: 'Yönetici başarıyla oluşturuldu.'
          });
        });
      });
    } else if (_id) {
      User.findById(_id).exec(function (err, user) {
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
          user.phone = phone;
          user.username = username;
          user.photo = photo;
          user.role = role;
        }

        user.save(function (err) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            })
          }
          res.status(201).json({
            status: true,
            message: user.firstname + ' ' + user.lastname + ' yöneticisi başarıyla güncelleştirildi.'
          });
        });
      })
    }

  } else {
    res.status(401).json({
      success: false,
      message: 'Yetkisiz erişim!'
    });
  }

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

exports.deleteUser = function (req, res, next) {
  if (req.decoded._doc.role === 0) {
    User.remove({
      _id: req.params.id
    }, function (err) {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'İşlem hataya uğradı! Hata: ' + err
        });
      }
      res.status(201).json({
        success: true,
        message: 'Kullanıcı başarıyla silindi.'
      });
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Yetkisiz erişim!'
    });
  }
}


exports.academicianVerify = function (req, res, next) {
  const status = req.params.status;
  const _id = req.body.academician_id;
  const role = req.decoded._doc.role;
  if (role == 1) {
    if (!_id) {
      return res.status(422).json({
        success: false,
        message: 'Gönderilen bilgiler kabul edilmez.'
      });
    } else if (status == true) {
      User.findById(_id).exec(function (err, academician) {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'İşlem hataya uğradı! Hata: ' + err
          });
        }

        academician.isEnabled = true;
        academician.save(function (err) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            });
          }
          res.status(201).json({
            success: true,
            message: 'İşlem başarıyla gerçekleştirildi.'
          });
        });
      });
    } else {

      User.remove({
        _id: _id
      }, function (err) {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'İşlem hataya uğradı! Hata: ' + err
          });
        }

        Intern.find({
          academician: _id
        }).exec(function (err, intern) {
          if (intern) {
            intern.forEach(function (element) {
              element.academician = null;
              element.save(function (err) {
                if (err) {
                  res.status(400).json({
                    success: false,
                    message: 'İşlem hataya uğradı! Hata: ' + err
                  });
                }
              });
            }, this);

            res.status(201).json({
              success: true,
              message: 'Akademisyen başvuru formu başarıyla silindi.'
            });
          }
        });

      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: 'Yetkisiz giriş.'
    });
  }
}

exports.academicianInterns = function (req, res, next) {
  const userid = req.params.id;
  var a = req.body.intern_ids;
  var c = [];

  if (role == 2) {
    if (!academicianid || !internid) {
      return res.status(422).json({
        success: false,
        message: 'Gönderilen bilgiler kabul edilmez.'
      });
    } else {
      if (!userid || !a) {
        return res.status(422).json({
          success: false,
          message: 'Gönderilen bilgiler kabul edilmez.'
        });
      } else {
        a.split(',').forEach(function (e) {
          c.push({
            intern_id: e,
            state: null
          });
        });
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
            var inbox;
            var incomingbox = [];
            var department;
            user.intern_ids.forEach(function (e) {
              c.push(e);
              Intern.findById(e, 'department', function (err, internn) {
                if (err) {
                  res.status(400).json({
                    success: false,
                    message: 'İşlem hataya uğradı! Hata: ' + err
                  });
                }
                department = internn.department;
              });
              User.findOne({
                department: department
              }, 'Inbox', function (err, adminn) {
                if (err) {
                  res.status(400).json({
                    success: false,
                    message: 'İşlem hataya uğradı! Hata: ' + err
                  });
                }
                incomingbox = adminn.Inbox;
                incomingbox.push({
                  academician: academicianid,
                  intern: internid,
                  state: null
                });
                adminn.Inbox = incomingbox;
                adminn.save(function (err) {
                  if (err) {
                    res.status(400).json({
                      success: false,
                      message: 'İşlem hataya uğradı! Hata: ' + err
                    });
                  }
                });
              });
            });
            user.intern_ids = c;
            user.save(function (err) {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: 'İşlem hataya uğradı! Hata: ' + err
                });
              }

              res.status(201).json({
                success: true,
                message: 'Öğrenciler başarıyla eklendi.'
              });
            });
          }
        });
      }
    }
  }
}


exports.getAcademicianByAdmin = function (req, res, next) {
  const isEnbaled = req.params.status;
  const department = req.decoded._doc.department;
  User.find({
    role: 2,
    isEnabled: isEnbaled,
    department: department
  }, '_id firstname lastname').exec(function (err, academician) {
    if (err) {
      res.status(400).json({
        success: false,
        message: ' Bir hata oluştu ' + err
      });
    }

    res.status(201).json({
      success: true,
      data: academician
    });
  });
}

exports.getAcademician = function (req, res, next) {
  const academician_id = req.params.id;
  User.findById(academician_id).exec(function (err, academician) {
    if (err) {
      res.status(400).json({
        success: false,
        message: ' Bir hata oluştu ' + err
      });
    }

    res.status(201).json({
      success: true,
      data: academician
    });
  });
}
