var mongoose = require('mongoose');
var Intern = require('../models/intern');
var config = require('../config');
var moment = require('moment');

// Save Intern
exports.saveintern = function (req, res, next) {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const gender = req.body.gender;
    const email = req.body.email;
    const tc = req.body.tc;
    const dob = req.body.dob;
    const starteddate = req.body.starteddate;
    const endeddate = req.body.endeddate;
    const phone = req.body.phone;
    const address = req.body.address;
    const photo = req.body.photo;
    const _id = req.body._id;

    if (!tc || !firstname || !lastname || !email || !starteddate || !endeddate || !phone || !address || gender == null || !dob || !photo) {
        return res.status(422).send({ success: false, message: 'Veriler geçerli değil veya doğrulanmadı.' });
    }
        if (_id) {
            // edit intern
            Intern.findById(_id).exec(function (err, intern) {
                if (err) { res.status(400).json({ success: false, message: 'İşlem hataya uğradı! Hata: ' + err }); }

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
                    if (err) { res.status(400).json({ success: false, message: 'İşlem gerçekleştirilemedi! Hata: ' + err }); }

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
                if (err) { res.status(400).json({ success: false, message: 'İşlem hataya uğradı! Hata: ' + err }); }

                res.status(201).json({
                    success: true,
                    message: 'Staj formu başarıyla kaydedildi.'
                });
            });
        }
    }


// delete intern
exports.delintern = function (req, res, next) {
    Intern.remove({ _id: req.id }, function (err) {
        if (err) { res.status(400).json({ success: false, message: 'İşlem hataya uğradı! Hata: ' + err }); }
        res.status(201).json({
            success: true,
            message: 'Staj dosyası başarı ile silindi.'
        });
    });
}

// get intern
exports.getintern = function (req, res, next) {
    Intern.find({ _id: req.params.id }).exec(function (err, intern) {
        if (err) { res.status(400).json({ success: false, message: 'İşlem hataya uğradı! Hata: ' + err }); }
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
        return res.status(422).send({ success: false, message: 'Veriler geçerli değil veya doğrulanmadı.' });
    } else {
        Intern.findById({ _id }).exec(function (err, intern) {
            if (err) { res.status(400).json({ success: false, message: 'İşlem hataya uğradı! Hata: ' + err }); }

            // verified confirmed
            if (verified === true && intern.verified != true) {
                intern.verified = true;

                var firstDate = new Date(intern.starteddate);
                var secondDate = new Date(intern.endeddate);

                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                for (var i = 0; i < diffDays; i++) {
                    let dt = firstDate.getTime() + (i * 86400000);
                    let mnt = moment(dt).day();

                    if(mnt !== 6 && mnt !== 0 ){
                        intern.days.unshift({ date: dt, am: null, pm: null });     
                    }                  
                }

                intern.save(function (err) {
                    if (err) { res.status(400).json({ success: false, message: 'İşlem hataya uğradı! Hata: ' + err }); }

                    res.status(201).json({
                        success: true,
                        message: 'Staj formu onaylandı. Devam/Devamsızlık günleri eklendi.'
                    });
                });

                // verified not confirmed
            } else if (verified === false && intern.verified != false) {
                intern.verified = false;
                intern.days = [];

                intern.save(function (err) {
                    if (err) { res.status(400).json({ success: false, message: 'İşlem hataya uğradı! Hata: ' + err }); }

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
    Intern.find({ verified: req.params.verified }, function (err, intern) {
        if (err) { res.status(400).json({ success: false, message: 'İşlem hataya uğradı! Hata: ' + err }); }
        res.status(201).json({
            success: true,
            data: intern
        });
    });
}

// get interns by time
exports.getinterns = function (req, res, next) {
    var time;
    switch (req.params.option) {
        case 'month': {
            time = new Date();
            time.setDate(time.getDate() - 30)
            Intern.find({ starteddate: { "$lt": time }, endeddate: { "$gte": Date()} }).exec(function (err, intern) {
                if (err) { res.status(400).json({ success: false, message: 'İşlem hataya uğradı! Hata: ' + err }); }
                res.status(201).json({
                    success: true,
                    data: intern
                });
            });
        }
            break;
        case 'week': {
            time = new Date();
            time.setDate(time.getDate() - 7)
            Intern.find({ starteddate: { "$lt": time }, endeddate: { "$gte": Date()} }).exec(function (err, intern) {
                if (err) { res.status(400).json({ success: false, message: 'İşlem hataya uğradı! Hata: ' + err }); }
                res.status(201).json({
                    success: true,
                    data: intern
                });
            });
        }
            break;
        case 'day': {
            Intern.find({ starteddate: {"$lt":Date()},endeddate:{"$gt":Date()} }).exec(function (err, intern) {
                if (err) { res.status(400).json({ success: false, message: 'İşlem hataya uğradı! Hata: ' + err }); }
                res.status(201).json({
                    success: true,
                    data: intern
                });
            });
        }
            break;
        default: {
            res.status(201).json({
                success: false,
                message: 'Yanlış parametre gönderildi!'
            })
        }
            break;
    }
}
