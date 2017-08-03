var mongoose = require('mongoose');
var Intern = require('../models/intern');
var config = require('../config');
var User = require('../models/user');

// Save Intern
exports.saveintern = function (req, res, next) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const gender = req.body.gender;
  const email = req.body.email;
  const tc = req.body.tc;
  const dob = req.body.dob;
  const starteddate = new Date().getDate();
  const endeddate = new Date().getDate();
  const phone = req.body.phone;
  const address = req.body.address;
  const photo = req.body.photo;
  const _id = req.body._id;

  if (!tc || !firstname || !lastname || !email || !starteddate || !endeddate || !phone || !address || !gender || !dob) {
    return res.status(422).send({
      success: false,
      message: 'Veriler geçerli değil veya doğrulanmadı.'
    });
  } else {
    if (_id) {
      // edit intern
      Intern.findById(_id).exec(function (err, intern) {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'İşlem hataya uğradı! Hata: ' + err
          });
        }

        if (intern) {
          intern.firstname = firstname;
          intern.lastname = lastname;
          intern.gender = gender;
          intern.email = email;
          intern.tc = tc;
          intern.dob = dob;
          intern.starteddate = starteddate;
          intern.endeddate = endeddate;
          intern.phone = phone;
          intern.address = address;
          intern.photo = photo;
        }
        intern.save(function (err) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem gerçekleştirilemedi! Hata: ' + err
            });
          }

          res.status(201).json({
            success: true,
            message: 'Staj formu başarıyla güncellendi.'
          });
        });
      });
    } else {
      // Add new Intern
      let oIntern = new Intern({
        firstname: firstname,
        lastname: lastname,
        gender: gender,
        email: email,
        tc: tc,
        dob: dob,
        starteddate: starteddate,
        endeddate: endeddate,
        phone: phone,
        address: address,
        photo: photo
      });
      oIntern.save(function (err) {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'İşlem hataya uğradı! Hata: ' + err
          });
        }

        res.status(201).json({
          success: true,
          message: 'Staj formu başarıyla kaydedildi.'
        });
      });
    }
  }
}

// delete intern
exports.delintern = function (req, res, next) {
  Intern.remove({
    _id: req.id
  }, function (err) {
    if (err) {
      res.status(400).json({
        success: false,
        message: 'İşlem hataya uğradı! Hata: ' + err
      });
    }
    res.status(201).json({
      success: true,
      message: 'Staj dosyası başarı ile silindi.'
    });
  });
}

// get intern
exports.getintern = function (req, res, next) {
  Intern.find({
    _id: req.params.id
  }).exec(function (err, intern) {
    if (err) {
      res.status(400).json({
        success: false,
        message: 'İşlem hataya uğradı! Hata: ' + err
      });
    }
    res.status(201).json({
      success: true,
      data: intern
    });
  });
}

// not - confirmation intern form
exports.confirmintern = function (req, res, next) {
  const _id = req.params.id;
  const verified = req.body.verified;

  if (!verified && !_id) {
    return res.status(422).send({
      success: false,
      message: 'Veriler geçerli değil veya doğrulanmadı.'
    });
  } else {
    Intern.findById({
      _id
    }).exec(function (err, intern) {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'İşlem hataya uğradı! Hata: ' + err
        });
      }

      // verified confirmed
      if (verified === true && intern.verified != true) {
        intern.verified = true;

        var firstDate = new Date(intern.starteddate);
        var secondDate = new Date(intern.endeddate);

        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
        for (var i = 0; i < diffDays; i++) {
          intern.days.push({
            date: firstDate.getTime() + (i * 86400000),
            am: false,
            pm: false
          });
        }

        intern.save(function (err) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            });
          }

          res.status(201).json({
            success: true,
            message: 'Staj formu onaylandı. ' + diffDays.toString() + ' günlük yoklama listesi eklendi.'
          });
        });

        // verified not confirmed
      } else if (verified === false && intern.verified != false) {
        intern.verified = false;
        intern.days = [];

        intern.save(function (err) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            });
          }

          res.status(201).json({
            success: true,
            message: 'Staj formu onayı kaldırıldı.'
          });
        });

        // same value
      } else {
        res.status(201).json({
          success: false,
          message: 'Form daha önceden zaten istediğiniz gibi düzenlenmiş.'
        })
      }

    });
  }
}

// get intern by admin
exports.getintern_admin = function (req, res, next) {
  switch (req.user.role) {
    case '0':
      {
        var userinterns = [];
        var jsresult = [];
        User.find({
          _id: req.body.userid
        }, function (err, user) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            });
          };
          userinterns = user.intern_ids;
        });
        userinterns.forEach(function (element) {
          Intern.find({
            _id: element,
            verified: true
          }, function (err, intern) {
            if (err) {
              res.status(400).json({
                success: false,
                message: 'İşlem hataya uğradı! Hata: ' + err
              });
            }
            jsresult.push(intern);
          });
        }, this);
        res.status(201).json({
          success: true,
          data: jsresult
        });
      }
      break;

    case '1':
      {
        var userdepartment;
        User.find({
          _id: req.body.userid
        }, function (err, user) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            });
          }
          userid = user.department;
        });

        switch (req.params.verified) {
          case true:
            Intern.find({
              department: userdepartment,
              verified: true
            }, function (err, intern) {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: 'İşlem hataya uğradı! Hata: ' + err
                });
              }
              res.status(201).json({
                success: true,
                data: intern
              });
            });
            break;
          case false:
            Intern.find({
              department: userdepartment,
              verified: false
            }, function (err, intern) {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: 'İşlem hataya uğradı! Hata: ' + err
                });
              }
              res.status(201).json({
                success: true,
                data: intern
              });
            });
            break;
        }
      }
      break;
    case '2':
      switch (req.params.verified) {
        case true:
          Intern.find({
            department: userdepartment,
            verified: true
          }, function (err, intern) {
            if (err) {
              res.status(400).json({
                success: false,
                message: 'İşlem hataya uğradı! Hata: ' + err
              });
            }
            res.status(201).json({
              success: true,
              data: intern
            });
          });
          break;
        case false:
          Intern.find({
            department: userdepartment,
            verified: false
          }, function (err, intern) {
            if (err) {
              res.status(400).json({
                success: false,
                message: 'İşlem hataya uğradı! Hata: ' + err
              });
            }
            res.status(201).json({
              success: true,
              data: intern
            });
          });
          break;
      }
      break;
  }
}

// get interns by time
exports.getinterns = function (req, res, next) {
  var time;
  switch (req.params.option) {
    case 'month':
      {
        time = new Date();
        time.setDate(time.getDate() - 30)
        Intern.find({
          starteddate: {
            "$lt": time
          },
          endeddate: {
            "$gte": Date()
          }
        }).exec(function (err, intern) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            });
          }
          res.status(201).json({
            success: true,
            data: intern
          });
        });
      }
      break;
    case 'week':
      {
        time = new Date();
        time.setDate(time.getDate() - 7)
        Intern.find({
          starteddate: {
            "$lt": time
          },
          endeddate: {
            "$gte": Date()
          }
        }).exec(function (err, intern) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            });
          }
          res.status(201).json({
            success: true,
            data: intern
          });
        });
      }
      break;
    case 'day':
      {
        Intern.find({
          starteddate: {
            "$lt": Date()
          },
          endeddate: {
            "$gt": Date()
          }
        }).exec(function (err, intern) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            });
          }
          res.status(201).json({
            success: true,
            data: intern
          });
        });
      }
      break;
    case 'all':
      {
        Intern.find().exec(function (err, intern) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            });
          }
          res.status(201).json({
            success: true,
            data: intern
          });
        });
      }
      break;
    default:
      {
        res.status(201).json({
          success: false,
          message: 'Yanlış parametre gönderildi!'
        })
      }
      break;
  }
}

exports.checkintern = function (req, res, next) {
  var objectid = (Date(req.body.date) - Date(req.body.starteddate)) / 86400000;
  Intern.findById(req.params.id).exec(function (err, intern) {
    if (err) {
      res.status(400).json({
        success: false,
        message: 'İşlem hataya uğradı! Hata: ' + err
      });
    }

    if (intern) {
      intern.days[objectid] = {
        am: true
      };
    }
    intern.save(function (err) {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'İşlem hataya uğradı! Hata: ' + err
        });
      }
      res.status(201).json({
        success: true,
        message: 'Onaylandı'
      });
    });
  });
}
