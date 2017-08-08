var mongoose = require('mongoose');
var Department = require('../models/department');
var User = require('../models/user');
var Intern = require('../models/intern');
var jwt = require('jsonwebtoken');
var config = require('../config');
var MongoDB = require('mongodb');


/////////////////// Only for Super Admin  /////////////////////////

exports.saveDepartment = function (req, res, next) {
  if (req.decoded._doc.role === 0) {
    const _id = req.body._id;
    const name = req.body.name;
    const admin = req.body.admin;
    const email = req.body.email;
    const phone = req.body.phone;

    if (!name || !admin || !email || !phone) {
      return res.status(422).json({
        success: false,
        message: 'Gönderilen bilgiler kabul edilemez.'
      });
    } else if (!_id) {
      Department.findOne({
        name: name
      }, function (err, existingDepartment) {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'İşlem hataya uğradı! Hata: ' + err
          });
        }

        // If department is not unique, return error
        if (existingDepartment) {
          return res.status(201).json({
            success: false,
            message: 'Departman adı kullanımda'
          });
        }

        // If no error, create department
        let oDepartment = new Department({
          name: name,
          admin: admin,
          email: email,
          phone: phone
        });

        oDepartment.save(function (err, oDepartment) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            });
          }

          User.findById(oDepartment.admin).exec(function (err, user) {
            if (err) {
              res.status(400).json({
                success: false,
                message: 'İşlem hataya uğradı! Hata: ' + err
              })
            }

            if (user) {
              user.department = oDepartment._id;
              user.isEnabled = true;
            } else if (!user) {
              res.status(400).json({
                success: false,
                message: 'İşlem hataya uğradı!'
              })
            }

            user.save(function (err) {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: 'İşlem hataya uğradı! Hata: ' + err
                })
              }
            });

          });

          res.status(201).json({
            success: true,
            message: name + ' departmanı başarıyla eklendi.'
          });
        });
      });
    } else if (_id) {
      Department.findById(_id).exec(function (err, department) {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'İşlem hataya uğradı! Hata: ' + err
          });
        }

        if (department) {
          if (department.admin !== admin) {
            User.findById(department.admin).exec(function (err, user) {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: 'İşlem hataya uğradı! Hata: ' + err
                })
              }

              if (user) {
                user.isEnabled = false;
                user.department = null;
              } else if (!user) {
                res.status(400).json({
                  success: false,
                  message: 'İşlem hataya uğradı!'
                })
              }

              user.save(function (err) {
                if (err) {
                  res.status(400).json({
                    success: false,
                    message: 'İşlem hataya uğradı! Hata: ' + err
                  })
                }
              });

            });
          }

          department.name = name;
          department.admin = admin;
          department.email = email;
          department.phone = phone;
        }

        department.save(function (err) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            })
          }

          User.findById(department.admin).exec(function (err, user) {
            if (err) {
              res.status(400).json({
                success: false,
                message: 'İşlem hataya uğradı! Hata: ' + err
              })
            }

            if (user) {
              user.isEnabled = true;
              user.department = department._id;
            } else if (!user) {
              res.status(400).json({
                success: false,
                message: 'İşlem hataya uğradı!'
              })
            }

            user.save(function (err) {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: 'İşlem hataya uğradı! Hata: ' + err
                })
              }
            });
          });

          res.status(201).json({
            status: true,
            message: department.name + ' departmanı başarıyla güncelleştirildi.'
          });
        });
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Yetkisiz erişim!'
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: 'Yetkisiz erişim!'
    });
  }
}

exports.getAllAdminUser = function (req, res, next) {
  if (req.decoded._doc.role === 0) {
    const dep = req.params.dep;
    if (dep !== null && dep.length === 24) {
      User.findOne({
        role: 1,
        department: dep
      }, function (err, user) {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'İşlem hataya uğradı! Hata: ' + err
          });
        }
        res.status(201).json({
          success: true,
          data: user.firstname + ' ' + user.lastname
        });
      });
    } else {
      User.find({
        role: 1,
        department: null
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
    }

  } else {
    res.status(401).json({
      success: false,
      message: 'Yetkisiz erişim!'
    });
  }
}

exports.getAllDepartments = function (req, res, next) {
    Department.find(function (err, department) {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'İşlem hataya uğradı! Hata: ' + err
        });
      }

      res.status(200).json({
        success: true,
        data: department
      });
    });
}

exports.deleteDepartment = function (req, res, next) {
  if (req.decoded._doc.role === 0) {
    Department.findById(req.params.id).exec(function (err, department) {
      if (err) {
        res.status(405).json({
          success: false,
          message: 'İşlem hataya uğradı! Hata: ' + err
        });
      }
      if (department) {
        Intern.remove({
          department: department._id
        }).exec(function (err) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            });
          }
        });

        User.remove({
          department: department._id
        }).exec(function (err) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            });
          }
        });

        Department.remove({
          _id: req.params.id
        }).exec(function (err) {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'İşlem hataya uğradı! Hata: ' + err
            });
          }
        });
      }
      res.status(200).json({
        success: true,
        message: 'Departman, yöneticisi ve departmana kayıtlı tüm stajyerler silindi.'
      });
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Yetkisiz erişim!'
    });
  }
}


/////////////////// Only for admin /////////////////////////


exports.saveDapartmentDate = function (req, res, next) {
  if (req.decoded._doc.role === 1) {
    const _id = req.params.id;
    const starteddate = req.body.starteddate;
    const endeddate = req.body.endeddate;
    var dateArray = [];

    Department.findById(req.decoded._doc.department).exec(function (err, department) {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'İşlem hataya uğradı! Hata: ' + err
        });
      }

      department.dates.forEach(function (element) {
        if (element != null) {
          if (_id != 0 && element.id == _id) {
            if (element.isEnabled) {
              element.isEnabled = false;
            } else {
              element.isEnabled = true;
            }
            dateArray.push(element);
          } else if (_id == 1 && element._id == req.body._id) {
            console.log('delete this date: '+ req.body._id);
          } else {
            dateArray.push(element);
          }
        }
      }, this);

      if (_id == 0) {
        dateArray.unshift({
          starteddate: starteddate,
          endeddate: endeddate,
          isEnabled: true
        });
      }

      department.dates = dateArray;
      department.save(function (err) {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'İşlem hataya uğradı! Hata: ' + err
          });
        }

        res.status(201).json({
          success: true,
          message: department.name + ' departmanı başarıyla güncelleştirildi.'
        });
      });

    });

  } else {
    res.status(401).json({
      success: false,
      message: 'Yetkisiz erişim!'
    });
  }
}

exports.getDepartmentDate = function (req, res, next) {
  if (req.decoded._doc.role === 1) {
    const _id = req.decoded._doc.department;
    if (!_id) {
      return res.status(422).send({
        success: false,
        message: 'Veriler geçerli değil veya doğrulanmadı.'
      });
    }

    Department.findById(_id).exec(function (err, department) {
      if (err) res.status(400).json({
        success: false,
        message: 'İşlem hataya uğradı! Hata: ' + err
      });

      if (department) {
        res.status(200).json({
          success: true,
          data: department.dates
        });
      }
    });

  } else {
    res.status(401).json({
      success: false,
      message: 'Yetkisiz erişim!'
    });
  }
}