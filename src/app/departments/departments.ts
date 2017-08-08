export interface Departments {
    _id: string,
    name: string,
    phone: string,
    admin: string,
    username: string,
    email: string,
    dates: [{
        starteddate: Date,
        endeddate: Date,
        isEnabled: boolean
    }]
}