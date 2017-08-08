import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class DepartmentsService {

    public jwtToken: string;

    constructor(private http: Http) {
        const theUser: any = JSON.parse(localStorage.getItem('currentUser'));
        if (theUser) {
            this.jwtToken = theUser.token;
        }
    }

    // Only for super admin
    saveDepartment(oDepartment) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.post('http://localhost:3000/api/department', JSON.stringify(oDepartment), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getAllAdminUser(dep) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`http://localhost:3000/api/getalladmin/${dep}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    deleteDepartment(_id) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.delete(`http://localhost:3000/api/deletedepartment/${_id}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    // Only for admin

    saveDepartmentDate(_id, date) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.put(`http://localhost:3000/api/department/${_id}`, JSON.stringify(date), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getDepartmentDate() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`http://localhost:3000/api/department`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    // Only for Intern Form

    saveIntern(oIntern) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('http://localhost:3000/intern', JSON.stringify(oIntern), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getAllDepartments() {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`http://localhost:3000/departments`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }
}