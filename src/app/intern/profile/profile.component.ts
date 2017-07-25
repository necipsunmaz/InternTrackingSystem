import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../user/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from '../../common/toastr.service';
import { InternService } from '../intern.service';
import { IIntern } from '../intern';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-table-filter',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  closeResult: string;

  constructor(private modalService: NgbModal) { }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  
  users = [{
    'gender': 'male',
    'name': {
      'title': 'mr',
      'first': 'karl',
      'last': 'johnson'
    },
    'location': {
      'street': '5825 pecan acres ln',
      'city': 'anaheim',
      'state': 'new mexico',
      'postcode': 65891
    },
    'email': 'karl.johnson@example.com',
    'login': {
      'username': 'organicbutterfly786',
      'password': 'fenris',
      'salt': 'bDS9jzK3',
      'md5': 'ee5a1150ca9178e7b7c9ed9c6a1ad9fd',
      'sha1': '5c8e619331fe0bc814520a73bdf8dbe44146b061',
      'sha256': '487cfc9b6a5900978b4b9cdb795d4a465fb4590d749b2daca013216b5409b711'
    },
    'dob': '1948-08-24 03:26:34',
    'registered': '2007-11-18 04:39:16',
    'phone': '(006)-832-0490',
    'cell': '(047)-684-3316',
    'id': {
      'name': 'SSN',
      'value': '355-74-8885'
    },
    'picture': {
      'large': 'https://randomuser.me/api/portraits/men/62.jpg',
      'medium': 'https://randomuser.me/api/portraits/med/men/62.jpg',
      'thumbnail': 'https://randomuser.me/api/portraits/thumb/men/62.jpg'
    },
    'nat': 'US'
  },
  {
    'gender': 'female',
    'name': {
      'title': 'mrs',
      'first': 'asuncion',
      'last': 'gomez'
    },
    'location': {
      'street': '1924 calle de ángel garcía',
      'city': 'torrente',
      'state': 'comunidad valenciana',
      'postcode': 52933
    },
    'email': 'asuncion.gomez@example.com',
    'login': {
      'username': 'crazytiger593',
      'password': 'pyon',
      'salt': 'iyuoArpz',
      'md5': 'e826af998a4c390823cab42b49c895f4',
      'sha1': 'd4ddac5eabc363d58e0372bfeb08ea07f5b17377',
      'sha256': '3d75021e28026816c51dfe89d31544ac0e4962706f7e461c56ac93f427c54097'
    },
    'dob': '1987-12-02 15:26:08',
    'registered': '2016-05-27 05:26:14',
    'phone': '967-270-696',
    'cell': '676-312-778',
    'id': {
      'name': 'DNI',
      'value': '71458558-U'
    },
    'picture': {
      'large': 'https://randomuser.me/api/portraits/women/52.jpg',
      'medium': 'https://randomuser.me/api/portraits/med/women/52.jpg',
      'thumbnail': 'https://randomuser.me/api/portraits/thumb/women/52.jpg'
    },
    'nat': 'ES'
  },
  {
    'gender': 'female',
    'name': {
      'title': 'miss',
      'first': 'gilcenira',
      'last': 'ribeiro'
    },
    'location': {
      'street': '2157 rua minas gerais ',
      'city': 'tatuí',
      'state': 'roraima',
      'postcode': 73651
    },
    'email': 'gilcenira.ribeiro@example.com',
    'login': {
      'username': 'whitebear434',
      'password': 'blaster',
      'salt': 'JrORuRpq',
      'md5': 'ec4c1c7b1eda639f15d78b4ce5db4952',
      'sha1': 'c7ce835825ea545f947b6969c206b853fa941140',
      'sha256': 'd4e543c05a8af3706d100684d7445ea873dd7f7b9d70ff027446d16bf6a111d5'
    },
    'dob': '1946-09-30 00:33:45',
    'registered': '2011-11-05 04:26:16',
    'phone': '(65) 5067-1618',
    'cell': '(12) 6328-5122',
    'id': {
      'name': '',
      'value': null
    },
    'picture': {
      'large': 'https://randomuser.me/api/portraits/women/21.jpg',
      'medium': 'https://randomuser.me/api/portraits/med/women/21.jpg',
      'thumbnail': 'https://randomuser.me/api/portraits/thumb/women/21.jpg'
    },
    'nat': 'BR'
  },
  {
    'gender': 'female',
    'name': {
      'title': 'ms',
      'first': 'meike',
      'last': 'gruber'
    },
    'location': {
      'street': '7723 lessingstraße',
      'city': 'freyung-grafenau',
      'state': 'sachsen',
      'postcode': 99976
    },
    'email': 'meike.gruber@example.com',
    'login': {
      'username': 'blackpeacock699',
      'password': 'deville',
      'salt': 'W52Mg61R',
      'md5': '322d523c0991889eae4ead1027515e57',
      'sha1': '794f96436166f8753109e616f7996bf901301844',
      'sha256': '12dbf076d8ac68b61891419bc75bb7489920ca044189e7b3e29b7357e0c64174'
    },
    'dob': '1991-02-08 03:37:48',
    'registered': '2015-04-03 14:54:23',
    'phone': '0465-0330971',
    'cell': '0172-9660562',
    'id': {
      'name': '',
      'value': null
    },
    'picture': {
      'large': 'https://randomuser.me/api/portraits/women/87.jpg',
      'medium': 'https://randomuser.me/api/portraits/med/women/87.jpg',
      'thumbnail': 'https://randomuser.me/api/portraits/thumb/women/87.jpg'
    },
    'nat': 'DE'
  },
  {
    'gender': 'female',
    'name': {
      'title': 'miss',
      'first': 'imogen',
      'last': 'cooper'
    },
    'location': {
      'street': '5565 pakowhai road',
      'city': 'wellington',
      'state': 'waikato',
      'postcode': 58509
    },
    'email': 'imogen.cooper@example.com',
    'login': {
      'username': 'tinykoala525',
      'password': 'lassie',
      'salt': 'oQ5Yp6sm',
      'md5': '6ac7269634dc7daadca3dd9067899f2c',
      'sha1': '4a9a1e16c1d64b4b726967b52d3a57f4ae7feb2b',
      'sha256': 'fb9b9a97979348a7d1ac120cf6e54cd934deb8887adf05d18f1510f284870c4f'
    },
    'dob': '1954-12-14 12:17:52',
    'registered': '2015-03-16 04:10:55',
    'phone': '(712)-629-1433',
    'cell': '(874)-921-1200',
    'id': {
      'name': '',
      'value': null
    },
    'picture': {
      'large': 'https://randomuser.me/api/portraits/women/31.jpg',
      'medium': 'https://randomuser.me/api/portraits/med/women/31.jpg',
      'thumbnail': 'https://randomuser.me/api/portraits/thumb/women/31.jpg'
    },
    'nat': 'NZ'
  },
  {
    'gender': 'female',
    'name': {
      'title': 'ms',
      'first': 'سارا',
      'last': 'یاسمی'
    },
    'location': {
      'street': '7937 سپهبد قرنی',
      'city': 'گلستان',
      'state': 'سیستان و بلوچستان',
      'postcode': 78806
    },
    'email': 'سارا.یاسمی@example.com',
    'login': {
      'username': 'bigfrog518',
      'password': 'eric',
      'salt': '2tc52PhH',
      'md5': 'ad778c7e70d3a431943656856159c900',
      'sha1': '4e8712c01d17627c19b8bd53a3d713b4880d021a',
      'sha256': '103d24e4c9202893fcf6d7ad69258afecf466edbdd31ef690bd1cbf6401034ac'
    },
    'dob': '1974-08-10 00:29:28',
    'registered': '2005-03-06 23:01:33',
    'phone': '082-48757186',
    'cell': '0959-999-9204',
    'id': {
      'name': '',
      'value': null
    },
    'picture': {
      'large': 'https://randomuser.me/api/portraits/women/78.jpg',
      'medium': 'https://randomuser.me/api/portraits/med/women/78.jpg',
      'thumbnail': 'https://randomuser.me/api/portraits/thumb/women/78.jpg'
    },
    'nat': 'IR'
  },
  {
    'gender': 'male',
    'name': {
      'title': 'mr',
      'first': 'lloyd',
      'last': 'cox'
    },
    'location': {
      'street': '6720 richmond park',
      'city': 'dublin',
      'state': 'sligo',
      'postcode': 77076
    },
    'email': 'lloyd.cox@example.com',
    'login': {
      'username': 'blueswan540',
      'password': 'sean',
      'salt': 'mF2Dn50S',
      'md5': '8b16d9242d254136afec0bff0f0f7e86',
      'sha1': '2ccf210b54d2885fcc59683a881247b1376be4c3',
      'sha256': 'dfe513965d4629fc85e7ae46bdacea3ee8a9eb4412824a503c9d6be3baf6dfde'
    },
    'dob': '1968-03-22 14:06:26',
    'registered': '2006-09-12 20:00:36',
    'phone': '031-884-5823',
    'cell': '081-362-6864',
    'id': {
      'name': 'PPS',
      'value': '8981563T'
    },
    'picture': {
      'large': 'https://randomuser.me/api/portraits/men/85.jpg',
      'medium': 'https://randomuser.me/api/portraits/med/men/85.jpg',
      'thumbnail': 'https://randomuser.me/api/portraits/thumb/men/85.jpg'
    },
    'nat': 'IE'
  },
  {
    'gender': 'male',
    'name': {
      'title': 'mr',
      'first': 'toni',
      'last': 'linke'
    },
    'location': {
      'street': '1321 beethovenstraße',
      'city': 'hoyerswerda',
      'state': 'rheinland-pfalz',
      'postcode': 54734
    },
    'email': 'toni.linke@example.com',
    'login': {
      'username': 'redrabbit654',
      'password': 'caught',
      'salt': '79jV4Gu2',
      'md5': 'fd68fe5bfff1c327634bcd6f6bdca97c',
      'sha1': '8aa79797a345fee0246f675688932021d84a983c',
      'sha256': '0e2b6058dcabc534ca911561857b924541b05f6585ef71be44d18f2fc02afa65'
    },
    'dob': '1981-10-01 20:22:26',
    'registered': '2015-11-13 06:19:40',
    'phone': '0526-4585630',
    'cell': '0172-6948090',
    'id': {
      'name': '',
      'value': null
    },
    'picture': {
      'large': 'https://randomuser.me/api/portraits/men/99.jpg',
      'medium': 'https://randomuser.me/api/portraits/med/men/99.jpg',
      'thumbnail': 'https://randomuser.me/api/portraits/thumb/men/99.jpg'
    },
    'nat': 'DE'
  },
  {
    'gender': 'female',
    'name': {
      'title': 'miss',
      'first': 'alana',
      'last': 'teixeira'
    },
    'location': {
      'street': '1023 rua doze ',
      'city': 'mogi das cruzes',
      'state': 'amazonas',
      'postcode': 21282
    },
    'email': 'alana.teixeira@example.com',
    'login': {
      'username': 'redleopard344',
      'password': '2626',
      'salt': 'MI2mUvMc',
      'md5': 'b9b7a5fe56e2c5437d84b1fd611338f8',
      'sha1': '1ecde42f4054945e596ccdaf0468e697be931810',
      'sha256': '951a2f686a518256c4e63b78a9b2e27e43bcb9506e8e174fc408275606a1f025'
    },
    'dob': '1969-09-10 14:35:27',
    'registered': '2013-01-14 04:53:37',
    'phone': '(39) 0958-0470',
    'cell': '(11) 1647-7165',
    'id': {
      'name': '',
      'value': null
    },
    'picture': {
      'large': 'https://randomuser.me/api/portraits/women/17.jpg',
      'medium': 'https://randomuser.me/api/portraits/med/women/17.jpg',
      'thumbnail': 'https://randomuser.me/api/portraits/thumb/women/17.jpg'
    },
    'nat': 'BR'
  },
  {
    'gender': 'female',
    'name': {
      'title': 'mrs',
      'first': 'maria',
      'last': 'ramos'
    },
    'location': {
      'street': '8636 avenida de burgos',
      'city': 'córdoba',
      'state': 'país vasco',
      'postcode': 65862
    },
    'email': 'maria.ramos@example.com',
    'login': {
      'username': 'orangetiger492',
      'password': '626262',
      'salt': 'x4RfPHHo',
      'md5': '4acd438891472f4b11a9140a3b7f7a3f',
      'sha1': 'a1d71d83e48bbf5c27a3881c8824f2afe6c10997',
      'sha256': 'ef3d0b4f566f6a491a824afbd3076e278d125a932e7ddafd59c4e6f3d7eec53b'
    },
    'dob': '1969-08-19 18:35:29',
    'registered': '2003-05-23 12:03:09',
    'phone': '998-656-805',
    'cell': '645-442-124',
    'id': {
      'name': 'DNI',
      'value': '04266623-P'
    },
    'picture': {
      'large': 'https://randomuser.me/api/portraits/women/74.jpg',
      'medium': 'https://randomuser.me/api/portraits/med/women/74.jpg',
      'thumbnail': 'https://randomuser.me/api/portraits/thumb/women/74.jpg'
    },
    'nat': 'ES'
  }];
}
