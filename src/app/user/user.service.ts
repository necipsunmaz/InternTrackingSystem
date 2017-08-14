import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class UserService {

    public jwtToken: string;

    constructor(private http: Http) {
        const theUser: any = JSON.parse(localStorage.getItem('currentUser'));
        if (theUser) {
            this.jwtToken = theUser.token;
        }
    }

    register(oUser) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('http://localhost:3000/register', JSON.stringify(oUser), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getUser(opt) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`http://localhost:3000/api/user/${opt}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getAcademicianDetails(id){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`http://localhost:3000/api/academician/details/${id}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getAcademicianByAdmin(status) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`http://localhost:3000/api/academician/${status}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getInternsForAcademician(id) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`http://localhost:3000/interns/${id}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    academicianVerify(status, academician) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`)
        let options = new RequestOptions({ headers: headers });

        return this.http.put(`http://localhost:3000/api/academician/verify/${status}`, JSON.stringify(academician), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    registerAdmin(oAdmin) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.post(`http://localhost:3000/api/user/admin`, JSON.stringify(oAdmin), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }


    updateUser(userid, oUser) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.put(`http://localhost:3000/api/user/${userid}`, JSON.stringify(oUser), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    deleteUser(userid) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.delete(`http://localhost:3000/api/user/${userid}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    updatePassword(userid, oUser) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.put(`http://localhost:3000/api/password/${userid}`, JSON.stringify(oUser), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}