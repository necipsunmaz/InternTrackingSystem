var mongoose = require('mongoose');
var Intern = require('../models/intern');
var Days = require('../models/days');
var config = require('../config');
var moment = require('moment');

// Save Intern
exports.saveIntern = function (req, res, next) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const gender = req.body.gender;
  const email = req.body.email;
  const department = req.body.department;
  const tc = req.body.tc;
  const dob = req.body.dob;
  const starteddate = req.body.starteddate;
  const endeddate = req.body.endeddate;
  const teacher = req.body.teacher;
  const phone = req.body.phone;
  const address = req.body.address;
  const photo = req.body.photo;
  const _id = req.body._id;

  if (!tc || !firstname || !lastname || !email || !starteddate || !endeddate || !phone || !address || gender == null || !department || !dob || !photo || !teacher) {
    return res.status(422).send({
      success: false,
      message: 'Veriler geçerli değil veya doğrulanmadı.'
    });
  }
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
        intern.department = department;
        intern.tc = tc;
        intern.dob = dob;
        intern.starteddate = starteddate;
        intern.endeddate = endeddate;
        intern.phone = phone;
        intern.address = address;
        intern.photo = photo;
        intern.teacher = teacher;
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
      department: department,
      tc: tc,
      dob: dob,
      starteddate: starteddate,
      endeddate: endeddate,
      teacher: teacher,
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


exports.academicianIntern = function (req, res, next) {
  const _id = req.params.id;
  const academician = req.body.academician;
  if (_id) {
    Intern.findById(_id).exec(function (err, intern) {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'İşlem hataya uğradı! Hata: ' + err
        });
      }

      if (intern) {
        intern.academician = academician;
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
    })
  }

}

// delete intern
exports.delIntern = function (req, res, next) {
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
exports.getIntern = function (req, res, next) {
  Intern.findById(req.params.id).exec(function (err, intern) {
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

// get interns
exports.getInterns = function (req, res, next) {
  if (req.decoded._doc.role === 1) {
    const department = req.decoded._doc.department;
    Intern.find({
      department: department,
      verified: true,
      isComplete: false
    }, "_id firstname lastname phone email starteddate photo", function (err, intern) {
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
  } else {
    return res.status(401).send({
      success: false,
      message: 'Yetkisiz giriş!'
    });
  }
}

// get interns for tracking
exports.getInternsForTracking = function (req, res, next) {
  if (req.decoded._doc.role === 1) {
    const department = req.decoded._doc.department;
    Intern.find({
      department: department,
      verified: true,
      isComplete: false
    }, "_id firstname lastname email phone", function (err, intern) {
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
  } else {
    return res.status(401).send({
      success: false,
      message: 'Yetkisiz giriş!'
    });
  }
}

// not - confirmation intern form
exports.confirmIntern = function (req, res, next) {
  const _id = req.params.id;
  const verified = req.body.verified;

  if (!verified && !_id) {
    return res.status(422).send({
      success: false,
      message: 'Veriler geçerli değil veya doğrulanmadı.'
    });
  } else {
    Intern.findById(_id).exec(function (err, intern) {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'İşlem hataya uğradı! Hata: ' + err
        });
      }

      // verified confirmed
      if (verified === true && intern.verified != true) {
        intern.verified = true;
        intern.isComplete = false;

        var firstDate = new Date(intern.starteddate);
        var secondDate = new Date(intern.endeddate);

        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));

        for (var i = 0; i < diffDays; i++) {
          let dt = firstDate.getTime() + (i * 86400000);
          let mnt = moment(dt).day();
          if (mnt !== 6 && mnt !== 0) {
            Days.create({
              intern_id: _id,
              date: dt,
              am: null,
              pm: null
            }, function (err, idays) {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: 'İşlem hataya uğradı! Hata: ' + err
                });
              }
              idays.save(function (err) {
                if (err) {
                  res.status(400).json({
                    success: false,
                    message: 'İşlem hataya uğradı! Hata: ' + err
                  });
                }
              });
            });
          }
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
            message: 'Staj formu onaylandı. Devam/Devamsızlık günleri eklendi.'
          });
        });

        // verified not confirmed
      } else if (verified === false && intern.verified != false) {
        intern.verified = false;
        intern.isComplete = null;

        Days.remove({
          intern_id: intern._id
        }, function (err) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            });
          }
        });
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
exports.getInternAdmin = function (req, res, next) {
  if(req.decoded._doc.role === 1){
    Intern.find({
    department: req.decoded._doc.department,
    verified: req.params.verified
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
  } else {
      res.status(401).send({
        success: false,
        message: 'Yetkisiz giriş!'
    });
  }
}

// get interns by time
exports.postDaysByTime = function (req, res, next) {
  if(req.decoded._doc.role === 1){
    let interns = req.body.interns;
    let today =   moment().format('YYYY-MM-DD');//moment().startOf('day'); 
    let aWeekAgo = moment(today).subtract(7, 'days').format('YYYY-MM-DD'); //moment(moment().subtract(15, "days").format('LL'));
    let aMontAgo = moment(today).subtract(1, "month").format('YYYY-MM-DD');
  switch (req.body.time) {
    case 'day':
      {
        Days.find({
          $or: interns,
          date: today
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
        Days.find({
          $or: interns,
          date: { $gte : aWeekAgo, $lt: today }
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
      case 'month':
      {
        Days.find({
          $or: interns,
          date: { $gte : aMontAgo, $lt: today }
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
      case 'period':
      {
        Days.find({
          $or: interns
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
    default:
      {
        res.status(201).json({
          success: false,
          message: 'Yanlış parametre gönderildi!'
        })
      }
      break;
    }
  } else {
    res.status(401).send({
      success: false,
      message: 'Yetkisiz giriş!'
    });
  }
}

exports.postDaysForTracking = function (req, res, next) {
  if(req.decoded._doc.role === 1){
    const am = req.body.am;
    const pm = req.body.pm;
    const days = req.body.days;
    Days.update({ $or: days}, {am: am, pm: pm}, {multi: true}).exec(function(err){
       if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            });
          }
          res.status(201).json({
            success: true,
            message: "İşlem başarıyla gerçekleştirildi."
          });
    });
  } else {
    return res.status(401).send({
      success: false,
      message: 'Yetkisiz giriş!'
    });
  }
}

// Intern count by is he/she came or not

exports.getIncomingIntern = function (req, res, next) {
  var id = req.params.id;
  var total = 0;
  var endless = 0;
  Days.find({
    intern_id: id
  }, function (err, days) {
    if (err) {
      res.status(400).json({
        success: false,
        meesage: 'Bir Hata oluştu ' + err
      });
    }
    days.forEach(function (element) {
      if (element.am == false || element.pm == false) {
        endless++;
      }
      total++;
    }, this);
    res.status(201).json({
      success: true,
      endless: endless,
      incoming: total - endless,
      total: total
    });
  });
}

exports.checkIntern = function (req, res, next) {
  const internid = req.body.id;
  const date = req.body.date;
  const ampm = req.body.ampm;
  const check = req.body.check;

  if (req.decoded._doc.role == 1 || req.decoded._doc.role == 0) {
    Days.findOne({
      intern_id: internid,
      date: date
    }, function (err, day) {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'İşlem hataya uğradı! Hata: ' + err
        });
      }
      switch (ampm) {
        case 'am':
          day.am = check;
          break;
        case 'pm':
          day.pm = check;
          break;
      }

      var promise = day.save(function (err) {

        if (err) {
          res.status(400).json({
            success: false,
            message: 'İşlem hataya uğradı! Hata: ' + err
          });
        }
        res.status(201).json({
          success: true,
          message: 'Başarılı bir şekilde yoklama alındı'
        });
      });
    });

  } else {
    return res.status(401).send({
      success: false,
      message: 'Yetkisiz giriş!'
    });
  }
}

exports.getInternDates = function (req, res, next) {
  Days.find({
    intern_id: req.params.id
  }, function (err, days) {
    if (err) {
      res.status(400).json({
        success: false,
        message: 'İşlem hataya uğradı! Hata: ' + err
      });
    }
    res.status(200).json({
      success: true,
      data: days
    });
  });
}

exports.getInternName = function (req, res, next) {
  const internid = req.params.id;
  Intern.findById(internid, '_id firstname lastname', function (err, intern) {
    if (err) {
      res.status(400).json({
        success: false,
        message: ' Bir hata oluştu ' + err
      });
    }
    res.status(201).json({
      success: true,
      data: intern
    });
  });
}

exports.getInternsForAcademician = function (req, res, next) {
  departmentId = req.params.id;
  Intern.find({
    department: departmentId,
    verified: true,
    academician: null
  }, '_id firstname lastname', function (err, intern) {
    if (err) {
      res.status(400).json({
        success: false,
        message: ' Bir hata oluştu ' + err
      });
    }

    res.status(201).json({
      success: true,
      data: intern
    });
  });
}

exports.getInternsNameForAdmin = function (req, res, next) {
  Intern.find({
    academician: req.params.id
  }, '_id firstname lastname', function (err, intern) {
    if (err) {
      res.status(400).json({
        success: false,
        message: ' Bir hata oluştu ' + err
      });
    }

    res.status(201).json({
      success: true,
      data: intern
    });
  });
}

exports.getInternsTracking = function (req, res, next) {
  const intern_id = req.params.id;
  let internTracking = {};
  if (intern_id) {

    Days.count({
      intern_id: intern_id
    }, function (err, total) {
      internTracking.total = total;

      Days.count({
        intern_id: intern_id,
        am: false,
        pm: false
      }, function (err, absenteeism) {
        internTracking.absenteeism = absenteeism;

        Days.count({
          intern_id: intern_id,
          am: true,
          pm: true
        }, function (err, continuity) {
          internTracking.continuity = continuity;
          internTracking.remaining = total - (absenteeism + continuity);
          internTracking.percentage = ((continuity / total) * 100).toFixed(0);

          res.status(201).json({
            success: true,
            data: internTracking
          });
        });
      });
    });
  }
}
