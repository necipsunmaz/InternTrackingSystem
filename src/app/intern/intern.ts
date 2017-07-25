export interface IIntern {
    firstname: string,
    lastname: string,
    gender: string,
    email: string,
    tc: string,
    dob: Date,
    starteddate: Date,
    endeddate: Date,
    phone: string,
    address: string,
    verified: Boolean,
    days: [{
        date: Date,
        am: Boolean,
        pm: Boolean
    }]
}