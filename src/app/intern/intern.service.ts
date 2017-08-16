import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';


@Injectable()
export class InternService {

    public jwtToken: string;

    constructor(private http: Http) {
        const theUser: any = JSON.parse(localStorage.getItem('currentUser'));
        if (theUser) {
            this.jwtToken = theUser.token;
        }
    }

    saveIntern(oIntern) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.post(`http://localhost:3000/api/intern/`, JSON.stringify(oIntern), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getIntern(internid) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`http://localhost:3000/api/intern/${internid}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getInternTracking(internid) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`http://localhost:3000/api/intern/analysis/${internid}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getInternsForDepartment() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`http://localhost:3000/api/interns`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getInternName(internid) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`http://localhost:3000/api/intern/name/${internid}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    putInternForAcademician(id, intern) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        return this.http.put(`http://localhost:3000/interns/${id}`, JSON.stringify(intern), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getInternForAdmin(id) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`http://localhost:3000/api/interns/academician/${id}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getInternForTracking() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`http://localhost:3000/api/interns/tracking`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    postDaysByTime(intern) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.post(`http://localhost:3000/api/interns/days`, JSON.stringify(intern), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    postDaysForTracking(intern) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.post(`http://localhost:3000/api/days/tracking`, JSON.stringify(intern), options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    delIntern(intid) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.delete(`http://localhost:3000/api/intern/${intid}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getInternByVerify(verified: boolean) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`http://localhost:3000/api/getintern_admin/${verified}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getInternsByOption(option: string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`http://localhost:3000/api/interns/${option}`, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    verifyIntern(internid, state) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        let options = new RequestOptions({ headers: headers });

        return this.http.put(`http://localhost:3000/api/confirmintern/${internid}`, { verified: state }, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}